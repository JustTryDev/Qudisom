// 증빙 검증 훅 (Proof Validation Hook)
// 법적/회계 규칙에 따른 증빙 서류 검증

import { useMemo, useCallback } from 'react';
import type {
  PaymentSchedule,
  PaymentMethod,
  ProofDocument,
  ProofValidation,
  ProofValidationRule,
} from '../types';
import { VALIDATION_RULES, PAYMENT_METHOD_MAP } from '../utils/constants';

interface UseProofValidationOptions {
  schedules: PaymentSchedule[];
}

interface ValidationSummary {
  totalMethods: number;
  validMethods: number;
  invalidMethods: number;
  errors: ProofValidation[];
  warnings: ProofValidation[];
}

interface UseProofValidationReturn {
  // 전체 검증 결과 (Overall validation result)
  isValid: boolean;
  summary: ValidationSummary;

  // 개별 검증 함수 (Individual validation functions)
  validateMethod: (method: PaymentMethod) => ProofValidation[];
  validateSchedule: (schedule: PaymentSchedule) => ProofValidation[];
  validateAll: () => ProofValidation[];

  // 특정 규칙 검증 (Specific rule validation)
  checkCashReceiptRequired: (amount: number) => boolean;
  checkTaxInvoiceDeadline: (issueDate: string) => boolean;
}

export function useProofValidation({
  schedules,
}: UseProofValidationOptions): UseProofValidationReturn {
  // 개별 메서드 검증 (Validate individual method)
  const validateMethod = useCallback(
    (method: PaymentMethod): ProofValidation[] => {
      const validations: ProofValidation[] = [];
      const methodInfo = PAYMENT_METHOD_MAP[method.type];

      // 자동 영수증인 경우 검증 불필요 (No validation needed for auto receipt)
      if (method.autoReceipt) {
        return validations;
      }

      // 증빙 필요 여부 확인 (Check if proof required)
      if (!methodInfo?.requiresProof) {
        return validations;
      }

      const proof = method.proof;

      // 증빙 미선택 또는 나중에 입력 (No proof or "later")
      if (!proof || proof.type === 'later') {
        // 나중에 입력은 허용 (Allow "later" option)
        return validations;
      }

      // 1. 현금영수증 의무발행 검사 (Cash receipt mandatory check)
      if (
        method.type === 'bank' &&
        method.amount >= VALIDATION_RULES.CASH_RECEIPT_MANDATORY_AMOUNT &&
        proof.type === 'none'
      ) {
        validations.push({
          rule: 'cash-receipt-required',
          passed: false,
          message: `${formatAmount(VALIDATION_RULES.CASH_RECEIPT_MANDATORY_AMOUNT)}원 이상 현금 거래 시 현금영수증 또는 세금계산서 발행이 권장됩니다.`,
          severity: 'warning',
          canOverride: true,
        });
      }

      // 2. 세금계산서 발행일 검사 (Tax invoice deadline check)
      if (
        proof.type === 'tax-invoice' &&
        proof.issueDate &&
        proof.preferredIssueDate
      ) {
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

      // 3. 세금계산서 수령인 정보 검사 (Tax invoice recipient info check)
      if (proof.type === 'tax-invoice' && proof.recipientMode === 'different') {
        const recipient = proof.differentRecipient;
        if (
          !recipient?.businessNumber ||
          !recipient?.companyName ||
          !recipient?.taxEmail
        ) {
          validations.push({
            rule: 'tax-invoice-recommended',
            passed: false,
            message: '세금계산서 발행을 위해 수령인 정보를 입력해주세요.',
            severity: 'error',
            canOverride: false,
          });
        }

        // 사업자번호 형식 검사 (Business number format check)
        if (
          recipient?.businessNumber &&
          !VALIDATION_RULES.BUSINESS_NUMBER_REGEX.test(recipient.businessNumber)
        ) {
          validations.push({
            rule: 'business-number-format',
            passed: false,
            message: '올바른 사업자등록번호 형식이 아닙니다.',
            severity: 'error',
            canOverride: false,
          });
        }

        // 이메일 형식 검사 (Email format check)
        if (
          recipient?.taxEmail &&
          !VALIDATION_RULES.EMAIL_REGEX.test(recipient.taxEmail)
        ) {
          validations.push({
            rule: 'email-format',
            passed: false,
            message: '올바른 이메일 형식이 아닙니다.',
            severity: 'error',
            canOverride: false,
          });
        }
      }

      // 4. 현금영수증 번호 검사 (Cash receipt number check)
      if (proof.type === 'cash-receipt' && !proof.cashReceiptNumber) {
        validations.push({
          rule: 'cash-receipt-required',
          passed: false,
          message: '현금영수증 발급을 위한 번호를 입력해주세요.',
          severity: 'error',
          canOverride: false,
        });
      }

      return validations;
    },
    []
  );

  // 일정별 검증 (Validate schedule)
  const validateSchedule = useCallback(
    (schedule: PaymentSchedule): ProofValidation[] => {
      const validations: ProofValidation[] = [];

      for (const method of schedule.methods) {
        const methodValidations = validateMethod(method);
        validations.push(...methodValidations);
      }

      return validations;
    },
    [validateMethod]
  );

  // 전체 검증 (Validate all)
  const validateAll = useCallback((): ProofValidation[] => {
    const validations: ProofValidation[] = [];

    for (const schedule of schedules) {
      const scheduleValidations = validateSchedule(schedule);
      validations.push(...scheduleValidations);
    }

    return validations;
  }, [schedules, validateSchedule]);

  // 검증 요약 (Validation summary)
  const summary = useMemo((): ValidationSummary => {
    const allValidations = validateAll();
    const errors = allValidations.filter((v) => v.severity === 'error' && !v.passed);
    const warnings = allValidations.filter(
      (v) => v.severity === 'warning' && !v.passed
    );

    let totalMethods = 0;
    let invalidMethods = 0;

    for (const schedule of schedules) {
      for (const method of schedule.methods) {
        totalMethods++;
        const methodValidations = validateMethod(method);
        const hasError = methodValidations.some(
          (v) => v.severity === 'error' && !v.passed
        );
        if (hasError) invalidMethods++;
      }
    }

    return {
      totalMethods,
      validMethods: totalMethods - invalidMethods,
      invalidMethods,
      errors,
      warnings,
    };
  }, [schedules, validateAll, validateMethod]);

  // 전체 유효성 (Overall validity)
  const isValid = useMemo(() => {
    return summary.errors.length === 0;
  }, [summary]);

  // 현금영수증 의무발행 확인 (Check cash receipt required)
  const checkCashReceiptRequired = useCallback((amount: number): boolean => {
    return amount >= VALIDATION_RULES.CASH_RECEIPT_MANDATORY_AMOUNT;
  }, []);

  // 세금계산서 발행일 확인 (Check tax invoice deadline)
  const checkTaxInvoiceDeadline = useCallback((issueDate: string): boolean => {
    const deadline = getNextMonth10th();
    const date = new Date(issueDate);
    return date <= deadline;
  }, []);

  return {
    isValid,
    summary,
    validateMethod,
    validateSchedule,
    validateAll,
    checkCashReceiptRequired,
    checkTaxInvoiceDeadline,
  };
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

export default useProofValidation;
