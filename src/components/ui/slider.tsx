'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  onChange?: (value: number) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, showValue = true, formatValue, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(Number(e.target.value));
    };

    const displayValue = formatValue
      ? formatValue(Number(value))
      : `${value}`;

    return (
      <div className="space-y-2">
        {(label || showValue) && (
          <div className="flex justify-between items-center">
            {label && (
              <label className="text-sm font-medium text-primary">{label}</label>
            )}
            {showValue && (
              <span className="text-sm font-medium text-muted-foreground">
                {displayValue}
              </span>
            )}
          </div>
        )}
        <input
          type="range"
          className={cn(
            'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary',
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
