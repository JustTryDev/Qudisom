// 배분 항목 컴포넌트 (Allocation Row Component)
// 일정 드롭 영역 내부에서 결제자별 금액 배분을 표시하고 수정하는 행

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SchedulePayorAllocation, SplitPayor } from '../../types';

interface AllocationRowProps {
  allocation: SchedulePayorAllocation;
  payor: SplitPayor;
  onAmountChange: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * AllocationRow 컴포넌트
 *
 * 일정 드롭 영역 안에서 각 결제자의 금액 배분을 표시합니다.
 *
 * 일상 생활 비유:
 * 친구들과 회식비를 나눌 때, "철수: 20,000원 [x]" 처럼 각 사람이 낼 금액을 적는 것과 같습니다.
 *
 * @example
 * <AllocationRow
 *   allocation={{ id: 'a1', scheduleId: 's1', splitPayorId: 'p1', amount: 150000 }}
 *   payor={splitPayor}
 *   onAmountChange={handleAmountChange}
 *   onRemove={handleRemove}
 * />
 */
export function AllocationRow({
  allocation,
  payor,
  onAmountChange,
  onRemove,
  disabled = false,
  className,
}: AllocationRowProps) {
  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      onAmountChange(allocation.id, numValue);
    } else if (value === '') {
      onAmountChange(allocation.id, 0);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200',
        'hover:border-gray-300 transition-colors',
        className
      )}
    >
      {/* 결제자 이름 (Payor Name) */}
      <div className="flex-shrink-0">
        <span className="text-sm font-medium text-gray-900">
          {payor.payor.name}
        </span>
      </div>

      {/* 금액 입력 (Amount Input) */}
      <div className="flex-1 min-w-0">
        <div className="relative">
          <input
            type="text"
            value={allocation.amount.toLocaleString()}
            onChange={handleAmountInput}
            disabled={disabled}
            className={cn(
              'w-full px-3 py-1.5 text-sm font-mono text-right',
              'border border-gray-300 rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-[#1a2867] focus:border-transparent',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
            )}
            placeholder="0"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
            원
          </span>
        </div>
      </div>

      {/* 삭제 버튼 (Remove Button) */}
      <button
        onClick={() => onRemove(allocation.id)}
        disabled={disabled}
        className={cn(
          'flex-shrink-0 p-1.5 rounded-lg',
          'text-gray-400 hover:text-red-600 hover:bg-red-50',
          'transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        title="배분 제거"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default AllocationRow;
