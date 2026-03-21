# Findings & Decisions

## Requirements
- 用户初始化：输入生日，计算生命剩余秒数（78岁 - 出生日期）
- 生命时钟：实时倒计时显示"XX年XX天 XX:XX:XX"
- 每日总结：用户每天填写一次日记（≥50字），提交后 AI 分析
- 意义清单：添加/完成"此生必做"事件，完成奖励 +3天（259200秒）

## Research Findings
- WayBack 定位：生命质量激励与自我成长工具
- 目标用户：25-45岁城市独居青年
- 核心心理驱动：死亡焦虑、社交孤立
- 设计风格：深邃宁静、科技感
- 主色调：深空黑 #0C0A14，星光白 #EAEAEA，暗金 #D4AF37，冰川蓝 #7DF9FF
- 技术栈：React + Vite + PWA, Node.js + Express（模拟）

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| React + Vite | 快速开发、良好的开发体验 |
| PWA | 符合 CLAUDE.md 规划，支持离线 |
| localStorage | MVP 阶段快速验证，无需后端 |
| CSS 动画 | 实现粒子动画、翻页动画、反馈动画 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| 无 | - |

## Resources
- CLAUDE.md - 项目顶层设计文档
- React 官方文档
- Vite 配置指南

## Visual/Browser Findings
- UI 设计规范来自 CLAUDE.md 第5节
- 动效需求来自 CLAUDE.md 第4节
