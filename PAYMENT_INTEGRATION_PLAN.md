# 결제 페이지 상세 분석 및 통합 설계

## 개요
두 결제 페이지(`/quote-request`, `/payment`)의 프로세스와 변수를 분석하여 모든 케이스에 대응 가능한 통합 결제 페이지 설계

---

# Part 1: 현재 페이지 분석

## 1. QuoteRequest.tsx 분석 (~1000줄)

### 프로세스 흐름 (5단계 스텝 카드)

```
Step 1: 결제 일정
├── 한번에 결제 (single)
│   └── 결제 시점: pre-order | pre-ship | post-ship
└── 나눠서 결제 (split)
    ├── 선금: 금액 + timing
    └── 잔금: 금액 + timing (자동 계산)

Step 2: 결제 주체
├── 저장된 정보 불러오기 (드롭다운)
├── 유형: personal | company
├── 이름, 회사명, 연락처, 이메일
└── 정보 저장 체크박스

Step 3: 결제 수단 (각 schedule별)
├── 결제 수단 N개 추가 가능
│   ├── 금액 입력 (전액 버튼)
│   └── 수단 선택: toss | keyin | bank | narabill | contract
└── 금액 합계 검증 (실시간)

Step 4: 증빙 서류 (무통장/나라빌/수의계약일 때만)
├── 증빙 N개 추가 가능
│   ├── 금액 입력
│   ├── 종류: tax-invoice | cash-receipt | none
│   └── 수령자: same | other (사업자 정보 입력)
└── 금액 합계 검증

Step 5: 최종 확인
├── 예치금 사용 토글
├── 결제 요약
└── 제출 버튼
```

### 상태 변수 목록
```typescript
scheduleType: 'single' | 'split'
schedules: PaymentSchedule[] = [{
  id, label, amount, timing,
  dueDate,
  methods: PaymentMethod[],
  proofs: Proof[]
}]
payorInfo: PayorInfo
savePayor: boolean
useDeposit: boolean
```

### 장점
1. **단계별 진행** - 각 단계 완료 후 요약 표시, 수정 가능
2. **결제 수단 분할** - 하나의 결제 일정에 여러 결제 수단
3. **증빙 분할** - 여러 업체에 증빙 발급 가능
4. **예치금 사용** - 기존 예치금 차감
5. **저장된 정보** - 반복 주문 시 편리

### 문제점
1. ❌ **사업자 정보 제한적** - 4필드만 (사업자번호, 회사명, 대표자, 이메일)
2. ❌ **세금계산서 발행일 지정 불가**
3. ❌ **"나중에 입력" 옵션 없음** - 모든 정보 즉시 입력 필요
4. ❌ **기타 결제 없음** - 특이 케이스 대응 불가
5. ❌ **다중 결제 주체 미지원** - 분할 결제 시에도 결제 주체는 하나

---

## 2. Payment.tsx 분석 (~3500줄)

### 프로세스 흐름 (섹션 기반)

```
Section 1: 결제 조건
├── 프리셋 선택
│   ├── 100-pre: 발주 전 100% 선금
│   ├── 100-before-ship: 출고 전 100%
│   ├── 100-after-ship: 출고 후 100%
│   ├── 50-50-after: 50% 선금 + 출고 후 50%
│   ├── 50-50-before: 50% 선금 + 출고 전 50%
│   └── custom: 기타 결제
│       ├── 간편 입력 (발주 전/후 %, 출고 전/후 %)
│       └── 수동 입력 (텍스트)
└── 후불 경고 표시

Section 2: 결제 수단
├── toss → 안내 문구만
├── keyin → 카드 정보 입력
├── bank → 다음 단계 안내
├── narabill → 파일 업로드 + 가이드 입력
├── contract → 파일 업로드 + 가이드 입력
└── other (기타 결제) ─┐
                      ↓
    ┌── 분할 결제? ──┬── 예 ──→ 결제 주체 여러명? ─┬── 예 → 다중 탭 UI
    │               │                             └── 아니오 → 단일 탭 UI (분할)
    │               └── 아니오 → 결제 주체 다른가? ─┬── 예 → 다른 결제자 정보
    │                                              └── 아니오 → 상세 textarea
    │
    └── 각 탭/결제자별:
        ├── 유형: personal | company
        ├── 이름, 회사명, 이메일, 연락처
        ├── 결제 수단 (toss | keyin | bank | narabill | contract)
        └── 결제 수단별 상세 (카드/무통장/파일 등)
```

