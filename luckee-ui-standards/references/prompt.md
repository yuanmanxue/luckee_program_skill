# `luckee-ui-standards` Prompt 使用手册

作者：**Manus AI**

## 文档目的

这份文档不是再次解释设计规范本身，而是把 `luckee-ui-standards` 转换成一套**可以直接复制给 Claude 的工程执行提示词**。它适用于当前 `luckee_frontend` 项目的真实代码环境：项目通过 `src/main.tsx` 引入 `src/style/tailwind.css`，按钮等基础组件已经接入语义化 Tailwind token，但仍存在部分页面样式写散、局部硬编码颜色、以及页面级视觉不完全统一的问题。[1] [2] [3]

> 这意味着，`luckee-ui-standards` 在当前项目里最适合做的事情，并不是“整站重写”，而是先改主题 token，再改基础组件，再改典型页面与浮层，从而以最小代价把视觉风格逐步收敛到 `luckee-ui`。

## 什么时候用这个 skill

当您的任务核心是**让界面更像 `luckee-ui`**，而不是新增复杂业务逻辑时，应优先使用这个 skill。当前项目中最典型的使用场景，可以归纳为下表。

| 场景 | 适合程度 | 在 `luckee_frontend` 中的典型入口 | 推荐搭配 |
| --- | --- | --- | --- |
| 替换全局主题变量 | 非常适合 | `src/style/tailwind.css`、`src/main.tsx` | 可与 `luckee-frontend-code-standards` 联用 |
| 改按钮、输入框、卡片等基础视觉 | 非常适合 | `src/components/ui/button.tsx`、`input.tsx`、`card.tsx` | 可与 `luckee-frontend-code-standards` 联用 |
| 统一登录页、注册页、首页输入区的页面风格 | 适合 | `src/pages/Login/index.tsx`、`src/pages/Register/index.tsx`、`src/components/cbm/ChatArea/index.tsx` | 建议同时参考 `luckee-style-governance` |
| 统一弹窗、Toast、空状态、反馈组件 | 非常适合 | `src/components/ui/dialog.tsx`、`src/components/cbm/*Dialog*`、`src/hooks/use-toast.ts` | 建议同时参考 `luckee-style-governance` |
| 新增接口、新增状态管理、改聊天链路 | 不应单独使用 | `src/request`、`src/stores`、`src/pages/Chat` | 必须联用 `luckee-frontend-code-standards` |

## 在当前项目中的关键理解

`luckee-ui-standards` 的最大价值，在于它与当前项目并不是完全脱节的。相反，它已经假设 `luckee_frontend` 采用了**语义 token + Tailwind v4 + 本地 UI primitive** 的架构，因此大量视觉变化其实可以通过修改 token 与基础组件完成，而不必重写业务层。[1] [4]

当前项目中，最值得优先利用的事实如下。

| 项目事实 | 说明 | 对提示词写法的影响 |
| --- | --- | --- |
| `src/main.tsx` 当前仍直接引入 `./style/tailwind.css` | 这是主题入口 | 提示词应优先要求 Claude 从主题入口改起，而不是先改页面细节 [2] |
| `Button` 已通过 `cva()` 管理变体 | 适合直接做视觉升级 | 提示词应强调“保留变体结构，只改 Luckee 风格” [3] |
| 登录页已经使用 `Button`、`Input`、`Card`、`Tabs` 组合页面 | 这是验证 UI 改造效果的优先页面 | 提示词可以把登录页当作首个页面级验收样本 [5] |
| Skill 已明确指出 token 层是最低成本改造位点 | 先动 token，收益最大 | 提示词必须要求先改 root token，再改 primitive [1] |
| 按钮与输入框的 Luckee 规范已经给出精确尺寸、圆角、阴影与状态矩阵 | 可以直接变成可执行改造要求 | 提示词不应只说“更像设计稿”，而要明确尺寸、圆角、hover、focus 等要求 [4] [6] |

## 推荐的提示词使用顺序

