// 토스페이먼츠 섹션 컴포넌트 (Toss Payments Section Component)

import React from 'react';
import { CreditCard, Smartphone, Gift, Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TossSectionProps {
  amount: number;
  className?: string;
}

export function TossSection({ amount, className }: TossSectionProps) {
  const paymentOptions = [
    { icon: CreditCard, label: '신용/체크카드', description: '모든 카드사 지원' },
    { icon: Smartphone, label: '간편결제', description: '토스페이, 카카오페이 등' },
    { icon: Gift, label: '상품권', description: '문화상품권, 해피머니 등' },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {/* 안내 메시지 (Info Message) */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">토스페이먼츠로 결제합니다</p>
          <p className="mt-1 text-xs">
            결제 진행 시 토스페이먼츠 결제창이 열립니다.
            다양한 결제 수단을 선택할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 결제 금액 표시 (Payment Amount Display) */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">결제 금액</span>
          <span className="text-lg font-bold text-gray-900">
            {amount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 토스페이먼츠 링크 (Toss Payments Link) */}
      <a
        href="https://www.tosspayments.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <span>Powered by 토스페이먼츠</span>
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

export default TossSection;