### 무통장 입금 상세 (BankTransferSection)
```
├── 증빙 선택: tax-invoice | cash-receipt | none | later
├── 세금계산서 선택 시
│   ├── 사업자등록증 업로드 (OCR) 또는 수기 입력
│   ├── 사업자번호, 과세유형, 회사명, 대표자
│   ├── 이메일, 사업장 소재지, 본점 소재지
│   ├── 업태, 종목
│   └── 발행 희망 날짜 (예/아니오)
├── 현금영수증 선택 시
│   ├── 발급 유형: 소득공제 | 지출증빙
│   └── 휴대폰 or 사업자번호
└── 계좌 정보 + 입금자명
```

### 상태 변수 목록
```typescript
paymentTerm: string  // 프리셋 또는 'custom'
customPaymentTerm: string
customInputMode: 'simple' | 'manual'
orderTiming, orderPercent, shipmentTiming, shipmentPercent
paymentMethod: PaymentMethod
keyinData: {...}
splitPayment: boolean | null
multiplePayors: boolean | null
isDifferentPayor: boolean | null
singlePayorInfo: {...}
splitPayments: Array<{id, amount, memo, paymentMethod, keyinData, bankData, narabillFiles, contractFiles, isCompleted}>
narabillFiles, contractFiles
```

### 장점
1. **상세 사업자 정보** - 9필드 (업태, 종목, 소재지 포함)
2. **세금계산서 발행일 지정** - 선호 날짜 입력 가능
3. **"나중에 입력" 옵션** - 증빙 정보 미입력 허용
4. **기타 결제** - 모든 특이 케이스 대응
5. **다중 결제 주체** - 분할 결제 시 각각 다른 주체

### 문제점
1. ❌ **복잡한 분기** - 질문 기반 UI로 인해 경로가 많음
2. ❌ **예치금 사용 없음**
3. ❌ **저장된 정보 없음** - 매번 새로 입력
4. ❌ **결제 조건과 수단 분리** - 개념적 혼란
5. ❌ **증빙이 결제 수단에 종속** - 분리 불가
6. ❌ **긴 스크롤** - 한 페이지에 모든 정보
7. ❌ **결제 일정별 수단 분할 불가** - 하나의 일정에 하나의 수단만

---

# Part 2: 변수 및 케이스 매트릭스

## 모든 변수 조합

