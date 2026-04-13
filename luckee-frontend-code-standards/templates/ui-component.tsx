/**
 * 标准 UI 组件模板
 *
 * 放置位置：
 * - 通用原语 -> src/components/ui/<component-name>.tsx
 * - 业务组件 -> src/components/cbm/<ComponentName>/index.tsx
 *
 * 核心要点：
 * 1. 使用 cva() 定义组件变体（variant, size 等）
 * 2. 使用 cn() 合并外部传入的 className
 * 3. 使用 React.forwardRef 暴露 ref
 * 4. 使用语义化的 Tailwind 类名（bg-background, text-foreground 等）
 * 5. 导出组件和 variants 以便外部复用
 */

import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

// ---- 1. 定义变体 ----
const myComponentVariants = cva(
  // 基础样式（所有变体共享）
  'inline-flex items-center justify-center rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
  {
    variants: {
      // 外观变体
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        muted: 'bg-muted text-muted-foreground',
      },
      // 尺寸变体
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
      },
    },
    // 默认变体
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// ---- 2. 定义 Props 类型 ----
export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {
  /** 组件特有的 prop */
  label?: string;
}

// ---- 3. 实现组件 ----
const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, label, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(myComponentVariants({ variant, size, className }))}
        {...props}
      >
        {label && (
          <span className='text-foreground font-medium'>{label}</span>
        )}
        {children}
      </div>
    );
  },
);

MyComponent.displayName = 'MyComponent';

// ---- 4. 导出 ----
export { MyComponent, myComponentVariants };
