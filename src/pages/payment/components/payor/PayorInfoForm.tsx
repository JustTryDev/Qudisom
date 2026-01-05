// 결제자 정보 폼 컴포넌트 (Payor Info Form Component)
// 간소화 버전: 기본 정보만 수집, 사업자 정보는 MethodStep에서 필요 시 수집

import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import type { PayorInfo, PayorType, SavedPayor } from '../../types';
import { VALIDATION_RULES } from '../../utils/constants';
import { PayorTypeTabs, PayorTypeRadio } from './PayorTypeTabs';
import { SavedPayorSelect } from './SavedPayorSelect';
import { FieldError, HelperText } from '../shared/ValidationMessage';

interface PayorInfoFormProps {
  value: PayorInfo;
  onChange: (value: PayorInfo) => void;
  savedPayors?: SavedPayor[];
  showSavedPayors?: boolean;
  showSaveCheckbox?: boolean;
  savePayor?: boolean;
  onSavePayorChange?: (save: boolean) => void;
  errors?: Partial<Record<keyof PayorInfo, string>>;
  disabled?: boolean;
  typeSelector?: 'tabs' | 'radio';
  className?: string;
}

export function PayorInfoForm({
  value,
  onChange,
  savedPayors = [],
  showSavedPayors = true,
  showSaveCheckbox = true,
  savePayor = false,
  onSavePayorChange,
  errors = {},
  disabled = false,
  typeSelector = 'tabs',
  className,
}: PayorInfoFormProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleFieldChange = useCallback(
    (field: keyof PayorInfo, fieldValue: string) => {
      onChange({ ...value, [field]: fieldValue });
    },
    [value, onChange]
  );

  const handleTypeChange = useCallback(
    (type: PayorType) => {
      onChange({
        ...value,
        type,
        company: type === 'company' ? value.company : '',
        // businessInfo는 MethodStep에서 결제 수단 선택 시에만 수집
      });
    },
    [value, onChange]
  );

  const handleSavedPayorSelect = useCallback(
    (payor: PayorInfo) => {
      onChange(payor);
    },
    [onChange]
  );

  const handleAddNewPayor = useCallback(() => {
    onChange({
      source: 'other',
      type: 'individual',
      name: '',
      company: '',
      phone: '',
      email: '',
    });
  }, [onChange]);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/[^0-9]/g, '');
      if (val.length > 11) val = val.slice(0, 11);

      // 포맷팅 (Formatting)
      let formatted = val;
      if (val.length > 3) {
        formatted = `${val.slice(0, 3)}-${val.slice(3)}`;
      }
      if (val.length > 7) {
        formatted = `${val.slice(0, 3)}-${val.slice(3, 7)}-${val.slice(7)}`;
      }

      handleFieldChange('phone', formatted);
    },
    [handleFieldChange]
  );

  const isCompany = value.type === 'company';
  const allErrors = { ...errors, ...localErrors };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 저장된 결제자 선택 (Saved Payor Select) */}
      {showSavedPayors && savedPayors.length > 0 && (
        <SavedPayorSelect
          savedPayors={savedPayors}
          onSelect={handleSavedPayorSelect}
          onAddNew={handleAddNewPayor}
          disabled={disabled}
        />
      )}

      {/* 결제자 유형 선택 (Payor Type Selection) */}
      {typeSelector === 'tabs' ? (
        <PayorTypeTabs
          value={value.type}
          onChange={handleTypeChange}
          disabled={disabled}
        />
      ) : (
        <PayorTypeRadio
          value={value.type}
          onChange={handleTypeChange}
          disabled={disabled}
        />
      )}

      {/* 기본 정보 (Basic Info) */}
      <div className="space-y-4">
        {/* 이름 (Name) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            {isCompany ? '담당자명' : '이름'}
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            value={value.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder={isCompany ? '담당자명을 입력해주세요' : '이름을 입력해주세요'}
            disabled={disabled}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              allErrors.name ? 'border-red-300' : 'border-gray-200'
            )}
          />
          {allErrors.name && <FieldError error={allErrors.name} />}
        </div>

        {/* 회사명 (Company Name) - 회사인 경우만 */}
        {isCompany && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              회사명 (상호)
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={value.company || ''}
              onChange={(e) => handleFieldChange('company', e.target.value)}
              placeholder="회사명을 입력해주세요"
              disabled={disabled}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
                'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
                'disabled:bg-gray-50 disabled:text-gray-400',
                allErrors.company ? 'border-red-300' : 'border-gray-200'
              )}
            />
            {allErrors.company && <FieldError error={allErrors.company} />}
          </div>
        )}

        {/* 연락처 (Phone) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            연락처
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={value.phone}
            onChange={handlePhoneChange}
            placeholder="010-0000-0000"
            disabled={disabled}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              allErrors.phone ? 'border-red-300' : 'border-gray-200'
            )}
          />
          {allErrors.phone && <FieldError error={allErrors.phone} />}
        </div>

        {/* 이메일 (Email) */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            이메일
            <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="email"
            value={value.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="email@example.com"
            disabled={disabled}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              allErrors.email ? 'border-red-300' : 'border-gray-200'
            )}
          />
          {allErrors.email && <FieldError error={allErrors.email} />}
          <HelperText>결제 관련 안내가 발송됩니다</HelperText>
        </div>
      </div>

      {/* 사업자 정보는 MethodStep에서 결제 수단 선택 시 필요한 경우에만 수집 */}
      {/* (Business info is only collected in MethodStep when needed for the selected payment method) */}

      {/* 정보 저장 체크박스 (Save Info Checkbox) */}
      {showSaveCheckbox && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={savePayor}
            onChange={(e) => onSavePayorChange?.(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-[#fab803] focus:ring-[#fab803]"
          />
          <span className="text-sm text-gray-700">
            다음 주문을 위해 결제자 정보 저장하기
          </span>
        </label>
      )}
    </div>
  );
}

