---
name: luckee-block-output-contracts
description: 当需要输出 Luckee 前端可直接渲染的结构化 Block（rufus_suggest_checklist、product_grid、analytics_table、table 等）时使用。必须严格遵守 Block Schema 契约，输出 ContentBlock JSON。普通聊天、非结构化回答、纯文本说明不要使用此 Skill。
version: "1.0"
---

# Luckee Block Output Contracts

> Schema 是协议，Renderer 是执行者，你是生产者。

---

## When to use

使用此 Skill 当且仅当你的回答需要输出**前端可直接渲染的结构化 UI 组件**：

- 需要用户逐条确认的修改建议 → `rufus_suggest_checklist`
- 需要展示商品列表/网格 → `product_grid`
- 需要展示带维度/指标的分析数据 → `analytics_table`
- 需要展示通用表格 → `table`
- 需要展示图文画廊 → `image_gallery`

### 选型决策树

```
需要用户交互（勾选/确认/填写）？
  ├── 修改建议类 → rufus_suggest_checklist
  ├── 问卷类     → feedback
  └── 否，纯展示 ↓
展示商品数据（有图片/价格/评分）？ → product_grid
展示表格（有维度/指标/占比）？     → analytics_table
展示普通表格？                     → table
展示文字内容？                     → markdown（不需要此 Skill）
```

---

## Prohibited

以下情况**禁止**使用此 Skill：

1. 普通对话、闲聊、问答 — 直接用文本回复
2. 纯 Markdown 内容（分析报告、说明文字）— 直接输出 markdown，不需要 block
3. 建议项为 0 条时 — 不输出 block，用文本说明"未发现需要修改的项"
4. 不确定该用哪种 block — 先用文本回复，不要猜测 block type

**绝对禁止**：
- 输出未注册的 block type（前端会触发 FallbackRenderer）
- 在 block 字段中嵌入 HTML / JavaScript / Markdown 链接
- 把 `risk` 等枚举字段写成中文
- 在一条消息中输出多个同类型 block
- 输出 `items: []` 空数组

---

## Step-by-step Workflow

### Step 1: 判断是否需要 block

如果你的回答只是文字说明、分析报告、或普通对话 → **不使用此 Skill，直接回复文本**。

### Step 2: 选择 block type

根据上方决策树选择正确的 block type。如果不确定，不要输出 block。

### Step 3: 读取对应的 block 规范（JiT）

根据选定的 block type，**立刻读取**对应的 references 文件：

| Block type | 必须读取 |
|---|---|
| `rufus_suggest_checklist` | `references/rufus-suggest-checklist.md` |
| `product_grid` | `references/field-registry.json` + *(规范待补充)* |
| `analytics_table` | *(规范待补充)* |
| `table` | *(规范待补充)* |

同时读取通用规则：`references/output-contract-rules.md`

### Step 4: 构造 block JSON

严格按照规范文件中的字段表构造 JSON。必须包含三个基础字段：

```json
{
  "type": "<block_type>",
  "version": "1.0",
  "source": "llm_output"
}
```

### Step 5: 嵌入消息

将 block JSON 放入 `metadata.structured_blocks` 数组：

```json
{
  "content": "分析完成，以下是修改建议：",
  "metadata": {
    "structured_blocks": [
      { "type": "rufus_suggest_checklist", "version": "1.0", "source": "llm_output", ... }
    ]
  }
}
```

### Step 6: 自检

输出前检查：
- [ ] `type` 拼写正确？
- [ ] `version` 是 `"1.0"`？
- [ ] `source` 是 `"llm_output"`？
- [ ] 必填字段全部存在？
- [ ] 枚举值用英文？
- [ ] 数组不为空？
- [ ] 字段名用 camelCase？

---

## Output Format

### 消息结构

```json
{
  "content": "<可选的文字说明>",
  "metadata": {
    "structured_blocks": [
      <ContentBlock JSON>
    ]
  }
}
```

### BaseBlock 必填字段

所有 block 都必须包含：

