const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const RISK_KEYWORDS = {
  high: ['救命', '救我', '摔倒', '起不来', '晕倒', '窒息', '不能动了'],
  medium: ['痛', '难受', '不舒服', '心慌', '胸闷', '喘不过气', '恶心', '头晕', '肚子痛', '头痛', '胸痛']
};

const SYSTEM_PROMPT = `你是一位温暖、耐心的老人陪伴助手，专门陪伴老年人聊天和生活。请遵守以下原则：

1. 语气亲切、温和，像家人一样说话，称呼用户为"您"
2. 回答简洁，每次回复不超过80个字，避免复杂句子
3. 多关心用户的身体状况和心情
4. 遇到用户身体不适，温和建议就医或联系家人
5. 遇到高风险关键词（摔倒、晕倒、救命、起不来、窒息等），务必第一句话就建议拨打120或联系紧急联系人
6. 不要说"作为AI"之类的话，就像真实的陪伴者一样`;

let openaiClient = null;

function getOpenAI() {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) throw new Error('未配置 OPENAI_API_KEY');
    const options = { apiKey: process.env.OPENAI_API_KEY };
    if (process.env.OPENAI_BASE_URL) options.baseURL = process.env.OPENAI_BASE_URL;
    openaiClient = new OpenAI(options);
  }
  return openaiClient;
}

function detectRisk(message) {
  const msg = message.toLowerCase();
  for (const keyword of RISK_KEYWORDS.high) {
    if (msg.includes(keyword)) return { level: 'high', keyword };
  }
  for (const keyword of RISK_KEYWORDS.medium) {
    if (msg.includes(keyword)) return { level: 'medium', keyword };
  }
  return { level: 'low', keyword: null };
}

router.post('/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message) return res.status(400).json({ error: '消息不能为空' });

    const risk = detectRisk(message);

    const systemPrompt = risk.level === 'high'
      ? SYSTEM_PROMPT + '\n\n【紧急】当前用户很可能遇到紧急情况，第一句话必须引导立即拨打120或联系紧急联系人。'
      : SYSTEM_PROMPT;

    const ai = getOpenAI();
    const completion = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content.trim();
    res.json({ response, risk, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('对话错误:', error.message);
    res.status(500).json({ error: '对话服务暂时不可用，请稍后再试' });
  }
});

router.post('/detect-risk', (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: '消息不能为空' });
    res.json({ risk: detectRisk(message) });
  } catch (error) {
    console.error('风险检测错误:', error);
    res.status(500).json({ error: '检测失败' });
  }
});

module.exports = router;
