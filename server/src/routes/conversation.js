const express = require('express');
const router = express.Router();
const { db } = require('../database');

// 创建对话记录
router.post('/', (req, res) => {
  try {
    const { user_id, user_message, assistant_message, emotion_score } = req.body;

    if (!user_id || !user_message || !assistant_message) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const stmt = db.prepare(`
      INSERT INTO conversations (user_id, user_message, assistant_message, emotion_score)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(user_id, user_message, assistant_message, emotion_score || 0);

    res.json({ conversationId: result.lastInsertRowid });
  } catch (error) {
    console.error('创建对话记录错误:', error);
    res.status(500).json({ error: '创建失败' });
  }
});

// 获取用户对话历史
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const conversations = db.prepare(`
      SELECT * FROM conversations
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(userId, limit);

    res.json({ conversations });
  } catch (error) {
    console.error('获取对话历史错误:', error);
    res.status(500).json({ error: '获取失败' });
  }
});

// 删除对话记录
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM conversations WHERE id = ?');
    stmt.run(id);

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除对话记录错误:', error);
    res.status(500).json({ error: '删除失败' });
  }
});

module.exports = router;
