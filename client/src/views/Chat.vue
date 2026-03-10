<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1>陪伴聊天</h1>
    </div>

    <div class="chat-messages" ref="messagesRef">
      <div
        v-for="(message, index) in chatStore.messages"
        :key="index"
        :class="['message', message.type]"
      >
        <div class="message-bubble">
          {{ message.content }}
        </div>
        <div class="message-time">{{ message.time }}</div>
      </div>

      <div v-if="chatStore.isProcessing" class="message assistant">
        <div class="message-bubble loading">
          正在思考...
        </div>
      </div>
    </div>

    <div class="chat-input">
      <button
        class="voice-button"
        :class="{ recording: chatStore.isRecording }"
        @touchstart="startRecording"
        @touchend="stopRecording"
        @mousedown="startRecording"
        @mouseup="stopRecording"
        @mouseleave="stopRecording"
      >
        <div v-if="!chatStore.isRecording" class="mic-icon">
          <span>🎤</span>
        </div>
        <div v-else class="mic-icon recording">
          <span>🔴</span>
        </div>
        <span>{{ chatStore.isRecording ? '松开发送' : '按住说话' }}</span>
      </button>
    </div>

    <div class="bottom-nav">
      <router-link to="/" class="nav-item active">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">聊天</span>
      </router-link>
      <router-link to="/reminders" class="nav-item">
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
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useChatStore } from '../stores/chat'

const router = useRouter()
const userStore = useUserStore()
const chatStore = useChatStore()

const messagesRef = ref(null)
const recognition = ref(null)
let finalTranscript = ''

onMounted(() => {
  // 检查浏览器是否支持语音识别
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.lang = 'zh-CN'
    recognition.value.continuous = false
    recognition.value.interimResults = true

    recognition.value.onresult = (event) => {
      let interimTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript = transcript
        } else {
          interimTranscript += transcript
        }
      }
    }

    recognition.value.onerror = (event) => {
      console.error('语音识别错误:', event.error)
      chatStore.isRecording = false
    }

    recognition.value.onend = () => {
      if (finalTranscript) {
        handleMessage(finalTranscript)
        finalTranscript = ''
      }
      chatStore.isRecording = false
    }
  } else {
    console.log('浏览器不支持语音识别')
  }

  // 发送欢迎消息
  if (chatStore.messages.length === 0) {
    chatStore.messages.push({
      type: 'assistant',
      content: '您好！我是您的陪伴助手。您可以按住下面的按钮跟我说话，我可以陪您聊天、提醒您做事。如果遇到紧急情况，请点击下方的"应急"按钮。',
      time: new Date().toLocaleTimeString()
    })
  }
})

const startRecording = () => {
  if (!recognition.value) {
    alert('您的浏览器不支持语音识别功能')
    return
  }
  chatStore.isRecording = true
  finalTranscript = ''
  recognition.value.start()
}

const stopRecording = () => {
  if (recognition.value && chatStore.isRecording) {
    recognition.value.stop()
  }
}

const handleMessage = async (message) => {
  if (!message.trim()) return

  const result = await chatStore.sendMessage(message, userStore.user.id)

  // 滚动到底部
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }

  // 如果检测到紧急情况
  if (result.emergency) {
    router.push('/emergency')
  }

  // 语音播报助手回复（可选）
  if ('speechSynthesis' in window) {
    const lastMessage = chatStore.messages[chatStore.messages.length - 1]
    if (lastMessage && lastMessage.type === 'assistant') {
      const utterance = new SpeechSynthesisUtterance(lastMessage.content)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }
}
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
}

.chat-header h1 {
  font-size: 24px;
  margin: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 120px;
}

.message {
  margin-bottom: 20px;
}

.message.user {
  display: flex;
  justify-content: flex-end;
}

.message.assistant {
  display: flex;
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 15px 20px;
  border-radius: 18px;
  font-size: 18px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 5px;
}

.message.assistant .message-bubble {
  background: white;
  color: #333;
  border-bottom-left-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-bubble.loading {
  color: #999;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  text-align: center;
}

.chat-input {
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
}

.voice-button {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s;
  user-select: none;
  -webkit-user-select: none;
}

.voice-button.recording {
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
  transform: scale(1.1);
}

.mic-icon {
  font-size: 36px;
  transition: all 0.3s;
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
  padding-bottom: max(10px, env(safe-area-inset-bottom));
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
