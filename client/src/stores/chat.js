import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const isRecording = ref(false)
  const isPlaying = ref(false)
  const isProcessing = ref(false)

  // 发送消息
  const sendMessage = async (message, userId) => {
    isProcessing.value = true

    // 添加用户消息
    messages.value.push({
      type: 'user',
      content: message,
      time: new Date().toLocaleTimeString()
    })

    try {
      const response = await axios.post('/api/assistant/chat', {
        message,
        userId
      })

      // 添加助手回复
      messages.value.push({
        type: 'assistant',
        content: response.data.response,
        time: new Date().toLocaleTimeString(),
        risk: response.data.risk
      })

      // 保存对话记录
      await axios.post('/api/conversation', {
        user_id: userId,
        user_message: message,
        assistant_message: response.data.response
      })

      // 检测到高风险
      if (response.data.risk.level === 'high') {
        return { emergency: true, risk: response.data.risk }
      }

      return { emergency: false }
    } catch (error) {
      console.error('发送消息错误:', error)
      messages.value.push({
        type: 'assistant',
        content: '抱歉，我遇到了一些问题，请稍后再试。',
        time: new Date().toLocaleTimeString()
      })
      return { emergency: false }
    } finally {
      isProcessing.value = false
    }
  }

  // 清空对话
  const clearMessages = () => {
    messages.value = []
  }

  return {
    messages,
    isRecording,
    isPlaying,
    isProcessing,
    sendMessage,
    clearMessages
  }
})
