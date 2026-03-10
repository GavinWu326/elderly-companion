<template>
  <div class="emergency-page">
    <div class="emergency-header">
      <div class="sos-badge">
        <div class="sos-pulse"></div>
        <span class="sos-text">SOS</span>
      </div>
      <h1 class="emergency-title">紧急求助</h1>
      <p class="emergency-sub">请保持冷静，选择下方操作</p>
    </div>

    <div class="emergency-content">
      <button class="call-120-btn" @click="handleCall120">
        <div class="call-icon-wrap">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M7 7C7 7 10.5 4 14 4C17.5 4 20 7 20 7L24.5 11.5C24.5 11.5 27 14 27 17C27 20 24.5 22.5 24.5 22.5L20 27C20 27 17 30 13.5 30C10 30 7.5 27.5 7.5 27.5L9 26C9 26 5.5 23 5.5 19.5C5.5 16 8.5 13 8.5 13L12 9.5" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          </svg>
        </div>
        <div class="call-info">
          <div class="call-num">拨打 120</div>
          <div class="call-desc">急救中心 · 立即派车</div>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <div v-if="contacts.length > 0" class="contacts-section">
        <div class="section-label">家人联系人</div>
        <button
          v-for="contact in contacts"
          :key="contact.id"
          class="contact-btn"
          @click="handleCallContact(contact.phone)"
        >
          <div class="contact-avatar">{{ contact.name.slice(-1) }}</div>
          <div class="contact-info">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="contact-rel">{{ contact.relationship }} · {{ contact.phone }}</div>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 6.5C6 6.5 8.5 4 11 4C13.5 4 15 6 15 6L18.5 9.5C18.5 9.5 20 11 20 13.5C20 16 18 18 18 18L15 21C15 21 13 23 10.5 23C8 23 6 21 6 21L7 20C7 20 4 17 4 14.5C4 12 6.5 10 6.5 10" stroke="#E07B39" stroke-width="1.8" stroke-linecap="round" fill="none"/>
          </svg>
        </button>
      </div>

      <div class="guide-card">
        <div class="guide-header">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8.5" stroke="#E07B39" stroke-width="1.2" fill="none"/>
            <path d="M9 8V13" stroke="#E07B39" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="9" cy="5.5" r="1" fill="#E07B39"/>
          </svg>
          <span>应急指南</span>
        </div>
        <div class="guide-steps">
          <div v-for="(step, i) in steps" :key="i" class="guide-step">
            <div class="step-num">{{ i + 1 }}</div>
            <div class="step-text">{{ step }}</div>
          </div>
        </div>
      </div>

      <button class="safe-btn" @click="handleBack">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L12.5 7.5L18.5 8L14 12.5L15 18.5L10 15.5L5 18.5L6 12.5L1.5 8L7.5 7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
        </svg>
        我现在没事了，返回
      </button>
    </div>

    <nav class="bottom-nav">
      <router-link to="/" class="nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 12L12 4L20 12V21H15V15H9V21H4V12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="none"/>
        </svg>
        <span>聊天</span>
      </router-link>
      <router-link to="/reminders" class="nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span>提醒</span>
      </router-link>
      <router-link to="/emergency" class="nav-item active emergency">
        <div class="sos-btn active">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 4.5C4 4.5 5.5 2 8 2C10.5 2 12 4 12 4L15.5 7.5C15.5 7.5 17 9 17 11.5C17 14 15 16 15 16L12 19C12 19 10 21 7.5 21C5 21 3 19 3 19L4 18C4 18 2 16 2 13.5C2 11 4 9 4 9L7.5 5.5" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/>
          </svg>
          <span>应急</span>
        </div>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        </svg>
        <span>我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()

const contacts = ref([])

const steps = [
  '保持冷静，深呼吸，不要慌张',
  '点击上方按钮拨打急救电话',
  '清楚说明您的位置和症状',
  '打开房门，方便救援人员进入',
]

onMounted(async () => {
  await userStore.fetchUserInfo()
  contacts.value = userStore.contacts

  await axios.post('/api/emergency', {
    user_id: userStore.user.id,
    risk_level: 'high',
    description: '用户主动访问应急页面',
    handling_result: '用户查看应急指南'
  })
})

