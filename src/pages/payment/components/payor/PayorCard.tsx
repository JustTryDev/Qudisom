// 드래그 가능한 결제자 카드 컴포넌트 (Draggable Payor Card Component)
// react-dnd를 사용하여 일정 드롭 영역으로 드래그할 수 있는 결제자 카드

import React from 'react';
import { useDrag } from 'react-dnd';
import { User, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SplitPayor } from '../../types';

const DRAG_TYPE = 'PAYOR_CARD'; // 드래그 아이템 타입 (Drag item type)

interface PayorCardProps {
  payor: SplitPayor;
  status: 'complete' | 'partial' | 'overflow';
  allocated: number;
  remaining: number;
  disabled?: boolean;
  className?: string;
}

/**
 * PayorCard 컴포넌트
 *
 * 결제자를 나타내는 카드로, 일정 드롭 영역으로 드래그하여 금액을 배분할 수 있습니다.
 *
 * 일상 생활 비유:
 * 학교 수강신청 시스템에서 학생 카드를 수업 칸으로 드래그하는 것처럼,
 * 결제자 카드를 일정(선금, 잔금 등) 칸으로 드래그하여 배분합니다.
 *
 * 상태 (Status):
 * - complete (🟢): 담당 금액을 모두 배분 완료
 * - partial (🟡): 아직 배분하지 않은 금액이 남음
 * - overflow (🔴): 담당 금액보다 많이 배분함
 *
 * @example
 * <PayorCard
 *   payor={splitPayor}
 *   status="partial"
 *   allocated={150000}
 *   remaining={150000}
 * />
 */
export function PayorCard({
  payor,
  status,
  allocated,
  remaining,
  disabled = false,
  className,
}: PayorCardProps) {
  // react-dnd useDrag 훅 (react-dnd useDrag hook)
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DRAG_TYPE,
      item: { payorId: payor.id, payorName: payor.payor.name },
      canDrag: !disabled,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [payor.id, disabled]
  );

  // 상태별 스타일 (Status-based styles)
  const statusConfig = {
    complete: {
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      badgeColor: 'bg-green-100 text-green-700',
    },
    partial: {
      icon: <AlertCircle className="h-4 w-4 text-amber-600" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    overflow: {
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      badgeColor: 'bg-red-100 text-red-700',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      ref={drag}
      className={cn(
        'p-4 rounded-xl border-2 transition-all',
        config.bgColor,
        config.borderColor,
        isDragging && 'opacity-50 rotate-2 scale-95',
        !disabled && 'cursor-grab active:cursor-grabbing hover:shadow-md',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* 헤더: 이름 + 상태 아이콘 (Header: Name + Status Icon) */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className={cn('text-sm font-semibold', config.textColor)}>
            {payor.payor.name}
          </span>
        </div>
        {config.icon}
      </div>

      {/* 금액 정보 (Amount Info) */}
      <div className="space-y-1">
        {/* 담당 금액 (Total Amount) */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">담당 금액</span>
          <span className={cn('font-mono font-semibold', config.textColor)}>
            {payor.amount.toLocaleString()}원
          </span>
        </div>

        {/* 배분 완료 (Allocated) */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">배분 완료</span>
          <span className="font-mono text-gray-700">
            {allocated.toLocaleString()}원
          </span>
        </div>

        {/* 남은 금액 / 초과 금액 (Remaining / Overflow) */}
        {status !== 'complete' && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">
              {status === 'overflow' ? '초과 금액' : '남은 금액'}
            </span>
            <span
              className={cn(
                'font-mono font-semibold',
                status === 'overflow' ? 'text-red-600' : 'text-amber-600'
              )}
            >
              {Math.abs(remaining).toLocaleString()}원
            </span>
          </div>
        )}
      </div>

      {/* 상태 배지 (Status Badge) */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <span
          className={cn(
            'inline-block px-2 py-0.5 rounded-full text-xs font-medium',
            config.badgeColor
          )}
        >
          {status === 'complete' && '✓ 배분 완료'}
          {status === 'partial' && '일부 배분'}
          {status === 'overflow' && '초과 배분'}
        </span>
      </div>

      {/* 드래그 힌트 (Drag Hint) */}
      {!disabled && status !== 'complete' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          드래그하여 일정에 배분
        </div>
      )}
    </div>
  );
}

export default PayorCard;
export { DRAG_TYPE };
