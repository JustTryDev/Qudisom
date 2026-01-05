// 통합 결제 페이지 상수 정의 (Unified Payment Page Constants)

import type {
  PaymentMethodType,
  PaymentTiming,
  ProofType,
  PaymentStep,
  BusinessInfoFields,
  PayorInfo,
  PaymentSchedule,
  PaymentMethod,
  UnifiedPayment,
  StepStatus,
} from '../types';

// ==================== 결제 수단 (Payment Methods) ====================

export const PAYMENT_METHODS: {
  type: PaymentMethodType;
  label: string;
  description: string;
  autoReceipt: boolean;
  requiresProof: boolean;
}[] = [
  {
    type: 'toss',
    label: '토스페이먼츠',
    description: '카드, 간편결제 등 다양한 결제 수단',
    autoReceipt: true,
    requiresProof: false,
  },
  {
    type: 'keyin',
    label: '안심 키인',
    description: '카드번호 직접 입력 결제',
    autoReceipt: true,
    requiresProof: false,
  },
  {
    type: 'bank',
    label: '무통장 입금',
    description: '계좌이체로 결제',
    autoReceipt: false,
    requiresProof: true,
  },
  {
    type: 'narabill',
    label: '나라빌',
    description: '공공기관 전자조달 결제',
    autoReceipt: false,
    requiresProof: true,
  },
  {
    type: 'contract',
    label: '수의 계약',
    description: '수의계약서 기반 결제',
    autoReceipt: false,
    requiresProof: true,
  },
  {
    type: 'other',
    label: '기타 결제',
    description: '기타 방식으로 결제',
    autoReceipt: false,
    requiresProof: true,
  },
];

export const PAYMENT_METHOD_MAP = PAYMENT_METHODS.reduce(
  (acc, method) => {
    acc[method.type] = method;
    return acc;
  },
  {} as Record<PaymentMethodType, (typeof PAYMENT_METHODS)[number]>
);

// ==================== 결제 시점 (Payment Timing) ====================

export const PAYMENT_TIMINGS: {
  value: PaymentTiming;
  label: string;
  description: string;
  isDeferred: boolean;
}[] = [
  {
    value: 'pre-order',
    label: '발주 전',
    description: '발주 전 결제 완료',
    isDeferred: false,
  },
  {
    value: 'post-order',
    label: '발주 후',
    description: '발주 후 결제',
    isDeferred: false,
  },
  {
    value: 'pre-ship',
    label: '출고 전',
    description: '출고 전 결제 완료',
    isDeferred: false,
  },
  {
    value: 'post-ship',
    label: '출고 후',
    description: '출고 후 결제 (후불)',
    isDeferred: true,
  },
];

export const PAYMENT_TIMING_MAP = PAYMENT_TIMINGS.reduce(
  (acc, timing) => {
    acc[timing.value] = timing;
    return acc;
  },
  {} as Record<PaymentTiming, (typeof PAYMENT_TIMINGS)[number]>
);

// ==================== 증빙 서류 (Proof Types) ====================

export const PROOF_TYPES: {
  value: ProofType;
  label: string;
  description: string;
}[] = [
  {
    value: 'tax-invoice',
    label: '세금계산서',
    description: '사업자 간 거래 시 발행',
  },
  {
    value: 'cash-receipt',
    label: '현금영수증',
    description: '개인 소득공제 또는 사업자 지출증빙',
  },
  {
    value: 'none',
    label: '필요 없음',
    description: '증빙 서류 불필요',
  },
  {
    value: 'later',
    label: '나중에 입력',
    description: '결제 후 별도 입력',
  },
];

export const PROOF_TYPE_MAP = PROOF_TYPES.reduce(
  (acc, proof) => {
    acc[proof.value] = proof;
    return acc;
  },
  {} as Record<ProofType, (typeof PROOF_TYPES)[number]>
);

// ==================== 현금영수증 유형 (Cash Receipt Types) ====================

export const CASH_RECEIPT_TYPES = [
  {
    value: 'income-deduction' as const,
    label: '소득공제용',
    description: '개인 소득공제를 위한 발급',
  },
  {
    value: 'expense-proof' as const,
    label: '지출증빙용',
    description: '사업자 지출증빙을 위한 발급',
  },
];

// ==================== 과세 유형 (Tax Types) ====================

export const TAX_TYPES = [
  { value: '일반과세자', label: '일반과세자' },
  { value: '간이과세자', label: '간이과세자' },
  { value: '면세사업자', label: '면세사업자' },
];

// ==================== 스텝 정보 (Step Info) ====================

export const STEP_INFO: {
  step: PaymentStep;
  title: string;
  description: string;
}[] = [
  {
    step: 1,
    title: '결제 일정',
    description: '결제 금액과 시점을 설정합니다',
  },
  {
    step: 2,
    title: '결제 주체',
    description: '결제자 정보를 입력합니다',
  },
  {
    step: 3,
    title: '결제 수단',
    description: '결제 방법을 선택합니다',
  },
  {
    step: 4,
    title: '증빙 서류',
    description: '세금계산서/현금영수증을 설정합니다',
  },
  {
    step: 5,
    title: '최종 확인',
    description: '입력 정보를 확인하고 제출합니다',
  },
];

