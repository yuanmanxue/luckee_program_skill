/**
 * 标准路由页面模板
 *
 * 使用方式：
 * 1. 将此文件复制到 src/pages/<PageName>/index.tsx
 * 2. 在 src/pages/router.tsx 中注册路由（使用 lazy 导入）
 * 3. 如需认证保护，使用 AuthGuard 包裹
 *
 * 路由注册示例（src/pages/router.tsx）：
 *   const MyPage = lazy(() => import('@/pages/MyPage'));
 *   { path: '/my-page', element: <ProtectedRoute><MyPage /></ProtectedRoute> }
 */

import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/request';
import { useT } from '@/locales';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// ---- 类型定义 ----
interface PageData {
  id: string;
  title: string;
}

// ---- 主组件 ----
const MyPage: React.FC = () => {
  // i18n
  const t = useT('common');

  // 数据获取（使用 React Query + fetchApi）
  const { data, isLoading, error } = useQuery({
    queryKey: ['myPageData'],
    queryFn: () => fetchApi<{ code: number; data: PageData[] }>('myApiName'),
  });

  // 错误处理
  useEffect(() => {
    if (error) {
      toast.error(t('error'));
    }
  }, [error, t]);

  // 事件处理
  const handleAction = useCallback(async () => {
    try {
      await fetchApi('myActionApi', { id: '123' });
      toast.success(t('success'));
    } catch (e) {
      toast.error(t('error'));
    }
  }, [t]);

  // 加载状态
  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <span className='text-muted-foreground'>{t('loading')}</span>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4 p-6')}>
      <h1 className='text-2xl font-semibold text-foreground'>
        {/* 使用 i18n 词条 */}
        Page Title
      </h1>

      <div className='rounded-lg border border-border bg-card p-4'>
        {/* 页面内容区域 */}
      </div>
    </div>
  );
};

export default MyPage;
