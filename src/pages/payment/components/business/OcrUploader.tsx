// OCR 업로더 컴포넌트 (OCR Uploader Component)
// 토스 스타일의 깔끔한 UI와 스캔 애니메이션 적용

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Camera, FileText, AlertCircle, RefreshCw, Scan, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { BusinessInfoFields, OcrResult } from '../../types';

// 스캔 진행 단계 (Scan Progress Steps)
type ScanStep = 'uploading' | 'analyzing' | 'extracting' | 'complete';

const SCAN_STEPS: { step: ScanStep; label: string; duration: number }[] = [
  { step: 'uploading', label: '이미지 업로드 중...', duration: 500 },
  { step: 'analyzing', label: '문서 분석 중...', duration: 1000 },
  { step: 'extracting', label: '정보 추출 중...', duration: 500 },
  { step: 'complete', label: '완료!', duration: 300 },
];

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
  const [currentStep, setCurrentStep] = useState<ScanStep | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processOcr = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);

      try {
        // 이미지 미리보기 생성 (Create image preview)
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // 단계별 애니메이션 진행 (Step-by-step animation progress)
        for (const { step, duration } of SCAN_STEPS) {
          setCurrentStep(step);
          await new Promise((resolve) => setTimeout(resolve, duration));
        }

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
        setCurrentStep(null);
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
      setIsDragging(false);
      if (disabled || isProcessing) return;

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        processOcr(file);
      }
    },
    [disabled, isProcessing, processOcr]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !isProcessing) {
        setIsDragging(true);
      }
    },
    [disabled, isProcessing]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

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

  // 현재 단계 인덱스 (Current step index for progress)
  const stepIndex = currentStep ? SCAN_STEPS.findIndex((s) => s.step === currentStep) : -1;
  const progress = stepIndex >= 0 ? ((stepIndex + 1) / SCAN_STEPS.length) * 100 : 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* 업로드 영역 (Upload Area) */}
      <motion.div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        whileHover={!isProcessing && !disabled ? { scale: 1.01 } : {}}
        whileTap={!isProcessing && !disabled ? { scale: 0.99 } : {}}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer overflow-hidden',
          isProcessing && 'pointer-events-none border-solid',
          isDragging && 'border-[#1a2867] bg-[#1a2867]/5 scale-[1.02]',
          !isProcessing && !isDragging && 'hover:border-gray-300 hover:bg-gray-50/50',
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

        {/* 처리 중 상태 (Processing State) - 토스 스타일 */}
        <AnimatePresence mode="wait">
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4 w-full"
            >
              {/* 이미지 미리보기와 스캔 효과 (Image preview with scan effect) */}
              <div className="relative">
                {previewUrl && (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={previewUrl}
                      alt="Processing"
                      className="w-full h-full object-cover"
                    />
                    {/* 스캔 라인 애니메이션 (Scan line animation) */}
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1a2867] to-transparent"
                      initial={{ top: 0 }}
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* 오버레이 (Overlay) */}
                    <div className="absolute inset-0 bg-[#1a2867]/10" />
                  </div>
                )}
                {/* 펄스 링 (Pulse rings) */}
                <div className="absolute -inset-4">
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-[#1a2867]/30"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* 진행 상태 (Progress status) */}
              <div className="w-full max-w-xs space-y-3">
                {/* 프로그레스 바 (Progress bar) */}
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#1a2867] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* 단계 표시 (Step indicator) */}
                <div className="flex items-center justify-center gap-2">
                  <Scan className="h-4 w-4 text-[#1a2867] animate-pulse" />
                  <motion.p
                    key={currentStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-medium text-gray-700"
                  >
                    {SCAN_STEPS.find((s) => s.step === currentStep)?.label}
                  </motion.p>
                </div>

                {/* 단계 점 표시 (Step dots) */}
                <div className="flex items-center justify-center gap-2">
                  {SCAN_STEPS.map((s, i) => (
                    <motion.div
                      key={s.step}
                      className={cn(
                        'w-2 h-2 rounded-full transition-colors',
                        i <= stepIndex ? 'bg-[#1a2867]' : 'bg-gray-200'
                      )}
                      animate={i === stepIndex ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.5, repeat: i === stepIndex ? Infinity : 0 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 에러 상태 (Error State) */}
          {error && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="rounded-full bg-red-50 p-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">인식에 실패했습니다</p>
                <p className="text-xs text-gray-500 mt-1">{error}</p>
              </div>
              <motion.button
                onClick={handleRetry}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                다시 시도
              </motion.button>
            </motion.div>
          )}

          {/* 기본 상태 (Default State) - 토스 스타일 */}
          {!isProcessing && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              {/* 아이콘 그룹 (Icon group) */}
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="rounded-2xl bg-gray-100 p-4"
                >
                  <Upload className="h-6 w-6 text-gray-600" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="rounded-2xl bg-gray-100 p-4"
                >
                  <Camera className="h-6 w-6 text-gray-600" />
                </motion.div>
              </div>

              {/* 텍스트 (Text) */}
              <div className="text-center space-y-1">
                <p className="text-base font-semibold text-gray-900">
                  사업자등록증 업로드
                </p>
                <p className="text-sm text-gray-500">
                  이미지를 드래그하거나 클릭해서 선택하세요
                </p>
              </div>

              {/* 지원 형식 (Supported formats) */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-0.5 rounded-full bg-gray-100">JPG</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100">PNG</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100">PDF</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 드래그 오버레이 (Drag overlay) */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[#1a2867]/5 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center gap-2"
              >
                <Upload className="h-10 w-10 text-[#1a2867]" />
                <p className="text-sm font-medium text-[#1a2867]">여기에 놓으세요</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 수기 입력 버튼 (Manual Input Button) - 토스 스타일 */}
      <motion.button
        onClick={onManualInput}
        disabled={disabled || isProcessing}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          'w-full flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3.5 text-sm font-medium text-gray-700',
          'hover:border-gray-300 hover:bg-gray-50 transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <FileText className="h-4 w-4" />
        사업자 정보 직접 입력
      </motion.button>
    </div>
  );
}

// ==================== OCR 결과 배너 (OCR Result Banner) ====================
// 토스 스타일의 신뢰도 표시 배너

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
  const isMediumConfidence = confidence >= 0.6 && confidence < 0.8;
  const confidencePercent = Math.round(confidence * 100);

  // 신뢰도에 따른 스타일 (Styles based on confidence)
  const getConfidenceStyle = () => {
    if (isHighConfidence) {
      return {
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        textColor: 'text-emerald-800',
        barColor: 'bg-emerald-500',
      };
    }
    if (isMediumConfidence) {
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        textColor: 'text-amber-800',
        barColor: 'bg-amber-500',
      };
    }
    return {
      bg: 'bg-red-50',
      border: 'border-red-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
      barColor: 'bg-red-500',
    };
  };

  const style = getConfidenceStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl border px-4 py-3.5',
        style.bg,
        style.border,
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 아이콘 (Icon) */}
          <div className={cn('rounded-xl p-2', style.iconBg)}>
            {isHighConfidence ? (
              <CheckCircle2 className={cn('h-5 w-5', style.iconColor)} />
            ) : (
              <Scan className={cn('h-5 w-5', style.iconColor)} />
            )}
          </div>

          {/* 텍스트 (Text) */}
          <div>
            <p className={cn('text-sm font-semibold', style.textColor)}>
              {isHighConfidence
                ? 'OCR 인식 완료'
                : isMediumConfidence
                ? '일부 정보 확인 필요'
                : '인식 정확도가 낮습니다'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {/* 신뢰도 바 (Confidence bar) */}
              <div className="w-16 h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePercent}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={cn('h-full rounded-full', style.barColor)}
                />
              </div>
              <span className="text-xs text-gray-500">
                신뢰도 {confidencePercent}%
              </span>
            </div>
          </div>
        </div>

        {/* 다시 스캔 버튼 (Rescan button) */}
        <motion.button
          onClick={onRescan}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
            'bg-white/60 hover:bg-white text-gray-700 border border-gray-200/50'
          )}
        >
          <RefreshCw className="h-4 w-4" />
          다시 스캔
        </motion.button>
      </div>
    </motion.div>
  );
}

export default OcrUploader;
