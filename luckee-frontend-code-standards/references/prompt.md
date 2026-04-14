# `luckee-frontend-code-standards` Prompt 使用手册

作者：**Manus AI**

## 文档目的

这份文档的目标，是把 `luckee-frontend-code-standards` 从“工程规范说明”转换成一套**可直接复制给 Claude 的工程提示词模板**。它不负责定义 Luckee 的视觉语言，而是负责保证 Claude 在当前 `luckee_frontend` 项目中写出来的代码，仍然符合现有架构、目录分层、接口接入、i18n、错误处理与共享组件约束。[1] [2]

当前项目并不是一个通用脚手架，而是一个以**聊天入口、线程上下文、流式消息、业务弹窗与认证流程**为核心的前端 SPA。因此，任何提示词如果没有显式约束 Claude，很容易出现以下偏差：新建不符合目录约定的页面、直接使用原生 `fetch`、硬编码中文、绕开共享组件、或者把小改动做成全局重构。[1] [3] [4]

> 所以，这个 skill 最适合做的事情，不是“帮你想 UI”，而是“保证 Claude 在 Luckee 代码库里写出来的是 Luckee 风格的工程代码”。

## 什么时候优先使用这个 skill

当任务涉及到**代码结构、目录约定、接口调用、路由、国际化、反馈机制、共享组件边界**时，应优先使用这个 skill。它在当前项目中的典型使用场景如下。

| 场景 | 适合程度 | 当前项目中的真实入口 | 是否建议联用其他 skill |
| --- | --- | --- | --- |
| 新增或修改页面路由 | 非常适合 | `src/pages/router.tsx`、`src/pages/*` | 如含 UI 改造，可联用 `luckee-ui-standards` |
| 新增 API 调用或修改提交逻辑 | 非常适合 | `src/request/fetchApi.ts`、`src/services/*` | 必须优先使用本 skill |
| 组件抽象与目录放置判断 | 非常适合 | `src/components/ui`、`src/components/cbm` | 如伴随样式治理，可联用 `luckee-style-governance` |
| 登录、注册、表单提交流程改造 | 非常适合 | `src/pages/Login/index.tsx`、`Register/index.tsx` | 如 UI 同步升级，可联用 `luckee-ui-standards` |
| i18n、Toast、错误处理 | 非常适合 | `src/locales`、`use-toast`、`ErrorBoundary` | 建议优先用本 skill |
| 纯视觉微调 | 不应单独使用 | 基础组件、页面 className | 先用 `luckee-ui-standards` |

## 当前项目中的工程事实

Claude 在这个仓库里最容易犯错的地方，不是不会写 React，而是不知道 Luckee 项目的**既有工程约束**。因此，写提示词时应该把以下事实显式说出来，而不是默认 Claude 会自己推断正确。

| 项目事实 | 代码依据 | 对 prompt 的直接影响 |
| --- | --- | --- |
| 项目是 Rsbuild + React SPA，不是 Next.js | `project-context.md`、`router.tsx` [1] [3] | 提示词必须禁止生成 Next.js / SSR / App Router 代码 |
| 页面路由统一定义在 `src/pages/router.tsx` | `router.tsx` [3] | 新页面必须走 `src/pages/<Name>/index.tsx` + router 注册 |
| 网络请求应复用 `fetchApi` 与 runtime service 解析 | `fetchApi.ts`、`project-context.md` [1] [4] | 提示词必须禁止直接写 raw fetch / axios |
| 用户可见反馈统一走 toast | `SKILL.md` 与项目已有页面模式 [2] [5] | 提示词应明确禁止 `alert()` |
| 文本必须走 i18n，而不是硬编码中文 | `SKILL.md`、登录页现有 `useT` 用法 [2] [5] | 提示词必须要求补充 locale key |
| 共享 primitive 与业务组件有分层 | `project-context.md`、`task-playbooks.md` [1] [6] | 提示词必须要求先判断应放在 `ui` 还是 `cbm` |