| 구분 | QuoteRequest | Payment | 통합 필요 |
|------|--------------|---------|-----------|
| **결제 일정** | | | |
| 전액 일시 | ✅ | ✅ | ✅ |
| 선금/잔금 분할 | ✅ | ✅ | ✅ |
| 3회 이상 분할 | ❌ | ✅ (기타) | ✅ |
| 커스텀 비율 | ✅ | ✅ | ✅ |
| **결제 시점** | | | |
| 발주 전 | ✅ | ✅ | ✅ |
| 발주 후 | ❌ | ✅ | ✅ |
| 출고 전 | ✅ | ✅ | ✅ |
| 출고 후 | ✅ | ✅ | ✅ |
| **결제 수단** | | | |
| 토스페이먼츠 | ✅ | ✅ | ✅ |
| 안심 키인 | ✅ | ✅ | ✅ |
| 무통장 입금 | ✅ | ✅ | ✅ |
| 나라빌 | ✅ | ✅ | ✅ |
| 수의 계약 | ✅ | ✅ | ✅ |
| 기타 결제 | ❌ | ✅ | ✅ |
| **결제 수단 분할** | | | |
| 한 일정에 다중 수단 | ✅ | ❌ | ✅ |
| **결제 주체** | | | |
| 단일 주체 | ✅ | ✅ | ✅ |
| 다중 주체 | ❌ | ✅ | ✅ |
| 다른 결제자 | ❌ | ✅ | ✅ |
| 저장된 정보 | ✅ | ❌ | ✅ |
| **증빙 서류** | | | |
| 세금계산서 | ✅ | ✅ | ✅ |
| 현금영수증 | ✅ | ✅ | ✅ |
| 필요없음 | ✅ | ✅ | ✅ |
| 나중에 입력 | ❌ | ✅ | ✅ |
| 증빙 분할 | ✅ | ❌ | ✅ |
| **사업자 정보** | | | |
| 기본 4필드 | ✅ | ✅ | ✅ |
| 상세 9필드 | ❌ | ✅ | ✅ |
| OCR 스캔 | ✅ | ✅ | ✅ |
| 발행일 지정 | ❌ | ✅ | ✅ |
| **기타** | | | |
| 예치금 사용 | ✅ | ❌ | ✅ |
| 후불 경고 | ✅ | ✅ | ✅ |

---

# Part 3: 통합 페이지 설계

## 설계 원칙
1. **QuoteRequest UI** (스텝 카드) + **Payment 기능** (상세 옵션) 결합
2. 모든 변수 조합 지원
3. 복잡한 분기를 스텝으로 분리하여 단순화

## 새 프로세스 흐름

```
Step 1: 결제 일정 설정
├── 전액 결제 | 분할 결제
├── 분할 시: N차 결제 추가 가능
├── 각 일정별: 금액, 시점(발주전/발주후/출고전/출고후)
└── 합계 검증

Step 2: 결제 주체 설정
├── 저장된 정보 불러오기
├── 결제 주체 유형: 단일 | 일정별 다름
├── 단일: 개인/회사 정보 입력
├── 다름: 각 일정별 주체 정보 (탭 UI)
└── 정보 저장 체크박스

Step 3: 결제 수단 선택 (각 일정별)
├── 결제 수단 N개 추가 가능
├── 각 수단: 금액 + 유형(toss/keyin/bank/narabill/contract/기타)
├── 수단별 상세 입력 (카드번호, 파일 등)
└── 금액 합계 검증

Step 4: 증빙 서류 (해당 시)
├── 증빙 N개 추가 가능 (분할 발행)
├── 각 증빙: 금액 + 유형(세금계산서/현금영수증/필요없음/나중에)
├── 세금계산서: 상세 9필드 + 발행일 지정
├── 현금영수증: 소득공제/지출증빙
└── 금액 합계 검증

Step 5: 최종 확인
├── 예치금 사용 토글
├── 전체 요약
└── 제출
```

## 핵심 타입 정의 (개선된 버전)

