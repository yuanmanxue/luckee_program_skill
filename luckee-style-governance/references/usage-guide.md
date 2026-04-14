# luckee-style-governance 使用说明与 Prompt Demo

## 文档目的

这份文档不是重复定义设计规范，而是解释 **`luckee-style-governance` 到底怎么用、应该在什么场景下用，以及如何把它转成可以直接发给 Claude 的 prompt**。它面向的真实上下文是当前的 `motse-ai/luckee_frontend` 项目，因此所有示例都尽量落到当前仓库已经存在的目录、组件和治理问题上。[1] [2] [3]

## 先说结论：这个 skill 不是“帮你改一个页面”，而是“帮你控制改 UI 的顺序”

`luckee-style-governance` 的本质是一个 **流程治理 skill**。它并不直接代替 `luckee-ui-standards` 的视觉规范，也不代替 `luckee-frontend-code-standards` 的工程规范；它的职责是把这两者串起来，规定在 `luckee_frontend` 里做 UI 整理时，必须按 **审计 → token → 基础组件 → 弹窗 → 内联样式 → 公共业务组件 → 页面收口** 这个顺序推进，否则很容易出现“页面短期变像了，但代码长期更乱”的情况。[1] [2] [4]

> 可以把它理解成一个“UI 改造项目经理”。
>
> `luckee-ui-standards` 负责告诉你“最终应该长什么样”，`luckee-frontend-code-standards` 负责告诉你“不能破坏什么工程边界”，而 `luckee-style-governance` 负责告诉你“应该先做什么、后做什么，以及每次只允许改多大一块”。[1] [2] [4]

## 这个 skill 的典型使用场景

下面这张表，可以帮助您快速判断什么时候该启用这个 skill，什么时候其实没必要上它。

| 场景 | 是否建议使用 | 原因 |
| --- | --- | --- |
| 项目里有大量 `style={{ ... }}`，而且很多是颜色、圆角、间距、阴影这类视觉样式 | **建议使用** | 这是典型的样式治理问题，适合先审计再清理。[1] [5] |
| 同一个系统里出现很多种弹窗壳子、标题区、底部操作区样式 | **建议使用** | 这说明“行为基座可能统一了，但视觉基座还没统一”，应优先治理弹窗体系。[1] [6] |
| 业务组件经常绕过 `src/components/ui` 自己拼视觉代码 | **建议使用** | 这种情况如果直接改页面，会继续复制风格碎片。[1] [2] |
| 需要把 `luckee_frontend` 页面逐步对齐到 `luckee-ui` 风格 | **建议使用** | 页面 1:1 收口之前，必须先把底层主题和基础组件稳定下来。[1] [4] |
| 只是改一个按钮文案、一个图标、一个小间距 | **通常不需要** | 这是局部修补，不属于系统性治理问题。[1] |
| 需要新增一个完整业务功能，UI 只是附带部分 | **按情况使用** | 如果问题核心是业务逻辑，就以工程 skill 为主；若 UI 复杂且风格风险高，再叠加这个 skill。[2] |

## 在实际协作里，这个 skill 应该怎么用

### 用法一：在 Manus 或同类支持 skill 的环境里使用

如果当前执行环境支持显式调用 skill，那么您应把 `luckee-style-governance` 作为 **流程约束层** 使用，而不是把它当成独立的视觉规范来源。标准组合方式如下表所示。[1] [2] [4]

| 层级 | 应该加载的 skill | 作用 |
| --- | --- | --- |
| 视觉层 | `luckee-ui-standards` | 提供字体、颜色、圆角、阴影、按钮、输入框、反馈组件等视觉标准。[4] |
| 工程层 | `luckee-frontend-code-standards` | 保护现有 SPA 架构、路由、状态、请求、i18n、组件分层等工程边界。[2] |
| 流程层 | `luckee-style-governance` | 规定执行顺序、范围控制、内联样式治理策略、页面收口时机。[1] |

### 用法二：在 Claude 里使用

