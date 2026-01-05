// 세금계산서 폼 컴포넌트 (Tax Invoice Form Component)

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { ProofDocument, BusinessInfoFields, OcrResult } from '../../types';
import { EMPTY_BUSINESS_INFO_FIELDS } from '../../utils/constants';
import { BusinessInfoForm } from '../business/BusinessInfoForm';
import { OcrUploader, OcrResultBanner } from '../business/OcrUploader';
import { OcrResultReview } from '../business/OcrResultReview';
import { IssueDatePicker } from '../business/IssueDatePicker';
import { RecipientModeSelector } from './ProofSelector';

type InputMode = 'select' | 'ocr' | 'manual' | 'review';

interface TaxInvoiceFormProps {
  value: Partial<ProofDocument>;
  onChange: (value: Partial<ProofDocument>) => void;
  payorName?: string;
  payorBusinessInfo?: BusinessInfoFields;
  disabled?: boolean;
  className?: string;
}

export function TaxInvoiceForm({
  value,
  onChange,
  payorName,
  payorBusinessInfo,
  disabled = false,
  className,
}: TaxInvoiceFormProps) {
  const [inputMode, setInputMode] = useState<InputMode>('select');
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfoFields>(
    value.differentRecipient || EMPTY_BUSINESS_INFO_FIELDS
  );

  const recipientMode = value.recipientMode || 'same-as-payor';

  const handleRecipientModeChange = useCallback(
    (mode: 'same-as-payor' | 'different') => {
      onChange({
        ...value,
        recipientMode: mode,
        differentRecipient: mode === 'different' ? businessInfo : undefined,
      });
      if (mode === 'different' && inputMode === 'select') {
        setInputMode('select');
      }
    },
    [value, onChange, businessInfo, inputMode]
  );

  const handleOcrComplete = useCallback(
    (result: OcrResult) => {
      setOcrResult(result);
      if (result.success && result.data) {
        setBusinessInfo(result.data);
        setInputMode('review');
      }
    },
    []
  );

  const handleManualInput = useCallback(() => {
    setInputMode('manual');
  }, []);

  const handleOcrAccept = useCallback(
    (info: BusinessInfoFields) => {
      setBusinessInfo(info);
      onChange({
        ...value,
        recipientMode: 'different',
        differentRecipient: info,
      });
      setInputMode('manual');
    },
    [value, onChange]
  );

  const handleOcrReject = useCallback(() => {
    setOcrResult(null);
    setInputMode('select');
  }, []);

  const handleBusinessInfoChange = useCallback(
    (info: BusinessInfoFields) => {
      setBusinessInfo(info);
      onChange({
        ...value,
        differentRecipient: info,
      });
    },
    [value, onChange]
  );

  const handleFieldEdit = useCallback(
    (field: keyof BusinessInfoFields, fieldValue: string) => {
      const updated = { ...businessInfo, [field]: fieldValue };
      setBusinessInfo(updated);
    },
    [businessInfo]
  );

  const handleRescan = useCallback(() => {
    setOcrResult(null);
    setInputMode('select');
  }, []);

  const handleIssueDateChange = useCallback(
    (date: string | undefined) => {
      onChange({
        ...value,
        issueDate: date,
      });
    },
    [value, onChange]
  );

  const handlePreferredDateChange = useCallback(
    (preferred: boolean) => {
      onChange({
        ...value,
        preferredIssueDate: preferred,
        issueDate: preferred ? value.issueDate : undefined,
      });
    },
    [value, onChange]
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* 사업자 등록증 첨부 안내 (Business Registration Notice) */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
        <p className="text-sm font-medium text-blue-900">
          세금계산서 발행을 위해 사업자 등록증을 첨부해주세요
        </p>
        <p className="text-xs text-blue-700 mt-1">
          OCR로 자동 인식하거나 직접 입력할 수 있습니다
        </p>
      </div>

      {/* 사업자 정보 입력 (Business Info Input) - 무조건 표시 */}
      <div className="space-y-4">
        {/* OCR 결과 배너 (OCR Result Banner) */}
        {ocrResult?.success && inputMode === 'manual' && (
          <OcrResultBanner
            confidence={ocrResult.confidence}
            onRescan={handleRescan}
          />
        )}

        {/* 입력 방식 선택 (Input Mode Selection) */}
        {inputMode === 'select' && (
          <OcrUploader
            onOcrComplete={handleOcrComplete}
            onManualInput={handleManualInput}
            disabled={disabled}
          />
        )}

        {/* OCR 결과 검토 (OCR Result Review) */}
        {inputMode === 'review' && ocrResult && (
          <OcrResultReview
            ocrResult={ocrResult}
            currentValue={businessInfo}
            onAccept={handleOcrAccept}
            onReject={handleOcrReject}
            onFieldEdit={handleFieldEdit}
          />
        )}

        {/* 사업자 정보 폼 (Business Info Form) */}
        {inputMode === 'manual' && (
          <BusinessInfoForm
            value={businessInfo}
            onChange={handleBusinessInfoChange}
            disabled={disabled}
            showAllFields={true}
          />
        )}
      </div>

      {/* 발행 희망 날짜 (Preferred Issue Date) */}
      <IssueDatePicker
        value={value.issueDate}
        onChange={handleIssueDateChange}
        preferredDate={value.preferredIssueDate || false}
        onPreferredChange={handlePreferredDateChange}
        disabled={disabled}
      />
    </div>
  );
}

// ==================== 세금계산서 요약 (Tax Invoice Summary) ====================

interface TaxInvoiceSummaryProps {
  proof: Partial<ProofDocument>;
  payorName?: string;
  className?: string;
}

export function TaxInvoiceSummary({
  proof,
  payorName,
  className,
}: TaxInvoiceSummaryProps) {
  const recipientName =
    proof.recipientMode === 'same-as-payor'
      ? payorName
      : proof.differentRecipient?.companyName;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">수령인</span>
        <span className="font-medium text-gray-900">{recipientName || '-'}</span>
      </div>
      {proof.preferredIssueDate && proof.issueDate && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">발행 희망일</span>
          <span className="font-medium text-gray-900">
            {formatDate(proof.issueDate)}
          </span>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default TaxInvoiceForm;
