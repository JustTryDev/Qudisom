// Step 2: 결제 주체 컴포넌트 (Payor Step Component)
// 간소화 버전: 결제자 기본 정보만 수집, 사업자 정보는 MethodStep에서 수집

import React, { useCallback, useMemo, useEffect } from 'react';
import { Users, User, Plus, X, AlertCircle, UserCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PayorInfo, PayorMode, PayorSource, SplitPayor, PaymentSchedule, SavedPayor } from '../../types';
import { EMPTY_PAYOR_INFO, getTodayDateString } from '../../utils/constants';
import { PayorInfoForm, PayorInfoSummary, validatePayorInfo } from '../payor/PayorInfoForm';
import { PayorTypeBadge } from '../payor/PayorTypeTabs';
import { AmountInput, formatAmount } from '../shared/AmountInput';
import { StepCard, StepCardActions, StepSummaryGrid } from './StepCard';

// 고객 정보 인터페이스 (Customer Info Interface)
// UnifiedPayment에서 전달받아 "내가 직접 결제" 선택 시 자동 입력에 사용
export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  company?: string;
}

interface PayorStepProps {
  payorMode: PayorMode;
  singlePayor?: PayorInfo;
  splitPayors: SplitPayor[]; // 금액 분할 결제자 목록 (Split amount payors)
  schedules: PaymentSchedule[];
  totalOrderAmount: number; // 총 주문 금액 (Total order amount)
  savedPayors: SavedPayor[];
  customerInfo?: CustomerInfo; // 고객 정보 (Customer info for auto-fill)
  onPayorModeChange: (mode: PayorMode) => void;
  onSinglePayorChange: (payor: PayorInfo) => void;
  onSchedulePayorChange: (scheduleId: string, payor: PayorInfo) => void;
  onAddSplitPayor: (splitPayor: SplitPayor) => void;
  onUpdateSplitPayor: (id: string, data: Partial<SplitPayor>) => void;
  onRemoveSplitPayor: (id: string) => void;
  savePayor: boolean;
  onSavePayorChange: (save: boolean) => void;
  onComplete: () => void;
  onPrev: () => void;
  onEdit?: () => void;
  isActive: boolean;
  isCompleted: boolean;
  testMode?: boolean; // 테스트 모드: 검증 스킵 가능 (Test mode: can skip validation)
  className?: string;
}

