// Step 5: 최종 확인 컴포넌트 (Confirm Step Component)

import React, { useMemo } from 'react';
import { Check, AlertTriangle, Wallet, FileSignature, Loader2, User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UnifiedPayment, PaymentSchedule, SplitPayor } from '../../types';
import { PAYMENT_TIMINGS, PAYMENT_METHOD_MAP } from '../../utils/constants';
import { formatAmount } from '../shared/AmountInput';
import { ContractWarning } from '../shared/ContractWarning';
import { PayorTypeBadge } from '../payor/PayorTypeTabs';
import { MethodBadge } from '../method/MethodSelector';
import { ProofTypeBadge } from '../proof/ProofSelector';
import { StepCard, StepCardActions } from './StepCard';

interface ConfirmStepProps {
  payment: UnifiedPayment;
  totalOrderAmount: number;
  useDeposit: boolean;
  depositAmount: number;
  availableDeposit: number;
  onUseDepositChange: (use: boolean) => void;
  onDepositAmountChange: (amount: number) => void;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
  isActive: boolean;
  isCompleted: boolean;
  className?: string;
}

export function ConfirmStep({
  payment,
  totalOrderAmount,
  useDeposit,
  depositAmount,
  availableDeposit,
  onUseDepositChange,
  onDepositAmountChange,
  onSubmit,
  onPrev,
  isSubmitting,
  isActive,
  isCompleted,
  className,
}: ConfirmStepProps) {
  // 총 결제 금액 계산 (Calculate total payment amount)
  const totalScheduleAmount = useMemo(() => {
    return payment.schedules.reduce((sum, s) => sum + s.amount, 0);
  }, [payment.schedules]);

  // 최종 결제 금액 (Final payment amount)
  const finalAmount = useDeposit
    ? totalScheduleAmount - depositAmount
    : totalScheduleAmount;

  // 후불 포함 여부 (Has deferred payment)
  const hasDeferred = useMemo(() => {
    return payment.schedules.some((s) => s.timing === 'post-ship');
  }, [payment.schedules]);

  return (
    <StepCard
      step={5}
      status={{ step: 5, isCompleted, isActive, canEdit: false }}
      className={className}
    >
      <div className="space-y-6">
        {/* 결제 요약 (Payment Summary) */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">결제 요약</h4>

          {/* 일정별 상세 (Schedule Details) */}
          <div className="space-y-3">
            {payment.schedules.map((schedule) => (
              <ScheduleSummaryCard key={schedule.id} schedule={schedule} />
            ))}
          </div>
        </div>

        {/* 결제자 정보 (Payor Info) */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900">결제자 정보</h4>

          {/* 단일 결제자 모드 (Single Payor Mode) */}
          {payment.payorMode === 'single' && payment.singlePayor && (
            <PayorSummaryCard payor={payment.singlePayor} />
          )}

          {/* 일정별 결제자 모드 (Per-Schedule Payor Mode) */}
          {payment.payorMode === 'per-schedule' && (
            <div className="space-y-2">
              {payment.schedules.map((schedule) =>
                schedule.payor ? (
                  <div key={schedule.id} className="space-y-1">
                    <p className="text-xs text-gray-500">{schedule.label}</p>
                    <PayorSummaryCard payor={schedule.payor} />
                  </div>
                ) : null
              )}
            </div>
          )}

          {/* 분할 결제자 모드 (Split Payor Mode) */}
          {payment.payorMode === 'split-amount' && payment.splitPayors.length > 0 && (
            <div className="space-y-3">
              {payment.splitPayors.map((sp) => (
                <SplitPayorSummaryCard key={sp.id} splitPayor={sp} />
              ))}
            </div>
          )}
        </div>

        {/* 예치금 사용 (Deposit Usage) */}
        {availableDeposit > 0 && (
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  예치금 사용
                </span>
              </div>
              <span className="text-sm text-gray-500">
                사용 가능: {formatAmount(availableDeposit)}원
              </span>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useDeposit}
                onChange={(e) => onUseDepositChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#fab803] focus:ring-[#fab803]"
              />
              <span className="text-sm text-gray-700">예치금 사용하기</span>
            </label>

            {useDeposit && (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) =>
                    onDepositAmountChange(
                      Math.min(
                        Number(e.target.value),
                        availableDeposit,
                        totalScheduleAmount
                      )
                    )
                  }
                  max={Math.min(availableDeposit, totalScheduleAmount)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-right text-sm"
                />
                <span className="text-sm text-gray-500">원</span>
                <button
                  onClick={() =>
                    onDepositAmountChange(
                      Math.min(availableDeposit, totalScheduleAmount)
                    )
                  }
                  className="px-3 py-2 text-sm font-medium text-[#1a2867] hover:bg-[#fab803]/10 rounded-lg transition-colors"
                >
                  전액
                </button>
              </div>
            )}
          </div>
        )}

        {/* 전자계약 안내 (Electronic Contract Notice) */}
        {hasDeferred && (
          <ContractWarning
            schedules={payment.schedules}
            contractSigners={payment.contractSigners}
          />
        )}

        {/* 최종 금액 (Final Amount) */}
        <div className="rounded-xl bg-[#fab803]/10 border border-[#fab803]/20 p-4 space-y-3">
          {useDeposit && depositAmount > 0 && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">총 결제 금액</span>
                <span className="text-gray-900">
                  {formatAmount(totalScheduleAmount)}원
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">예치금 사용</span>
                <span className="text-green-600">
                  -{formatAmount(depositAmount)}원
                </span>
              </div>
              <div className="border-t border-[#fab803]/20 pt-3" />
            </>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              최종 결제 금액
            </span>
            <span className="text-2xl font-bold text-[#1a2867]">
              {formatAmount(finalAmount)}원
            </span>
          </div>
        </div>

        {/* 동의 및 제출 (Agreement & Submit) */}
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-100 p-4">
            <input
              type="checkbox"
              id="agreement"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#fab803] focus:ring-[#fab803]"
            />
            <label htmlFor="agreement" className="text-sm text-gray-600">
              주문 내용 및 결제 조건을 확인하였으며, 이에 동의합니다.
              {hasDeferred && (
                <span className="block mt-1 text-amber-600">
                  * 후불 결제 시 전자계약 서명이 필요합니다.
                </span>
              )}
            </label>
          </div>

          <StepCardActions
            onPrev={onPrev}
            onNext={onSubmit}
            prevLabel="이전"
            nextLabel={
              isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  처리 중...
                </span>
              ) : hasDeferred ? (
                '전자계약 서명 요청'
              ) : (
                '결제 진행'
              )
            }
            nextDisabled={isSubmitting}
            isLastStep
          />
        </div>
      </div>
    </StepCard>
  );
}

// ==================== 일정 요약 카드 (Schedule Summary Card) ====================

interface ScheduleSummaryCardProps {
  schedule: PaymentSchedule;
}

function ScheduleSummaryCard({ schedule }: ScheduleSummaryCardProps) {
  const timing = PAYMENT_TIMINGS.find((t) => t.value === schedule.timing);
  const isDeferred = timing?.isDeferred;

  return (
    <div
      className={cn(
        'rounded-xl border p-4 space-y-3',
        isDeferred ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'
      )}
    >
      {/* 헤더 (Header) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {schedule.label}
          </span>
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              isDeferred
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {timing?.label}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {formatAmount(schedule.amount)}원
        </span>
      </div>

      {/* 결제 수단 (Payment Methods) */}
      <div className="space-y-2">
        {schedule.methods.map((method) => {
          const methodInfo = PAYMENT_METHOD_MAP[method.type];

          return (
            <div
              key={method.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <MethodBadge type={method.type} />
                {method.proof && method.proof.type !== 'none' && (
                  <ProofTypeBadge type={method.proof.type} />
                )}
              </div>
              <span className="text-gray-600">
                {formatAmount(method.amount)}원
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== 결제자 요약 카드 (Payor Summary Card) ====================

interface PayorSummaryCardProps {
  payor: UnifiedPayment['singlePayor'];
}

function PayorSummaryCard({ payor }: PayorSummaryCardProps) {
  if (!payor) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <PayorTypeBadge type={payor.type} />
        <div>
          <p className="text-sm font-medium text-gray-900">
            {payor.type === 'company' ? payor.company : payor.name}
          </p>
          <p className="text-xs text-gray-500">{payor.email}</p>
        </div>
      </div>
    </div>
  );
}

// ==================== 분할 결제자 요약 카드 (Split Payor Summary Card) ====================

interface SplitPayorSummaryCardProps {
  splitPayor: SplitPayor;
}

function SplitPayorSummaryCard({ splitPayor }: SplitPayorSummaryCardProps) {
  const { payor, amount, methods } = splitPayor;
  const payorLabel = payor.type === 'company'
    ? payor.company || payor.name
    : payor.name;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* 결제자 헤더 (Payor Header) */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-white border border-gray-200">
            {payor.type === 'company' ? (
              <Building2 className="h-4 w-4 text-gray-600" />
            ) : (
              <User className="h-4 w-4 text-gray-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {payorLabel || '결제자'}
            </p>
            <p className="text-xs text-gray-500">{payor.email}</p>
          </div>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {formatAmount(amount)}원
        </span>
      </div>

      {/* 결제 수단 목록 (Payment Methods List) */}
      <div className="px-4 py-3 space-y-2">
        {methods.length > 0 ? (
          methods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <MethodBadge type={method.type} />
                {method.proof && method.proof.type !== 'none' && (
                  <ProofTypeBadge type={method.proof.type} />
                )}
              </div>
              <span className="text-gray-600">
                {formatAmount(method.amount)}원
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-2">
            결제 수단 미설정
          </p>
        )}
      </div>
    </div>
  );
}

export default ConfirmStep;
