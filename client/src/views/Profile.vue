<template>
  <div class="profile-container">
    <div class="header">
      <h1>我的</h1>
    </div>

    <div class="profile-info">
      <div class="avatar">
        <UserIcon :size="60" />
      </div>
      <div class="user-details">
        <div class="user-name">{{ userStore.user?.name || '未设置姓名' }}</div>
        <div class="user-phone">{{ userStore.user?.phone }}</div>
      </div>
    </div>

    <div class="menu-list">
      <div class="menu-item" @click="showRecords = true">
        <div class="menu-icon">📊</div>
        <div class="menu-text">查看记录</div>
        <div class="menu-arrow">›</div>
      </div>

      <div class="menu-item" @click="showEmergencyContacts = true">
        <div class="menu-icon">👨‍👩‍👧</div>
        <div class="menu-text">紧急联系人</div>
        <div class="menu-arrow">›</div>
      </div>

      <div class="menu-item" @click="showSettings = true">
        <div class="menu-icon">⚙️</div>
        <div class="menu-text">设置</div>
        <div class="menu-arrow">›</div>
      </div>

      <div class="menu-item danger" @click="handleLogout">
        <div class="menu-icon">🚪</div>
        <div class="menu-text">退出登录</div>
        <div class="menu-arrow">›</div>
      </div>
    </div>

    <t-dialog v-model:visible="showRecords" header="使用记录" width="90%">
      <div class="records-content">
        <div class="record-tabs">
          <div
            :class="['tab', activeTab === 'conversations' ? 'active' : '']"
            @click="activeTab = 'conversations'"
          >
            对话记录
          </div>
          <div
            :class="['tab', activeTab === 'reminders' ? 'active' : '']"
            @click="activeTab = 'reminders'"
          >
            提醒记录
          </div>
          <div
            :class="['tab', activeTab === 'emergencies' ? 'active' : '']"
            @click="activeTab = 'emergencies'"
          >
            应急记录
          </div>
        </div>
        <div class="record-list">
          <div v-if="records.length === 0" class="empty-records">
            暂无记录
          </div>
          <div v-for="record in records" :key="record.id" class="record-item">
            {{ record.content || record.title || record.description }}
            <div class="record-time">{{ formatTime(record.created_at || record.remind_time) }}</div>
          </div>
        </div>
      </div>
    </t-dialog>

    <t-dialog v-model:visible="showEmergencyContacts" header="紧急联系人" width="90%">
      <div class="contacts-content">
        <div
          v-for="contact in userStore.contacts"
          :key="contact.id"
          class="contact-item"
        >
          <div class="contact-info">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="contact-detail">{{ contact.phone }} · {{ contact.relationship }}</div>
          </div>
          <t-button size="small" theme="danger" @click="handleDeleteContact(contact.id)">
            删除
          </t-button>
        </div>
        <t-button theme="primary" size="large" block @click="showEmergencyContacts = false">
          关闭
        </t-button>
      </div>
    </t-dialog>

    <t-dialog v-model:visible="showSettings" header="设置" width="90%">
      <div class="settings-content">
        <t-form label-align="top">
          <t-form-item label="语音偏好">
            <t-radio-group v-model="voicePreference">
              <t-radio value="female">女声</t-radio>
              <t-radio value="male">男声</t-radio>
            </t-radio-group>
          </t-form-item>
        </t-form>
        <t-button theme="primary" size="large" block @click="handleSaveSettings">
          保存
        </t-button>
      </div>
    </t-dialog>

    <div class="bottom-nav">
      <router-link to="/" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">聊天</span>
      </router-link>
      <router-link to="/reminders" class="nav-item">
        <span class="nav-icon">📋</span>
        <span class="nav-text">提醒</span>
      </router-link>
      <router-link to="/emergency" class="nav-item emergency">
        <span class="nav-icon">📞</span>
        <span class="nav-text">应急</span>
      </router-link>
      <router-link to="/profile" class="nav-item active">
        <span class="nav-icon">👤</span>
        <span class="nav-text">我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { UserIcon } from 'tdesign-icons-vue-next'
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

onMounted(async () => {
  await userStore.fetchUserInfo()
  voicePreference.value = userStore.user?.voice_preference || 'female'
})

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
.profile-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
}

.header h1 {
  font-size: 24px;
  margin: 0;
}

.profile-info {
  background: white;
  padding: 30px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.user-phone {
  font-size: 16px;
  color: #999;
}

.menu-list {
  background: white;
  margin: 0 20px;
  border-radius: 12px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background-color: #f5f5f5;
}

.menu-icon {
  font-size: 28px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-text {
  flex: 1;
  font-size: 18px;
  color: #333;
}

.menu-arrow {
  font-size: 30px;
  color: #999;
}

.menu-item.danger {
  color: #ff4b2b;
}

.menu-item.danger .menu-text {
  color: #ff4b2b;
}

.records-content {
  max-height: 400px;
  overflow-y: auto;
}

.record-tabs {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 20px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 15px;
  font-size: 16px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.empty-records {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.record-item {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.record-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.contacts-content {
  max-height: 400px;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #e5e5e5;
}

.contact-info {
  flex: 1;
}

.contact-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.contact-detail {
  font-size: 14px;
  color: #999;
}

.settings-content {
  padding: 20px 0;
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
  color: #667eea;
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