export function PayorStep({
  payorMode,
  singlePayor,
  splitPayors,
  schedules,
  totalOrderAmount,
  savedPayors,
  customerInfo,
  onPayorModeChange,
  onSinglePayorChange,
  onSchedulePayorChange,
  onAddSplitPayor,
  onUpdateSplitPayor,
  onRemoveSplitPayor,
  savePayor,
  onSavePayorChange,
  onComplete,
  onPrev,
  onEdit,
  isActive,
  isCompleted,
  testMode = false,
  className,
}: PayorStepProps) {
  const [activeTab, setActiveTab] = React.useState<string>(schedules[0]?.id || '');
  const [activeSplitTab, setActiveSplitTab] = React.useState<string>(splitPayors[0]?.id || '');

  // 결제 주체 출처 (내가 직접 / 다른 사람) (Payor source: self or other)
  const payorSource = singlePayor?.source || 'other';

  // 고객 정보로 결제자 자동 생성 (Create payor from customer info)
  const createPayorFromCustomer = useCallback((): PayorInfo => {
    if (!customerInfo) {
      return { ...EMPTY_PAYOR_INFO, source: 'self' };
    }
    return {
      source: 'self',
      type: customerInfo.company ? 'company' : 'individual',
      name: customerInfo.name,
      company: customerInfo.company || '',
      phone: customerInfo.phone,
      email: customerInfo.email,
    };
  }, [customerInfo]);

  // 결제 주체 출처 변경 핸들러 (Payor source change handler)
  const handlePayorSourceChange = useCallback(
    (source: PayorSource) => {
      if (source === 'self') {
        // 본인 선택: 고객 정보 자동 입력 (Self: auto-fill with customer info)
        onSinglePayorChange(createPayorFromCustomer());
      } else {
        // 다른 사람 선택: 빈 폼으로 (Other: empty form)
        onSinglePayorChange({
          ...EMPTY_PAYOR_INFO,
          source: 'other',
        });
      }
    },
    [createPayorFromCustomer, onSinglePayorChange]
  );

  // 다중 결제 주체 여부 (Has multiple schedules)
  const hasMultipleSchedules = schedules.length > 1;

  // 분할 결제자 총 금액 계산 (Calculate total split payor amount)
  const splitPayorsTotalAmount = useMemo(() => {
    return splitPayors.reduce((sum, sp) => sum + sp.amount, 0);
  }, [splitPayors]);

  // 분할 금액 일치 여부 (Check if split amounts match total)
  const isSplitAmountValid = splitPayorsTotalAmount === totalOrderAmount;

  // 검증 (Validation)
  const validationErrors = useMemo(() => {
    if (payorMode === 'single' && singlePayor) {
      return validatePayorInfo(singlePayor);
    }

    if (payorMode === 'split-amount') {
      // 분할 결제자 검증 (Split payor validation)
      const errors: Record<string, ReturnType<typeof validatePayorInfo>> = {};
      for (const splitPayor of splitPayors) {
        const splitErrors = validatePayorInfo(splitPayor.payor);
        if (Object.keys(splitErrors).length > 0) {
          errors[splitPayor.id] = splitErrors;
        }
      }
      return errors;
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
  }, [payorMode, singlePayor, splitPayors, schedules]);

  // 완료 가능 여부 (Can complete check)
  const canComplete = useMemo(() => {
    if (payorMode === 'single') {
      return singlePayor && Object.keys(validatePayorInfo(singlePayor)).length === 0;
    }

    if (payorMode === 'split-amount') {
      // 분할 결제자: 최소 1명 이상, 금액 합계 일치, 모든 결제자 정보 유효
      return (
        splitPayors.length >= 1 &&
        isSplitAmountValid &&
        splitPayors.every(
          (sp) => Object.keys(validatePayorInfo(sp.payor)).length === 0
        )
      );
    }

    // 🆕 deferred 모드: 메모는 선택사항이므로 항상 진행 가능
    if (payorMode === 'deferred') {
      return true;
    }

    // per-schedule 모드
    return schedules.every(
      (s) => s.payor && Object.keys(validatePayorInfo(s.payor)).length === 0
    );
  }, [payorMode, singlePayor, splitPayors, isSplitAmountValid, schedules]);

  // 결제자 모드 변경 핸들러 (Payor mode change handler)
  const handleModeChange = useCallback(
    (mode: PayorMode) => {
      onPayorModeChange(mode);
      if (mode === 'per-schedule' && schedules.length > 0) {
        setActiveTab(schedules[0].id);
      }
      // 분할 결제 모드로 전환 시 첫 번째 결제자가 없으면 추가 (Add first split payor if empty)
      if (mode === 'split-amount' && splitPayors.length === 0) {
        const newSplitPayor: SplitPayor = {
          id: `split-${Date.now()}`,
          payor: { ...EMPTY_PAYOR_INFO },
          amount: totalOrderAmount,
          methods: [], // 결제 수단은 MethodStep에서 설정 (Methods set in MethodStep)
          dueDate: getTodayDateString(), // 🆕 기본 결제 예정일
        };
        onAddSplitPayor(newSplitPayor);
        setActiveSplitTab(newSplitPayor.id);
      } else if (mode === 'split-amount' && splitPayors.length > 0) {
        setActiveSplitTab(splitPayors[0].id);
      }
    },
    [onPayorModeChange, schedules, splitPayors, totalOrderAmount, onAddSplitPayor]
  );

  // 분할 결제자 추가 핸들러 (Add split payor handler)
  const handleAddSplitPayor = useCallback(() => {
    const remainingAmount = Math.max(0, totalOrderAmount - splitPayorsTotalAmount);
    const newSplitPayor: SplitPayor = {
      id: `split-${Date.now()}`,
      payor: { ...EMPTY_PAYOR_INFO },
      amount: remainingAmount,
      methods: [], // 결제 수단은 MethodStep에서 설정 (Methods set in MethodStep)
      dueDate: getTodayDateString(), // 🆕 기본 결제 예정일
    };
    onAddSplitPayor(newSplitPayor);
    setActiveSplitTab(newSplitPayor.id);
  }, [totalOrderAmount, splitPayorsTotalAmount, onAddSplitPayor]);

  // 분할 결제자 삭제 핸들러 (Remove split payor handler)
  const handleRemoveSplitPayor = useCallback(
    (id: string) => {
      onRemoveSplitPayor(id);
      // 삭제 후 첫 번째 탭으로 이동 (Switch to first tab after removal)
      const remainingPayors = splitPayors.filter((sp) => sp.id !== id);
      if (remainingPayors.length > 0) {
        setActiveSplitTab(remainingPayors[0].id);
      }
    },
    [onRemoveSplitPayor, splitPayors]
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

    // 분할 결제 요약 (Split payment summary)
    if (payorMode === 'split-amount') {
      return (
        <StepSummaryGrid columns={1}>
          {splitPayors.map((sp, index) => (
            <div
              key={sp.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-2">
                <PayorTypeBadge type={sp.payor.type} />
                <span className="text-sm font-medium text-gray-900">
                  {sp.payor.type === 'company'
                    ? sp.payor.company || `결제자 ${index + 1}`
                    : sp.payor.name || `결제자 ${index + 1}`}
                </span>
              </div>
              <span className="text-sm font-semibold text-[#1a2867]">
                {formatAmount(sp.amount)}원
              </span>
            </div>
          ))}
        </StepSummaryGrid>
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
        {/* 결제 주체 출처 선택 (Payor Source Selection) - 본인 or 다른 사람 */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            결제 주체
          </label>
          <div className="grid grid-cols-3 gap-3">
            {/* 단일 결제 (Single Payor) */}
            <button
              type="button"
              onClick={() => {
                handleModeChange('single');
                handlePayorSourceChange('self');
              }}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-4 transition-all',
                payorMode === 'single'
                  ? 'border-[#1a2867] bg-[#1a2867]/5'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div
                className={cn(
                  'rounded-full p-2',
                  payorMode === 'single'
                    ? 'bg-[#1a2867]/20'
                    : 'bg-gray-100'
                )}
              >
                <User
                  className={cn(
                    'h-5 w-5',
                    payorMode === 'single'
                      ? 'text-[#1a2867]'
                      : 'text-gray-500'
                  )}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  단일 결제
                </p>
                <p className="text-xs text-gray-500">
                  결제 주체가 하나입니다
                </p>
              </div>
            </button>

            {/* 멀티 결제 (Multiple Payors) - 분할 일정(2개 이상)일 때 비활성화 */}
            <button
              type="button"
              onClick={() => {
                handleModeChange('split-amount');
              }}
              disabled={schedules.length >= 2}
              title={schedules.length >= 2 ? '분할 결제 일정에서는 멀티 결제를 사용할 수 없습니다' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-4 transition-all',
                payorMode === 'split-amount'
                  ? 'border-[#1a2867] bg-[#1a2867]/5'
                  : 'border-gray-200 hover:border-gray-300',
                schedules.length >= 2 && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'rounded-full p-2',
                  payorMode === 'split-amount'
                    ? 'bg-[#1a2867]/20'
                    : 'bg-gray-100'
                )}
              >
                <Users
                  className={cn(
                    'h-5 w-5',
                    payorMode === 'split-amount'
                      ? 'text-[#1a2867]'
                      : 'text-gray-500'
                  )}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  멀티 결제
                </p>
                <p className="text-xs text-gray-500">
                  {schedules.length >= 2
                    ? '분할 일정에서는 사용 불가'
                    : '결제 주체가 여러명입니다'}
                </p>
              </div>
            </button>

            {/* 나중에 결정 (Deferred) */}
            <button
              type="button"
              onClick={() => {
                handleModeChange('deferred');
              }}
              className={cn(
                'flex items-center gap-3 rounded-xl border p-4 transition-all',
                payorMode === 'deferred'
                  ? 'border-[#1a2867] bg-[#1a2867]/5'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div
                className={cn(
                  'rounded-full p-2',
                  payorMode === 'deferred'
                    ? 'bg-[#1a2867]/20'
                    : 'bg-gray-100'
                )}
              >
                <Clock
                  className={cn(
                    'h-5 w-5',
                    payorMode === 'deferred'
                      ? 'text-[#1a2867]'
                      : 'text-gray-500'
                  )}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  나중에 결정
                </p>
                <p className="text-xs text-gray-500">
                  결제자 정보를 나중에 입력합니다
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 결제자 수 섹션 제거 - 단일/멀티로 단순화 */}
        {/* (Removed: 한 명/여러 명/일정별 다름 선택 - simplified to 단일/멀티) */}
        {false && (
          <div className="space-y-3 hidden">
            <label className="text-sm font-medium text-gray-700">
              결제자 수 (제거됨)
            </label>
            <div className={cn('grid gap-3', hasMultipleSchedules ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2')}>
              {/* 한 명이 전액 결제 (Single payor) */}
              <button
                type="button"
                onClick={() => handleModeChange('single')}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 transition-all',
                  payorMode === 'single'
                    ? 'border-[#1a2867] bg-[#1a2867]/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <User
                  className={cn(
                    'h-4 w-4',
                    payorMode === 'single' ? 'text-[#1a2867]' : 'text-gray-500'
                  )}
                />
                <span className="text-sm font-medium text-gray-900">
                  한 명
                </span>
              </button>

              {/* 여러 명이 나눠서 결제 (Split amount) */}
              <button
                type="button"
                onClick={() => handleModeChange('split-amount')}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 transition-all',
                  payorMode === 'split-amount'
                    ? 'border-[#1a2867] bg-[#1a2867]/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Users
                  className={cn(
                    'h-4 w-4',
                    payorMode === 'split-amount' ? 'text-[#1a2867]' : 'text-gray-500'
                  )}
                />
                <span className="text-sm font-medium text-gray-900">
                  여러 명 (금액 분할)
                </span>
              </button>

              {/* 일정별 다른 결제자 (Per-schedule) - 다중 일정일 때만 표시 */}
              {hasMultipleSchedules && (
                <button
                  type="button"
                  onClick={() => handleModeChange('per-schedule')}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border p-3 transition-all',
                    payorMode === 'per-schedule'
                      ? 'border-[#1a2867] bg-[#1a2867]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <Users
                    className={cn(
                      'h-4 w-4',
                      payorMode === 'per-schedule' ? 'text-[#1a2867]' : 'text-gray-500'
                    )}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    일정별 다름
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 단일 결제자 폼 (Single Payor Form) */}
        {payorMode === 'single' && (
          <div className="space-y-4">
            {/* 본인 정보 표시 or 직접 입력 폼 (Show customer info or input form) */}
            {payorSource === 'self' ? (
              <>
                {/* 본인 정보 요약 표시 (Display customer info summary) */}
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-[#1a2867]" />
                    <span className="text-sm font-medium text-gray-900">결제자 정보</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">이름</span>
                      <span className="text-gray-900">{singlePayor?.name || customerInfo?.name || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">연락처</span>
                      <span className="text-gray-900">{singlePayor?.phone || customerInfo?.phone || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">이메일</span>
                      <span className="text-gray-900">{singlePayor?.email || customerInfo?.email || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* 실제 결제자가 달라요 버튼 (Different payor button) */}
                <button
                  type="button"
                  onClick={() => handlePayorSourceChange('other')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:border-[#1a2867] hover:text-[#1a2867] transition-colors"
                >
                  <AlertCircle className="h-4 w-4" />
                  실제 결제자가 달라요
                </button>
              </>
            ) : (
              <>
                {/* 직접 입력 폼 (Input form) */}
                <PayorInfoForm
                  value={singlePayor || EMPTY_PAYOR_INFO}
                  onChange={onSinglePayorChange}
                  savedPayors={savedPayors}
                  showSavedPayors
                  showSaveCheckbox
                  savePayor={savePayor}
                  onSavePayorChange={onSavePayorChange}
                />

                {/* 본인 정보로 되돌리기 버튼 (Reset to customer info button) */}
                {customerInfo && (
                  <button
                    type="button"
                    onClick={() => handlePayorSourceChange('self')}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:border-[#1a2867] hover:text-[#1a2867] transition-colors"
                  >
                    <UserCheck className="h-4 w-4" />
                    본인 정보로 되돌리기
                  </button>
                )}
              </>
            )}
          </div>
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
                      ? 'border-[#1a2867] text-[#1a2867]'
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

        {/* 분할 결제자 폼 (Split Amount Payor Forms) */}
        {payorMode === 'split-amount' && (
          <div className="space-y-4">
            {/* 결제자 탭 - 단일/멀티 일정 모두 표시 (Tabs for all schedules) */}
            <div className="flex flex-wrap border-b border-gray-200 gap-1">
              {splitPayors.map((sp, index) => (
                <button
                  key={sp.id}
                  onClick={() => setActiveSplitTab(sp.id)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2',
                    activeSplitTab === sp.id
                      ? 'border-[#1a2867] text-[#1a2867]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  결제자 {index + 1}
                  {splitPayors.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSplitPayor(sp.id);
                      }}
                      className="p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </button>
              ))}
              {/* 결제자 추가 버튼 (Add Payor Button) */}
              <button
                onClick={handleAddSplitPayor}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-[#fab803] border-b-2 border-transparent flex items-center gap-1 transition-colors"
              >
                <Plus className="h-4 w-4" />
                추가
              </button>
            </div>

            {/* 활성 탭 폼 (Active Tab Form) */}
            {splitPayors.map((sp) => (
              <div
                key={sp.id}
                className={cn(activeSplitTab === sp.id ? 'block' : 'hidden', 'space-y-4')}
              >
                {/* 금액 입력 (Amount Input) */}
                <AmountInput
                  label="결제 금액"
                  value={sp.amount}
                  onChange={(amount) => onUpdateSplitPayor(sp.id, { amount })}
                  percentageButtons={[100, 50, 30, 20, 10]}
                  totalAmount={totalOrderAmount}
                  size="lg"
                />

                {/* Inline 피드백 (Inline Feedback) */}
                {splitPayors.length > 1 && (
                  <div className="text-xs text-gray-500 mt-1">
                    현재 합계: {formatAmount(splitPayorsTotalAmount)}원 /
                    목표: {formatAmount(totalOrderAmount)}원
                    {splitPayorsTotalAmount !== totalOrderAmount && (
                      <span className={cn(
                        "ml-2 font-medium",
                        splitPayorsTotalAmount > totalOrderAmount ? "text-red-500" : "text-amber-500"
                      )}>
                        ({splitPayorsTotalAmount > totalOrderAmount ? '+' : ''}{formatAmount(Math.abs(splitPayorsTotalAmount - totalOrderAmount))}원)
                      </span>
                    )}
                  </div>
                )}

                {/* 결제자 정보 폼 (Payor Info Form) */}
                <PayorInfoForm
                  value={sp.payor}
                  onChange={(payor) => onUpdateSplitPayor(sp.id, { payor })}
                  savedPayors={savedPayors}
                  showSavedPayors
                  showSaveCheckbox={false}
                />
              </div>
            ))}

            {/* 금액 합계 검증 (Amount Total Validation) */}
            <div className={cn(
              'rounded-xl p-4 flex items-center justify-between',
              isSplitAmountValid
                ? 'bg-green-50 border border-green-100'
                : 'bg-red-50 border border-red-100'
            )}>
              <div className="flex items-center gap-2">
                {!isSplitAmountValid && <AlertCircle className="h-4 w-4 text-red-500" />}
                <span className="text-sm text-gray-700">결제 금액 합계</span>
              </div>
              <div className="text-right">
                <span className={cn(
                  'text-lg font-bold',
                  isSplitAmountValid ? 'text-green-600' : 'text-red-500'
                )}>
                  {formatAmount(splitPayorsTotalAmount)}원
                </span>
                {!isSplitAmountValid && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {splitPayorsTotalAmount > totalOrderAmount
                      ? `${formatAmount(splitPayorsTotalAmount - totalOrderAmount)}원 초과`
                      : `${formatAmount(totalOrderAmount - splitPayorsTotalAmount)}원 부족`}
                  </p>
                )}
              </div>
            </div>

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

        {/* 나중에 결정 모드 (Deferred Mode) */}
        {payorMode === 'deferred' && (
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">
                결제자 정보 입력 보류됨
              </p>
            </div>
            <textarea
              placeholder="예상 결제자 수, 대략적인 금액 등 메모를 남겨주세요..."
              className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              rows={3}
            />
            <p className="text-xs text-blue-700">
              주문 생성 후 대시보드에서 언제든지 결제자 정보를 추가하실 수 있습니다.
            </p>
          </div>
        )}

        {/* 액션 버튼 (Action Buttons) */}
        <StepCardActions
          onPrev={onPrev}
          onNext={onComplete}
          onSkip={onComplete}
          prevLabel="이전"
          nextLabel="다음 단계"
          nextDisabled={!canComplete}
          testMode={testMode}
        />
      </div>
    </StepCard>
  );
}

export default PayorStep;
