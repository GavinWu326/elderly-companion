<template>
  <div class="register-page">
    <div class="login-deco">
      <div class="deco-circle c1"></div>
      <div class="deco-circle c2"></div>
    </div>

    <div class="page-top">
      <button class="back-btn" @click="$router.back()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-heading">创建账号</h1>
      <p class="page-sub">填写您的基本信息</p>
    </div>

    <div class="register-card">
      <div class="form-group">
        <label class="form-label">手机号码 <span class="required">*</span></label>
        <t-input v-model="phone" size="large" placeholder="请输入手机号" type="tel" :maxlength="11" />
      </div>

      <div class="form-group">
        <label class="form-label">您的姓名</label>
        <t-input v-model="name" size="large" placeholder="请输入姓名（选填）" />
      </div>

      <div class="form-group">
        <label class="form-label">年龄 <span class="required">*</span></label>
        <t-input v-model.number="age" size="large" placeholder="请输入年龄" type="number" />
      </div>

      <div class="form-group">
        <label class="form-label">健康状况</label>
        <t-input v-model="healthStatus" size="large" placeholder="如：高血压、糖尿病（选填）" />
      </div>

      <t-button
        size="large"
        theme="primary"
        block
        :disabled="!isValidForm"
        :loading="loading"
        @click="handleRegister"
        class="submit-btn"
      >
        注 册
      </t-button>

      <div class="card-footer">
        <span class="footer-text">已有账号？</span>
        <router-link to="/login" class="footer-link">去登录</router-link>
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
.register-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #F4A461 0%, #E07B39 40%, #C26025 100%);
  position: relative;
  overflow: hidden;
}

.login-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.c1 {
  width: 260px;
  height: 260px;
  top: -70px;
  right: -70px;
}

.c2 {
  width: 160px;
  height: 160px;
  top: 100px;
  left: -50px;
}

.page-top {
  position: relative;
  z-index: 1;
  padding: 56px 24px 32px;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 20px;
  backdrop-filter: blur(8px);
}

.page-heading {
  font-family: 'Noto Serif SC', 'SimSun', serif;
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  margin-bottom: 8px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.page-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.82);
}

.register-card {
  background: #fff;
  border-radius: 28px 28px 0 0;
  padding: 36px 28px 48px;
  min-height: 60vh;
  position: relative;
  z-index: 1;
  box-shadow: 0 -8px 40px rgba(45, 26, 14, 0.12);
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 15px;
  color: var(--c-text-2);
  margin-bottom: 8px;
  padding-left: 4px;
}

.required {
  color: var(--c-red);
}

.submit-btn {
  margin-top: 12px;
  border-radius: 16px !important;
  letter-spacing: 4px;
}

.card-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 15px;
  color: var(--c-text-3);
}

.footer-link {
  color: var(--c-primary);
  font-weight: 600;
  text-decoration: none;
  margin-left: 6px;
}
</style>