Claude 本身不会“自动理解”您仓库里的 skill 文件，因此在 Claude 场景里，**正确做法不是只说一句“请按 luckee-style-governance 改”**，而是把这个 skill 的核心约束转成 prompt 前缀，显式告诉 Claude 本轮任务要遵守哪三套规则，以及本轮只允许改哪一小块。[1] [3]

换句话说，这个 skill 在 Claude 里的落地方式，是：

1. 先贴一个总控前缀，声明三层约束。
2. 再贴一个非常具体的“本轮任务 prompt”。
3. 每一轮只做一个可测试、可回滚的小切片。
4. 测试后再进入下一轮。

## 面向当前 `luckee_frontend` 的推荐使用顺序

`luckee_frontend` 是一个 **Rsbuild + React + TypeScript 的 SPA**，核心是聊天入口、聊天页面、弹窗体系、侧栏和 agent 结果渲染。[2] 它已经有一定的基础组件层，例如 `src/components/ui`，但同时也存在明显的治理热点，例如：

| 位置 | 当前问题类型 | 为什么适合纳入治理 |
| --- | --- | --- |
| `src/style/tailwind.css` | token 和全局视觉基座仍需统一 | 主题层一旦统一，后续组件改造成本会明显下降。[7] |
| `src/components/ui/dialog.tsx` | 行为基座存在，但视觉基座仍可继续统一 | 适合先做弹窗基座，再改业务弹窗消费者。[6] |
| `src/components/base/ErrorBoundary/index.tsx` | 典型视觉性内联样式与硬编码颜色 | 是“内联样式治理”的最佳示范文件之一。[5] |
| `src/components/cbm/DataSourceDialog/index.tsx` | 业务弹窗视觉组合较重 | 适合做“弹窗消费层标准化”的示范样本。[8] |
| `src/components/cbm/ChatArea/index.tsx` | 首页高频业务入口，承载多个弹窗入口与输入区 | 适合在基础层稳定后做公共业务组件收口。[9] |
| `src/components/chat-render/CardPanel/index.tsx` | 既有可治理的硬编码色，也有合理保留的动态 style | 适合解释“不是所有 inline style 都该删”。[10] |

## 最推荐的 Claude 使用姿势

### 第一步：先发总控前缀

这段前缀建议您在几乎每一轮 Claude 对话里都带上。它的作用是把 Claude 锁进正确的工程边界和执行顺序里。

```text
你现在在 `motse-ai/luckee_frontend` 仓库中工作。

本轮修改必须同时遵守以下三套规则：
1. `luckee-ui-standards`：负责 Luckee 官方视觉语言，包括字体、颜色、圆角、阴影、按钮、输入框、弹窗和反馈风格。
2. `luckee-frontend-code-standards`：负责当前前端仓库的工程约束，必须保留 Rsbuild + React + TypeScript SPA、React Router、Zustand、React Query、i18n、toast、ErrorBoundary、请求层和现有组件分层。
3. `luckee-style-governance`：负责 UI 改造顺序与样式治理边界，必须按“审计 → token / 全局主题 → 基础组件 → 弹窗体系 → 内联样式清理 → 公共业务组件 → 页面级收口”的顺序执行。

本轮工作规则如下：
1. 不允许顺手修改业务逻辑、接口逻辑、状态逻辑、thread 流程、上传逻辑。
2. 不允许引入并行 UI 体系，不允许绕过现有 `src/components/ui` 继续扩散视觉碎片。
3. 样式优先使用语义 token、Tailwind 类、`cn()` 与 `cva()`。
4. 视觉性内联样式应优先清理；仅当样式值来自运行时动态计算时，才允许保留 inline style。
5. 如果任务范围过大，你必须先缩小范围，再给代码。
6. 每次回答必须按以下结构输出：
   - 本步目标
   - 目标文件
   - 为什么这些文件是正确入口
   - 改动摘要表（文件 / 改动类型 / 是否影响逻辑 / 风险 / 回滚方式）
   - 代码修改
   - 验证方法
   - 风险与下一步

先不要大改，等我给你本轮具体任务。
```

## 六个最实用的 Prompt Demo

