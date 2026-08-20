# 部署指南

<div class="lead">
gflow 是 Go 单二进制 + 前端静态资源，2C2G 起步即可。Docker Compose 一键起全栈，或 systemd 裸机部署。
</div>

## Docker Compose 一键部署（推荐）

```bash
cd gflow

# 1. 构建后端（预编译二进制）+ 前端镜像
make docker-build

# 2. 配置环境变量（至少改 JWT_SECRET / POSTGRES_PASSWORD）
cp .env.example .env && vi .env

# 3. 启动全栈
docker compose up -d
```

compose 拉起四个服务：

| 服务 | 说明 |
|---|---|
| `postgres` | 首次启动自动按序执行引擎建表脚本 `00.init_bpm_pg.sql`（7 张 wf_* 表）+ `00.init_pg.sql`（宿主表 + 种子数据） |
| `redis` | 缓存与（多实例时）分布式锁 |
| `backend` | gflow-server（REST API，不直接对外暴露） |
| `frontend`(nginx) | 前端静态资源 + 入口反代 |

访问 `http://localhost/gflow/`，默认账号 **admin / admin123**（首次登录改密）。

> 双实例 active-active 高可用部署不使用此 compose，见仓库 `docs/deploy/deployment.md` 第七节。

## 裸机 / systemd

```bash
# 后端：Go 编译单二进制。make build 为 API-only 版（不嵌入前端，前端走外部 nginx）；
# 需要单二进制全栈时用 make release（先构建前端再 go build -tags embed 嵌入）
cd gflow && make build          # 产出 dist/gflow-server
./dist/gflow-server             # 在 gflow 目录运行，自动读取 configs/config.yaml

# 前端：构建产物由 nginx 托管（含 base 路径的构建走 make web）
cd gflow && make web            # 内部执行 vite build，产物在 gflow-ui/dist
```

`deploy/systemd/` 提供服务单元模板；`deploy/nginx/` 提供前端反代配置。服务端默认监听 `:8080`。

## 生产清单

- [ ] 修改 `JWT_SECRET`、数据库口令，勿用默认值
- [ ] PostgreSQL 生产实例 + 定期备份（历史表只增不减）
- [ ] HTTPS：nginx 前置证书
- [ ] 多实例部署时启用 Redis 分布式锁（`WorkflowEngineBuilder.SetLocker` 注入），对流程实例行级互斥
- [ ] 日志收集；`logs/` 目录磁盘水位告警
- [ ] 演示/生产账号分离，管理员开启操作审计

## 数据库初始化

- **GFlow Platform**：postgres 容器首启自动按序执行 `scripts/engine/00.init_bpm_pg.sql`（引擎 7 张表）与 `scripts/00.init_pg.sql`（应用系统表 + 种子）；裸机部署用 `make db-init`（scripts/init-db.sh）完成同样动作——**程序启动不建核心表，两个脚本缺一不可**
- **仅引擎**：执行 gflow-engine 的 `scripts/00.init_bpm_pg.sql` / `00.init_bpm_mysql.sql`
- **非内置数据库（达梦、人大金仓等）**：经 `DialectProvider` 扩展接入，见[自定义数据库方言](/guide/deployment/custom-dialect)

## 环境要求

见[环境要求](/guide/getting-started/requirements)。演示环境参考：1.9G 内存云主机运行 gflow 全栈稳定。
