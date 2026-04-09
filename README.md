# elderly-companion

<div align="center">

面向老年人陪伴场景的全栈应用，提供语音聊天、生活提醒、紧急求助、用户档案与对话记录能力。

<p>
  <img src="https://img.shields.io/badge/Vue-3-42B883?style=flat-square&logo=vue.js&logoColor=white" alt="Vue">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/SQLite-better--sqlite3-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/OpenAI-Assistant-412991?style=flat-square&logo=openai&logoColor=white" alt="OpenAI">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
</p>

</div>

## 项目概览

`elderly-companion` 是一个为老年人陪伴与日常照护设计的应用原型。项目采用前后端分离结构：

- 前端使用 Vue 3 + Vite 构建交互界面
- 后端使用 Express 提供业务 API
- 数据层使用 SQLite 持久化用户、提醒、对话与应急记录
- AI 对话通过 OpenAI 接口生成陪伴式回复，并附带风险关键词识别

这个项目适合用来演示“陪伴型 AI 产品”在真实业务中的核心闭环：注册建档、持续对话、提醒事项、紧急响应和信息追溯。

## 核心能力

| 模块 | 说明 |
| --- | --- |
| 语音 / 文本聊天 | 为老人提供更温和的陪伴式对话体验 |
| 风险识别 | 对“救命、摔倒、胸闷”等关键词进行风险分级 |
| 生活提醒 | 管理服药、喝水、复诊等待办提醒 |
| 紧急求助 | 记录应急事件并维护紧急联系人信息 |
| 用户档案 | 保存姓名、年龄、健康状况、用药信息与语音偏好 |
| 历史留存 | 对话记录、提醒记录、应急记录统一入库 |

## 技术架构

| 层级 | 技术方案 |
| --- | --- |
| 前端 | Vue 3、Vue Router、Pinia、Vite、TDesign |
| 后端 | Express、CORS、dotenv |
| 数据库 | SQLite、better-sqlite3 |
| AI 能力 | OpenAI Node SDK |
| 部署 | Docker、Docker Compose |

## 项目结构

```text
elderly-companion
├── client
│   ├── src
│   │   ├── router
│   │   ├── stores
│   │   └── views
│   ├── package.json
│   └── vite.config.js
├── server
│   ├── src
│   │   ├── database
│   │   ├── routes
│   │   └── server.js
│   └── package.json
├── docker-compose.yml
├── docker-compose.dev.yml
└── Dockerfile
```

## 快速开始

### 方式一：Docker Compose

```bash
git clone https://github.com/GavinWu326/elderly-companion.git
cd elderly-companion
docker compose up --build -d
```

启动后访问：

- `http://localhost:3000`

常用命令：

```bash
docker compose logs -f
docker compose down
docker compose restart
```

### 方式二：本地开发

先启动后端：

```bash
cd server
npm install
npm run dev
```

再启动前端：

```bash
cd client
npm install
npm run dev
```

开发环境默认地址：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:3000`

Vite 已配置 `/api` 代理到本地后端。

## 环境变量

项目根目录可创建 `.env` 文件，常用配置如下：

```bash
PORT=3000
DATABASE_PATH=/app/data/elderly-companion.db
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=
```

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `PORT` | 否 | Express 服务端口，默认 `3000` |
| `DATABASE_PATH` | 否 | SQLite 文件路径 |
| `OPENAI_API_KEY` | 否 | 配置后启用真实 AI 对话 |
| `OPENAI_BASE_URL` | 否 | 兼容 OpenAI 协议的自定义地址 |

## API 一览

### 用户与档案

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/user/register` | 注册用户 |
| `POST` | `/api/user/login` | 手机号登录 |
| `GET` | `/api/user/:id` | 获取用户资料与紧急联系人 |
| `PUT` | `/api/user/:id` | 更新用户资料 |
| `POST` | `/api/user/:id/contacts` | 新增紧急联系人 |
| `DELETE` | `/api/user/:id/contacts/:contactId` | 删除紧急联系人 |

### 对话与 AI 助手

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/assistant/chat` | 生成 AI 回复并返回风险等级 |
| `POST` | `/api/assistant/detect-risk` | 单独进行风险关键词检测 |
| `POST` | `/api/conversation` | 保存对话记录 |
| `GET` | `/api/conversation/user/:userId` | 查询用户历史对话 |
| `DELETE` | `/api/conversation/:id` | 删除对话记录 |

### 提醒与应急

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/reminder` | 创建提醒 |
| `GET` | `/api/reminder/user/:userId` | 查询提醒列表 |
| `PUT` | `/api/reminder/:id/status` | 更新提醒状态 |
| `DELETE` | `/api/reminder/:id` | 删除提醒 |
| `GET` | `/api/reminder/pending/:now` | 获取待触发提醒 |
| `POST` | `/api/emergency` | 记录应急事件 |
| `GET` | `/api/emergency/user/:userId` | 查询应急记录 |
| `GET` | `/api/emergency/contacts/:userId` | 获取紧急联系人 |

## 业务流程

一个典型流程如下：

1. 用户注册并完善基础档案、健康信息与联系人。
2. 用户发起聊天，服务端调用 OpenAI 生成陪伴式回复。
3. 如果消息中包含高风险关键词，接口会返回对应风险级别。
4. 对话、提醒和应急事件统一写入 SQLite，方便后续查看和追踪。

## 部署说明

生产部署默认使用单容器模式：

- 前端先在构建阶段打包成静态资源
- 后端容器启动 Express 服务
- Express 同时托管 API 与前端打包产物
- SQLite 数据通过 `./data` 卷挂载持久化

## 注意事项

- 语音相关体验依赖浏览器能力，建议优先使用较新的 Chromium 内核浏览器。
- 该项目适合做陪伴与提醒辅助，不应替代专业医疗判断。
- 若未配置 `OPENAI_API_KEY`，AI 能力相关接口将无法正常工作。

## License

MIT
