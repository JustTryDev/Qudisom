// 통합 결제 페이지 상태 관리 훅 (Unified Payment State Management Hook)

import { useReducer, useCallback, useMemo } from 'react';
import type {
  PaymentState,
  PaymentAction,
  PaymentStep,
  PaymentSchedule,
  PayorInfo,
  PayorMode,
  SplitPayor,
  PaymentMethod,
  ProofDocument,
  StepStatus,
  SchedulePayorAllocation,
} from '../types';
import {
  INITIAL_UNIFIED_PAYMENT,
  INITIAL_STEP_STATUSES,
  PAYMENT_TIMING_MAP,
} from '../utils/constants';

// ==================== 초기 상태 (Initial State) ====================

const initialState: PaymentState = {
  currentStep: 1,
  payment: INITIAL_UNIFIED_PAYMENT,
  stepStatuses: INITIAL_STEP_STATUSES,
  isSubmitting: false,
  errors: {},
};

// ==================== 리듀서 (Reducer) ====================

function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    // 스텝 관련 (Step Related)
    case 'SET_STEP': {
      const newStep = action.payload;
      return {
        ...state,
        currentStep: newStep,
        stepStatuses: state.stepStatuses.map((s) => ({
          ...s,
          isActive: s.step === newStep,
        })),
      };
    }

    case 'COMPLETE_STEP': {
      const completedStep = action.payload;
      const nextStep = Math.min(completedStep + 1, 5) as PaymentStep;
      return {
        ...state,
        currentStep: nextStep,
        stepStatuses: state.stepStatuses.map((s) => {
          if (s.step === completedStep) {
            return { ...s, isCompleted: true, isActive: false, canEdit: true };
          }
          if (s.step === nextStep) {
            return { ...s, isActive: true, canEdit: true };
          }
          return s;
        }),
      };
    }

    case 'EDIT_STEP': {
      const editStep = action.payload;
      return {
        ...state,
        currentStep: editStep,
        stepStatuses: state.stepStatuses.map((s) => ({
          ...s,
          isActive: s.step === editStep,
        })),
      };
    }

    // 결제 일정 (Payment Schedule)
    case 'SET_SCHEDULES':
      return {
        ...state,
        payment: {
          ...state.payment,
          schedules: action.payload,
          contractRequired: action.payload.some(
            (s) => PAYMENT_TIMING_MAP[s.timing]?.isDeferred
          ),
        },
      };

    case 'ADD_SCHEDULE':
      return {
        ...state,
        payment: {
          ...state.payment,
          schedules: [...state.payment.schedules, action.payload],
          contractRequired: [...state.payment.schedules, action.payload].some(
            (s) => PAYMENT_TIMING_MAP[s.timing]?.isDeferred
          ),
        },
      };

    case 'UPDATE_SCHEDULE': {
      const { id, data } = action.payload;
      const updatedSchedules = state.payment.schedules.map((s) =>
        s.id === id ? { ...s, ...data } : s
      );
      return {
        ...state,
        payment: {
          ...state.payment,
          schedules: updatedSchedules,
          contractRequired: updatedSchedules.some(
            (s) => PAYMENT_TIMING_MAP[s.timing]?.isDeferred
          ),
        },
      };
    }

    case 'REMOVE_SCHEDULE': {
      const filteredSchedules = state.payment.schedules.filter(
        (s) => s.id !== action.payload
      );
      return {
        ...state,
        payment: {
          ...state.payment,
          schedules: filteredSchedules,
          // 🆕 해당 일정의 모든 allocation 제거 (Remove all allocations for this schedule)
          schedulePayorAllocations: state.payment.schedulePayorAllocations.filter(
            (alloc) => alloc.scheduleId !== action.payload
          ),
          contractRequired: filteredSchedules.some(
            (s) => PAYMENT_TIMING_MAP[s.timing]?.isDeferred
          ),
        },
      };
    }

    // 결제 주체 (Payor)
    case 'SET_PAYOR_MODE':
      return {
        ...state,
        payment: {
          ...state.payment,
          payorMode: action.payload,
        },
      };

    case 'SET_SINGLE_PAYOR':
      return {
        ...state,
        payment: {
          ...state.payment,
          singlePayor: action.payload,
        },
      };

    case 'SET_SCHEDULE_PAYOR': {
      const { scheduleId, payor } = action.payload;
      return {
        ...state,
        payment: {
          ...state.payment,
          schedules: state.payment.schedules.map((s) =>
            s.id === scheduleId ? { ...s, payor } : s
          ),
        },
      };
    }

    // 분할 결제자 액션 (Split Payor Actions)
    case 'ADD_SPLIT_PAYOR':
      return {
        ...state,
        payment: {
          ...state.payment,
          splitPayors: [...state.payment.splitPayors, action.payload],
        },
      };

    case 'UPDATE_SPLIT_PAYOR': {
      const { id, data } = action.payload;
      return {
        ...state,
        payment: {
          ...state.payment,
          splitPayors: state.payment.splitPayors.map((sp) =>
            sp.id === id ? { ...sp, ...data } : sp
          ),
        },
      };
    }

    case 'REMOVE_SPLIT_PAYOR':
      return {
        ...state,
        payment: {
          ...state.payment,
          splitPayors: state.payment.splitPayors.filter(
            (sp) => sp.id !== action.payload
          ),
          // 🆕 해당 결제자의 모든 allocation 제거 (Remove all allocations for this payor)
          schedulePayorAllocations: state.payment.schedulePayorAllocations.filter(
            (alloc) => alloc.splitPayorId !== action.payload
          ),
        },
      };

    // 일정별 결제자 배분 (Schedule Payor Allocation)
    case 'ADD_ALLOCATION':
      return {
        ...state,
        payment: {
          ...state.payment,
          schedulePayorAllocations: [
            ...state.payment.schedulePayorAllocations,
            action.payload,
          ],
        },
      };

    case 'UPDATE_ALLOCATION': {
      const { id, amount } = action.payload;
      return {
        ...state,
        payment: {
          ...state.payment,
          schedulePayorAllocations: state.payment.schedulePayorAllocations.map(
            (alloc) => (alloc.id === id ? { ...alloc, amount } : alloc)
          ),
        },
      };
    }

    case 'REMOVE_ALLOCATION':
      return {
        ...state,
        payment: {
          ...state.payment,
          schedulePayorAllocations: state.payment.schedulePayorAllocations.filter(
            (alloc) => alloc.id !== action.payload
          ),
        },
      };

    case 'REMOVE_ALLOCATIONS_BY_SCHEDULE':
      return {
        ...state,
        payment: {
          ...state.payment,
          schedulePayorAllocations: state.payment.schedulePayorAllocations.filter(
            (alloc) => alloc.scheduleId !== action.payload
          ),
        },
      };

    case 'REMOVE_ALLOCATIONS_BY_PAYOR':
      return {
        ...state,
        payment: {
          ...state.payment,
          schedulePayorAllocations: state.payment.schedulePayorAllocations.filter(
            (alloc) => alloc.splitPayorId !== action.payload
          ),
        },
      };

    // 분할 결제자 결제 수단 (Split Payor Payment Method)
    case 'ADD_SPLIT_PAYOR_METHOD': {
      const { splitPayorId, method } = action.payload;
      return {
        ...state,
        payment: {
          ...state.payment,
          splitPayors: state.payment.splitPayors.map((sp) =>
            sp.id === splitPayorId
              ? { ...sp, methods: [...sp.methods, method] }
              : sp
          ),
        },
      };
    }

    case 'UPDATE_SPLIT_PAYOR_METHOD': {
      const { splitPayorId, methodId, data } = action.payload;
      return {
        ...state,
        payment: {
          ...state.payment,
          splitPayors: state.payment.splitPayors.map((sp) =>
            sp.id === splitPayorId
              ? {
                  ...sp,
                  methods: sp.methods.map((m) =>
                    m.id === methodId ? { ...m, ...data } : m
                  ),
                }
              : sp
          ),
        },
      };
    }

    case 'REMOVE_SPLIT_PAYOR_METHOD': {
      const { splitPayorId, methodId } = action.payload;
      return {
        ...state,
        payment: {
          ...state.payment,
          splitPayors: state.payment.splitPayors.map((sp) =>
            sp.id === splitPayorId
              ? { ...sp, methods: sp.methods.filter((m) => m.id !== methodId) }
              : sp
          ),
        },
      };
    }

    // 결제 수단 (Payment Method)
    case 'ADD_PAYMENT_METHOD': {
      const { scheduleId, method } = action.payload;
      return {
        ...state,
        payment: {
          ...state.payment,
          schedules: state.payment.schedules.map((s) =>
            s.id === scheduleId
              ? { ...s, methods: [...s.methods, method] }
              : s
          ),
        },
      };
    }

    case 'UPDATE_PAYMENT_METHOD': {
      const { scheduleId, methodId, data } = action.payload;
      return {
        ...state,
        payment: {
          ...state.payment,
          schedules: state.payment.schedules.map((s) =>
            s.id === scheduleId
              ? {
                  ...s,
                  methods: s.methods.map((m) =>
                    m.id === methodId ? { ...m, ...data } : m
                  ),
                }
              : s
          ),
        },
      };
    }

    case 'REMOVE_PAYMENT_METHOD': {
      const { scheduleId, methodId } = action.payload;
      return {
        ...state,
        payment: {
          ...state.payment,
          schedules: state.payment.schedules.map((s) =>
            s.id === scheduleId
              ? { ...s, methods: s.methods.filter((m) => m.id !== methodId) }
              : s
          ),
        },
      };
    }

    // 증빙 서류 (Proof Document)
    case 'SET_PROOF': {
      const { scheduleId, methodId, proof } = action.payload;
      return {
        ...state,
        payment: {
          ...state.payment,
          schedules: state.payment.schedules.map((s) =>
            s.id === scheduleId
              ? {
                  ...s,
                  methods: s.methods.map((m) =>
                    m.id === methodId ? { ...m, proof } : m
                  ),
                }
              : s
          ),
        },
      };
    }

    // 예치금 (Deposit)
    case 'SET_USE_DEPOSIT':
      return {
        ...state,
        payment: {
          ...state.payment,
          useDeposit: action.payload,
          depositAmount: action.payload ? state.payment.depositAmount : 0,
        },
      };

    case 'SET_DEPOSIT_AMOUNT':
      return {
        ...state,
        payment: {
          ...state.payment,
          depositAmount: Math.min(
            action.payload,
            state.payment.availableDeposit
          ),
        },
      };

    // 제출 상태 (Submit State)
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    // 에러 (Errors)
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.message,
        },
      };

    case 'CLEAR_ERROR': {
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return {
        ...state,
        errors: newErrors,
      };
    }

    // 리셋 (Reset)
    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

