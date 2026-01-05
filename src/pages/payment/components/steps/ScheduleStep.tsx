// Step 1: 결제 일정 컴포넌트 (Payment Schedule Step Component)

import React, { useCallback, useMemo } from 'react';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentSchedule, PaymentTiming } from '../../types';
import {
  PAYMENT_TIMINGS,
  PAYMENT_TERM_PRESETS,
  createDefaultSchedule,
} from '../../utils/constants';
import { AmountInput, formatAmount, AmountComparison } from '../shared/AmountInput';
import { DeferredPaymentBanner } from '../shared/ContractWarning';
import { StepCard, StepCardActions, StepSummaryItem, StepSummaryGrid } from './StepCard';

interface ScheduleStepProps {
  schedules: PaymentSchedule[];
  totalOrderAmount: number;
  onSchedulesChange: (schedules: PaymentSchedule[]) => void;
  onComplete: () => void;
  onEdit?: () => void;
  isActive: boolean;
  isCompleted: boolean;
  testMode?: boolean; // 테스트 모드: 검증 스킵 가능 (Test mode: can skip validation)
  className?: string;
}

export function ScheduleStep({
  schedules,
  totalOrderAmount,
  onSchedulesChange,
  onComplete,
  onEdit,
  isActive,
  isCompleted,
  testMode = false,
  className,
}: ScheduleStepProps) {
  // 프리셋 선택 상태 (Preset selection state)
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(null);

  // 총 결제 금액 계산 (Calculate total payment amount)
  const totalScheduleAmount = useMemo(() => {
    return schedules.reduce((sum, s) => sum + s.amount, 0);
  }, [schedules]);

  // 후불 포함 여부 (Check if deferred payment included)
  const hasDeferred = useMemo(() => {
    return schedules.some((s) => s.timing === 'post-ship');
  }, [schedules]);

  // 금액 일치 여부 (Check if amounts match)
  const isAmountValid = totalScheduleAmount === totalOrderAmount;

  // 프리셋 선택 핸들러 (Preset selection handler)
  const handlePresetSelect = useCallback(
    (presetId: string) => {
      setSelectedPreset(presetId);

      if (presetId === 'custom') {
        // 커스텀: 기존 일정 유지 또는 빈 일정 생성
        if (schedules.length === 0) {
          onSchedulesChange([createDefaultSchedule('schedule-1', '1차 결제')]);
        }
        return;
      }

      const preset = PAYMENT_TERM_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      // 프리셋에 따른 일정 생성 (Create schedules based on preset)
      const newSchedules = preset.schedules.map((s, index) => {
        const amount = Math.floor((totalOrderAmount * s.percentage) / 100);
        const label =
          preset.schedules.length === 1
            ? '결제'
            : index === 0
              ? '선금'
              : '잔금';
        return createDefaultSchedule(
          `schedule-${index + 1}`,
          label,
          amount,
          s.timing
        );
      });

      onSchedulesChange(newSchedules);
    },
    [schedules.length, totalOrderAmount, onSchedulesChange]
  );

  // 일정 추가 핸들러 (Add schedule handler)
  const handleAddSchedule = useCallback(() => {
    const newId = `schedule-${Date.now()}`;
    const newLabel = `${schedules.length + 1}차 결제`;
    onSchedulesChange([...schedules, createDefaultSchedule(newId, newLabel)]);
  }, [schedules, onSchedulesChange]);

  // 일정 삭제 핸들러 (Remove schedule handler)
  const handleRemoveSchedule = useCallback(
    (id: string) => {
      onSchedulesChange(schedules.filter((s) => s.id !== id));
    },
    [schedules, onSchedulesChange]
  );

  // 일정 업데이트 핸들러 (Update schedule handler)
  const handleUpdateSchedule = useCallback(
    (id: string, data: Partial<PaymentSchedule>) => {
      onSchedulesChange(
        schedules.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
    },
    [schedules, onSchedulesChange]
  );

  // 완료 가능 여부 (Can complete check)
  const canComplete = schedules.length > 0 && isAmountValid;

  // 요약 렌더링 (Summary rendering)
  const renderSummary = () => (
    <StepSummaryGrid columns={1}>
      {schedules.map((schedule, index) => (
        <div
          key={schedule.id}
          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{schedule.label}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
              {PAYMENT_TIMINGS.find((t) => t.value === schedule.timing)?.label}
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {formatAmount(schedule.amount)}원
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm font-medium text-gray-700">총 결제 금액</span>
        <span className="text-base font-bold text-[#1a2867]">
          {formatAmount(totalScheduleAmount)}원
        </span>
      </div>
    </StepSummaryGrid>
  );

  return (
    <StepCard
      step={1}
      status={{ step: 1, isCompleted, isActive, canEdit: isCompleted }}
      summary={isCompleted ? renderSummary() : undefined}
      onEdit={onEdit}
      className={className}
    >
      <div className="space-y-6">
        {/* 프리셋 선택 (Preset Selection) - 드롭다운 방식 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            결제 조건 선택
          </label>
          <select
            value={selectedPreset || ''}
            onChange={(e) => handlePresetSelect(e.target.value)}
            className={cn(
              'w-full h-12 rounded-xl border px-4 text-sm font-medium transition-colors appearance-none bg-white cursor-pointer',
              'focus:border-[#1a2867] focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20',
              'border-gray-200 hover:border-gray-300'
            )}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
            }}
          >
            <option value="" disabled>결제 조건을 선택하세요</option>
            {PAYMENT_TERM_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        {/* 결제 일정 목록 (Schedule List) */}
        {/* 피드백 1: 프리셋 선택 후 예정일/시간만 수정 가능, custom일 때만 전체 수정 가능 */}
        {selectedPreset && schedules.length > 0 && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              결제 일정 상세
              {selectedPreset !== 'custom' && (
                <span className="ml-2 text-xs text-gray-500 font-normal">
                  (예정일/시간만 수정 가능)
                </span>
              )}
            </label>
            <div className="space-y-3">
              {schedules.map((schedule, index) => (
                <ScheduleItem
                  key={schedule.id}
                  schedule={schedule}
                  index={index}
                  totalCount={schedules.length}
                  totalOrderAmount={totalOrderAmount}
                  onUpdate={(data) => handleUpdateSchedule(schedule.id, data)}
                  onRemove={() => handleRemoveSchedule(schedule.id)}
                  canRemove={selectedPreset === 'custom' && schedules.length > 1}
                  isCustomPreset={selectedPreset === 'custom'}
                />
              ))}
            </div>

            {/* 일정 추가 버튼 (Add Schedule Button) - custom 프리셋일 때만 표시 */}
            {selectedPreset === 'custom' && (
              <button
                type="button"
                onClick={handleAddSchedule}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-medium text-gray-500 hover:border-[#fab803] hover:text-[#fab803] transition-colors"
              >
                <Plus className="h-4 w-4" />
                결제 일정 추가
              </button>
            )}
          </div>
        )}

        {/* 금액 비교 (Amount Comparison) */}
        {schedules.length > 0 && (
          <AmountComparison
            label="결제 금액 합계"
            current={totalScheduleAmount}
            target={totalOrderAmount}
          />
        )}

        {/* 후불 경고 (Deferred Payment Warning) */}
        {hasDeferred && <DeferredPaymentBanner />}

        {/* 액션 버튼 (Action Buttons) */}
        <StepCardActions
          onNext={onComplete}
          onSkip={onComplete}
          nextLabel="다음 단계"
          nextDisabled={!canComplete}
          testMode={testMode}
        />
      </div>
    </StepCard>
  );
}

// ==================== 결제 일정 아이템 (Schedule Item) ====================

interface ScheduleItemProps {
  schedule: PaymentSchedule;
  index: number;
  totalCount: number;
  totalOrderAmount: number;
  onUpdate: (data: Partial<PaymentSchedule>) => void;
  onRemove: () => void;
  canRemove: boolean;
  isCustomPreset: boolean; // 기타 입력(custom) 프리셋인지 여부
}

function ScheduleItem({
  schedule,
  index,
  totalCount,
  totalOrderAmount,
  onUpdate,
  onRemove,
  canRemove,
  isCustomPreset,
}: ScheduleItemProps) {
  const isDeferred = schedule.timing === 'post-ship';

  return (
    <div
      className={cn(
        'rounded-xl border p-4 space-y-4',
        isDeferred ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'
      )}
    >
      {/* 헤더 (Header) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {schedule.label}
          </span>
          {isDeferred && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
              <AlertTriangle className="h-3 w-3" />
              후불
            </span>
          )}
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 금액 & 시점 & 예정일 (Amount & Timing & Due Date) */}
      <div className="space-y-3">
        {/* 1행: 금액 (전체 폭) - custom 프리셋일 때만 수정 가능 */}
        {isCustomPreset ? (
          <AmountInput
            label="금액"
            value={schedule.amount}
            onChange={(amount) => onUpdate({ amount })}
            size="sm"
            percentageButtons={[100, 50, 30]}
            totalAmount={totalOrderAmount}
          />
        ) : (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">금액</label>
            <div className="h-9 flex items-center px-3 rounded-xl bg-gray-100 text-sm text-gray-700">
              {formatAmount(schedule.amount)}원
            </div>
          </div>
        )}

        {/* 2행: 결제 시점 + 결제 예정일 (2열 그리드) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 결제 시점 - custom 프리셋일 때만 수정 가능 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">결제 시점</label>
            {isCustomPreset ? (
              <select
                value={schedule.timing}
                onChange={(e) =>
                  onUpdate({ timing: e.target.value as PaymentTiming })
                }
                className={cn(
                  'w-full h-9 rounded-xl border px-3 text-sm transition-colors',
                  'focus:border-[#1a2867] focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20',
                  'border-gray-200'
                )}
              >
                {PAYMENT_TIMINGS.map((timing) => (
                  <option key={timing.value} value={timing.value}>
                    {timing.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="h-9 flex items-center px-3 rounded-xl bg-gray-100 text-sm text-gray-700">
                {PAYMENT_TIMINGS.find((t) => t.value === schedule.timing)?.label}
              </div>
            )}
          </div>

          {/* 🆕 결제 예정일은 Step 3 (MethodStep)에서 입력 */}
          {/* Due date input moved to Step 3 (MethodStep) */}
        </div>
      </div>
    </div>
  );
}

export default ScheduleStep;