下面的 demo 都是按照当前 `luckee_frontend` 的结构和问题热点设计的，您可以直接复制给 Claude 用。

### Demo 1：先做样式审计，而不是直接改页面

这个 demo 适合您第一次把 skill 用起来的时候。它的目标不是立刻写代码，而是让 Claude 先画出问题地图。

```text
现在开始执行第 1 步：样式治理审计。

任务目标：
请基于 `luckee_frontend` 当前代码，先做审计，不要直接大面积改代码。重点分析以下问题：
1. 哪些文件存在视觉性内联样式。
2. 哪些组件绕过 `src/components/ui` 自己拼了很多视觉代码。
3. 当前弹窗体系里，哪些业务弹窗虽然复用了 `Dialog` 行为层，但视觉层并不统一。
4. 哪些文件属于 P0，必须先治理，否则后面的 1:1 UI 对齐会持续返工。

请重点查看但不限于这些位置：
- `src/style/tailwind.css`
- `src/components/ui/dialog.tsx`
- `src/components/base/ErrorBoundary/index.tsx`
- `src/components/cbm/DataSourceDialog/index.tsx`
- `src/components/cbm/ChatArea/index.tsx`
- `src/components/chat-render/CardPanel/index.tsx`

输出要求：
1. 先输出一张总表，字段为：问题类型 / 代表文件 / 影响范围 / 优先级 / 建议治理方式。
2. 再输出推荐治理顺序。
3. 除非你认为必须做一个极小的辅助修改，否则先不要改业务代码。
```

### Demo 2：先锁死 token 和全局基础样式

这个 demo 适合在审计完成后，进入底层主题统一阶段。目标是先改地基，不碰业务结构。

```text
现在执行第 2 步：统一底层 token 与全局基础样式。

任务目标：
让 `luckee_frontend` 的底层视觉语言先统一到 Luckee 官方风格，包括主色、背景色、文本色、圆角、阴影、边框、focus ring 和字体。

约束要求：
1. 优先基于 `luckee-ui-standards` 的 token 体系落地，不要把颜色硬编码回组件。
2. 保留当前项目的语义 token 结构。
3. 本轮只允许修改这些类型的文件：主题文件、样式入口文件、字体接入文件。
4. 不要改页面结构，不要改业务组件布局。
5. 如果当前仓库存在自定义 theme attribute，请保留现有机制，不要直接重做 dark mode 体系。

建议优先检查：
- `src/style/tailwind.css`
- `src/main.tsx`
- `index.html`

请先列出本轮要修改的文件，再给出代码。
```

### Demo 3：清理 `ErrorBoundary` 的视觉性内联样式，但不碰错误处理逻辑

`src/components/base/ErrorBoundary/index.tsx` 是一个非常适合做样板的文件。它里边有明显的视觉性内联样式和硬编码颜色，但逻辑层又很关键，因此很适合演示“**只改表达层，不动行为层**”这种 skill 用法。[5]

```text
现在执行一个很小的样式治理切片：清理 `src/components/base/ErrorBoundary/index.tsx` 中的视觉性内联样式。

任务目标：
在不改变 ErrorBoundary 行为逻辑的前提下，把该文件中的视觉性内联样式和硬编码颜色，尽量迁移到语义 token、Tailwind 类和现有基础按钮风格中。

明确约束：
1. 不允许修改 `handleChunkError`、`isChunkLoadError`、`resetErrorBoundary` 的逻辑。
2. 不允许改变文案逻辑和 i18n 调用方式。
3. 允许保留真正必要的结构性 props，但视觉相关的 `style={{ ... }}` 要优先迁移。
4. 如果需要复用现有 `Button` 组件，请说明为什么这是正确扩展点。
5. 输出时必须说明：哪些 inline style 被移除，哪些必须保留，如果保留必须解释理由。

请只处理这个文件，不要顺手改别的模块。
```

### Demo 4：先统一 `Dialog` 基座，再改一个代表性业务弹窗

