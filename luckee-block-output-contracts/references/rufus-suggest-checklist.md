# rufus_suggest_checklist — Skill 输出规范

**Block type**: `rufus_suggest_checklist`
**组件名**: `RufusSuggestCheckList`
**版本**: `1.0`
**状态**: 生产可用

---

## 1. 组件用途

当 Rufus 完成分析后，需要向用户展示一组**可逐条确认或跳过的修改建议**时，输出此 block。

用户可以：
- 勾选/取消勾选每条建议
- 展开查看"当前内容 vs 建议内容"的对比
- 批量确认选中项，或整体跳过

### 适用场景

| 场景 | 说明 |
|---|---|
| Listing 优化 | 标题、Bullet Point、Search Terms、Description 的修改建议 |
| 合规审查 | 违禁词替换、品牌词侵权修复建议 |
| SEO 关键词调整 | 后台搜索词补充或替换建议 |
| 商品信息补全 | 缺失属性字段的填写建议 |

### 不适用场景

| 场景 | 应使用的 block |
|---|---|
| 纯信息展示，无需用户确认 | `markdown` |
| 数据对比表格，无修改建议 | `analytics_table` 或 `table` |
| 单条建议，不需要清单形式 | `markdown`（普通文本即可） |
| 建议项为 0 条 | 不输出任何 block，用文本说明"未发现需要修改的项" |

---

## 2. 完整输出格式

```json
{
  "type": "rufus_suggest_checklist",
  "version": "1.0",
  "source": "llm_output",
  "title": "Rufus 建议修改清单",
  "description": "以下建议已按可执行字段整理，你可以先筛掉不想动的项，再确认本次修改范围。",
  "items": [
    {
      "id": "1",
      "field": "标题",
      "risk": "medium",
      "description": "核心成交词靠后，标题前半段缺少高意图词和具体利益点。",
      "warning": "会直接影响前台标题展示，建议在提交前再确认品牌词顺序。",
      "currentContent": "Wireless Earbuds Bluetooth Headphones for Sports and Daily Use",
      "suggestedContent": "Wireless Earbuds with Noise Cancelling, 48H Battery for Gym, Travel and Calls"
    },
    {
      "id": "2",
      "field": "Bullet Point 1",
      "risk": "low",
      "description": "卖点表达过泛，缺少数字锚点和使用场景，无法快速建立购买理由。",
      "currentContent": "Long battery life and comfortable fit for everyday listening.",
      "suggestedContent": "Up to 48 hours of battery life with compact charging case, ideal for commuting, workouts and long trips."
    },
    {
      "id": "3",
      "field": "Search Terms",
      "risk": "low",
      "description": "后台词重复度高，缺少更强购买意图的变体词。",
      "warning": "仅影响后台搜索词，不改变前台展示内容。",
      "currentContent": "wireless earbuds bluetooth headphones sport earphones",
      "suggestedContent": "noise cancelling earbuds workout headphones long battery earphones commute travel gym wireless bluetooth 48h"
    }
  ]
}
```

---

## 3. 字段规范

### 3.1 顶层字段

| 字段 | 类型 | 必填 | 约束 | 说明 |
|---|---|---|---|---|
| `type` | string | **是** | 固定值 `"rufus_suggest_checklist"` | 不可更改 |
| `version` | string | **是** | 固定值 `"1.0"` | 不可更改 |
| `source` | string | **是** | 固定值 `"llm_output"` | 不可更改 |
| `title` | string | 否 | 不超过 30 字 | 默认显示"Rufus 建议修改清单" |
| `description` | string | 否 | 不超过 100 字 | 对清单的整体说明 |
| `items` | array | **是** | 至少 1 条，建议不超过 10 条 | 建议项列表 |

### 3.2 items 数组中每条建议的字段

| 字段 | 类型 | 必填 | 约束 | 说明 |
|---|---|---|---|---|
| `id` | string | **是** | 从 `"1"` 开始递增 | 唯一标识，用于用户勾选时追踪 |
| `field` | string | **是** | 自由文本 | 被修改的字段名称，如 "标题"、"Bullet Point 1" |
| `risk` | string | **是** | 枚举：`"high"` / `"medium"` / `"low"` | 风险等级，**必须用英文** |
| `description` | string | **是** | 1-2 句话 | 问题描述，说明为什么需要修改 |
| `warning` | string | 否 | 1 句话 | 风险提示，说明修改可能带来的影响 |
| `currentContent` | string | **是** | 可为空字符串 | 当前内容原文 |
| `suggestedContent` | string | **是** | 不可为空 | 建议修改后的内容 |

---

## 4. risk 等级判定标准

