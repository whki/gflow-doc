<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'

const DEMO_URL = 'http://8.134.32.225:8081'
const { isEn } = useI18n()

const T = computed(() =>
  isEn.value
    ? {
        desktopTitle: 'Desktop',
        desktopDesc: 'Designed for 1440px+ screens, all captured from the live demo environment.',
        mobileTitle: 'Mobile H5',
        mobileDesc: 'Approve and initiate on the phone; visit the demo site with your mobile browser to try it.',
        demo: 'Open Live Demo',
        items: [
          { src: '/images/screens/d-login.webp', title: 'Login', desc: 'Brand login screen, demo accounts one-click fill' },
          { src: '/images/screens/d-dashboard.webp', title: 'Workbench', desc: 'To-dos, recent activity and quick actions' },
          { src: '/images/screens/d-create.webp', title: 'New Request', desc: 'Template gallery with categories, start in one minute' },
          { src: '/images/screens/d-todo.webp', title: 'Approval Center · To-do', desc: 'Inbox-style to-do and summary cards' },
          { src: '/images/screens/d-detail.webp', title: 'Approval Detail', desc: 'Form, canvas, timeline and upcoming approver predictions' },
          { src: '/images/screens/d-designer.webp', title: 'Process Designer', desc: 'Tree canvas and approver configuration drawer' },
          { src: '/images/screens/d-formdesigner.webp', title: 'Form Designer', desc: 'Drag-and-drop fields, field-level permissions' },
          { src: '/images/screens/d-instances.webp', title: 'Process Instances', desc: 'Admin-side instance monitoring and intervention' },
          { src: '/images/screens/d-agent.webp', title: 'Agent Management', desc: 'AI approval agents bound to skills and integrated into flows' },
          { src: '/images/screens/d-im.png', title: 'IM Channels & Identity', desc: 'Credentials for all three platforms, effective on save; one-click directory sync' },
        ],
        phones: [
          { src: '/images/screens/m-login.webp', title: 'Login' },
          { src: '/images/screens/m-todos.webp', title: 'My Approvals' },
          { src: '/images/screens/m-detail.webp', title: 'Approval Detail' },
          { src: '/images/screens/m-create.webp', title: 'Initiate Request' },
          { src: '/images/screens/m-form.webp', title: 'Fill Form' },
          { src: '/images/screens/m-im-dingtalk.jpg', title: 'DingTalk Notification' },
          { src: '/images/screens/m-im-wecom.jpg', title: 'WeCom Notification' },
          { src: '/images/screens/m-im-feishu.jpg', title: 'Feishu Card' },
        ],
      }
    : {
        desktopTitle: '桌面端',
        desktopDesc: '1440px+ 宽屏设计，全部截自线上演示环境。',
        mobileTitle: '移动端 H5',
        mobileDesc: '手机上审批与发起，用手机浏览器访问演示站即可体验。',
        demo: '打开在线演示',
        items: [
          { src: '/images/screens/d-login.webp', title: '登录', desc: '品牌登录屏，演示账号一键填充' },
          { src: '/images/screens/d-dashboard.webp', title: '工作台', desc: '待办、最近活动与快捷操作' },
          { src: '/images/screens/d-create.webp', title: '发起申请', desc: '模板分类平铺，一分钟发起' },
          { src: '/images/screens/d-todo.webp', title: '审批中心 · 待办', desc: '收件箱式待办与决策摘要卡' },
          { src: '/images/screens/d-detail.webp', title: '审批详情', desc: '表单、画布、时间线与后续环节预测' },
          { src: '/images/screens/d-designer.webp', title: '流程设计器', desc: '树形画布与审批人配置抽屉' },
          { src: '/images/screens/d-formdesigner.webp', title: '表单设计器', desc: '拖拽字段、字段级权限' },
          { src: '/images/screens/d-instances.webp', title: '流程实例', desc: '管理端实例监控与干预' },
          { src: '/images/screens/d-agent.webp', title: '智能体管理', desc: 'AI 审批智能体绑定技能接入流程' },
          { src: '/images/screens/d-im.png', title: 'IM 渠道与身份集成', desc: '三家凭证管理页录入即生效；通讯录同步一键绑定' },
        ],
        phones: [
          { src: '/images/screens/m-login.webp', title: '登录' },
          { src: '/images/screens/m-todos.webp', title: '我的审批' },
          { src: '/images/screens/m-detail.webp', title: '审批详情' },
          { src: '/images/screens/m-create.webp', title: '发起申请' },
          { src: '/images/screens/m-form.webp', title: '填写表单' },
          { src: '/images/screens/m-im-dingtalk.jpg', title: '钉钉工作通知' },
          { src: '/images/screens/m-im-wecom.jpg', title: '企微应用消息' },
          { src: '/images/screens/m-im-feishu.jpg', title: '飞书消息卡片' },
        ],
      }
)
</script>

