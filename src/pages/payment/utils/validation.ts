// 일정별 결제자 배분 검증 로직 (Schedule Payor Allocation Validation Logic)

import type {
  PaymentSchedule,
  SplitPayor,
  SchedulePayorAllocation,
} from '../types';

// ==================== 검증 결과 타입 (Validation Result Types) ====================

export interface AllocationValidationResult {
  isValid: boolean;
  errors: AllocationError[];
}

export interface AllocationError {
  type: 'schedule-shortage' | 'schedule-overflow' | 'payor-shortage' | 'payor-overflow';
  message: string;
  scheduleId?: string;
  splitPayorId?: string;
  expected?: number;
  actual?: number;
}

// ==================== 일정별 검증 (Schedule Validation) ====================

/**
 * 각 일정별로 배분된 금액의 합계가 일정 금액과 일치하는지 검증
 * Validates that the sum of allocated amounts for each schedule matches the schedule amount
 *
 * 예시 (Example):
 * - 선금 500,000원에 A(150k), B(200k), C(150k) 배분 → 합계 500k ✓
 * - 잔금 500,000원에 A(200k), B(200k) 배분 → 합계 400k, 100k 부족 ✗
 */
export function validateScheduleAllocations(
  schedules: PaymentSchedule[],
  allocations: SchedulePayorAllocation[]
): AllocationValidationResult {
  const errors: AllocationError[] = [];

  for (const schedule of schedules) {
    // 해당 일정에 배분된 모든 allocation 합계 계산
    const totalAllocated = allocations
      .filter((alloc) => alloc.scheduleId === schedule.id)
      .reduce((sum, alloc) => sum + alloc.amount, 0);

    if (totalAllocated < schedule.amount) {
      // 부족한 경우 (Shortage)
      errors.push({
        type: 'schedule-shortage',
        message: `${schedule.label}: ${schedule.amount.toLocaleString()}원 중 ${totalAllocated.toLocaleString()}원만 배분되었습니다 (${(schedule.amount - totalAllocated).toLocaleString()}원 부족)`,
        scheduleId: schedule.id,
        expected: schedule.amount,
        actual: totalAllocated,
      });
    } else if (totalAllocated > schedule.amount) {
      // 초과한 경우 (Overflow)
      errors.push({
        type: 'schedule-overflow',
        message: `${schedule.label}: ${schedule.amount.toLocaleString()}원을 초과하여 ${totalAllocated.toLocaleString()}원이 배분되었습니다 (${(totalAllocated - schedule.amount).toLocaleString()}원 초과)`,
        scheduleId: schedule.id,
        expected: schedule.amount,
        actual: totalAllocated,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==================== 결제자별 검증 (Payor Validation) ====================

/**
 * 각 결제자별로 배분한 금액의 합계가 결제자 담당 금액과 일치하는지 검증
 * Validates that the sum of allocated amounts for each payor matches the payor's total amount
 *
 * 예시 (Example):
 * - A(300k): 선금 150k + 잔금 150k = 300k ✓
 * - B(300k): 선금 200k + 잔금 50k = 250k, 50k 부족 ✗
 * - C(400k): 선금 150k + 잔금 300k = 450k, 50k 초과 ✗
 */
export function validatePayorAllocations(
  splitPayors: SplitPayor[],
  allocations: SchedulePayorAllocation[]
): AllocationValidationResult {
  const errors: AllocationError[] = [];

  for (const payor of splitPayors) {
    // 해당 결제자가 배분한 모든 allocation 합계 계산
    const totalAllocated = allocations
      .filter((alloc) => alloc.splitPayorId === payor.id)
      .reduce((sum, alloc) => sum + alloc.amount, 0);

    if (totalAllocated < payor.amount) {
      // 부족한 경우 (Shortage)
      errors.push({
        type: 'payor-shortage',
        message: `${payor.payor.name}: ${payor.amount.toLocaleString()}원 중 ${totalAllocated.toLocaleString()}원만 배분했습니다 (${(payor.amount - totalAllocated).toLocaleString()}원 부족)`,
        splitPayorId: payor.id,
        expected: payor.amount,
        actual: totalAllocated,
      });
    } else if (totalAllocated > payor.amount) {
      // 초과한 경우 (Overflow)
      errors.push({
        type: 'payor-overflow',
        message: `${payor.payor.name}: ${payor.amount.toLocaleString()}원을 초과하여 ${totalAllocated.toLocaleString()}원을 배분했습니다 (${(totalAllocated - payor.amount).toLocaleString()}원 초과)`,
        splitPayorId: payor.id,
        expected: payor.amount,
        actual: totalAllocated,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==================== 전체 검증 (Full Validation) ====================

/**
 * 일정별 + 결제자별 검증을 모두 수행
 * Performs both schedule-level and payor-level validation
 *
 * 사용 예시 (Usage Example):
 * ```tsx
 * const result = validateAllAllocations(schedules, splitPayors, allocations);
 * if (!result.isValid) {
 *   result.errors.forEach(err => console.error(err.message));
 * }
 * ```
 */
export function validateAllAllocations(
  schedules: PaymentSchedule[],
  splitPayors: SplitPayor[],
  allocations: SchedulePayorAllocation[]
): AllocationValidationResult {
  const scheduleValidation = validateScheduleAllocations(schedules, allocations);
  const payorValidation = validatePayorAllocations(splitPayors, allocations);

  return {
    isValid: scheduleValidation.isValid && payorValidation.isValid,
    errors: [...scheduleValidation.errors, ...payorValidation.errors],
  };
}

// ==================== 헬퍼 함수 (Helper Functions) ====================

/**
 * 특정 일정에 대한 배분 상태 계산
 * Calculate allocation status for a specific schedule
 */
export function getScheduleAllocationStatus(
  schedule: PaymentSchedule,
  allocations: SchedulePayorAllocation[]
): {
  totalAllocated: number;
  remaining: number;
  percentage: number;
  status: 'complete' | 'partial' | 'overflow';
} {
  const totalAllocated = allocations
    .filter((alloc) => alloc.scheduleId === schedule.id)
    .reduce((sum, alloc) => sum + alloc.amount, 0);

  const remaining = schedule.amount - totalAllocated;
  const percentage = schedule.amount > 0 ? (totalAllocated / schedule.amount) * 100 : 0;

  let status: 'complete' | 'partial' | 'overflow';
  if (totalAllocated === schedule.amount) {
    status = 'complete';
  } else if (totalAllocated > schedule.amount) {
    status = 'overflow';
  } else {
    status = 'partial';
  }

  return {
    totalAllocated,
    remaining,
    percentage,
    status,
  };
}

/**
 * 특정 결제자에 대한 배분 상태 계산
 * Calculate allocation status for a specific payor
 */
export function getPayorAllocationStatus(
  payor: SplitPayor,
  allocations: SchedulePayorAllocation[]
): {
  totalAllocated: number;
  remaining: number;
  percentage: number;
  status: 'complete' | 'partial' | 'overflow';
} {
  const totalAllocated = allocations
    .filter((alloc) => alloc.splitPayorId === payor.id)
    .reduce((sum, alloc) => sum + alloc.amount, 0);

  const remaining = payor.amount - totalAllocated;
  const percentage = payor.amount > 0 ? (totalAllocated / payor.amount) * 100 : 0;

  let status: 'complete' | 'partial' | 'overflow';
  if (totalAllocated === payor.amount) {
    status = 'complete';
  } else if (totalAllocated > payor.amount) {
    status = 'overflow';
  } else {
    status = 'partial';
  }

  return {
    totalAllocated,
    remaining,
    percentage,
    status,
  };
}