| 等级 | 含义 | 典型场景 | 前端颜色 |
|---|---|---|---|
| `"high"` | 影响合规性、账号安全，或可能导致 Listing 被下架 | 品牌词侵权、违禁词、类目错误 | 红色 `#ba1c1c` |
| `"medium"` | 影响转化率或前台展示效果 | 标题关键词顺序不佳、主图描述缺失 | 橙黄色 `#fbbd23` |
| `"low"` | 优化建议，不影响核心功能 | 后台搜索词补充、Bullet Point 细化 | 绿色 `#047756` |

**判定原则**：
- 不确定等级时，默认使用 `"low"`
- 同一条建议只能有一个 risk 等级，选最高的那个
- 不要把 risk 写成中文（如 `"高风险"`），必须用英文枚举值

---

## 5. 常规场景示例

### 场景 A：Listing 标题优化（medium risk）

```json
{
  "id": "1",
  "field": "标题",
  "risk": "medium",
  "description": "核心成交词靠后，标题前半段缺少高意图词和具体利益点。",
  "warning": "会直接影响前台标题展示，建议在提交前再确认品牌词顺序。",
  "currentContent": "Wireless Earbuds Bluetooth Headphones for Sports",
  "suggestedContent": "Wireless Earbuds with Noise Cancelling, 48H Battery for Gym"
}
```

### 场景 B：违禁词修复（high risk）

```json
{
  "id": "1",
  "field": "标题",
  "risk": "high",
  "description": "标题中包含 Amazon 平台违禁词 'best'，可能导致 Listing 被下架。",
  "warning": "违禁词问题会直接影响 Listing 状态，建议立即修改。",
  "currentContent": "Best Wireless Earbuds for Sports",
  "suggestedContent": "Top-Rated Wireless Earbuds for Sports"
}
```

### 场景 C：后台搜索词补充（low risk，无 warning）

```json
{
  "id": "3",
  "field": "Search Terms",
  "risk": "low",
  "description": "后台词重复度高，缺少更强购买意图的变体词。",
  "currentContent": "wireless earbuds bluetooth headphones",
  "suggestedContent": "noise cancelling earbuds workout headphones long battery earphones"
}
```

### 场景 D：新增字段（currentContent 为空）

```json
{
  "id": "4",
  "field": "A+ 内容模块标题",
  "risk": "low",
  "description": "当前 A+ 内容缺少模块标题，建议补充以提升页面结构清晰度。",
  "currentContent": "",
  "suggestedContent": "为什么选择我们的无线耳机？"
}
```

---

## 6. 异常场景处理规则

| 异常场景 | 正确处理方式 |
|---|---|
| 无法确定 risk 等级 | 默认使用 `"low"` |
| 某字段没有当前内容（新增场景） | `currentContent` 设为空字符串 `""` |
| 建议项为 0 条 | **不输出此 block**，改用 markdown 文本说明 |
| 建议项超过 10 条 | 按 risk 优先级排序（high → medium → low），保留前 10 条，其余用 markdown 文本概述 |
| 同一字段有多条建议 | 合并为一条，在 description 中分点说明 |
| 建议内容与当前内容完全相同 | 不输出该条 item |
| LLM 不确定建议是否合适 | 在 `warning` 字段中说明不确定性，仍然输出该条 item |

---

## 7. 禁止行为

以下行为会导致前端渲染异常或用户体验降级：

1. **不要**把 `risk` 写成中文（如 `"高风险"`），必须用英文枚举值 `"high"` / `"medium"` / `"low"`
2. **不要**省略 `currentContent` 或 `suggestedContent`，即使内容很短
3. **不要**在一条消息中输出多个 `rufus_suggest_checklist` block
4. **不要**把不相关的建议混入同一个 checklist（如把 SEO 建议和图片建议混在一起）
5. **不要**在 items 数组为空时输出此 block
6. **不要**在 `suggestedContent` 中输出空字符串（建议内容必须有实质内容）
7. **不要**修改 `type`、`version`、`source` 的值

---

## 8. 前端兜底行为（供参考）

了解前端如何处理异常输出，有助于理解为什么要遵守规范：

| LLM 输出情况 | 前端行为 |
|---|---|
| 完全符合规范 | `RufusSuggestCheckList` 正常渲染 |
| `risk` 写成中文（如 `"高"`） | 容错归一化，映射到 `"high"`，正常渲染 |
| 字段名用 snake_case（如 `current_content`） | 容错归一化，映射到 `currentContent`，正常渲染 |
| `items` 为空数组 | 归一化失败，触发 `FallbackRenderer` |
| 缺少 `type` 字段 | 无法识别 block，触发 `FallbackRenderer` |
| `type` 拼写错误（如 `"rufus_checklist"`） | 无对应 Renderer，触发 `FallbackRenderer` |

