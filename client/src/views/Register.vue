<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="title">注册账号</h1>

      <div class="form">
        <t-input
          v-model="phone"
          size="large"
          placeholder="请输入手机号"
          type="tel"
          :maxlength="11"
          class="input-field"
        />

        <t-input
          v-model="name"
          size="large"
          placeholder="您的姓名（选填）"
          class="input-field"
        />

        <t-input
          v-model.number="age"
          size="large"
          placeholder="您的年龄"
          type="number"
          class="input-field"
        />

        <t-input
          v-model="healthStatus"
          size="large"
          placeholder="健康状况（如：高血压、糖尿病）"
          class="input-field"
        />

        <t-button
          size="large"
          theme="primary"
          block
          :disabled="!isValidForm"
          :loading="loading"
          @click="handleRegister"
        >
          注册
        </t-button>
      </div>

      <div class="footer">
        <span>已有账号？</span>
        <router-link to="/login" class="link">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const phone = ref('')
const name = ref('')
const age = ref('')
const healthStatus = ref('')
const loading = ref(false)

const isValidForm = computed(() => {
  return /^1[3-9]\d{9}$/.test(phone.value) && age.value > 0
})

const handleRegister = async () => {
  loading.value = true
  try {
    await userStore.register({
      phone: phone.value,
      name: name.value,
      age: age.value,
      health_status: healthStatus.value,
      voice_preference: 'female'
    })
    MessagePlugin.success('注册成功')
    router.push('/setup')
  } catch (error) {
    MessagePlugin.error(error.response?.data?.error || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
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
