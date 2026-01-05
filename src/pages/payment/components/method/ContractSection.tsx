// 수의 계약 섹션 컴포넌트 (Direct Contract Section Component)

import React, { useCallback, useState } from 'react';
import { FileSignature, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileUploadData, UploadedFile, BusinessInfoFields } from '../../types';
import { FileUploader } from '../shared/FileUploader';
import { BusinessInfoSection } from '../business/BusinessInfoSection';

interface ContractSectionProps {
  value: FileUploadData | null;
  onChange: (value: FileUploadData) => void;
  amount: number;
  disabled?: boolean;
  className?: string;
}

export function ContractSection({
  value,
  onChange,
  amount,
  disabled = false,
  className,
}: ContractSectionProps) {
  const data: FileUploadData = value || {
    type: 'contract',
    files: [],
    instructions: '',
    additionalNotes: '',
  };

  const handleFilesChange = useCallback(
    (files: UploadedFile[]) => {
      onChange({ ...data, files });
    },
    [data, onChange]
  );

  const handleInstructionsChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...data, instructions: e.target.value });
    },
    [data, onChange]
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...data, additionalNotes: e.target.value });
    },
    [data, onChange]
  );

  // 사업자 정보 변경 핸들러 (Business Info Change Handler)
  const handleBusinessInfoChange = useCallback(
    (businessInfo: BusinessInfoFields) => {
      onChange({ ...data, businessInfo });
    },
    [data, onChange]
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* 수의 계약 안내 (Direct Contract Info) */}
      <div className="flex items-start gap-3 rounded-xl bg-pink-50 border border-pink-100 px-4 py-3">
        <FileSignature className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
        <div className="text-sm text-pink-700">
          <p className="font-medium">수의 계약</p>
          <p className="mt-1 text-xs">
            수의계약서를 기반으로 진행하는 계약 방식입니다.
            관련 서류를 업로드해주세요.
          </p>
        </div>
      </div>

      {/* 결제 금액 (Payment Amount) */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">계약 금액</span>
          <span className="text-lg font-bold text-gray-900">
            {amount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 사업자 등록증 (Business Registration Certificate) */}
      <BusinessInfoSection
        value={data.businessInfo}
        onChange={handleBusinessInfoChange}
        title="사업자 등록증 첨부"
        description="수의계약 체결을 위해 사업자 등록증이 필요합니다"
        disabled={disabled}
      />

      {/* 서류 업로드 (Document Upload) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          수의계약서 및 관련 서류 업로드
        </label>
        <FileUploader
          files={data.files}
          onFilesChange={handleFilesChange}
          accept=".pdf,.doc,.docx,.hwp,.jpg,.jpeg,.png"
          maxFiles={5}
          description="PDF, DOC, HWP, 이미지 파일 (최대 5개)"
          showInstructions
          instructionsPlaceholder="이 파일에 대한 수정 요청 또는 코멘트를 입력해주세요"
          disabled={disabled}
        />
      </div>

      {/* 주의사항 (Warning) */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700">
          <p className="font-medium">수의계약 진행 안내</p>
          <ul className="mt-1 space-y-0.5 text-xs">
            <li>• 계약서 검토 후 담당자가 연락드립니다</li>
            <li>• 계약 체결 전까지 생산이 시작되지 않습니다</li>
            <li>• 계약 조건에 따라 결제 일정이 조정될 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ContractSection;