对于当前 `luckee_frontend`，推荐按**四轮**来使用这个 skill，而不要一次性要求 Claude “把整个项目改成 Luckee UI”。一次性全量改造通常会导致页面级 hardcode、基础组件、业务组件和视觉规范混杂在一起，结果是改动大、回滚困难、验收也困难。

| 轮次 | 目标 | 关注文件 | 预期结果 |
| --- | --- | --- | --- |
| 第 1 轮 | 替换主题 token 与字体 | `src/style/tailwind.css`、`src/main.tsx`、`index.html` | 大部分语义类自动切换成 Luckee 风格 |
| 第 2 轮 | 升级基础组件视觉 | `src/components/ui/button.tsx`、`input.tsx`、`card.tsx`、`tabs.tsx` | 基础控件统一成 Luckee 语言 |
| 第 3 轮 | 统一浮层与反馈组件 | `src/components/ui/dialog.tsx`、相关业务 Dialog、Toast UI | 弹窗、Toast、反馈风格统一 |
| 第 4 轮 | 精修典型页面 | 登录页、注册页、首页聊天入口 | 页面级达到接近 `luckee-ui` 的 1:1 质感 |

## Claude 通用前缀 Prompt

在每一轮正式提示词之前，建议先给 Claude 固定加上下面这段前缀。它的作用是让 Claude 明确知道：这不是一次自由发挥的视觉美化，而是一次**受 skill 约束的、最小改动优先的 Luckee UI 对齐任务**。

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-ui-standards` 执行 UI 改造。

执行要求：
1. 目标不是自由发挥，而是让当前项目尽量 1:1 靠近 `luckee-ui` 的视觉语言。
2. 优先复用现有语义 token、现有基础组件、现有 Tailwind class 体系，不要重建另一套样式系统。
3. 优先做“最小但完整”的改动，避免顺手重构业务逻辑。
4. 如果改造目标涉及页面，请先判断是否能通过 token 或 primitive 完成；只有 primitive 不足时才进入业务组件。
5. 所有颜色、圆角、阴影、字体、间距优先使用 skill 中已有定义，不要自行发明新值。
6. 输出时先说明你要改哪些文件、为什么改这些文件，再给出代码修改结果。
7. 如果发现当前页面含有硬编码颜色、局部 style、重复弹窗样式，请优先收敛到现有 primitive，而不是继续复制样式。
8. 不要改接口逻辑、store 逻辑、路由逻辑，除非任务明确要求。
```

## Demo 1：先替换全局主题，不碰业务逻辑

这是最适合当前项目的第一轮提示词，因为 `src/main.tsx` 已经把主题入口收敛到 `src/style/tailwind.css`，而 skill 也明确指出：大量组件已经使用语义化 class，因此先换 token 的收益最大。[1] [2]

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-ui-standards` 执行 UI 改造。

本轮只做全局主题接管，不改业务组件结构。

任务目标：
1. 以 `luckee-ui-standards/references/tailwind-luckee.css` 与 token mapping 为标准。
2. 修改 `src/style/tailwind.css`，把当前主题 token 替换为 Luckee 风格 token。
3. 如有必要，修改 `src/main.tsx` 与字体引入位置，确保页面真正加载 Instrument Serif 和 Montserrat。
4. 不要修改业务页面 JSX，不要修改接口逻辑。

具体要求：
1. 背景色、前景色、primary、secondary、accent、muted、destructive、border、ring 都要对齐 Luckee token。
2. 更新 radius 相关 token，让输入框、卡片、浮层的圆角符合 Luckee 标准。
3. 保持现有 Tailwind v4 语义 token 结构，不要新造另一套命名。
4. 修改完成后，请列出这次改动会影响哪些现有组件，例如 Button、Input、Card、Tabs。
5. 最后给出一个人工验证清单，重点验证登录页、注册页、首页背景、按钮和输入框。
```

## Demo 2：只升级 Button primitive，不扩散到业务层

