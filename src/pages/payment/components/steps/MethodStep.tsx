// Step 3: 결제 수단 컴포넌트 (Payment Method Step Component)
// 분할 결제자 모드 지원: 각 결제자별로 독립적인 결제 수단 선택 가능

import React, { useCallback, useMemo } from 'react';
import { User, Building2, Plus, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  PaymentSchedule,
  PaymentMethod,
  PaymentMethodType,
  PaymentMethodDetails,
  PayorMode,
  SplitPayor,
  ProofDocument,
  KeyinData,
  BankData,
  FileUploadData,
  OtherData,
} from '../../types';
import {
  createDefaultPaymentMethod,
  PAYMENT_METHOD_MAP,
  PAYMENT_TIMINGS,
  PAYMENT_HOURS,
  getTodayDateString,
} from '../../utils/constants';
import { formatAmount, AmountComparison } from '../shared/AmountInput';
import { MethodCard, AddMethodButton, MethodSummaryCard } from '../method/MethodCard';
import { MethodBadge } from '../method/MethodSelector';
import { TossSection } from '../method/TossSection';
import { KeyinSection } from '../method/KeyinSection';
import { BankSection } from '../method/BankSection';
import { NarabillSection } from '../method/NarabillSection';
import { ContractSection } from '../method/ContractSection';
import { OtherSection } from '../method/OtherSection';
import { ProofSelector } from '../proof/ProofSelector';
import { TaxInvoiceForm } from '../proof/TaxInvoiceForm';
import { CashReceiptForm } from '../proof/CashReceiptForm';
import { ProofValidationAlert } from '../proof/ProofValidationAlert';
import { StepCard, StepCardActions, StepSummaryGrid } from './StepCard';

interface MethodStepProps {
  schedules: PaymentSchedule[];
  // 분할 결제자 지원 (Split Payor Support)
  payorMode?: PayorMode;
  splitPayors?: SplitPayor[];
  onAddMethod: (scheduleId: string, method: PaymentMethod) => void;
  onUpdateMethod: (
    scheduleId: string,
    methodId: string,
    data: Partial<PaymentMethod>
  ) => void;
  onRemoveMethod: (scheduleId: string, methodId: string) => void;
  // 🆕 일정 업데이트 (Schedule Update) - 결제 예정일 변경용
  onUpdateSchedule?: (scheduleId: string, data: Partial<PaymentSchedule>) => void;
  // 분할 결제자 결제 수단 관리 (Split Payor Method Management)
  onAddSplitPayorMethod?: (splitPayorId: string, method: PaymentMethod) => void;
  onUpdateSplitPayorMethod?: (
    splitPayorId: string,
    methodId: string,
    data: Partial<PaymentMethod>
  ) => void;
  onRemoveSplitPayorMethod?: (splitPayorId: string, methodId: string) => void;
  // 🆕 분할 결제자 업데이트 (Split Payor Update) - 결제 예정일 변경용
  onUpdateSplitPayor?: (splitPayorId: string, data: Partial<SplitPayor>) => void;
  onSetProof: (
    scheduleId: string,
    methodId: string,
    proof: ProofDocument
  ) => void;
  onComplete: () => void;
  onPrev: () => void;
  onEdit?: () => void;
  isActive: boolean;
  isCompleted: boolean;
  testMode?: boolean; // 테스트 모드: 검증 스킵 가능 (Test mode: can skip validation)
  className?: string;
}

