// 통합 결제 페이지 타입 정의 (Unified Payment Page Types)

// ==================== 메인 타입 (Main Types) ====================

export interface UnifiedPayment {
  // Step 1: 결제 일정 (Payment Schedule)
  schedules: PaymentSchedule[];

  // Step 2: 결제 주체 (Payor Info)
  payorMode: 'single' | 'per-schedule';
  singlePayor?: PayorInfo;
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

  // 결제 주체 (Payor - when payorMode is 'per-schedule')
  payor?: PayorInfo;

  // 결제 수단 (Payment Methods - multiple allowed)
  methods: PaymentMethod[];
}

export type PaymentTiming = 'pre-order' | 'post-order' | 'pre-ship' | 'post-ship';

// ==================== 결제 주체 (Payor) ====================

export interface PayorInfo {
  type: 'personal' | 'company';
  name: string;
  company?: string;
  phone: string;
  email: string;
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
  | { type: 'SET_PAYOR_MODE'; payload: 'single' | 'per-schedule' }
  | { type: 'SET_SINGLE_PAYOR'; payload: PayorInfo }
  | { type: 'SET_SCHEDULE_PAYOR'; payload: { scheduleId: string; payor: PayorInfo } }
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
