// 세금계산서 폼 컴포넌트 (Tax Invoice Form Component)

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { ProofDocument, BusinessInfoFields, OcrResult } from '../../types';
import { EMPTY_BUSINESS_INFO_FIELDS } from '../../utils/constants';
import { BusinessInfoForm } from '../business/BusinessInfoForm';
import { BusinessInfoDisplay } from '../business/BusinessInfoDisplay';
import { OcrUploader, OcrResultBanner } from '../business/OcrUploader';
import { OcrResultReview } from '../business/OcrResultReview';
import { IssueDatePicker } from '../business/IssueDatePicker';

type InputMode = 'select' | 'ocr' | 'manual' | 'review';

interface TaxInvoiceFormProps {
  value: Partial<ProofDocument>;
  onChange: (value: Partial<ProofDocument>) => void;
  payorName?: string;
  payorBusinessInfo?: BusinessInfoFields;
  existingBusinessInfo?: BusinessInfoFields; // 🆕 상위에서 이미 입력된 사업자 정보
  disabled?: boolean;
  className?: string;
}

export function TaxInvoiceForm({
  value,
  onChange,
  payorName,
  payorBusinessInfo,
  existingBusinessInfo, // 🆕 상위에서 이미 입력된 사업자 정보
  disabled = false,
  className,
}: TaxInvoiceFormProps) {
  const [inputMode, setInputMode] = useState<InputMode>('select');
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfoFields>(
    EMPTY_BUSINESS_INFO_FIELDS
  );
  // 사업자 정보 접힘/펼침 상태 (existingBusinessInfo가 있으면 기본 접힘)
  const [isBusinessInfoCollapsed, setIsBusinessInfoCollapsed] = useState<boolean>(
    !!existingBusinessInfo
  );

  // 🆕 사업자 정보가 충분히 입력되었는지 확인 (회사명 + 사업자등록번호 필수)
  const hasValidBusinessInfo = !!(businessInfo.companyName && businessInfo.businessNumber);

  // 수령인은 항상 결제자와 동일 (피드백 3: 수령인 섹션 삭제)
  // Recipient is always same as payor (Feedback 3: Remove recipient section)

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
        recipientMode: 'same-as-payor',
      });
      // OCR 승인 시 바로 접힌 상태로 전환 (BusinessInfoSection 패턴 적용)
      setInputMode('manual');
      setIsBusinessInfoCollapsed(true);
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
    },
    []
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
      {/* 사업자 정보 입력/표시 (Business Info Input/Display) */}
      {/* BusinessInfoSection.tsx 패턴으로 단순화 */}
      {existingBusinessInfo ? (
        /* existingBusinessInfo가 있는 경우 (나라빌/수의계약에서 전달됨) */
        isBusinessInfoCollapsed ? (
          <BusinessInfoDisplay
            info={existingBusinessInfo}
            title="사업자 정보가 입력되었습니다"
            onEdit={() => setIsBusinessInfoCollapsed(false)}
          />
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
              <p className="text-sm font-medium text-amber-900">
                사업자 정보를 수정하고 있습니다
              </p>
              <p className="text-xs text-amber-700 mt-1">
                수정이 완료되면 아래 '확인 완료' 버튼을 눌러주세요
              </p>
            </div>
            <BusinessInfoForm
              value={businessInfo}
              onChange={handleBusinessInfoChange}
              disabled={disabled}
              showAllFields={true}
            />
            <button
              type="button"
              onClick={() => setIsBusinessInfoCollapsed(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1a2867] text-white text-sm font-medium hover:bg-[#2a3877] transition-colors"
            >
              확인 완료
            </button>
          </div>
        )
      ) : (
        /* existingBusinessInfo가 없는 경우 - 직접 입력 (무통장 입금 등) */
        <div className="space-y-4">
          {/* 입력 방식 선택 (Input Mode Selection) */}
          {inputMode === 'select' && (
            <>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-sm font-medium text-blue-900">
                  세금계산서 발행을 위해 사업자 등록증을 첨부해주세요
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  OCR로 자동 인식하거나 직접 입력할 수 있습니다
                </p>
              </div>
              <OcrUploader
                onOcrComplete={handleOcrComplete}
                onManualInput={handleManualInput}
                disabled={disabled}
              />
            </>
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

          {/* 사업자 정보 폼 (Business Info Form) - BusinessInfoSection 패턴 적용 */}
          {inputMode === 'manual' && (
            isBusinessInfoCollapsed ? (
              /* 접힌 상태: 요약 카드 (Collapsed State) */
              <BusinessInfoDisplay
                info={businessInfo}
                title="사업자 정보 입력 완료"
                onEdit={() => setIsBusinessInfoCollapsed(false)}
              />
            ) : (
              /* 펼친 상태: 전체 폼 (Expanded State) */
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
                {hasValidBusinessInfo && (
                  <button
                    type="button"
                    onClick={() => setIsBusinessInfoCollapsed(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1a2867] text-white text-sm font-medium hover:bg-[#2a3877] transition-colors"
                  >
                    확인 완료
                  </button>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* 3. 발행 희망 날짜 (Preferred Issue Date) - 하단으로 이동 */}
      <div className="pt-4 border-t border-gray-200">
        <IssueDatePicker
          value={value.issueDate}
          onChange={handleIssueDateChange}
          preferredDate={value.preferredIssueDate || false}
          onPreferredChange={handlePreferredDateChange}
          disabled={disabled}
        />
      </div>
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
  // 피드백 3: 수령인은 항상 결제자와 동일
  // Feedback 3: Recipient is always same as payor
  return (
    <div className={cn('space-y-2', className)}>
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
