// OCR 결과 검토 컴포넌트 (OCR Result Review Component)

import React, { useState, useCallback } from 'react';
import { Check, X, AlertTriangle, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BusinessInfoFields, BusinessInfo, OcrResult } from '../../types';
import { VALIDATION_RULES } from '../../utils/constants';

interface OcrResultReviewProps {
  ocrResult: OcrResult;
  currentValue: BusinessInfoFields;
  originalValue?: BusinessInfoFields;
  onAccept: (value: BusinessInfoFields) => void;
  onReject: () => void;
  onFieldEdit: (field: keyof BusinessInfoFields, value: string) => void;
  className?: string;
}

export function OcrResultReview({
  ocrResult,
  currentValue,
  originalValue,
  onAccept,
  onReject,
  onFieldEdit,
  className,
}: OcrResultReviewProps) {
  const [editingField, setEditingField] = useState<keyof BusinessInfoFields | null>(
    null
  );

  const fields: {
    key: keyof BusinessInfoFields;
    label: string;
    required: boolean;
  }[] = [
    { key: 'businessNumber', label: '사업자등록번호', required: true },
    { key: 'taxType', label: '과세유형', required: false },
    { key: 'companyName', label: '회사명', required: true },
    { key: 'ceoName', label: '대표자명', required: true },
    { key: 'businessAddress', label: '사업장 소재지', required: false },
    { key: 'headquarterAddress', label: '본점 소재지', required: false },
    { key: 'businessType', label: '업태', required: false },
    { key: 'businessItem', label: '종목', required: false },
    { key: 'taxEmail', label: '세금계산서 이메일', required: true },
  ];

  const getFieldConfidence = (key: keyof BusinessInfoFields): number => {
    // OCR 결과에서 필드별 신뢰도 계산 (Calculate per-field confidence from OCR result)
    if (!ocrResult.data?.[key]) return 0;
    return ocrResult.confidence;
  };

  const isFieldModified = (key: keyof BusinessInfoFields): boolean => {
    if (!originalValue) return false;
    return currentValue[key] !== originalValue[key];
  };

  const needsReview = (key: keyof BusinessInfoFields): boolean => {
    const confidence = getFieldConfidence(key);
    return confidence > 0 && confidence < VALIDATION_RULES.OCR_CONFIDENCE_THRESHOLD;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 헤더 (Header) */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">
          인식 결과 확인
        </h4>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            인식됨
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            확인 필요
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            인식 실패
          </span>
        </div>
      </div>

      {/* 필드 목록 (Field List) */}
      <div className="space-y-2">
        {fields.map(({ key, label, required }) => {
          const value = currentValue[key];
          const confidence = getFieldConfidence(key);
          const modified = isFieldModified(key);
          const review = needsReview(key);
          const isEditing = editingField === key;

          return (
            <OcrFieldRow
              key={key}
              label={label}
              value={value}
              required={required}
              confidence={confidence}
              modified={modified}
              needsReview={review}
              isEditing={isEditing}
              onEdit={() => setEditingField(key)}
              onSave={(newValue) => {
                onFieldEdit(key, newValue);
                setEditingField(null);
              }}
              onCancel={() => setEditingField(null)}
            />
          );
        })}
      </div>

      {/* 액션 버튼 (Action Buttons) */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onReject}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X className="h-4 w-4" />
          다시 스캔
        </button>
        <button
          onClick={() => onAccept(currentValue)}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#fab803] text-white text-sm font-semibold hover:bg-[#e5a800] transition-colors"
        >
          <Check className="h-4 w-4" />
          확인 완료
        </button>
      </div>
    </div>
  );
}

// ==================== OCR 필드 행 (OCR Field Row) ====================

interface OcrFieldRowProps {
  label: string;
  value: string;
  required: boolean;
  confidence: number;
  modified: boolean;
  needsReview: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
}

function OcrFieldRow({
  label,
  value,
  required,
  confidence,
  modified,
  needsReview,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}: OcrFieldRowProps) {
  const [editValue, setEditValue] = useState(value);

  const handleSave = useCallback(() => {
    onSave(editValue);
  }, [editValue, onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    },
    [handleSave, onCancel]
  );

  const getStatusColor = () => {
    if (!value && required) return 'bg-red-500';
    if (needsReview) return 'bg-amber-500';
    if (value) return 'bg-green-500';
    return 'bg-gray-300';
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors',
        needsReview && 'border-amber-200 bg-amber-50',
        !needsReview && 'border-gray-100 bg-gray-50'
      )}
    >
      {/* 상태 표시 (Status Indicator) */}
      <div className={cn('w-2 h-2 rounded-full shrink-0', getStatusColor())} />

      {/* 라벨 (Label) */}
      <div className="w-28 shrink-0">
        <span className="text-sm text-gray-600">{label}</span>
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </div>

      {/* 값 (Value) */}
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20"
          />
          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 flex items-center gap-2">
            <span
              className={cn(
                'text-sm',
                value ? 'text-gray-900' : 'text-gray-400 italic'
              )}
            >
              {value || '인식 실패'}
            </span>
            {modified && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                수정됨
              </span>
            )}
            {needsReview && !modified && (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
          </div>

          <button
            onClick={onEdit}
            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

// ==================== 수정 사항 경고 (Modification Warning) ====================

interface ModificationWarningProps {
  modifiedFields: string[];
  onKeepChanges: () => void;
  onDiscardChanges: () => void;
  className?: string;
}

export function ModificationWarning({
  modifiedFields,
  onKeepChanges,
  onDiscardChanges,
  className,
}: ModificationWarningProps) {
  if (modifiedFields.length === 0) return null;

  return (
    <div
      className={cn(
        'rounded-xl border border-blue-200 bg-blue-50 p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-900">
            기존 수정 사항이 있습니다
          </p>
          <p className="text-sm text-blue-700 mt-1">
            수정한 필드: {modifiedFields.join(', ')}
          </p>
          <div className="flex gap-3 mt-3">
            <button
              onClick={onKeepChanges}
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              수정 사항 유지
            </button>
            <button
              onClick={onDiscardChanges}
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              새 스캔 결과로 덮어쓰기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OcrResultReview;
