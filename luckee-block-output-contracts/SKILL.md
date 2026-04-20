---
name: luckee-block-output-contracts
description: 当需要输出 Luckee 前端可直接渲染的结构化 Block（rufus_suggest_checklist、product_grid、table 等）时使用。必须严格遵守 Block Schema 契约，输出 ContentBlock JSON。普通聊天或非结构化内容不要使用。
version: "1.0"
---

# Luckee Block Output Contracts

> 你是 Block 的生产者。Schema 是协议，Renderer 是执行者。你输出的 JSON 必须让前端直接渲染，不能有任何歧义。

---

## When to use

当且仅当你的回答需要输出**前端可直接渲染的结构化 UI 组件**时，使用此 Skill。

触发条件（满足任一即触发）：

- 你需要输出一组让用户逐条确认的修改建议 → `rufus_suggest_checklist`
- 你需要展示商品列表、选品结果、竞品对比 → `product_grid`
- 你需要展示带维度/指标的分析数据 → `analytics_table`
- 你需要展示通用结构化表格 → `table`
- 你需要展示图文画廊 → `image_gallery`

如果你的回答只是文字说明、分析报告、普通对话 → **不使用此 Skill，直接回复文本。**

---

## Prohibited

**绝对禁止以下行为：**

1. 输出未注册的 block type — 前端会触发 FallbackRenderer，用户看到异常
2. 在 block 字段中嵌入 HTML / JavaScript / Markdown 链接
3. 把 `risk` 等枚举字段写成中文（如 `"高风险"`）— 必须用英文 `"high"`
4. 在一条消息中输出多个同类型 block
5. 输出 `items: []` 空数组 — 如果没有建议项，不要输出 block
6. 使用 snake_case 字段名（如 `current_content`）— 必须用 camelCase（`currentContent`）
7. 把 `id` 写成数字（如 `1`）— 必须用字符串（`"1"`）
8. `suggestedContent` 为空字符串 — 建议内容必须有实质内容
9. 不确定该用哪种 block 时猜测输出 — 不确定就用纯文本

---

## Step-by-step Workflow

**严格按以下步骤执行，不可跳步。**

### Step 1: 判断

你的回答是否需要结构化 UI 组件？

- 需要 → 继续 Step 2
- 不需要 → **停止，直接回复文本，不使用此 Skill**

### Step 2: 选型

根据决策树选择 block type：

```
需要用户交互（勾选/确认/填写）？
  ├── 修改建议类 → rufus_suggest_checklist
  ├── 问卷类     → feedback
  └── 否，纯展示 ↓
展示商品数据（有图片/价格/评分）？ → product_grid
展示表格（有维度/指标/占比）？     → analytics_table
展示普通表格？                     → table
展示图文？                         → image_gallery
展示文字？                         → 不需要 block，用 markdown
```

如果不确定 → **不输出 block，用纯文本回复。**

### Step 3: 读取规范（JiT — 必须执行）

**你必须现在立刻读取对应的 references 文件，不可凭记忆输出。**

| 你选择的 block type | 你必须现在立刻读取 |
|---|---|
| `rufus_suggest_checklist` | `references/rufus-suggest-checklist.md` |
| `product_grid` | `references/field-registry.json` |
| `analytics_table` | *(规范待补充)* |
| `table` | *(规范待补充)* |

**同时读取**：`references/output-contract-rules.md`（通用规则，所有 block 必读）

### Step 4: 构造 JSON

严格按照 Step 3 读取的规范文件中的字段表，构造完整的 block JSON。

### Step 5: 嵌入消息

将 block JSON 放入 `metadata.structured_blocks` 数组。格式见下方 Output Format。

### Step 6: 自检

输出前逐项检查：

- [ ] `type` 拼写与注册表完全一致？
- [ ] `version` 是 `"1.0"`？
- [ ] `source` 是 `"llm_output"`？
- [ ] 所有必填字段都存在且非空？
- [ ] 枚举值用英文小写？
- [ ] 数组至少有 1 条数据？
- [ ] 所有字段名用 camelCase？
- [ ] `id` 是字符串不是数字？