```typescript
// ==================== 메인 타입 ====================

interface UnifiedPayment {
  // Step 1: 결제 일정
  schedules: PaymentSchedule[];

  // Step 2: 결제 주체
  payorMode: 'single' | 'per-schedule';
  singlePayor?: PayorInfo;
  savedPayors: SavedPayor[];  // 저장된 결제자 정보

  // Step 5: 최종 확인
  useDeposit: boolean;
  depositAmount: number;
  availableDeposit: number;

  // 전자계약 관련 (자동 계산)
  contractRequired: boolean;
  contractSigners: ContractSigner[];
}

interface PaymentSchedule {
  id: string;
  label: string;  // "1차 결제", "선금", "잔금" 등
  amount: number;
  timing: 'pre-order' | 'post-order' | 'pre-ship' | 'post-ship';

  // 결제 주체 (payorMode가 'per-schedule'일 때)
  payor?: PayorInfo;

  // 결제 수단 (N개 가능, 각각 증빙 포함)
  methods: PaymentMethod[];
}

// ==================== 결제 주체 ====================

interface PayorInfo {
  type: 'personal' | 'company';
  name: string;
  company?: string;
  phone: string;
  email: string;
  businessInfo?: BusinessInfo;
}

interface BusinessInfo {
  // OCR 메타데이터
  source: 'ocr' | 'manual' | 'saved';
  ocrConfidence?: number;
  ocrOriginal?: BusinessInfoFields;
  isModified: boolean;

  // 실제 데이터
  fields: BusinessInfoFields;
}

interface BusinessInfoFields {
  businessNumber: string;       // 사업자번호
  taxType: string;              // 과세유형
  companyName: string;          // 회사명
  ceoName: string;              // 대표자명
  businessAddress: string;      // 사업장 소재지
  headquarterAddress: string;   // 본점 소재지
  businessType: string;         // 업태
  businessItem: string;         // 종목
  taxEmail: string;             // 세금계산서 이메일
}

interface SavedPayor {
  id: string;
  label: string;
  info: PayorInfo;
  lastUsed: Date;
}

// ==================== 결제 수단 ====================

interface PaymentMethod {
  id: string;
  type: 'toss' | 'keyin' | 'bank' | 'narabill' | 'contract' | 'other';
  amount: number;

  // 수단별 상세 정보 (union type)
  details: KeyinData | BankData | FileUploadData | OtherData | null;

  // 증빙 정보 (method 레벨로 이동)
  autoReceipt: boolean;  // 토스/키인은 true
  proof?: ProofDocument; // 자동 영수증이 아닌 경우 필수
}

interface KeyinData {
  installment: string;
  cardNumbers: string[];
  expMonth: string;
  expYear: string;
}

interface BankData {
  depositorName: string;
}

interface FileUploadData {
  files: UploadedFile[];
  instructions: string;
  additionalNotes: string;
}

interface OtherData {
  description: string;
}

// ==================== 증빙 서류 ====================

interface ProofDocument {
  id: string;
  type: 'tax-invoice' | 'cash-receipt' | 'none' | 'later';

  // 세금계산서/현금영수증 공통
  recipientMode: 'same-as-payor' | 'different';
  differentRecipient?: BusinessInfoFields;

  // 세금계산서 전용
  issueDate?: string;
  preferredIssueDate: boolean;

  // 현금영수증 전용
  cashReceiptType?: 'income-deduction' | 'expense-proof';
  cashReceiptNumber?: string;

  // 검증 결과
  validations: ProofValidation[];
}

interface ProofValidation {
  rule: string;
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
  canOverride: boolean;
}

// ==================== 전자계약 ====================

interface ContractSigner {
  scheduleId: string;
  payorInfo: PayorInfo;
  signatureRequired: boolean;  // 후불인 경우 true
  signatureStatus: 'pending' | 'signed' | 'rejected';
}

// ==================== 금액 변경 처리 ====================

interface AmountChangeResult {
  scheduleId: string;
  originalAmount: number;
  newAmount: number;
  difference: number;
  affectedMethods: { id: string; amount: number }[];
  suggestedAction: 'reset' | 'adjust-last' | 'add-new' | 'manual';
}

// ==================== 파일 업로드 ====================

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  instructions: string;
  uploadedAt: Date;
}
```

---

# Part 4: 예상 문제점 및 해결 방안

## 4.1 기본 문제

| 문제 | 원인 | 해결 방안 |
|------|------|-----------|
| 코드 복잡도 증가 | 모든 기능 통합 | 컴포넌트 분리 (Step별 파일) |
| 상태 관리 복잡 | 중첩 데이터 | useReducer 또는 Zustand |
| 긴 로딩 시간 | 큰 번들 | 동적 import |
| 모바일 UX | 스텝 카드 + 상세 정보 | 반응형 레이아웃 |
| 뒤로가기 시 데이터 손실 | 새로고침 | sessionStorage 저장 |

