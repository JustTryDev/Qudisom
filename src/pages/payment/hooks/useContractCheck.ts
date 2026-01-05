// 전자계약 필요 여부 확인 훅 (Contract Check Hook)
// 후불 결제 시 전자계약 서명 요구사항 관리

import { useMemo, useCallback } from 'react';
import type {
  PaymentSchedule,
  PayorInfo,
  ContractSigner,
} from '../types';
import { PAYMENT_TIMING_MAP } from '../utils/constants';

interface UseContractCheckOptions {
  schedules: PaymentSchedule[];
  payorMode: 'single' | 'per-schedule';
  singlePayor?: PayorInfo;
}

interface ContractRequirement {
  scheduleId: string;
  scheduleLabel: string;
  timing: string;
  amount: number;
  payor: PayorInfo | undefined;
  signatureRequired: boolean;
}

interface UseContractCheckReturn {
  // 전자계약 필요 여부 (Contract required)
  contractRequired: boolean;

  // 후불 일정 목록 (Deferred schedules)
  deferredSchedules: PaymentSchedule[];

  // 계약 요구사항 (Contract requirements)
  contractRequirements: ContractRequirement[];

  // 계약 서명자 목록 생성 (Generate contract signers)
  generateContractSigners: () => ContractSigner[];

  // 특정 일정이 후불인지 확인 (Check if schedule is deferred)
  isScheduleDeferred: (scheduleId: string) => boolean;

  // 후불 금액 합계 (Total deferred amount)
  totalDeferredAmount: number;

  // 선불 금액 합계 (Total prepaid amount)
  totalPrepaidAmount: number;
}

export function useContractCheck({
  schedules,
  payorMode,
  singlePayor,
}: UseContractCheckOptions): UseContractCheckReturn {
  // 후불 일정 필터링 (Filter deferred schedules)
  const deferredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const timing = PAYMENT_TIMING_MAP[s.timing];
      return timing?.isDeferred === true;
    });
  }, [schedules]);

  // 전자계약 필요 여부 (Contract required check)
  const contractRequired = useMemo(() => {
    return deferredSchedules.length > 0;
  }, [deferredSchedules]);

  // 계약 요구사항 목록 (Contract requirements list)
  const contractRequirements = useMemo((): ContractRequirement[] => {
    return deferredSchedules.map((schedule) => {
      const timing = PAYMENT_TIMING_MAP[schedule.timing];
      const payor =
        payorMode === 'single' ? singlePayor : schedule.payor;

      return {
        scheduleId: schedule.id,
        scheduleLabel: schedule.label,
        timing: timing?.label || schedule.timing,
        amount: schedule.amount,
        payor,
        signatureRequired: true, // 후불은 항상 서명 필요
      };
    });
  }, [deferredSchedules, payorMode, singlePayor]);

  // 계약 서명자 목록 생성 (Generate contract signers)
  const generateContractSigners = useCallback((): ContractSigner[] => {
    const signerMap = new Map<string, ContractSigner>();

    for (const req of contractRequirements) {
      if (!req.payor) continue;

      // 결제자 이메일을 키로 사용하여 중복 제거
      const key = req.payor.email;

      if (!signerMap.has(key)) {
        signerMap.set(key, {
          scheduleId: req.scheduleId,
          payorInfo: req.payor,
          signatureRequired: true,
          signatureStatus: 'pending',
        });
      }
    }

    return Array.from(signerMap.values());
  }, [contractRequirements]);

  // 특정 일정이 후불인지 확인 (Check if schedule is deferred)
  const isScheduleDeferred = useCallback(
    (scheduleId: string): boolean => {
      return deferredSchedules.some((s) => s.id === scheduleId);
    },
    [deferredSchedules]
  );

  // 후불 금액 합계 (Total deferred amount)
  const totalDeferredAmount = useMemo(() => {
    return deferredSchedules.reduce((sum, s) => sum + s.amount, 0);
  }, [deferredSchedules]);

  // 선불 금액 합계 (Total prepaid amount)
  const totalPrepaidAmount = useMemo(() => {
    const prepaidSchedules = schedules.filter((s) => {
      const timing = PAYMENT_TIMING_MAP[s.timing];
      return timing?.isDeferred !== true;
    });
    return prepaidSchedules.reduce((sum, s) => sum + s.amount, 0);
  }, [schedules]);

  return {
    contractRequired,
    deferredSchedules,
    contractRequirements,
    generateContractSigners,
    isScheduleDeferred,
    totalDeferredAmount,
    totalPrepaidAmount,
  };
}

// ==================== 전자계약 상태 관리 훅 (Contract Status Hook) ====================

interface UseContractStatusOptions {
  signers: ContractSigner[];
  onSignersChange: (signers: ContractSigner[]) => void;
}

interface UseContractStatusReturn {
  // 모든 서명 완료 여부 (All signed check)
  allSigned: boolean;

  // 서명 상태 업데이트 (Update signature status)
  updateSignatureStatus: (
    scheduleId: string,
    status: 'pending' | 'signed' | 'rejected'
  ) => void;

  // 서명 통계 (Signature stats)
  stats: {
    total: number;
    signed: number;
    pending: number;
    rejected: number;
  };
}

export function useContractStatus({
  signers,
  onSignersChange,
}: UseContractStatusOptions): UseContractStatusReturn {
  // 모든 서명 완료 확인 (Check all signed)
  const allSigned = useMemo(() => {
    if (signers.length === 0) return true;
    return signers.every((s) => s.signatureStatus === 'signed');
  }, [signers]);

  // 서명 상태 업데이트 (Update signature status)
  const updateSignatureStatus = useCallback(
    (
      scheduleId: string,
      status: 'pending' | 'signed' | 'rejected'
    ) => {
      const updated = signers.map((s) =>
        s.scheduleId === scheduleId ? { ...s, signatureStatus: status } : s
      );
      onSignersChange(updated);
    },
    [signers, onSignersChange]
  );

  // 서명 통계 (Signature statistics)
  const stats = useMemo(() => {
    const total = signers.length;
    const signed = signers.filter((s) => s.signatureStatus === 'signed').length;
    const pending = signers.filter((s) => s.signatureStatus === 'pending').length;
    const rejected = signers.filter((s) => s.signatureStatus === 'rejected').length;

    return { total, signed, pending, rejected };
  }, [signers]);

  return {
    allSigned,
    updateSignatureStatus,
    stats,
  };
}

export default useContractCheck;
