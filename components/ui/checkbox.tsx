'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className='relative'>
    <input
      type='checkbox'
      ref={ref}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none checked:bg-primary checked:text-primary-foreground',
        className
      )}
      {...props}
    />
    <Check className='h-4 w-4 absolute inset-0 text-white opacity-0 peer-checked:opacity-100 pointer-events-none' />
  </div>
));
Checkbox.displayName = 'Checkbox';

export { Checkbox };
