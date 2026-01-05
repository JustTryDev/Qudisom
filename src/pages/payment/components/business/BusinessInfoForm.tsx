// 사업자 정보 폼 컴포넌트 (Business Info Form Component)

import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { BusinessInfoFields } from '../../types';
import { TAX_TYPES, VALIDATION_RULES } from '../../utils/constants';
import { FieldError, RequiredMark, HelperText } from '../shared/ValidationMessage';

interface BusinessInfoFormProps {
  value: BusinessInfoFields;
  onChange: (value: BusinessInfoFields) => void;
  errors?: Partial<Record<keyof BusinessInfoFields, string>>;
  disabled?: boolean;
  showAllFields?: boolean; // true: 9필드, false: 4필드 (기본)
  className?: string;
}

export function BusinessInfoForm({
  value,
  onChange,
  errors = {},
  disabled = false,
  showAllFields = true,
  className,
}: BusinessInfoFormProps) {
  const handleChange = useCallback(
    (field: keyof BusinessInfoFields, fieldValue: string) => {
      onChange({ ...value, [field]: fieldValue });
    },
    [value, onChange]
  );

  // 사업자번호 포맷팅 (Business number formatting)
  const handleBusinessNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let rawValue = e.target.value.replace(/[^0-9]/g, '');
      if (rawValue.length > 10) {
        rawValue = rawValue.slice(0, 10);
      }
      // 자동 하이픈 삽입 (Auto hyphen insertion)
      let formatted = rawValue;
      if (rawValue.length > 3) {
        formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
      }
      if (rawValue.length > 5) {
        formatted = `${rawValue.slice(0, 3)}-${rawValue.slice(3, 5)}-${rawValue.slice(5)}`;
      }
      handleChange('businessNumber', formatted);
    },
    [handleChange]
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* 기본 필드 (Basic Fields) - 항상 표시 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 사업자등록번호 (Business Registration Number) */}
        <FormField
          label="사업자등록번호"
          required
          error={errors.businessNumber}
        >
          <input
            type="text"
            value={value.businessNumber}
            onChange={handleBusinessNumberChange}
            placeholder="000-00-00000"
            disabled={disabled}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              errors.businessNumber ? 'border-red-300' : 'border-gray-200'
            )}
          />
        </FormField>

        {/* 과세유형 (Tax Type) */}
        <FormField label="과세유형" error={errors.taxType}>
          <select
            value={value.taxType}
            onChange={(e) => handleChange('taxType', e.target.value)}
            disabled={disabled}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              errors.taxType ? 'border-red-300' : 'border-gray-200'
            )}
          >
            <option value="">선택</option>
            {TAX_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 회사명 (Company Name) */}
        <FormField label="회사명 (상호)" required error={errors.companyName}>
          <input
            type="text"
            value={value.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="주식회사 ○○○"
            disabled={disabled}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              errors.companyName ? 'border-red-300' : 'border-gray-200'
            )}
          />
        </FormField>

        {/* 대표자명 (CEO Name) */}
        <FormField label="대표자명" required error={errors.ceoName}>
          <input
            type="text"
            value={value.ceoName}
            onChange={(e) => handleChange('ceoName', e.target.value)}
            placeholder="홍길동"
            disabled={disabled}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400',
              errors.ceoName ? 'border-red-300' : 'border-gray-200'
            )}
          />
        </FormField>
      </div>

      {/* 상세 필드 (Detailed Fields) - showAllFields일 때만 표시 */}
      {showAllFields && (
        <>
          {/* 소재지 (Addresses) */}
          <FormField
            label="사업장 소재지"
            error={errors.businessAddress}
          >
            <input
              type="text"
              value={value.businessAddress}
              onChange={(e) => handleChange('businessAddress', e.target.value)}
              placeholder="서울시 강남구 테헤란로 123"
              disabled={disabled}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
                'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
                'disabled:bg-gray-50 disabled:text-gray-400',
                errors.businessAddress ? 'border-red-300' : 'border-gray-200'
              )}
            />
          </FormField>

          <FormField
            label="본점 소재지"
            helperText="사업장 소재지와 다른 경우에만 입력"
            error={errors.headquarterAddress}
          >
            <input
              type="text"
              value={value.headquarterAddress}
              onChange={(e) => handleChange('headquarterAddress', e.target.value)}
              placeholder="서울시 강남구 테헤란로 123"
              disabled={disabled}
              className={cn(
                'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
                'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
                'disabled:bg-gray-50 disabled:text-gray-400',
                errors.headquarterAddress ? 'border-red-300' : 'border-gray-200'
              )}
            />
          </FormField>

          {/* 업태/종목 (Business Type/Item) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="업태" error={errors.businessType}>
              <input
                type="text"
                value={value.businessType}
                onChange={(e) => handleChange('businessType', e.target.value)}
                placeholder="제조업"
                disabled={disabled}
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
                  'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
                  'disabled:bg-gray-50 disabled:text-gray-400',
                  errors.businessType ? 'border-red-300' : 'border-gray-200'
                )}
              />
            </FormField>

            <FormField label="종목" error={errors.businessItem}>
              <input
                type="text"
                value={value.businessItem}
                onChange={(e) => handleChange('businessItem', e.target.value)}
                placeholder="인형 제조"
                disabled={disabled}
                className={cn(
                  'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
                  'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
                  'disabled:bg-gray-50 disabled:text-gray-400',
                  errors.businessItem ? 'border-red-300' : 'border-gray-200'
                )}
              />
            </FormField>
          </div>
        </>
      )}

      {/* 세금계산서 이메일 (Tax Invoice Email) */}
      <FormField
        label="세금계산서 수신 이메일"
        required
        error={errors.taxEmail}
      >
        <input
          type="email"
          value={value.taxEmail}
          onChange={(e) => handleChange('taxEmail', e.target.value)}
          placeholder="tax@company.com"
          disabled={disabled}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm transition-colors',
            'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
            'disabled:bg-gray-50 disabled:text-gray-400',
            errors.taxEmail ? 'border-red-300' : 'border-gray-200'
          )}
        />
      </FormField>
    </div>
  );
}

