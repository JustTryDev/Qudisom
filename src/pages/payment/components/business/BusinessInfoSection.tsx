// 사업자 정보 입력 섹션 컴포넌트 (Business Info Section Component)
// OCR 자동 인식 + 수동 입력을 하나로 묶은 재사용 가능한 컴포넌트

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { BusinessInfoFields, OcrResult } from '../../types';
import { EMPTY_BUSINESS_INFO_FIELDS } from '../../utils/constants';
import { BusinessInfoForm } from './BusinessInfoForm';
import { OcrUploader, OcrResultBanner } from './OcrUploader';
import { OcrResultReview } from './OcrResultReview';

type InputMode = 'select' | 'ocr' | 'manual' | 'review';

interface BusinessInfoSectionProps {
  value?: BusinessInfoFields;
  onChange: (info: BusinessInfoFields) => void;
  title?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function BusinessInfoSection({
  value = EMPTY_BUSINESS_INFO_FIELDS,
  onChange,
  title = '사업자 등록증 첨부',
  description = 'OCR로 자동 인식하거나 직접 입력할 수 있습니다',
  disabled = false,
  className,
}: BusinessInfoSectionProps) {
  const [inputMode, setInputMode] = useState<InputMode>('select');
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfoFields>(value);

  // OCR 완료 핸들러 (OCR Complete Handler)
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

  // 수동 입력 전환 핸들러 (Manual Input Handler)
  const handleManualInput = useCallback(() => {
    setInputMode('manual');
  }, []);

  // OCR 결과 승인 핸들러 (OCR Accept Handler)
  const handleOcrAccept = useCallback(
    (info: BusinessInfoFields) => {
      setBusinessInfo(info);
      onChange(info);
      setInputMode('manual');
    },
    [onChange]
  );

  // OCR 결과 거부 핸들러 (OCR Reject Handler)
  const handleOcrReject = useCallback(() => {
    setOcrResult(null);
    setInputMode('select');
  }, []);

  // 사업자 정보 변경 핸들러 (Business Info Change Handler)
  const handleBusinessInfoChange = useCallback(
    (info: BusinessInfoFields) => {
      setBusinessInfo(info);
      onChange(info);
    },
    [onChange]
  );

  // 필드 수정 핸들러 (Field Edit Handler)
  const handleFieldEdit = useCallback(
    (field: keyof BusinessInfoFields, fieldValue: string) => {
      const updated = { ...businessInfo, [field]: fieldValue };
      setBusinessInfo(updated);
    },
    [businessInfo]
  );

  // 재스캔 핸들러 (Rescan Handler)
  const handleRescan = useCallback(() => {
    setOcrResult(null);
    setInputMode('select');
  }, []);

  return (
    <div className={cn('space-y-4', className)}>
      {/* 안내 메시지 (Notice) */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
        <p className="text-sm font-medium text-blue-900">{title}</p>
        <p className="text-xs text-blue-700 mt-1">{description}</p>
      </div>

      {/* 입력 영역 (Input Area) */}
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
    </div>
  );
}

export default BusinessInfoSection;
