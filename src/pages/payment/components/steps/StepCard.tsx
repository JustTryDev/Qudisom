// 스텝 카드 래퍼 컴포넌트 (Step Card Wrapper Component)

import React from 'react';
import { Check, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
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
    <div
      className={cn(
        'rounded-2xl border bg-white transition-all duration-300',
        isActive && 'border-[#fab803] shadow-lg',
        isCompleted && !isActive && 'border-gray-200',
        !isActive && !isCompleted && 'border-gray-100 opacity-60',
        className
      )}
    >
      {/* 헤더 (Header) */}
      <div
        className={cn(
          'flex items-center justify-between px-6 py-4',
          isActive && 'border-b border-gray-100'
        )}
      >
        <div className="flex items-center gap-4">
          {/* 스텝 번호 (Step Number) */}
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors',
              isCompleted && 'bg-[#fab803] text-white',
              isActive && !isCompleted && 'bg-[#1a2867] text-white',
              !isActive && !isCompleted && 'bg-gray-200 text-gray-500'
            )}
          >
            {isCompleted ? <Check className="h-5 w-5" /> : step}
          </div>

          {/* 스텝 정보 (Step Info) */}
          <div>
            <h3
              className={cn(
                'text-lg font-semibold',
                isActive ? 'text-gray-900' : 'text-gray-600'
              )}
            >
              {stepInfo?.title}
            </h3>
            {isActive && (
              <p className="text-sm text-gray-500">{stepInfo?.description}</p>
            )}
          </div>
        </div>

        {/* 액션 버튼 (Action Buttons) */}
        <div className="flex items-center gap-2">
          {isCompleted && canEdit && onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              수정
            </button>
          )}

          {/* 접기/펼치기 아이콘 (Collapse/Expand Icon) */}
          {isCompleted && !isActive && (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
          {isActive && <ChevronUp className="h-5 w-5 text-gray-400" />}
        </div>
      </div>

      {/* 완료 시 요약 표시 (Summary when completed) */}
      {isCompleted && !isActive && summary && (
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">{summary}</div>
      )}

      {/* 활성 상태일 때 컨텐츠 표시 (Content when active) */}
      {isActive && <div className="px-6 py-6">{children}</div>}
    </div>
  );
}

// ==================== 스텝 카드 액션 버튼 (Step Card Action Buttons) ====================

interface StepCardActionsProps {
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLastStep?: boolean;
}

export function StepCardActions({
  onPrev,
  onNext,
  prevLabel = '이전',
  nextLabel = '다음',
  nextDisabled = false,
  isLastStep = false,
}: StepCardActionsProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
      {onPrev ? (
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          {prevLabel}
        </button>
      ) : (
        <div />
      )}

      {onNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className={cn(
            'px-8 py-3 rounded-xl font-semibold transition-all',
            isLastStep
              ? 'bg-[#fab803] text-white hover:bg-[#e5a800] disabled:bg-gray-200 disabled:text-gray-400'
              : 'bg-[#1a2867] text-white hover:bg-[#0f1a4a] disabled:bg-gray-200 disabled:text-gray-400'
          )}
        >
          {nextLabel}
        </button>
      )}
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
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
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
        'grid gap-3',
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

interface StepProgressProps {
  steps: StepStatus[];
  currentStep: PaymentStep;
  className?: string;
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {steps.map((status, index) => (
        <React.Fragment key={status.step}>
          {/* 스텝 점 (Step Dot) */}
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
              status.isCompleted && 'bg-[#fab803] text-white',
              status.isActive && !status.isCompleted && 'bg-[#1a2867] text-white',
              !status.isActive && !status.isCompleted && 'bg-gray-200 text-gray-500'
            )}
          >
            {status.isCompleted ? (
              <Check className="h-4 w-4" />
            ) : (
              status.step
            )}
          </div>

          {/* 연결선 (Connection Line) */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                'h-0.5 flex-1 transition-colors',
                steps[index + 1].isCompleted || steps[index + 1].isActive
                  ? 'bg-[#fab803]'
                  : 'bg-gray-200'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default StepCard;