<template>
  <div class="gallery-page">
    <div class="gallery-inner">
      <section class="g-group">
        <h2 class="g-title">{{ T.desktopTitle }}</h2>
        <p class="g-desc">{{ T.desktopDesc }}</p>
        <div class="g-grid">
          <figure v-for="it in T.items" :key="it.src" class="g-card">
            <div class="g-shot">
              <img :src="it.src" :alt="`${it.title} — ${it.desc}`" loading="lazy" width="1600" height="900" />
            </div>
            <figcaption>
              <div class="g-name">{{ it.title }}</div>
              <div class="g-sub">{{ it.desc }}</div>
            </figcaption>
          </figure>
        </div>
      </section>

      <section class="g-group">
        <h2 class="g-title">{{ T.mobileTitle }}</h2>
        <p class="g-desc">{{ T.mobileDesc }}</p>
        <div class="g-phones">
          <figure v-for="p in T.phones" :key="p.src" class="g-phone">
            <div class="g-screen">
              <span class="g-notch"></span>
              <img :src="p.src" :alt="p.title" loading="lazy" width="585" height="996" />
            </div>
            <figcaption>{{ p.title }}</figcaption>
          </figure>
        </div>
      </section>

      <div class="g-cta">
        <a class="gf-btn gf-btn-primary" :href="DEMO_URL" target="_blank" rel="noopener">{{ T.demo }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-page {
  padding: 8px 0 64px;
}

.gallery-inner {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

.g-group {
  margin-top: 40px;
}

.g-title {
  font-size: 22px;
  margin: 0 0 6px;
}

.g-desc {
  margin: 0 0 22px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.g-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px;
}

@media (max-width: 832px) {
  .g-grid { grid-template-columns: 1fr; }
}

.g-card {
  margin: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg);
  transition: box-shadow 0.25s, transform 0.25s;
}

.g-card:hover {
  box-shadow: 0 18px 40px -22px rgba(15, 42, 82, 0.4);
  transform: translateY(-2px);
}

.g-shot {
  background: #f5f7fa;
  line-height: 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.g-shot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.g-card figcaption {
  padding: 12px 16px 14px;
  border-top: 1px solid var(--vp-c-divider);
}

.g-name {
  font-weight: 600;
  font-size: 15px;
}

.g-sub {
  margin-top: 2px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.g-phones {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.g-phone {
  margin: 0;
  text-align: center;
}

.g-screen {
  position: relative;
  width: 188px;
  margin: 0 auto;
  border-radius: 26px;
  border: 5px solid #10233f;
  background: #10233f;
  overflow: hidden;
  box-shadow: 0 26px 48px -26px rgba(15, 42, 82, 0.55);
}

.g-screen img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 20px;
}

.g-notch {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 9px;
  border-radius: 6px;
  background: #10233f;
  z-index: 1;
}

.g-phone figcaption {
  margin-top: 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.g-cta {
  margin-top: 48px;
  text-align: center;
}
</style>
