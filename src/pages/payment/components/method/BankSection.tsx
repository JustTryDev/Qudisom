// 무통장 입금 섹션 컴포넌트 (Bank Transfer Section Component)

import React, { useCallback } from 'react';
import { Copy, Check, Building2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BankData } from '../../types';
import { BANK_ACCOUNT_INFO } from '../../utils/constants';

interface BankSectionProps {
  value: BankData | null;
  onChange: (value: BankData) => void;
  amount: number;
  disabled?: boolean;
  className?: string;
}

export function BankSection({
  value,
  onChange,
  amount,
  disabled = false,
  className,
}: BankSectionProps) {
  const [copied, setCopied] = React.useState(false);

  const data: BankData = value || {
    type: 'bank',
    depositorName: '',
  };

  const handleDepositorNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...data, depositorName: e.target.value });
    },
    [data, onChange]
  );

  const handleCopyAccount = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(BANK_ACCOUNT_INFO.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      {/* 입금 계좌 정보 (Bank Account Info) */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">입금 계좌</span>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">은행</span>
              <span className="text-sm font-medium text-gray-900">
                {BANK_ACCOUNT_INFO.bankName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">계좌번호</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-medium text-gray-900">
                  {BANK_ACCOUNT_INFO.accountNumber}
                </span>
                <button
                  onClick={handleCopyAccount}
                  className={cn(
                    'p-1.5 rounded-lg transition-colors',
                    copied
                      ? 'bg-green-100 text-green-600'
                      : 'hover:bg-gray-100 text-gray-400'
                  )}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">예금주</span>
              <span className="text-sm font-medium text-gray-900">
                {BANK_ACCOUNT_INFO.accountHolder}
              </span>
            </div>
          </div>
        </div>

        {/* 입금 금액 (Deposit Amount) */}
        <div className="flex items-center justify-between bg-[#fab803]/10 rounded-lg px-4 py-3">
          <span className="text-sm font-medium text-gray-700">입금 금액</span>
          <span className="text-lg font-bold text-[#1a2867]">
            {amount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 입금자명 입력 (Depositor Name Input) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          입금자명
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="text"
          value={data.depositorName}
          onChange={handleDepositorNameChange}
          placeholder="입금자명을 입력해주세요"
          disabled={disabled}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
            'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
            'disabled:bg-gray-50 disabled:text-gray-400',
            'border-gray-200'
          )}
        />
        <p className="text-xs text-gray-500">
          입금하실 통장의 예금주명을 입력해주세요
        </p>
      </div>

      {/* 안내 사항 (Notice) */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">무통장 입금 안내</p>
          <ul className="mt-1 space-y-0.5 text-xs">
            <li>• 주문 후 3일 이내에 입금해주세요</li>
            <li>• 입금자명이 다를 경우 반드시 알려주세요</li>
            <li>• 입금 확인 후 주문이 진행됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BankSection;
