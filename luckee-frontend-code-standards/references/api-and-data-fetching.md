# API and Data Fetching Standards

## 1. 核心架构与服务发现

Luckee 项目采用**运行时服务发现（Runtime Service Discovery）**机制，而非构建时的环境变量。
所有 API 请求必须通过 `src/request/fetchApi.ts` 或 `src/request/fetchEventStream.ts` 发起，底层依赖 `src/config/apiConfig.ts` 自动解析域名。

### 1.1 服务映射规则
API 的域名由路径前缀自动决定，无需硬编码域名：
*   `luckee/user/` -> `USER_API_DOMAIN`
*   `api/v1/` 或 `api/v2/` -> `ADS_API_DOMAIN`
*   `api/` -> `DATA_API_DOMAIN`
*   `ask_ai/` -> `ADS_API_DOMAIN`

## 2. 定义新的 API 路由

所有的 API 路由必须集中定义在 `src/services/` 目录下。

### 2.1 命名与格式规范
必须采用 `METHOD@PATH` 的格式。系统会自动根据路径前缀匹配服务域名。

```typescript
// src/services/userApi.ts
// 错误：不要硬编码域名或协议
export const getUser = 'https://api.luckee.com/luckee/user/web/user/getUser.do';

// 正确：指定方法和路径，系统自动识别为 USER_API_DOMAIN
export const getUser = 'GET@luckee/user/web/user/getUser.do';

// 正确：指定方法和路径，系统自动识别为 ADS_API_DOMAIN
export const askAiAsk = 'POST@ask_ai/ask';
```

如果路径前缀无法自动匹配正确的服务，可以显式指定服务名：
```typescript
// 格式：METHOD@SERVICE_NAME:PATH
export const customApi = 'POST@DATA_API_DOMAIN:custom/path/action';
```

### 2.2 导出规范
在 `src/services/` 目录下创建文件后，必须在 `src/services/index.ts` 中导出：
```typescript
export * from './yourNewApiFile';
```

## 3. 发起 HTTP 请求

使用 `src/request/fetchApi.ts` 封装的方法。它自动处理了：
1.  **认证头** (`Luckee-Authorization`, `X-User-ID`, `X-LINGXING-ACCOUNT`)
2.  **多语言头** (`USER_LANGUAGE`)
3.  **超时控制**（默认 3 分钟）
4.  **全局错误拦截**（401 自动登出，402 积分不足拦截等）

### 3.1 基础调用

```typescript
import { fetchApi } from '@/request';

// GET 请求：参数会自动转换为 Query String
const fetchUserData = async () => {
  try {
    // 这里的 'getUser' 必须是 src/services 中导出的变量名
    const data = await fetchApi('getUser', { id: 123 });
    return data;
  } catch (error) {
    console.error(error);
  }
};

// POST 请求：参数会自动转换为 JSON Body
const submitData = async () => {
  const data = await fetchApi('askAiAsk', { prompt: 'hello' });
};
```

### 3.2 高级调用：自定义超时与手动取消

```typescript
import { fetchApi } from '@/request';

const fetchWithTimeoutAndCancel = async () => {
  const controller = new AbortController();
  
  try {
    const data = await fetchApi(
      'tasksAll', 
      { limit: 10 }, 
      { 
        timeout: 300000, // 自定义超时时间（5分钟）
        signal: controller.signal // 传入 signal 以便手动取消
      }
    );
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求被手动取消');
    }
  }
  
  // 在需要时取消请求
  // controller.abort();
};
```

## 4. 处理 SSE (Server-Sent Events) 请求

对于流式返回的接口，必须使用 `src/request/fetchEventStream.ts`。它同样处理了认证头和多语言头。

```typescript
import { fetchEventStream } from '@/request';
import { askAiAsk } from '@/services'; // 导入具体的 API 路径字符串

const startStreaming = () => {
  const controller = new AbortController();

  fetchEventStream({
    url: askAiAsk, // 注意：这里传入的是服务定义的字符串，而不是变量名
    method: 'POST',
    params: { query: '分析广告数据' },
    signal: controller.signal,
    onMessage: (messageString) => {
      // 注意：onMessage 接收到的是 JSON 字符串化的对象
      try {
        const message = JSON.parse(messageString);
        console.log('Received chunk:', message.data);
      } catch (e) {
        console.log('Raw message:', messageString);
      }
    },
    onClose: (bufferArray) => {
      console.log('Stream closed');
    },
    onError: (error) => {
      console.error('Stream error:', error);
    }
  });
};
```

## 5. 结合 React Query 使用

在组件中进行数据获取时，强烈建议将 `fetchApi` 包装在 React Query 的 `useQuery` 或 `useMutation` 中，以利用其缓存和状态管理能力。

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchApi } from '@/request';

// 查询数据
export const useUserData = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchApi('getUser', { id: userId }),
    enabled: !!userId,
  });
};

// 提交数据
export const useUpdateUser = () => {
  return useMutation({
    mutationFn: (data: any) => fetchApi('updateUser', data),
    onSuccess: () => {
      // 成功后可以通过 queryClient.invalidateQueries 刷新数据
    }
  });
};
```
