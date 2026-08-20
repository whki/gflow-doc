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

Already have forms in an existing business system? `formType: "external"` + `formUrl` hooks the existing page directly, and the approval detail opens it read-only in an iframe — the engine only manages the process and never takes over your forms.
