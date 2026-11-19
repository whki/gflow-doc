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

## 数据源与输入联想

下拉 / 单选 / 多选 / 级联的数据来源有三种，在设计器属性面板「数据源」切换：

| 类型 | 配置 | 适用 |
| --- | --- | --- |
| **静态** | 手工维护选项列表（标签 / 值 / 默认选中） | 选项固定且少，如请假类型 |
| **字典** | 填字典编码，选项来自系统管理 → 字典管理 | 选项需运营期增改，多处表单共用 |
| **接口** | 填接口 URL，选项实时拉取 | 选项在业务系统里，量大或高频变化 |

单行文本还支持**输入联想**：打开开关后配置接口 URL，用户键入关键词即实时搜索，选中后回填文本（存储所选条目的 label 文本；需要存编码请用「下拉 + 接口数据源」）。

### 接口数据源契约

给下拉 / 联想配的接口由**填写人的浏览器直接调用**，契约如下。

**请求**：默认 GET，参数拼查询串；可选 POST，参数以 JSON 体发送。参数值支持两类占位符：

- `${字段名}` —— 引用表单其他字段的当前值，实现选项联动（如选了省份 A，城市接口收到 `province=A` 只返回 A 的城市）；
- `${keyword}` —— 仅输入联想：当前输入词。

**响应**：返回记录数组，以下三种形态都能解析：

```jsonc
// 1. 根数组
[{"name": "杭州", "code": "HZ"}, {"name": "宁波", "code": "NB"}]

// 2. 顶层信封
{"data": [...]}        {"list": [...]}        {"records": [...]}

// 3. 分页信封（data 里再包一层列表）
{"data": {"list": [...]}}    {"data": {"records": [...]}}    {"data": {"items": [...]}}
```

**记录映射**：设计器里配置的 `label 字段名 / value 字段名` 优先取值；**两者都可以不填**，留空时按常见字段名自动识别——标签依次找 `name → label → title`，取值依次找 `id → value → code`，配置的字段在记录里不存在时同样向后回落。带 `disabled: true` 的记录渲染为禁用项，重复值自动去重。

条数建议：下拉不超过 50 条，联想不超过 10 条；搜索过滤请由接口按关键词完成（联想的 keyword 参数）。

**跨域（CORS）**：调用发生在浏览器里，你的接口必须放行跨域访问（响应 `Access-Control-Allow-Origin`；POST 的 JSON 请求还会先发一次 OPTIONS 预检，同样要放行）。另注意浏览器私网访问策略：若 GFlow 部署在公网地址（HTTP 非 HTTPS），页面里配 `localhost` 或内网 IP 的数据源会被浏览器拦截——数据源接口应与 GFlow 同网段可达，或一并上 HTTPS。

**鉴权**：外部 URL（`http(s)://` 开头）**不携带 GFlow 的任何凭证**，接口需自行解决访问控制（匿名放行、IP 白名单等）。以 `/` 开头的相对路径视为调用 GFlow 自身接口，自动携带填写人的登录态——适合把系统内已有接口（如 `/api/v1/users/options`）直接配成数据源。

**结果缓存**：下拉接口源默认开启缓存（同一表单内参数不变不重复请求），联想实时搜索不缓存；设计器里可关。

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
