<template>
  <div class="setup-page">
    <div class="login-deco">
      <div class="deco-circle c1"></div>
      <div class="deco-circle c2"></div>
    </div>

    <div class="page-top">
      <div class="step-badge">最后一步</div>
      <h1 class="page-heading">设置紧急联系人</h1>
      <p class="page-sub">遇到紧急情况时，系统会联系他们帮助您</p>
    </div>

    <div class="setup-card">
      <div class="form-group">
        <label class="form-label">联系人姓名 <span class="required">*</span></label>
        <t-input v-model="contactName" size="large" placeholder="请输入姓名" />
      </div>

      <div class="form-group">
        <label class="form-label">联系人电话 <span class="required">*</span></label>
        <t-input v-model="contactPhone" size="large" placeholder="请输入手机号" type="tel" :maxlength="11" />
      </div>

      <div class="form-group">
        <label class="form-label">与您的关系 <span class="required">*</span></label>
        <t-select v-model="relationship" size="large" placeholder="请选择关系">
          <t-option value="子女">子女</t-option>
          <t-option value="配偶">配偶</t-option>
          <t-option value="兄弟姐妹">兄弟姐妹</t-option>
          <t-option value="其他">其他</t-option>
        </t-select>
      </div>

      <t-button
        size="large"
        theme="primary"
        block
        :disabled="!isValidContact"
        :loading="loading"
        @click="handleAddContact"
        class="add-btn"
      >
        添加联系人
      </t-button>

      <div v-if="contacts.length > 0" class="contacts-added">
        <div class="contacts-title">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="9" fill="#2E9E6B" opacity="0.15"/>
            <path d="M5.5 9L7.8 11.5L12.5 6.5" stroke="#2E9E6B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          已添加 {{ contacts.length }} 位联系人
        </div>
        <div v-for="contact in contacts" :key="contact.id" class="contact-row">
          <div class="contact-avatar">{{ contact.name.slice(-1) }}</div>
          <div class="contact-info">
            <div class="contact-name">{{ contact.name }}</div>
            <div class="contact-meta">{{ contact.phone }} · {{ contact.relationship }}</div>
          </div>
          <button class="contact-del" @click="handleDeleteContact(contact.id)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="#B89988" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <t-button
        v-if="contacts.length > 0"
        size="large"
        block
        @click="handleComplete"
        class="done-btn"
      >
        完成设置，开始使用 →
      </t-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const contactName = ref('')
const contactPhone = ref('')
const relationship = ref('')
const loading = ref(false)

const contacts = computed(() => userStore.contacts)

const isValidContact = computed(() => {
  return contactName.value &&
         /^1[3-9]\d{9}$/.test(contactPhone.value) &&
         relationship.value
})

onMounted(async () => {
  await userStore.fetchUserInfo()
})

const handleAddContact = async () => {
  loading.value = true
  try {
    await userStore.addContact({
      name: contactName.value,
      phone: contactPhone.value,
      relationship: relationship.value
    })
    MessagePlugin.success('添加成功')
    contactName.value = ''
    contactPhone.value = ''
    relationship.value = ''
  } catch (error) {
    MessagePlugin.error('添加失败')
  } finally {
    loading.value = false
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

const handleComplete = () => {
  router.push('/')
}
</script>

<style scoped>
.setup-page {
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

.step-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  font-size: 13px;
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
  backdrop-filter: blur(8px);
  letter-spacing: 1px;
}

.page-heading {
  font-family: 'Noto Serif SC', 'SimSun', serif;
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
  margin-bottom: 10px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.page-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.6;
}

.setup-card {
  background: #fff;
  border-radius: 28px 28px 0 0;
  padding: 36px 28px 60px;
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

.add-btn {
  margin-top: 8px;
  border-radius: 16px !important;
  letter-spacing: 2px;
}

.contacts-added {
  margin-top: 28px;
  background: #FFFAF6;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--c-border);
}

.contacts-title {
  font-size: 14px;
  color: var(--c-green);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--c-divider);
}

.contact-row:last-child {
  border-bottom: none;
}

.contact-avatar {
  width: 40px;
  height: 40px;
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

.contact-meta {
  font-size: 13px;
  color: var(--c-text-3);
  margin-top: 2px;
}

.contact-del {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  opacity: 0.6;
}

.done-btn {
  margin-top: 24px;
  background: linear-gradient(135deg, #F4A461, #E07B39) !important;
  color: white !important;
  border: none !important;
  border-radius: 16px !important;
  font-size: 17px !important;
  letter-spacing: 1px;
  box-shadow: 0 4px 16px rgba(224, 123, 57, 0.35) !important;
}
</style>
