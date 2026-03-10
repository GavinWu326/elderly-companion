const express = require('express');
const router = express.Router();
const { db } = require('../database');

// 创建提醒
router.post('/', (req, res) => {
  try {
    const { user_id, type, title, content, remind_time } = req.body;

    if (!user_id || !type || !title || !remind_time) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const stmt = db.prepare(`
      INSERT INTO reminders (user_id, type, title, content, remind_time)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(user_id, type, title, content, remind_time);

    res.json({ reminderId: result.lastInsertRowid, message: '添加成功' });
  } catch (error) {
    console.error('创建提醒错误:', error);
    res.status(500).json({ error: '创建失败' });
  }
});

// 获取用户提醒列表
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let query = 'SELECT * FROM reminders WHERE user_id = ?';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY remind_time ASC';

    const reminders = db.prepare(query).all(...params);

    res.json({ reminders });
  } catch (error) {
    console.error('获取提醒列表错误:', error);
    res.status(500).json({ error: '获取失败' });
  }
});

// 更新提醒状态
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const completed_at = status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL';

    const stmt = db.prepare(`
      UPDATE reminders
      SET status = ?, completed_at = ${completed_at}
      WHERE id = ?
    `);

    stmt.run(status, id);

    res.json({ message: '更新成功' });
  } catch (error) {
    console.error('更新提醒状态错误:', error);
    res.status(500).json({ error: '更新失败' });
  }
});

// 删除提醒
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM reminders WHERE id = ?');
    stmt.run(id);

    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除提醒错误:', error);
    res.status(500).json({ error: '删除失败' });
  }
});

// 获取待提醒的提醒（定时任务使用）
router.get('/pending/:now', (req, res) => {
  try {
    const { now } = req.params;

    const reminders = db.prepare(`
      SELECT * FROM reminders
      WHERE remind_time <= ? AND status = 'pending'
      ORDER BY remind_time ASC
    `).all(now);

    res.json({ reminders });
  } catch (error) {
    console.error('获取待提醒错误:', error);
    res.status(500).json({ error: '获取失败' });
  }
});

module.exports = router;