// ==================== 훅 (Hook) ====================

export function usePaymentState(initialPayment?: Partial<PaymentState>) {
  const [state, dispatch] = useReducer(paymentReducer, {
    ...initialState,
    ...initialPayment,
  });

  // 스텝 액션 (Step Actions)
  const goToStep = useCallback((step: PaymentStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const completeStep = useCallback((step: PaymentStep) => {
    dispatch({ type: 'COMPLETE_STEP', payload: step });
  }, []);

  const editStep = useCallback((step: PaymentStep) => {
    dispatch({ type: 'EDIT_STEP', payload: step });
  }, []);

  // 결제 일정 액션 (Schedule Actions)
  const setSchedules = useCallback((schedules: PaymentSchedule[]) => {
    dispatch({ type: 'SET_SCHEDULES', payload: schedules });
  }, []);

  const addSchedule = useCallback((schedule: PaymentSchedule) => {
    dispatch({ type: 'ADD_SCHEDULE', payload: schedule });
  }, []);

  const updateSchedule = useCallback(
    (id: string, data: Partial<PaymentSchedule>) => {
      dispatch({ type: 'UPDATE_SCHEDULE', payload: { id, data } });
    },
    []
  );

  const removeSchedule = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_SCHEDULE', payload: id });
  }, []);

  // 결제 주체 액션 (Payor Actions)
  const setPayorMode = useCallback((mode: PayorMode) => {
    dispatch({ type: 'SET_PAYOR_MODE', payload: mode });
  }, []);

  const setSinglePayor = useCallback((payor: PayorInfo) => {
    dispatch({ type: 'SET_SINGLE_PAYOR', payload: payor });
  }, []);

  const setSchedulePayor = useCallback((scheduleId: string, payor: PayorInfo) => {
    dispatch({ type: 'SET_SCHEDULE_PAYOR', payload: { scheduleId, payor } });
  }, []);

  // 분할 결제자 액션 (Split Payor Actions)
  const addSplitPayor = useCallback((splitPayor: SplitPayor) => {
    dispatch({ type: 'ADD_SPLIT_PAYOR', payload: splitPayor });
  }, []);

  const updateSplitPayor = useCallback(
    (id: string, data: Partial<SplitPayor>) => {
      dispatch({ type: 'UPDATE_SPLIT_PAYOR', payload: { id, data } });
    },
    []
  );

  const removeSplitPayor = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_SPLIT_PAYOR', payload: id });
  }, []);

  // 일정별 결제자 배분 액션 (Schedule Payor Allocation Actions)
  const addAllocation = useCallback((allocation: SchedulePayorAllocation) => {
    dispatch({ type: 'ADD_ALLOCATION', payload: allocation });
  }, []);

  const updateAllocation = useCallback((id: string, amount: number) => {
    dispatch({ type: 'UPDATE_ALLOCATION', payload: { id, amount } });
  }, []);

  const removeAllocation = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ALLOCATION', payload: id });
  }, []);

  const removeAllocationsBySchedule = useCallback((scheduleId: string) => {
    dispatch({ type: 'REMOVE_ALLOCATIONS_BY_SCHEDULE', payload: scheduleId });
  }, []);

  const removeAllocationsByPayor = useCallback((payorId: string) => {
    dispatch({ type: 'REMOVE_ALLOCATIONS_BY_PAYOR', payload: payorId });
  }, []);

  // 분할 결제자 결제 수단 액션 (Split Payor Payment Method Actions)
  const addSplitPayorMethod = useCallback(
    (splitPayorId: string, method: PaymentMethod) => {
      dispatch({ type: 'ADD_SPLIT_PAYOR_METHOD', payload: { splitPayorId, method } });
    },
    []
  );

  const updateSplitPayorMethod = useCallback(
    (splitPayorId: string, methodId: string, data: Partial<PaymentMethod>) => {
      dispatch({
        type: 'UPDATE_SPLIT_PAYOR_METHOD',
        payload: { splitPayorId, methodId, data },
      });
    },
    []
  );

  const removeSplitPayorMethod = useCallback(
    (splitPayorId: string, methodId: string) => {
      dispatch({
        type: 'REMOVE_SPLIT_PAYOR_METHOD',
        payload: { splitPayorId, methodId },
      });
    },
    []
  );

  // 결제 수단 액션 (Payment Method Actions)
  const addPaymentMethod = useCallback(
    (scheduleId: string, method: PaymentMethod) => {
      dispatch({ type: 'ADD_PAYMENT_METHOD', payload: { scheduleId, method } });
    },
    []
  );

  const updatePaymentMethod = useCallback(
    (scheduleId: string, methodId: string, data: Partial<PaymentMethod>) => {
      dispatch({
        type: 'UPDATE_PAYMENT_METHOD',
        payload: { scheduleId, methodId, data },
      });
    },
    []
  );

  const removePaymentMethod = useCallback(
    (scheduleId: string, methodId: string) => {
      dispatch({
        type: 'REMOVE_PAYMENT_METHOD',
        payload: { scheduleId, methodId },
      });
    },
    []
  );

  // 증빙 서류 액션 (Proof Actions)
  const setProof = useCallback(
    (scheduleId: string, methodId: string, proof: ProofDocument) => {
      dispatch({ type: 'SET_PROOF', payload: { scheduleId, methodId, proof } });
    },
    []
  );

  // 예치금 액션 (Deposit Actions)
  const setUseDeposit = useCallback((use: boolean) => {
    dispatch({ type: 'SET_USE_DEPOSIT', payload: use });
  }, []);

  const setDepositAmount = useCallback((amount: number) => {
    dispatch({ type: 'SET_DEPOSIT_AMOUNT', payload: amount });
  }, []);

  // 제출 액션 (Submit Actions)
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: isSubmitting });
  }, []);

  // 에러 액션 (Error Actions)
  const setError = useCallback((field: string, message: string) => {
    dispatch({ type: 'SET_ERROR', payload: { field, message } });
  }, []);

  const clearError = useCallback((field: string) => {
    dispatch({ type: 'CLEAR_ERROR', payload: field });
  }, []);

  // 리셋 액션 (Reset Action)
  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // 계산된 값 (Computed Values)
  const totalAmount = useMemo(() => {
    return state.payment.schedules.reduce((sum, s) => sum + s.amount, 0);
  }, [state.payment.schedules]);

  const totalMethodAmount = useMemo(() => {
    return state.payment.schedules.reduce(
      (sum, s) => sum + s.methods.reduce((mSum, m) => mSum + m.amount, 0),
      0
    );
  }, [state.payment.schedules]);

  const finalAmount = useMemo(() => {
    return totalAmount - (state.payment.useDeposit ? state.payment.depositAmount : 0);
  }, [totalAmount, state.payment.useDeposit, state.payment.depositAmount]);

  const hasDeferred = useMemo(() => {
    return state.payment.schedules.some(
      (s) => PAYMENT_TIMING_MAP[s.timing]?.isDeferred
    );
  }, [state.payment.schedules]);

  const currentStepStatus = useMemo(() => {
    return state.stepStatuses.find(
      (s) => s.step === state.currentStep
    ) as StepStatus;
  }, [state.stepStatuses, state.currentStep]);

  return {
    // 상태 (State)
    state,
    currentStep: state.currentStep,
    payment: state.payment,
    stepStatuses: state.stepStatuses,
    isSubmitting: state.isSubmitting,
    errors: state.errors,

    // 스텝 액션 (Step Actions)
    goToStep,
    completeStep,
    editStep,

    // 결제 일정 액션 (Schedule Actions)
    setSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,

    // 결제 주체 액션 (Payor Actions)
    setPayorMode,
    setSinglePayor,
    setSchedulePayor,

    // 분할 결제자 액션 (Split Payor Actions)
    addSplitPayor,
    updateSplitPayor,
    removeSplitPayor,

    // 일정별 결제자 배분 액션 (Schedule Payor Allocation Actions)
    addAllocation,
    updateAllocation,
    removeAllocation,
    removeAllocationsBySchedule,
    removeAllocationsByPayor,

    // 분할 결제자 결제 수단 액션 (Split Payor Payment Method Actions)
    addSplitPayorMethod,
    updateSplitPayorMethod,
    removeSplitPayorMethod,

    // 결제 수단 액션 (Payment Method Actions)
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,

    // 증빙 서류 액션 (Proof Actions)
    setProof,

    // 예치금 액션 (Deposit Actions)
    setUseDeposit,
    setDepositAmount,

    // 제출 액션 (Submit Actions)
    setSubmitting,

    // 에러 액션 (Error Actions)
    setError,
    clearError,

    // 리셋 액션 (Reset Action)
    reset,

    // 계산된 값 (Computed Values)
    totalAmount,
    totalMethodAmount,
    finalAmount,
    hasDeferred,
    currentStepStatus,
  };
}

export type UsePaymentStateReturn = ReturnType<typeof usePaymentState>;
