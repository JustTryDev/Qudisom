// 통합 결제 페이지 타입 정의 (Unified Payment Page Types)

// ==================== 메인 타입 (Main Types) ====================

// 결제 주체 모드 (Payor Mode Types)
// - 'single': 한 명이 전액 결제 (Single payor pays all)
// - 'per-schedule': 일정별로 다른 결제자 (Different payor per schedule)
// - 'split-amount': 금액을 나눠서 여러 명이 결제 (Split amount among multiple payors)
// - 'deferred': 결제자 정보 나중에 입력 (Defer payor information input)
export type PayorMode = 'single' | 'per-schedule' | 'split-amount' | 'deferred';

// 금액 분할 결제자 (Split Amount Payor)
// 100% 결제에서도 여러 명이 금액을 나눠서 결제할 때 사용
// 각 결제자는 독립적인 결제 수단을 선택할 수 있음
export interface SplitPayor {
  id: string;
  payor: PayorInfo;
  amount: number; // 이 결제자가 결제할 금액 (Amount this payor will pay)
  methods: PaymentMethod[]; // 이 결제자의 결제 수단 (This payor's payment methods)
  // 🆕 결제 예정일 - 멀티 결제 시 각 결제자별로 다를 수 있음
  dueDate?: string; // 결제 예정 날짜 (YYYY-MM-DD)
  dueTime?: string; // 결제 예정 시간 (HH:mm, 당일 결제 시)
}

export interface UnifiedPayment {
  // Step 1: 결제 일정 (Payment Schedule)
  schedules: PaymentSchedule[];

  // Step 2: 결제 주체 (Payor Info)
  payorMode: PayorMode;
  singlePayor?: PayorInfo;
  splitPayors: SplitPayor[]; // 금액 분할 결제자 목록 (Split amount payors list)
  savedPayors: SavedPayor[];

  // Step 5: 최종 확인 (Final Confirmation)
  useDeposit: boolean;
  depositAmount: number;
  availableDeposit: number;

  // 전자계약 관련 (Electronic Contract)
  contractRequired: boolean;
  contractSigners: ContractSigner[];
}

export interface PaymentSchedule {
  id: string;
  label: string; // "1차 결제", "선금", "잔금" 등
  amount: number;
  timing: PaymentTiming;
  dueDate: string; // 결제 예정 날짜 (Payment due date) - "2024-01-15" 형식
  dueTime?: string; // 결제 예정 시간 (Payment due time) - "14:00" 형식 (당일 결제 시 사용)

  // 결제 주체 (Payor - when payorMode is 'per-schedule')
  payor?: PayorInfo;

  // 결제 수단 (Payment Methods - multiple allowed)
  methods: PaymentMethod[];
}

export type PaymentTiming = 'pre-order' | 'post-order' | 'pre-ship' | 'post-ship';

// ==================== 결제 주체 (Payor) ====================

// 결제 주체 출처 (Payor Source)
// - 'self': 본인이 직접 결제 (Customer pays directly - auto-fill from customer info)
// - 'other': 다른 사람/회사가 결제 (Different person/company pays)
export type PayorSource = 'self' | 'other';

// 결제자 유형 (Payor Type)
// - 'individual': 개인 (Individual person)
// - 'company': 회사/기관 (Company/Organization)
export type PayorType = 'individual' | 'company';

export interface PayorInfo {
  source: PayorSource; // 본인 or 다른 사람 (Self or Other)
  type: PayorType; // 개인 or 회사 (Individual or Company)
  name: string;
  company?: string; // 회사일 때만 필수 (Required only for company)
  phone: string;
  email: string;
  // businessInfo는 MethodStep에서 결제 수단 선택 시에만 요청
  // (businessInfo is only requested in MethodStep when selecting payment method)
  businessInfo?: BusinessInfo;
}

export interface BusinessInfo {
  // OCR 메타데이터 (OCR Metadata)
  source: 'ocr' | 'manual' | 'saved';
  ocrConfidence?: number;
  ocrOriginal?: BusinessInfoFields;
  isModified: boolean;

  // 실제 데이터 (Actual Data)
  fields: BusinessInfoFields;
}

export interface BusinessInfoFields {
  businessNumber: string; // 사업자번호
  taxType: string; // 과세유형
  companyName: string; // 회사명
  ceoName: string; // 대표자명
  businessAddress: string; // 사업장 소재지
  headquarterAddress: string; // 본점 소재지
  businessType: string; // 업태
  businessItem: string; // 종목
  taxEmail: string; // 세금계산서 이메일
}

export interface SavedPayor {
  id: string;
  label: string;
  info: PayorInfo;
  lastUsed: Date;
}

// ==================== 결제 수단 (Payment Method) ====================

export type PaymentMethodType =
  | 'toss'
  | 'keyin'
  | 'bank'
  | 'narabill'
  | 'contract'
  | 'other';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  amount: number;

  // 수단별 상세 정보 (Method-specific Details)
  details: PaymentMethodDetails | null;

  // 증빙 정보 (Proof Document)
  autoReceipt: boolean; // 토스/키인은 true
  proof?: ProofDocument;

  // 사업자 정보 (Business Info) - 무통장/나라빌/수의계약 등 필요 시
  // PayorStep에서 제거되고 MethodStep에서 필요한 경우에만 수집
  businessInfo?: BusinessInfo;
}

export type PaymentMethodDetails =
  | KeyinData
  | BankData
  | FileUploadData
  | OtherData;

export interface KeyinData {
  type: 'keyin';
  installment: string;
  cardNumbers: string[];
  expMonth: string;
  expYear: string;
}

export interface BankData {
  type: 'bank';
  depositorName: string;
}

