# Error Handling and Feedback Standards

Luckee 项目在错误处理和用户反馈方面建立了一套非常规范的机制。所有的异常捕获、页面更新错误和用户提示**必须**遵循以下标准。

## 1. 核心原则

1.  **禁止使用原生 `alert()` 或 `console.error`** 作为用户可见的反馈。
2.  **必须使用全局 Toast** 系统提供成功、警告和错误提示。
3.  **必须捕获并处理** 所有的 API 请求错误（`ApiError`）和 Promise 拒绝。
4.  **特殊错误特殊处理**：特别是针对应用更新时的 `ChunkLoadError`。

## 2. 全局 Toast 反馈系统

全局反馈统一通过 `src/hooks/use-toast.ts` 暴露的 `toast` 对象进行。它提供了四个便捷方法，并自动处理了显示时长和样式。

### 2.1 基础用法

```typescript
import { toast } from '@/hooks/use-toast';
import { useT } from '@/locales'; // 必须结合 i18n 使用

const MyComponent = () => {
  const t = useT('common');

  const handleAction = async () => {
    try {
      // 成功提示（默认显示 3000ms，绿色）
      toast.success(t('success'));
      
      // 错误提示（默认显示 4000ms，红色）
      toast.error(t('error'));
      
      // 警告提示（默认显示 3000ms，黄色）
      toast.warning(t('warning'));
      
      // 一般信息提示（默认显示 3000ms，蓝色/灰色）
      toast.info(t('info'));
    } catch (error) {
      // ...
    }
  };
};
```

### 2.2 自定义时长

所有的便捷方法都支持传入第二个参数来自定义显示时长（毫秒）：

```typescript
toast.error('操作失败，请稍后重试', 5000); // 显示 5 秒
```

## 3. API 错误处理

`fetchApi` 内部会抛出自定义的 `ApiError`，包含了状态码和原始响应数据。

### 3.1 拦截与处理模式

```typescript
import { fetchApi, ApiError } from '@/request';
import { toast } from '@/hooks/use-toast';
import { t } from '@/locales';

const submitForm = async (data: any) => {
  try {
    const result = await fetchApi('submitData', data);
    toast.success(t('common', 'success'));
  } catch (error) {
    // 必须判断是否为 ApiError
    if (error instanceof ApiError) {
      // 401 错误已经在 fetchApi 内部处理（自动登出并重定向），这里通常不需要额外处理
      if (error.status === 401) return;

      // 402 错误（积分不足）已经在内部解析了详细信息，直接显示即可
      if (error.status === 402) {
        toast.warning(error.message);
        return;
      }

      // 其他 API 错误，显示具体的错误信息
      toast.error(error.message || t('error', 'apiFailed'));
    } else {
      // 非 API 错误（如网络断开、代码异常等）
      toast.error(t('error', 'unknownError'));
      console.error('Submit failed:', error);
    }
  }
};
```

## 4. ChunkLoadError 处理机制

在 SPA 应用中，如果用户长时间未刷新页面，而服务端发布了新版本，用户在导航到新路由（懒加载组件）时会遇到 `ChunkLoadError`。

### 4.1 自动恢复机制
项目在 `src/utils/chunkErrorHandler.ts` 中实现了一套自动重试机制。当检测到 `ChunkLoadError` 时，系统会尝试自动刷新页面（最多重试两次）。

### 4.2 ErrorBoundary 的集成
在编写页面级组件或可能懒加载的组件时，**必须**使用 `src/components/base/ErrorBoundary` 进行包裹。这个 `ErrorBoundary` 内部已经集成了 `ChunkLoadError` 的检测和友好的回退 UI（提示用户“应用已更新，请刷新”）。

```tsx
import React, { lazy } from 'react';
import { ErrorBoundary } from '@/components/base';

// 懒加载组件
const LazyComponent = lazy(() => import('./LazyComponent'));

export const MyPage = () => {
  return (
    // 必须包裹 ErrorBoundary，以捕获 LazyComponent 加载失败的情况
    <ErrorBoundary>
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    </ErrorBoundary>
  );
};
```

## 5. 常见反模式（禁止）

❌ **错误 1：使用原生 alert**
```typescript
// ❌ 错误：原生 alert 会阻塞主线程，体验极差
alert('保存成功！');

// ✅ 正确
toast.success(t('common', 'saveSuccess'));
```

❌ **错误 2：吞掉错误不反馈**
```typescript
// ❌ 错误：用户不知道发生了什么
try {
  await fetchApi('deleteItem');
} catch (e) {
  console.error(e);
}

// ✅ 正确：给用户明确的反馈
try {
  await fetchApi('deleteItem');
  toast.success(t('common', 'deleteSuccess'));
} catch (e) {
  toast.error(e instanceof ApiError ? e.message : t('error', 'deleteFailed'));
}
```

❌ **错误 3：未处理懒加载错误**
```tsx
// ❌ 错误：懒加载组件没有被 ErrorBoundary 包裹，如果 chunk 加载失败会导致整个应用白屏
const ChatArea = lazy(() => import('@/components/cbm/ChatArea'));
const App = () => <ChatArea />;

// ✅ 正确：在 router.tsx 或父组件中使用 ErrorBoundary 统一包裹
```
