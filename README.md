# 老人陪伴助手

> 以语音交互为核心的老年人智能陪伴应用，让科技温暖每一位老人

<p>
  <img src="https://img.shields.io/badge/Vue-3.x-42b883?logo=vue.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-一键部署-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

---

## 功能概览

| 功能模块 | 说明 |
|---------|------|
| 语音聊天 | 按住按钮说话，Web Speech API 实时识别，AI 自动语音播报回复 |
| 生活提醒 | 服药、复诊、喝水等个性化定时提醒，不错过每一件重要的事 |
| 应急求助 | 一键拨打 120，快速联系家属，内置应急处置指南 |
| 记录查询 | 对话历史、提醒记录、应急记录全面可追溯 |

---

## 快速启动

### Docker 部署（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/Jarven20/elderly-companion.git
cd elderly-companion

# 2. 配置环境变量（可选，接入 AI 对话需要）
cp .env.example .env
# 编辑 .env，填入 OPENAI_API_KEY

# 3. 启动服务
docker compose up --build -d

# 4. 打开浏览器访问
# http://localhost:3000
```

**常用运维命令**

```bash
# 查看实时日志
docker compose logs -f

# 停止服务
docker compose down

# 重启服务
docker compose restart
```

### 热更新（无需完整重建）

```bash
# 仅修改了后端代码（秒级生效）
docker cp server/src/. elderly-companion-app-1:/app/src/
docker compose restart app

# 仅修改了前端代码（需本机已安装 Node.js）
cd client && npm run build && cd ..
docker cp client/dist/. elderly-companion-app-1:/app/client/dist/

# 依赖或配置有变化时完整重建
docker compose up --build -d
```

---

## 项目结构

```
elderly-companion/
├── client/                 # Vue 3 前端
│   └── src/
│       ├── views/          # 页面（登录、聊天、提醒、应急、我的）
│       ├── stores/         # Pinia 状态管理
│       └── components/     # 公共组件
├── server/                 # Express 后端
│   └── src/
│       └── routes/         # API 路由
├── data/                   # SQLite 数据库（运行时生成）
├── Dockerfile
├── docker-compose.yml
└── .env                    # 环境变量配置
```

---

## 环境变量

在根目录创建 `.env` 文件，参考以下配置：

```env
# AI 对话接口（不填则使用内置回复）
OPENAI_API_KEY=your_api_key_here

# 服务端口（默认 3000）
PORT=3000
```

---

## 注意事项

- **语音功能**：需使用 Chrome 浏览器，建议通过 HTTPS 访问以获得最佳体验
- **数据备份**：数据存储在本地 `data/` 目录（SQLite），请定期备份
- **免责声明**：本应用不提供任何医疗诊断服务，紧急情况请立即拨打 120 就医

---

## License

[MIT](LICENSE)