## Claude 通用前缀 Prompt

建议在所有工程类任务前，先给 Claude 固定添加下面这段前缀。它的作用是告诉 Claude：它现在是在一个**有明确架构合同的业务项目**里工作，而不是在一个空白 React 仓库里自由发挥。

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-frontend-code-standards` 执行。

执行要求：
1. 这是一个 Rsbuild + React + TypeScript SPA，不是 Next.js 项目，不要生成 Next.js、SSR、Server Actions、App Router 相关代码。
2. 先判断任务属于哪一类：页面路由、共享 UI primitive、业务组件、接口集成、状态管理、i18n、错误处理、聊天渲染。
3. 先复用最近的现有实现，再决定是否需要新增文件。
4. 所有网络请求优先复用 `fetchApi` 或现有请求体系，不要直接写 raw fetch/axios。
5. 所有用户可见文案必须走 i18n，不允许硬编码中文。
6. 所有用户反馈必须走现有 toast / 错误处理体系，不允许使用 alert。
7. 如果是共享组件，优先放在 `src/components/ui`；如果是 Luckee 业务语义组件，放在 `src/components/cbm`。
8. 以最小可交付改动为原则，不要顺手做无关重构。
9. 输出时请先说明要修改哪些文件、复用哪些现有模式，再给出代码。
```

## 推荐使用顺序

在当前项目里，使用本 skill 时最好遵循“先定类别，再找最近实现，再限制改动范围”的顺序。这样 Claude 更容易稳定输出符合项目风格的代码。

| 步骤 | Claude 应先做什么 | 为什么 |
| --- | --- | --- |
| 第 1 步 | 判断任务类型 | 避免把路由任务写成组件任务，把业务弹窗写成 primitive |
| 第 2 步 | 指认最近的参考文件 | 保证代码延续现有模式，而不是新发明一套 |
| 第 3 步 | 明确不可破坏的工程合同 | 防止绕开 `fetchApi`、toast、i18n、router 结构 |
| 第 4 步 | 只做最小必要改动 | 减少影响面，方便测试和回滚 |
| 第 5 步 | 给出验证点 | 便于您快速验收，而不是只看代码是否“像是对的” |

## Demo 1：新增一个页面，并注册到现有路由体系

当前项目的路由集中在 `src/pages/router.tsx`，页面文件采用 `src/pages/<PageName>/index.tsx` 的方式组织。因此，提示词不应该只说“帮我加一个页面”，而应该明确告诉 Claude：必须沿用现有懒加载与路由注册模式。[1] [3]

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-frontend-code-standards` 执行。

任务：新增一个页面，并接入当前路由体系。

要求：
1. 先检查 `src/pages/router.tsx` 的现有组织方式，沿用当前 lazy import 和路由注册模式。
2. 新页面必须创建在 `src/pages/<PageName>/index.tsx`。
3. 如果页面需要登录保护，必须使用现有 `AuthGuard` 模式，不要在页面内部手写重定向逻辑。
4. 不要创建平行的 router 文件，不要改成另一套路由组织方式。
5. 如果页面有用户可见文本，必须同时补齐 i18n。

输出要求：
1. 先说明为什么这些文件是正确的扩展点。
2. 说明复用了当前项目哪一个页面与路由模式。
3. 给出完整代码修改。
4. 最后给出路由验收清单。
```

## Demo 2：给现有页面新增一个接口提交逻辑

