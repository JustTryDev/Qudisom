// 증빙 유형 선택 컴포넌트 (Proof Type Selector Component)

import React from 'react';
import { FileText, Receipt, Ban, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProofType } from '../../types';
import { PROOF_TYPES } from '../../utils/constants';

interface ProofSelectorProps {
  value: ProofType;
  onChange: (value: ProofType) => void;
  disabled?: boolean;
  showLaterOption?: boolean;
  amount?: number; // 현금영수증 의무발행 확인용 (For cash receipt mandatory check)
  className?: string;
  // 피드백 4: 접기 기능 (Collapse Feature)
  collapsible?: boolean;
}

export function ProofSelector({
  value,
  onChange,
  disabled = false,
  showLaterOption = true,
  amount,
  className,
  collapsible = false,
}: ProofSelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(!collapsible);

  const getIcon = (type: ProofType) => {
    switch (type) {
      case 'tax-invoice':
        return FileText;
      case 'cash-receipt':
        return Receipt;
      case 'none':
        return Ban;
      case 'later':
        return Clock;
      default:
        return FileText;
    }
  };

  const options = showLaterOption
    ? PROOF_TYPES
    : PROOF_TYPES.filter((p) => p.value !== 'later');

  const selectedOption = PROOF_TYPES.find((p) => p.value === value);
  const SelectedIcon = getIcon(value);

  // 선택 후 자동 접기 (Auto collapse after selection)
  const handleChange = (type: ProofType) => {
    onChange(type);
    if (collapsible) {
      setIsExpanded(false);
    }
  };

  // 피드백 4: 접힌 상태 - 선택된 항목만 컴팩트하게 표시
  if (collapsible && !isExpanded && selectedOption) {
    return (
      <div className={cn('space-y-2', className)}>
        <label className="text-sm font-medium text-gray-700">증빙 서류</label>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full p-2 bg-[#fab803]/20">
              <SelectedIcon className="h-4 w-4 text-[#1a2867]" />
            </div>
            <p className="text-sm font-medium text-gray-900">{selectedOption.label}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            disabled={disabled}
            className="text-sm text-[#1a2867] hover:text-[#fab803] font-medium transition-colors"
          >
            변경
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-gray-700">증빙 서류</label>

      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const Icon = getIcon(option.value);
          const isSelected = value === option.value;
          const isNone = option.value === 'none';

          // 10만원 이상 무통장 시 "필요없음" 경고 표시 (Warning for "none" when amount >= 100,000)
          const showWarning = isNone && amount && amount >= 100000;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange(option.value)}
              disabled={disabled}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
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
                    isSelected ? 'text-[#1a2867]' : 'text-gray-500'
                  )}
                />
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isSelected ? 'text-[#1a2867]' : 'text-gray-700'
                  )}
                >
                  {option.label}
                </p>
                {showWarning && isSelected && (
                  <p className="text-xs text-amber-600 mt-1">주의: 권장되지 않음</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==================== 증빙 유형 배지 (Proof Type Badge) ====================

interface ProofTypeBadgeProps {
  type: ProofType;
  className?: string;
}

export function ProofTypeBadge({ type, className }: ProofTypeBadgeProps) {
  const config = {
    'tax-invoice': {
      label: '세금계산서',
      className: 'bg-blue-100 text-blue-700',
    },
    'cash-receipt': {
      label: '현금영수증',
      className: 'bg-green-100 text-green-700',
    },
    none: {
      label: '필요없음',
      className: 'bg-gray-100 text-gray-600',
    },
    later: {
      label: '나중에',
      className: 'bg-amber-100 text-amber-700',
    },
  }[type];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

// ==================== 수령인 모드 선택 (Recipient Mode Selector) ====================

interface RecipientModeSelectorProps {
  value: 'same-as-payor' | 'different';
  onChange: (value: 'same-as-payor' | 'different') => void;
  payorName?: string;
  disabled?: boolean;
  className?: string;
}

export function RecipientModeSelector({
  value,
  onChange,
  payorName,
  disabled = false,
  className,
}: RecipientModeSelectorProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-gray-700">수령인</label>

      <div className="space-y-2">
        <label
          className={cn(
            'flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors',
            value === 'same-as-payor'
              ? 'border-[#fab803] bg-[#fab803]/5'
              : 'border-gray-200 hover:border-gray-300',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="radio"
            checked={value === 'same-as-payor'}
            onChange={() => onChange('same-as-payor')}
            disabled={disabled}
            className="h-4 w-4 text-[#fab803] focus:ring-[#fab803]"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              결제자와 동일
            </span>
            {payorName && (
              <span className="text-sm text-gray-500 ml-2">({payorName})</span>
            )}
          </div>
        </label>

        <label
          className={cn(
            'flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors',
            value === 'different'
              ? 'border-[#fab803] bg-[#fab803]/5'
              : 'border-gray-200 hover:border-gray-300',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="radio"
            checked={value === 'different'}
            onChange={() => onChange('different')}
            disabled={disabled}
            className="h-4 w-4 text-[#fab803] focus:ring-[#fab803]"
          />
          <span className="text-sm font-medium text-gray-900">
            다른 수령인
          </span>
        </label>
      </div>
    </div>
  );
}

export default ProofSelector;
