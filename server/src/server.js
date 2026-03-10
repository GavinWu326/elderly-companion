const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./database');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（前端）
app.use(express.static(path.join(__dirname, '../client/dist')));

// 初始化数据库
initDatabase();

// 路由
app.use('/api/user', require('./routes/user'));
app.use('/api/conversation', require('./routes/conversation'));
app.use('/api/reminder', require('./routes/reminder'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/assistant', require('./routes/assistant'));

// SPA路由处理
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
