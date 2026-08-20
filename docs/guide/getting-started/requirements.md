# 环境要求

## 引擎（GFlow Engine）

| 依赖 | 要求 |
|---|---|
| Go | 1.24+ |
| RuleGo | v0.37+ |
| 数据库 | PostgreSQL / MySQL 内置；其它数据库（达梦、人大金仓等）经 DialectProvider 扩展接入，见[自定义数据库方言](/guide/deployment/custom-dialect)。单元测试经自定义方言跑 SQLite 内存库，可不装数据库 |

## 平台（gflow）

| 依赖 | 要求 |
|---|---|
| 操作系统 | Linux / Windows / macOS（Go 交叉编译随便换） |
| Go | 1.25+（源码编译服务端） |
| Node.js | ≥ 20.19（Vite 7 下限；推荐 24.x）。前端仓库 gflow-ui 使用 pnpm（preinstall 强制校验，用 npm 会直接失败） |
| 数据库 | PostgreSQL（生产推荐）或 MySQL；国产数据库等经方言扩展接入，见[自定义数据库方言](/guide/deployment/custom-dialect) |
| 硬件 | 2C2G 起步即可运行（演示环境 1.9G 内存的云主机跑得很稳） |
| 可选 | Redis（多实例部署时的分布式锁） |

## 端口

- gflow 服务端默认 `:8080`（REST API；`make release` 的嵌入版单二进制同时托管前端静态资源）
- 前端开发模式（二开时）`:9521`
