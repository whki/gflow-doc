# 自定义数据库方言

<div class="lead">
GFlow 内置 PostgreSQL 与 MySQL；达梦、人大金仓、GaussDB 等数据库通过 <code>DialectProvider</code> 扩展点接入：实现三个方法、一处注册、改一行配置，无需改动任何连接逻辑。扩展驱动须为纯 Go 实现，不引入 CGO/GCC 依赖。
</div>

## 支持范围

| 数据库 | 状态 | driver 别名 |
|---|---|---|
| PostgreSQL | 内置 | `postgres`、`postgresql` |
| MySQL | 内置 | `mysql` |
| 达梦、人大金仓、GaussDB、OceanBase 等 | 经方言扩展接入 | 由自定义 Provider 决定 |

两类产品共用同一套扩展机制：

- **GFlow Engine（开源引擎库）**：`service.DialectProvider` 接口 + 全局方言注册表，可运行示例见仓库 `gflow-engine/examples/custom_dialect`；
- **GFlow Platform（gflow 主应用）**：数据库连接统一走引擎的方言注册表，扩展入口透传为 `internal/database.RegisterDialectProvider`。

## 原理

引擎包内维护一张全局 `DialectRegistry`：import 引擎 `service` 包时自动注册内置的 postgres / mysql 方言；主应用 `InitDatabase` 拿到配置中的 `driver` 后向注册表解析出 GORM `Dialector`，再建连接。未知驱动直接报错，不会静默回退。

```
config.yaml (driver=dm) → RegisterDialectProvider 注册的 Provider → gorm.Dialector → gorm.Open
```

## 接入步骤（以达梦为例，gflow 主应用）

gflow 是单二进制应用，注册代码需要进入你自己的构建（fork 仓库后按下述步骤加入一个文件再编译）。

### 1. 引入纯 Go 的 GORM 驱动

以达梦官方或社区提供的 GORM 驱动为准（须确认无 CGO 依赖）：

```bash
cd gflow && go get your-dm-driver-module
```

### 2. 实现 DialectProvider 并注册

在 `gflow/internal/database/` 下新增一个文件（如 `dialect_dameng.go`）：

```go
package database

import (
	dm "your-dm-driver-module" // 达梦的纯 Go GORM 驱动
	"gorm.io/gorm"
)

type damengDialectProvider struct{}

func (d *damengDialectProvider) GetName() string { return "dameng" }

func (d *damengDialectProvider) CreateDialector(dsn string) (gorm.Dialector, error) {
	return dm.Open(dsn), nil
}

func (d *damengDialectProvider) GetSupportedDrivers() []string {
	return []string{"dm", "dameng"}
}

// 必须在 InitDatabase 之前完成注册
func init() { _ = RegisterDialectProvider(&damengDialectProvider{}) }
```

### 3. 修改配置

```yaml
database:
  driver: dm   # 或 dameng，取 GetSupportedDrivers 中任一别名
  dsn: dm://username:password@localhost:5236/SYSDBA
```

### 4. 重新编译

```bash
cd gflow && CGO_ENABLED=0 make build
```

## 仅使用 GFlow Engine（库形态）

引擎库的接入方式更直接，两种注册方式任选：

```go
// 方式一：构建器注入（仅当前引擎实例生效）
engine, err := service.NewWorkflowEngineBuilder().
    SetConfig(cfg).
    SetDialectProvider(&DamengDialectProvider{}).
    Build()

// 方式二：全局注册表（进程内生效，建议放在 init()）
err := service.RegisterDialectProvider(&DamengDialectProvider{})
```

完整可运行示例见仓库 `gflow-engine/examples/custom_dialect`（含达梦、人大金仓的 Provider 骨架）。

## 约束与注意事项

1. **驱动必须纯 Go（无 CGO）**。gflow 保持 `CGO_ENABLED=0` 可构建、无需 GCC、可交叉编译；引入任何 CGO 驱动都会破坏这一点。反例：`gorm.io/driver/sqlite` 基于 mattn/go-sqlite3（需 GCC）；纯 Go 替代是 `github.com/glebarez/sqlite`。
2. **SQL 兼容性需自行验证**。gflow 的建表脚本 `scripts/00.init_pg.sql` 与增量迁移 `internal/migrations` 针对 MySQL/PostgreSQL 编写，其中用到 `CONCAT`、`CAST(... AS CHAR)`、`row_number() OVER` 等语法；接入新数据库时需在目标库逐条验证，必要时改写。达梦、金仓提供 MySQL/PG 兼容模式，可显著降低适配成本。
3. **SQLite 未内置，请勿在主应用配置 `driver: sqlite`**。建表与迁移 SQL 不兼容 SQLite；引擎单元测试通过自注册纯 Go SQLite 方言跑内存库，属测试专用路径。

## 常见问题

**启动报 `unsupported database driver "xxx"`**

配置的 `driver` 在注册表中无匹配：检查拼写与大小写（匹配是精确的）、Provider 的 `GetSupportedDrivers()` 是否包含该别名、注册是否发生在 `InitDatabase` 之前（建议 `init()`）。报错信息同时会列出内置驱动与扩展入口提示。

**报 `dialect provider 'xxx' is already registered`**

方言名称重复：`GetName()` 返回值在注册表内必须唯一，内置的 `postgres`、`mysql` 已被占用。
