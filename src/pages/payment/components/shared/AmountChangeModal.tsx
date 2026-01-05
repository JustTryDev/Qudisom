// 금액 변경 모달 컴포넌트 (Amount Change Modal Component)

import React from 'react';
import { AlertTriangle, RotateCcw, Plus, Edit3, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AmountChangeResult, AmountAdjustAction } from '../../types';
import { formatAmount } from './AmountInput';

interface AmountChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  changeResult: AmountChangeResult;
  onSelectAction: (action: AmountAdjustAction) => void;
  className?: string;
}

export function AmountChangeModal({
  isOpen,
  onClose,
  changeResult,
  onSelectAction,
  className,
}: AmountChangeModalProps) {
  if (!isOpen) return null;

  const { originalAmount, newAmount, difference, affectedMethods, suggestedAction } =
    changeResult;
  const isIncrease = difference > 0;

  const actions: {
    action: AmountAdjustAction;
    icon: React.ElementType;
    label: string;
    description: string;
    recommended: boolean;
  }[] = [
    {
      action: 'adjust-last',
      icon: ArrowRight,
      label: '마지막 항목에 반영',
      description: `마지막 결제 수단에 ${isIncrease ? '+' : ''}${formatAmount(difference)}원 반영`,
      recommended: suggestedAction === 'adjust-last',
    },
    {
      action: 'add-new',
      icon: Plus,
      label: '새 결제 수단 추가',
      description: `${Math.abs(difference).toLocaleString()}원 결제 수단 새로 추가`,
      recommended: suggestedAction === 'add-new' && isIncrease,
    },
    {
      action: 'manual',
      icon: Edit3,
      label: '직접 수정',
      description: '결제 수단 금액을 직접 수정합니다',
      recommended: suggestedAction === 'manual',
    },
    {
      action: 'reset',
      icon: RotateCcw,
      label: '초기화',
      description: '모든 결제 수단을 초기화합니다',
      recommended: suggestedAction === 'reset',
    },
  ].filter((a) => {
    // 금액 감소 시 add-new 제외 (Exclude add-new when amount decreases)
    if (!isIncrease && a.action === 'add-new') return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 (Background Overlay) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 (Modal Content) */}
      <div
        className={cn(
          'relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl',
          className
        )}
      >
        {/* 헤더 (Header) */}
        <div className="flex items-start gap-4 mb-6">
          <div className="rounded-full bg-amber-100 p-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              결제 금액이 변경되었습니다
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              기존 결제 수단 금액을 어떻게 처리할지 선택해주세요
            </p>
          </div>
        </div>

        {/* 금액 변경 정보 (Amount Change Info) */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">변경 전</span>
            <span className="text-sm font-medium text-gray-900">
              {formatAmount(originalAmount)}원
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">변경 후</span>
            <span className="text-sm font-medium text-gray-900">
              {formatAmount(newAmount)}원
            </span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">차액</span>
              <span
                className={cn(
                  'text-sm font-semibold',
                  isIncrease ? 'text-red-600' : 'text-blue-600'
                )}
              >
                {isIncrease ? '+' : ''}
                {formatAmount(difference)}원
              </span>
            </div>
          </div>
        </div>

        {/* 영향받는 항목 (Affected Items) */}
        {affectedMethods.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              영향받는 결제 수단
            </p>
            <div className="space-y-1.5">
              {affectedMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">결제 수단</span>
                  <span className="text-gray-900">
                    {formatAmount(method.amount)}원
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 액션 버튼 (Action Buttons) */}
        <div className="space-y-2">
          {actions.map(({ action, icon: Icon, label, description, recommended }) => (
            <button
              key={action}
              onClick={() => {
                onSelectAction(action);
                onClose();
              }}
              className={cn(
                'w-full flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                recommended
                  ? 'border-[#fab803] bg-[#fab803]/5 hover:bg-[#fab803]/10'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div
                className={cn(
                  'rounded-lg p-2',
                  recommended ? 'bg-[#fab803]/20' : 'bg-gray-100'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4',
                    recommended ? 'text-[#1a2867]' : 'text-gray-500'
                  )}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {label}
                  </span>
                  {recommended && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-[#fab803] text-white">
                      권장
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* 취소 버튼 (Cancel Button) */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default AmountChangeModal;