这个 demo 适合在基础 token 已经稳定后，开始统一弹窗体系。`DataSourceDialog` 是一个很好的代表样本，因为它已经用了共享 `Dialog`，但本地视觉组合仍然很重。[6] [8]

```text
现在执行“弹窗体系统一”的最小切片。

任务目标：
先统一共享弹窗基座，再用一个代表性业务弹窗做示范性收口。本轮只允许处理：
- `src/components/ui/dialog.tsx`
- `src/components/cbm/DataSourceDialog/index.tsx`

约束要求：
1. 不修改打开关闭逻辑，不修改 API 调用，不修改表单提交流程。
2. 先统一 dialog 的 overlay、surface、标题区、描述区、关闭按钮和 footer 行为层的视觉表达。
3. 然后让 `DataSourceDialog` 尽量复用新的共享壳层，不要继续保留过多本地“自定义弹窗外观”。
4. 不要一次性改所有业务弹窗，只做这一组示范。
5. 如果你发现应该新增一个非常轻量的共享子结构，例如 `DialogSection` 或 `DialogSurfaceBody`，可以提议，但必须证明它能减少重复。

请先给出你建议的最小改造方案，再给代码。
```

### Demo 5：解释“不是所有 inline style 都该删”，并处理 `CardPanel`

这个 demo 非常重要，因为它能防止 Claude 进入“看到 style 就全删”的错误模式。`CardPanel` 里同时存在两类情况：一类是值得治理的硬编码绿色表达，另一类是进度条宽度这种合理的动态内联样式。[10]

```text
现在执行一个“带判断标准的 inline style 治理”任务。

任务目标：
请处理 `src/components/chat-render/CardPanel/index.tsx`，但不要机械式删除所有 inline style。

具体要求：
1. 先把该文件中的样式问题分成两类：
   - 应该清理的视觉性样式
   - 应该保留的动态运行时样式
2. 对于硬编码成功色、硬编码 fill 颜色，请优先迁移到语义 token 或更一致的共享表达。
3. 对于进度条宽度这类由运行时百分比决定的样式，如果应该保留，请明确说明理由。
4. 不修改组件对外 props，不改变进度逻辑，不改变交互行为。
5. 输出时必须包含一张判断表：occurrence / classification / action / reason。

请只处理这个文件。
```

### Demo 6：在地基稳定后，再统一 `ChatArea` 这类高频业务公共组件

`ChatArea` 是首页非常核心的业务入口，既包含输入区，也连接多个业务弹窗入口，还涉及上传和 thread 跳转逻辑，因此非常适合演示“只改 UI 表达层，不改业务流程”的 prompt 写法。[2] [9]

```text
现在执行“高频业务公共组件收口”的一个小切片。

任务目标：
请仅从 UI 表达层出发，优化 `src/components/cbm/ChatArea/index.tsx` 的视觉一致性，让它更接近 Luckee 的首页气质，但不要改业务流程。

明确禁止：
1. 不改 `thread_id` 生成逻辑。
2. 不改 `localforage` 持久化逻辑。
3. 不改上传黑名单、大小限制、导航跳转、登录检查、邀请码弹窗触发逻辑。
4. 不改 quick actions 的业务含义。

本轮只允许做这些方向：
1. 统一输入区外壳、按钮、附件预览条、空态层级、欢迎标题和快速操作入口的视觉语言。
2. 优先复用已经稳定的 `Button`、`Dialog`、共享 token 和轻量公共视觉片段。
3. 如果发现某些 class 组合会在其他首页组件中重复，请提出一个最小抽象，但不要过度设计。

输出时请说明：
- 哪些部分只是视觉表达层调整
- 哪些潜在问题暂时不该在这一轮处理
```

## 一个完整的推荐对话链路

如果您接下来准备真的把 Claude 用起来，我建议按下面这个顺序走，而不是一上来就发“请把首页改成和 luckee-ui 一模一样”。