export interface FileUploadData {
  type: 'narabill' | 'contract';
  files: UploadedFile[];
  instructions: string;
  additionalNotes: string;
  businessInfo?: BusinessInfoFields; // 사업자 등록증 정보 (Business Registration Info)
}

export interface OtherData {
  type: 'other';
  description: string;
}

// ==================== 증빙 서류 (Proof Document) ====================

export type ProofType = 'tax-invoice' | 'cash-receipt' | 'none' | 'later';

export interface ProofDocument {
  id: string;
  type: ProofType;

  // 세금계산서/현금영수증 공통 (Common for Tax Invoice / Cash Receipt)
  recipientMode: 'same-as-payor' | 'different';
  differentRecipient?: BusinessInfoFields;

  // 세금계산서 전용 (Tax Invoice Only)
  issueDate?: string;
  preferredIssueDate: boolean;

  // 현금영수증 전용 (Cash Receipt Only)
  cashReceiptType?: 'income-deduction' | 'expense-proof';
  cashReceiptNumber?: string;

  // 검증 결과 (Validation Results)
  validations: ProofValidation[];
}

export interface ProofValidation {
  rule: ProofValidationRule;
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
  canOverride: boolean;
}

export type ProofValidationRule =
  | 'cash-receipt-required'
  | 'tax-invoice-deadline'
  | 'tax-invoice-recommended'
  | 'business-number-format'
  | 'email-format';

// ==================== 전자계약 (Electronic Contract) ====================

export interface ContractSigner {
  scheduleId: string;
  payorInfo: PayorInfo;
  signatureRequired: boolean; // 후불인 경우 true
  signatureStatus: 'pending' | 'signed' | 'rejected';
}

// ==================== 금액 변경 처리 (Amount Change Handling) ====================

export interface AmountChangeResult {
  scheduleId: string;
  originalAmount: number;
  newAmount: number;
  difference: number;
  affectedMethods: { id: string; amount: number }[];
  suggestedAction: AmountAdjustAction;
}

export type AmountAdjustAction = 'reset' | 'adjust-last' | 'add-new' | 'manual';

// ==================== 파일 업로드 (File Upload) ====================

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  instructions: string;
  uploadedAt: Date;
}

// ==================== OCR 관련 (OCR Related) ====================

export interface OcrResult {
  success: boolean;
  confidence: number;
  data?: BusinessInfoFields;
  errors?: OcrFieldError[];
}

export interface OcrFieldError {
  field: keyof BusinessInfoFields;
  message: string;
}

export interface FieldWithConfidence {
  value: string;
  confidence: number;
  needsReview: boolean; // confidence < 0.8
}

// ==================== 스텝 관련 (Step Related) ====================

export type PaymentStep = 1 | 2 | 3 | 4 | 5;

export interface StepStatus {
  step: PaymentStep;
  isCompleted: boolean;
  isActive: boolean;
  canEdit: boolean;
}

// ==================== 상태 관리 (State Management) ====================

export interface PaymentState {
  currentStep: PaymentStep;
  payment: UnifiedPayment;
  stepStatuses: StepStatus[];
  isSubmitting: boolean;
  errors: Record<string, string>;
}

export type PaymentAction =
  | { type: 'SET_STEP'; payload: PaymentStep }
  | { type: 'COMPLETE_STEP'; payload: PaymentStep }
  | { type: 'EDIT_STEP'; payload: PaymentStep }
  | { type: 'SET_SCHEDULES'; payload: PaymentSchedule[] }
  | { type: 'ADD_SCHEDULE'; payload: PaymentSchedule }
  | { type: 'UPDATE_SCHEDULE'; payload: { id: string; data: Partial<PaymentSchedule> } }
  | { type: 'REMOVE_SCHEDULE'; payload: string }
  | { type: 'SET_PAYOR_MODE'; payload: PayorMode }
  | { type: 'SET_SINGLE_PAYOR'; payload: PayorInfo }
  | { type: 'SET_SCHEDULE_PAYOR'; payload: { scheduleId: string; payor: PayorInfo } }
  // 분할 결제자 액션 (Split Payor Actions)
  | { type: 'ADD_SPLIT_PAYOR'; payload: SplitPayor }
  | { type: 'UPDATE_SPLIT_PAYOR'; payload: { id: string; data: Partial<SplitPayor> } }
  | { type: 'REMOVE_SPLIT_PAYOR'; payload: string }
  // 분할 결제자 결제 수단 액션 (Split Payor Payment Method Actions)
  | { type: 'ADD_SPLIT_PAYOR_METHOD'; payload: { splitPayorId: string; method: PaymentMethod } }
  | { type: 'UPDATE_SPLIT_PAYOR_METHOD'; payload: { splitPayorId: string; methodId: string; data: Partial<PaymentMethod> } }
  | { type: 'REMOVE_SPLIT_PAYOR_METHOD'; payload: { splitPayorId: string; methodId: string } }
  | { type: 'ADD_PAYMENT_METHOD'; payload: { scheduleId: string; method: PaymentMethod } }
  | { type: 'UPDATE_PAYMENT_METHOD'; payload: { scheduleId: string; methodId: string; data: Partial<PaymentMethod> } }
  | { type: 'REMOVE_PAYMENT_METHOD'; payload: { scheduleId: string; methodId: string } }
  | { type: 'SET_PROOF'; payload: { scheduleId: string; methodId: string; proof: ProofDocument } }
  | { type: 'SET_USE_DEPOSIT'; payload: boolean }
  | { type: 'SET_DEPOSIT_AMOUNT'; payload: number }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { field: string; message: string } }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'RESET' };
