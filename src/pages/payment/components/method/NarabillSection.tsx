// 나라빌 섹션 컴포넌트 (Narabill Section Component)

import React, { useCallback } from 'react';
import { FileText, ExternalLink, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileUploadData, UploadedFile } from '../../types';
import { FileUploader } from '../shared/FileUploader';

interface NarabillSectionProps {
  value: FileUploadData | null;
  onChange: (value: FileUploadData) => void;
  amount: number;
  disabled?: boolean;
  className?: string;
}

export function NarabillSection({
  value,
  onChange,
  amount,
  disabled = false,
  className,
}: NarabillSectionProps) {
  const data: FileUploadData = value || {
    type: 'narabill',
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

  return (
    <div className={cn('space-y-4', className)}>
      {/* 나라빌 안내 (Narabill Info) */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
        <FileText className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700">
          <p className="font-medium">나라빌 (공공기관 전자조달)</p>
          <p className="mt-1 text-xs">
            공공기관 전자조달 시스템을 통한 결제입니다.
            관련 서류를 업로드해주세요.
          </p>
        </div>
      </div>

      {/* 결제 금액 (Payment Amount) */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">결제 금액</span>
          <span className="text-lg font-bold text-gray-900">
            {amount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 서류 업로드 (Document Upload) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          관련 서류 업로드
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

      {/* 발주 가이드 입력 (Order Guide Input) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          발주 가이드 (선택)
        </label>
        <textarea
          value={data.instructions}
          onChange={handleInstructionsChange}
          placeholder="발주 시 참고할 사항이 있으면 입력해주세요"
          disabled={disabled}
          rows={3}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm transition-colors resize-none',
            'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
            'disabled:bg-gray-50 disabled:text-gray-400',
            'border-gray-200'
          )}
        />
      </div>

      {/* 추가 메모 (Additional Notes) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          추가 메모 (선택)
        </label>
        <textarea
          value={data.additionalNotes}
          onChange={handleNotesChange}
          placeholder="기타 참고 사항을 입력해주세요"
          disabled={disabled}
          rows={2}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm transition-colors resize-none',
            'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
            'disabled:bg-gray-50 disabled:text-gray-400',
            'border-gray-200'
          )}
        />
      </div>

      {/* 진행 안내 (Process Guide) */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">진행 절차 안내</p>
          <ol className="mt-1 space-y-0.5 text-xs list-decimal list-inside">
            <li>관련 서류 업로드</li>
            <li>담당자 확인 및 연락</li>
            <li>나라빌 시스템에서 발주 진행</li>
            <li>계약 체결 및 주문 확정</li>
          </ol>
        </div>
      </div>

      {/* 나라빌 링크 (Narabill Link) */}
      <a
        href="https://www.narabill.kr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span>나라빌 바로가기</span>
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

export default NarabillSection;