const handleCall120 = () => {
  window.location.href = 'tel:120'
}

const handleCallContact = (phone) => {
  window.location.href = `tel:${phone}`
}

const handleBack = () => {
  router.push('/')
}
</script>

<style scoped>
.emergency-page {
  min-height: 100vh;
  background: #FFF5F5;
  padding-bottom: 80px;
}

.emergency-header {
  background: linear-gradient(160deg, #E85D50 0%, #C0392B 100%);
  padding: 32px 24px 40px;
  padding-top: max(32px, env(safe-area-inset-top));
  text-align: center;
  position: relative;
  overflow: hidden;
}

.emergency-header::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  top: -60px;
  right: -60px;
}

.sos-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 6px 16px;
  margin-bottom: 16px;
  backdrop-filter: blur(8px);
}

.sos-pulse {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  animation: sos-blink 1s infinite;
}

@keyframes sos-blink {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255,255,255,0.5); }
  50% { opacity: 0.5; box-shadow: 0 0 0 6px rgba(255,255,255,0); }
}

.sos-text {
  color: white;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
}

.emergency-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 32px;
  font-weight: 700;
  color: white;
  letter-spacing: 3px;
  margin-bottom: 8px;
}

.emergency-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.82);
}

.emergency-content {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.call-120-btn {
  background: linear-gradient(135deg, #E85D50, #C0392B);
  border: none;
  border-radius: 20px;
  padding: 22px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  box-shadow: 0 8px 30px rgba(192, 57, 43, 0.4);
  transition: all 0.2s;
  width: 100%;
}

.call-120-btn:active {
  transform: scale(0.98);
}

.call-icon-wrap {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.call-num {
  font-family: 'Noto Serif SC', serif;
  font-size: 26px;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
  text-align: left;
}

.call-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 4px;
  text-align: left;
}

.call-info {
  flex: 1;
}

.contacts-section {
  background: white;
  border-radius: 18px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--c-divider);
}

.section-label {
  font-size: 13px;
  color: var(--c-text-3);
  margin-bottom: 12px;
  padding: 0 4px;
  letter-spacing: 0.5px;
}

.contact-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  border-bottom: 1px solid var(--c-divider);
  transition: all 0.2s;
}

.contact-btn:last-child {
  border-bottom: none;
  padding-bottom: 2px;
}

.contact-btn:active {
  opacity: 0.7;
}

.contact-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #F4A461, #E07B39);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
  text-align: left;
}

.contact-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--c-text);
}

.contact-rel {
  font-size: 13px;
  color: var(--c-text-3);
  margin-top: 3px;
}

.guide-card {
  background: white;
  border-radius: 18px;
  padding: 18px 16px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--c-divider);
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text);
  margin-bottom: 16px;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-step {
  display: flex;
  align-items: center;
  gap: 14px;
}

.step-num {
  width: 30px;
  height: 30px;
  background: var(--c-primary-pale);
  color: var(--c-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-text {
  font-size: 16px;
  color: var(--c-text);
  line-height: 1.5;
}

.safe-btn {
  background: white;
  border: 1.5px solid var(--c-border);
  border-radius: 16px;
  padding: 18px;
  font-size: 17px;
  color: var(--c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}

.safe-btn:active {
  transform: scale(0.98);
  background: var(--c-bg);
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: white;
  padding: 10px 0;
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  box-shadow: 0 -1px 0 rgba(237, 216, 200, 0.8), 0 -4px 20px rgba(45, 26, 14, 0.07);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--c-text-3);
  text-decoration: none;
  font-size: 11px;
  padding: 6px 16px;
  border-radius: 12px;
  min-width: 60px;
}

.nav-item.active {
  color: var(--c-red);
}

.nav-item.emergency {
  padding: 0;
}

.sos-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: linear-gradient(145deg, #E85D50, #C0392B);
  color: white;
  padding: 10px 16px 8px;
  border-radius: 16px;
  font-size: 11px;
  box-shadow: 0 4px 16px rgba(192, 57, 43, 0.35);
  margin-top: -12px;
}
</style>
