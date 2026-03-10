<template>
  <div class="reminders-container">
    <div class="header">
      <h1>生活提醒</h1>
      <t-button theme="primary" size="large" @click="showAddDialog = true">
        添加提醒
      </t-button>
    </div>

    <div class="reminder-list">
      <div
        v-for="reminder in reminders"
        :key="reminder.id"
        :class="['reminder-card', reminder.status]"
        @click="handleComplete(reminder)"
      >
        <div class="reminder-icon">
          {{ getReminderIcon(reminder.type) }}
        </div>
        <div class="reminder-content">
          <div class="reminder-title">{{ reminder.title }}</div>
          <div v-if="reminder.content" class="reminder-desc">{{ reminder.content }}</div>
          <div class="reminder-time">{{ formatTime(reminder.remind_time) }}</div>
        </div>
        <div v-if="reminder.status === 'completed'" class="reminder-check">✓</div>
      </div>

      <div v-if="reminders.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <p>暂无提醒</p>
        <p>点击"添加提醒"开始使用</p>
      </div>
    </div>

    <t-dialog
      v-model:visible="showAddDialog"
      header="添加提醒"
      width="90%"
      :confirm-btn="null"
    >
      <div class="add-form">
        <t-select v-model="newReminder.type" placeholder="选择类型" size="large">
          <t-option value="medication">服药</t-option>
          <t-option value="checkup">复诊</t-option>
          <t-option value="water">喝水</t-option>
          <t-option value="custom">自定义</t-option>
        </t-select>

        <t-input v-model="newReminder.title" placeholder="提醒内容" size="large" />

        <t-textarea v-model="newReminder.content" placeholder="详细说明（选填）" size="large" />

        <t-input
          v-model="newReminder.remind_time"
          type="datetime-local"
          placeholder="提醒时间"
          size="large"
        />

        <t-button theme="primary" size="large" block @click="handleAddReminder">
          保存提醒
        </t-button>
      </div>
    </t-dialog>

    <div class="bottom-nav">
      <router-link to="/" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">聊天</span>
      </router-link>
      <router-link to="/reminders" class="nav-item active">
        <span class="nav-icon">📋</span>
        <span class="nav-text">提醒</span>
      </router-link>
      <router-link to="/emergency" class="nav-item emergency">
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
import { MessagePlugin } from 'tdesign-vue-next'
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
  const icons = {
    medication: '💊',
    checkup: '🏥',
    water: '💧',
    custom: '📌'
  }
  return icons[type] || '📌'
}

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.reminders-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 24px;
  margin: 0;
}

.reminder-list {
  padding: 20px;
}

.reminder-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.reminder-card.completed {
  opacity: 0.6;
}

.reminder-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 10px;
}

.reminder-content {
  flex: 1;
}

.reminder-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.reminder-desc {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}

.reminder-time {
  font-size: 14px;
  color: #999;
}

.reminder-check {
  width: 40px;
  height: 40px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 18px;
  margin: 10px 0;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
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
