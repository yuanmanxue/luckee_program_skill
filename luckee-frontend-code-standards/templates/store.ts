/**
 * 标准 Zustand Store 模板
 *
 * 放置位置：src/stores/<storeName>.ts
 *
 * 核心要点：
 * 1. 使用 create<T>() 创建 store，定义完整的 TypeScript 类型
 * 2. 需要持久化的状态必须同步到 localStorage
 * 3. 如果需要在应用启动时恢复状态，在 src/stores/init.ts 中注册初始化逻辑
 * 4. 在 src/stores/index.ts 中导出
 * 5. 避免在 store 中直接导入 fetchApi（使用动态 import 防止循环依赖）
 */

import { create } from 'zustand';

// ---- 1. 类型定义 ----
interface MyStoreState {
  /** 数据列表 */
  items: string[];
  /** 加载状态 */
  isLoading: boolean;
}

interface MyStoreActions {
  /** 设置数据列表 */
  setItems: (items: string[]) => void;
  /** 从服务端获取数据 */
  fetchItems: () => Promise<void>;
  /** 从 localStorage 恢复状态（应用启动时调用） */
  initializeFromStorage: () => void;
  /** 重置状态 */
  reset: () => void;
}

type MyStore = MyStoreState & MyStoreActions;

// ---- 2. localStorage 键名（必须有项目前缀，避免冲突） ----
const STORAGE_KEY = 'luckee_my_store';

// ---- 3. 创建 Store ----
export const useMyStore = create<MyStore>((set, get) => ({
  // 初始状态
  items: [],
  isLoading: false,

  // 设置数据并同步到 localStorage
  setItems: (items) => {
    set({ items });
    // 同步到 localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
    } catch (e) {
      console.error('Failed to persist store:', e);
    }
  },

  // 从服务端获取数据（使用动态 import 避免循环依赖）
  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const { default: fetchApi } = await import('@/request/fetchApi');
      const response = await fetchApi('myApiName');
      if (response.code === 200 && Array.isArray(response.data)) {
        get().setItems(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 从 localStorage 恢复状态
  initializeFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ items: parsed.items || [] });
      }
    } catch (e) {
      console.error('Failed to restore store:', e);
    }
  },

  // 重置
  reset: () => {
    set({ items: [], isLoading: false });
    localStorage.removeItem(STORAGE_KEY);
  },
}));
