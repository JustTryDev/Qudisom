// 금액 입력 컴포넌트 (Amount Input Component)

import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  showFullButton?: boolean;
  fullAmount?: number;
  onFullClick?: () => void;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  // 퍼센티지 버튼 기능 (Percentage buttons feature)
  percentageButtons?: number[]; // 예: [100, 50, 30]
  totalAmount?: number; // 퍼센티지 계산 기준 금액
}

export function AmountInput({
  value,
  onChange,
  max,
  min = 0,
  placeholder = '금액 입력',
  disabled = false,
  error,
  showFullButton = false,
  fullAmount,
  onFullClick,
  label,
  className,
  size = 'md',
  percentageButtons,
  totalAmount,
}: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    value > 0 ? formatAmount(value) : ''
  );

  // 외부 value가 변경되면 displayValue 업데이트 (When external value changes)
  useEffect(() => {
    setDisplayValue(value > 0 ? formatAmount(value) : '');
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, '');

      if (rawValue === '') {
        setDisplayValue('');
        onChange(0);
        return;
      }

      let numValue = parseInt(rawValue, 10);

      // 최대/최소값 제한 (Apply min/max limits)
      if (max !== undefined && numValue > max) {
        numValue = max;
      }
      if (numValue < min) {
        numValue = min;
      }

      setDisplayValue(formatAmount(numValue));
      onChange(numValue);
    },
    [onChange, max, min]
  );

  const handleBlur = useCallback(() => {
    if (displayValue === '') {
      setDisplayValue('');
      onChange(0);
    }
  }, [displayValue, onChange]);

  const handleFullClick = useCallback(() => {
    if (fullAmount !== undefined) {
      setDisplayValue(formatAmount(fullAmount));
      onChange(fullAmount);
    }
    onFullClick?.();
  }, [fullAmount, onChange, onFullClick]);

  // 퍼센티지 버튼 클릭 핸들러 (Percentage button click handler)
  const handlePercentageClick = useCallback(
    (percentage: number) => {
      if (totalAmount === undefined) return;
      const newAmount = Math.floor((totalAmount * percentage) / 100);
      setDisplayValue(formatAmount(newAmount));
      onChange(newAmount);
    },
    [totalAmount, onChange]
  );

  // 오른쪽에 "원" 글자가 들어갈 공간 확보를 위해 pr을 넉넉히 설정
  // (Ensure enough right padding for "원" suffix)
  const sizeClasses = {
    sm: 'h-9 text-sm pl-3 pr-10',
    md: 'h-11 text-base pl-4 pr-12',
    lg: 'h-14 text-lg pl-5 pr-14',
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full rounded-xl border bg-white text-right font-medium transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              error ? 'border-red-300' : 'border-gray-200',
              sizeClasses[size]
            )}
          />
          <span
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none',
              size === 'sm' && 'text-sm',
              size === 'lg' && 'text-lg'
            )}
          >
            원
          </span>
        </div>

        {showFullButton && fullAmount !== undefined && (
          <button
            type="button"
            onClick={handleFullClick}
            disabled={disabled}
            className={cn(
              'shrink-0 rounded-xl border border-gray-200 bg-white px-4 font-medium text-gray-700',
              'hover:border-[#fab803] hover:text-[#fab803] transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[size]
            )}
          >
            전액
          </button>
        )}

        {/* 퍼센티지 버튼 (Percentage Buttons) */}
        {percentageButtons && percentageButtons.length > 0 && totalAmount !== undefined && (
          <div className="flex gap-1.5">
            {percentageButtons.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentageClick(pct)}
                disabled={disabled}
                className={cn(
                  'shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
                  value === Math.floor((totalAmount * pct) / 100)
                    ? 'border-[#1a2867] bg-[#1a2867] text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#1a2867] hover:text-[#1a2867]',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {pct}%
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// ==================== 금액 포맷팅 유틸 (Amount Formatting Utilities) ====================

export function formatAmount(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

export function parseAmount(formatted: string): number {
  const cleaned = formatted.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export function formatAmountWithUnit(amount: number): string {
  if (amount >= 100000000) {
    const billions = Math.floor(amount / 100000000);
    const remainder = amount % 100000000;
    if (remainder === 0) {
      return `${billions}억`;
    }
    const millions = Math.floor(remainder / 10000);
    return `${billions}억 ${millions.toLocaleString()}만`;
  }
  if (amount >= 10000) {
    const millions = Math.floor(amount / 10000);
    const remainder = amount % 10000;
    if (remainder === 0) {
      return `${millions.toLocaleString()}만`;
    }
    return `${millions.toLocaleString()}만 ${remainder.toLocaleString()}`;
  }
  return amount.toLocaleString();
}

// ==================== 금액 비교 표시 (Amount Comparison Display) ====================

interface AmountComparisonProps {
  label: string;
  current: number;
  target: number;
  className?: string;
}

export function AmountComparison({
  label,
  current,
  target,
  className,
}: AmountComparisonProps) {
  const diff = current - target;
  const isOver = diff > 0;
  const isUnder = diff < 0;
  const isMatch = diff === 0;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'text-sm font-semibold',
            isMatch && 'text-green-600',
            isOver && 'text-red-600',
            isUnder && 'text-amber-600'
          )}
        >
          {formatAmount(current)}원
        </span>
        <span className="text-sm text-gray-400">/</span>
        <span className="text-sm text-gray-500">{formatAmount(target)}원</span>
        {!isMatch && (
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              isOver && 'bg-red-100 text-red-700',
              isUnder && 'bg-amber-100 text-amber-700'
            )}
          >
            {isOver ? '+' : ''}{formatAmount(diff)}원
          </span>
        )}
        {isMatch && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            ✓ 일치
          </span>
        )}
      </div>
    </div>
  );
}

export default AmountInput;
