// 금액 동기화 훅 (Amount Sync Hook)
// 상위 금액 변경 시 하위 항목에 미치는 영향을 처리

import { useCallback, useMemo, useState } from 'react';
import type {
  PaymentSchedule,
  PaymentMethod,
  AmountChangeResult,
  AmountAdjustAction,
} from '../types';

interface UseAmountSyncOptions {
  schedules: PaymentSchedule[];
  onSchedulesChange: (schedules: PaymentSchedule[]) => void;
}

interface UseAmountSyncReturn {
  // 금액 변경 결과 (Amount change result)
  changeResult: AmountChangeResult | null;

  // 모달 상태 (Modal state)
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // 일정 금액 변경 핸들러 (Schedule amount change handler)
  handleScheduleAmountChange: (
    scheduleId: string,
    newAmount: number
  ) => AmountChangeResult | null;

  // 액션 선택 핸들러 (Action selection handler)
  handleActionSelect: (action: AmountAdjustAction) => void;

  // 검증 함수 (Validation functions)
  validateScheduleAmount: (scheduleId: string) => boolean;
  getScheduleRemaining: (scheduleId: string) => number;
}

export function useAmountSync({
  schedules,
  onSchedulesChange,
}: UseAmountSyncOptions): UseAmountSyncReturn {
  const [changeResult, setChangeResult] = useState<AmountChangeResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 일정 금액 변경 처리 (Handle schedule amount change)
  const handleScheduleAmountChange = useCallback(
    (scheduleId: string, newAmount: number): AmountChangeResult | null => {
      const schedule = schedules.find((s) => s.id === scheduleId);
      if (!schedule) return null;

      const originalAmount = schedule.amount;
      const difference = newAmount - originalAmount;

      // 차이가 없으면 null 반환 (No change)
      if (difference === 0) return null;

      // 영향받는 메서드 (Affected methods)
      const affectedMethods = schedule.methods.map((m) => ({
        id: m.id,
        amount: m.amount,
      }));

      // 권장 액션 결정 (Determine suggested action)
      let suggestedAction: AmountAdjustAction = 'manual';

      if (schedule.methods.length === 0) {
        suggestedAction = 'reset'; // 메서드가 없으면 리셋 필요 없음
      } else if (schedule.methods.length === 1) {
        suggestedAction = 'adjust-last'; // 하나면 마지막 조정
      } else if (difference > 0) {
        suggestedAction = 'add-new'; // 증가면 새로 추가
      } else {
        suggestedAction = 'adjust-last'; // 감소면 마지막 조정
      }

      const result: AmountChangeResult = {
        scheduleId,
        originalAmount,
        newAmount,
        difference,
        affectedMethods,
        suggestedAction,
      };

      setChangeResult(result);

      // 메서드가 있으면 모달 표시 (Show modal if methods exist)
      if (schedule.methods.length > 0) {
        setIsModalOpen(true);
      } else {
        // 메서드가 없으면 바로 금액 업데이트
        onSchedulesChange(
          schedules.map((s) =>
            s.id === scheduleId ? { ...s, amount: newAmount } : s
          )
        );
      }

      return result;
    },
    [schedules, onSchedulesChange]
  );

  // 액션 선택 처리 (Handle action selection)
  const handleActionSelect = useCallback(
    (action: AmountAdjustAction) => {
      if (!changeResult) return;

      const { scheduleId, newAmount, difference } = changeResult;

      const updatedSchedules = schedules.map((schedule) => {
        if (schedule.id !== scheduleId) return schedule;

        let updatedMethods = [...schedule.methods];

        switch (action) {
          case 'reset':
            // 모든 메서드 초기화 (Reset all methods)
            updatedMethods = [];
            break;

          case 'adjust-last':
            // 마지막 메서드에 차액 반영 (Adjust last method)
            if (updatedMethods.length > 0) {
              const lastIndex = updatedMethods.length - 1;
              const lastMethod = updatedMethods[lastIndex];
              const newMethodAmount = Math.max(0, lastMethod.amount + difference);
              updatedMethods[lastIndex] = {
                ...lastMethod,
                amount: newMethodAmount,
              };
            }
            break;

          case 'add-new':
            // 새 메서드 추가 (Add new method) - 증가분만
            if (difference > 0) {
              updatedMethods.push({
                id: `method-${Date.now()}`,
                type: 'toss',
                amount: difference,
                details: null,
                autoReceipt: true,
              });
            }
            break;

          case 'manual':
            // 수동 처리 - 변경 없음 (Manual - no change)
            break;
        }

        return {
          ...schedule,
          amount: newAmount,
          methods: updatedMethods,
        };
      });

      onSchedulesChange(updatedSchedules);
      setIsModalOpen(false);
      setChangeResult(null);
    },
    [changeResult, schedules, onSchedulesChange]
  );

  // 일정 금액 검증 (Validate schedule amount)
  const validateScheduleAmount = useCallback(
    (scheduleId: string): boolean => {
      const schedule = schedules.find((s) => s.id === scheduleId);
      if (!schedule) return false;

      const methodTotal = schedule.methods.reduce((sum, m) => sum + m.amount, 0);
      return methodTotal === schedule.amount;
    },
    [schedules]
  );

  // 일정 남은 금액 계산 (Get schedule remaining amount)
  const getScheduleRemaining = useCallback(
    (scheduleId: string): number => {
      const schedule = schedules.find((s) => s.id === scheduleId);
      if (!schedule) return 0;

      const methodTotal = schedule.methods.reduce((sum, m) => sum + m.amount, 0);
      return schedule.amount - methodTotal;
    },
    [schedules]
  );

  return {
    changeResult,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: () => {
      setIsModalOpen(false);
      setChangeResult(null);
    },
    handleScheduleAmountChange,
    handleActionSelect,
    validateScheduleAmount,
    getScheduleRemaining,
  };
}

export default useAmountSync;
