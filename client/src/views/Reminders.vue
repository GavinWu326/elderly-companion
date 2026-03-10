<template>
  <div class="reminders-page">
    <div class="page-header">
      <div class="header-title-wrap">
        <h1 class="header-title">生活提醒</h1>
        <p class="header-sub">今日 {{ todayStr }}</p>
      </div>
      <button class="add-fab" @click="showAddDialog = true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="reminder-list">
      <div
        v-for="reminder in reminders"
        :key="reminder.id"
        :class="['reminder-card', reminder.status]"
        @click="handleComplete(reminder)"
      >
        <div :class="['reminder-icon-wrap', reminder.type]">
          <span class="reminder-icon-emoji">{{ getReminderIcon(reminder.type) }}</span>
        </div>
        <div class="reminder-body">
          <div class="reminder-title">{{ reminder.title }}</div>
          <div v-if="reminder.content" class="reminder-desc">{{ reminder.content }}</div>
          <div class="reminder-time-row">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2" fill="none"/>
              <path d="M6 3.5V6L7.8 7.8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            {{ formatTime(reminder.remind_time) }}
          </div>
        </div>
        <div v-if="reminder.status === 'completed'" class="done-badge">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="9" fill="#2E9E6B"/>
            <path d="M5 9L7.5 11.5L13 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div v-if="reminders.length === 0" class="empty-state">
        <div class="empty-illustration">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
            <circle cx="45" cy="45" r="45" fill="#FEF3EC"/>
            <circle cx="45" cy="45" r="32" stroke="#F4A461" stroke-width="2" fill="none" stroke-dasharray="5 4"/>
            <circle cx="45" cy="35" r="12" stroke="#E07B39" stroke-width="2.5" fill="none"/>
            <path d="M45 28V35L49 39" stroke="#E07B39" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M33 57C33 50.9 38.4 46 45 46C51.6 46 57 50.9 57 57" stroke="#E07B39" stroke-width="2.5" stroke-linecap="round" fill="none"/>
          </svg>
        </div>
        <p class="empty-title">暂无提醒</p>
        <p class="empty-sub">点击右上角 + 添加第一个提醒</p>
      </div>
    </div>

    <t-dialog
      v-model:visible="showAddDialog"
      header="添加提醒"
      width="90%"
      :confirm-btn="null"
    >
      <div class="add-form">
        <div class="form-group">
          <label class="form-label">提醒类型</label>
          <t-select v-model="newReminder.type" placeholder="请选择类型" size="large">
            <t-option value="medication">💊 服药</t-option>
            <t-option value="checkup">🏥 复诊</t-option>
            <t-option value="water">💧 喝水</t-option>
            <t-option value="custom">📌 自定义</t-option>
          </t-select>
        </div>
        <div class="form-group">
          <label class="form-label">提醒内容 *</label>
          <t-input v-model="newReminder.title" placeholder="如：服降压药" size="large" />
        </div>
        <div class="form-group">
          <label class="form-label">详细说明</label>
          <t-textarea v-model="newReminder.content" placeholder="选填，如注意事项" :autosize="{ minRows: 2, maxRows: 4 }" />
        </div>
        <div class="form-group">
          <label class="form-label">提醒时间 *</label>
          <t-input v-model="newReminder.remind_time" type="datetime-local" size="large" />
        </div>
        <t-button theme="primary" size="large" block @click="handleAddReminder" style="border-radius:14px;letter-spacing:2px">
          保存提醒
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
      <router-link to="/reminders" class="nav-item active">
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
import { ref, computed, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '../stores/user'
import axios from 'axios'

const userStore = useUserStore()
const showAddDialog = ref(false)
const reminders = ref([])

const newReminder = ref({
  type: 'custom',
  title: '',
  content: '',
  remind_time: ''
})

const todayStr = computed(() => {
  return new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
})

onMounted(async () => {
  await fetchReminders()
})

const fetchReminders = async () => {
  try {
    const response = await axios.get(`/api/reminder/user/${userStore.user.id}`)
    reminders.value = response.data.reminders
  } catch (error) {
    console.error('获取提醒失败:', error)
  }
}

const handleAddReminder = async () => {
  if (!newReminder.value.title || !newReminder.value.remind_time) {
    MessagePlugin.warning('请填写完整信息')
    return
  }
  try {
    await axios.post('/api/reminder', {
      user_id: userStore.user.id,
      ...newReminder.value
    })
    MessagePlugin.success('添加成功')
    showAddDialog.value = false
    await fetchReminders()
    newReminder.value = { type: 'custom', title: '', content: '', remind_time: '' }
  } catch (error) {
    MessagePlugin.error('添加失败')
  }
}

const handleComplete = async (reminder) => {
  if (reminder.status === 'completed') return
  try {
    await axios.put(`/api/reminder/${reminder.id}/status`, { status: 'completed' })
    MessagePlugin.success('已完成')
    await fetchReminders()
  } catch (error) {
    MessagePlugin.error('操作失败')
  }
}

const getReminderIcon = (type) => {
  const icons = { medication: '💊', checkup: '🏥', water: '💧', custom: '📌' }
  return icons[type] || '📌'
}

const getReminderColor = (type) => {
  const colors = {
    medication: '#E07B39',
    checkup: '#3A8FD4',
    water: '#3AB8D4',
    custom: '#9B6DD4'
  }
  return colors[type] || '#9B6DD4'
}

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.reminders-page {
  min-height: 100vh;
  background: var(--c-bg);
  padding-bottom: 80px;
}

.page-header {
  background: linear-gradient(135deg, #F4A461 0%, #E07B39 100%);
  padding: 24px 20px 20px;
  padding-top: max(24px, env(safe-area-inset-top));
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(224, 123, 57, 0.3);
}

.header-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 26px;
  font-weight: 700;
  color: white;
  letter-spacing: 2px;
}

.header-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

.add-fab {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.25);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.2s;
}

.add-fab:active {
  transform: scale(0.93);
}

.reminder-list {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reminder-card {
  background: white;
  border-radius: 18px;
  padding: 18px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--c-divider);
}

.reminder-card:active {
  transform: scale(0.98);
}

.reminder-card.completed {
  opacity: 0.55;
}

.reminder-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--c-primary-pale);
}

.reminder-icon-wrap.medication { background: #FEF3EC; }
.reminder-icon-wrap.checkup { background: #EBF4FD; }
.reminder-icon-wrap.water { background: #E8F7FA; }
.reminder-icon-wrap.custom { background: #F3EFFE; }

.reminder-icon-emoji {
  font-size: 26px;
}

.reminder-body {
  flex: 1;
  min-width: 0;
}

.reminder-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--c-text);
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reminder-desc {
  font-size: 14px;
  color: var(--c-text-2);
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reminder-time-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--c-text-3);
}

.done-badge {
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-illustration {
  margin-bottom: 8px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--c-text-2);
}

.empty-sub {
  font-size: 14px;
  color: var(--c-text-3);
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: var(--c-text-2);
  padding-left: 2px;
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