`fetchApi.ts` 已经定义了当前项目的请求封装、认证头、语言头、超时与统一错误处理方式。因此，在这个项目里，最危险的提示词之一就是“直接帮我写个请求”。正确做法是强制 Claude 沿用 `fetchApi` 合同。[1] [4]

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-frontend-code-standards` 执行。

任务：在现有页面中新增一个提交动作，并接入后端接口。

要求：
1. 必须先检查当前模块是否已经使用 `fetchApi`、`useQuery` 或 `useMutation`。
2. 不允许直接写 raw fetch，不允许绕开运行时 service 解析。
3. 需要复用当前项目已有的错误处理与 toast 反馈机制。
4. 用户可见成功与失败文案必须走 i18n。
5. 如果该提交动作属于表单页，请保持 loading、disabled、错误反馈与现有页面一致。

输出要求：
1. 先说明目标文件和扩展点。
2. 说明你复用了当前项目中的哪种 API 接入模式。
3. 给出代码修改。
4. 最后总结这次修改如何满足请求封装、反馈、i18n 三个约束。
```

## Demo 3：修改登录页，但禁止动错架构层

登录页是当前项目中很好的工程示例，因为它同时体现了 `fetchApi`、`toast`、`useT`、本地 UI primitive 和页面级状态处理。如果任务是优化登录页，Claude 很容易顺手把问题扩大为“重写登录模块”。因此，提示词需要明确限制边界。[4] [5]

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-frontend-code-standards` 执行。

任务：修改 `src/pages/Login/index.tsx`，但保持当前项目工程模式不变。

要求：
1. 保留现有 `fetchApi('login')` 调用方式。
2. 保留现有 toast 反馈链路。
3. 保留 `useT('login')` 与 `useT('common')` 的国际化模式。
4. 允许优化局部组件拆分，但不要把整个登录流程迁移到新的 store 或新的 hooks 体系，除非确有必要。
5. 如果需要新增共享 UI 能力，请优先抽到 `src/components/ui`，不要把可复用能力写死在登录页。
6. 不允许硬编码中文提示文案。

输出要求：
1. 先说明本次修改的边界。
2. 再说明复用了现有哪几个工程契约：请求、反馈、i18n、共享组件。
3. 给出代码修改。
4. 最后列出回归测试点：登录成功、登录失败、空表单、语言切换。
```

## Demo 4：抽一个共享组件，但先判断该放在 `ui` 还是 `cbm`

当前项目已经把共享 UI primitive 放在 `src/components/ui`，把业务组件放在 `src/components/cbm`。所以，提示词中最重要的一句通常不是“帮我抽组件”，而是“先判断它是 primitive 还是业务组件”。[1] [6]

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-frontend-code-standards` 执行。

任务：把当前页面中的一段重复 UI 抽成组件。

要求：
1. 先判断这段 UI 是跨页面共享 primitive，还是仅服务于 Luckee 某个业务流程的组件。
2. 如果是通用能力，放在 `src/components/ui`；如果带有明确业务语义，放在 `src/components/cbm`。
3. 不要为了抽组件而引入过度抽象。
4. 组件样式组合必须沿用 `cn()`，如需变体请使用 `cva()`。
5. 如果组件有用户文案，请继续走 i18n。

输出要求：
1. 先解释放置目录的判断依据。
2. 说明参考了当前项目中的哪个近邻实现。
3. 给出代码。
4. 最后说明这个抽取为什么不会破坏现有工程分层。
```

## Demo 5：给现有功能补错误反馈和 i18n

很多 Claude 输出的问题，并不是主功能不能跑，而是缺少 Luckee 项目要求的错误处理与国际化。因此，这类提示词应明确要求补齐 `toast`、`ApiError` 处理与 locale key，而不是停留在“加个 try/catch”。[2] [4] [5]

```md
你现在在修改 `luckee_frontend` 项目，请严格按照 `luckee-frontend-code-standards` 执行。

任务：为现有功能补齐错误处理、反馈提示与国际化。

要求：
1. 检查当前代码是否存在直接 `console.error` 但没有用户反馈的情况。
2. 统一使用当前项目的 toast 反馈方式，不允许使用 alert。
3. 如果请求层可能抛出 `ApiError`，请按现有项目习惯给出可理解的提示信息。
4. 所有新增用户可见文本必须写入 locale 文件，并在组件内通过 `useT` 调用。
5. 本轮只补齐反馈与 i18n，不做无关重构。

输出要求：
1. 先列出原有缺口：哪些地方没 toast、哪些地方硬编码文案。
2. 再给出最小改动方案。
3. 给出代码修改。
4. 最后列出验证场景：成功、接口报错、网络失败、空态提示。
```

