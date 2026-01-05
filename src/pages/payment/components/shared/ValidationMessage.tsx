// 검증 메시지 컴포넌트 (Validation Message Component)

import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProofValidation } from '../../types';

type Severity = 'error' | 'warning' | 'info' | 'success';

interface ValidationMessageProps {
  message: string;
  severity?: Severity;
  onDismiss?: () => void;
  className?: string;
}

export function ValidationMessage({
  message,
  severity = 'info',
  onDismiss,
  className,
}: ValidationMessageProps) {
  const Icon = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle,
  }[severity];

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  }[severity];

  const iconStyles = {
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
    success: 'text-green-500',
  }[severity];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        styles,
        className
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconStyles)} />
      <p className="flex-1 text-sm">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ==================== 검증 목록 (Validation List) ====================

interface ValidationListProps {
  validations: ProofValidation[];
  showOverrideButton?: boolean;
  onOverride?: (rule: string) => void;
  className?: string;
}

export function ValidationList({
  validations,
  showOverrideButton = false,
  onOverride,
  className,
}: ValidationListProps) {
  const failed = validations.filter((v) => !v.passed);

  if (failed.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      {failed.map((validation, index) => (
        <ValidationItem
          key={`${validation.rule}-${index}`}
          validation={validation}
          showOverrideButton={showOverrideButton && validation.canOverride}
          onOverride={() => onOverride?.(validation.rule)}
        />
      ))}
    </div>
  );
}

// ==================== 검증 아이템 (Validation Item) ====================

interface ValidationItemProps {
  validation: ProofValidation;
  showOverrideButton?: boolean;
  onOverride?: () => void;
  className?: string;
}

export function ValidationItem({
  validation,
  showOverrideButton = false,
  onOverride,
  className,
}: ValidationItemProps) {
  const { message, severity, canOverride } = validation;

  const Icon = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }[severity];

  const styles = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  }[severity];

  const textStyles = {
    error: 'text-red-800',
    warning: 'text-amber-800',
    info: 'text-blue-800',
  }[severity];

  const iconStyles = {
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
  }[severity];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        styles,
        className
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconStyles)} />
      <div className="flex-1">
        <p className={cn('text-sm', textStyles)}>{message}</p>
        {showOverrideButton && canOverride && (
          <button
            onClick={onOverride}
            className={cn(
              'mt-2 text-sm font-medium underline underline-offset-2',
              textStyles
            )}
          >
            이대로 진행
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== 필드 에러 (Field Error) ====================

interface FieldErrorProps {
  error?: string;
  className?: string;
}

export function FieldError({ error, className }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p className={cn('text-sm text-red-500 mt-1.5', className)}>{error}</p>
  );
}

// ==================== 필수 표시 (Required Mark) ====================

interface RequiredMarkProps {
  className?: string;
}

export function RequiredMark({ className }: RequiredMarkProps) {
  return <span className={cn('text-red-500 ml-0.5', className)}>*</span>;
}

// ==================== 도움말 텍스트 (Helper Text) ====================

interface HelperTextProps {
  children: React.ReactNode;
  className?: string;
}

export function HelperText({ children, className }: HelperTextProps) {
  return (
    <p className={cn('text-sm text-gray-500 mt-1.5', className)}>{children}</p>
  );
}

export default ValidationMessage;
