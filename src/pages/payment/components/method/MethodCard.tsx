// 결제 수단 카드 컴포넌트 (Payment Method Card Component)

import React from 'react';
import { X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentMethod, PaymentMethodType } from '../../types';
import { PAYMENT_METHOD_MAP } from '../../utils/constants';
import { AmountInput, formatAmount } from '../shared/AmountInput';
import { MethodSelector, MethodBadge } from './MethodSelector';
import { ProofRequiredBadge } from '../proof/ProofValidationAlert';

interface MethodCardProps {
  method: PaymentMethod;
  index: number;
  totalAmount: number;
  remainingAmount: number;
  onUpdate: (data: Partial<PaymentMethod>) => void;
  onRemove: () => void;
  canRemove?: boolean;
  disabled?: boolean;
  children?: React.ReactNode; // 수단별 상세 입력 영역 (Method-specific input area)
  className?: string;
}

export function MethodCard({
  method,
  index,
  totalAmount,
  remainingAmount,
  onUpdate,
  onRemove,
  canRemove = true,
  disabled = false,
  children,
  className,
}: MethodCardProps) {
  const methodInfo = PAYMENT_METHOD_MAP[method.type];

  const handleTypeChange = (type: PaymentMethodType) => {
    const newMethodInfo = PAYMENT_METHOD_MAP[type];
    onUpdate({
      type,
      autoReceipt: newMethodInfo?.autoReceipt ?? false,
      details: null,
      proof: undefined,
    });
  };

  const handleAmountChange = (amount: number) => {
    onUpdate({ amount });
  };

  const handleFullClick = () => {
    onUpdate({ amount: remainingAmount + method.amount });
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white overflow-hidden',
        className
      )}
    >
      {/* 헤더 (Header) */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
          <span className="text-sm font-medium text-gray-700">
            결제 수단 {index + 1}
          </span>
          <MethodBadge type={method.type} />
          <ProofRequiredBadge method={method} />
        </div>

        {canRemove && (
          <button
            onClick={onRemove}
            disabled={disabled}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 컨텐츠 (Content) */}
      <div className="p-4 space-y-4">
        {/* 금액 입력 (Amount Input) */}
        <AmountInput
          label="결제 금액"
          value={method.amount}
          onChange={handleAmountChange}
          max={totalAmount}
          showFullButton
          fullAmount={remainingAmount + method.amount}
          onFullClick={handleFullClick}
          disabled={disabled}
        />

        {/* 결제 수단 선택 (Method Selection) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">결제 수단</label>
          <MethodSelector
            value={method.type}
            onChange={handleTypeChange}
            disabled={disabled}
          />
        </div>

        {/* 수단별 상세 입력 (Method-specific Details) */}
        {children}
      </div>
    </div>
  );
}

// ==================== 결제 수단 요약 카드 (Method Summary Card) ====================

interface MethodSummaryCardProps {
  method: PaymentMethod;
  index: number;
  className?: string;
}

export function MethodSummaryCard({
  method,
  index,
  className,
}: MethodSummaryCardProps) {
  const methodInfo = PAYMENT_METHOD_MAP[method.type];

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">#{index + 1}</span>
        <MethodBadge type={method.type} />
      </div>
      <span className="text-sm font-semibold text-gray-900">
        {formatAmount(method.amount)}원
      </span>
    </div>
  );
}

// ==================== 결제 수단 추가 버튼 (Add Method Button) ====================

interface AddMethodButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function AddMethodButton({
  onClick,
  disabled = false,
  className,
}: AddMethodButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-4',
        'text-sm font-medium text-gray-500 hover:border-[#fab803] hover:text-[#fab803] transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-500',
        className
      )}
    >
      <span className="text-lg">+</span>
      결제 수단 추가
    </button>
  );
}

export default MethodCard;
