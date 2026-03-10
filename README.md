# 老人陪伴助手

一款以语音交互为核心的老人陪伴与生活助手应用，让老年人"开口就能用"，提供日常陪伴、生活提醒、应急引导等核心功能。

## 功能特性

### 核心功能
- **语音对话**: 基于Web Speech API的语音识别与合成，支持自然语音交互
- **应急引导**: 识别高风险表达，提供紧急求助路径
- **生活提醒**: 服药、复诊、喝水等提醒功能
- **记录追溯**: 对话、提醒、应急事件记录，家属可查询
- **适老化设计**: 大字体、高对比度、极简操作

### 技术特点
- 前端: Vue 3 + TDesign + Web Speech API
- 后端: Node.js + Express + SQLite
- 部署: Docker Compose 一键部署
- 数据: 本地SQLite数据库，数据安全可控

## 快速开始

### 前置要求
- Node.js >= 18
- npm 或 yarn
- Docker (可选)

### 本地开发

#### 1. 克隆项目
```bash
git clone <repository-url>
cd elderly-companion
```

#### 2. 安装依赖

后端:
```bash
cd server
npm install
```

前端:
```bash
cd client
npm install
```

#### 3. 配置环境变量

后端配置:
```bash
cd server
cp .env.example .env
```

编辑 `.env` 文件配置:
```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./data/elderly-companion.db
```

#### 4. 启动服务

后端:
```bash
cd server
npm run dev
```

前端:
```bash
cd client
npm run dev
```

访问: http://localhost:5173

### Docker部署

```bash
# 使用Docker Compose一键启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 项目结构

```
elderly-companion/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── views/         # 页面组件
│   │   ├── stores/        # 状态管理
│   │   ├── router/        # 路由配置
│   │   ├── App.vue        # 根组件
│   │   └── main.js        # 入口文件
│   ├── package.json
│   └── vite.config.js
├── server/                # 后端项目
│   ├── src/
│   │   ├── routes/        # API路由
│   │   ├── database/      # 数据库
│   │   └── server.js      # 服务器入口
│   ├── package.json
│   └── .env.example
├── docker-compose.yml     # Docker配置
├── PRD.md                # 产品需求文档
└── README.md             # 项目说明
```

## 核心API

### 用户相关
- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录
- `GET /api/user/:id` - 获取用户信息
- `PUT /api/user/:id` - 更新用户信息
- `POST /api/user/:id/contacts` - 添加紧急联系人

### 对话相关
- `POST /api/conversation` - 创建对话记录
- `GET /api/conversation/user/:userId` - 获取对话历史

### 提醒相关
- `POST /api/reminder` - 创建提醒
- `GET /api/reminder/user/:userId` - 获取提醒列表
- `PUT /api/reminder/:id/status` - 更新提醒状态

### 应急相关
- `POST /api/emergency` - 创建应急记录
- `GET /api/emergency/user/:userId` - 获取应急记录

### 助手相关
- `POST /api/assistant/chat` - 对话接口
- `POST /api/assistant/detect-risk` - 风险检测

## 使用指南

### 首次使用
1. 打开应用，输入手机号登录/注册
2. 填写基本信息（姓名、年龄、健康状况）
3. 添加至少一个紧急联系人
4. 开始使用

### 语音交互
- 按住"按住说话"按钮开始录音
- 松开按钮发送消息
- 助手会自动语音播报回复

### 应急求助
- 点击底部"应急"按钮进入应急模式
- 可直接拨打120或联系紧急联系人
- 查看应急指南

## 注意事项

- 语音识别功能需要浏览器支持Web Speech API（推荐Chrome）
- 本地部署数据存储在SQLite，请注意定期备份
- 不做医疗诊断，应急情况请及时就医
- 建议使用HTTPS以支持语音功能

## 开发记录

完整的Git提交记录已保留，可通过以下命令查看:
```bash
git log --oneline
```

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交Issue。
