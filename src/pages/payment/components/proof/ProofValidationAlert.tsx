// 증빙 검증 경고 컴포넌트 (Proof Validation Alert Component)

import React, { useCallback, useMemo } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProofDocument, ProofValidation, PaymentMethod, ProofType } from '../../types';
import { VALIDATION_RULES, PAYMENT_METHOD_MAP } from '../../utils/constants';

interface ProofValidationAlertProps {
  method: PaymentMethod;
  proof?: ProofDocument;
  onOverride?: (rule: string) => void;
  className?: string;
}

export function ProofValidationAlert({
  method,
  proof,
  onOverride,
  className,
}: ProofValidationAlertProps) {
  // 검증 수행 (Perform validation)
  const validations = useMemo(() => {
    return validateProof(method, proof);
  }, [method, proof]);

  const failedValidations = validations.filter((v) => !v.passed);

  if (failedValidations.length === 0) {
    return null;
  }

  // 가장 심각한 에러 찾기 (Find most severe error)
  const hasError = failedValidations.some((v) => v.severity === 'error');
  const hasWarning = failedValidations.some((v) => v.severity === 'warning');

  return (
    <div className={cn('space-y-2', className)}>
      {failedValidations.map((validation, index) => (
        <ValidationAlertItem
          key={`${validation.rule}-${index}`}
          validation={validation}
          onOverride={
            validation.canOverride ? () => onOverride?.(validation.rule) : undefined
          }
        />
      ))}
    </div>
  );
}

// ==================== 검증 알림 아이템 (Validation Alert Item) ====================

interface ValidationAlertItemProps {
  validation: ProofValidation;
  onOverride?: () => void;
}

function ValidationAlertItem({ validation, onOverride }: ValidationAlertItemProps) {
  const { message, severity, canOverride } = validation;

  const config = {
    error: {
      icon: AlertCircle,
      bgClass: 'bg-red-50 border-red-200',
      textClass: 'text-red-800',
      iconClass: 'text-red-500',
    },
    warning: {
      icon: AlertTriangle,
      bgClass: 'bg-amber-50 border-amber-200',
      textClass: 'text-amber-800',
      iconClass: 'text-amber-500',
    },
    info: {
      icon: Info,
      bgClass: 'bg-blue-50 border-blue-200',
      textClass: 'text-blue-800',
      iconClass: 'text-blue-500',
    },
  }[severity];

  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4',
        config.bgClass
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', config.iconClass)} />
      <div className="flex-1">
        <p className={cn('text-sm', config.textClass)}>{message}</p>
        {canOverride && onOverride && (
          <button
            onClick={onOverride}
            className={cn(
              'mt-2 text-sm font-medium underline underline-offset-2',
              config.textClass
            )}
          >
            이대로 진행
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== 검증 함수 (Validation Function) ====================

export function validateProof(
  method: PaymentMethod,
  proof?: ProofDocument
): ProofValidation[] {
  const validations: ProofValidation[] = [];
  const methodInfo = PAYMENT_METHOD_MAP[method.type];

  // 자동 영수증인 경우 검증 불필요 (No validation needed for auto receipt)
  if (method.autoReceipt || !methodInfo?.requiresProof) {
    return validations;
  }

  // 증빙 미선택 검증 (No proof selected validation)
  if (!proof || proof.type === 'later') {
    validations.push({
      rule: 'cash-receipt-required',
      passed: true, // 나중에 입력 허용 (Allow "later" option)
      message: '',
      severity: 'info',
      canOverride: true,
    });
    return validations;
  }

  // 현금영수증 의무발행 검사 (Cash receipt mandatory check)
  if (method.type === 'bank' && method.amount >= VALIDATION_RULES.CASH_RECEIPT_MANDATORY_AMOUNT) {
    if (proof.type === 'none') {
      validations.push({
        rule: 'cash-receipt-required',
        passed: false,
        message: `${formatAmount(VALIDATION_RULES.CASH_RECEIPT_MANDATORY_AMOUNT)}원 이상 현금 거래 시 현금영수증 또는 세금계산서 발행이 권장됩니다.`,
        severity: 'warning',
        canOverride: true,
      });
    }
  }

  // 세금계산서 발행일 검사 (Tax invoice deadline check)
  if (proof.type === 'tax-invoice' && proof.issueDate && proof.preferredIssueDate) {
    const deadline = getNextMonth10th();
    const issueDate = new Date(proof.issueDate);

    if (issueDate > deadline) {
      validations.push({
        rule: 'tax-invoice-deadline',
        passed: false,
        message: `세금계산서는 ${formatDeadline(deadline)}까지 발행해야 합니다.`,
        severity: 'error',
        canOverride: false,
      });
    }
  }

  // 세금계산서 수령인 정보 검사 (Tax invoice recipient info check)
  if (proof.type === 'tax-invoice' && proof.recipientMode === 'different') {
    const recipient = proof.differentRecipient;
    if (!recipient?.businessNumber || !recipient?.companyName || !recipient?.taxEmail) {
      validations.push({
        rule: 'tax-invoice-recommended',
        passed: false,
        message: '세금계산서 발행을 위해 수령인 정보를 입력해주세요.',
        severity: 'error',
        canOverride: false,
      });
    }
  }

  // 현금영수증 번호 검사 (Cash receipt number check)
  if (proof.type === 'cash-receipt') {
    if (!proof.cashReceiptNumber) {
      validations.push({
        rule: 'cash-receipt-required',
        passed: false,
        message: '현금영수증 발급을 위한 번호를 입력해주세요.',
        severity: 'error',
        canOverride: false,
      });
    }
  }

  return validations;
}

// ==================== 유틸리티 함수 (Utility Functions) ====================

function getNextMonth10th(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 10);
}

function formatDeadline(date: Date): string {
  return `${date.getMonth() + 1}월 10일`;
}

function formatAmount(amount: number): string {
  return amount.toLocaleString('ko-KR');
}

// ==================== 증빙 필요 여부 체크 (Proof Required Check) ====================

interface ProofRequiredBadgeProps {
  method: PaymentMethod;
  className?: string;
}

export function ProofRequiredBadge({ method, className }: ProofRequiredBadgeProps) {
  const methodInfo = PAYMENT_METHOD_MAP[method.type];

  if (method.autoReceipt) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700',
          className
        )}
      >
        <CheckCircle className="h-3 w-3" />
        자동 발급
      </span>
    );
  }

  if (methodInfo?.requiresProof) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700',
          className
        )}
      >
        <AlertTriangle className="h-3 w-3" />
        증빙 필요
      </span>
    );
  }

  return null;
}

export default ProofValidationAlert;
