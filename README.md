# WayBack 归途

> 生命倒计时，珍惜当下的每一刻

## 简介

WayBack 是一款"生命质量激励与自我成长工具"，通过生命倒计时与 AI 分析用户日常总结，将死亡焦虑转化为积极激励，引导用户珍惜时间、关注当下。

## 功能特性

- **生命时钟**：实时显示生命倒计时
- **每日总结**：记录日记，获得 AI 分析反馈
- **意义清单**：添加"此生必做"事件，完成获得时间奖励
- **数据导出**：支持本地数据备份
- **PWA 支持**：可安装到桌面/手机，离线使用

## 技术栈

- React 18 + Vite
- CSS3 动画
- PWA (Service Worker)
- Vitest 单元测试

## 快速开始

### 安装

```bash
npm install
```

### 开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 测试

```bash
npm test
```

## 配置 LLM (可选)

1. 复制 `.env.example` 为 `.env`
2. 填入您的 API key (支持 Gemini、OpenAI、Claude)
3. 重启应用

```bash
cp .env.example .env
# 编辑 .env 填入 API key
```

## 项目结构

```
src/
├── components/     # React 组件
├── hooks/         # 自定义 hooks
├── services/      # 服务层 (用户数据、AI)
├── styles/        # 全局样式
└── App.jsx       # 主应用
```

## 许可证

MIT
