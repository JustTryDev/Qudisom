// Step 2: 결제 주체 컴포넌트 (Payor Step Component)

import React, { useCallback, useMemo } from 'react';
import { Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PayorInfo, PaymentSchedule, SavedPayor } from '../../types';
import { EMPTY_PAYOR_INFO } from '../../utils/constants';
import { PayorInfoForm, PayorInfoSummary, validatePayorInfo } from '../payor/PayorInfoForm';
import { PayorTypeBadge } from '../payor/PayorTypeTabs';
import { StepCard, StepCardActions, StepSummaryGrid } from './StepCard';

interface PayorStepProps {
  payorMode: 'single' | 'per-schedule';
  singlePayor?: PayorInfo;
  schedules: PaymentSchedule[];
  savedPayors: SavedPayor[];
  onPayorModeChange: (mode: 'single' | 'per-schedule') => void;
  onSinglePayorChange: (payor: PayorInfo) => void;
  onSchedulePayorChange: (scheduleId: string, payor: PayorInfo) => void;
  savePayor: boolean;
  onSavePayorChange: (save: boolean) => void;
  onComplete: () => void;
  onPrev: () => void;
  onEdit?: () => void;
  isActive: boolean;
  isCompleted: boolean;
  className?: string;
}

export function PayorStep({
  payorMode,
  singlePayor,
  schedules,
  savedPayors,
  onPayorModeChange,
  onSinglePayorChange,
  onSchedulePayorChange,
  savePayor,
  onSavePayorChange,
  onComplete,
  onPrev,
  onEdit,
  isActive,
  isCompleted,
  className,
}: PayorStepProps) {
  const [activeTab, setActiveTab] = React.useState<string>(schedules[0]?.id || '');

  // 다중 결제 주체 여부 (Has multiple schedules)
  const hasMultipleSchedules = schedules.length > 1;

  // 검증 (Validation)
  const validationErrors = useMemo(() => {
    if (payorMode === 'single' && singlePayor) {
      return validatePayorInfo(singlePayor);
    }

    // 일정별 검증 (Per-schedule validation)
    const errors: Record<string, ReturnType<typeof validatePayorInfo>> = {};
    for (const schedule of schedules) {
      if (schedule.payor) {
        const scheduleErrors = validatePayorInfo(schedule.payor);
        if (Object.keys(scheduleErrors).length > 0) {
          errors[schedule.id] = scheduleErrors;
        }
      } else {
        errors[schedule.id] = { name: '결제자 정보를 입력해주세요' };
      }
    }
    return errors;
  }, [payorMode, singlePayor, schedules]);

  // 완료 가능 여부 (Can complete check)
  const canComplete = useMemo(() => {
    if (payorMode === 'single') {
      return singlePayor && Object.keys(validatePayorInfo(singlePayor)).length === 0;
    }
    return schedules.every(
      (s) => s.payor && Object.keys(validatePayorInfo(s.payor)).length === 0
    );
  }, [payorMode, singlePayor, schedules]);

  // 결제자 모드 변경 핸들러 (Payor mode change handler)
  const handleModeChange = useCallback(
    (mode: 'single' | 'per-schedule') => {
      onPayorModeChange(mode);
      if (mode === 'per-schedule' && schedules.length > 0) {
        setActiveTab(schedules[0].id);
      }
    },
    [onPayorModeChange, schedules]
  );

  // 요약 렌더링 (Summary rendering)
  const renderSummary = () => {
    if (payorMode === 'single' && singlePayor) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <PayorTypeBadge type={singlePayor.type} />
            <span className="text-sm font-medium text-gray-900">
              {singlePayor.type === 'company'
                ? singlePayor.company
                : singlePayor.name}
            </span>
          </div>
          <p className="text-sm text-gray-500">{singlePayor.email}</p>
        </div>
      );
    }

    return (
      <StepSummaryGrid columns={1}>
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
          >
            <span className="text-sm text-gray-600">{schedule.label}</span>
            {schedule.payor && (
              <div className="flex items-center gap-2">
                <PayorTypeBadge type={schedule.payor.type} />
                <span className="text-sm font-medium text-gray-900">
                  {schedule.payor.type === 'company'
                    ? schedule.payor.company
                    : schedule.payor.name}
                </span>
              </div>
            )}
          </div>
        ))}
      </StepSummaryGrid>
    );
  };

  return (
    <StepCard
      step={2}
      status={{ step: 2, isCompleted, isActive, canEdit: isCompleted }}
      summary={isCompleted ? renderSummary() : undefined}
      onEdit={onEdit}
      className={className}
    >
      <div className="space-y-6">
        {/* 결제자 모드 선택 (Payor Mode Selection) - 다중 일정일 때만 */}
        {hasMultipleSchedules && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              결제자 설정
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleModeChange('single')}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-4 transition-all',
                  payorMode === 'single'
                    ? 'border-[#fab803] bg-[#fab803]/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div
                  className={cn(
                    'rounded-full p-2',
                    payorMode === 'single' ? 'bg-[#fab803]/20' : 'bg-gray-100'
                  )}
                >
                  <User
                    className={cn(
                      'h-5 w-5',
                      payorMode === 'single' ? 'text-[#fab803]' : 'text-gray-500'
                    )}
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    동일한 결제자
                  </p>
                  <p className="text-xs text-gray-500">
                    모든 결제를 한 분이 진행
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('per-schedule')}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-4 transition-all',
                  payorMode === 'per-schedule'
                    ? 'border-[#fab803] bg-[#fab803]/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div
                  className={cn(
                    'rounded-full p-2',
                    payorMode === 'per-schedule'
                      ? 'bg-[#fab803]/20'
                      : 'bg-gray-100'
                  )}
                >
                  <Users
                    className={cn(
                      'h-5 w-5',
                      payorMode === 'per-schedule'
                        ? 'text-[#fab803]'
                        : 'text-gray-500'
                    )}
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    일정별 다른 결제자
                  </p>
                  <p className="text-xs text-gray-500">
                    결제 일정마다 다른 분이 진행
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 단일 결제자 폼 (Single Payor Form) */}
        {payorMode === 'single' && (
          <PayorInfoForm
            value={singlePayor || EMPTY_PAYOR_INFO}
            onChange={onSinglePayorChange}
            savedPayors={savedPayors}
            showSavedPayors
            showSaveCheckbox
            savePayor={savePayor}
            onSavePayorChange={onSavePayorChange}
          />
        )}

        {/* 일정별 결제자 폼 (Per-Schedule Payor Forms) */}
        {payorMode === 'per-schedule' && hasMultipleSchedules && (
          <div className="space-y-4">
            {/* 탭 (Tabs) */}
            <div className="flex border-b border-gray-200">
              {schedules.map((schedule) => (
                <button
                  key={schedule.id}
                  onClick={() => setActiveTab(schedule.id)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                    activeTab === schedule.id
                      ? 'border-[#fab803] text-[#fab803]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {schedule.label}
                </button>
              ))}
            </div>

            {/* 활성 탭 폼 (Active Tab Form) */}
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className={cn(activeTab === schedule.id ? 'block' : 'hidden')}
              >
                <PayorInfoForm
                  value={schedule.payor || EMPTY_PAYOR_INFO}
                  onChange={(payor) => onSchedulePayorChange(schedule.id, payor)}
                  savedPayors={savedPayors}
                  showSavedPayors
                  showSaveCheckbox={false}
                />
              </div>
            ))}

            {/* 정보 저장 체크박스 (Save Info Checkbox) */}
            <label className="flex items-center gap-3 cursor-pointer pt-4 border-t border-gray-100">
              <input
                type="checkbox"
                checked={savePayor}
                onChange={(e) => onSavePayorChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#fab803] focus:ring-[#fab803]"
              />
              <span className="text-sm text-gray-700">
                다음 주문을 위해 결제자 정보 저장하기
              </span>
            </label>
          </div>
        )}

        {/* 액션 버튼 (Action Buttons) */}
        <StepCardActions
          onPrev={onPrev}
          onNext={onComplete}
          prevLabel="이전"
          nextLabel="다음 단계"
          nextDisabled={!canComplete}
        />
      </div>
    </StepCard>
  );
}

export default PayorStep;
