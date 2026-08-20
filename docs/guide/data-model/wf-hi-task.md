# wf_hi_task 历史任务表

<div class="lead">
已结束任务的归档。多一个灵魂字段：variables 保存任务结束瞬间的表单快照——历史单据「当时长什么样」永久可查。
</div>

## 表结构

字段与 [wf_task](/guide/data-model/wf-task) 同构，关键差异：

| 字段 | 说明 |
|---|---|
| `variables` | **结束瞬间快照**——审批时表单长什么样，就留什么样 |
| `comment` | 处理意见（「同意，注意假期交接」） |
| `end_reason` | 完成/退回/终止原因 |
| `duration` | 任务耗时（毫秒）——环节效率分析 |
| `assignee` | 最终办理人 |
| `delegate_*` | 委托快照（若有） |

会签的每个参与任务、加签产生的子任务，结束后都在这里各占一行，`parent_id + sequence_order` 保留链路结构。

## 快照的价值

审批详情页展示历史单据时，读的是**当时**的变量值，不是当前值——即使后续流程改过变量、组织架构换过人，历史记录不变。这是审计合规的底线要求。

## 典型查询

```sql
-- 某实例完整审批轨迹（含会签/加签链）
SELECT task_def_key, name, assignee, status, comment, ended_at, duration
FROM wf_hi_task
WHERE process_instance_id = '...'
ORDER BY created_at;

-- 各环节平均停留时长（找瓶颈）
SELECT task_def_key, name,
       COUNT(*) AS cnt,
       ROUND(AVG(duration) / 3600000.0, 1) AS avg_hours
FROM wf_hi_task
WHERE ended_at > NOW() - INTERVAL '30 days'
GROUP BY task_def_key, name
ORDER BY avg_hours DESC;

-- 某人近一年审批量
SELECT COUNT(*) FROM wf_hi_task
WHERE assignee = 'u_zhangwei' AND ended_at > NOW() - INTERVAL '1 year';
```

## 与运行时的关系

```
wf_task（进行中） ──任务结束──▶ wf_hi_task（归档，补 comment/duration/快照）
     ▲ 整实例结束时：wf_instance → wf_hi_instance，任务行整体迁移
```

::: tip 返回[数据模型总览](/guide/data-model/)
