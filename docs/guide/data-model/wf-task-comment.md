# wf_task_comment 任务处理意见

<div class="lead">
引擎里唯一的「留言簿」：审批意见一条一行、只增不改。任务行完结迁入历史表之后，意见原地可查、可追加——留痕是独立的时间线，不随任务搬家。
</div>

## 表结构

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | VARCHAR(36) PK | 主键 |
| `task_id` | VARCHAR(36) | 关联 `wf_task.id`（任务归档后仍可评论/查询） |
| `process_instance_id` | VARCHAR(36) | 流程实例 ID，按实例拉全流程意见流 |
| `tenant_id` | VARCHAR(100) | 租户 ID |
| `user_id` | VARCHAR(64) | 评论人 ID |
| `user_name` | VARCHAR(100) | 评论人姓名（冗余存储，避免联表） |
| `content` | TEXT | 评论内容 |
| `created_at` | TIMESTAMPTZ | 创建时间 |

索引：`task_id`、`tenant_id`。

## 为什么意见不放在任务行上

`wf_task.comment` 只存最后一次办理的结论性意见，随任务归档快照进 `wf_hi_task`。但一条任务的生命周期里往往不止一条意见：会签每人各留一条、被加签的人也要表态、驳回重办再来一轮——这是一条不断追加的时间线，单个字段装不下。

所以意见独立成表：**一条意见一行**，谁（`user_id` / `user_name`）、什么时候（`created_at`）、说了什么（`content`），按 `task_id` 挂靠。只增不改，历史意见永远不会被后续办理覆盖。

## 任务归档后仍可读写

运行表的数据完结后会整行迁入 `wf_hi_*`，而 `wf_task_comment` 是持久表：`task_id` 只是逻辑关联，任务行搬走，意见原地不动。查已办详情时照常读取，事后补充评论也没问题。要看整个流程的审批轨迹，用 `process_instance_id` 一次拉全。

## 使用示例

```sql
-- 某任务的全部意见（按时间正序）
SELECT user_name, content, created_at
FROM wf_task_comment
WHERE task_id = '...'
ORDER BY created_at;

-- 某流程实例的完整审批意见流
SELECT task_id, user_name, content, created_at
FROM wf_task_comment
WHERE process_instance_id = '...'
ORDER BY created_at;
```

::: tip 返回[数据模型总览](/guide/data-model/)
