// Step 3: 결제 수단 컴포넌트 (Payment Method Step Component)

import React, { useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type {
  PaymentSchedule,
  PaymentMethod,
  PaymentMethodType,
  ProofDocument,
  KeyinData,
  BankData,
  FileUploadData,
  OtherData,
} from '../../types';
import {
  createDefaultPaymentMethod,
  PAYMENT_METHOD_MAP,
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
  onAddMethod: (scheduleId: string, method: PaymentMethod) => void;
  onUpdateMethod: (
    scheduleId: string,
    methodId: string,
    data: Partial<PaymentMethod>
  ) => void;
  onRemoveMethod: (scheduleId: string, methodId: string) => void;
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
  className?: string;
}

export function MethodStep({
  schedules,
  onAddMethod,
  onUpdateMethod,
  onRemoveMethod,
  onSetProof,
  onComplete,
  onPrev,
  onEdit,
  isActive,
  isCompleted,
  className,
}: MethodStepProps) {
  const [activeScheduleId, setActiveScheduleId] = React.useState<string>(
    schedules[0]?.id || ''
  );

  // 현재 활성 일정 (Current active schedule)
  const activeSchedule = schedules.find((s) => s.id === activeScheduleId);

  // 일정별 금액 검증 (Per-schedule amount validation)
  const scheduleValidations = useMemo(() => {
    return schedules.map((schedule) => {
      const methodTotal = schedule.methods.reduce((sum, m) => sum + m.amount, 0);
      const isValid = methodTotal === schedule.amount;
      const diff = methodTotal - schedule.amount;
      return { scheduleId: schedule.id, methodTotal, isValid, diff };
    });
  }, [schedules]);

  // 전체 검증 (Overall validation)
  const canComplete = scheduleValidations.every((v) => v.isValid);

  // 메서드 추가 핸들러 (Add method handler)
  const handleAddMethod = useCallback(
    (scheduleId: string) => {
      const newMethod = createDefaultPaymentMethod(`method-${Date.now()}`);
      onAddMethod(scheduleId, newMethod);
    },
    [onAddMethod]
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
        {/* 일정 탭 (Schedule Tabs) - 다중 일정일 때만 */}
        {schedules.length > 1 && (
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {schedules.map((schedule) => {
              const validation = scheduleValidations.find(
                (v) => v.scheduleId === schedule.id
              );
              return (
                <button
                  key={schedule.id}
                  onClick={() => setActiveScheduleId(schedule.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                    activeScheduleId === schedule.id
                      ? 'border-[#fab803] text-[#fab803]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {schedule.label}
                  {validation && !validation.isValid && (
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                  )}
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
          />
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

// ==================== 일정별 결제 수단 섹션 (Schedule Methods Section) ====================

interface ScheduleMethodsSectionProps {
  schedule: PaymentSchedule;
  validation?: { methodTotal: number; isValid: boolean; diff: number };
  onAddMethod: () => void;
  onUpdateMethod: (methodId: string, data: Partial<PaymentMethod>) => void;
  onRemoveMethod: (methodId: string) => void;
  onUpdateDetails: (methodId: string, details: PaymentMethod['details']) => void;
  onProofChange: (methodId: string, proof: Partial<ProofDocument>) => void;
}

function ScheduleMethodsSection({
  schedule,
  validation,
  onAddMethod,
  onUpdateMethod,
  onRemoveMethod,
  onUpdateDetails,
  onProofChange,
}: ScheduleMethodsSectionProps) {
  // 남은 금액 계산 (Calculate remaining amount)
  const remainingAmount = schedule.amount - (validation?.methodTotal || 0);

  return (
    <div className="space-y-4">
      {/* 일정 금액 표시 (Schedule Amount Display) */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{schedule.label} 결제 금액</span>
          <span className="text-lg font-bold text-gray-900">
            {formatAmount(schedule.amount)}원
          </span>
        </div>
      </div>

      {/* 결제 수단 목록 (Payment Methods List) */}
      <div className="space-y-4">
        {schedule.methods.map((method, index) => (
          <MethodWithDetails
            key={method.id}
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
        ))}

        {/* 결제 수단 추가 버튼 (Add Method Button) */}
        <AddMethodButton onClick={onAddMethod} />
      </div>

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
      {/* 수단별 상세 (Method Details) */}
      <div className="pt-4 border-t border-gray-100">{renderMethodDetails()}</div>

      {/* 증빙 서류 (Proof Document) - 필요 시 */}
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
    </MethodCard>
  );
}

export default MethodStep;
