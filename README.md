# GFlow 极风工作流平台官方文档站

中国式审批引擎 **GFlow Engine**（开源引擎，Apache-2.0）与 **GFlow Platform**（极风工作流平台，商业授权）的官方网站与文档，基于 [VitePress](https://vitepress.dev/) 构建。

## 本地开发

```bash
npm install        # 安装依赖
npm run docs:dev   # 启动开发服务器（默认 :5173）
npm run docs:build # 构建静态站点到 docs/.vitepress/dist
npm run docs:preview # 预览构建产物
```

## 站点结构

- `/` 官网首页（Hero、开源仓库、审批能力、产品矩阵、设计器预览、数据模型、架构、快速接入、价格预告、CTA）
- `/pricing` 价格页（开源版 vs gflow 商业版逐项对比 + FAQ）
- `/guide/introduction/` 产品介绍（定位、架构、方案对比、开源商业边界）
- `/guide/getting-started/` 快速开始（引擎三分钟入门、gflow 平台体验）
- `/guide/features/` 核心功能（审批语义、设计器、表单引擎、AI 审批、自动化、节点）
- `/guide/data-model/` 数据模型（为什么只有 7 张表 + 每张表逐张详解）
- `/guide/dsl` `/guide/api` `/guide/deployment/` DSL 规范 / REST API / 部署

## 设计系统

「公文印章 × 规则引擎」：深墨绿黑 + 宣纸暖白双底色，RuleGo 绿为主色，印章朱红用于强语义（推荐/商用/通过），中文衬线标题（Noto Serif SC）配无衬线正文。设计令牌与组件样式在 `docs/.vitepress/theme/custom.css`，首页区块组件在 `theme/components/`。

## 相关仓库

- 引擎：<https://gitee.com/rulego/gflow-engine>
- 底座：<https://gitee.com/rulego/rulego>
- 演示环境：<http://8.134.32.225:8081>（admin / admin123）