---

## 4.2 복잡한 조합 시나리오

### 문제: 증빙과 결제 수단의 매핑 관계

```
예시:
1차 결제 (A회사): 토스 300만 + 무통장 200만 = 500만
2차 결제 (B회사): 키인 500만 = 500만

증빙:
- 토스 300만 → 자동 영수증 (토스 내부)
- A회사 무통장 200만 → 세금계산서 (A회사)
- B회사 키인 500만 → 세금계산서 (B회사)

문제: 어떤 결제 수단에서 어떤 증빙이 나가는지 매핑이 복잡
```

### 해결 방안: 증빙을 결제 수단 레벨로 이동

```typescript
// 기존 설계 (문제)
interface PaymentSchedule {
  methods: PaymentMethod[];
  proofs: ProofDocument[];  // schedule 레벨 - 매핑 불명확
}

// 개선된 설계
interface PaymentMethod {
  id: string;
  type: 'toss' | 'keyin' | 'bank' | 'narabill' | 'contract' | 'other';
  amount: number;
  details: KeyinData | BankData | FileUploadData | OtherData;

  // 증빙을 method 레벨로 이동
  proof?: ProofDocument;  // 토스/키인은 자동 발급이므로 optional
  autoReceipt?: boolean;  // 자동 영수증 여부 (토스/키인)
}
```

### 결제 수단별 증빙 처리 규칙

| 결제 수단 | 자동 영수증 | 수동 증빙 필요 |
|-----------|-------------|----------------|
| 토스페이먼츠 | ✅ | ❌ (선택적) |
| 안심 키인 | ✅ | ❌ (선택적) |
| 무통장 입금 | ❌ | ✅ 필수 |
| 나라빌 | ❌ | ✅ 필수 |
| 수의 계약 | ❌ | ✅ 필수 |
| 기타 결제 | ❌ | ✅ 필수 |

---

## 4.3 금액 동기화 문제

### 문제: 상위 금액 변경 시 하위 영향

```
Step 1: 1차 결제 = 500만원
Step 3: 결제 수단 = 토스 300만 + 무통장 200만
Step 4: 증빙 = 세금계산서 200만

→ Step 1에서 1차 결제를 600만원으로 변경하면?
- 결제 수단 합계는 500만 그대로
- 증빙 합계도 200만 그대로
- 100만원 차이 발생
```

### 해결 방안: 변경 영향 분석 + 사용자 선택

```typescript
interface AmountChangeResult {
  originalAmount: number;
  newAmount: number;
  difference: number;
  affectedItems: {
    type: 'method' | 'proof';
    id: string;
    currentAmount: number;
  }[];
  options: AmountAdjustOption[];
}

type AmountAdjustOption =
  | { type: 'reset'; description: '결제 수단 초기화' }
  | { type: 'adjust-last'; description: '마지막 항목에 차액 반영' }
  | { type: 'add-new'; description: '새 결제 수단 추가' }
  | { type: 'manual'; description: '직접 수정' };
```

### UI 흐름

```
[Step 1에서 금액 변경 시]
     ↓
┌─────────────────────────────────────────┐
│ 결제 금액이 변경되었습니다               │
│                                         │
│ 변경 전: 500만원 → 변경 후: 600만원      │
│ 차액: +100만원                          │
│                                         │
│ 아래 항목에 영향이 있습니다:             │
│ - 토스 300만원                          │
│ - 무통장 200만원                        │
│                                         │
│ [마지막 항목에 반영] [직접 수정] [초기화] │
└─────────────────────────────────────────┘
```

---

## 4.4 후불 + 다중 결제 주체

### 문제: 전자계약 당사자 불명확

