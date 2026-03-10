<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="avatar-wrap">
        <div class="avatar">{{ avatarChar }}</div>
        <div class="avatar-ring"></div>
      </div>
      <div class="user-info">
        <div class="user-name">{{ userStore.user?.name || '未设置姓名' }}</div>
        <div class="user-phone">{{ userStore.user?.phone }}</div>
      </div>
    </div>

    <div class="menu-section">
      <div class="menu-card">
        <div class="menu-item" @click="openRecords">
          <div class="menu-icon-wrap" style="background:#FEF3EC">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="2" width="16" height="18" rx="3" stroke="#E07B39" stroke-width="1.8" fill="none"/>
              <path d="M7 7H15M7 11H15M7 15H11" stroke="#E07B39" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="menu-label">查看记录</div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="#B89988" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>

        <div class="menu-divider"></div>

        <div class="menu-item" @click="showEmergencyContacts = true">
          <div class="menu-icon-wrap" style="background:#EBF4FD">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="8" cy="7" r="4" stroke="#3A8FD4" stroke-width="1.8" fill="none"/>
              <path d="M2 19C2 15.69 4.69 13 8 13" stroke="#3A8FD4" stroke-width="1.8" stroke-linecap="round" fill="none"/>
              <path d="M14 13C14 13 16.5 12 18 14C19.5 16 18.5 18 18.5 18L16.5 20" stroke="#3A8FD4" stroke-width="1.8" stroke-linecap="round" fill="none"/>
            </svg>
          </div>
          <div class="menu-label">紧急联系人</div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="#B89988" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>

        <div class="menu-divider"></div>

        <div class="menu-item" @click="showSettings = true">
          <div class="menu-icon-wrap" style="background:#F3EFFE">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="3" stroke="#9B6DD4" stroke-width="1.8" fill="none"/>
              <path d="M11 2V4.5M11 17.5V20M2 11H4.5M17.5 11H20M4.4 4.4L6.2 6.2M15.8 15.8L17.6 17.6M4.4 17.6L6.2 15.8M15.8 6.2L17.6 4.4" stroke="#9B6DD4" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="menu-label">设置</div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="#B89988" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      <div class="menu-card" style="margin-top:12px">
        <div class="menu-item danger" @click="handleLogout">
          <div class="menu-icon-wrap" style="background:#FDECEA">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M9 3H4C3.4 3 3 3.4 3 4V18C3 18.6 3.4 19 4 19H9" stroke="#C0392B" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M15 15L19 11L15 7" stroke="#C0392B" stroke-width="1.8" stroke-linecap="round"/>
              <path d="M8 11H19" stroke="#C0392B" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="menu-label" style="color:#C0392B">退出登录</div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="#E07B39" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </div>

    <t-dialog v-model:visible="showRecords" header="使用记录" width="92%">
      <div class="records-content">
        <div class="record-tabs">
          <div :class="['tab', activeTab === 'conversations' ? 'active' : '']" @click="activeTab = 'conversations'">对话</div>
          <div :class="['tab', activeTab === 'reminders' ? 'active' : '']" @click="activeTab = 'reminders'">提醒</div>
          <div :class="['tab', activeTab === 'emergencies' ? 'active' : '']" @click="activeTab = 'emergencies'">应急</div>
        </div>
        <div class="record-list">
          <div v-if="records.length === 0" class="empty-records">暂无记录</div>
          <div v-for="record in records" :key="record.id" class="record-item">
            <div class="record-text">{{ record.content || record.title || record.description }}</div>
            <div class="record-time">{{ formatTime(record.created_at || record.remind_time) }}</div>
          </div>
        </div>
      </div>
    </t-dialog>

    <t-dialog v-model:visible="showEmergencyContacts" header="紧急联系人" width="92%">
      <div class="contacts-content">
        <div v-for="contact in userStore.contacts" :key="contact.id" class="contact-row">
          <div class="contact-avatar">{{ contact.name.slice(-1) }}</div>
          <div class="contact-info">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="contact-detail">{{ contact.phone }} · {{ contact.relationship }}</div>
          </div>
          <t-button size="small" theme="danger" @click="handleDeleteContact(contact.id)">删除</t-button>
        </div>
        <t-button theme="primary" size="large" block style="margin-top:16px" @click="showEmergencyContacts = false">关闭</t-button>
      </div>
    </t-dialog>

    <t-dialog v-model:visible="showSettings" header="偏好设置" width="92%">
      <div class="settings-content">
        <div class="settings-label">语音偏好</div>
        <t-radio-group v-model="voicePreference" class="radio-group">
          <t-radio value="female">女声（温柔）</t-radio>
          <t-radio value="male">男声（沉稳）</t-radio>
        </t-radio-group>
        <t-button theme="primary" size="large" block style="margin-top:24px;border-radius:14px" @click="handleSaveSettings">
          保存设置
        </t-button>
      </div>
    </t-dialog>

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
      <router-link to="/emergency" class="nav-item emergency">
        <div class="sos-btn">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 4.5C4 4.5 5.5 2 8 2C10.5 2 12 4 12 4L15.5 7.5C15.5 7.5 17 9 17 11.5C17 14 15 16 15 16L12 19C12 19 10 21 7.5 21C5 21 3 19 3 19L4 18C4 18 2 16 2 13.5C2 11 4 9 4 9L7.5 5.5" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/>
          </svg>
          <span>应急</span>
        </div>
      </router-link>
      <router-link to="/profile" class="nav-item active">
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()