| 字段 | 值 | 说明 |
|---|---|---|
| `type` | 见注册表 | block 类型标识 |
| `version` | `"1.0"` | 当前固定值 |
| `source` | `"llm_output"` | 固定值 |

### 已注册 Block 类型

| type | 组件名 | 用途 |
|---|---|---|
| `rufus_suggest_checklist` | RufusSuggestCheckList | 逐条修改建议清单，用户可勾选确认 |
| `product_grid` | ProductGridRenderer | 商品网格/卡片 |
| `analytics_table` | AnalyticsTableRenderer | 带角色注解的分析表格 |
| `table` | TableRenderer | 通用表格 |
| `markdown` | MarkdownRenderer | Markdown 富文本 |
| `image_gallery` | ImageGalleryRenderer | 图文画廊 |

---

## JiT References

按需读取，不要一次性全部加载：

| 文件 | 何时读取 |
|---|---|
| `references/rufus-suggest-checklist.md` | 需要输出修改建议清单时 |
| `references/output-contract-rules.md` | 任何 block 输出前（通用规则） |
| `references/block-schema-overview.md` | 不确定选哪种 block type 时 |
| `references/field-registry.json` | 需要输出 product_grid 或理解字段体系时 |

---

## Examples

### Good Example: rufus_suggest_checklist

场景：Rufus 分析完 Listing 后，发现标题和搜索词需要优化。

```json
{
  "content": "分析完成，发现 2 处可优化项：",
  "metadata": {
    "structured_blocks": [
      {
        "type": "rufus_suggest_checklist",
        "version": "1.0",
        "source": "llm_output",
        "title": "Rufus 建议修改清单",
        "description": "以下建议已按字段整理，确认后将自动应用。",
        "items": [
          {
            "id": "1",
            "field": "标题",
            "risk": "medium",
            "description": "核心成交词靠后，前半段缺少高意图词。",
            "warning": "会直接影响前台标题展示。",
            "currentContent": "Wireless Earbuds Bluetooth Headphones for Sports",
            "suggestedContent": "Wireless Earbuds with Noise Cancelling, 48H Battery for Gym"
          },
          {
            "id": "2",
            "field": "Search Terms",
            "risk": "low",
            "description": "后台词重复度高，缺少购买意图变体词。",
            "currentContent": "wireless earbuds bluetooth headphones",
            "suggestedContent": "noise cancelling earbuds workout headphones long battery"
          }
        ]
      }
    ]
  }
}
```

**为什么好**：type/version/source 正确，risk 用英文枚举，items 非空，字段完整，camelCase 命名。

### Bad Example: 常见错误

```json
{
  "content": "",
  "metadata": {
    "structured_blocks": [
      {
        "type": "rufus_checklist",
        "version": "1.0",
        "source": "llm_output",
        "items": [
          {
            "id": 1,
            "field": "标题",
            "risk": "高风险",
            "description": "标题需要修改",
            "current_content": "...",
            "suggested_content": ""
          }
        ]
      }
    ]
  }
}
```

**错误清单**：
1. `type` 拼写错误（`rufus_checklist` → 应为 `rufus_suggest_checklist`）
2. `id` 是数字（应为字符串 `"1"`）
3. `risk` 用了中文（`"高风险"` → 应为 `"high"`）
4. 字段名用 snake_case（`current_content` → 应为 `currentContent`）
5. `suggestedContent` 为空字符串（禁止）
6. `description` 过于笼统，没有说明具体原因

---

## Fallback Behavior

前端有三级防御，即使你输出有小偏差也不会崩溃，但会降级：

| 你的输出 | 前端行为 |
|---|---|
| 完全符合规范 | 正常渲染对应组件 |
| risk 写成中文 | 容错修复，仍可渲染 |
| snake_case 字段名 | 容错修复，仍可渲染 |
| type 拼写错误 | **FallbackRenderer**（用户看到异常） |
| items 为空 | **FallbackRenderer**（用户看到异常） |
| 缺少 type 字段 | **FallbackRenderer**（用户看到异常） |

**目标：永远不触发 FallbackRenderer。**
