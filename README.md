# 老人陪伴助手

语音交互为核心的老人陪伴应用，提供日常聊天、生活提醒、应急求助三大功能。

**技术栈**：Vue 3 + Express + SQLite，Docker 一键部署

---

## 快速启动

### Docker（推荐）

```bash
# 启动
docker compose up --build -d

# 访问
http://localhost:3000

# 查看日志 / 停止
docker compose logs -f
docker compose down
```

> 如需接入 AI 对话，编辑根目录 `.env` 填入 `OPENAI_API_KEY`，然后重新 `up --build`。

### 更新代码后刷新

```bash
# 重新构建（含依赖变化时）
docker compose up --build -d

# 仅改了后端代码（秒级）
docker cp server/src/. elderly-companion-app-1:/app/src/
docker compose restart app

# 仅改了前端代码（需本机有 Node）
cd client && npm run build && cd ..
docker cp client/dist/. elderly-companion-app-1:/app/client/dist/
```

---

## 项目结构

```
elderly-companion/
├── client/          # Vue 3 前端
│   └── src/views/   # 页面（登录、聊天、提醒、应急、我的）
├── server/          # Express 后端
│   └── src/routes/  # API 路由
├── Dockerfile
└── docker-compose.yml
```

---

## 主要功能

| 功能 | 说明 |
|------|------|
| 语音聊天 | 按住按钮说话，Web Speech API 识别，自动语音播报回复 |
| 生活提醒 | 服药、复诊、喝水等定时提醒 |
| 应急求助 | 一键拨打 120，联系家属，应急指南 |
| 记录查询 | 对话、提醒、应急记录可追溯 |

---

## 注意事项

- 语音功能需要 Chrome 浏览器，建议使用 HTTPS
- 数据存储在本地 SQLite，注意定期备份 `data/` 目录
- 本应用不提供医疗诊断，紧急情况请及时就医