---

## 9. 与产品 Skill 的结合方式

在产品 Skill（如 Rufus Listing 优化 Skill）的 prompt 中，引用本规范：

```
当你完成 Listing 分析后，如果发现需要修改的字段，
使用 rufus_suggest_checklist block 输出修改建议清单。
格式规范见 luckee-block-output-contracts/references/rufus-suggest-checklist.md。

输出要求：
- 每条建议必须包含 field、risk、description、currentContent、suggestedContent
- risk 必须是 "high" / "medium" / "low" 之一
- 建议项按 risk 从高到低排序
- 不超过 10 条
```

---

## 10. 未来扩展（预留）

以下功能当前不支持，但 schema 设计已预留扩展空间：

| 功能 | 扩展方式 |
|---|---|
| 流式追加 items | 新增可选字段 `streaming?: boolean`，Renderer 显示加载态 |
| 字段差异化渲染 | 新增可选字段 `fieldType?: string`，定义字段类型枚举 |
| 操作结果回传后端 | 引入 `useBlockActionStore`，通过 WebSocket 回传 `result` |
| 批量操作增强 | 全选/按 risk 筛选/拖拽排序 |

---

## 11. Examples

### GOOD：完整的多字段建议清单

场景：Rufus 分析完 Listing，发现标题（medium）、违禁词（high）、搜索词（low）三处问题。

```json
{
  "content": "分析完成，发现 3 处可优化项，已按风险等级排序：",
  "metadata": {
    "structured_blocks": [
      {
        "type": "rufus_suggest_checklist",
        "version": "1.0",
        "source": "llm_output",
        "title": "Rufus 建议修改清单",
        "description": "以下建议已按字段整理，你可以先筛掉不想动的项，再确认本次修改范围。",
        "items": [
          {
            "id": "1",
            "field": "标题",
            "risk": "high",
            "description": "标题中包含 Amazon 平台违禁词 'best'，可能导致 Listing 被下架。",
            "warning": "违禁词问题会直接影响 Listing 状态，建议立即修改。",
            "currentContent": "Best Wireless Earbuds for Sports",
            "suggestedContent": "Top-Rated Wireless Earbuds for Sports"
          },
          {
            "id": "2",
            "field": "Bullet Point 1",
            "risk": "medium",
            "description": "卖点表达过泛，缺少数字锚点和使用场景，无法快速建立购买理由。",
            "currentContent": "Long battery life and comfortable fit for everyday listening.",
            "suggestedContent": "Up to 48 hours of battery life with compact charging case, ideal for commuting, workouts and long trips."
          },
          {
            "id": "3",
            "field": "Search Terms",
            "risk": "low",
            "description": "后台词重复度高，缺少更强购买意图的变体词。",
            "currentContent": "wireless earbuds bluetooth headphones sport earphones",
            "suggestedContent": "noise cancelling earbuds workout headphones long battery earphones commute travel gym"
          }
        ]
      }
    ]
  }
}
```

**为什么正确**：
- `type` / `version` / `source` 三个必填字段完整
- items 按 risk 从高到低排序（high → medium → low）
- `risk` 全部用英文枚举值
- `id` 是字符串
- 所有字段名 camelCase
- `warning` 仅在需要时出现（第 2、3 条省略）
- `suggestedContent` 均有实质内容

---

### BAD：7 个典型错误

```json
{
  "metadata": {
    "structured_blocks": [
      {
        "type": "rufus_checklist",
        "items": [
          {
            "id": 1,
            "field": "标题",
            "risk": "高风险",
            "description": "标题需要修改",
            "current_content": "Best Wireless Earbuds",
            "suggested_content": ""
          },
          {
            "id": 2,
            "field": "图片",
            "risk": "low",
            "description": "主图背景不符合规范。",
            "currentContent": "白底图",
            "suggestedContent": "纯白背景，商品占图片面积 85% 以上"
          }
        ]
      }
    ]
  }
}
```

| # | 错误位置 | 错误内容 | 正确写法 |
|---|---|---|---|
| 1 | `type` | `"rufus_checklist"` 拼写错误 | `"rufus_suggest_checklist"` |
| 2 | 顶层 | 缺少 `version` 和 `source` | 必须有 `"1.0"` 和 `"llm_output"` |
| 3 | item[0].id | `1` 是数字 | `"1"` 字符串 |
| 4 | item[0].risk | `"高风险"` 中文枚举 | `"high"` |
| 5 | item[0].description | `"标题需要修改"` 过于笼统 | 说明具体原因，如"包含违禁词 'best'" |
| 6 | item[0] | `current_content` snake_case | `currentContent` |
| 7 | item[0].suggestedContent | `""` 空字符串 | 必须有实质内容 |
