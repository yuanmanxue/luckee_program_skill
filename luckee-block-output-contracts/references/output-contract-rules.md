# 通用输出契约规则

本文档定义适用于**所有 ContentBlock 类型**的通用规则。
每个具体 block 的规范文件（如 `rufus-suggest-checklist.md`）在此基础上补充特定规则。

---

## 1. 必须遵守的基础规则

### 1.1 BaseBlock 三个必填字段

任何 block 输出都必须包含：

```json
{
  "type": "block_type_name",
  "version": "1.0",
  "source": "llm_output"
}
```

缺少任何一个字段，前端将无法识别 block，直接触发 FallbackRenderer。

### 1.2 source 固定值

LLM 输出时，`source` 必须固定为 `"llm_output"`，不可使用其他值。

其他合法值（`"excel_parser"`、`"markdown_parser"` 等）由前端 Parser 使用，LLM 不应输出。

### 1.3 version 使用当前版本

当前所有 block 均为 `"1.0"`。不要自行升级版本号，版本变更由前端工程师统一管理。

---

## 2. 输出位置规则

### 2.1 structured_blocks 字段

Block JSON 应放在消息的 `metadata.structured_blocks` 数组中：

```json
{
  "content": "这里是普通文本说明（可选）",
  "metadata": {
    "structured_blocks": [
      {
        "type": "rufus_suggest_checklist",
        "version": "1.0",
        "source": "llm_output",
        "items": [...]
      }
    ]
  }
}
```

### 2.2 content 字段与 block 的关系

| 情况 | content 字段 | structured_blocks |
|---|---|---|
| 只有 block，无文字说明 | 空字符串 `""` | 包含 block |
| block + 前置说明文字 | 说明文字 | 包含 block |
| 只有文字，无 block | 文字内容 | 空数组或不传 |

### 2.3 每条消息的 block 数量

- 同一条消息中，**同类型 block 只输出一个**
- 不同类型的 block 可以共存（如一个 `markdown` + 一个 `rufus_suggest_checklist`）
- 避免在同一条消息中输出语义不相关的多个 block

---

## 3. 字段类型规则

### 3.1 字符串字段

- 不要输出 `null`，用空字符串 `""` 代替
- 不要输出数字类型的字符串字段（如 `"id": 1`），必须用字符串（`"id": "1"`）

### 3.2 枚举字段

- 枚举值必须精确匹配，区分大小写
- 不要使用中文枚举值（如 `"高风险"`），必须用英文（`"high"`）
- 不确定时使用默认值（各 block 规范中有说明）

### 3.3 数组字段

- 必填数组不要输出空数组 `[]`（如 `items: []`）
- 如果没有数据，不输出该 block，改用文本说明

### 3.4 可选字段

- 可选字段在没有有效内容时，直接省略该字段，不要输出 `null` 或空字符串
- 例外：`currentContent` 在新增场景下可以为空字符串（见各 block 规范）

---

## 4. 内容质量规则

### 4.1 description 类字段

- 简洁，1-2 句话
- 说明"为什么"，而不是重复"是什么"
- 不要在 description 中重复 field 名称

**好的示例**：
```
"description": "核心成交词靠后，标题前半段缺少高意图词和具体利益点。"
```

**不好的示例**：
```
"description": "标题需要修改，因为标题不够好。"
```

### 4.2 suggestedContent 类字段

- 必须是可以直接使用的内容，不是描述性说明
- 不要在建议内容中包含括号说明（如 `"[在这里填写品牌名]"`）

**好的示例**：
```
"suggestedContent": "Wireless Earbuds with Noise Cancelling, 48H Battery for Gym"
```

**不好的示例**：
```
"suggestedContent": "建议将标题改为包含噪音消除功能的描述"
```

---

## 5. 安全规则

### 5.1 不要在 block 中嵌入可执行内容

- 不要在任何字段中包含 HTML 标签
- 不要在任何字段中包含 JavaScript 代码
- 不要在任何字段中包含 Markdown 链接（`[text](url)` 格式）

### 5.2 不要在 block 中包含敏感信息

- 不要在 block 中包含用户的账号密码、API Key 等敏感信息
- 不要在 block 中包含其他用户的私人数据

---

## 6. 调试与问题排查

### 6.1 开发环境下的 FallbackRenderer

当 block 触发 FallbackRenderer 时，开发环境会显示：
- 错误原因（如 "No renderer registered for type: xxx"）
- block 的原始 JSON（可复制）

这是排查 schema 问题的主要工具。

### 6.2 常见错误及修复

| 错误现象 | 可能原因 | 修复方式 |
|---|---|---|
| FallbackRenderer 显示 "No renderer registered" | `type` 值拼写错误 | 检查 type 是否与注册表完全一致 |
| FallbackRenderer 显示 "Unsupported version" | `version` 值不正确 | 使用 `"1.0"` |
| 渲染结果为空 | `items` 数组为空 | 确保 items 至少有 1 条 |
| 部分字段不显示 | 字段名拼写错误（如 `current_content` 而非 `currentContent`） | 使用 camelCase 字段名 |

---

## 7. 版本演进策略

### 7.1 当前阶段（Phase 1）

- 所有 block 均为 `1.0` 版本
- LLM 输出时固定使用 `"version": "1.0"`
- 前端通过类型守卫 + 容错归一化处理小偏差

### 7.2 未来版本升级

当 block schema 发生 breaking change 时：
- 前端工程师会更新 `version` 到 `"2.0"`
- 同时提供 migration 函数处理旧数据
- Skill 规范文件会同步更新，说明新旧版本的差异
- LLM 应使用最新版本输出

### 7.3 向后兼容原则

- minor 版本变更（如 `1.0` → `1.1`）：新增可选字段，旧格式仍然有效
- major 版本变更（如 `1.x` → `2.0`）：有 breaking change，需要按新规范输出

---

## 8. 新增 Block type 时的 Skill 规范步骤

新增 block type 后，需要同步更新本 Skill 的规范文件，确保 LLM 能正确输出新 block：

1. 在 `schemas/<block-type>/` 下创建 `block.schema.json`（字段约束）+ `example.output.json`（完整示例）
2. 在 `references/` 下新增对应的规范 `.md` 文件（字段表 + 示例 + 禁止行为）
3. 在 `SKILL.md` 的 Block Registry 和 JiT References 表格中补充条目

> 前端组件开发流程见 `docs/Interactive Block 组件开发指南.md`，不在本 Skill 范围内。
