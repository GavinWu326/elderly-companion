<template>
  <div class="login-page">
    <div class="login-deco">
      <div class="deco-circle c1"></div>
      <div class="deco-circle c2"></div>
      <div class="deco-circle c3"></div>
    </div>

    <div class="login-body">
      <div class="brand">
        <div class="brand-icon">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="26" fill="rgba(255,255,255,0.2)" />
            <path d="M26 12 C26 12 14 20 14 30 C14 37 19.4 42 26 42 C32.6 42 38 37 38 30 C38 20 26 12 26 12Z" fill="white" opacity="0.9"/>
            <path d="M26 18 C26 18 19 24 19 30 C19 33.9 22.1 37 26 37 C29.9 37 33 33.9 33 30 C33 24 26 18 26 18Z" fill="#E07B39" opacity="0.7"/>
            <circle cx="26" cy="30" r="4" fill="white"/>
          </svg>
        </div>
        <h1 class="brand-name">老人陪伴助手</h1>
        <p class="brand-tagline">像家人一样陪您，关键时刻能救命</p>
      </div>

      <div class="login-card">
        <h2 class="card-title">欢迎回来</h2>

        <div class="form-group">
          <label class="form-label">手机号码</label>
          <t-input
            v-model="phone"
            size="large"
            placeholder="请输入您的手机号"
            type="tel"
            :maxlength="11"
            class="input-field"
          />
        </div>

        <t-button
          size="large"
          theme="primary"
          block
          :disabled="!isValidPhone"
          :loading="loading"
          @click="handleLogin"
          class="submit-btn"
        >
          登 录
        </t-button>

        <div class="card-footer">
          <span class="footer-text">还没有账号？</span>
          <router-link to="/register" class="footer-link">立即注册</router-link>
        </div>
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
.login-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #F4A461 0%, #E07B39 45%, #C26025 100%);
  display: flex;
  flex-direction: column;
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
  width: 280px;
  height: 280px;
  top: -80px;
  right: -80px;
}

.c2 {
  width: 180px;
  height: 180px;
  top: 120px;
  left: -60px;
}

.c3 {
  width: 120px;
  height: 120px;
  bottom: 200px;
  right: 30px;
  background: rgba(255, 255, 255, 0.05);
}

.login-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 24px 48px;
  position: relative;
  z-index: 1;
}

.brand {
  text-align: center;
  margin-bottom: 40px;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  margin-bottom: 18px;
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
}

.brand-name {
  font-family: 'Noto Serif SC', 'SimSun', serif;
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  margin-bottom: 10px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.brand-tagline {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.5px;
}

.login-card {
  background: #fff;
  border-radius: 28px;
  padding: 36px 28px 32px;
  box-shadow: 0 20px 60px rgba(45, 26, 14, 0.25);
}

.card-title {
  font-family: 'Noto Serif SC', 'SimSun', serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--c-text);
  margin-bottom: 28px;
  text-align: center;
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

.submit-btn {
  margin-top: 8px;
  border-radius: 16px !important;
  font-family: 'Noto Serif SC', serif;
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
