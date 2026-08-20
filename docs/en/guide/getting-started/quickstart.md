# Engine in Three Minutes

<div class="lead">
One Go library plus 7 tables. Create the schema, connect the database, fire off an instance — you write business code, not workflow code.
</div>

## 1. Initialize the Database

The engine only maintains its own 7 workflow tables; system tables such as users, roles, and departments are the host application's responsibility.

::: tip Run it first with zero setup
Just want to see it work? The official example defaults to in-memory SQLite (pure-Go driver, tables auto-created) — no database installation needed:

```bash
git clone https://github.com/rulego/gflow-engine
cd gflow-engine/examples/leave_approval
go run .   # deploy → start → approve → complete, all three approval paths
```

To write your own code against a real database, read on.
:::

**PostgreSQL:**

```bash
createdb gflow
psql -d gflow -f scripts/00.init_bpm_pg.sql
```

**MySQL:**

```bash
mysql -u root -p -e "CREATE DATABASE gflow"
mysql -u root -p gflow < scripts/00.init_bpm_mysql.sql
```

> The initialization scripts are idempotent (`CREATE TABLE IF NOT EXISTS`): re-running them only creates missing tables and never touches existing tables or data. To reset, recreate the database.

Tables created: `wf_process` (process definitions), `wf_instance` / `wf_hi_instance` (instance runtime/history), `wf_task` / `wf_hi_task` (task runtime/history), `wf_task_assignee` (candidate pool), `wf_task_comment` (approval comments). See the [Data Model](/en/guide/data-model/) for what each table does.

## 2. Start the Engine and Deploy a Process