// ==================== 폼 필드 래퍼 (Form Field Wrapper) ====================

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  required,
  error,
  helperText,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <RequiredMark />}
      </label>
      {children}
      {error && <FieldError error={error} />}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </div>
  );
}

// ==================== 사업자번호 검증 (Business Number Validation) ====================

export function validateBusinessNumber(value: string): boolean {
  return VALIDATION_RULES.BUSINESS_NUMBER_REGEX.test(value);
}

export function validateEmail(value: string): boolean {
  return VALIDATION_RULES.EMAIL_REGEX.test(value);
}

export function validateBusinessInfo(
  value: BusinessInfoFields,
  requiredOnly: boolean = false
): Partial<Record<keyof BusinessInfoFields, string>> {
  const errors: Partial<Record<keyof BusinessInfoFields, string>> = {};

  // 필수 필드 검증 (Required field validation)
  if (!value.businessNumber) {
    errors.businessNumber = '사업자등록번호를 입력해주세요';
  } else if (!validateBusinessNumber(value.businessNumber)) {
    errors.businessNumber = '올바른 사업자등록번호 형식이 아닙니다';
  }

  if (!value.companyName) {
    errors.companyName = '회사명을 입력해주세요';
  }

  if (!value.ceoName) {
    errors.ceoName = '대표자명을 입력해주세요';
  }

  if (!value.taxEmail) {
    errors.taxEmail = '이메일을 입력해주세요';
  } else if (!validateEmail(value.taxEmail)) {
    errors.taxEmail = '올바른 이메일 형식이 아닙니다';
  }

  return errors;
}

export default BusinessInfoForm;
