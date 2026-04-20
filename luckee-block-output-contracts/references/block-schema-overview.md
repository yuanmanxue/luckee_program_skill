# Block Schema 体系概览

本文档帮助 LLM 理解 Luckee 前端 Block Schema 体系的整体设计，
以便在输出结构化 UI 时做出正确的 block type 选择。

---

## 核心概念

### ContentBlock 是什么

`ContentBlock` 是 Luckee 前端的**统一渲染协议单元**。
每一个 block 是一个 JSON 对象，前端根据 `type` 字段找到对应的 Renderer 组件并渲染。

```
LLM 输出 JSON → 前端校验 → BlockView → Renderer 组件 → UI
```

### 为什么用 Block 而不是直接输出 HTML/Markdown

| 方式 | 问题 |
|---|---|
| 直接输出 HTML | 安全风险，前端无法控制样式 |
| 纯 Markdown | 无法渲染交互组件（如勾选框、确认按钮） |
| ContentBlock JSON | 类型安全，前端完全控制渲染，支持交互 |

---

## Block 分类

### 结果 Block（展示数据）

| type | 用途 | 典型场景 |
|---|---|---|
| `product_grid` | 商品网格 | 展示选品结果、竞品对比 |
| `analytics_table` | 分析表格 | 市场数据、关键词分析 |
| `table` | 通用表格 | 任意结构化数据 |
| `markdown` | 富文本 | 分析报告、说明文字 |
| `image_gallery` | 图文画廊 | 商品主图展示 |

### 过程 Block（交互/状态）

| type | 用途 | 典型场景 |
|---|---|---|
| `rufus_suggest_checklist` | 修改建议清单 | Rufus 输出 Listing 优化建议，用户逐条确认 |
| `plan` | 执行计划 | Agent 展示任务步骤和进度 |
| `feedback` | 反馈问卷 | 收集用户偏好 |
| `thinking` | 思考过程 | 展示 Agent 推理过程（流式） |

---

## 如何选择 Block type

```
需要用户交互（勾选/确认/填写）？
  ├── 是，修改建议类 → rufus_suggest_checklist
  ├── 是，问卷类     → feedback
  └── 否，纯展示 ↓

展示的是商品数据？
  ├── 是，有图片/价格/评分 → product_grid
  └── 否 ↓

展示的是表格数据？
  ├── 是，有维度/指标/占比 → analytics_table
  ├── 是，普通表格         → table
  └── 否 ↓

展示的是文字内容？
  └── markdown
```

---

## BaseBlock 基础字段

所有 block 都必须包含以下字段：

```json
{
  "type": "block_type_name",
  "version": "1.0",
  "source": "llm_output"
}
```

| 字段 | 说明 | 约束 |
|---|---|---|
| `type` | block 类型标识 | 见各 block 规范 |
| `version` | schema 版本 | 当前均为 `"1.0"` |
| `source` | 数据来源 | LLM 输出时固定为 `"llm_output"` |
| `metadata` | 可选元数据 | 可携带 `preferredView`、`semanticHint` 等 |

### metadata.preferredView（可选）

当你希望前端以特定视图模式渲染时，可以设置：

```json
{
  "metadata": {
    "preferredView": "card"
  }
}
```

| 值 | 含义 |
|---|---|
| `"auto"` | 前端自动判断（默认） |
| `"card"` | 卡片视图 |
| `"table"` | 表格视图 |
| `"raw"` | 原始数据视图（调试用） |

---

## 版本管理规则

| 变更类型 | 版本变化 | 说明 |
|---|---|---|
| 新增可选字段 | minor +1（1.0 → 1.1） | 向后兼容，不需要迁移 |
| 修改字段含义/名称 | major +1（1.x → 2.0） | Breaking change，需要迁移函数 |
| 新增 block type | 不变 | 注册新 renderer 即可 |

**当前所有 block 均为 `1.0` 版本。**

---

## 兜底机制

前端对 LLM 输出有三级防御：

```
Level 1: 类型守卫校验（isXxxBlock）
  → 通过：正常渲染
  → 不通过，但 type 匹配：进入 Level 2

Level 2: 容错归一化（normalizeXxxBlock）
  → 修复成功：正常渲染
  → 修复失败：进入 Level 3

Level 3: FallbackRenderer
  → 开发环境：显示错误原因 + 原始 JSON
  → 生产环境：显示"内容加载异常"
```

**结论：即使输出格式有小偏差，前端也会尽力修复，不会崩溃。
但仍应尽量输出符合规范的格式，避免触发兜底。**
