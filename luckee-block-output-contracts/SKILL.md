---
name: luckee-block-output-contracts
description: 当 Skill 需要输出 Luckee 前端可直接渲染的结构化 Block（rufus_suggest_checklist、product_grid、table 等）时使用。必须严格遵守 Block Schema 契约，输出 ContentBlock[]。普通聊天或非结构化内容不要使用。
version: 1.0
---

# Luckee Block Output Contracts

> 你是 Block 的生产者。Schema 是协议，Renderer 是执行者。你输出的 JSON 必须让前端直接渲染，不能有任何歧义。

---

## When to use

当且仅当满足以下任一条件时，使用此 Skill：

- 你需要向前端输出结构化 UI 组件（修改建议清单、商品网格、分析表格等）
- 其他业务 Skill（如 `listing-sandbox-analyzer`）要求你生成 Block
- 用户明确提到 "Block"、"rufus suggest checklist"、"商品预览" 等关键词

**不满足以上条件 → 不使用此 Skill，直接回复文本。**

---

## Prohibited

1. 不要直接输出 markdown 表格代替 `product_grid` — 必须用 Block
2. 不要省略 `type`、`version`、`source` 任何一个必填字段
3. 不要在同一个 `structured_blocks` 中混入语义完全不同的 Block
4. 不要自行发明新字段 — 必须严格按 references/ 中的字段表
5. 不要输出未注册的 block type — 前端会触发 FallbackRenderer
6. 不要在 block 字段中嵌入 HTML / JavaScript / Markdown 链接
7. 不要把枚举字段写成中文（如 `risk: "高风险"`）— 必须用英文
8. 不要在一条消息中输出多个同类型 block
9. 不要输出 `items: []` 空数组 — 没有数据就不输出 block
10. 不要使用 snake_case 字段名 — 必须用 camelCase
11. 不要把 `id` 写成数字 — 必须用字符串

---

## Step-by-step Workflow

**严格按以下步骤执行，不可跳步。**

### Step 1: 判断

你的回答是否需要结构化 UI 组件？
- 需要 → 继续 Step 2
- 不需要 → **停止。直接回复文本，不使用此 Skill。**

### Step 2: 选型

确定要输出的 Block 类型（查看下方 Block Registry）：

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

### Step 3: 读取规范（JiT）

**⚠️ 现在立刻读取对应的 references 文件。不可凭记忆输出，不可跳过此步。**

| 你选择的 block type | 你必须现在立刻读取 |
|---|---|
| `rufus_suggest_checklist` | → **现在立刻读取** `references/rufus-suggest-checklist.md` |
| `product_grid` | → **现在立刻读取** `references/field-registry.json` |
| `analytics_table` | → *(规范待补充)* |
| `table` | → *(规范待补充)* |

**同时必须读取**：`references/output-contract-rules.md`（通用规则，所有 block 必读）

### Step 4: 构造 JSON

严格按照 Step 3 读取的规范文件中的字段表，构造完整的 block JSON。

必须填充 BaseBlock 公共字段：
- `type` — 从 Block Registry 中选取
- `version` — 固定 `"1.0"`
- `source` — 固定 `"llm_output"`

### Step 5: 嵌入消息

将 block JSON 包装成 `metadata.structured_blocks` 数组输出。格式见下方 Output Format。

### Step 6: 自检

输出前逐项检查，**任何一项不通过 → 修正后再输出**：

- [ ] `type` 拼写与 Block Registry 完全一致？
- [ ] `version` 是 `"1.0"`？
- [ ] `source` 是 `"llm_output"`？
- [ ] 所有必填字段都存在且非空？
- [ ] 枚举值用英文小写？
- [ ] 数组至少有 1 条数据？
- [ ] 所有字段名用 camelCase？
- [ ] `id` 是字符串不是数字？

---

## Output Format

必须返回以下结构（严格 JSON，直接复制使用）：

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

### BaseBlock 必填字段

| 字段 | 固定值 | 说明 |
|---|---|---|
| `type` | 见 Block Registry | 缺失 → FallbackRenderer |
| `version` | `"1.0"` | 缺失 → FallbackRenderer |
| `source` | `"llm_output"` | 缺失 → FallbackRenderer |

---

## Block Registry

**只能输出下表中的 type 值。输出其他值 = 前端异常。**

| type | 组件名 | 用途 | 规范文件 |
|---|---|---|---|
| `rufus_suggest_checklist` | RufusSuggestCheckList | 逐条修改建议清单，用户可勾选确认 | `references/rufus-suggest-checklist.md` |
| `product_grid` | ProductGridRenderer | 商品网格/卡片 | `references/field-registry.json` |
| `analytics_table` | AnalyticsTableRenderer | 带角色注解的分析表格 | *(待补充)* |
| `table` | TableRenderer | 通用表格 | *(待补充)* |
| `markdown` | MarkdownRenderer | Markdown 富文本 | 不需要此 Skill |
| `image_gallery` | ImageGalleryRenderer | 图文画廊 | *(待补充)* |

---

## JiT References

**⚠️ 不要一次性读取所有文件。按需读取，读完再输出。**

- → **现在立刻读取** `references/rufus-suggest-checklist.md` — 当你需要输出 `rufus_suggest_checklist` 时
- → **现在立刻读取** `references/output-contract-rules.md` — 当你需要输出任何 block 时
- → **现在立刻读取** `references/field-registry.json` — 当你需要输出 `product_grid` 或理解字段体系时
- → **现在立刻读取** `references/block-schema-overview.md` — 当你不确定选哪种 block type 时

---

## Examples

### GOOD

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

为什么正确：type/version/source 完整 · risk 英文枚举 · id 字符串 · camelCase · items 非空 · warning 可选时省略

### BAD

```json
{
  "metadata": {
    "structured_blocks": [
      {
        "type": "rufus_checklist",
        "items": [
          {
            "id": 1,
            "risk": "高风险",
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
| 2 | 缺少 `version` 和 `source` | 必须有 `"1.0"` 和 `"llm_output"` |
| 3 | `id: 1` 是数字 | `"1"` 字符串 |
| 4 | `risk: "高风险"` 中文 | `"high"` |
| 5 | `current_content` snake_case | `currentContent` |
| 6 | `suggested_content: ""` 空字符串 | 必须有实质内容 |
| 7 | 缺少 `field`、`description` 必填字段 | 每条 item 必须完整 |

---

**每种 block 的完整 Examples（含更多场景）在对应的 references 文件中。新增 block 时，Examples 写在该 block 的 references 文件里，不需要改 SKILL.md。**

---

## Fallback Behavior

前端有三级防御，但你的目标是**永远不触发 FallbackRenderer**：

| 你的输出 | 前端行为 | 用户体验 |
|---|---|---|
| 完全符合规范 | 正常渲染 | 最佳 |
| risk 写成中文 | 容错修复后渲染 | 可用但有性能开销 |
| snake_case 字段名 | 容错修复后渲染 | 可用但有性能开销 |
| type 拼写错误 | **FallbackRenderer** | **用户看到异常** |
| items 为空 | **FallbackRenderer** | **用户看到异常** |
| 缺少 type/version/source | **FallbackRenderer** | **用户看到异常** |

---

## Dependency Declaration

本 Skill 是 Block 输出的基础契约层，供所有业务 Skill 依赖。任何需要输出结构化 Block 的 Skill，都必须调用本 Skill，不可自行构造 JSON。调用方在自己的 SKILL.md 中声明依赖即可，无需在本文件中注册。
