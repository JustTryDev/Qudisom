// 안심 키인 결제 섹션 컴포넌트 (Secure Keyin Payment Section Component)

import React, { useCallback, useState } from 'react';
import { Lock, CreditCard, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KeyinData } from '../../types';
import { INSTALLMENT_OPTIONS } from '../../utils/constants';
import { FieldError } from '../shared/ValidationMessage';

interface KeyinSectionProps {
  value: KeyinData | null;
  onChange: (value: KeyinData) => void;
  amount: number;
  disabled?: boolean;
  className?: string;
}

export function KeyinSection({
  value,
  onChange,
  amount,
  disabled = false,
  className,
}: KeyinSectionProps) {
  const data: KeyinData = value || {
    type: 'keyin',
    installment: '0',
    cardNumbers: ['', '', '', ''],
    expMonth: '',
    expYear: '',
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCardNumberChange = useCallback(
    (index: number, inputValue: string) => {
      const cleaned = inputValue.replace(/\D/g, '').slice(0, 4);
      const newNumbers = [...data.cardNumbers];
      newNumbers[index] = cleaned;

      onChange({ ...data, cardNumbers: newNumbers });

      // 자동 포커스 이동 (Auto focus next input)
      if (cleaned.length === 4 && index < 3) {
        const nextInput = document.getElementById(`card-${index + 1}`);
        nextInput?.focus();
      }
    },
    [data, onChange]
  );

  const handleInstallmentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ ...data, installment: e.target.value });
    },
    [data, onChange]
  );

  const handleExpMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, '').slice(0, 2);
      if (val.length === 2) {
        const num = parseInt(val, 10);
        if (num > 12) val = '12';
        if (num < 1 && val.length === 2) val = '01';
      }
      onChange({ ...data, expMonth: val });
    },
    [data, onChange]
  );

  const handleExpYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, '').slice(0, 2);
      onChange({ ...data, expYear: val });
    },
    [data, onChange]
  );

  // 50만원 이상시 할부 가능 (Installment available for 500,000+ won)
  const canInstallment = amount >= 50000;

  return (
    <div className={cn('space-y-4', className)}>
      {/* 보안 안내 (Security Notice) */}
      <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
        <Lock className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
        <div className="text-sm text-green-700">
          <p className="font-medium">안심 키인 결제</p>
          <p className="mt-1 text-xs">
            카드 정보는 암호화되어 안전하게 처리됩니다.
            PCI-DSS 인증 결제 시스템을 사용합니다.
          </p>
        </div>
      </div>

      {/* 카드 번호 (Card Number) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          카드 번호
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="flex items-center gap-2">
          {data.cardNumbers.map((num, index) => (
            <React.Fragment key={index}>
              <input
                id={`card-${index}`}
                type="text"
                inputMode="numeric"
                value={num}
                onChange={(e) => handleCardNumberChange(index, e.target.value)}
                placeholder="0000"
                disabled={disabled}
                maxLength={4}
                className={cn(
                  'w-16 rounded-xl border px-3 py-3 text-center text-sm font-mono tracking-wider transition-colors',
                  'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
                  'disabled:bg-gray-50 disabled:text-gray-400',
                  errors.cardNumber ? 'border-red-300' : 'border-gray-200'
                )}
              />
              {index < 3 && <span className="text-gray-300">-</span>}
            </React.Fragment>
          ))}
        </div>
        {errors.cardNumber && <FieldError error={errors.cardNumber} />}
      </div>

      {/* 유효기간 (Expiry Date) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          유효기간
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={data.expMonth}
            onChange={handleExpMonthChange}
            placeholder="MM"
            disabled={disabled}
            maxLength={2}
            className={cn(
              'w-16 rounded-xl border px-3 py-3 text-center text-sm font-mono transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              'border-gray-200'
            )}
          />
          <span className="text-gray-400">/</span>
          <input
            type="text"
            inputMode="numeric"
            value={data.expYear}
            onChange={handleExpYearChange}
            placeholder="YY"
            disabled={disabled}
            maxLength={2}
            className={cn(
              'w-16 rounded-xl border px-3 py-3 text-center text-sm font-mono transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              'border-gray-200'
            )}
          />
        </div>
      </div>

      {/* 할부 선택 (Installment Selection) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">할부 개월</label>
        <select
          value={data.installment}
          onChange={handleInstallmentChange}
          disabled={disabled || !canInstallment}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
            'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
            'disabled:bg-gray-50 disabled:text-gray-400',
            'border-gray-200'
          )}
        >
          {INSTALLMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {!canInstallment && (
          <p className="text-xs text-gray-500">
            5만원 이상 결제 시 할부 선택이 가능합니다
          </p>
        )}
      </div>

      {/* 카드 이미지 (Card Preview) */}
      <div className="relative rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-white overflow-hidden">
        <div className="absolute top-4 right-4">
          <CreditCard className="h-8 w-8 text-white/30" />
        </div>
        <div className="space-y-4">
          <div className="text-lg font-mono tracking-widest">
            {data.cardNumbers.map((n) => n || '****').join(' ')}
          </div>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span>
              {data.expMonth || 'MM'}/{data.expYear || 'YY'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyinSection;