export function MethodStep({
  schedules,
  payorMode = 'single',
  splitPayors = [],
  onAddMethod,
  onUpdateMethod,
  onRemoveMethod,
  onUpdateSchedule,
  onAddSplitPayorMethod,
  onUpdateSplitPayorMethod,
  onRemoveSplitPayorMethod,
  onUpdateSplitPayor,
  onSetProof,
  onComplete,
  onPrev,
  onEdit,
  isActive,
  isCompleted,
  testMode = false,
  className,
}: MethodStepProps) {
  // 분할 결제자 모드 여부 (Is split payor mode)
  const isSplitPayorMode = payorMode === 'split-amount' && splitPayors.length > 0;

  const [activeScheduleId, setActiveScheduleId] = React.useState<string>(
    schedules[0]?.id || ''
  );
  const [activeSplitPayorId, setActiveSplitPayorId] = React.useState<string>(
    splitPayors[0]?.id || ''
  );

  // 현재 활성 일정 (Current active schedule)
  const activeSchedule = schedules.find((s) => s.id === activeScheduleId);
  // 현재 활성 분할 결제자 (Current active split payor)
  const activeSplitPayor = splitPayors.find((sp) => sp.id === activeSplitPayorId);

  // 일정별 금액 검증 (Per-schedule amount validation)
  const scheduleValidations = useMemo(() => {
    return schedules.map((schedule) => {
      const methodTotal = schedule.methods.reduce((sum, m) => sum + m.amount, 0);
      const isValid = methodTotal === schedule.amount;
      const diff = methodTotal - schedule.amount;
      return { scheduleId: schedule.id, methodTotal, isValid, diff };
    });
  }, [schedules]);

  // 분할 결제자별 금액 검증 (Per-split-payor amount validation)
  const splitPayorValidations = useMemo(() => {
    return splitPayors.map((sp) => {
      const methodTotal = sp.methods.reduce((sum, m) => sum + m.amount, 0);
      const isValid = methodTotal === sp.amount;
      const diff = methodTotal - sp.amount;
      return { splitPayorId: sp.id, methodTotal, isValid, diff };
    });
  }, [splitPayors]);

  // 전체 검증 (Overall validation)
  const canComplete = isSplitPayorMode
    ? splitPayorValidations.every((v) => v.isValid)
    : scheduleValidations.every((v) => v.isValid);

  // 메서드 추가 핸들러 (Add method handler)
  const handleAddMethod = useCallback(
    (scheduleId: string) => {
      const newMethod = createDefaultPaymentMethod(`method-${Date.now()}`);
      onAddMethod(scheduleId, newMethod);
    },
    [onAddMethod]
  );

  // 분할 결제자 메서드 추가 핸들러 (Add split payor method handler)
  const handleAddSplitPayorMethod = useCallback(
    (splitPayorId: string) => {
      if (!onAddSplitPayorMethod) return;
      const newMethod = createDefaultPaymentMethod(`method-${Date.now()}`);
      onAddSplitPayorMethod(splitPayorId, newMethod);
    },
    [onAddSplitPayorMethod]
  );

  // 메서드 상세 업데이트 핸들러 (Update method details handler)
  const handleUpdateMethodDetails = useCallback(
    (scheduleId: string, methodId: string, details: PaymentMethod['details']) => {
      onUpdateMethod(scheduleId, methodId, { details });
    },
    [onUpdateMethod]
  );

  // 증빙 업데이트 핸들러 (Update proof handler)
  const handleProofChange = useCallback(
    (scheduleId: string, methodId: string, proof: Partial<ProofDocument>) => {
      const method = schedules
        .find((s) => s.id === scheduleId)
        ?.methods.find((m) => m.id === methodId);

      const newProof: ProofDocument = {
        id: method?.proof?.id || `proof-${Date.now()}`,
        type: proof.type || 'none',
        recipientMode: proof.recipientMode || 'same-as-payor',
        preferredIssueDate: proof.preferredIssueDate || false,
        validations: [],
        ...proof,
      };

      onSetProof(scheduleId, methodId, newProof);
    },
    [schedules, onSetProof]
  );

  // 요약 렌더링 (Summary rendering)
  const renderSummary = () => (
    <StepSummaryGrid columns={1}>
      {schedules.map((schedule) => (
        <div key={schedule.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {schedule.label}
            </span>
            <span className="text-sm text-gray-500">
              {formatAmount(schedule.amount)}원
            </span>
          </div>
          <div className="pl-4 space-y-1">
            {schedule.methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between text-sm"
              >
                <MethodBadge type={method.type} />
                <span className="text-gray-900">
                  {formatAmount(method.amount)}원
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </StepSummaryGrid>
  );

  return (
    <StepCard
      step={3}
      status={{ step: 3, isCompleted, isActive, canEdit: isCompleted }}
      summary={isCompleted ? renderSummary() : undefined}
      onEdit={onEdit}
      className={className}
    >
      <div className="space-y-6">
        {/* 분할 결제자 모드 (Split Payor Mode) */}
        {isSplitPayorMode ? (
          <>
            {/* 분할 결제자 탭 (Split Payor Tabs) */}
            {splitPayors.length > 1 && (
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {splitPayors.map((sp) => {
                  const validation = splitPayorValidations.find(
                    (v) => v.splitPayorId === sp.id
                  );
                  const payorLabel = sp.payor.type === 'company'
                    ? sp.payor.company || sp.payor.name
                    : sp.payor.name;
                  return (
                    <button
                      key={sp.id}
                      onClick={() => setActiveSplitPayorId(sp.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                        activeSplitPayorId === sp.id
                          ? 'border-[#1a2867] text-[#1a2867]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        {sp.payor.type === 'company' ? (
                          <Building2 className="h-3.5 w-3.5" />
                        ) : (
                          <User className="h-3.5 w-3.5" />
                        )}
                        {payorLabel || '결제자'}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({formatAmount(sp.amount)}원)
                      </span>
                      {validation && !validation.isValid && (
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 활성 분할 결제자 결제 수단 (Active Split Payor Methods) */}
            {activeSplitPayor && (
              <SplitPayorMethodsSection
                splitPayor={activeSplitPayor}
                validation={splitPayorValidations.find(
                  (v) => v.splitPayorId === activeSplitPayor.id
                )}
                onAddMethod={() => handleAddSplitPayorMethod(activeSplitPayor.id)}
                onUpdateMethod={(methodId, data) =>
                  onUpdateSplitPayorMethod?.(activeSplitPayor.id, methodId, data)
                }
                onRemoveMethod={(methodId) =>
                  onRemoveSplitPayorMethod?.(activeSplitPayor.id, methodId)
                }
                onUpdateSplitPayor={(data) =>
                  onUpdateSplitPayor?.(activeSplitPayor.id, data)
                }
              />
            )}
          </>
        ) : (
          <>
            {/* 일정 탭 (Schedule Tabs) - 다중 일정일 때만 */}
            {/* 피드백 6: 결제 일정 정보를 탭에 표시 */}
            {schedules.length > 1 && (
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {schedules.map((schedule) => {
                  const validation = scheduleValidations.find(
                    (v) => v.scheduleId === schedule.id
                  );
                  // 날짜 포맷팅 (Date formatting)
                  const formatScheduleDate = (dateStr: string) => {
                    const date = new Date(dateStr);
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    return `${month}/${day}`;
                  };
                  // 결제 시점 라벨 (Payment timing label)
                  const timingInfo = PAYMENT_TIMINGS.find(
                    (t) => t.value === schedule.timing
                  );
                  return (
                    <button
                      key={schedule.id}
                      onClick={() => setActiveScheduleId(schedule.id)}
                      className={cn(
                        'flex flex-col items-start gap-0.5 px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                        activeScheduleId === schedule.id
                          ? 'border-[#1a2867] text-[#1a2867]'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {schedule.label}
                        <span className="text-xs text-gray-400 font-normal">
                          ({formatAmount(schedule.amount)}원)
                        </span>
                        {validation && !validation.isValid && (
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                        )}
                      </div>
                      {/* 결제 시점 및 예정일 표시 (Show timing and due date) */}
                      <span className="text-xs text-gray-400 font-normal">
                        {timingInfo?.label}
                        {schedule.dueDate && ` · ${formatScheduleDate(schedule.dueDate)}`}
                        {schedule.dueTime && ` ${schedule.dueTime}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 활성 일정 결제 수단 (Active Schedule Methods) */}
            {activeSchedule && (
              <ScheduleMethodsSection
                schedule={activeSchedule}
                validation={scheduleValidations.find(
                  (v) => v.scheduleId === activeSchedule.id
                )}
                onAddMethod={() => handleAddMethod(activeSchedule.id)}
                onUpdateMethod={(methodId, data) =>
                  onUpdateMethod(activeSchedule.id, methodId, data)
                }
                onRemoveMethod={(methodId) =>
                  onRemoveMethod(activeSchedule.id, methodId)
                }
                onUpdateDetails={(methodId, details) =>
                  handleUpdateMethodDetails(activeSchedule.id, methodId, details)
                }
                onProofChange={(methodId, proof) =>
                  handleProofChange(activeSchedule.id, methodId, proof)
                }
                onUpdateSchedule={onUpdateSchedule}
              />
            )}
          </>
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

// ==================== 일정별 결제 수단 섹션 (Schedule Methods Section) ====================

interface ScheduleMethodsSectionProps {
  schedule: PaymentSchedule;
  validation?: { methodTotal: number; isValid: boolean; diff: number };
  onAddMethod: () => void;
  onUpdateMethod: (methodId: string, data: Partial<PaymentMethod>) => void;
  onRemoveMethod: (methodId: string) => void;
  onUpdateDetails: (methodId: string, details: PaymentMethod['details']) => void;
  onProofChange: (methodId: string, proof: Partial<ProofDocument>) => void;
  // 결제 예정일 업데이트 (Schedule update for due date)
  onUpdateSchedule?: (scheduleId: string, data: Partial<PaymentSchedule>) => void;
}

function ScheduleMethodsSection({
  schedule,
  validation,
  onAddMethod,
  onUpdateMethod,
  onRemoveMethod,
  onUpdateDetails,
  onProofChange,
  onUpdateSchedule,
}: ScheduleMethodsSectionProps) {
  // 활성 결제 수단 탭 상태 (Active method tab state)
  const [activeMethodId, setActiveMethodId] = React.useState<string>(
    schedule.methods[0]?.id || ''
  );

  // 남은 금액 계산 (Calculate remaining amount)
  const remainingAmount = schedule.amount - (validation?.methodTotal || 0);

  // 🆕 첫번째 탭 자동 선택
  React.useEffect(() => {
    if (schedule.methods.length > 0 && !activeMethodId) {
      setActiveMethodId(schedule.methods[0].id);
    }
  }, [schedule.methods, activeMethodId]);

  // 활성 탭이 삭제된 경우 첫 번째 탭으로 변경 (Switch to first tab if active tab is deleted)
  React.useEffect(() => {
    if (!schedule.methods.find((m) => m.id === activeMethodId)) {
      setActiveMethodId(schedule.methods[0]?.id || '');
    }
  }, [schedule.methods, activeMethodId]);

  // 결제 수단 추가 후 새 탭으로 전환 (Switch to new tab after adding method)
  const handleAddMethod = () => {
    onAddMethod();
    // 새 메서드의 ID를 알 수 없으므로, 다음 렌더링에서 자동으로 첫 번째로 설정됨
  };

  // 결제 시점 정보 (Payment timing info)
  const timingInfo = PAYMENT_TIMINGS.find((t) => t.value === schedule.timing);

  // 날짜 포맷팅 (Date formatting)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  return (
    <div className="space-y-4">
      {/* 피드백 6: 결제 일정 안내 배너 (Payment Schedule Info Banner) */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-blue-900">{schedule.label}</span>
              {timingInfo && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {timingInfo.label}
                </span>
              )}
            </div>
            <span className="text-lg font-bold text-blue-900">
              {formatAmount(schedule.amount)}원
            </span>
          </div>
          {/* 🆕 결제 예정일 입력 UI (Due Date Input) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-blue-700">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">결제 예정일</span>
            </div>
            <input
              type="date"
              value={schedule.dueDate || getTodayDateString()}
              onChange={(e) => onUpdateSchedule?.(schedule.id, { dueDate: e.target.value })}
              className="h-7 px-2 text-xs rounded-lg border border-blue-200 bg-white text-blue-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/20"
            />
            {schedule.dueDate === getTodayDateString() && (
              <select
                value={schedule.dueTime || ''}
                onChange={(e) => onUpdateSchedule?.(schedule.id, { dueTime: e.target.value || undefined })}
                className="h-7 px-2 text-xs rounded-lg border border-blue-200 bg-white text-blue-900 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/20"
              >
                <option value="">시간 선택</option>
                {PAYMENT_HOURS.map((hour) => (
                  <option key={hour.value} value={hour.value}>
                    {hour.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* 결제 수단이 없을 때 추가 버튼 표시 (Show add button when no methods) */}
      {schedule.methods.length === 0 ? (
        <AddMethodButton onClick={handleAddMethod} />
      ) : (
        <>
          {/* 결제 수단 탭 바 (Payment Methods Tab Bar) */}
          <div className="flex flex-wrap border-b border-gray-200 gap-1">
            {schedule.methods.map((method, index) => {
              const methodInfo = PAYMENT_METHOD_MAP[method.type];
              return (
                <button
                  key={method.id}
                  onClick={() => setActiveMethodId(method.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors relative group',
                    activeMethodId === method.id
                      ? 'bg-[#1a2867] text-white font-semibold' // 🎨 네이비 배경 + 흰색 폰트
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  )}
                >
                  <span className="text-sm">
                    {methodInfo?.label || '결제수단'} {index + 1}
                  </span>
                  {schedule.methods.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveMethod(method.id);
                      }}
                      className={cn(
                        'p-0.5 rounded transition-colors',
                        activeMethodId === method.id
                          ? 'hover:bg-[#2a3a7f]' // 네이비 탭일 때 더 진한 네이비 호버
                          : 'hover:bg-gray-300'
                      )}
                      title="결제 수단 삭제"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </button>
              );
            })}

            {/* 결제 수단 추가 버튼 (Add Method Button) */}
            <button
              onClick={handleAddMethod}
              className="flex items-center gap-1 px-3 py-2 text-gray-400 hover:text-[#fab803] transition-colors"
              title="결제 수단 추가"
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs">추가</span>
            </button>
          </div>

          {/* 활성 탭 내용 (Active Tab Content) */}
          {schedule.methods.map((method, index) => (
            <div
              key={method.id}
              className={activeMethodId === method.id ? 'block' : 'hidden'}
            >
              <MethodWithDetails
                method={method}
                index={index}
                totalAmount={schedule.amount}
                remainingAmount={remainingAmount}
                onUpdate={(data) => onUpdateMethod(method.id, data)}
                onRemove={() => onRemoveMethod(method.id)}
                onUpdateDetails={(details) => onUpdateDetails(method.id, details)}
                onProofChange={(proof) => onProofChange(method.id, proof)}
                canRemove={schedule.methods.length > 1}
              />
            </div>
          ))}
        </>
      )}

      {/* 금액 비교 (Amount Comparison) */}
      {validation && (
        <AmountComparison
          label="결제 수단 합계"
          current={validation.methodTotal}
          target={schedule.amount}
        />
      )}
    </div>
  );
}

// ==================== 결제 수단 + 상세 (Method With Details) ====================

interface MethodWithDetailsProps {
  method: PaymentMethod;
  index: number;
  totalAmount: number;
  remainingAmount: number;
  onUpdate: (data: Partial<PaymentMethod>) => void;
  onRemove: () => void;
  onUpdateDetails: (details: PaymentMethod['details']) => void;
  onProofChange: (proof: Partial<ProofDocument>) => void;
  canRemove: boolean;
}

function MethodWithDetails({
  method,
  index,
  totalAmount,
  remainingAmount,
  onUpdate,
  onRemove,
  onUpdateDetails,
  onProofChange,
  canRemove,
}: MethodWithDetailsProps) {
  const methodInfo = PAYMENT_METHOD_MAP[method.type];
  const requiresProof = methodInfo?.requiresProof && !method.autoReceipt;

  // 수단별 상세 컴포넌트 렌더링 (Render method-specific component)
  const renderMethodDetails = () => {
    switch (method.type) {
      case 'toss':
        return <TossSection amount={method.amount} />;
      case 'keyin':
        return (
          <KeyinSection
            value={method.details as KeyinData | null}
            onChange={(data) => onUpdateDetails(data)}
            amount={method.amount}
          />
        );
      case 'bank':
        return (
          <BankSection
            value={method.details as BankData | null}
            onChange={(data) => onUpdateDetails(data)}
            amount={method.amount}
          />
        );
      case 'narabill':
        return (
          <NarabillSection
            value={method.details as FileUploadData | null}
            onChange={(data) => onUpdateDetails(data)}
            amount={method.amount}
          />
        );
      case 'contract':
        return (
          <ContractSection
            value={method.details as FileUploadData | null}
            onChange={(data) => onUpdateDetails(data)}
            amount={method.amount}
          />
        );
      case 'other':
        return (
          <OtherSection
            value={method.details as OtherData | null}
            onChange={(data) => onUpdateDetails(data)}
            amount={method.amount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <MethodCard
      method={method}
      index={index}
      totalAmount={totalAmount}
      remainingAmount={remainingAmount}
      onUpdate={onUpdate}
      onRemove={onRemove}
      canRemove={canRemove}
    >
      {/* 🎨 피드백 3, 5: 나라빌/수의계약 - 사업자 정보 먼저, 증빙 나중에 */}
      {(method.type === 'narabill' || method.type === 'contract') ? (
        <>
          {/* 사업자 정보 먼저 입력 (Business Info First) */}
          <div className="pt-4 border-t border-gray-100">{renderMethodDetails()}</div>

          {/* 증빙 서류 나중에 (Proof Document After) */}
          {requiresProof && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <ProofSelector
                value={method.proof?.type || 'none'}
                onChange={(type) => onProofChange({ type })}
                amount={method.amount}
                showLaterOption
              />

              {/* 세금계산서 폼 - 사업자 정보는 이미 입력됨 */}
              {method.proof?.type === 'tax-invoice' && (
                <TaxInvoiceForm
                  value={method.proof}
                  onChange={onProofChange}
                  existingBusinessInfo={
                    method.details
                      ? (method.details as FileUploadData).businessInfo
                      : undefined
                  }
                />
              )}

              {/* 현금영수증 폼 (Cash Receipt Form) */}
              {method.proof?.type === 'cash-receipt' && (
                <CashReceiptForm
                  value={method.proof}
                  onChange={onProofChange}
                />
              )}

              {/* 검증 경고 (Validation Alert) */}
              <ProofValidationAlert method={method} proof={method.proof} />
            </div>
          )}
        </>
      ) : method.type === 'bank' ? (
        <>
          {/* 🎨 피드백 3: 무통장 + 세금계산서 - 증빙 먼저, 입금 안내 나중에 */}
          {/* 증빙 서류 먼저 (Proof Document First) */}
          {requiresProof && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <ProofSelector
                value={method.proof?.type || 'none'}
                onChange={(type) => onProofChange({ type })}
                amount={method.amount}
                showLaterOption
              />

              {/* 세금계산서 폼 (Tax Invoice Form) */}
              {method.proof?.type === 'tax-invoice' && (
                <TaxInvoiceForm
                  value={method.proof}
                  onChange={onProofChange}
                />
              )}

              {/* 현금영수증 폼 (Cash Receipt Form) */}
              {method.proof?.type === 'cash-receipt' && (
                <CashReceiptForm
                  value={method.proof}
                  onChange={onProofChange}
                />
              )}

              {/* 검증 경고 (Validation Alert) */}
              <ProofValidationAlert method={method} proof={method.proof} />
            </div>
          )}

          {/* 입금자명, 입금 안내, 계좌 안내 (세금계산서 폼 아래) */}
          <div className="pt-4 border-t border-gray-100">{renderMethodDetails()}</div>
        </>
      ) : (
        <>
          {/* 다른 결제 수단: 기존 순서 유지 (Other Methods: Keep Original Order) */}
          {/* 수단별 상세 (Method Details) */}
          <div className="pt-4 border-t border-gray-100">{renderMethodDetails()}</div>

          {/* 증빙 서류 (Proof Document) - 필요 시, 기타 결제 제외 */}
          {requiresProof && method.type !== 'other' && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <ProofSelector
                value={method.proof?.type || 'none'}
                onChange={(type) => onProofChange({ type })}
                amount={method.amount}
                showLaterOption
              />

              {/* 세금계산서 폼 (Tax Invoice Form) */}
              {method.proof?.type === 'tax-invoice' && (
                <TaxInvoiceForm
                  value={method.proof}
                  onChange={onProofChange}
                />
              )}

              {/* 현금영수증 폼 (Cash Receipt Form) */}
              {method.proof?.type === 'cash-receipt' && (
                <CashReceiptForm
                  value={method.proof}
                  onChange={onProofChange}
                />
              )}

              {/* 검증 경고 (Validation Alert) */}
              <ProofValidationAlert method={method} proof={method.proof} />
            </div>
          )}
        </>
      )}
    </MethodCard>
  );
}

// ==================== 분할 결제자별 결제 수단 섹션 (Split Payor Methods Section) ====================

interface SplitPayorMethodsSectionProps {
  splitPayor: SplitPayor;
  validation?: { methodTotal: number; isValid: boolean; diff: number };
  onAddMethod: () => void;
  onUpdateMethod: (methodId: string, data: Partial<PaymentMethod>) => void;
  onRemoveMethod: (methodId: string) => void;
  // 🆕 분할 결제자 업데이트 (결제 예정일 변경용)
  onUpdateSplitPayor?: (data: Partial<SplitPayor>) => void;
}

function SplitPayorMethodsSection({
  splitPayor,
  validation,
  onAddMethod,
  onUpdateMethod,
  onRemoveMethod,
  onUpdateSplitPayor,
}: SplitPayorMethodsSectionProps) {
  // 활성 결제 수단 탭 상태 (Active method tab state)
  const [activeMethodId, setActiveMethodId] = React.useState<string>(
    splitPayor.methods[0]?.id || ''
  );

  // 남은 금액 계산 (Calculate remaining amount)
  const remainingAmount = splitPayor.amount - (validation?.methodTotal || 0);
  const payorLabel = splitPayor.payor.type === 'company'
    ? splitPayor.payor.company || splitPayor.payor.name
    : splitPayor.payor.name;

  // 🆕 첫번째 탭 자동 선택
  React.useEffect(() => {
    if (splitPayor.methods.length > 0 && !activeMethodId) {
      setActiveMethodId(splitPayor.methods[0].id);
    }
  }, [splitPayor.methods, activeMethodId]);

  // 활성 탭이 삭제된 경우 첫 번째 탭으로 변경 (Switch to first tab if active tab is deleted)
  React.useEffect(() => {
    if (!splitPayor.methods.find((m) => m.id === activeMethodId)) {
      setActiveMethodId(splitPayor.methods[0]?.id || '');
    }
  }, [splitPayor.methods, activeMethodId]);

  // 결제 수단 추가 후 새 탭으로 전환 (Switch to new tab after adding method)
  const handleAddMethod = () => {
    onAddMethod();
    // 새 메서드의 ID를 알 수 없으므로, 다음 렌더링에서 자동으로 첫 번째로 설정됨
  };

  return (
    <div className="space-y-4">
      {/* 결제자 정보 표시 (Payor Info Display) */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {splitPayor.payor.type === 'company' ? (
                <Building2 className="h-4 w-4 text-gray-500" />
              ) : (
                <User className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {payorLabel || '결제자'} 결제 금액
              </span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              {formatAmount(splitPayor.amount)}원
            </span>
          </div>
          {/* 🆕 결제 예정일 입력 UI (Due Date Input for Split Payor) */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">결제 예정일</span>
            </div>
            <input
              type="date"
              value={splitPayor.dueDate || getTodayDateString()}
              onChange={(e) => onUpdateSplitPayor?.({ dueDate: e.target.value })}
              className="h-7 px-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400/20"
            />
            {splitPayor.dueDate === getTodayDateString() && (
              <select
                value={splitPayor.dueTime || ''}
                onChange={(e) => onUpdateSplitPayor?.({ dueTime: e.target.value || undefined })}
                className="h-7 px-2 text-xs rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400/20"
              >
                <option value="">시간 선택</option>
                {PAYMENT_HOURS.map((hour) => (
                  <option key={hour.value} value={hour.value}>
                    {hour.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* 결제 수단이 없을 때 추가 버튼 표시 (Show add button when no methods) */}
      {splitPayor.methods.length === 0 ? (
        <AddMethodButton onClick={handleAddMethod} />
      ) : (
        <>
          {/* 결제 수단 탭 바 (Payment Methods Tab Bar) */}
          <div className="flex flex-wrap border-b border-gray-200 gap-1">
            {splitPayor.methods.map((method, index) => {
              const methodInfo = PAYMENT_METHOD_MAP[method.type];
              return (
                <button
                  key={method.id}
                  onClick={() => setActiveMethodId(method.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors relative group',
                    activeMethodId === method.id
                      ? 'bg-[#1a2867] text-white font-semibold' // 🎨 네이비 배경 + 흰색 폰트
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  )}
                >
                  <span className="text-sm">
                    {methodInfo?.label || '결제수단'} {index + 1}
                  </span>
                  {splitPayor.methods.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveMethod(method.id);
                      }}
                      className={cn(
                        'p-0.5 rounded transition-colors',
                        activeMethodId === method.id
                          ? 'hover:bg-[#2a3a7f]' // 네이비 탭일 때 더 진한 네이비 호버
                          : 'hover:bg-gray-300'
                      )}
                      title="결제 수단 삭제"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </button>
              );
            })}

            {/* 결제 수단 추가 버튼 (Add Method Button) */}
            <button
              onClick={handleAddMethod}
              className="flex items-center gap-1 px-3 py-2 text-gray-400 hover:text-[#fab803] transition-colors"
              title="결제 수단 추가"
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs">추가</span>
            </button>
          </div>

          {/* 활성 탭 내용 (Active Tab Content) */}
          {splitPayor.methods.map((method, index) => (
            <div
              key={method.id}
              className={activeMethodId === method.id ? 'block' : 'hidden'}
            >
              <SplitPayorMethodCard
                method={method}
                index={index}
                totalAmount={splitPayor.amount}
                remainingAmount={remainingAmount}
                onUpdate={(data) => onUpdateMethod(method.id, data)}
                onRemove={() => onRemoveMethod(method.id)}
                canRemove={splitPayor.methods.length > 1}
              />
            </div>
          ))}
        </>
      )}

      {/* 금액 비교 (Amount Comparison) */}
      {validation && (
        <AmountComparison
          label="결제 수단 합계"
          current={validation.methodTotal}
          target={splitPayor.amount}
        />
      )}
    </div>
  );
}

// ==================== 분할 결제자 결제 수단 카드 (Split Payor Method Card) ====================

interface SplitPayorMethodCardProps {
  method: PaymentMethod;
  index: number;
  totalAmount: number;
  remainingAmount: number;
  onUpdate: (data: Partial<PaymentMethod>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function SplitPayorMethodCard({
  method,
  index,
  totalAmount,
  remainingAmount,
  onUpdate,
  onRemove,
  canRemove,
}: SplitPayorMethodCardProps) {
  const methodInfo = PAYMENT_METHOD_MAP[method.type];
  const requiresProof = methodInfo?.requiresProof && !method.autoReceipt;

  // 수단별 상세 컴포넌트 렌더링 (Render method-specific component)
  const renderMethodDetails = () => {
    const handleDetailsChange = (details: PaymentMethodDetails) => {
      onUpdate({ details });
    };

    switch (method.type) {
      case 'toss':
        return <TossSection amount={method.amount} />;
      case 'keyin':
        return (
          <KeyinSection
            value={method.details as KeyinData | null}
            onChange={handleDetailsChange}
            amount={method.amount}
          />
        );
      case 'bank':
        return (
          <BankSection
            value={method.details as BankData | null}
            onChange={handleDetailsChange}
            amount={method.amount}
          />
        );
      case 'narabill':
        return (
          <NarabillSection
            value={method.details as FileUploadData | null}
            onChange={handleDetailsChange}
            amount={method.amount}
          />
        );
      case 'contract':
        return (
          <ContractSection
            value={method.details as FileUploadData | null}
            onChange={handleDetailsChange}
            amount={method.amount}
          />
        );
      case 'other':
        return (
          <OtherSection
            value={method.details as OtherData | null}
            onChange={handleDetailsChange}
            amount={method.amount}
          />
        );
      default:
        return null;
    }
  };

  // 증빙 변경 핸들러 (Proof change handler)
  const handleProofChange = (proof: Partial<ProofDocument>) => {
    const newProof: ProofDocument = {
      id: method.proof?.id || `proof-${Date.now()}`,
      type: proof.type || 'none',
      recipientMode: proof.recipientMode || 'same-as-payor',
      preferredIssueDate: proof.preferredIssueDate || false,
      validations: [],
      ...proof,
    };
    onUpdate({ proof: newProof });
  };

  return (
    <MethodCard
      method={method}
      index={index}
      totalAmount={totalAmount}
      remainingAmount={remainingAmount}
      onUpdate={onUpdate}
      onRemove={onRemove}
      canRemove={canRemove}
    >
      {/* 나라빌/수의계약: 사업자 정보 먼저, 증빙 나중에 (Business Info First) */}
      {(method.type === 'narabill' || method.type === 'contract') ? (
        <>
          {/* 사업자 정보 먼저 입력 (Business Info First) */}
          <div className="pt-4 border-t border-gray-100">{renderMethodDetails()}</div>

          {/* 증빙 서류 나중에 (Proof Document After) */}
          {requiresProof && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <ProofSelector
                value={method.proof?.type || 'none'}
                onChange={(type) => handleProofChange({ type })}
                amount={method.amount}
                showLaterOption
              />

              {/* 세금계산서 폼 - 사업자 정보는 이미 입력됨 */}
              {method.proof?.type === 'tax-invoice' && (
                <TaxInvoiceForm
                  value={method.proof}
                  onChange={handleProofChange}
                  existingBusinessInfo={
                    method.details
                      ? (method.details as FileUploadData).businessInfo
                      : undefined
                  }
                />
              )}

              {/* 현금영수증 폼 (Cash Receipt Form) */}
              {method.proof?.type === 'cash-receipt' && (
                <CashReceiptForm
                  value={method.proof}
                  onChange={handleProofChange}
                />
              )}

              {/* 검증 경고 (Validation Alert) */}
              <ProofValidationAlert method={method} proof={method.proof} />
            </div>
          )}
        </>
      ) : method.type === 'bank' ? (
        <>
          {/* 무통장: 증빙 먼저, 입금 안내 나중에 (Proof First, Bank Info Later) */}
          {/* 증빙 서류 먼저 (Proof Document First) */}
          {requiresProof && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <ProofSelector
                value={method.proof?.type || 'none'}
                onChange={(type) => handleProofChange({ type })}
                amount={method.amount}
                showLaterOption
              />

              {/* 세금계산서 폼 (Tax Invoice Form) */}
              {method.proof?.type === 'tax-invoice' && (
                <TaxInvoiceForm
                  value={method.proof}
                  onChange={handleProofChange}
                />
              )}

              {/* 현금영수증 폼 (Cash Receipt Form) */}
              {method.proof?.type === 'cash-receipt' && (
                <CashReceiptForm
                  value={method.proof}
                  onChange={handleProofChange}
                />
              )}

              {/* 검증 경고 (Validation Alert) */}
              <ProofValidationAlert method={method} proof={method.proof} />
            </div>
          )}

          {/* 입금자명, 입금 안내, 계좌 안내 (Bank Info After Proof) */}
          <div className="pt-4 border-t border-gray-100">{renderMethodDetails()}</div>
        </>
      ) : (
        <>
          {/* 다른 결제 수단: 기존 순서 유지 (Other Methods: Keep Original Order) */}
          {/* 수단별 상세 (Method Details) */}
          <div className="pt-4 border-t border-gray-100">{renderMethodDetails()}</div>

          {/* 증빙 서류 (Proof Document) - 필요 시, 기타 결제 제외 */}
          {requiresProof && method.type !== 'other' && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <ProofSelector
                value={method.proof?.type || 'none'}
                onChange={(type) => handleProofChange({ type })}
                amount={method.amount}
                showLaterOption
              />

              {/* 세금계산서 폼 (Tax Invoice Form) */}
              {method.proof?.type === 'tax-invoice' && (
                <TaxInvoiceForm
                  value={method.proof}
                  onChange={handleProofChange}
                />
              )}

              {/* 현금영수증 폼 (Cash Receipt Form) */}
              {method.proof?.type === 'cash-receipt' && (
                <CashReceiptForm
                  value={method.proof}
                  onChange={handleProofChange}
                />
              )}

              {/* 검증 경고 (Validation Alert) */}
              <ProofValidationAlert method={method} proof={method.proof} />
            </div>
          )}
        </>
      )}
    </MethodCard>
  );
}

export default MethodStep;