```
1차 결제 (A회사): 발주 전 50%
2차 결제 (B회사): 출고 후 50% (후불)

→ 후불이므로 전자계약 필요
→ 계약 당사자가 A회사? B회사? 둘 다?
```

### 해결 방안: 계약 당사자 명시 + 후불 결제자 경고

```typescript
interface UnifiedPayment {
  // ...기존 필드

  // 전자계약 관련 추가
  contractRequired: boolean;  // 후불 포함 여부에 따라 자동 계산
  contractSigners: ContractSigner[];  // 계약 서명자 목록
}

interface ContractSigner {
  scheduleId: string;  // 어떤 결제 일정의 주체인지
  payorInfo: PayorInfo;
  signatureRequired: boolean;  // 후불인 경우 true
}
```

### UI 흐름

```
[후불 결제 포함 시 Step 2에서]
     ↓
┌─────────────────────────────────────────┐
│ ⚠️ 전자계약 필요                         │
│                                         │
│ 2차 결제가 후불(출고 후)로 설정되어       │
│ 전자계약이 필요합니다.                   │
│                                         │
│ 계약 서명자:                            │
│ ☑ B회사 (2차 결제 - 후불)               │
│ ☐ A회사 (1차 결제 - 선불) [선택사항]     │
│                                         │
└─────────────────────────────────────────┘
```

### 주의사항 추가

```
- 후불 결제가 포함된 경우, 해당 결제 주체는 반드시 계약 서명 필요
- 선불 결제 주체는 계약 서명 선택사항
- 다중 후불 결제 주체가 있는 경우 모두 서명 필요
```

---

## 4.5 법적/회계 규칙 검증

### 현재 미처리 규칙

| 규칙 | 조건 | 필요 조치 |
|------|------|-----------|
| 현금영수증 의무발행 | 무통장 ≥ 10만원 | "필요없음" 선택 차단 또는 경고 |
| 세금계산서 발행일 제한 | 익월 10일 이전 | 발행 희망 날짜 유효성 검증 |
| 세금계산서 의무발행 | 사업자 → 사업자 거래 | 회사 유형일 때 권장 |

### 해결 방안: 검증 레이어 추가

```typescript
interface ProofValidation {
  rule: 'cash-receipt-required' | 'tax-invoice-deadline' | 'tax-invoice-recommended';
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
  canOverride: boolean;  // 사용자가 무시 가능 여부
}

function validateProof(method: PaymentMethod, proof: ProofDocument): ProofValidation[] {
  const validations: ProofValidation[] = [];

  // 현금영수증 의무발행 검사
  if (method.type === 'bank' && method.amount >= 100000) {
    if (proof.type === 'none') {
      validations.push({
        rule: 'cash-receipt-required',
        passed: false,
        message: '10만원 이상 현금 거래 시 현금영수증 또는 세금계산서 발행이 권장됩니다.',
        severity: 'warning',
        canOverride: true  // 경고만, 진행 가능
      });
    }
  }

  // 세금계산서 발행일 검사
  if (proof.type === 'tax-invoice' && proof.issueDate) {
    const deadline = getNextMonth10th();
    if (new Date(proof.issueDate) > deadline) {
      validations.push({
        rule: 'tax-invoice-deadline',
        passed: false,
        message: `세금계산서는 ${formatDate(deadline)}까지 발행해야 합니다.`,
        severity: 'error',
        canOverride: false  // 진행 불가
      });
    }
  }

  return validations;
}
```

### UI 표시

```
[증빙 입력 시 실시간 검증]

무통장 입금: 500,000원
증빙: [필요 없음 ▼]

⚠️ 10만원 이상 현금 거래 시 현금영수증 또는
   세금계산서 발행이 권장됩니다. (선택사항)

   [이대로 진행] [증빙 선택하기]
```

---

## 4.6 OCR 오류 처리

### 문제

