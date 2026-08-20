# wf_process 流程定义表

<div class="lead">
流程定义主表：每个发布版本一行，DSL 全文存在 definition_json 里。同一 process_key 按 version 递增保留多个版本。
</div>

## 表结构

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID 主键 |
| `process_key` | VARCHAR(100) | 流程键（业务唯一标识，如 `leave_approval`） |
| `name` | VARCHAR(200) | 流程名称（如「请假审批」） |
| `version` | INTEGER | 版本号，从 1 递增 |
| `category` | VARCHAR(100) | 分类（权限/报表筛选用） |
| `description` | VARCHAR(500) | 流程描述 |
| `definition_json` | TEXT | **流程定义 DSL**（ruleChain + metadata 全文） |
| `status` | VARCHAR(20) | `active` 生效 / `retired` 已停用（保存的草稿副本为 `draft`） |
| `publish_time` | TIMESTAMPTZ | 版本发布时间 |
| `icon` | VARCHAR(200) | 流程图标 |
| `process_type` | VARCHAR(20) | `main` 主流程 / `sub` 子流程 |
| `tenant_id` | VARCHAR(100) | 租户 ID |
| `created_by / created_at / updated_by / updated_at` | — | 审计四件套 |
| `ext` | TEXT | 结构化扩展字段（JSON） |

唯一索引：`(process_key, version)` —— 同一 key 的每个版本各占一行。

## 版本化语义

- **发布新版本**：`version + 1` 插入新行，同一事务内将同 key 的旧 `active` 版本自动置 `retired`——**同一 process_key 同一时刻仅一个 active 版本**
- **发起实例**：`wf_instance.process_id` 指向**具体版本行**的 id，所以存量实例永远跑发起时的那个版本，改流程不影响在途单据
- **停用**：置 `retired`，不可再发起，存量实例跑完为止

## definition_json 里有什么

引擎兼容两种格式：设计器产出的 envelope 包裹结构（`form` / `flow` / `ruleChain` / `metadata` 四键）与旧式扁平 RuleChain 格式（顶层 `ruleChain` + `metadata`）。核心内容一致：

- `ruleChain.additionalInfo`：表单 schema、分类、图标、`processType`
- `metadata.nodes`：节点（`userTask` / `switch` / `serviceTask` / `end`…）及其 `configuration`（审批人、会签规则）与 `additionalInfo`（动作权限、字段权限）
- `metadata.connections`：流转边

详见[流程 DSL 规范](/guide/dsl)。gflow 设计器的所有可视化配置，最终都落在这一个字段里。

## 常用查询

```sql
-- 某 key 的全部版本
SELECT version, status, publish_time, created_by
FROM wf_process WHERE process_key = 'leave_approval'
ORDER BY version DESC;

-- 当前生效版本
SELECT * FROM wf_process
WHERE process_key = 'leave_approval' AND status = 'active'
ORDER BY version DESC LIMIT 1;
```

::: tip 返回[数据模型总览](/guide/data-model/)
