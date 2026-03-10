<template>
  <div class="emergency-container">
    <div class="emergency-header">
      <h1>紧急求助</h1>
      <p>遇到紧急情况时请使用</p>
    </div>

    <div class="emergency-content">
      <div class="emergency-alert">
        <div class="alert-icon">⚠️</div>
        <div class="alert-text">紧急模式</div>
      </div>

      <div class="emergency-actions">
        <button class="emergency-btn emergency-call" @click="handleCall120">
          <div class="btn-icon">📞</div>
          <div class="btn-text">拨打 120</div>
        </button>

        <button
          v-for="contact in contacts"
          :key="contact.id"
          class="emergency-btn contact-call"
          @click="handleCallContact(contact.phone)"
        >
          <div class="btn-icon">👨‍👩‍👧</div>
          <div class="btn-info">
            <div class="btn-text">{{ contact.name }}</div>
            <div class="btn-rel">{{ contact.relationship }}</div>
          </div>
        </button>
      </div>

      <div class="emergency-guide">
        <h2>应急指南</h2>
        <div class="guide-list">
          <div class="guide-item">
            <div class="guide-icon">1</div>
            <div class="guide-text">保持冷静，深呼吸</div>
          </div>
          <div class="guide-item">
            <div class="guide-icon">2</div>
            <div class="guide-text">点击上方按钮拨打急救电话</div>
          </div>
          <div class="guide-item">
            <div class="guide-icon">3</div>
            <div class="guide-text">告知您的具体位置和情况</div>
          </div>
          <div class="guide-item">
            <div class="guide-icon">4</div>
            <div class="guide-text">打开房门，方便救援人员进入</div>
          </div>
        </div>
      </div>

      <button class="back-btn" @click="handleBack">
        我现在没事了
      </button>
    </div>

    <div class="bottom-nav">
      <router-link to="/" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">聊天</span>
      </router-link>
      <router-link to="/reminders" class="nav-item">
        <span class="nav-icon">📋</span>
        <span class="nav-text">提醒</span>
      </router-link>
      <router-link to="/emergency" class="nav-item active emergency">
        <span class="nav-icon">📞</span>
        <span class="nav-text">应急</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span class="nav-icon">👤</span>
        <span class="nav-text">我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()

const contacts = ref([])

onMounted(async () => {
  await userStore.fetchUserInfo()
  contacts.value = userStore.contacts

  // 记录访问应急页面
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
.emergency-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ff4b2b 0%, #ff416c 100%);
  padding-bottom: 80px;
}

.emergency-header {
  color: white;
  text-align: center;
  padding: 30px 20px;
}

.emergency-header h1 {
  font-size: 32px;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.emergency-header p {
  font-size: 18px;
  margin: 0;
}

.emergency-content {
  padding: 20px;
}

.emergency-alert {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.alert-icon {
  font-size: 60px;
  margin-bottom: 15px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.alert-text {
  font-size: 28px;
  font-weight: bold;
  color: #ff4b2b;
}

.emergency-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.emergency-btn {
  background: white;
  border: none;
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.emergency-btn:active {
  transform: scale(0.98);
}

.emergency-btn.emergency-call {
  background: linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%);
  color: white;
}

.emergency-btn.contact-call {
  background: white;
  color: #333;
}

.btn-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.emergency-btn.contact-call .btn-icon {
  background: #f5f5f5;
}

.btn-info {
  flex: 1;
  text-align: left;
}

.btn-text {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.btn-rel {
  font-size: 16px;
  opacity: 0.8;
}

.emergency-guide {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 30px;
}

.emergency-guide h2 {
  font-size: 22px;
  color: #333;
  margin: 0 0 20px 0;
}

.guide-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.guide-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.guide-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  flex-shrink: 0;
}

.guide-text {
  font-size: 18px;
  color: #333;
  flex: 1;
}

.back-btn {
  width: 100%;
  padding: 20px;
  background: white;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-btn:active {
  transform: scale(0.98);
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
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #999;
  text-decoration: none;
  font-size: 14px;
  padding: 10px 20px;
}

.nav-item.active {
  color: #ff4b2b;
}

.nav-item.emergency {
  color: #ff4b2b;
  font-weight: bold;
}

.nav-icon {
  font-size: 24px;
}

.nav-text {
  font-size: 14px;
}
</style>
