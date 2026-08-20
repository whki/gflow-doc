import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// 演示环境（成品环境）
export const DEMO_URL = 'http://8.134.32.225:8081'

export default withMermaid(defineConfig({
  title: 'GFlow 极风工作流平台',
  description: '审批如风，极速流转。批完，自动办：AI 先审、人再签、签完自动执行——开源引擎 GFlow Engine（Apache-2.0）+ 商业平台 GFlow 极风工作流平台。',

  ignoreDeadLinks: true,

  srcExclude: ['**/brand.md'],

  // 双语：root = 中文（URL 不变），/en/ = English
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '产品介绍', link: '/guide/introduction/what-is-gflow' },
          { text: '快速开始', link: '/guide/getting-started/quickstart' },
          {
            text: '核心功能',
            items: [
              { text: '审批语义', link: '/guide/features/approval-semantics' },
              { text: '流程设计器', link: '/guide/features/designer' },
              { text: '表单设计器', link: '/guide/features/form-engine' },
              { text: '规则链设计器', link: '/guide/features/rulechain-designer' },
              { text: '智能体（AI 审批）', link: '/guide/features/ai-approval' },
              { text: '自动化编排', link: '/guide/features/automation' },
              { text: '节点类型', link: '/guide/features/nodes' },
              { text: '流程 DSL', link: '/guide/dsl' },
              { text: 'REST API', link: '/guide/api' },
              { text: '数据模型', link: '/guide/data-model/' },
            ]
          },
          { text: '价格', link: '/pricing' },
          { text: '在线演示', link: DEMO_URL },
        ],

        sidebar: {
          '/guide/introduction/': [
            {
              text: '产品介绍',
              items: [
                { text: '什么是 GFlow', link: '/guide/introduction/what-is-gflow' },
                { text: '架构概览', link: '/guide/introduction/architecture' },
                { text: '与其他方案对比', link: '/guide/introduction/comparison' },
              ]
            }
          ],

          '/guide/getting-started/': [
            {
              text: '快速开始',
              items: [
                { text: '环境要求', link: '/guide/getting-started/requirements' },
                { text: 'GFlow Engine 三分钟入门', link: '/guide/getting-started/quickstart' },
              ]
            }
          ],

          '/guide/features/': [
            {
              text: 'GFlow Engine（开源引擎）',
              items: [
                { text: '中国式审批语义', link: '/guide/features/approval-semantics' },
                { text: '节点类型总览', link: '/guide/features/nodes' },
              ]
            },
            {
              text: 'GFlow Platform（商业平台）',
              items: [
                { text: '流程设计器', link: '/guide/features/designer' },
                { text: '表单设计器', link: '/guide/features/form-engine' },
                { text: '外部表单接入', link: '/guide/features/external-form' },
                { text: '规则链设计器', link: '/guide/features/rulechain-designer' },
                { text: '智能体（AI 审批）', link: '/guide/features/ai-approval' },
                { text: '自动化编排', link: '/guide/features/automation' },
              ]
            }
          ],

          '/guide/data-model/': [
            {
              text: '数据模型',
              items: [
                { text: '总览：为什么只有 7 张表', link: '/guide/data-model/' },
                { text: 'wf_process 流程定义表', link: '/guide/data-model/wf-process' },
                { text: 'wf_instance 运行时实例表', link: '/guide/data-model/wf-instance' },
                { text: 'wf_task 运行时任务表', link: '/guide/data-model/wf-task' },
                { text: 'wf_task_assignee 候选人池', link: '/guide/data-model/wf-task-assignee' },
                { text: 'wf_task_comment 任务处理意见', link: '/guide/data-model/wf-task-comment' },
                { text: 'wf_hi_instance 历史实例表', link: '/guide/data-model/wf-hi-instance' },
                { text: 'wf_hi_task 历史任务表', link: '/guide/data-model/wf-hi-task' },
              ]
            }
          ],

          '/guide/dsl': [
            {
              text: '流程 DSL',
              items: [
                { text: 'DSL 规范', link: '/guide/dsl' },
              ]
            }
          ],

          '/guide/api': [
            {
              text: 'API 参考',
              items: [
                { text: 'REST API', link: '/guide/api' },
              ]
            }
          ],

          '/guide/deployment': [
            {
              text: '部署',
              items: [
                { text: '部署指南', link: '/guide/deployment/production' },
                { text: '自定义数据库方言（国产数据库适配）', link: '/guide/deployment/custom-dialect' },
              ]
            }
          ],
        },

        outline: {
          label: '页面导航',
          level: [2, 3]
        },

        docFooter: {
          prev: '上一页',
          next: '下一页'
        },

        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short'
          }
        }
      }
    },

    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'GFlow Workflow Platform',
      description: 'Approvals like the wind. Once approved, it runs itself: AI pre-screens, humans approve, execution follows automatically — open-source GFlow Engine (Apache-2.0) + the commercial GFlow Workflow Platform.',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Overview', link: '/en/guide/introduction/what-is-gflow' },
          { text: 'Quick Start', link: '/en/guide/getting-started/quickstart' },
          {
            text: 'Features',
            items: [
              { text: 'Approval Semantics', link: '/en/guide/features/approval-semantics' },
              { text: 'Process Designer', link: '/en/guide/features/designer' },
              { text: 'Form Designer', link: '/en/guide/features/form-engine' },
              { text: 'Rule Chain Designer', link: '/en/guide/features/rulechain-designer' },
              { text: 'AI Agent (AI Approval)', link: '/en/guide/features/ai-approval' },
              { text: 'Automation', link: '/en/guide/features/automation' },
              { text: 'Node Types', link: '/en/guide/features/nodes' },
              { text: 'Process DSL', link: '/en/guide/dsl' },
              { text: 'REST API', link: '/en/guide/api' },
              { text: 'Data Model', link: '/en/guide/data-model/' },
            ]
          },
          { text: 'Pricing', link: '/en/pricing' },
          { text: 'Live Demo', link: DEMO_URL },
        ],

        sidebar: {
          '/en/guide/introduction/': [
            {
              text: 'Introduction',
              items: [
                { text: 'What is GFlow', link: '/en/guide/introduction/what-is-gflow' },
                { text: 'Architecture Overview', link: '/en/guide/introduction/architecture' },
                { text: 'Comparison with Other Solutions', link: '/en/guide/introduction/comparison' },
              ]
            }
          ],

          '/en/guide/getting-started/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Requirements', link: '/en/guide/getting-started/requirements' },
                { text: 'GFlow Engine in Three Minutes', link: '/en/guide/getting-started/quickstart' },
              ]
            }
          ],

          '/en/guide/features/': [
            {
              text: 'GFlow Engine (Open-Source Engine)',
              items: [
                { text: 'Chinese-Style Approval Semantics', link: '/en/guide/features/approval-semantics' },
                { text: 'Node Types Overview', link: '/en/guide/features/nodes' },
              ]
            },
            {
              text: 'GFlow Platform (Commercial Platform)',
              items: [
                { text: 'Process Designer', link: '/en/guide/features/designer' },
                { text: 'Form Designer', link: '/en/guide/features/form-engine' },
                { text: 'Rule Chain Designer', link: '/en/guide/features/rulechain-designer' },
                { text: 'AI Agent (AI Approval)', link: '/en/guide/features/ai-approval' },
                { text: 'Automation', link: '/en/guide/features/automation' },
              ]
            }
          ],

          '/en/guide/data-model/': [
            {
              text: 'Data Model',
              items: [
                { text: 'Overview: Why Only 7 Tables', link: '/en/guide/data-model/' },
                { text: 'wf_process — Process Definition', link: '/en/guide/data-model/wf-process' },
                { text: 'wf_instance — Runtime Instance', link: '/en/guide/data-model/wf-instance' },
                { text: 'wf_task — Runtime Task', link: '/en/guide/data-model/wf-task' },
                { text: 'wf_task_assignee — Candidate Pool', link: '/en/guide/data-model/wf-task-assignee' },
                { text: 'wf_task_comment — Task Comments', link: '/en/guide/data-model/wf-task-comment' },
                { text: 'wf_hi_instance — History Instance', link: '/en/guide/data-model/wf-hi-instance' },
                { text: 'wf_hi_task — History Task', link: '/en/guide/data-model/wf-hi-task' },
              ]
            }
          ],

          '/en/guide/dsl': [
            {
              text: 'Process DSL',
              items: [
                { text: 'DSL Specification', link: '/en/guide/dsl' },
              ]
            }
          ],

          '/en/guide/api': [
            {
              text: 'API Reference',
              items: [
                { text: 'REST API', link: '/en/guide/api' },
              ]
            }
          ],

          '/en/guide/deployment': [
            {
              text: 'Deployment',
              items: [
                { text: 'Deployment Guide', link: '/en/guide/deployment/production' },
                { text: 'Custom Database Dialects (Chinese Domestic Databases)', link: '/en/guide/deployment/custom-dialect' },
              ]
            }
          ],
        },

        outline: {
          label: 'On this page',
          level: [2, 3]
        },

        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },

        lastUpdated: {
          text: 'Last updated',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short'
          }
        },

        footer: {
          message: 'GFlow Engine is open source under Apache-2.0 · GFlow Workflow Platform is commercially licensed',
          copyright: 'Copyright © 2026-present RuleGo Team'
        }
      }
    }
  },

  head: [
    ['meta', { name: 'theme-color', content: '#0b1512' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'GFlow 极风工作流平台 | 审批如风，极速流转' }],
    ['meta', { property: 'og:description', content: '审批如风，极速流转。开源引擎 GFlow Engine + 商业版极风工作流平台：AI 先审、人再签、签完自动执行——7 张核心表、四大自研设计器与智能体。' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.loli.net' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@600;700;900&family=JetBrains+Mono:wght@400;600&display=swap' }]
  ],

  themeConfig: {
    logo: '/logo.svg',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/rulego/gflow-engine' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.59.59 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>',
        },
        link: 'https://gitee.com/rulego/gflow-engine',
        ariaLabel: 'Gitee',
      },
    ],

    footer: {
      message: 'GFlow Engine 基于 Apache-2.0 许可开源 · GFlow 极风工作流平台商业授权',
      copyright: 'Copyright © 2026-present RuleGo Team'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search docs',
                buttonAriaLabel: 'Search docs'
              },
              modal: {
                noResultsText: 'No results for',
                resetButtonTitle: 'Clear query',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate'
                }
              }
            }
          }
        }
      }
    },
  },

  mermaid: {
    flowchart: { wrappingWidth: 400, diagramPadding: 8 },
    sequence: { diagramPadding: 8 },
    state: { diagramPadding: 8 },
  },

  vite: {
    optimizeDeps: {
      include: ['mermaid']
    }
  },
}))