const showRecords = ref(false)
const showEmergencyContacts = ref(false)
const showSettings = ref(false)
const activeTab = ref('conversations')
const records = ref([])
const voicePreference = ref('female')

const avatarChar = computed(() => {
  const name = userStore.user?.name
  return name ? name.slice(-1) : '友'
})

onMounted(async () => {
  await userStore.fetchUserInfo()
  voicePreference.value = userStore.user?.voice_preference || 'female'
})

const openRecords = async () => {
  showRecords.value = true
  await fetchRecords(activeTab.value)
}

watch(activeTab, async (newTab) => {
  await fetchRecords(newTab)
})

const fetchRecords = async (type) => {
  try {
    let response
    if (type === 'conversations') {
      response = await axios.get(`/api/conversation/user/${userStore.user.id}`)
      records.value = response.data.conversations
    } else if (type === 'reminders') {
      response = await axios.get(`/api/reminder/user/${userStore.user.id}`)
      records.value = response.data.reminders
    } else if (type === 'emergencies') {
      response = await axios.get(`/api/emergency/user/${userStore.user.id}`)
      records.value = response.data.records
    }
  } catch (error) {
    console.error('获取记录失败:', error)
  }
}

const handleDeleteContact = async (contactId) => {
  try {
    await userStore.deleteContact(contactId)
    MessagePlugin.success('删除成功')
  } catch (error) {
    MessagePlugin.error('删除失败')
  }
}

const handleSaveSettings = async () => {
  try {
    await userStore.updateUserInfo({ voice_preference: voicePreference.value })
    MessagePlugin.success('保存成功')
    showSettings.value = false
  } catch (error) {
    MessagePlugin.error('保存失败')
  }
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/login')
  }
}

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--c-bg);
  padding-bottom: 80px;
}

.profile-header {
  background: linear-gradient(135deg, #F4A461 0%, #E07B39 100%);
  padding: 36px 24px 40px;
  padding-top: max(36px, env(safe-area-inset-top));
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 20px rgba(224, 123, 57, 0.3);
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: white;
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-name {
  font-family: 'Noto Serif SC', serif;
  font-size: 24px;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
  margin-bottom: 6px;
}

.user-phone {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.menu-section {
  padding: 20px 16px;
}

.menu-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--c-divider);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 18px 16px;
  gap: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:active {
  background: var(--c-bg);
}

.menu-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-label {
  flex: 1;
  font-size: 17px;
  color: var(--c-text);
  font-weight: 500;
}

.menu-divider {
  height: 1px;
  background: var(--c-divider);
  margin: 0 16px;
}

.records-content {
  max-height: 50vh;
  overflow-y: auto;
}

.record-tabs {
  display: flex;
  border-bottom: 1.5px solid var(--c-divider);
  margin-bottom: 16px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 12px;
  font-size: 15px;
  cursor: pointer;
  color: var(--c-text-3);
  border-bottom: 2.5px solid transparent;
  transition: all 0.2s;
}

.tab.active {
  color: var(--c-primary);
  border-bottom-color: var(--c-primary);
  font-weight: 600;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-records {
  text-align: center;
  padding: 32px 20px;
  color: var(--c-text-3);
  font-size: 15px;
}

.record-item {
  background: var(--c-bg);
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--c-divider);
}

.record-text {
  font-size: 15px;
  color: var(--c-text);
  line-height: 1.5;
}

.record-time {
  font-size: 12px;
  color: var(--c-text-3);
  margin-top: 6px;
}

.contacts-content {
  max-height: 50vh;
  overflow-y: auto;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--c-divider);
}

.contact-row:last-of-type {
  border-bottom: none;
}

.contact-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #F4A461, #E07B39);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}

.contact-info {
  flex: 1;
}

.contact-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
}

.contact-detail {
  font-size: 13px;
  color: var(--c-text-3);
  margin-top: 2px;
}

.settings-content {
  padding: 8px 0;
}

.settings-label {
  font-size: 15px;
  color: var(--c-text-2);
  margin-bottom: 14px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  color: var(--c-primary);
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
