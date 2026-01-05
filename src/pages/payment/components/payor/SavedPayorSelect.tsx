// 저장된 결제자 선택 컴포넌트 (Saved Payor Select Component)

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronDown, User, Building2, Clock, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SavedPayor, PayorInfo } from '../../types';

interface SavedPayorSelectProps {
  savedPayors: SavedPayor[];
  onSelect: (payor: PayorInfo) => void;
  onAddNew: () => void;
  disabled?: boolean;
  className?: string;
}

export function SavedPayorSelect({
  savedPayors,
  onSelect,
  onAddNew,
  disabled = false,
  className,
}: SavedPayorSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기 (Close on outside click)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (payor: SavedPayor) => {
      setSelectedId(payor.id);
      onSelect(payor.info);
      setIsOpen(false);
    },
    [onSelect]
  );

  const handleAddNew = useCallback(() => {
    setSelectedId(null);
    onAddNew();
    setIsOpen(false);
  }, [onAddNew]);

  const selectedPayor = savedPayors.find((p) => p.id === selectedId);

  if (savedPayors.length === 0) {
    return null;
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* 트리거 버튼 (Trigger Button) */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-colors',
          'hover:border-gray-300',
          isOpen ? 'border-[#fab803] ring-2 ring-[#fab803]/20' : 'border-gray-200',
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50'
        )}
      >
        <div className="flex items-center gap-3">
          {selectedPayor ? (
            <>
              <div
                className={cn(
                  'rounded-full p-1.5',
                  selectedPayor.info.type === 'company'
                    ? 'bg-purple-100'
                    : 'bg-blue-100'
                )}
              >
                {selectedPayor.info.type === 'company' ? (
                  <Building2 className="h-4 w-4 text-purple-600" />
                ) : (
                  <User className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {selectedPayor.label}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedPayor.info.email}
                </p>
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-500">
              저장된 결제자 정보 불러오기
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* 드롭다운 메뉴 (Dropdown Menu) */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg z-50 overflow-hidden">
          {/* 저장된 결제자 목록 (Saved Payors List) */}
          <div className="max-h-64 overflow-y-auto">
            {savedPayors.map((payor) => (
              <button
                key={payor.id}
                onClick={() => handleSelect(payor)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                  'hover:bg-gray-50',
                  selectedId === payor.id && 'bg-[#fab803]/5'
                )}
              >
                <div
                  className={cn(
                    'rounded-full p-2',
                    payor.info.type === 'company'
                      ? 'bg-purple-100'
                      : 'bg-blue-100'
                  )}
                >
                  {payor.info.type === 'company' ? (
                    <Building2 className="h-4 w-4 text-purple-600" />
                  ) : (
                    <User className="h-4 w-4 text-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {payor.label}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {payor.info.email}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* 최근 사용 표시 (Recent usage indicator) */}
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(payor.lastUsed)}
                  </div>

                  {/* 선택됨 표시 (Selected indicator) */}
                  {selectedId === payor.id && (
                    <Check className="h-4 w-4 text-[#fab803]" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* 새로 입력 버튼 (Add New Button) */}
          <div className="border-t border-gray-100">
            <button
              onClick={handleAddNew}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="rounded-full bg-gray-100 p-2">
                <Plus className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                새로 입력하기
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 저장된 결제자 카드 (Saved Payor Card) ====================

interface SavedPayorCardProps {
  payor: SavedPayor;
  isSelected?: boolean;
  onSelect: () => void;
  className?: string;
}

export function SavedPayorCard({
  payor,
  isSelected = false,
  onSelect,
  className,
}: SavedPayorCardProps) {
  const Icon = payor.info.type === 'company' ? Building2 : User;

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl border p-4 transition-all text-left',
        isSelected
          ? 'border-[#fab803] bg-[#fab803]/5'
          : 'border-gray-200 hover:border-gray-300',
        className
      )}
    >
      <div
        className={cn(
          'rounded-full p-2',
          payor.info.type === 'company' ? 'bg-purple-100' : 'bg-blue-100'
        )}
      >
        <Icon
          className={cn(
            'h-5 w-5',
            payor.info.type === 'company' ? 'text-purple-600' : 'text-blue-600'
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{payor.label}</p>
        <p className="text-xs text-gray-500 truncate">{payor.info.email}</p>
      </div>

      {isSelected && <Check className="h-5 w-5 text-[#fab803] shrink-0" />}
    </button>
  );
}

// ==================== 유틸리티 함수 (Utility Functions) ====================

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

export default SavedPayorSelect;
