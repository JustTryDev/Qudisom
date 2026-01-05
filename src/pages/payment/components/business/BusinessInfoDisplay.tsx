// 사업자 정보 요약 표시 컴포넌트 (Business Info Display Component)
// 읽기 전용으로 이미 입력된 사업자 정보를 요약해서 보여줌

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BusinessInfoFields } from '../../types';

interface BusinessInfoDisplayProps {
  info: BusinessInfoFields;
  title?: string;
  className?: string;
}

export function BusinessInfoDisplay({
  info,
  title = '사업자 정보가 이미 입력되었습니다',
  className,
}: BusinessInfoDisplayProps) {
  return (
    <div className={cn('rounded-xl bg-green-50 border border-green-200 p-4', className)}>
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-semibold text-green-900">{title}</p>
          <div className="grid grid-cols-1 gap-2 text-xs text-green-800">
            {/* 회사명 (Company Name) */}
            <div className="flex items-center justify-between">
              <span className="text-green-600">회사명</span>
              <span className="font-medium">{info.companyName || '-'}</span>
            </div>
            {/* 사업자 등록번호 (Business Number) */}
            <div className="flex items-center justify-between">
              <span className="text-green-600">사업자등록번호</span>
              <span className="font-medium font-mono">{info.businessNumber || '-'}</span>
            </div>
            {/* 대표자명 (Representative Name) */}
            {info.representativeName && (
              <div className="flex items-center justify-between">
                <span className="text-green-600">대표자명</span>
                <span className="font-medium">{info.representativeName}</span>
              </div>
            )}
            {/* 주소 (Address) */}
            {info.address && (
              <div className="flex flex-col gap-1">
                <span className="text-green-600">사업장 주소</span>
                <span className="font-medium">{info.address}</span>
              </div>
            )}
            {/* 업태 (Business Type) */}
            {info.businessType && (
              <div className="flex items-center justify-between">
                <span className="text-green-600">업태</span>
                <span className="font-medium">{info.businessType}</span>
              </div>
            )}
            {/* 종목 (Business Item) */}
            {info.businessItem && (
              <div className="flex items-center justify-between">
                <span className="text-green-600">종목</span>
                <span className="font-medium">{info.businessItem}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessInfoDisplay;
