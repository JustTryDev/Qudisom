// 현금영수증 폼 컴포넌트 (Cash Receipt Form Component)

import React, { useCallback } from 'react';
import { User, Building2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProofDocument } from '../../types';
import { CASH_RECEIPT_TYPES, VALIDATION_RULES } from '../../utils/constants';
import { FieldError, HelperText } from '../shared/ValidationMessage';

interface CashReceiptFormProps {
  value: Partial<ProofDocument>;
  onChange: (value: Partial<ProofDocument>) => void;
  disabled?: boolean;
  className?: string;
}

export function CashReceiptForm({
  value,
  onChange,
  disabled = false,
  className,
}: CashReceiptFormProps) {
  const receiptType = value.cashReceiptType || 'income-deduction';

  const handleTypeChange = useCallback(
    (type: 'income-deduction' | 'expense-proof') => {
      onChange({
        ...value,
        cashReceiptType: type,
        cashReceiptNumber: '', // 타입 변경 시 번호 초기화 (Reset number on type change)
      });
    },
    [value, onChange]
  );

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let rawValue = e.target.value.replace(/[^0-9]/g, '');

      // 소득공제용: 휴대폰번호 (11자리) (Income deduction: phone number)
      // 지출증빙용: 사업자번호 (10자리) (Expense proof: business number)
      const maxLength = receiptType === 'income-deduction' ? 11 : 10;
      if (rawValue.length > maxLength) {
        rawValue = rawValue.slice(0, maxLength);
      }

      // 포맷팅 (Formatting)
      let formatted = rawValue;
      if (receiptType === 'income-deduction') {
        // 휴대폰번호 포맷: 010-1234-5678
        if (rawValue.length > 3) {
          formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
        }
        if (rawValue.length > 7) {
          formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 7)}-${rawValue.slice(7)}`;
        }
      } else {
        // 사업자번호 포맷: 123-45-67890
        if (rawValue.length > 3) {
          formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
        }
        if (rawValue.length > 5) {
          formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 5)}-${rawValue.slice(5)}`;
        }
      }

      onChange({
        ...value,
        cashReceiptNumber: formatted,
      });
    },
    [value, onChange, receiptType]
  );

  const getPlaceholder = () => {
    return receiptType === 'income-deduction'
      ? '010-1234-5678'
      : '123-45-67890';
  };

  const getLabel = () => {
    return receiptType === 'income-deduction' ? '휴대폰 번호' : '사업자등록번호';
  };

  const validateNumber = (): string | undefined => {
    const number = value.cashReceiptNumber?.replace(/[^0-9]/g, '') || '';
    if (!number) return undefined;

    if (receiptType === 'income-deduction') {
      if (!VALIDATION_RULES.PHONE_REGEX.test(value.cashReceiptNumber || '')) {
        return '올바른 휴대폰 번호 형식이 아닙니다';
      }
    } else {
      if (!VALIDATION_RULES.BUSINESS_NUMBER_REGEX.test(value.cashReceiptNumber || '')) {
        return '올바른 사업자등록번호 형식이 아닙니다';
      }
    }
    return undefined;
  };

  const error = validateNumber();

  return (
    <div className={cn('space-y-6', className)}>
      {/* 현금영수증 유형 선택 (Receipt Type Selection) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">발급 유형</label>
        <div className="grid grid-cols-2 gap-3">
          {CASH_RECEIPT_TYPES.map((type) => {
            const isSelected = receiptType === type.value;
            const Icon = type.value === 'income-deduction' ? User : Building2;

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeChange(type.value)}
                disabled={disabled}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-4 transition-all text-left',
                  isSelected
                    ? 'border-[#fab803] bg-[#fab803]/5'
                    : 'border-gray-200 hover:border-gray-300',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <div
                  className={cn(
                    'rounded-full p-2',
                    isSelected ? 'bg-[#fab803]/20' : 'bg-gray-100'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      isSelected ? 'text-[#fab803]' : 'text-gray-500'
                    )}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-gray-900' : 'text-gray-700'
                    )}
                  >
                    {type.label}
                  </p>
                  <p className="text-xs text-gray-500">{type.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 발급 번호 입력 (Receipt Number Input) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          {getLabel()}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="text"
          inputMode="numeric"
          value={value.cashReceiptNumber || ''}
          onChange={handleNumberChange}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
            'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
            'disabled:bg-gray-50 disabled:text-gray-400',
            error ? 'border-red-300' : 'border-gray-200'
          )}
        />
        {error && <FieldError error={error} />}
        <HelperText>
          {receiptType === 'income-deduction'
            ? '현금영수증을 발급받을 휴대폰 번호를 입력해주세요'
            : '현금영수증을 발급받을 사업자등록번호를 입력해주세요'}
        </HelperText>
      </div>

      {/* 안내 문구 (Info Message) */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">현금영수증 발급 안내</p>
          <ul className="mt-1 space-y-0.5 text-xs">
            <li>• 현금영수증은 결제 완료 후 자동 발급됩니다</li>
            <li>• 국세청 홈택스에서 발급 내역을 확인할 수 있습니다</li>
            {receiptType === 'income-deduction' && (
              <li>• 연말정산 시 소득공제 혜택을 받을 수 있습니다</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==================== 현금영수증 요약 (Cash Receipt Summary) ====================

interface CashReceiptSummaryProps {
  proof: Partial<ProofDocument>;
  className?: string;
}

export function CashReceiptSummary({ proof, className }: CashReceiptSummaryProps) {
  const typeLabel =
    proof.cashReceiptType === 'income-deduction' ? '소득공제용' : '지출증빙용';

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">발급 유형</span>
        <span className="font-medium text-gray-900">{typeLabel}</span>
      </div>
      {proof.cashReceiptNumber && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {proof.cashReceiptType === 'income-deduction'
              ? '휴대폰 번호'
              : '사업자번호'}
          </span>
          <span className="font-medium text-gray-900">
            {proof.cashReceiptNumber}
          </span>
        </div>
      )}
    </div>
  );
}

export default CashReceiptForm;