// ==================== 기본값 (Default Values) ====================

export const EMPTY_BUSINESS_INFO_FIELDS: BusinessInfoFields = {
  businessNumber: '',
  taxType: '',
  companyName: '',
  ceoName: '',
  businessAddress: '',
  headquarterAddress: '',
  businessType: '',
  businessItem: '',
  taxEmail: '',
};

export const EMPTY_PAYOR_INFO: PayorInfo = {
  type: 'personal',
  name: '',
  company: '',
  phone: '',
  email: '',
};

export const createDefaultSchedule = (
  id: string,
  label: string,
  amount: number = 0,
  timing: PaymentTiming = 'pre-order'
): PaymentSchedule => ({
  id,
  label,
  amount,
  timing,
  methods: [],
});

export const createDefaultPaymentMethod = (
  id: string,
  type: PaymentMethodType = 'toss',
  amount: number = 0
): PaymentMethod => ({
  id,
  type,
  amount,
  details: null,
  autoReceipt: PAYMENT_METHOD_MAP[type]?.autoReceipt ?? false,
});

export const INITIAL_STEP_STATUSES: StepStatus[] = [
  { step: 1, isCompleted: false, isActive: true, canEdit: true },
  { step: 2, isCompleted: false, isActive: false, canEdit: false },
  { step: 3, isCompleted: false, isActive: false, canEdit: false },
  { step: 4, isCompleted: false, isActive: false, canEdit: false },
  { step: 5, isCompleted: false, isActive: false, canEdit: false },
];

export const INITIAL_UNIFIED_PAYMENT: UnifiedPayment = {
  schedules: [createDefaultSchedule('schedule-1', '1차 결제')],
  payorMode: 'single',
  singlePayor: { ...EMPTY_PAYOR_INFO },
  savedPayors: [],
  useDeposit: false,
  depositAmount: 0,
  availableDeposit: 0,
  contractRequired: false,
  contractSigners: [],
};

// ==================== 검증 규칙 (Validation Rules) ====================

export const VALIDATION_RULES = {
  // 현금영수증 의무발행 금액 (Cash receipt mandatory amount)
  CASH_RECEIPT_MANDATORY_AMOUNT: 100000, // 10만원

  // 사업자번호 형식 (Business number format)
  BUSINESS_NUMBER_REGEX: /^\d{3}-\d{2}-\d{5}$/,

  // 이메일 형식 (Email format)
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // 전화번호 형식 (Phone number format)
  PHONE_REGEX: /^01[0-9]-?\d{3,4}-?\d{4}$/,

  // OCR 신뢰도 임계값 (OCR confidence threshold)
  OCR_CONFIDENCE_THRESHOLD: 0.8,
};

// ==================== 계좌 정보 (Bank Account Info) ====================

export const BANK_ACCOUNT_INFO = {
  bankName: '우리은행',
  accountNumber: '1005-XXXX-XXXXX',
  accountHolder: '주식회사 쿠디솜',
};

// ==================== 할부 옵션 (Installment Options) ====================

export const INSTALLMENT_OPTIONS = [
  { value: '0', label: '일시불' },
  { value: '2', label: '2개월' },
  { value: '3', label: '3개월' },
  { value: '4', label: '4개월' },
  { value: '5', label: '5개월' },
  { value: '6', label: '6개월' },
  { value: '7', label: '7개월' },
  { value: '8', label: '8개월' },
  { value: '9', label: '9개월' },
  { value: '10', label: '10개월' },
  { value: '11', label: '11개월' },
  { value: '12', label: '12개월' },
];

// ==================== 프리셋 (Payment Term Presets) ====================

export const PAYMENT_TERM_PRESETS = [
  {
    id: '100-pre',
    label: '발주 전 100% 선금',
    schedules: [{ percentage: 100, timing: 'pre-order' as PaymentTiming }],
  },
  {
    id: '100-before-ship',
    label: '출고 전 100%',
    schedules: [{ percentage: 100, timing: 'pre-ship' as PaymentTiming }],
  },
  {
    id: '100-after-ship',
    label: '출고 후 100%',
    schedules: [{ percentage: 100, timing: 'post-ship' as PaymentTiming }],
  },
  {
    id: '50-50-after',
    label: '50% 선금 + 출고 후 50%',
    schedules: [
      { percentage: 50, timing: 'pre-order' as PaymentTiming },
      { percentage: 50, timing: 'post-ship' as PaymentTiming },
    ],
  },
  {
    id: '50-50-before',
    label: '50% 선금 + 출고 전 50%',
    schedules: [
      { percentage: 50, timing: 'pre-order' as PaymentTiming },
      { percentage: 50, timing: 'pre-ship' as PaymentTiming },
    ],
  },
  {
    id: 'custom',
    label: '직접 입력',
    schedules: [],
  },
];