当前 `src/components/ui/button.tsx` 已经是标准 primitive，且使用 `cva()` 管理变体；这意味着它非常适合被单点升级到 Luckee 按钮规范，例如 `rounded-full`、品牌阴影、不同 variant 的视觉语义。[3] [6]

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-ui-standards` 执行 UI 改造。

本轮只升级按钮 primitive，不要顺手修改页面业务逻辑。

目标文件：
- `src/components/ui/button.tsx`

改造目标：
1. 保留现有 `cva()` 结构、variant 命名和 size 命名。
2. 把按钮默认圆角从 `rounded-[var(--radius)]` 调整为 Luckee 风格的 `rounded-full`。
3. 让 default / secondary / ghost / destructive 四类按钮更接近 skill 中定义的视觉规范。
4. 补齐 hover / active / disabled 状态，让阴影、位移、缩放更符合 Luckee 风格。
5. 不要引入新依赖，不要破坏现有按钮 API。

输出要求：
1. 先说明为什么 `button.tsx` 是正确的改造入口。
2. 说明你保留了哪些现有工程约束，例如 `cva()`、variant API、Tailwind 语义 token。
3. 给出修改后的完整代码。
4. 最后补充这次改造会如何影响登录页、注册页、弹窗 footer 按钮与首页 CTA。
```

## Demo 3：用登录页验证 Luckee 页面质感

登录页是当前项目中最适合做页面级 UI 验证的样本，因为它同时包含背景装饰、卡片、标题、输入框、按钮、Tabs 和页脚链接，是一个比较完整的视觉切片。[5]

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-ui-standards` 执行 UI 改造。

本轮只精修登录页，让它更接近 `luckee-ui` 的气质，但不修改登录接口逻辑。

目标文件：
- `src/pages/Login/index.tsx`
- 如确有必要，可补充修改 `src/components/ui/card.tsx`、`input.tsx`、`tabs.tsx`

改造要求：
1. 保留现有登录流程、`fetchApi('login')`、toast、i18n、主题切换、语言切换逻辑。
2. 重点优化视觉层：标题排版、说明文字、卡片 surface、顶部操作按钮、输入框节奏、CTA 层次、页脚链接样式。
3. 页面风格必须贴合 Luckee：低饱和、柔和、专业、自然，不要做成科技蓝、玻璃紫、霓虹风。
4. 允许删掉与 Luckee 风格冲突的局部 class，例如过重的阴影、过硬的描边、与品牌不符的背景色。
5. 如果某些 style 应该下沉到 primitive，请同时指出，但本轮只做最小必要抽取。

输出要求：
1. 先说明这次是“页面验证轮”，不是全站重构。
2. 说明哪些样式应该保留在页面层，哪些应该回收到 primitive。
3. 给出完整修改代码。
4. 最后附一个验收表，包含：背景、标题字体、输入框状态、CTA、顶部按钮、页脚链接。
```

## Demo 4：统一 Dialog 风格，解决“同类弹窗很多种样式”问题

如果您当前项目里存在多个业务弹窗样式各写各的，那么 `luckee-ui-standards` 最适合负责的是**浮层视觉统一**，而不是弹窗业务逻辑统一。也就是说，应先以 `dialog` primitive 和反馈规范统一 overlay、surface、title、description、footer，再逐步替换业务层局部 class。[1] [7]

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-ui-standards` 执行 UI 改造。

任务背景：当前项目中弹窗风格不统一。请先以共享 dialog primitive 为基座，统一 Luckee 风格的弹窗视觉语言。

目标：
1. 先检查 `src/components/ui/dialog.tsx` 是否足以作为统一弹窗基座。
2. 如果基础 dialog 能承载，就优先升级它的 overlay、content、header、title、description、footer 样式。
3. 再选择 1 个业务弹窗作为验证样本，例如 `CapabilitiesDialog`，把局部硬编码样式收敛到统一 primitive。
4. 不要在业务层再复制一套新的 modal 样式系统。

具体要求：
1. 弹窗必须符合 Luckee 的圆角、阴影、背景、边框与排版风格。
2. CTA 与 secondary action 必须使用统一 Button primitive。
3. 标题、描述、关闭按钮、分割节奏要保持一致。
4. 如发现颜色硬编码，请优先改成语义 token。
5. 本轮不改弹窗业务数据流，只改视觉结构与样式复用。

输出要求：
1. 先说明共享 primitive 和业务弹窗各自承担什么职责。
2. 列出要修改的文件及原因。
3. 给出代码修改。
4. 最后说明后续哪些弹窗可以用同样方式继续收敛。
```

