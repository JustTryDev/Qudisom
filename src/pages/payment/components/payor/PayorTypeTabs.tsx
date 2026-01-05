// 결제자 유형 탭 컴포넌트 (Payor Type Tabs Component)

import React from 'react';
import { User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type PayorType = 'personal' | 'company';

interface PayorTypeTabsProps {
  value: PayorType;
  onChange: (value: PayorType) => void;
  disabled?: boolean;
  className?: string;
}

export function PayorTypeTabs({
  value,
  onChange,
  disabled = false,
  className,
}: PayorTypeTabsProps) {
  const tabs: { type: PayorType; label: string; icon: React.ElementType }[] = [
    { type: 'personal', label: '개인', icon: User },
    { type: 'company', label: '회사/기관', icon: Building2 },
  ];

  return (
    <div className={cn('flex rounded-xl bg-gray-100 p-1', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isSelected = value === tab.type;

        return (
          <button
            key={tab.type}
            type="button"
            onClick={() => onChange(tab.type)}
            disabled={disabled}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
              isSelected
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ==================== 결제자 유형 배지 (Payor Type Badge) ====================

interface PayorTypeBadgeProps {
  type: PayorType;
  className?: string;
}

export function PayorTypeBadge({ type, className }: PayorTypeBadgeProps) {
  const config = {
    personal: {
      icon: User,
      label: '개인',
      className: 'bg-blue-100 text-blue-700',
    },
    company: {
      icon: Building2,
      label: '회사/기관',
      className: 'bg-purple-100 text-purple-700',
    },
  }[type];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

// ==================== 결제자 유형 라디오 (Payor Type Radio) ====================

interface PayorTypeRadioProps {
  value: PayorType;
  onChange: (value: PayorType) => void;
  disabled?: boolean;
  className?: string;
}

export function PayorTypeRadio({
  value,
  onChange,
  disabled = false,
  className,
}: PayorTypeRadioProps) {
  const options: { type: PayorType; label: string; description: string; icon: React.ElementType }[] = [
    {
      type: 'personal',
      label: '개인',
      description: '개인 고객으로 결제합니다',
      icon: User,
    },
    {
      type: 'company',
      label: '회사/기관',
      description: '사업자로 결제합니다 (세금계산서 발행 가능)',
      icon: Building2,
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = value === option.type;

        return (
          <button
            key={option.type}
            type="button"
            onClick={() => onChange(option.type)}
            disabled={disabled}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all text-center',
              isSelected
                ? 'border-[#fab803] bg-[#fab803]/5'
                : 'border-gray-200 hover:border-gray-300',
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
                {option.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default PayorTypeTabs;