```go
package main

import (
	"context"
	"log"
	"time"

	"github.com/rulego/gflow-engine/components"
	"github.com/rulego/gflow-engine/config"
	"github.com/rulego/gflow-engine/model"
	"github.com/rulego/gflow-engine/service"
	"github.com/rulego/gflow-engine/types/dto"
	"github.com/rulego/gflow-engine/types/enums"
)

// Minimal working DSL: manager approval → end.
// The approver is configured via candidateType + candidateConfig (the actual fields
// the engine reads; mgr001 in userIds is the handler of the next todo).
const leaveApprovalDSL = `{
  "ruleChain": {
    "id": "leave_approval", "name": "Leave Approval", "root": true, "debugMode": false,
    "additionalInfo": {}
  },
  "metadata": {
    "firstNodeIndex": 0,
    "nodes": [
      { "id": "node_manager_approval", "type": "userTask", "name": "Manager Approval",
        "configuration": { "candidateType": "user", "candidateConfig": { "userIds": ["mgr001"] }, "approvalType": "single" } },
      { "id": "end", "type": "end", "name": "End" }
    ],
    "connections": [
      { "fromId": "node_manager_approval", "toId": "end", "type": "Success" },
      { "fromId": "node_manager_approval", "toId": "end", "type": "Failure" }
    ]
  }
}`

func main() {
	ctx := context.Background()

	// 1. Database configuration; build the engine via the Builder
	//    Note SetIDGenerator: without it, deploying processes or creating tasks
	//    fails because there is no ID generator
	cfg := &config.Config{
		Database: &config.DatabaseConfig{
			Driver: "postgres",
			Dsn:    "host=127.0.0.1 user=postgres password=postgres dbname=gflow port=5432 sslmode=disable",
		},
	}
	engine, err := service.NewWorkflowEngineBuilder().
		SetName("demo").
		SetConfig(cfg).
		SetIDGenerator(service.NewIDGenerator()).
		Build()
	if err != nil {
		log.Fatalf("failed to build engine: %v", err)
	}
	if err := engine.Start(ctx); err != nil {
		log.Fatalf("failed to start engine: %v", err)
	}
	defer engine.Stop(ctx)

	// 2. Register the workflow node components (userTask/serviceTask/automation/...)
	//    RegisterFromEngine pulls the services from the engine instance to wire everything up;
	//    in production, identityService must be swapped for an implementation backed by
	//    your real org structure (see section 3)
	if err := components.RegisterFromEngine(engine); err != nil {
		log.Fatalf("failed to register components: %v", err)
	}

	// 3. Deploy the process definition (the DSL is a rulego rule chain JSON)
	admin := service.Actor{UserID: "admin", TenantID: "default"}
	if _, err := engine.GetProcessService().Deploy(ctx, admin, &model.WfProcess{
		ProcessKey:     "leave_approval",
		Name:           "Leave Approval",
		DefinitionJSON: leaveApprovalDSL,
		TenantID:       "default",
		CreatedBy:      "admin",
	}, true); err != nil {
		log.Fatalf("failed to deploy process: %v", err)
	}

	// 4. Start a process instance (to start from a draft: add the service.WithDraft() option)
	starter := service.Actor{UserID: "emp001", TenantID: "default"}
	instanceID, err := engine.GetRuntimeService().StartProcessInstanceByKey(
		ctx,
		starter,
		"leave_approval",
		"leave_emp001_1", // business key
		map[string]interface{}{"days": 5, "reason": "Family matters"},
	)
	if err != nil {
		log.Fatalf("failed to start process: %v", err)
	}
	log.Printf("started successfully: %s", instanceID)

	// The engine advances the chain asynchronously: after starting, wait briefly
	// for the first task to be persisted before querying todos
	time.Sleep(300 * time.Millisecond)

	// ---- Approver mgr001 handles the todo ----
	approver := service.Actor{UserID: "mgr001", TenantID: "default"}
	tasks, _, err := engine.GetTaskService().GetTaskList(ctx, approver, &dto.TaskQuery{
		Assignee: "mgr001",
		PageRequest: dto.PageRequest{
			Status:   []string{string(enums.TaskStatusPending), string(enums.TaskStatusActive)},
			PageSize: 10,
		},
	})
	if err != nil || len(tasks) == 0 {
		log.Fatalf("failed to query todos: err=%v n=%d", err, len(tasks))
	}
	// In countersign scenarios the query may return parent task rows with an
	// empty assignee; pick the one that belongs to mgr001
	var taskID string
	for _, t := range tasks {
		if t.Assignee != nil && *t.Assignee == "mgr001" {
			taskID = t.ID
			break
		}
	}
	if taskID == "" {
		log.Fatalf("no todo with assignee=mgr001")
	}

	if err := engine.GetTaskService().CompleteWithApproval(ctx, approver, &service.ApprovalRequest{
		TaskID:         taskID,
		ApprovalResult: enums.ApprovalResultApproved,
		Comment:        "Approved",
	}); err != nil {
		log.Fatalf("approval failed: %v", err)
	}
	log.Printf("approved: %s", taskID)
}
```

## 3. Plug In Your Org Structure (IdentityService)

The engine is not tied to any user system. For approval tasks initiated by role, department, or manager, the handlers are all resolved through the `service.IdentityService` interface:

```go
// Implement the 8 methods to hook up your own org-structure tables
type OrgIdentityService struct {
	db *gorm.DB
}

func (s *OrgIdentityService) GetUserIDsByRoleID(ctx context.Context, tenantID, roleID string) ([]string, error) {
	var userIDs []string
	err := s.db.WithContext(ctx).
		Table("user_roles").
		Where("tenant_id = ? AND role_id = ?", tenantID, roleID).
		Pluck("user_id", &userIDs).Error
	return userIDs, err
}
// Remaining methods: GetUserIDsByDepartmentID / GetDepartmentManagerUserID /
//          GetUserManagerID / GetUserManagerHierarchy /
//          GetUserDepartmentID / GetRoleIDsByUserID / GetUserIDsByGroupID
```

Inject it through the Builder (the same one used above to build the engine):

```go
engine, err := service.NewWorkflowEngineBuilder().
	SetName("demo").
	SetConfig(cfg).
	SetIdentityService(&OrgIdentityService{db: gormDB}).
	SetIDGenerator(service.NewIDGenerator()).
	Build()
```

::: tip
Don't want to write the org-structure integration yourself? Just use the GFlow Workflow Platform — it ships with a complete implementation of users, roles, departments, positions, and multi-tenancy, plus all of the UI. See the [GFlow Platform hands-on tour](/en/guide/getting-started/gflow-quickstart).
:::
