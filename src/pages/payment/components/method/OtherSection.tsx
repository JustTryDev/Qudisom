// 기타 결제 섹션 컴포넌트 (Other Payment Section Component)

import React, { useCallback } from 'react';
import { MoreHorizontal, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OtherData } from '../../types';

interface OtherSectionProps {
  value: OtherData | null;
  onChange: (value: OtherData) => void;
  amount: number;
  disabled?: boolean;
  className?: string;
}

export function OtherSection({
  value,
  onChange,
  amount,
  disabled = false,
  className,
}: OtherSectionProps) {
  const data: OtherData = value || {
    type: 'other',
    description: '',
  };

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...data, description: e.target.value });
    },
    [data, onChange]
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* 기타 결제 안내 (Other Payment Info) */}
      <div className="flex items-start gap-3 rounded-xl bg-gray-100 border border-gray-200 px-4 py-3">
        <MoreHorizontal className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          <p className="font-medium">기타 결제</p>
          <p className="mt-1 text-xs">
            위 결제 수단에 해당하지 않는 특수한 결제 방식입니다.
            결제 방법을 상세히 입력해주세요.
          </p>
        </div>
      </div>

      {/* 결제 금액 (Payment Amount) */}
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">결제 금액</span>
          <span className="text-lg font-bold text-gray-900">
            {amount.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 결제 방법 설명 (Payment Description) */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          결제 방법 설명
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={handleDescriptionChange}
          placeholder="결제 방법을 상세히 설명해주세요.&#10;&#10;예시:&#10;- 현물 교환&#10;- 외화 결제&#10;- 분할 납품 후 정산&#10;- 기타 특수 결제 조건"
          disabled={disabled}
          rows={6}
          className={cn(
            'w-full rounded-xl border px-4 py-3 text-sm transition-colors resize-none',
            'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
            'disabled:bg-gray-50 disabled:text-gray-400',
            'border-gray-200'
          )}
        />
        <p className="text-xs text-gray-500">
          결제 방법, 일정, 조건 등을 구체적으로 입력해주세요
        </p>
      </div>

      {/* 주의사항 (Warning) */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700">
          <p className="font-medium">기타 결제 안내</p>
          <ul className="mt-1 space-y-0.5 text-xs">
            <li>• 담당자 확인 후 별도 연락을 드립니다</li>
            <li>• 결제 조건 협의가 완료된 후 주문이 확정됩니다</li>
            <li>• 특수 결제의 경우 추가 서류가 필요할 수 있습니다</li>
          </ul>
        </div>
      </div>

      {/* 안내 문구 (Info) */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          기타 결제 문의는 <span className="font-medium">contact@qudisom.com</span>
          으로 연락해주시면 빠르게 안내드리겠습니다.
        </p>
      </div>
    </div>
  );
}

export default OtherSection;
