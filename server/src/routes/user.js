const express = require('express');
const router = express.Router();
const { db } = require('../database');

// 用户注册
router.post('/register', (req, res) => {
  try {
    const { phone, name, age, health_status, medications, voice_preference } = req.body;

    if (!phone) {
      return res.status(400).json({ error: '手机号不能为空' });
    }

    // 检查用户是否已存在
    const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
    if (existingUser) {
      return res.status(409).json({ error: '该手机号已注册' });
    }

    const stmt = db.prepare(`
      INSERT INTO users (phone, name, age, health_status, medications, voice_preference)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(phone, name || '', age || 60, health_status || '', medications || '', voice_preference || 'female');

    res.json({ userId: result.lastInsertRowid, message: '注册成功' });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '注册失败' });
  }
});

// 用户登录
router.post('/login', (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: '手机号不能为空' });
    }

    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ userId: user.id, user });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '登录失败' });
  }
});

// 获取用户信息
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 获取紧急联系人
    const contacts = db.prepare('SELECT * FROM emergency_contacts WHERE user_id = ?').all(id);

    res.json({ user, contacts });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户信息
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, health_status, medications, voice_preference } = req.body;

    const stmt = db.prepare(`
      UPDATE users
      SET name = ?, age = ?, health_status = ?, medications = ?, voice_preference = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(name, age, health_status, medications, voice_preference, id);

    res.json({ message: '更新成功' });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '更新失败' });
  }
});

// 添加紧急联系人
router.post('/:id/contacts', (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, relationship } = req.body;

    if (!name || !phone || !relationship) {
      return res.status(400).json({ error: '请填写完整的联系人信息' });
    }

    const stmt = db.prepare(`
      INSERT INTO emergency_contacts (user_id, name, phone, relationship)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(id, name, phone, relationship);

    res.json({ contactId: result.lastInsertRowid, message: '添加成功' });
  } catch (error) {
    console.error('添加紧急联系人错误:', error);
    res.status(500).json({ error: '添加失败' });
  }
});

// 删除紧急联系人
router.delete('/:id/contacts/:contactId', (req, res) => {
  try {
    const { id, contactId } = req.params;

    const stmt = db.prepare('DELETE FROM emergency_contacts WHERE id = ? AND user_id = ?');
    stmt.run(contactId, id);

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除紧急联系人错误:', error);
    res.status(500).json({ error: '删除失败' });
  }
});

module.exports = router;
