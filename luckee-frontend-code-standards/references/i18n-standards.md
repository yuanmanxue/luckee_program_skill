# Internationalization (i18n) Standards

Luckee 采用了一套自定义的轻量级国际化方案，完全基于 React Hooks 和 Zustand store（`src/stores/global.ts` 中的 `zh` 状态）。所有用户可见的文本**必须**通过这套机制进行翻译，**严禁在代码中硬编码中文字符串**。

## 1. 核心架构与目录结构

语言文件统一存放在 `src/locales/` 目录下，按语言（`zh`/`en`）和命名空间（如 `common`, `chat`, `login` 等）组织。

```
src/locales/
├── index.ts        // 核心导出文件（useT, t 函数）
├── zh/
│   ├── common.ts   // 通用词条
│   ├── chat.ts     // 聊天相关
│   └── ...
└── en/
    ├── common.ts
    ├── chat.ts
    └── ...
```

### 1.1 命名空间 (Namespace)
项目中预定义了多个命名空间。如果需要新增模块，建议优先复用现有的命名空间（如 `common`, `uiComponents`）。如果模块非常大且独立，才考虑在 `src/locales/index.ts` 中注册新的命名空间。

## 2. 词条定义与使用规范

### 2.1 新增词条
在对应的语言文件中（必须同时修改 `zh` 和 `en` 目录下的同名文件）添加词条。词条支持插值（使用 `{{key}}` 语法）。

```typescript
// src/locales/zh/common.ts
export default {
  // 基础词条
  confirm: '确定',
  // 带参数的词条
  greeting: '你好，{{name}}！',
} as const;

// src/locales/en/common.ts
export default {
  confirm: 'Confirm',
  greeting: 'Hello, {{name}}!',
} as const;
```
> **注意**：必须使用 `as const` 导出，以保证 TypeScript 能正确推导词条类型。

### 2.2 在 React 组件中使用 `useT` (推荐)
在组件内部，**必须**使用 `useT` hook 获取翻译函数。它会自动监听语言切换并触发组件重渲染。

```tsx
import React from 'react';
import { useT } from '@/locales';
import { Button } from '@/components/ui/button';

export const WelcomePanel: React.FC<{ userName: string }> = ({ userName }) => {
  // 传入命名空间，如 'common', 'chat'
  const tCommon = useT('common');
  const tChat = useT('chat');

  return (
    <div>
      {/* 基础使用 */}
      <h1>{tChat('welcomeQuestion')}</h1>
      
      {/* 带参数使用 */}
      <p>{tCommon('greeting', { name: userName })}</p>
      
      <Button>{tCommon('confirm')}</Button>
    </div>
  );
};
```

### 2.3 在非组件场景中使用 `t` 函数
在普通的 TypeScript 文件中（如 API 拦截器、Store 的 action、工具函数中），无法使用 Hook。此时**必须**使用静态的 `t` 函数。

```typescript
import { t } from '@/locales';
import { toast } from '@/hooks/use-toast';

export const handleApiError = (error: any) => {
  // 第一个参数是命名空间，第二个参数是词条 key
  const errorMessage = t('error', 'networkError');
  
  toast.error(errorMessage);
};

// 带参数的使用
const successMsg = t('common', 'greeting', { name: 'Admin' });
```

## 3. 语言切换与状态获取

全局语言状态由 `useGlobalStore` 管理，键名为 `zh`，值为 `'ch'`（中文）或 `'zn'`（英文）。

```typescript
import { useGlobalStore } from '@/stores/global';
import { isZhLang } from '@/locales';

const SettingsPanel = () => {
  const { zh, toggleZh, setZh } = useGlobalStore();
  
  // 检查当前是否为中文环境（也可以使用 isZhLang 工具函数）
  const isChinese = isZhLang();

  return (
    <button onClick={toggleZh}>
      Switch to {isChinese ? 'English' : '中文'}
    </button>
  );
};
```

## 4. 常见反模式（禁止）

❌ **错误 1：硬编码中文字符串**
```tsx
// ❌ 错误
<Button>提交表单</Button>

// ✅ 正确
const t = useT('common');
<Button>{t('submit')}</Button>
```

❌ **错误 2：在组件外部使用 `useT`**
```tsx
// ❌ 错误：Hook 只能在组件顶层调用
const t = useT('common'); 
export const myHelper = () => {
  console.log(t('success'));
};

// ✅ 正确：使用静态 t 函数
import { t } from '@/locales';
export const myHelper = () => {
  console.log(t('common', 'success'));
};
```

❌ **错误 3：只更新一种语言**
```typescript
// ❌ 错误：只在 zh/common.ts 中添加了新词条，忘记在 en/common.ts 中添加
// 这会导致 TypeScript 报错，因为类型不匹配。
// ✅ 正确：必须同时在两个语言包中添加同名词条。
```
