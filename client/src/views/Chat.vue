<template>
  <div class="chat-page">
    <div class="chat-header">
      <div class="header-left">
        <div class="assistant-dot"></div>
        <div>
          <div class="header-title">陪伴助手</div>
          <div class="header-status">随时陪伴您</div>
        </div>
      </div>
      <div class="header-logo">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="18" fill="rgba(255,255,255,0.15)"/>
          <path d="M18 7 C18 7 9 13 9 20 C9 24.97 13.03 29 18 29 C22.97 29 27 24.97 27 20 C27 13 18 7 18 7Z" fill="white" opacity="0.85"/>
          <circle cx="18" cy="20" r="4.5" fill="#E07B39" opacity="0.8"/>
          <circle cx="18" cy="20" r="2" fill="white"/>
        </svg>
      </div>
    </div>

    <div class="chat-messages" ref="messagesRef">
      <div
        v-for="(message, index) in chatStore.messages"
        :key="index"
        :class="['msg-row', message.type]"
      >
        <div v-if="message.type === 'assistant'" class="msg-avatar">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#FEF3EC"/>
            <path d="M11 4 C11 4 6 7.5 6 12 C6 14.8 8.2 17 11 17 C13.8 17 16 14.8 16 12 C16 7.5 11 4 11 4Z" fill="#E07B39" opacity="0.7"/>
            <circle cx="11" cy="12" r="2.5" fill="#E07B39"/>
          </svg>
        </div>
        <div class="msg-content">
          <div :class="['msg-bubble', message.type]">{{ message.content }}</div>
          <div class="msg-time">{{ message.time }}</div>
        </div>
      </div>

      <div v-if="chatStore.isProcessing" class="msg-row assistant">
        <div class="msg-avatar">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#FEF3EC"/>
            <path d="M11 4 C11 4 6 7.5 6 12 C6 14.8 8.2 17 11 17 C13.8 17 16 14.8 16 12 C16 7.5 11 4 11 4Z" fill="#E07B39" opacity="0.7"/>
            <circle cx="11" cy="12" r="2.5" fill="#E07B39"/>
          </svg>
        </div>
        <div class="msg-content">
          <div class="msg-bubble assistant typing">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="voice-area">
      <div class="voice-hint" v-if="!chatStore.isRecording">按住圆圈说话</div>
      <div class="voice-hint recording" v-else>正在聆听，松开发送...</div>

      <div class="voice-wrap">
        <div v-if="chatStore.isRecording" class="ring ring1"></div>
        <div v-if="chatStore.isRecording" class="ring ring2"></div>
        <button
          class="voice-btn"
          :class="{ recording: chatStore.isRecording }"
          @touchstart.prevent="startRecording"
          @touchend.prevent="stopRecording"
          @mousedown="startRecording"
          @mouseup="stopRecording"
          @mouseleave="stopRecording"
        >
          <svg v-if="!chatStore.isRecording" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="14" y="6" width="12" height="20" rx="6" fill="white"/>
            <path d="M8 22 C8 29.2 13.4 35 20 35 C26.6 35 32 29.2 32 22" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/>
            <line x1="20" y1="35" x2="20" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="14" y1="40" x2="26" y2="40" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="6" width="20" height="20" rx="4" fill="white"/>
          </svg>
        </button>
      </div>
    </div>

    <nav class="bottom-nav">
      <router-link to="/" class="nav-item active">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 12L12 4L20 12V21H15V15H9V21H4V12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" fill="none"/>
        </svg>
        <span>聊天</span>
      </router-link>
      <router-link to="/reminders" class="nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span>提醒</span>
      </router-link>
      <router-link to="/emergency" class="nav-item emergency">
        <div class="sos-btn">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 4.5C4 4.5 5.5 2 8 2C10.5 2 12 4 12 4L15.5 7.5C15.5 7.5 17 9 17 11.5C17 14 15 16 15 16L12 19C12 19 10 21 7.5 21C5 21 3 19 3 19L4 18C4 18 2 16 2 13.5C2 11 4 9 4 9L7.5 5.5" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/>
            <circle cx="16" cy="6" r="3.5" fill="white" opacity="0.3"/>
          </svg>
          <span>应急</span>
        </div>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M4 20C4 16.69 7.58 14 12 14C16.42 14 20 16.69 20 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        </svg>
        <span>我的</span>
      </router-link>
    </nav>
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
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition.value = new SpeechRecognition()
    recognition.value.lang = 'zh-CN'
    recognition.value.continuous = false
    recognition.value.interimResults = true

    recognition.value.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript = transcript
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
  }

  if (chatStore.messages.length === 0) {
    chatStore.messages.push({
      type: 'assistant',
      content: '您好！我是您的陪伴助手。您可以按住下面的圆圈跟我说话，我可以陪您聊天、提醒您做事。如果遇到紧急情况，请点击下方的"应急"按钮。',
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

  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }

  if (result.emergency) {
    router.push('/emergency')
  }

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
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #F4A461 0%, #E07B39 100%);
  padding: 20px 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: max(20px, env(safe-area-inset-top));
  box-shadow: 0 4px 20px rgba(224, 123, 57, 0.3);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.assistant-dot {
  width: 8px;
  height: 8px;
  background: #7FFFD4;
  border-radius: 50%;
  box-shadow: 0 0 8px #7FFFD4;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.8); }
}

.header-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: 1px;
}

.header-status {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 16px;
  padding-bottom: 180px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.msg-row.user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.msg-content {
  display: flex;
  flex-direction: column;
  max-width: 75%;
}

.msg-row.user .msg-content {
  align-items: flex-end;
}

.msg-bubble {
  padding: 14px 18px;
  border-radius: 20px;
  font-size: 17px;
  line-height: 1.6;
  word-break: break-word;
}

.msg-bubble.user {
  background: linear-gradient(135deg, #F4A461 0%, #E07B39 100%);
  color: white;
  border-bottom-right-radius: 6px;
  box-shadow: 0 4px 16px rgba(224, 123, 57, 0.3);
}

.msg-bubble.assistant {
  background: white;
  color: var(--c-text);
  border-bottom-left-radius: 6px;
  box-shadow: var(--shadow-sm);
}

.msg-bubble.typing {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px 20px;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--c-text-3);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-6px); opacity: 1; }
}

