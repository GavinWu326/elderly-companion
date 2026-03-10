<template>
  <div class="setup-container">
    <div class="setup-card">
      <h1 class="title">设置紧急联系人</h1>
      <p class="subtitle">至少添加一个紧急联系人，以便在紧急情况下联系</p>

      <div class="form">
        <t-input
          v-model="contactName"
          size="large"
          placeholder="联系人姓名"
          class="input-field"
        />

        <t-input
          v-model="contactPhone"
          size="large"
          placeholder="联系人电话"
          type="tel"
          :maxlength="11"
          class="input-field"
        />

        <t-select
          v-model="relationship"
          size="large"
          placeholder="与您的关系"
          class="input-field"
        >
          <t-option value="子女">子女</t-option>
          <t-option value="配偶">配偶</t-option>
          <t-option value="兄弟姐妹">兄弟姐妹</t-option>
          <t-option value="其他">其他</t-option>
        </t-select>

        <t-button
          size="large"
          theme="primary"
          block
          :disabled="!isValidContact"
          :loading="loading"
          @click="handleAddContact"
        >
          添加联系人
        </t-button>

        <div v-if="contacts.length > 0" class="contacts-list">
          <h3>已添加的联系人：</h3>
          <div v-for="contact in contacts" :key="contact.id" class="contact-item">
            <div class="contact-info">
              <span class="contact-name">{{ contact.name }}</span>
              <span class="contact-phone">{{ contact.phone }}</span>
            </div>
            <t-button size="small" theme="danger" @click="handleDeleteContact(contact.id)">
              删除
            </t-button>
          </div>
        </div>

        <t-button
          v-if="contacts.length > 0"
          size="large"
          theme="success"
          block
          @click="handleComplete"
        >
          完成设置
        </t-button>
      </div>
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
.setup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.setup-card {
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

.contacts-list {
  margin-top: 20px;
  text-align: left;
}

.contacts-list h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 10px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.contact-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.contact-phone {
  font-size: 14px;
  color: #666;
}
</style>
