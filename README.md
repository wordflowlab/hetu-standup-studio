# 脱口秀工坊

> 把素材、铺垫、包袱、回扣、不同段单和开放麦手记保存在同一可返工工程。

## 简介

河图洛书的独立创作插件，由外部Codex通过河图CLI／MCP读取包内Skill并操作。文风工坊拥有偏好与精修，有声剧拥有录音混音，本包维护喜剧材料、结构和演出手记。不提供观众预测、真人招募、录音识别、演员联系或对外发布。

## 角色分流

- 作者使用 → [插件中心](https://hetu.limeai.run/plugins/standup-studio/)
- Agent与功能Review → [功能清单](CAPABILITIES.md)
- 开发与维护 → [完整设计文档](docs/README.md)

## 快速上手

开发需要Node.js 25，安装与验收基线为河图0.12.6。

```bash
npm ci
npm run build
npm run check
npm run test:unit
npm run package
```

## 边界

专业成果沿固定来源与修订接续，正文采纳、定稿、费用和外发独立决定。发行及实际验收范围见[实施记录](docs/08-实施计划与验收记录.md)。