**任何一项不通过 → 修正后再输出。**

---

## Output Format

### 消息结构模板（直接复制使用）

```json
{
  "content": "你的文字说明（可选，可为空字符串）",
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
          }
        ]
      }
    ]
  }
}
```

### BaseBlock 三个必填字段

每个 block 都必须包含，缺一不可：

| 字段 | 固定值 |
|---|---|
| `type` | 见下方注册表 |
| `version` | `"1.0"` |
| `source` | `"llm_output"` |

---

## Block Registry（已注册类型）

| type | 组件名 | 用途 | 规范文件 |
|---|---|---|---|
| `rufus_suggest_checklist` | RufusSuggestCheckList | 逐条修改建议清单，用户可勾选确认 | `references/rufus-suggest-checklist.md` |
| `product_grid` | ProductGridRenderer | 商品网格/卡片 | `references/field-registry.json` |
| `analytics_table` | AnalyticsTableRenderer | 带角色注解的分析表格 | *(待补充)* |
| `table` | TableRenderer | 通用表格 | *(待补充)* |
| `markdown` | MarkdownRenderer | Markdown 富文本 | 不需要此 Skill |
| `image_gallery` | ImageGalleryRenderer | 图文画廊 | *(待补充)* |

**只能输出上表中的 type 值。输出其他值 = 前端异常。**

---

## JiT References

**不要一次性读取所有文件。按需读取，读完再输出。**

| 文件 | 何时必须读取 |
|---|---|
| `references/rufus-suggest-checklist.md` | 输出 `rufus_suggest_checklist` 前 **必须读取** |
| `references/output-contract-rules.md` | 输出任何 block 前 **必须读取** |
| `references/field-registry.json` | 输出 `product_grid` 或需要理解字段体系时 |
| `references/block-schema-overview.md` | 不确定选哪种 block type 时 |

---

## Examples

### GOOD: rufus_suggest_checklist

场景：Rufus 分析完 Listing，发现标题和搜索词需要优化。

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
            "description": "核心成交词靠后，前半段缺少高意图词和具体利益点。",
            "warning": "会直接影响前台标题展示，建议提交前再确认品牌词顺序。",
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

**为什么正确**：
- `type` / `version` / `source` 三个必填字段完整且正确
- `risk` 用英文枚举值 `"medium"` / `"low"`
- `id` 是字符串 `"1"` 不是数字
- 所有字段名 camelCase
- `items` 非空，每条 item 必填字段完整
- `warning` 可选字段在不需要时省略（第 2 条没有 warning）

### BAD: 6 个典型错误

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

| # | 错误 | 正确写法 |
|---|---|---|
| 1 | `type: "rufus_checklist"` 拼写错误 | `"rufus_suggest_checklist"` |
| 2 | `id: 1` 是数字 | `"1"` 字符串 |
| 3 | `risk: "高风险"` 中文枚举 | `"high"` |
| 4 | `current_content` snake_case | `currentContent` |
| 5 | `suggested_content: ""` 空字符串 | 必须有实质内容 |
| 6 | `description` 过于笼统 | 应说明具体原因 |

**以上任何一个错误都会导致渲染异常或用户体验降级。**

---

## Fallback Behavior

前端有三级防御，但你的目标是**永远不触发 FallbackRenderer**：

| 你的输出 | 前端行为 | 用户体验 |
|---|---|---|
| 完全符合规范 | 正常渲染 | 最佳 |
| risk 写成中文 | 容错修复后渲染 | 正常但有性能开销 |
| snake_case 字段名 | 容错修复后渲染 | 正常但有性能开销 |
| type 拼写错误 | **FallbackRenderer** | **用户看到异常** |
| items 为空 | **FallbackRenderer** | **用户看到异常** |
| 缺少 type 字段 | **FallbackRenderer** | **用户看到异常** |

---

## Dependency Declaration

本 Skill 被其他业务 Skill 依赖。当业务 Skill（如 `listing-sandbox-analyzer`、`rufus-listing-optimizer` 等）需要输出结构化 Block 时，**必须调用本 Skill 生成 Block，不可自行构造 JSON。**
