---
name: luckee-block-output-contracts
description: "Luckee 项目 Block Schema 输出契约。定义所有 LLM 可输出的 ContentBlock 类型的 JSON 格式规范、字段约束、兜底规则和 Skill 联动方式。当 Skill 需要输出结构化 UI 组件（如建议清单、商品网格、分析表格等）时，必须读取本 skill 中对应的 block 规范。"
---

# Luckee Block Output Contracts

## 概述

本 skill 定义 Luckee 前端 Block Schema 体系中，所有 LLM 可产出的 `ContentBlock` 类型的**输出契约**。

**核心原则：Schema 是协议，Renderer 是执行者，LLM 是生产者。**

LLM 输出的 JSON 必须符合对应 block 的 schema 契约，前端才能正确渲染。
不符合契约的输出会触发兜底渲染（FallbackRenderer），用户体验降级。

---

## 使用方式

当你（Skill）需要输出某种结构化 UI 时：

1. 在下方"已注册 Block 目录"中找到对应的 block type
2. 读取对应的 `references/` 文件，了解完整的字段规范
3. 按规范输出 JSON，嵌入到消息的 `structured_blocks` 字段中

```
消息结构示例：
{
  "content": "这是普通文本说明...",
  "metadata": {
    "structured_blocks": [
      { "type": "rufus_suggest_checklist", "version": "1.0", ... }
    ]
  }
}
```

---

## 已注册 Block 目录

| Block type | 组件名 | 用途 | 规范文件 |
|---|---|---|---|
| `rufus_suggest_checklist` | `RufusSuggestCheckList` | Rufus 输出的逐条修改建议清单，用户可勾选确认 | `references/rufus-suggest-checklist.md` |
| `product_grid` | `ProductGridRenderer` | 商品网格，支持卡片/表格视图 | *(待补充)* |
| `analytics_table` | `AnalyticsTableRenderer` | 带角色注解的分析表格 | *(待补充)* |
| `table` | `TableRenderer` | 通用表格 | *(待补充)* |
| `markdown` | `MarkdownRenderer` | Markdown 文本 | *(待补充)* |
| `image_gallery` | `ImageGalleryRenderer` | 图文画廊 | *(待补充)* |

---

## 通用输出规则

所有 block 都必须遵守以下基础规则，详见 `references/output-contract-rules.md`：

1. 必须包含 `type`、`version`、`source` 三个基础字段
2. `source` 固定为 `"llm_output"`
3. `version` 固定为当前版本（见各 block 规范）
4. 不要在 `structured_blocks` 中混入不同语义的 block（如把建议清单和商品网格放在同一条消息）
5. 输出 block 时，消息的 `content` 字段可以为空字符串，也可以包含对 block 的文字说明

---

## 扩展方式

新增 block type 时：

1. 在 `src/lib/blocks/types.ts` 中定义新的 interface
2. 在 `src/components/blocks/` 中实现 Renderer 组件
3. 在本 skill 的 `references/` 目录下新增对应的规范文件
4. 在上方"已注册 Block 目录"表格中补充条目

---

## 参考文档

- `references/output-contract-rules.md` — 通用输出契约规则
- `references/rufus-suggest-checklist.md` — rufus_suggest_checklist 完整规范
- `docs/Block Schema 统一渲染架构设计方案.md` — 前端 Block Schema 体系总设计
- `src/lib/blocks/types.ts` — TypeScript 类型定义（权威来源）