1. 사업자등록증 인식 실패
2. 잘못 인식된 정보 수정 후 다시 OCR 하면 수정 사항 사라짐
3. 수기 입력 전환 시 기존 OCR 데이터 처리

### 해결 방안

```typescript
interface BusinessInfoInput {
  source: 'ocr' | 'manual' | 'saved';
  ocrConfidence?: number;  // OCR 신뢰도 (0-1)
  ocrOriginal?: BusinessInfo;  // OCR 원본 (수정 비교용)
  current: BusinessInfo;  // 현재 값 (수정 포함)
  isModified: boolean;  // 수정 여부
}

interface OcrResult {
  success: boolean;
  confidence: number;
  data?: BusinessInfo;
  errors?: {
    field: string;
    message: string;
  }[];
}
```

### UI 흐름

```
[OCR 실패 시]
┌─────────────────────────────────────────┐
│ ⚠️ 일부 정보를 인식하지 못했습니다       │
│                                         │
│ 인식된 정보:                            │
│ ✓ 사업자번호: 123-45-67890              │
│ ✓ 회사명: 주식회사 인프라이즈            │
│ ✗ 대표자명: 인식 실패                   │
│ ✗ 사업장 소재지: 인식 실패               │
│                                         │
│ [인식된 정보로 시작] [전체 수기 입력]     │
└─────────────────────────────────────────┘

[수정 후 재업로드 시]
┌─────────────────────────────────────────┐
│ 기존 수정 사항이 있습니다                │
│                                         │
│ 수정한 필드:                            │
│ - 대표자명: (빈값) → 홍길동              │
│ - 업태: (빈값) → 제조업                  │
│                                         │
│ [수정 사항 유지] [새 스캔 결과로 덮어쓰기] │
└─────────────────────────────────────────┘
```

### 필드별 신뢰도 표시

```typescript
interface FieldWithConfidence {
  value: string;
  confidence: number;  // 0-1
  needsReview: boolean;  // confidence < 0.8
}

// UI에서 신뢰도 낮은 필드 하이라이트
// 빨간 테두리 + "확인 필요" 라벨
```

---

# Part 5: 작업 계획

## 파일 구조

```
src/pages/payment/
├── UnifiedPayment.tsx              # 메인 컨테이너
├── types.ts                        # 타입 정의
│
├── hooks/
│   ├── usePaymentState.ts          # 메인 상태 관리 (useReducer)
│   ├── useAmountSync.ts            # 금액 동기화 로직
│   ├── useProofValidation.ts       # 증빙 검증 로직
│   └── useContractCheck.ts         # 전자계약 필요 여부 계산
│
├── components/
│   ├── steps/
│   │   ├── ScheduleStep.tsx        # Step 1: 결제 일정
│   │   ├── PayorStep.tsx           # Step 2: 결제 주체
│   │   ├── MethodStep.tsx          # Step 3: 결제 수단
│   │   ├── ConfirmStep.tsx         # Step 4: 최종 확인
│   │   └── StepCard.tsx            # 스텝 카드 래퍼
│   │
│   ├── payor/
│   │   ├── PayorInfoForm.tsx       # 결제자 정보 폼
│   │   ├── SavedPayorSelect.tsx    # 저장된 결제자 선택
│   │   └── PayorTypeTabs.tsx       # 개인/회사 탭
│   │
│   ├── method/
│   │   ├── MethodCard.tsx          # 결제 수단 카드
│   │   ├── MethodSelector.tsx      # 결제 수단 선택 그리드
│   │   ├── TossSection.tsx         # 토스페이먼츠 안내
│   │   ├── KeyinSection.tsx        # 키인 결제 폼
│   │   ├── BankSection.tsx         # 무통장 입금 폼
│   │   ├── NarabillSection.tsx     # 나라빌 파일 업로드
│   │   ├── ContractSection.tsx     # 수의계약 파일 업로드
│   │   └── OtherSection.tsx        # 기타 결제 textarea
│   │
│   ├── proof/
│   │   ├── ProofSelector.tsx       # 증빙 유형 선택
│   │   ├── TaxInvoiceForm.tsx      # 세금계산서 폼
│   │   ├── CashReceiptForm.tsx     # 현금영수증 폼
│   │   └── ProofValidationAlert.tsx # 검증 경고 표시
│   │
│   ├── business/
│   │   ├── BusinessInfoForm.tsx    # 사업자 정보 폼 (9필드)
│   │   ├── OcrUploader.tsx         # OCR 업로드 + 결과 처리
│   │   ├── OcrResultReview.tsx     # OCR 결과 검토/수정
│   │   └── IssueDatePicker.tsx     # 발행 희망 날짜 선택
│   │
│   ├── shared/
│   │   ├── AmountInput.tsx         # 금액 입력 (포맷팅)
│   │   ├── AmountChangeModal.tsx   # 금액 변경 시 선택 모달
│   │   ├── FileUploader.tsx        # 파일 업로드 공통
│   │   ├── ValidationMessage.tsx   # 검증 메시지 공통
│   │   └── ContractWarning.tsx     # 전자계약 필요 경고
│   │
│   └── summary/
│       ├── PaymentSummary.tsx      # 결제 요약 카드
│       ├── ScheduleSummary.tsx     # 일정별 요약
│       └── DepositToggle.tsx       # 예치금 사용 토글
│
└── utils/
    ├── validators.ts               # 검증 함수
    ├── formatters.ts               # 포맷팅 함수
    └── constants.ts                # 상수 (결제 수단 목록 등)
```

