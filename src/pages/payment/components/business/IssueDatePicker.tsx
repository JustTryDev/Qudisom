// 발행 희망 날짜 선택 컴포넌트 (Issue Date Picker Component)

import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IssueDatePickerProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  preferredDate: boolean;
  onPreferredChange: (preferred: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function IssueDatePicker({
  value,
  onChange,
  preferredDate,
  onPreferredChange,
  disabled = false,
  className,
}: IssueDatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handlePreferredChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      onPreferredChange(checked);
      if (!checked) {
        onChange(undefined);
      }
    },
    [onChange, onPreferredChange]
  );

  const handleDateSelect = useCallback(
    (date: string) => {
      onChange(date);
      setIsCalendarOpen(false);
    },
    [onChange]
  );

  // 유효한 날짜 범위 계산 (Calculate valid date range)
  const { minDate, maxDate, deadlineDate } = useMemo(() => {
    const today = new Date();
    const min = today.toISOString().split('T')[0];

    // 익월 10일 계산 (Calculate next month 10th)
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 10);
    const max = nextMonth.toISOString().split('T')[0];

    return {
      minDate: min,
      maxDate: max,
      deadlineDate: nextMonth,
    };
  }, []);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* 발행 희망 여부 체크박스 (Preferred Date Checkbox) */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={preferredDate}
          onChange={handlePreferredChange}
          disabled={disabled}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#fab803] focus:ring-[#fab803]"
        />
        <div>
          <span className="text-sm font-medium text-gray-900">
            세금계산서 발행 희망 날짜가 있습니다
          </span>
          <p className="text-xs text-gray-500 mt-0.5">
            특정 날짜에 세금계산서 발행을 원하시면 선택해주세요
          </p>
        </div>
      </label>

      {/* 날짜 선택 (Date Selection) */}
      {preferredDate && (
        <div className="pl-7 space-y-3">
          {/* 날짜 입력 필드 (Date Input Field) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => !disabled && setIsCalendarOpen(!isCalendarOpen)}
              disabled={disabled}
              className={cn(
                'w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors',
                'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
                'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed',
                isCalendarOpen ? 'border-[#fab803]' : 'border-gray-200'
              )}
            >
              <span className={cn('text-sm', value ? 'text-gray-900' : 'text-gray-400')}>
                {value ? formatDate(value) : '날짜 선택'}
              </span>
              <Calendar className="h-5 w-5 text-gray-400" />
            </button>

            {/* 캘린더 드롭다운 (Calendar Dropdown) */}
            {isCalendarOpen && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <SimpleDatePicker
                  value={value}
                  onChange={handleDateSelect}
                  minDate={minDate}
                  maxDate={maxDate}
                  onClose={() => setIsCalendarOpen(false)}
                />
              </div>
            )}
          </div>

          {/* 안내 메시지 (Info Message) */}
          <div className="flex items-start gap-2 rounded-xl bg-blue-50 px-4 py-3">
            <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              세금계산서는{' '}
              <span className="font-semibold">
                {deadlineDate.getMonth() + 1}월 10일
              </span>
              까지 발행 가능합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 간단한 날짜 선택기 (Simple Date Picker) ====================

interface SimpleDatePickerProps {
  value: string | undefined;
  onChange: (date: string) => void;
  minDate: string;
  maxDate: string;
  onClose: () => void;
}

function SimpleDatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  onClose,
}: SimpleDatePickerProps) {
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value);
    return new Date();
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = useCallback(() => {
    setViewDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const nextMonth = useCallback(() => {
    setViewDate(new Date(year, month + 1, 1));
  }, [year, month]);

  const isDateDisabled = (day: number): boolean => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr < minDate || dateStr > maxDate;
  };

  const isDateSelected = (day: number): boolean => {
    if (!value) return false;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === value;
  };

  const handleDateClick = (day: number) => {
    if (isDateDisabled(day)) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      {/* 헤더 (Header) */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* 요일 헤더 (Weekday Header) */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
          <div
            key={day}
            className={cn(
              'text-center text-xs font-medium py-1',
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 (Date Grid) */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day !== null && (
              <button
                onClick={() => handleDateClick(day)}
                disabled={isDateDisabled(day)}
                className={cn(
                  'w-full h-full flex items-center justify-center rounded-lg text-sm transition-colors',
                  isDateSelected(day) && 'bg-[#fab803] text-white font-semibold',
                  !isDateSelected(day) && !isDateDisabled(day) && 'hover:bg-gray-100',
                  isDateDisabled(day) && 'text-gray-300 cursor-not-allowed',
                  !isDateDisabled(day) && !isDateSelected(day) && 'text-gray-900'
                )}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 닫기 버튼 (Close Button) */}
      <button
        onClick={onClose}
        className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        닫기
      </button>
    </div>
  );
}

export default IssueDatePicker;
