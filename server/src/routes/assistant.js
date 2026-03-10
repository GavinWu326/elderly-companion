const express = require('express');
const router = express.Router();

// 风险关键词配置
const RISK_KEYWORDS = {
  high: ['救命', '救我', '摔倒', '起不来', '晕倒', '窒息', '不能动了'],
  medium: ['痛', '难受', '不舒服', '心慌', '胸闷', '喘不过气', '恶心', '头晕', '肚子痛', '头痛', '胸痛']
};

// 简单的对话生成（不使用外部API）
function generateResponse(userMessage) {
  const message = userMessage.toLowerCase();

  // 问候
  if (message.includes('你好') || message.includes('您好')) {
    return '您好！今天有什么我可以帮您的吗？';
  }

  // 天气查询
  if (message.includes('天气')) {
    return '今天北京晴天，温度18-25度，适合出去走走哦。';
  }

  // 新闻查询
  if (message.includes('新闻')) {
    return '今天有几条重要新闻：第一条，国家发布老年人健康指南；第二条，社区开展义诊活动；第三条，近期天气转暖，适合户外活动。';
  }

  // 提醒相关
  if (message.includes('提醒')) {
    return '好的，请告诉我您需要提醒什么，以及什么时候提醒？';
  }

  // 身体不适（应急）
  if (message.includes('难受') || message.includes('痛') || message.includes('不舒服')) {
    return '您哪里不舒服呢？可以详细告诉我吗？如果您感到非常不适，建议您立即联系家人或拨打120。';
  }

  // 情绪低落
  if (message.includes('难过') || message.includes('孤独') || message.includes('寂寞')) {
    return '我理解您的感受，愿意跟我说说吗？我在这里陪您聊天。';
  }

  // 默认回应
  const defaultResponses = [
    '我明白，您愿意多说一点吗？',
    '我在听，您继续说。',
    '这个想法很有意思，您是怎么想到的？',
    '我记得您之前提到过这个。',
    '是的，我明白您的意思。',
    '您今天感觉怎么样？'
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// 识别风险等级
function detectRisk(message) {
  const msg = message.toLowerCase();

  // 检查高风险关键词
  for (const keyword of RISK_KEYWORDS.high) {
    if (msg.includes(keyword)) {
      return { level: 'high', keyword };
    }
  }

  // 检查中风险关键词
  for (const keyword of RISK_KEYWORDS.medium) {
    if (msg.includes(keyword)) {
      return { level: 'medium', keyword };
    }
  }

  return { level: 'low', keyword: null };
}

// 对话接口
router.post('/chat', (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: '消息不能为空' });
    }

    // 识别风险
    const risk = detectRisk(message);

    // 生成回应
    let response;
    if (risk.level === 'high') {
      response = '检测到您可能遇到紧急情况，请保持冷静。我建议您立即拨打120或联系您的紧急联系人。';
    } else if (risk.level === 'medium') {
      response = generateResponse(message) + ' 如果您感到不适，建议您联系家人或就医。';
    } else {
      response = generateResponse(message);
    }

    res.json({
      response,
      risk,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('对话错误:', error);
    res.status(500).json({ error: '对话失败' });
  }
});

// 风险检测接口
router.post('/detect-risk', (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: '消息不能为空' });
    }

    const risk = detectRisk(message);

    res.json({ risk });
  } catch (error) {
    console.error('风险检测错误:', error);
    res.status(500).json({ error: '检测失败' });
  }
});

module.exports = router;
