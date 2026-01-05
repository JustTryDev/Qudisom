// 스텝 카드 래퍼 컴포넌트 (Step Card Wrapper Component)
// 토스 스타일의 미니멀하고 깔끔한 디자인 적용

import React from 'react';
import { Check, ChevronDown, ChevronUp, Pencil, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import type { PaymentStep, StepStatus } from '../../types';
import { STEP_INFO } from '../../utils/constants';

interface StepCardProps {
  step: PaymentStep;
  status: StepStatus;
  children: React.ReactNode;
  summary?: React.ReactNode;
  onEdit?: () => void;
  className?: string;
}

export function StepCard({
  step,
  status,
  children,
  summary,
  onEdit,
  className,
}: StepCardProps) {
  const stepInfo = STEP_INFO.find((s) => s.step === step);
  const { isCompleted, isActive, canEdit } = status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: step * 0.05 }}
      className={cn(
        'rounded-2xl border bg-white transition-all duration-300',
        isActive && 'border-gray-200 shadow-xl shadow-gray-200/50',
        isCompleted && !isActive && 'border-gray-100',
        !isActive && !isCompleted && 'border-gray-100 opacity-50',
        className
      )}
    >
      {/* 헤더 (Header) */}
      <div
        className={cn(
          'flex items-center justify-between px-6 py-5',
          isActive && 'border-b border-gray-100'
        )}
      >
        <div className="flex items-center gap-4">
          {/* 스텝 번호 (Step Number) - 토스 스타일 */}
          <motion.div
            animate={{
              scale: isActive ? 1 : 0.95,
              opacity: isActive ? 1 : 0.8,
            }}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold transition-colors',
              isCompleted && 'bg-[#1a2867] text-white',
              isActive && !isCompleted && 'bg-[#1a2867] text-white',
              !isActive && !isCompleted && 'bg-gray-100 text-gray-400'
            )}
          >
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <Check className="h-5 w-5" />
              </motion.div>
            ) : (
              step
            )}
          </motion.div>

          {/* 스텝 정보 (Step Info) */}
          <div>
            <h3
              className={cn(
                'text-lg font-semibold transition-colors',
                isActive ? 'text-gray-900' : 'text-gray-500'
              )}
            >
              {stepInfo?.title}
            </h3>
            <AnimatePresence>
              {isActive && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-gray-500 mt-0.5"
                >
                  {stepInfo?.description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 액션 버튼 (Action Buttons) */}
        <div className="flex items-center gap-2">
          {isCompleted && canEdit && onEdit && (
            <motion.button
              onClick={onEdit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              수정
            </motion.button>
          )}

          {/* 접기/펼치기 아이콘 (Collapse/Expand Icon) */}
          <AnimatePresence>
            {isCompleted && !isActive && (
              <motion.div
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -180, opacity: 0 }}
              >
                <ChevronDown className="h-5 w-5 text-gray-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 완료 시 요약 표시 (Summary when completed) */}
      <AnimatePresence>
        {isCompleted && !isActive && summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 py-4 bg-gray-50/50 rounded-b-2xl"
          >
            {summary}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 활성 상태일 때 컨텐츠 표시 (Content when active) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 py-6"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==================== 스텝 카드 액션 버튼 (Step Card Action Buttons) ====================
// 토스 스타일의 버튼 애니메이션 적용

interface StepCardActionsProps {
  onPrev?: () => void;
  onNext?: () => void;
  onSkip?: () => void; // 테스트 모드용 스킵 (Test mode skip)
  prevLabel?: string;
  nextLabel?: React.ReactNode; // string 또는 JSX Element 지원 (Support string or JSX Element)
  nextDisabled?: boolean;
  isLastStep?: boolean;
  testMode?: boolean; // 테스트 모드 여부 (Test mode flag)
}

export function StepCardActions({
  onPrev,
  onNext,
  onSkip,
  prevLabel = '이전',
  nextLabel = '다음',
  nextDisabled = false,
  isLastStep = false,
  testMode = false,
}: StepCardActionsProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
      {onPrev ? (
        <motion.button
          onClick={onPrev}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-3 text-gray-500 hover:text-gray-900 font-medium transition-colors rounded-xl hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          {prevLabel}
        </motion.button>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-3">
        {/* 테스트 모드: 스킵 버튼 (Test mode: Skip button) */}
        {testMode && onSkip && nextDisabled && (
          <motion.button
            onClick={onSkip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-3 rounded-xl font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors text-sm"
          >
            스킵 (테스트)
          </motion.button>
        )}

        {onNext && (
          <motion.button
            onClick={onNext}
            disabled={nextDisabled}
            whileHover={!nextDisabled ? { scale: 1.02 } : {}}
            whileTap={!nextDisabled ? { scale: 0.98 } : {}}
            className={cn(
              'flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold transition-all text-base',
              isLastStep
                ? 'bg-[#1a2867] text-white hover:bg-[#0f1a4a] disabled:bg-gray-100 disabled:text-gray-400'
                : 'bg-[#1a2867] text-white hover:bg-[#0f1a4a] disabled:bg-gray-100 disabled:text-gray-400'
            )}
          >
            {nextLabel}
            {!isLastStep && <ArrowRight className="h-4 w-4" />}
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ==================== 스텝 요약 아이템 (Step Summary Item) ====================

interface StepSummaryItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export function StepSummaryItem({ label, value, className }: StepSummaryItemProps) {
  return (
    <div className={cn('flex items-center justify-between py-1', className)}>
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-700">{value}</span>
    </div>
  );
}

// ==================== 스텝 요약 그리드 (Step Summary Grid) ====================

interface StepSummaryGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function StepSummaryGrid({
  children,
  columns = 2,
  className,
}: StepSummaryGridProps) {
  return (
    <div
      className={cn(
        'grid gap-2',
        columns === 1 && 'grid-cols-1',
        columns === 2 && 'grid-cols-2',
        columns === 3 && 'grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  );
}

// ==================== 스텝 진행 표시기 (Step Progress Indicator) ====================
// 토스 스타일의 미니멀한 프로그레스 바

interface StepProgressProps {
  steps: StepStatus[];
  currentStep: PaymentStep;
  className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  // 완료된 스텝 수 계산 (Calculate completed steps)
  const completedCount = steps.filter((s) => s.isCompleted).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className={cn('space-y-3', className)}>
      {/* 프로그레스 바 (Progress Bar) - 토스 스타일 */}
      <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute h-full bg-[#1a2867] rounded-full"
        />
      </div>

      {/* 스텝 점 표시 (Step Dots) */}
      <div className="flex items-center justify-between">
        {steps.map((status) => (
          <div key={status.step} className="flex flex-col items-center gap-1">
            {/* 스텝 점 (Step Dot) */}
            <motion.div
              animate={{
                scale: status.isActive ? 1.1 : 1,
              }}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                status.isCompleted && 'bg-[#1a2867] text-white',
                status.isActive && !status.isCompleted && 'bg-[#1a2867] text-white ring-4 ring-[#1a2867]/10',
                !status.isActive && !status.isCompleted && 'bg-gray-100 text-gray-400'
              )}
            >
              {status.isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                status.step
              )}
            </motion.div>

            {/* 스텝 라벨 (Step Label) - 현재 스텝만 표시 */}
            <AnimatePresence>
              {status.isActive && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs font-medium text-gray-600"
                >
                  {STEP_INFO.find((s) => s.step === status.step)?.title}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepCard;
