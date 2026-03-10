<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo">
        <UserIcon :size="80" />
      </div>
      <h1 class="title">老人陪伴助手</h1>
      <p class="subtitle">像家人一样陪您聊天，关键时刻能救命</p>

      <div class="form">
        <t-input
          v-model="phone"
          size="large"
          placeholder="请输入手机号"
          type="tel"
          :maxlength="11"
          class="input-field"
        />

        <t-button
          size="large"
          theme="primary"
          block
          :disabled="!isValidPhone"
          :loading="loading"
          @click="handleLogin"
        >
          登录
        </t-button>
      </div>

      <div class="footer">
        <span>还没有账号？</span>
        <router-link to="/register" class="link">去注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { UserIcon } from 'tdesign-icons-vue-next'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const phone = ref('')
const loading = ref(false)

const isValidPhone = computed(() => {
  return /^1[3-9]\d{9}$/.test(phone.value)
})

const handleLogin = async () => {
  if (!isValidPhone.value) {
    MessagePlugin.warning('请输入正确的手机号')
    return
  }

  loading.value = true
  try {
    await userStore.login(phone.value)
    MessagePlugin.success('登录成功')
    router.push('/')
  } catch (error) {
    MessagePlugin.error(error.response?.data?.error || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.logo {
  color: #667eea;
  margin-bottom: 20px;
}

.title {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-field {
  font-size: 18px !important;
}

.footer {
  margin-top: 30px;
  font-size: 16px;
  color: #666;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
  margin-left: 5px;
}

.link:active {
  opacity: 0.7;
}
</style>
