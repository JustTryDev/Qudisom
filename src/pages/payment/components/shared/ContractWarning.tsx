// 전자계약 경고 컴포넌트 (Electronic Contract Warning Component)

import React from 'react';
import { FileSignature, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContractSigner, PaymentSchedule } from '../../types';
import { PAYMENT_TIMING_MAP } from '../../utils/constants';

interface ContractWarningProps {
  schedules: PaymentSchedule[];
  contractSigners?: ContractSigner[];
  className?: string;
}

export function ContractWarning({
  schedules,
  contractSigners = [],
  className,
}: ContractWarningProps) {
  // 후불 결제 일정 찾기 (Find deferred payment schedules)
  const deferredSchedules = schedules.filter(
    (s) => PAYMENT_TIMING_MAP[s.timing]?.isDeferred
  );

  if (deferredSchedules.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-amber-200 bg-amber-50 p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-amber-100 p-2">
          <FileSignature className="h-5 w-5 text-amber-600" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-900">
            전자계약이 필요합니다
          </h4>
          <p className="text-sm text-amber-700 mt-1">
            후불 결제가 포함되어 있어 전자계약 서명이 필요합니다.
          </p>

          {/* 후불 일정 목록 (Deferred Schedule List) */}
          <div className="mt-3 space-y-2">
            {deferredSchedules.map((schedule) => {
              const signer = contractSigners.find(
                (s) => s.scheduleId === schedule.id
              );
              const timing = PAYMENT_TIMING_MAP[schedule.timing];

              return (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {schedule.label}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                      {timing?.label}
                    </span>
                  </div>

                  {signer && (
                    <SignatureStatus status={signer.signatureStatus} />
                  )}
                </div>
              );
            })}
          </div>

          {/* 안내 문구 (Notice) */}
          <p className="text-xs text-amber-600 mt-3">
            결제 완료 후 전자계약 서명 요청이 발송됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== 서명 상태 표시 (Signature Status) ====================

interface SignatureStatusProps {
  status: 'pending' | 'signed' | 'rejected';
  className?: string;
}

function SignatureStatus({ status, className }: SignatureStatusProps) {
  const config = {
    pending: {
      icon: Clock,
      label: '대기중',
      className: 'bg-gray-100 text-gray-600',
    },
    signed: {
      icon: CheckCircle,
      label: '서명완료',
      className: 'bg-green-100 text-green-700',
    },
    rejected: {
      icon: AlertTriangle,
      label: '거절됨',
      className: 'bg-red-100 text-red-700',
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'flex items-center gap-1 text-xs px-2 py-1 rounded-full',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

// ==================== 계약 서명자 목록 (Contract Signers List) ====================

interface ContractSignersListProps {
  signers: ContractSigner[];
  className?: string;
}

export function ContractSignersList({
  signers,
  className,
}: ContractSignersListProps) {
  if (signers.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <h4 className="text-sm font-medium text-gray-700">계약 서명자</h4>
      <div className="space-y-2">
        {signers.map((signer, index) => (
          <div
            key={`${signer.scheduleId}-${index}`}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {signer.payorInfo.type === 'company'
                  ? signer.payorInfo.company
                  : signer.payorInfo.name}
              </p>
              <p className="text-xs text-gray-500">{signer.payorInfo.email}</p>
            </div>
            <SignatureStatus status={signer.signatureStatus} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== 후불 경고 배너 (Deferred Payment Banner) ====================

interface DeferredPaymentBannerProps {
  className?: string;
}

export function DeferredPaymentBanner({ className }: DeferredPaymentBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3',
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
      <p className="text-sm text-amber-800">
        후불 결제 시 <span className="font-semibold">전자계약 서명</span>이
        필요합니다.
      </p>
    </div>
  );
}

export default ContractWarning;
