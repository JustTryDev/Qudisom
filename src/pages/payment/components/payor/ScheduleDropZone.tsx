// 일정 드롭 영역 컴포넌트 (Schedule Drop Zone Component)
// 결제자 카드를 드롭하여 금액 배분을 추가하는 영역

import React from 'react';
import { useDrop } from 'react-dnd';
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  PaymentSchedule,
  SchedulePayorAllocation,
  SplitPayor,
} from '../../types';
import { AllocationRow } from './AllocationRow';
import { DRAG_TYPE } from './PayorCard';

interface ScheduleDropZoneProps {
  schedule: PaymentSchedule;
  allocations: SchedulePayorAllocation[];
  splitPayors: SplitPayor[];
  status: 'complete' | 'partial' | 'overflow';
  totalAllocated: number;
  remaining: number;
  onDrop: (scheduleId: string, payorId: string) => void;
  onAmountChange: (allocationId: string, amount: number) => void;
  onRemove: (allocationId: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * ScheduleDropZone 컴포넌트
 *
 * 일정(선금, 잔금 등)에 결제자를 드롭하여 금액을 배분하는 영역입니다.
 *
 * 일상 생활 비유:
 * 학교 수업 등록 시스템에서 "수학 1반" 수업 칸에 학생들을 드롭하여 등록하는 것처럼,
 * "선금" 일정 칸에 결제자들을 드롭하여 각각 얼마씩 낼지 정합니다.
 *
 * 상태 (Status):
 * - complete (🟢): 일정 금액을 정확히 모두 배분 완료
 * - partial (🟡): 아직 배분하지 않은 금액이 남음
 * - overflow (🔴): 일정 금액보다 많이 배분됨
 *
 * @example
 * <ScheduleDropZone
 *   schedule={schedule}
 *   allocations={allocations}
 *   splitPayors={splitPayors}
 *   status="partial"
 *   totalAllocated={300000}
 *   remaining={200000}
 *   onDrop={handleDrop}
 *   onAmountChange={handleAmountChange}
 *   onRemove={handleRemove}
 * />
 */
export function ScheduleDropZone({
  schedule,
  allocations,
  splitPayors,
  status,
  totalAllocated,
  remaining,
  onDrop,
  onAmountChange,
  onRemove,
  disabled = false,
  className,
}: ScheduleDropZoneProps) {
  // 이미 배분된 결제자 ID 목록 (Already allocated payor IDs)
  const allocatedPayorIds = new Set(
    allocations.map((alloc) => alloc.splitPayorId)
  );

  // react-dnd useDrop 훅 (react-dnd useDrop hook)
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: DRAG_TYPE,
      canDrop: (item: { payorId: string; payorName: string }) => {
        // 이미 배분된 결제자는 중복 드롭 금지 (Prevent duplicate drops)
        return !disabled && !allocatedPayorIds.has(item.payorId);
      },
      drop: (item: { payorId: string; payorName: string }) => {
        onDrop(schedule.id, item.payorId);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [schedule.id, allocatedPayorIds, disabled]
  );

  // 상태별 스타일 (Status-based styles)
  const statusConfig = {
    complete: {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      borderColor: 'border-green-300',
      headerBg: 'bg-green-50',
      headerText: 'text-green-900',
      badgeColor: 'bg-green-100 text-green-700',
    },
    partial: {
      icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
      borderColor: 'border-amber-300',
      headerBg: 'bg-amber-50',
      headerText: 'text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    overflow: {
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      borderColor: 'border-red-300',
      headerBg: 'bg-red-50',
      headerText: 'text-red-900',
      badgeColor: 'bg-red-100 text-red-700',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      ref={drop}
      className={cn(
        'rounded-xl border-2 transition-all',
        config.borderColor,
        isOver && canDrop && 'border-[#fab803] bg-yellow-50 shadow-lg',
        isOver && !canDrop && 'border-red-400 bg-red-50',
        className
      )}
    >
      {/* 헤더 (Header) */}
      <div className={cn('p-4 rounded-t-xl', config.headerBg)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className={cn('text-lg font-bold', config.headerText)}>
              {schedule.label}
            </h3>
            {config.icon}
          </div>
          <span className={cn('text-lg font-bold', config.headerText)}>
            {schedule.amount.toLocaleString()}원
          </span>
        </div>

        {/* 배분 현황 (Allocation Status) */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">배분 완료</span>
            <span className="font-mono text-gray-900">
              {totalAllocated.toLocaleString()}원
            </span>
          </div>
          {status !== 'complete' && (
            <div className="flex items-center justify-between">
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
        <div className="mt-2">
          <span
            className={cn(
              'inline-block px-2 py-0.5 rounded-full text-xs font-medium',
              config.badgeColor
            )}
          >
            {status === 'complete' && '✓ 배분 완료'}
            {status === 'partial' && `${((totalAllocated / schedule.amount) * 100).toFixed(0)}% 배분`}
            {status === 'overflow' && '초과 배분'}
          </span>
        </div>
      </div>

      {/* 배분 목록 (Allocation List) */}
      <div className="p-4 space-y-2 bg-gray-50 rounded-b-xl min-h-[120px]">
        {allocations.length === 0 ? (
          /* 빈 상태 (Empty State) */
          <div
            className={cn(
              'flex flex-col items-center justify-center h-24 rounded-lg border-2 border-dashed',
              isOver && canDrop
                ? 'border-[#fab803] bg-yellow-100'
                : 'border-gray-300 bg-white'
            )}
          >
            <Plus
              className={cn(
                'h-6 w-6 mb-1',
                isOver && canDrop ? 'text-[#fab803]' : 'text-gray-400'
              )}
            />
            <p className="text-xs text-gray-500">
              {isOver && canDrop
                ? '드롭하여 배분 추가'
                : '결제자를 드래그하여 배분'}
            </p>
          </div>
        ) : (
          /* 배분 항목들 (Allocation Rows) */
          allocations.map((allocation) => {
            const payor = splitPayors.find(
              (p) => p.id === allocation.splitPayorId
            );
            if (!payor) return null;

            return (
              <AllocationRow
                key={allocation.id}
                allocation={allocation}
                payor={payor}
                onAmountChange={onAmountChange}
                onRemove={onRemove}
                disabled={disabled}
              />
            );
          })
        )}

        {/* 드롭 힌트 (Drop Hint) - 이미 배분이 있을 때 */}
        {allocations.length > 0 && !disabled && (
          <div
            className={cn(
              'flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-dashed',
              isOver && canDrop
                ? 'border-[#fab803] bg-yellow-100'
                : 'border-gray-300 bg-white'
            )}
          >
            <Plus
              className={cn(
                'h-4 w-4',
                isOver && canDrop ? 'text-[#fab803]' : 'text-gray-400'
              )}
            />
            <p className="text-xs text-gray-500">
              {isOver && canDrop
                ? '드롭하여 결제자 추가'
                : '다른 결제자 추가 가능'}
            </p>
          </div>
        )}

        {/* 드롭 불가 경고 (Cannot Drop Warning) */}
        {isOver && !canDrop && (
          <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-red-100 border-2 border-red-300">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-xs text-red-700 font-medium">
              이미 배분된 결제자입니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleDropZone;
