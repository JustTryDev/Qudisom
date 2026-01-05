// 일정별 결제자 배분 메인 컴포넌트 (Payor Schedule Allocator Main Component)
// 드래그 앤 드롭으로 결제자를 일정에 배분하는 전체 레이아웃

import React, { useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  PaymentSchedule,
  SplitPayor,
  SchedulePayorAllocation,
} from '../../types';
import { PayorCard } from './PayorCard';
import { ScheduleDropZone } from './ScheduleDropZone';
import {
  getPayorAllocationStatus,
  getScheduleAllocationStatus,
  validateAllAllocations,
} from '../../utils/validation';

interface PayorScheduleAllocatorProps {
  schedules: PaymentSchedule[];
  splitPayors: SplitPayor[];
  allocations: SchedulePayorAllocation[];
  onAddAllocation: (allocation: SchedulePayorAllocation) => void;
  onUpdateAllocation: (id: string, amount: number) => void;
  onRemoveAllocation: (id: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * PayorScheduleAllocator 컴포넌트
 *
 * 멀티 결제 시 각 결제자가 각 일정(선금, 잔금 등)에 얼마씩 낼지
 * 드래그 앤 드롭으로 배분하는 메인 컴포넌트입니다.
 *
 * 일상 생활 비유:
 * 친구들과 여행비를 나눌 때, "선금: 50만원", "잔금: 50만원"이 있고,
 * 각 친구가 선금/잔금에 각각 얼마씩 낼지 카드를 드래그해서 배치하는 것과 같습니다.
 *
 * 구성 요소:
 * 1. 상단: 결제자 카드들 (드래그 소스)
 * 2. 하단: 일정 드롭 영역들 (드롭 타겟)
 * 3. 하단 하단: 검증 결과 요약
 *
 * @example
 * <PayorScheduleAllocator
 *   schedules={schedules}
 *   splitPayors={splitPayors}
 *   allocations={allocations}
 *   onAddAllocation={handleAddAllocation}
 *   onUpdateAllocation={handleUpdateAllocation}
 *   onRemoveAllocation={handleRemoveAllocation}
 * />
 */
export function PayorScheduleAllocator({
  schedules,
  splitPayors,
  allocations,
  onAddAllocation,
  onUpdateAllocation,
  onRemoveAllocation,
  disabled = false,
  className,
}: PayorScheduleAllocatorProps) {
  // 드롭 핸들러 (Drop Handler)
  const handleDrop = useCallback(
    (scheduleId: string, payorId: string) => {
      const payor = splitPayors.find((p) => p.id === payorId);
      const schedule = schedules.find((s) => s.id === scheduleId);

      if (!payor || !schedule) return;

      // 자동으로 남은 금액을 계산하여 초기값 설정
      const payorStatus = getPayorAllocationStatus(payor, allocations);
      const scheduleStatus = getScheduleAllocationStatus(schedule, allocations);

      // 결제자 남은 금액과 일정 남은 금액 중 작은 값을 초기 배분 금액으로 설정
      const suggestedAmount = Math.min(
        payorStatus.remaining,
        scheduleStatus.remaining
      );

      const newAllocation: SchedulePayorAllocation = {
        id: `allocation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        scheduleId,
        splitPayorId: payorId,
        amount: suggestedAmount > 0 ? suggestedAmount : 0,
      };

      onAddAllocation(newAllocation);
    },
    [schedules, splitPayors, allocations, onAddAllocation]
  );

  // 결제자별 상태 계산 (Calculate payor status)
  const payorStatuses = useMemo(() => {
    return splitPayors.map((payor) => {
      const status = getPayorAllocationStatus(payor, allocations);
      return {
        payor,
        ...status,
      };
    });
  }, [splitPayors, allocations]);

  // 일정별 상태 계산 (Calculate schedule status)
  const scheduleStatuses = useMemo(() => {
    return schedules.map((schedule) => {
      const status = getScheduleAllocationStatus(schedule, allocations);
      return {
        schedule,
        ...status,
      };
    });
  }, [schedules, allocations]);

  // 전체 검증 (Full validation)
  const validation = useMemo(() => {
    return validateAllAllocations(schedules, splitPayors, allocations);
  }, [schedules, splitPayors, allocations]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cn('space-y-6', className)}>
        {/* 안내 메시지 (Info Banner) */}
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                드래그 앤 드롭으로 금액 배분하기
              </p>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>아래 결제자 카드를 일정 칸으로 드래그하여 배분합니다</li>
                <li>한 결제자가 여러 일정에 중복으로 배분할 수 있습니다</li>
                <li>
                  드롭 후 금액 입력란에서 정확한 금액을 입력할 수 있습니다
                </li>
                <li>
                  모든 일정의 금액이 정확히 배분되어야 다음 단계로 진행할 수
                  있습니다
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 결제자 카드 영역 (Payor Cards Section) */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            📦 결제자 ({splitPayors.length}명)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {payorStatuses.map(({ payor, status, totalAllocated, remaining }) => (
              <PayorCard
                key={payor.id}
                payor={payor}
                status={status}
                allocated={totalAllocated}
                remaining={remaining}
                disabled={disabled}
              />
            ))}
          </div>
        </div>

        {/* 일정 드롭 영역 (Schedule Drop Zones) */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            💰 일정별 배분 ({schedules.length}개)
          </h3>
          <div className="space-y-4">
            {scheduleStatuses.map(
              ({ schedule, status, totalAllocated, remaining }) => {
                const scheduleAllocations = allocations.filter(
                  (alloc) => alloc.scheduleId === schedule.id
                );

                return (
                  <ScheduleDropZone
                    key={schedule.id}
                    schedule={schedule}
                    allocations={scheduleAllocations}
                    splitPayors={splitPayors}
                    status={status}
                    totalAllocated={totalAllocated}
                    remaining={remaining}
                    onDrop={handleDrop}
                    onAmountChange={onUpdateAllocation}
                    onRemove={onRemoveAllocation}
                    disabled={disabled}
                  />
                );
              }
            )}
          </div>
        </div>

        {/* 검증 결과 요약 (Validation Summary) */}
        {validation.errors.length > 0 && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              ⚠️ 배분이 완료되지 않았습니다
            </p>
            <ul className="text-xs text-amber-700 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="shrink-0">•</span>
                  <span>{error.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 완료 상태 (Completion Status) */}
        {validation.isValid && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-900">
                  배분 완료!
                </p>
                <p className="text-xs text-green-700">
                  모든 일정과 결제자의 금액이 정확히 배분되었습니다
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default PayorScheduleAllocator;
