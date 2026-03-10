const express = require('express');
const router = express.Router();
const { db } = require('../database');

// 创建应急记录
router.post('/', (req, res) => {
  try {
    const { user_id, risk_level, description, handling_result, is_notified_family } = req.body;

    if (!user_id || !risk_level || !description) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const stmt = db.prepare(`
      INSERT INTO emergency_records (user_id, risk_level, description, handling_result, is_notified_family)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      user_id,
      risk_level,
      description,
      handling_result || '',
      is_notified_family ? 1 : 0
    );

    res.json({ emergencyId: result.lastInsertRowid, message: '记录成功' });
  } catch (error) {
    console.error('创建应急记录错误:', error);
    res.status(500).json({ error: '记录失败' });
  }
});

// 获取用户应急记录
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    const records = db.prepare(`
      SELECT * FROM emergency_records
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(userId);

    res.json({ records });
  } catch (error) {
    console.error('获取应急记录错误:', error);
    res.status(500).json({ error: '获取失败' });
  }
});

// 获取紧急联系人信息
router.get('/contacts/:userId', (req, res) => {
  try {
    const { userId } = req.params;

    const contacts = db.prepare('SELECT * FROM emergency_contacts WHERE user_id = ?').all(userId);

    res.json({ contacts });
  } catch (error) {
    console.error('获取紧急联系人错误:', error);
    res.status(500).json({ error: '获取失败' });
  }
});

module.exports = router;