// ==================== 결제자 정보 요약 (Payor Info Summary) ====================

interface PayorInfoSummaryProps {
  payor: PayorInfo;
  className?: string;
}

export function PayorInfoSummary({ payor, className }: PayorInfoSummaryProps) {
  const isCompany = payor.type === 'company';

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">유형</span>
        <span className="font-medium text-gray-900">
          {isCompany ? '회사/기관' : '개인'}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {isCompany ? '담당자' : '이름'}
        </span>
        <span className="font-medium text-gray-900">{payor.name}</span>
      </div>
      {isCompany && payor.company && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">회사명</span>
          <span className="font-medium text-gray-900">{payor.company}</span>
        </div>
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">연락처</span>
        <span className="font-medium text-gray-900">{payor.phone}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">이메일</span>
        <span className="font-medium text-gray-900">{payor.email}</span>
      </div>
    </div>
  );
}

// ==================== 검증 함수 (Validation Function) ====================

export function validatePayorInfo(
  payor: PayorInfo
): Partial<Record<keyof PayorInfo, string>> {
  const errors: Partial<Record<keyof PayorInfo, string>> = {};

  if (!payor.name.trim()) {
    errors.name = '이름을 입력해주세요';
  }

  if (payor.type === 'company' && !payor.company?.trim()) {
    errors.company = '회사명을 입력해주세요';
  }

  if (!payor.phone.trim()) {
    errors.phone = '연락처를 입력해주세요';
  } else if (!VALIDATION_RULES.PHONE_REGEX.test(payor.phone)) {
    errors.phone = '올바른 연락처 형식이 아닙니다';
  }

  if (!payor.email.trim()) {
    errors.email = '이메일을 입력해주세요';
  } else if (!VALIDATION_RULES.EMAIL_REGEX.test(payor.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다';
  }

  return errors;
}

export default PayorInfoForm;
