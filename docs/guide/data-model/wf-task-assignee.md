# wf_task_assignee 任务候选人池

<div class="lead">
最小的一张表，却解决了组织架构与任务解耦的问题：只存原始引用（角色/部门），查询时经 IdentityService 展开——组织架构调整，待办归属实时生效。
</div>

## 表结构

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | VARCHAR(32) PK | 主键 |
| `task_id` | VARCHAR(36) | 关联 `wf_task.id` |
| `entity_type` | VARCHAR(20) | `role`（默认）/ `department` / `person` |
| `entity_id` | VARCHAR(64) | roleId / deptId / userId |
| `tenant_id` | VARCHAR(100) | 租户 ID |
| `created_at` | TIMESTAMPTZ | 创建时间 |

索引：`task_id`、`(entity_type, entity_id)`、`tenant_id`。

## 为什么不冗余展开用户

假设「财务部角色」有 50 个候选人，常见做法是任务创建时把 50 个 user_id 全部写进关联表。问题：

- 组织架构调整（调岗/离职）后，已创建任务的候选列表过期，需要同步刷新
- 部门规模大时写入放大明显

GFlow Engine 的做法：**只存 `role:finance` 这一条原始引用**。查询「谁能办这个任务」时，经 `IdentityService.GetUserIDsByRoleID(tenantId, 'finance')` 实时展开：

```
我的待办 = (wf_task.assignee = 我)
         ∪ (wf_task_assignee 中 entity_type=person 且 entity_id=我)
         ∪ (entity_type=role 且 我的角色 ∈ 展开(entity_id))
         ∪ (entity_type=department 且 我的部门 ∈ 展开(entity_id))
```

组织架构怎么变，待办归属立即正确。

## 与签收/抢单的配合

角色/部门候选任务对所有候选人可见，先签收者得：

1. 任一候选人在列表点「签收」→ `wf_task.assignee` 写入该用户、`claimed_at` 记时间
2. 其他人列表里该任务消失
3. 之后走正常办理流程

## 使用示例

```sql
-- 某任务的全部候选引用
SELECT entity_type, entity_id
FROM wf_task_assignee WHERE task_id = '...';

-- 找出挂在我角色上的待办（应用层展开 role → userIDs 后）
SELECT t.* FROM wf_task t
JOIN wf_task_assignee a ON a.task_id = t.id
WHERE a.entity_type = 'person' AND a.entity_id = 'u_wangqiang';
```

::: tip 返回[数据模型总览](/guide/data-model/)
