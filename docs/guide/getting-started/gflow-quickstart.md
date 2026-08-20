# GFlow 极风工作流平台体验

<div class="lead">
不写一行代码，从表单设计到审批盖章完整走一遍。两种方式：在线演示环境（5 分钟），或本地跑一套（30 分钟）。
</div>

## 方式一：在线演示环境（推荐先逛）

成品演示环境已初始化好组织架构与示例流程：

- **地址**：<http://8.134.32.225:8081>
- **管理员**：`admin / admin123`
- **演示员工**：`wangqiang / demo123456`、`zhangwei / demo123456`（走不同审批路径）

### 建议体验路径

1. **发起审批**：用 wangqiang 登录 → 审批中心 → 发起「请假申请」，填 2 天提交（走短路径）或 5 天（走多级会签路径）。
2. **设计器**：切 admin → 工作流 → 流程设计：新建流程 → 表单设计（拖字段）→ 下一步 → 流程设计器（加审批/条件/抄送/AI 节点）→ 发布。
3. **待办审批**：切 lina（技术部主管）登录 → 待办 → 通过/驳回/加签，观察任务父子链与流转记录（zhangwei 是技术部发起人，走发起视角）。
4. **流程跟踪**：回到发起人视角，查看实例的节点轨迹、耗时、表单快照。
5. **监控与统计**：审批统计大盘、任务监控。

> 演示环境数据会定期重置，可以随便造。

## 方式二：本地部署（二进制直启）

```bash
# 1. 准备 PostgreSQL，创建 gflow 库并执行初始化脚本
#    注意：引擎 7 张 wf_* 表在 scripts/engine/00.init_bpm_pg.sql（程序启动不建表，两条都要执行）
psql -U postgres -c "CREATE DATABASE gflow"
psql -U postgres -d gflow -f gflow/scripts/engine/00.init_bpm_pg.sql
psql -U postgres -d gflow -f gflow/scripts/00.init_pg.sql

# 2. 构建嵌入前端的单二进制（先构建前端再 go build -tags embed）
cd gflow && make release        # 产出 dist/gflow-server

# 3. 修改 configs/config.yaml 里的数据库连接（dsn），然后在 gflow 目录启动
./dist/gflow-server             # 监听 :8080，自动读取 configs/config.yaml
```

> 也可以用 `make db-init`（内部执行 scripts/init-db.sh，自动定位引擎脚本）或 Docker Compose（postgres 容器首启自动按序执行两个脚本）完成建库。

浏览器打开 `http://localhost:8080/gflow/`，默认账号 `admin / admin123`。Docker Compose 部署见[部署指南](/guide/deployment/production)。

## 登录后的第一件事：配一个流程

gflow 的设计目标是：**业务管理员 30 分钟内独立配置出一个 3-5 节点的审批流**。

1. **基础设置**：流程名、图标、分类（如「人事」）
2. **表单设计**：自研 gform-designer，拖入请假类型/起止日期/事由等字段，可设必填与默认值；也可以从模板库套用现成模板
3. **流程设计**：树形可视化设计器
   - 发起人节点：全员或指定范围
   - 审批节点：选「直属主管」或指定成员，配或签/会签
   - 条件分支：点开分支头配置条件，候选变量自动联想表单字段（`msg.days`）与引擎元数据（`metadata.process_key` 等），记得勾一条「默认分支」兜底
   - 可加抄送 / 自动化 / 子流程 / 延迟等待 / 服务任务 / HTTP 调用 / 智能体节点
4. **发布**：版本自动 +1，存量实例继续跑旧版本

详细操作见[可视化流程设计器](/guide/features/designer)。
