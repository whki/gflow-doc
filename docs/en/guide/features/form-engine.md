# Form Engine

<div class="lead">
A homegrown gform-designer Form Designer plus a runtime rendering engine. The form schema is embedded in the process DSL, and a single schema drives three views: initiation form filling, approval display, and field permissions.
</div>

## Designer Capabilities

Drag-and-drop configuration with a live preview in the properties panel on the right:

- **Field types** (29 in total): single-line/multi-line text, number, amount, password, single-select/multi-select, dropdown (static/dictionary/API data source), date/date range, switch, upload, image, department/member/multi-member selection, cascade, sub-table (line items), rich text, signature, location, serial number, ID card, phone number, plus layout widgets such as grid/card/tabs/divider/alert
- **Validation**: required, length, numeric range, regex, cross-field validation, formula computation
- **Linkage**: show/hide logic (visibleWhen / disabledWhen)
- **Formula fields**: once a `formula` is declared, the field becomes read-only; its value is computed in real time from dependent fields and written into the process variables on submit (e.g. leave days `DATEDIFF(endTime, startTime) + 1`). Supports arithmetic/comparison/logical operators and the functions `SUM/AVG/MAX/MIN/COUNT/ROUND/ABS/IF/CONCAT/LEN/UPPER/LOWER/DATEDIFF`. Missing dependencies propagate as null (null is never treated as 0 to produce a bogus value)
- **Layout**: grid span, label position, label width
- **Default values**: static values or expressions
- **Template library**: common approval forms (leave / expense reimbursement / procurement / seal usage) can be saved as templates and applied to a new process in one click; templates can also be shared via `formKey` references

The form schema lives in the process DSL at `ruleChain.additionalInfo.form`:

```json
{
  "ruleChain": {
    "additionalInfo": {
      "formType": "design",
      "form": {
        "title": "Leave Application Form",
        "fields": [
          {
            "id": "f_leave_type",
            "type": "select",
            "label": "Leave Type",
            "field": "leaveType",
            "dataSource": { "type": "static", "options": [ /* … */ ] },
            "validate": { "required": true }
          },
          {
            "id": "f_leave_days",
            "type": "number",
            "label": "Leave Days",
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

## Data Sources and Typeahead

Dropdown / radio / checkbox / cascader fields take their options from three source types, switched via "Data Source" in the designer's property panel:

| Type | Configuration | Best for |
| --- | --- | --- |
| **Static** | Maintains the option list by hand (label / value / default selected) | Fixed, short option sets such as leave types |
| **Dictionary** | Fill in a dictionary code; options come from System Management → Dictionaries | Options that grow or change over time, shared across forms |
| **API** | Fill in an endpoint URL; options are fetched live | Options owned by a business system, large or frequently changing |

Single-line text also supports **typeahead**: enable it and configure an endpoint URL — as the user types, suggestions are searched in real time and selecting one fills the input (the stored value is the suggestion's label text; to store a machine code, use "dropdown + API data source" instead).

### API Data Source Contract

Endpoints configured for dropdowns / typeahead are called **directly by the filler's browser**. The contract:

**Request**: GET by default, parameters appended to the query string; POST optional, parameters sent as a JSON body. Parameter values support two placeholders:

- `${field_name}` — references the current value of another form field for cascading options (pick province A and the city endpoint receives `province=A` and returns only A's cities);
- `${keyword}` — typeahead only: the current input text.

**Response**: return an array of records; all three shapes below parse:

```jsonc
// 1. Root array
[{"name": "Hangzhou", "code": "HZ"}, {"name": "Ningbo", "code": "NB"}]

// 2. Top-level envelope
{"data": [...]}        {"list": [...]}        {"records": [...]}

// 3. Paginated envelope (a list wrapped inside data)
{"data": {"list": [...]}}    {"data": {"records": [...]}}    {"data": {"items": [...]}}
```

**Record mapping**: the "label field / value field" names configured in the designer take precedence; **both may be left empty** — common field names are then auto-detected: the label falls back through `name → label → title`, the value through `id → value → code`, and a configured field missing from a record falls through the same way. Records carrying `disabled: true` render as disabled options; duplicate values are de-duplicated.

Keep it short: at most 50 options for a dropdown and 10 suggestions for typeahead; let the endpoint do the filtering by keyword.

**Cross-origin (CORS)**: the call happens in the browser, so your endpoint must allow cross-origin access (an `Access-Control-Allow-Origin` response header; POST with JSON also sends an OPTIONS preflight first — allow that too). Also mind the browser's private-network policy: if GFlow is served from a public address over plain HTTP, data sources pointing at `localhost` or intranet IPs are blocked by the browser — keep the data source endpoint reachable from the same network as GFlow, or serve both over HTTPS.

**Authentication**: external URLs (`http(s)://…`) carry **none of GFlow's credentials** — the endpoint handles access control on its own (anonymous access, IP allowlists, etc.). A relative path starting with `/` calls GFlow's own API with the filler's login session attached — handy for wiring existing system endpoints (such as `/api/v1/users/options`) as data sources.

**Result caching**: dropdown API sources cache by default (no repeated requests within a form while parameters stay the same); typeahead searches in real time and is never cached. Both are switchable in the designer.
## Runtime Rendering

The same schema serves three scenarios:

1. **Initiate**: renders the fill-in form from the schema; once validation passes, field values are loaded into the process variable `msg`
2. **Approval display**: the detail page renders a read-only/editable view based on "current node + field permissions", with `msg` values back-filled automatically
3. **Print/archive**: a snapshot of `variables` taken the moment the task ends is kept in `wf_hi_task`, so historical records remain queryable forever

## Integration with Processes

- **Conditional routing**: the designer's condition drawer autocompletes form fields (`msg.days`); see the [Process Designer](/en/guide/features/designer)
- **Field permissions**: `userTask`'s `additionalInfo.formPermissions` controls visibility and editability per field key across the three views
- **Template references**: `formKey` points to a template in the `forms` table (`code / name / schema_json`); multiple processes share a single form definition, and one change takes effect everywhere

## External Forms

Already have forms in an existing business system? `formType: "external"` + `formUrl` hooks the existing page directly, approvers see the submitted variables as a read-only data table — the engine only manages the process and never takes over your forms.
