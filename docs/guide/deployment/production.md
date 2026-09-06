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

> 双实例/多副本集群部署是**商业版（GFlow Platform）能力**，不使用此 compose，完整步骤见仓库 `docs/deploy/deployment.md` 第七节。

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

## 集群部署（商业版）

GFlow Platform 支持多实例 active-active 集群部署：同一份代码同时支持单机与多副本，单机行为不变；任一副本崩溃，在途流程自动救援，服务不断。适用于滚动发布不中断、单进程故障自动恢复的场景（同机双进程形态；防的是进程级故障，不防整机故障）。

集群形态下平台自动处理跨副本一致性：

| 能力 | 说明 |
|---|---|
| 集群选主 | Redis 租约选主，恢复/巡检类后台任务只在 leader 执行 |
| 跨副本执行互斥 | 流程实例级分布式门闩（持锁续期），与 DB 行锁双层兜底 |
| 卡死实例自动救援 | 副本崩溃后在途实例与超期延迟任务由 leader 巡检自动重驱（≤7 分钟），连续失败转人工告警 |
| 定时任务恰好一次 | 定时规则链按「计划触发时刻」分布式去重，misfire 跳过不补跑 |
| 通知实时跨副本 | WebSocket 推送经 Redis 广播，负载均衡无须粘性会话 |
| 配置热生效 | 规则链 / LLM 供应商变更广播失效，各副本秒级重载，无须重启 |
| 雪花 ID 防撞 | machine_id 启动注册制，冲突拒绝启动并报出持有者 |
| 文件存储三选一 | local（同机共享路径 / NFS）、s3（MinIO 自建或云 S3）、oss（阿里云别名） |

依赖：共享 PostgreSQL/MySQL + Redis（建议开 AOF 持久化）+ 前置负载均衡（HTTP 健康检查）。部署清单（Redis 配置与降级语义、存储切换、存量库唯一约束、开机自启、验证项）见仓库 `docs/deploy/deployment.md` 第七节。引擎开源版内嵌分布式锁与救援原语，但集群编排（选主 / 巡检 / 广播 / 存储切换）需自行搭建。

## 生产清单

- [ ] 修改 `JWT_SECRET`、数据库口令，勿用默认值
- [ ] PostgreSQL 生产实例 + 定期备份（历史表只增不减）
- [ ] HTTPS：nginx 前置证书
- [ ] 多副本集群部署时 `cache.global.type: redis` + `cluster.enabled: true`（分布式门闩、选主、WS 广播、token 黑名单共用该 Redis；Redis 建议 AOF），详见仓库部署文档第七节
- [ ] 日志收集；`logs/` 目录磁盘水位告警
- [ ] 演示/生产账号分离，管理员开启操作审计

## 数据库初始化

- **GFlow Platform**：postgres 容器首启自动按序执行 `scripts/engine/00.init_bpm_pg.sql`（引擎 7 张表）与 `scripts/00.init_pg.sql`（应用系统表 + 种子）；裸机部署用 `make db-init`（scripts/init-db.sh）完成同样动作——**程序启动不建核心表，两个脚本缺一不可**
- **仅引擎**：执行 gflow-engine 的 `scripts/00.init_bpm_pg.sql` / `00.init_bpm_mysql.sql`
- **非内置数据库（达梦、人大金仓等）**：经 `DialectProvider` 扩展接入，见[自定义数据库方言](/guide/deployment/custom-dialect)

## 环境要求

见[环境要求](/guide/getting-started/requirements)。演示环境参考：1.9G 内存云主机运行 gflow 全栈稳定。