| 轮次 | 您发给 Claude 的内容 | 目标 |
| --- | --- | --- |
| 第 1 轮 | 总控前缀 + Demo 1 | 先拿到审计清单和 P0/P1/P2 优先级 |
| 第 2 轮 | 总控前缀 + Demo 2 | 先把 token 与全局主题统一 |
| 第 3 轮 | 总控前缀 + Demo 4 | 先统一 `Dialog` 基座与 1 个代表性业务弹窗 |
| 第 4 轮 | 总控前缀 + Demo 3 或 Demo 5 | 按文件逐个清理视觉性 inline style |
| 第 5 轮 | 总控前缀 + Demo 6 | 开始收口高频公共业务组件 |
| 第 6 轮 | 总控前缀 + 页面级 prompt | 最后才做页面 1:1 收口 |

这个顺序之所以重要，是因为 `luckee-style-governance` 的核心价值，不在于单次 prompt 的文字，而在于它强迫改造过程 **先收地基，再收中层，再收页面**。这也是它和普通“帮我改 UI”提示词最大的区别。[1] [3]

## 如何判断 Claude 这轮有没有按 skill 在工作

您不需要每次都自己读完所有 diff，但可以用下面这张表快速判断 Claude 是不是在“按 skill 做事”，还是又开始失控地大改代码。

| 观察信号 | 说明 | 判断 |
| --- | --- | --- |
| 一开始先列目标文件和原因 | 说明它在受范围控制 | 好现象 |
| 会区分视觉层与逻辑层 | 说明它理解“只改表达层” | 好现象 |
| 会先提议缩小范围，而不是一次改十几个文件 | 说明它遵守了小步治理 | 好现象 |
| 一上来就重写页面或新建一套组件体系 | 说明它绕过了治理顺序 | 坏现象 |
| 看到 inline style 就全部删掉 | 说明它没有理解内联样式策略 | 坏现象 |
| 改 UI 顺手动了 API、store、thread、upload | 说明它越过了工程边界 | 坏现象 |

## 如果您想让我继续协作，最好的回传格式

后续您每做完一轮 Claude 改造，都可以按下面格式把结果发给我。我可以继续根据 diff 和现象，帮您压缩成下一轮更安全的 prompt。

```text
第 N 轮已执行。
本轮目标：……
Claude 修改文件：……
编译结果：……
页面结果：……
仍然不统一的点：……
疑似越权修改的点：……
请继续帮我生成下一轮 prompt。
```

## References

[1]: https://github.com/yuanmanxue/luckee_program_skill/blob/main/luckee-style-governance/SKILL.md "luckee-style-governance/SKILL.md"
[2]: https://github.com/yuanmanxue/luckee_program_skill/blob/main/luckee-frontend-code-standards/references/project-context.md "luckee-frontend-code-standards/references/project-context.md"
[3]: https://github.com/yuanmanxue/luckee_program_skill/blob/main/luckee-style-governance/references/prompt-templates.md "luckee-style-governance/references/prompt-templates.md"
[4]: https://github.com/yuanmanxue/luckee_program_skill/blob/main/luckee-ui-standards/SKILL.md "luckee-ui-standards/SKILL.md"
[5]: https://github.com/motse-ai/luckee_frontend/blob/main/src/components/base/ErrorBoundary/index.tsx "luckee_frontend/src/components/base/ErrorBoundary/index.tsx"
[6]: https://github.com/motse-ai/luckee_frontend/blob/main/src/components/ui/dialog.tsx "luckee_frontend/src/components/ui/dialog.tsx"
[7]: https://github.com/motse-ai/luckee_frontend/blob/main/src/style/tailwind.css "luckee_frontend/src/style/tailwind.css"
[8]: https://github.com/motse-ai/luckee_frontend/blob/main/src/components/cbm/DataSourceDialog/index.tsx "luckee_frontend/src/components/cbm/DataSourceDialog/index.tsx"
[9]: https://github.com/motse-ai/luckee_frontend/blob/main/src/components/cbm/ChatArea/index.tsx "luckee_frontend/src/components/cbm/ChatArea/index.tsx"
[10]: https://github.com/motse-ai/luckee_frontend/blob/main/src/components/chat-render/CardPanel/index.tsx "luckee_frontend/src/components/chat-render/CardPanel/index.tsx"