## Demo 5：清理硬编码颜色，但禁止“全项目机械替换”

`luckee-ui-standards` 已经指出当前项目存在硬编码颜色热点文件。对于这类任务，正确提示词不是要求 Claude 机械搜索替换所有 hex，而是要求它**逐个判断是否存在可映射的语义 token**，并优先收敛到现有 token 系统。[1]

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-ui-standards` 执行 UI 改造。

本轮只处理硬编码颜色与少量视觉硬编码，不做全项目无差别搜索替换。

任务要求：
1. 先审查当前文件中的硬编码颜色，判断它们分别属于 brand、muted、accent、success、warning、destructive 还是历史遗留视觉值。
2. 如果已有对应语义 token，就替换为语义 token class。
3. 如果没有对应 token，但确实是 Luckee 需要保留的稳定品牌色，再提出最小增量 token 方案。
4. 不要为了清理硬编码而把所有 class 打散重写。
5. 不要改动业务逻辑。

输出要求：
1. 先列出每个硬编码颜色的去向判断。
2. 再给出代码修改。
3. 最后总结哪些值已经进入 token，哪些值仍需后续设计确认。
```

## 什么时候不要单独用这个 skill

如果任务已经超出“视觉语言对齐”的范围，只用 `luckee-ui-standards` 就不够了。典型情况如下。

| 任务类型 | 为什么不能只用这个 skill | 正确做法 |
| --- | --- | --- |
| 新增接口请求 | 这涉及 `fetchApi`、运行时域名、错误处理 | 联用 `luckee-frontend-code-standards` |
| 改登录/注册成功后的跳转与权限逻辑 | 这属于业务逻辑与状态管理 | 先用 `luckee-frontend-code-standards` 约束实现 |
| 页面里既有内联样式，又有多个重复弹窗版本 | 单独做 UI 对齐容易越改越乱 | 先跑 `luckee-style-governance`，再做 UI 精修 |
| 聊天流、WebSocket、thread 持久化改造 | 这不是纯样式问题 | 只把 `luckee-ui-standards` 用于最终呈现层 |

## 推荐的多 skill 组合方式

在当前 `luckee_frontend` 中，三类 skill 最适合形成固定顺序。先用治理 skill 收敛 style 结构，再用 UI 标准 skill 对齐视觉语言，最后用前端代码规范 skill 约束实现边界，这样 Claude 最不容易跑偏。

| 目标 | 推荐组合 |
| --- | --- |
| 页面样式很乱，内联很多 | `luckee-style-governance` → `luckee-ui-standards` |
| 需要既改视觉又改共享 primitive | `luckee-ui-standards` + `luckee-frontend-code-standards` |
| 需要做 1:1 UI 还原，同时不破坏项目结构 | `luckee-style-governance` → `luckee-ui-standards` → `luckee-frontend-code-standards` |

## References

[1]: ../SKILL.md "luckee-ui-standards/SKILL.md"
[2]: ../../../luckee_frontend/src/main.tsx "luckee_frontend/src/main.tsx"
[3]: ../../../luckee_frontend/src/components/ui/button.tsx "luckee_frontend/src/components/ui/button.tsx"
[4]: ./token-mapping-strategy.md "luckee-ui-standards/references/token-mapping-strategy.md"
[5]: ../../../luckee_frontend/src/pages/Login/index.tsx "luckee_frontend/src/pages/Login/index.tsx"
[6]: ./components-form-and-button.md "luckee-ui-standards/references/components-form-and-button.md"
[7]: ./components-feedback.md "luckee-ui-standards/references/components-feedback.md"