## Demo 6：配合 UI skill 做“安全的 UI 改造”

如果您一边要改页面视觉，一边又担心 Claude 破坏工程结构，那么应同时把 `luckee-ui-standards` 和 `luckee-frontend-code-standards` 结合起来使用。此时，本 skill 负责限制工程边界，UI skill 负责限制视觉输出。

```md
你现在在修改 `luckee_frontend` 项目。

这次任务需要同时遵守两套约束：
1. `luckee-ui-standards`：负责 Luckee 视觉语言、token、圆角、阴影、字体与控件状态。
2. `luckee-frontend-code-standards`：负责目录结构、组件分层、API、i18n、toast、ErrorBoundary 与最小改动原则。

本轮任务：改造指定页面的 UI，但禁止破坏当前工程结构。

要求：
1. 先判断哪些改动应该在 token / primitive 层完成，哪些改动才需要进入页面层。
2. 保留现有接口调用、状态管理、路由结构、i18n、toast 和错误处理模式。
3. 不允许为了做 UI 改造而新引入另一套组件系统。
4. 如果发现页面存在重复结构，优先建议抽成当前项目风格的共享组件。
5. 输出时请分成两部分说明：视觉改造点、工程约束保留点。
```

## 什么时候不要单独使用这个 skill

如果任务的核心只是“把界面变成 Luckee 风格”，那么只用本 skill 会导致 Claude 在视觉层面描述不够具体。此时应优先引入 UI skill。如果任务的核心是“页面样式过乱，需要先治理内联 style 和重复弹窗”，则应先用 style governance skill 做收敛，再用本 skill 兜住工程边界。

| 任务类型 | 为什么不建议单独用本 skill | 更合适的组合 |
| --- | --- | --- |
| 1:1 还原 Luckee UI | 本 skill 只管工程边界，不提供足够的视觉细节 | `luckee-ui-standards` + 本 skill |
| 清理内联样式与组件重复 | 本 skill 不提供治理顺序 | `luckee-style-governance` + 本 skill |
| 既改视觉又改共享 primitive | 仅靠本 skill 会让视觉指令过弱 | `luckee-ui-standards` + 本 skill |

## 推荐的多 skill 组合方式

在当前 `luckee_frontend` 里，如果您希望 Claude 既不跑偏，又能有效落地，推荐采用下面的组合顺序。

| 目标 | 推荐顺序 |
| --- | --- |
| 新增功能，同时遵守 Luckee 项目工程规范 | `luckee-frontend-code-standards` |
| 改页面 UI，但不能破坏工程结构 | `luckee-ui-standards` → `luckee-frontend-code-standards` |
| 先治理散乱样式，再做视觉统一，再安全落地代码 | `luckee-style-governance` → `luckee-ui-standards` → `luckee-frontend-code-standards` |

## References

[1]: ./project-context.md "luckee-frontend-code-standards/references/project-context.md"
[2]: ../SKILL.md "luckee-frontend-code-standards/SKILL.md"
[3]: ../../../luckee_frontend/src/pages/router.tsx "luckee_frontend/src/pages/router.tsx"
[4]: ../../../luckee_frontend/src/request/fetchApi.ts "luckee_frontend/src/request/fetchApi.ts"
[5]: ../../../luckee_frontend/src/pages/Login/index.tsx "luckee_frontend/src/pages/Login/index.tsx"
[6]: ./task-playbooks.md "luckee-frontend-code-standards/references/task-playbooks.md"