.msg-time {
  font-size: 11px;
  color: var(--c-text-3);
  margin-top: 5px;
  padding: 0 4px;
}

.voice-area {
  position: fixed;
  bottom: 72px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(to top, var(--c-bg) 60%, transparent);
}

.voice-hint {
  font-size: 14px;
  color: var(--c-text-3);
  margin-bottom: 16px;
  letter-spacing: 0.5px;
  transition: all 0.3s;
}

.voice-hint.recording {
  color: var(--c-primary);
  font-weight: 600;
}

.voice-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 110px;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(224, 123, 57, 0.35);
  animation: ring-expand 1.6s infinite ease-out;
}

.ring1 {
  width: 100%;
  height: 100%;
}

.ring2 {
  width: 130%;
  height: 130%;
  animation-delay: 0.6s;
}

@keyframes ring-expand {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.2); opacity: 0; }
}

.voice-btn {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, #F4A461, #E07B39);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(224, 123, 57, 0.45);
  transition: all 0.25s;
  user-select: none;
  -webkit-user-select: none;
  position: relative;
  z-index: 1;
}

.voice-btn.recording {
  background: linear-gradient(145deg, #E85D50, #C0392B);
  box-shadow: 0 8px 32px rgba(192, 57, 43, 0.45);
  transform: scale(1.05);
}

.voice-btn:active {
  transform: scale(0.96);
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
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  box-shadow: 0 -1px 0 rgba(237, 216, 200, 0.8), 0 -4px 20px rgba(45, 26, 14, 0.07);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--c-text-3);
  text-decoration: none;
  font-size: 11px;
  padding: 6px 16px;
  border-radius: 12px;
  transition: all 0.2s;
  min-width: 60px;
}

.nav-item.active {
  color: var(--c-primary);
}

.nav-item span {
  letter-spacing: 0.5px;
}

.nav-item.emergency {
  padding: 0;
}

.sos-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: linear-gradient(145deg, #E85D50, #C0392B);
  color: white;
  padding: 10px 16px 8px;
  border-radius: 16px;
  font-size: 11px;
  box-shadow: 0 4px 16px rgba(192, 57, 43, 0.35);
  margin-top: -12px;
}
</style>
