import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const contacts = ref([])

  // 登录
  const login = async (phone) => {
    const response = await axios.post('/api/user/login', { phone })
    user.value = response.data.user
    contacts.value = []
    localStorage.setItem('userId', user.value.id)
    localStorage.setItem('phone', phone)
    return response.data
  }

  // 注册
  const register = async (userInfo) => {
    const response = await axios.post('/api/user/register', userInfo)
    user.value = {
      id: response.data.userId,
      phone: userInfo.phone,
      ...userInfo
    }
    contacts.value = []
    localStorage.setItem('userId', user.value.id)
    localStorage.setItem('phone', userInfo.phone)
    return response.data
  }

  // 更新用户信息
  const updateUserInfo = async (userInfo) => {
    const response = await axios.put(`/api/user/${user.value.id}`, userInfo)
    await fetchUserInfo()
    return response.data
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    const response = await axios.get(`/api/user/${user.value.id}`)
    user.value = response.data.user
    contacts.value = response.data.contacts || []
    return response.data
  }

  // 添加紧急联系人
  const addContact = async (contact) => {
    const response = await axios.post(`/api/user/${user.value.id}/contacts`, contact)
    await fetchUserInfo()
    return response.data
  }

  // 删除紧急联系人
  const deleteContact = async (contactId) => {
    const response = await axios.delete(`/api/user/${user.value.id}/contacts/${contactId}`)
    await fetchUserInfo()
    return response.data
  }

  // 退出登录
  const logout = () => {
    user.value = null
    contacts.value = []
    localStorage.removeItem('userId')
    localStorage.removeItem('phone')
  }

  return {
    user,
    contacts,
    login,
    register,
    updateUserInfo,
    fetchUserInfo,
    addContact,
    deleteContact,
    logout
  }
})
