// 결제 수단 선택 컴포넌트 (Payment Method Selector Component)

import React from 'react';
import { CreditCard, Keyboard, Building2, FileText, FileSignature, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentMethodType } from '../../types';
import { PAYMENT_METHODS } from '../../utils/constants';

interface MethodSelectorProps {
  value: PaymentMethodType;
  onChange: (value: PaymentMethodType) => void;
  disabled?: boolean;
  excludeTypes?: PaymentMethodType[];
  className?: string;
  // 피드백 4: 접기 기능 (Collapse Feature)
  collapsible?: boolean;
}

export function MethodSelector({
  value,
  onChange,
  disabled = false,
  excludeTypes = [],
  className,
  collapsible = false,
}: MethodSelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(!collapsible);
  const getIcon = (type: PaymentMethodType) => {
    switch (type) {
      case 'toss':
        return CreditCard;
      case 'keyin':
        return Keyboard;
      case 'bank':
        return Building2;
      case 'narabill':
        return FileText;
      case 'contract':
        return FileSignature;
      case 'other':
        return MoreHorizontal;
      default:
        return CreditCard;
    }
  };

  const availableMethods = PAYMENT_METHODS.filter(
    (m) => !excludeTypes.includes(m.type)
  );

  const selectedMethod = PAYMENT_METHODS.find((m) => m.type === value);
  const SelectedIcon = getIcon(value);

  // 선택 후 자동 접기 (Auto collapse after selection)
  const handleChange = (type: PaymentMethodType) => {
    onChange(type);
    if (collapsible) {
      setIsExpanded(false);
    }
  };

  // 피드백 4: 접힌 상태 - 선택된 항목만 컴팩트하게 표시
  if (collapsible && !isExpanded && selectedMethod) {
    return (
      <div className={cn('flex items-center justify-between', className)}>
        <div className="flex items-center gap-3">
          <div className="rounded-full p-2 bg-[#fab803]/20">
            <SelectedIcon className="h-4 w-4 text-[#1a2867]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{selectedMethod.label}</p>
            <p className="text-xs text-gray-500">{selectedMethod.description}</p>
          </div>
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
    );
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-3', className)}>
      {availableMethods.map((method) => {
        const Icon = getIcon(method.type);
        const isSelected = value === method.type;

        return (
          <button
            key={method.type}
            type="button"
            onClick={() => handleChange(method.type)}
            disabled={disabled}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
              isSelected
                ? 'border-[#fab803] bg-[#fab803]/5 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div
              className={cn(
                'rounded-full p-3',
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
                  isSelected ? 'text-gray-900' : 'text-gray-700'
                )}
              >
                {method.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 hidden md:block">
                {method.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ==================== 결제 수단 배지 (Payment Method Badge) ====================

interface MethodBadgeProps {
  type: PaymentMethodType;
  className?: string;
}

export function MethodBadge({ type, className }: MethodBadgeProps) {
  const method = PAYMENT_METHODS.find((m) => m.type === type);

  const colorMap: Record<PaymentMethodType, string> = {
    toss: 'bg-blue-100 text-blue-700',
    keyin: 'bg-purple-100 text-purple-700',
    bank: 'bg-green-100 text-green-700',
    narabill: 'bg-amber-100 text-amber-700',
    contract: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        colorMap[type],
        className
      )}
    >
      {method?.label}
    </span>
  );
}

// ==================== 결제 수단 라디오 그룹 (Payment Method Radio Group) ====================

interface MethodRadioGroupProps {
  value: PaymentMethodType;
  onChange: (value: PaymentMethodType) => void;
  disabled?: boolean;
  className?: string;
}

export function MethodRadioGroup({
  value,
  onChange,
  disabled = false,
  className,
}: MethodRadioGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {PAYMENT_METHODS.map((method) => {
        const isSelected = value === method.type;

        return (
          <label
            key={method.type}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors',
              isSelected
                ? 'border-[#fab803] bg-[#fab803]/5'
                : 'border-gray-200 hover:border-gray-300',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="radio"
              checked={isSelected}
              onChange={() => onChange(method.type)}
              disabled={disabled}
              className="h-4 w-4 text-[#fab803] focus:ring-[#fab803]"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{method.label}</p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>
            {method.autoReceipt && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                자동 영수증
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
}

export default MethodSelector;
