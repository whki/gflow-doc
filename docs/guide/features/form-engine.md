# 表单引擎

<div class="lead">
自研 gform-designer 表单设计器 + 运行时渲染引擎。表单 schema 内嵌于流程 DSL，一份 schema 驱动发起填写、审批回显、字段权限三种视图。
</div>

## 设计器能力

拖拽式配置，右侧属性面板实时预览：

- **字段类型**（29 种）：单行/多行文本、数字、金额、密码、单选/多选、下拉（静态/字典/API 数据源）、日期/日期区间、开关、上传、图片、部门/成员/多成员选择、级联、子表（明细）、富文本、签名、定位、流水号、身份证、手机号、栅格/卡片/标签页/分隔符/警告等布局件
- **校验**：必填、长度、数值范围、正则、跨字段校验、公式计算
- **联动**：显隐联动（visibleWhen / disabledWhen）
- **公式字段**：`formula` 声明后字段转为只读，值由依赖字段实时算出并随提交写入流程变量（如请假天数 `DATEDIFF(endTime, startTime) + 1`）；支持四则/比较/逻辑运算、`SUM/AVG/MAX/MIN/COUNT/ROUND/ABS/IF/CONCAT/LEN/UPPER/LOWER/DATEDIFF` 函数；依赖缺失时空值传播（不会把 null 当 0 算出假值）
- **布局**：栅格 span、标签位置、标签宽度
- **默认值**：静态值或表达式
- **模板库**：常用审批单（请假/报销/采购/用章）保存为模板，新流程一键套用；模板也可以通过 `formKey` 引用共享

表单 schema 存在流程 DSL 的 `ruleChain.additionalInfo.form`：

```json
{
  "ruleChain": {
    "additionalInfo": {
      "formType": "design",
      "form": {
        "title": "请假申请单",
        "fields": [
          {
            "id": "f_leave_type",
            "type": "select",
            "label": "请假类型",
            "field": "leaveType",
            "dataSource": { "type": "static", "options": [ /* … */ ] },
            "validate": { "required": true }
          },
          {
            "id": "f_leave_days",
            "type": "number",
            "label": "请假天数",
            "field": "days",
            "validate": { "required": true },
            "formula": "DATEDIFF(endTime, startTime) + 1"
          }
        ]
      }
    }
  }
}
```

## 运行时渲染

同一份 schema 服务三个场景：

1. **发起**：按 schema 渲染填写表单，校验通过后字段值装入流程变量 `msg`
2. **审批回显**：详情页按「当前节点 + 字段权限」渲染只读/可编辑视图，`msg` 值自动回填
3. **打印/归档**：任务结束瞬间的 `variables` 快照留在 `wf_hi_task`，历史单据永久可查

## 与流程的联动

- **条件路由**：设计器条件抽屉自动联想表单字段（`msg.days`），见[流程设计器](/guide/features/designer)
- **字段权限**：`userTask` 的 `additionalInfo.formPermissions` 按字段 key 控制三种视图的可见/可编辑
- **模板引用**：`formKey` 指向 `forms` 表里的模板（`code / name / schema_json`），多个流程共享一份表单定义，改一处全部生效

## 外部表单

已有业务系统表单？`formType: "external"` + 表单模板的 PC 端 URL 直接挂接现有页面：发起时 iframe 嵌入填写、postMessage 回传数据，审批时以只读数据表回显——引擎只管流程，不抢你的表单。完整接入协议与教程见[外部表单](/guide/features/external-form)。