## 구현 순서

### Phase 1: 기반 구조
1. `types.ts` - 모든 타입 정의
2. `constants.ts` - 상수 정의
3. `usePaymentState.ts` - reducer 기반 상태 관리
4. `StepCard.tsx` - 스텝 카드 래퍼

### Phase 2: 공유 컴포넌트
5. `shared/` 컴포넌트 전체
6. `business/` 컴포넌트 전체 (OCR 포함)
7. `proof/` 컴포넌트 전체

### Phase 3: 결제 수단
8. `method/` 컴포넌트 전체
9. `payor/` 컴포넌트 전체

### Phase 4: 스텝 조립
10. `ScheduleStep.tsx`
11. `PayorStep.tsx`
12. `MethodStep.tsx`
13. `ConfirmStep.tsx`

### Phase 5: 통합 및 마무리
14. `UnifiedPayment.tsx` - 메인 컨테이너
15. 커스텀 훅 (`useAmountSync`, `useProofValidation`, `useContractCheck`)
16. 라우팅 변경 및 테스트

---

## 삭제할 파일
- `src/pages/quote/QuoteRequest.tsx`
- `src/pages/order/Payment.tsx`

## 수정할 파일
- `App.tsx` - 라우팅 변경
  - `/payment` → `UnifiedPayment`
  - `/quote-request` → `UnifiedPayment` 또는 삭제

---

## 컴포넌트별 책임

| 컴포넌트 | 책임 |
|----------|------|
| `UnifiedPayment` | 스텝 네비게이션, 전체 상태 관리, 제출 |
| `ScheduleStep` | 결제 일정 추가/수정/삭제, 금액/시점 설정 |
| `PayorStep` | 결제 주체 설정, 저장된 정보 불러오기, 다중 주체 처리 |
| `MethodStep` | 결제 수단 선택, 수단별 상세 입력, 증빙 입력 |
| `ConfirmStep` | 전체 요약 표시, 예치금 사용, 제출 버튼 |
| `useAmountSync` | 상위 금액 변경 시 하위 항목 동기화 |
| `useProofValidation` | 법적/회계 규칙 검증 |
| `useContractCheck` | 후불 여부에 따른 전자계약 필요성 계산 |
