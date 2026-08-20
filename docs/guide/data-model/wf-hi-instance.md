# wf_hi_instance 历史流程实例表

<div class="lead">
实例结束瞬间的归档：结构与 wf_instance 一致，补记耗时与结论。报表和审计在这里做，不拖累运行时。
</div>

## 表结构

字段与 [wf_instance](/guide/data-model/wf-instance) 完全同构，另有三个「只有结束才有意义」的字段被补全：

| 字段 | 说明 |
|---|---|
| `ended_at` | 流程结束时间 |
| `duration` | 运行时长（毫秒）——耗时分析的核心指标 |
| `end_reason` | 结束原因：正常完成的说明，或终止/撤回/失败的具体原因（含错误信息） |

## 归档语义

- **迁移而非复制**：实例结束时行从 `wf_instance` 移除、插入本表
- 运行表因此永远只含「进行中」的实例，保持小而热
- 历史表只增不改，是天然的审计流水

## 索引（面向报表与审计）

- `tenant_id` / `status` / `business_key` / `parent_id`
- `created_at DESC` / `ended_at DESC` —— 时间区间报表
- `duration` —— 耗时排名（找出最慢的流程/环节）

## 典型查询

```sql
-- 各流程平均耗时（近 30 天）
SELECT p.process_key, p.name,
       COUNT(*) AS total,
       ROUND(AVG(h.duration) / 1000.0, 1) AS avg_seconds
FROM wf_hi_instance h
JOIN wf_process p ON p.id = h.process_id
WHERE h.ended_at > NOW() - INTERVAL '30 days'
GROUP BY p.process_key, p.name
ORDER BY avg_seconds DESC;

-- 被终止/撤回的实例及原因（撤回实例状态为 terminated，end_reason 记「申请人撤回」）
SELECT name, status, end_reason, ended_at
FROM wf_hi_instance
WHERE status IN ('terminated', 'failed')
ORDER BY ended_at DESC;
```

## 数据治理

历史表只增不减，长期运行建议：

- 按业务保留策略定期归档冷数据（如 3 年前转储）
- 报表加物化视图，避免大扫描
- 需要强合规留痕的行业，直接全量保留——表结构简单，存储成本可控

::: tip 返回[数据模型总览](/guide/data-model/)
