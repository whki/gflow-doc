# 品牌资源

<div class="lead">
「GFlow 极风工作流平台」产品家族的标志、色彩、口号与术语规范。
</div>

## 术语表

| 术语 | 全称 / 说明 | 使用场景 |
|---|---|---|
| **GFlow** | 产品家族名，中文全称「极风工作流平台」 | 对外宣传、文档站标题、社区渠道 |
| **GFlow Engine** | 开源审批引擎内核（Apache-2.0） | 引擎文档、开源仓库、go get |
| **GFlow Platform** | 开箱即用审批平台，对外销售名「极风工作流平台」（商业授权） | 定价页、商业物料、演示环境 |
| **RuleGo** | 底层规则引擎（开源，独立品牌） | 底座指代，不与 GFlow 混用 |

品牌故事：**G ≈ 极，Flow = 流转**——gflow 即「极速流转的审批」。

## 标志

<div class="brand-stage">
  <img src="/logo.svg" alt="GFlow 主标" class="brand-hero" />
  <div class="brand-caption">主标 · 印章 × 流程</div>
</div>

### 品牌口号

产品定位：**审批为主词，自动化为差异，AI 为前沿**；中国式审批语义是完备的地基。

| 层级 | 口号 | 用途 |
|---|---|---|
| 品牌主口号 | **审批如风，极速流转。** | 品牌物料、首页 hero、发布会主视觉 |
| 功能叙事口号 | 批完，自动办。AI 先审，人再签，签完自动执行。 | 产品大标题、副标、价格页、演示讲解词 |

使用规范：

- 品牌主口号与产品名**成对出现**：「GFlow 极风工作流平台 · 审批如风，极速流转」——口号不替换产品名
- 叙事口号的顺序不可调换（AI → 人 → 自动执行），顺序本身就是产品哲学
- 中国式审批语义（会签/加签/驳回）作为能力矩阵呈现，不单独做口号

## 设计理念

一枚章，就是一条审批流。

标志将产品最核心的两个隐喻合而为一：

- **印章（朱红方章）** —— 中国式审批的信任符号。盖章即通过，是本土业务人员最熟悉的确权动作；方章内一圈细线取公章内框的形制。
- **流程（白色节点连线）** —— 引擎的本质。图形是一条最精简的审批流：**发起（圆点）→ 并行分支（fork）→ 双审批任务（两圆）→ 汇聚（join）→ 结束（方块）**，正是 `fork / join` 规则链节点的抽象，也是「流程即规则链」的可视化。

方章的四角圆角与极简笔画保持现代感——传统形制，克制表达。

## 组合与变体

<div class="brand-variants">
  <figure>
    <img src="/logo.svg" alt="主标" />
    <figcaption>主标（应用图标 / favicon / 导航）</figcaption>
  </figure>
  <figure>
    <img src="/logo-wordmark.svg" alt="横版组合标" />
    <figcaption>横版组合标（浅色背景）</figcaption>
  </figure>
  <figure class="dark-fig">
    <img src="/logo.svg" alt="深底主标" />
    <figcaption>主标（深色背景同样适用）</figcaption>
  </figure>
</div>

辅助图形：官网首页与审批单 mockup 中的**圆形公章**（「GFLOW 审批专用章」）是装饰性辅助图形，用于盖章动效等场景，不作为产品标志使用。

## 色彩

| 色彩 | 色值 | 用途 |
|---|---|---|
| 印章朱红 | `#C2372F` | 标志、强语义（通过/推荐/商用） |
| 宣纸白 | `#FFF6EE` / `#F7F5F0` | 标志图形、浅色底 |
| 墨绿黑 | `#0B1512` | 字标、深色底 |
| 企业蓝 | `#3370FF` | 界面主色（与 rulego 生态一致，不进入标志） |

标志只用「朱红 + 宣纸白」双色；界面主色为企业蓝，与 rulego 生态（引擎 UI、编辑器）保持一致；绿色仅作为成功等状态语义使用，不进入品牌系统。

## 使用规范

- **最小尺寸**：主标 24px；低于 24px 时内框细线可省略
- **安全边距**：四周留白不小于标志尺寸的 12.5%（即内框到章边的距离）
- **底色**：浅色、深色背景均可直接使用；避免放在朱红或高饱和红底上
- **不要**：拉伸变形、改变配色、加投影/描边、旋转（盖章动效中的旋转仅限辅助公章）

## 下载

- [主标 logo.svg](/logo.svg) · [横版组合标 logo-wordmark.svg](/logo-wordmark.svg)

<style scoped>
.brand-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 44px 20px 36px;
  margin: 18px 0 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background:
    radial-gradient(500px 200px at 50% 0%, rgba(194, 55, 47, 0.05), transparent 70%),
    var(--vp-c-bg-soft);
}

.brand-hero {
  width: 160px;
  height: 160px;
}

.brand-caption {
  font-size: 13px;
  color: var(--vp-c-text-3);
  letter-spacing: 0.15em;
}

.brand-variants {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin: 8px 0 28px;
}

.brand-variants figure {
  margin: 0;
  padding: 26px 14px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.brand-variants img {
  height: 56px;
  max-width: 90%;
}

.brand-variants figcaption {
  font-size: 12.5px;
  color: var(--vp-c-text-3);
}

.dark-fig {
  background: var(--gf-ink) !important;
}

.dark-fig figcaption {
  color: #8fa79a !important;
}

@media (max-width: 720px) {
  .brand-variants {
    grid-template-columns: 1fr;
  }
}
</style>
