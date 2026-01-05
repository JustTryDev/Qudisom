// OCR 업로더 컴포넌트 (OCR Uploader Component)

import React, { useState, useCallback, useRef } from 'react';
import { Upload, Camera, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BusinessInfoFields, OcrResult } from '../../types';

interface OcrUploaderProps {
  onOcrComplete: (result: OcrResult) => void;
  onManualInput: () => void;
  disabled?: boolean;
  className?: string;
}

export function OcrUploader({
  onOcrComplete,
  onManualInput,
  disabled = false,
  className,
}: OcrUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processOcr = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);

      try {
        // 이미지 미리보기 생성 (Create image preview)
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // OCR API 호출 시뮬레이션 (Simulate OCR API call)
        // 실제 구현 시 API 호출로 대체 (Replace with actual API call in production)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 샘플 OCR 결과 (Sample OCR result)
        const mockResult: OcrResult = {
          success: true,
          confidence: 0.92,
          data: {
            businessNumber: '123-45-67890',
            taxType: '일반과세자',
            companyName: '주식회사 테스트',
            ceoName: '홍길동',
            businessAddress: '서울시 강남구 테헤란로 123',
            headquarterAddress: '',
            businessType: '제조업',
            businessItem: '인형 제조',
            taxEmail: '',
          },
        };

        onOcrComplete(mockResult);
      } catch (err) {
        setError('OCR 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        onOcrComplete({
          success: false,
          confidence: 0,
          errors: [{ field: 'businessNumber', message: 'OCR 실패' }],
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [onOcrComplete]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processOcr(file);
      }
      // 같은 파일 재선택 허용 (Allow reselecting same file)
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [processOcr]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled || isProcessing) return;

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        processOcr(file);
      }
    },
    [disabled, isProcessing, processOcr]
  );

  const handleClick = useCallback(() => {
    if (!disabled && !isProcessing && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled, isProcessing]);

  const handleRetry = useCallback(() => {
    setError(null);
    setPreviewUrl(null);
    handleClick();
  }, [handleClick]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* 업로드 영역 (Upload Area) */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer',
          isProcessing && 'pointer-events-none',
          !isProcessing && 'hover:border-[#fab803] hover:bg-[#fab803]/5',
          error ? 'border-red-300' : 'border-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || isProcessing}
          className="hidden"
        />

        {/* 처리 중 상태 (Processing State) */}
        {isProcessing && (
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Processing"
                  className="w-24 h-24 rounded-lg object-cover opacity-50"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#fab803] animate-spin" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-700">
              사업자등록증을 분석하고 있습니다...
            </p>
          </div>
        )}

        {/* 에러 상태 (Error State) */}
        {error && !isProcessing && (
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-sm text-red-600 text-center">{error}</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 text-sm font-medium text-[#fab803] hover:underline"
            >
              <RefreshCw className="h-4 w-4" />
              다시 시도
            </button>
          </div>
        )}

        {/* 기본 상태 (Default State) */}
        {!isProcessing && !error && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-3">
              <div className="rounded-full bg-gray-100 p-3">
                <Upload className="h-6 w-6 text-gray-500" />
              </div>
              <div className="rounded-full bg-gray-100 p-3">
                <Camera className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                사업자등록증을 업로드해주세요
              </p>
              <p className="text-xs text-gray-500 mt-1">
                이미지 파일을 드래그하거나 클릭하여 선택
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 수기 입력 버튼 (Manual Input Button) */}
      <button
        onClick={onManualInput}
        disabled={disabled || isProcessing}
        className={cn(
          'w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700',
          'hover:border-gray-300 hover:bg-gray-50 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <FileText className="h-4 w-4" />
        사업자 정보 직접 입력
      </button>
    </div>
  );
}

// ==================== OCR 결과 배너 (OCR Result Banner) ====================

interface OcrResultBannerProps {
  confidence: number;
  onRescan: () => void;
  className?: string;
}

export function OcrResultBanner({
  confidence,
  onRescan,
  className,
}: OcrResultBannerProps) {
  const isHighConfidence = confidence >= 0.8;

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-xl px-4 py-3',
        isHighConfidence ? 'bg-green-50' : 'bg-amber-50',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'rounded-full p-1.5',
            isHighConfidence ? 'bg-green-100' : 'bg-amber-100'
          )}
        >
          <FileText
            className={cn(
              'h-4 w-4',
              isHighConfidence ? 'text-green-600' : 'text-amber-600'
            )}
          />
        </div>
        <div>
          <p
            className={cn(
              'text-sm font-medium',
              isHighConfidence ? 'text-green-800' : 'text-amber-800'
            )}
          >
            {isHighConfidence ? 'OCR 인식 완료' : '일부 정보 확인 필요'}
          </p>
          <p className="text-xs text-gray-500">
            인식 신뢰도: {Math.round(confidence * 100)}%
          </p>
        </div>
      </div>

      <button
        onClick={onRescan}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
          isHighConfidence
            ? 'text-green-700 hover:bg-green-100'
            : 'text-amber-700 hover:bg-amber-100'
        )}
      >
        <RefreshCw className="h-4 w-4" />
        다시 스캔
      </button>
    </div>
  );
}

export default OcrUploader;
