# 引擎三分钟入门

<div class="lead">
一个 Go 库加 7 张表。建库、连库、发实例——你写的是业务代码，不是流程代码。
</div>

## 1. 初始化数据库

引擎只维护自己的 7 张工作流表，用户/角色/部门等系统表由宿主应用负责。

::: tip 零依赖先跑起来
只想先看效果？官方示例默认用内存 SQLite（纯 Go 驱动、自动建表），不用装任何数据库：

```bash
git clone https://github.com/rulego/gflow-engine
cd gflow-engine/examples/leave_approval
go run .   # 部署 → 发起 → 审批 → 完结，依次演示三条审批路径
```

要写自己的代码、接真实数据库，继续往下。
:::

**PostgreSQL：**

```bash
createdb gflow
psql -d gflow -f scripts/00.init_bpm_pg.sql
```

**MySQL：**

```bash
mysql -u root -p -e "CREATE DATABASE gflow"
mysql -u root -p gflow < scripts/00.init_bpm_mysql.sql
```

> 初始化脚本是幂等的（`CREATE TABLE IF NOT EXISTS`）：重复执行只补建缺失的表，不会改动已有表和数据；需要重置时请重建数据库。

建表清单：`wf_process`（流程定义）、`wf_instance` / `wf_hi_instance`（实例运行时/历史）、`wf_task` / `wf_hi_task`（任务运行时/历史）、`wf_task_assignee`（候选人池）、`wf_task_comment`（审批意见表）。每张表的作用见[数据模型](/guide/data-model/)。

## 2. 启动引擎并部署流程

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

// 最小可用 DSL：经理审批 → 结束。
// 审批人配置用 candidateType + candidateConfig（引擎读取的真实字段，
// userIds 里的 mgr001 即下一个待办的办理人）。
const leaveApprovalDSL = `{
  "ruleChain": {
    "id": "leave_approval", "name": "请假审批", "root": true, "debugMode": false,
    "additionalInfo": {}
  },
  "metadata": {
    "firstNodeIndex": 0,
    "nodes": [
      { "id": "node_manager_approval", "type": "userTask", "name": "经理审批",
        "configuration": { "candidateType": "user", "candidateConfig": { "userIds": ["mgr001"] }, "approvalType": "single" } },
      { "id": "end", "type": "end", "name": "结束" }
    ],
    "connections": [
      { "fromId": "node_manager_approval", "toId": "end", "type": "Success" },
      { "fromId": "node_manager_approval", "toId": "end", "type": "Failure" }
    ]
  }
}`

func main() {
	ctx := context.Background()

	// 1. 数据库配置，经 Builder 构建引擎
	//    注意 SetIDGenerator：不设置时部署/建任务会因无 ID 生成器而失败
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
		log.Fatalf("构建引擎失败: %v", err)
	}
	if err := engine.Start(ctx); err != nil {
		log.Fatalf("启动引擎失败: %v", err)
	}
	defer engine.Stop(ctx)

	// 2. 注册工作流节点组件（userTask/serviceTask/automation/...）
	//    RegisterFromEngine 从引擎实例取出各服务完成装配；
	//    identityService 生产环境必须换成对接真实组织架构的实现（见第 3 节）
	if err := components.RegisterFromEngine(engine); err != nil {
		log.Fatalf("注册组件失败: %v", err)
	}

	// 3. 部署流程定义（DSL 为 rulego 规则链 JSON）
	admin := service.Actor{UserID: "admin", TenantID: "default"}
	if _, err := engine.GetProcessService().Deploy(ctx, admin, &model.WfProcess{
		ProcessKey:     "leave_approval",
		Name:           "请假审批",
		DefinitionJSON: leaveApprovalDSL,
		TenantID:       "default",
		CreatedBy:      "admin",
	}, true); err != nil {
		log.Fatalf("部署流程失败: %v", err)
	}

	// 4. 发起流程实例（草稿发起：追加 service.WithDraft() 选项）
	starter := service.Actor{UserID: "emp001", TenantID: "default"}
	instanceID, err := engine.GetRuntimeService().StartProcessInstanceByKey(
		ctx,
		starter,
		"leave_approval",
		"leave_emp001_1", // 业务键
		map[string]interface{}{"days": 5, "reason": "家中事务"},
	)
	if err != nil {
		log.Fatalf("发起流程失败: %v", err)
	}
	log.Printf("发起成功: %s", instanceID)

	// 引擎推进链是异步的：发起后稍等首个任务落库再查待办
	time.Sleep(300 * time.Millisecond)

	// ---- 审批人 mgr001 处理待办 ----
	approver := service.Actor{UserID: "mgr001", TenantID: "default"}
	tasks, _, err := engine.GetTaskService().GetTaskList(ctx, approver, &dto.TaskQuery{
		Assignee: "mgr001",
		PageRequest: dto.PageRequest{
			Status:   []string{string(enums.TaskStatusPending), string(enums.TaskStatusActive)},
			PageSize: 10,
		},
	})
	if err != nil || len(tasks) == 0 {
		log.Fatalf("查待办失败: err=%v n=%d", err, len(tasks))
	}
	// 会签场景下查询结果可能带办理人为空的主任务行，挑出 mgr001 自己的
	var taskID string
	for _, t := range tasks {
		if t.Assignee != nil && *t.Assignee == "mgr001" {
			taskID = t.ID
			break
		}
	}
	if taskID == "" {
		log.Fatalf("没有 assignee=mgr001 的待办")
	}

	if err := engine.GetTaskService().CompleteWithApproval(ctx, approver, &service.ApprovalRequest{
		TaskID:         taskID,
		ApprovalResult: enums.ApprovalResultApproved,
		Comment:        "同意",
	}); err != nil {
		log.Fatalf("审批失败: %v", err)
	}
	log.Printf("审批通过: %s", taskID)
}
```

## 3. 接入组织架构（IdentityService）

引擎不绑定任何用户体系。按角色/部门/主管发起的审批任务，办理人统一通过 `service.IdentityService` 接口解析：

```go
// 实现 8 个方法，对接你自己的组织架构表
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
// 其余方法：GetUserIDsByDepartmentID / GetDepartmentManagerUserID /
//          GetUserManagerID / GetUserManagerHierarchy /
//          GetUserDepartmentID / GetRoleIDsByUserID / GetUserIDsByGroupID
```

通过 Builder 注入（与上面构建引擎的同一个 Builder）：

```go
engine, err := service.NewWorkflowEngineBuilder().
	SetName("demo").
	SetConfig(cfg).
	SetIdentityService(&OrgIdentityService{db: gormDB}).
	SetIDGenerator(service.NewIDGenerator()).
	Build()
```

::: tip
不想写组织架构对接？直接用 GFlow 极风工作流平台——它内置了用户/角色/部门/岗位/多租户的完整实现和全部界面，见 [GFlow Platform 体验](/guide/getting-started/gflow-quickstart)。
:::
