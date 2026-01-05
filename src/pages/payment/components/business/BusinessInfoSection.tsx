// 사업자 정보 입력 섹션 컴포넌트 (Business Info Section Component)
// OCR 자동 인식 + 수동 입력을 하나로 묶은 재사용 가능한 컴포넌트

import React, { useState, useCallback } from 'react';
import { CheckCircle, Edit3 } from 'lucide-react';
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
  const [isCollapsed, setIsCollapsed] = useState(false); // 🆕 접힌/펼친 상태

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
      setIsCollapsed(true); // 🆕 자동으로 접기
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
          <>
            {isCollapsed ? (
              /* 접힌 상태: 요약 카드 (Collapsed State: Summary Card) */
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">
                        사업자 정보 입력 완료
                      </p>
                      <p className="text-xs text-green-700 mt-0.5">
                        {businessInfo.companyName} ({businessInfo.businessNumber})
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCollapsed(false)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                    disabled={disabled}
                  >
                    수정
                    <Edit3 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              /* 펼친 상태: 전체 폼 (Expanded State: Full Form) */
              <div className="space-y-3">
                {ocrResult?.success && (
                  <OcrResultBanner
                    confidence={ocrResult.confidence}
                    onRescan={handleRescan}
                  />
                )}
                <BusinessInfoForm
                  value={businessInfo}
                  onChange={handleBusinessInfoChange}
                  disabled={disabled}
                  showAllFields={true}
                />
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors"
                  disabled={disabled}
                >
                  접기
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BusinessInfoSection;
