# Qudisom 프로젝트 상세 분석 문서

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [파일 구조](#파일-구조)
4. [핵심 페이지 분석](#핵심-페이지-분석)
5. [주요 컴포넌트](#주요-컴포넌트)
6. [데이터 구조](#데이터-구조)
7. [주요 알고리즘](#주요-알고리즘)
8. [개발 가이드](#개발-가이드)

---

## 프로젝트 개요

**Qudisom**은 봉제 인형 제작 대행(OEM) 서비스를 위한 종합 견적 및 주문 관리 웹 애플리케이션입니다.

### 주요 기능
- 🎨 다단계 견적 요청 시스템 (AI 기반 추천)
- 📊 대시보드 (견적, 주문, 서류 관리)
- 💳 다양한 결제 수단 및 조건
- 📝 전자 계약 시스템
- 🚚 13단계 샘플 + 10단계 본 제작 주문 추적
- 🤖 AI 이미지 생성 및 배송 시나리오 추천
- 📄 OCR 기반 사업자등록증 자동 입력

---

## 기술 스택

### 코어
- **React** 18+ with TypeScript
- **React Router DOM** - SPA 라우팅
- **Vite** - 빌드 도구 (추정)

### UI/UX
- **Tailwind CSS** v4.0 - 유틸리티 기반 스타일링
- **shadcn/ui** - UI 컴포넌트 라이브러리
- **Framer Motion** (`motion/react`) - 애니메이션
- **Lucide React** - 아이콘

### 상태 관리 & 기능
- **React Hooks** - useState, useEffect, useCallback, useRef
- **react-dnd** + HTML5Backend - 드래그 앤 드롭
- **Canvas API** - 라벨 위치 편집기

### 백엔드
- **Supabase** - 인증 및 데이터베이스

### 폰트
- **Noto Sans KR** (Google Fonts)

---

## 파일 구조

```
Qudisom/
│
├── App.tsx                          # 메인 라우터 및 네비게이션
│
├── 📄 페이지 컴포넌트 (최상위)
│   ├── MainHeroSection.tsx          # 홈페이지
│   ├── Dashboard.tsx                # 대시보드 (견적/주문 관리)
│   ├── Quote.tsx                    # 견적서 확인 및 승인
│   ├── Payment.tsx                  # 결제 수단 선택
│   ├── AdditionalInfo.tsx           # 결제 정보 입력
│   ├── EContract.tsx                # 전자 계약 정보
│   ├── new-file.tsx                 # 견적 요청 폼 (메인)
│   ├── QuoteRequest.tsx             # 견적 요청 페이지
│   ├── AutoQuoteCalculator.tsx      # 자동 견적 산출기
│   ├── TransactionStatement.tsx     # 거래명세서
│   ├── WorkOrder.tsx                # 작업 지시서
│   ├── DefectReport.tsx             # 결함 보고서
│   ├── ShippingOrder.tsx            # 출하 지시서
│   ├── QuickDeliveryBooking.tsx     # 급속 배송 예약
│   ├── InventoryStatus.tsx          # 재고 현황
│   ├── ElectronicContract.tsx       # 전자 계약
│   ├── OrderProcess.tsx             # 주문 과정 안내
│   ├── ProductionProcess.tsx        # 제작 과정 소개
│   ├── ProductionExamples.tsx       # 포트폴리오
│   ├── FAQ.tsx                      # 자주 묻는 질문
│   ├── ResourceCenter.tsx           # 자료실
│   ├── Notice.tsx                   # 공지사항
│   ├── NoticeDetail.tsx             # 공지사항 상세
│   ├── GoodsStore.tsx               # 굿즈 스토어
│   └── AboutUs.tsx                  # 회사 소개
│
├── 📁 components/
│   ├── QuoteRequestPopup.tsx        # 견적 요청 팝업
│   ├── LoginForm.tsx                # 로그인 폼
│   ├── SignupForm.tsx               # 회원가입 폼
│   ├── SignupCarousel.tsx           # 회원가입 캐러셀
│   ├── SocialLoginButtons.tsx       # 소셜 로그인
│   ├── ShippingDesignInfoPage.tsx   # 배송·설계 정보
│   ├── OrderProgressBar.tsx         # 주문 진행 바 (3단계)
│   ├── BulkShippingTable.tsx        # 대량 배송 테이블
│   ├── AIFilePreview.tsx            # AI 파일 미리보기
│   ├── AIImageEditor.tsx            # AI 이미지 편집기
│   ├── LabelLocationEditor.tsx      # 라벨 위치 편집기 (Canvas)
│   ├── KCCertificationGuide.tsx     # KC 인증 가이드
│   ├── OriginLabelGuide.tsx         # 원산지 라벨 가이드
│   ├── LabelingMethodGuide.tsx      # 라벨링 방법 가이드
│   ├── DeliveryScenarioSection.tsx  # 배송 시나리오 (AI)
│   ├── CertifiedSection.tsx
│   ├── ContactSection.tsx
│   ├── FAQSection.tsx
│   ├── LimitedCategorySection.tsx
│   ├── PartnerBrandSection.tsx
│   ├── PortfolioSection.tsx
│   ├── ProcessStepsSection.tsx
│   ├── QudisomHomeSection.tsx
│   ├── SmartOrderProcessSection.tsx
│   │
│   ├── 📁 ui/ (shadcn/ui 컴포넌트)
│   │   ├── button.tsx, input.tsx, select.tsx
│   │   ├── dialog.tsx, sheet.tsx, popover.tsx
│   │   ├── accordion.tsx, tabs.tsx, carousel.tsx
│   │   ├── table.tsx, card.tsx, form.tsx
│   │   └── ... (40+ UI 컴포넌트)
│   │
│   └── 📁 figma/
│       └── ImageWithFallback.tsx
│
├── 📁 data/
│   └── mockDashboardData.ts         # 목 데이터 (견적, 주문, 문의 등)
│
├── 📁 lib/
│   └── utils.ts                     # 유틸리티 함수 (cn, formatCurrency)
│
├── 📁 styles/
│   └── globals.css                  # 글로벌 CSS (Tailwind + 커스텀 속성)
│
├── 📁 utils/
│   ├── supabase/
│   │   └── info.tsx                 # Supabase 설정
│   └── three.ts                     # Three.js 유틸리티
│
├── 📁 guidelines/
│   └── Guidelines.md                # 개발 가이드라인
│
└── 📁 기타 문서
    ├── PROJECT_STRUCTURE.md         # 프로젝트 구조
    ├── CLAUDE.md                    # Claude Code 가이드
    ├── Attributions.md              # 라이선스 및 출처
    └── qudisom.md                   # 이 문서
```

---

## 핵심 페이지 분석

### 1. App.tsx - 메인 라우터

**파일 경로**: `App.tsx`

#### 주요 역할
- React Router 기반 SPA 라우팅
- 네비게이션 바 (드롭다운 메뉴)
- 모바일 반응형 메뉴

#### 주요 상태
```typescript
const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [isHyunseoDropdownOpen, setIsHyunseoDropdownOpen] = useState(false);
const [isFinishedDropdownOpen, setIsFinishedDropdownOpen] = useState(false);
const [isHabibDropdownOpen, setIsHabibDropdownOpen] = useState(false);
const [isFinalFinishedDropdownOpen, setIsFinalFinishedDropdownOpen] = useState(false);
```

#### 라우팅 구조
1. **Home** (`/`) → `MainHeroSection.tsx`
2. **Working(Hyunseo)** - 19개 라우트
   - `/dashboard`, `/auto-quote`, `/quote-request`, `/payment`
   - `/goods-store`, `/transaction-statement`, `/work-order`, `/defect-report`
   - `/shipping-order`, `/quick-delivery`, `/inventory-status`
3. **Finished** - 10개 라우트
   - `/quote`, `/additional-info`, `/econtract`, `/shipping-design`
   - `/order-process`, `/production-process`, `/production-examples`
   - `/notice`, `/faq`, `/resource-center`
4. **Working(Habib)** - 2개 라우트
   - `/new-file`, `/about`
5. **Final Finished** - 2개 라우트
   - `/login`, `/signup`

#### 네비게이션 컴포넌트
- **NavigationBar**: 상단 고정 네비게이션
- **드롭다운 메뉴**: 호버 시 열림 (`onMouseEnter`, `onMouseLeave`)
- **모바일 메뉴**: 햄버거 아이콘 → 전체 화면 메뉴

---

### 2. new-file.tsx - 견적 요청 폼 (핵심)

**파일 경로**: `new-file.tsx`
**크기**: 378KB (가장 큰 파일)

#### 주요 역할
봉제 인형 제작을 위한 **초상세 견적 요청서 작성**. 제품 정보, 디자인 파일, 원단, 충전재, 라벨, 패키징, KC 인증 등 모든 옵션을 한 번에 설정.

#### 핵심 상태 구조
```typescript
// 최상위 상태
const [step, setStep] = useState(1); // 1: 고객정보, 2: 제품정보, 3: 제출완료
const [customerInfo, setCustomerInfo] = useState({...});
const [products, setProducts] = useState([INITIAL_PRODUCT]);
const [aiPreviews, setAiPreviews] = useState<AIPreview[]>([]);
const [expandedSections, setExpandedSections] = useState(INITIAL_SECTION);

// INITIAL_PRODUCT 구조 (제품 1개의 모든 정보)
const INITIAL_PRODUCT = {
  // 기본 정보
  productName: '',
  productType: '',
  customProductType: '',
  quantities: [{ id: Date.now(), value: 300 }], // 수량별 견적
  width: '',
  depth: '',
  files: [], // 디자인 파일

  // 샘플 및 납기
  sampleDeliveryMethod: 'file', // 'file' | 'physical'
  sampleDeliveryDate: '',
  mainDeliveryDate: '',
  targetDeliveryDate: '', // 주문 예상 시점
  actualDeliveryDate: '', // 납기 일자
  initialSampleDeliveryMethod: 'photo', // 'photo' | 'physical'
  mainProductionType: 'standard', // 'standard' | 'express' | 'normal'
  selectedScenario: null, // AI 추천 시나리오

  // 원단 (Fabric)
  fabric: '크리스탈 벨벳', // BEST 기본값
  fabricFiles: [],
  fabricRequest: '',

  // 충전재 (Filling)
  filling: 'PP 솜', // BEST 기본값

  // 원산지 라벨 (Origin Label)
  originLabelMaterial: '나일론 페이퍼', // BEST 기본값
  originLabelCustom: '아니오', // '예' | '아니오'
  originLabelFiles: [],
  customLabelFiles: [],
  originLabelMaterialRequest: '',
  originLabelDesignRequest: '',
  labelLocationRequest: '',
  labelLocationImage: '', // 라벨 위치 편집 이미지 (Base64)
  originLabelRequest: '',

  // 라벨링 방법 (Labeling Method)
  labelingMethod: '스티커',

  // 스티커 (Sticker)
  stickerCustom: '아니오',
  stickerBase: '화이트', // BEST 기본값
  stickerFiles: [],
  stickerRequest: '',

  // 키링 (Keyring)
  keyring: '',
  keyringFiles: [],
  keyringRequest: '',

  // 패키징 (Packaging)
  packaging: 'OPP 봉투',
  packagingFiles: [],
  packagingRequest: '',

  // KC 인증
  kcCertification: '불필요(14세 이상)', // BEST 기본값

  // 택 및 행택 (Tag & Hang Tag)
  tagString: '',
  tagStringColor: '',
  tagStringCustom: '',
  hangTagDesignFiles: [],
  hangTagRequest: '',
  hangTagStringFiles: [],

  // 패키징 인쇄 (Packaging Print)
  packagingPrintFiles: [],
  packagingPrintRequest: '',

  // 기타 요청사항
  additionalRequest: ''
};
```

#### 주요 기능

##### 1. 다중 제품 관리
```typescript
// 제품 추가
const addProduct = () => {
  setProducts([...products, { ...INITIAL_PRODUCT, id: Date.now() }]);
};

// 제품 삭제
const removeProduct = (index: number) => {
  setProducts(products.filter((_, i) => i !== index));
};

// 드래그 앤 드롭 정렬 (react-dnd)
const moveProduct = (dragIndex: number, hoverIndex: number) => {
  const dragProduct = products[dragIndex];
  const newProducts = [...products];
  newProducts.splice(dragIndex, 1);
  newProducts.splice(hoverIndex, 0, dragProduct);
  setProducts(newProducts);
};
```

##### 2. 파일 업로드 및 AI 프리뷰
```typescript
// 파일 업로드
const handleFileUpload = (productIndex: number, files: FileList) => {
  const newFilePreviews = Array.from(files).map(file => ({
    file,
    preview: URL.createObjectURL(file)
  }));

  updateProduct(productIndex, {
    files: [...products[productIndex].files, ...newFilePreviews]
  });
};

// AI 이미지 생성 (시뮬레이션)
const handleAIGenerate = async (productIndex, fileIndex, prompt) => {
  setIsGenerating(true);

  // 3초 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 3000));

  const aiPreview: AIPreview = {
    id: Date.now().toString(),
    imageUrl: originalFile.preview, // 실제로는 AI API 결과
    style: prompt,
    timestamp: Date.now(),
    fileIndex,
    prompt,
    originalFileName: originalFile.file.name,
    version: existingVersions.length + 1
  };

  setAiPreviews([...aiPreviews, aiPreview]);
  setIsGenerating(false);
};
```

##### 3. 원단 선택
```typescript
const FABRIC_OPTIONS = [
  {
    name: '크리스탈 벨벳',
    image: 'https://cdn.imweb.me/...',
    desc: '부드러운 벨벳',
    isBest: true, // BEST 표시
    exampleImages: [...], // 예시 이미지 5개
    description: '부드럽고 은은한 광택...'
  },
  { name: '전문가 추천', isAI: true }, // AI 추천
  { name: '커스텀 원단' }, // 직접 지정
  { name: '스판덱스', ... },
  { name: '토끼털', ... },
  // ... 총 11가지
];
```

##### 4. KC 인증 가이드
```typescript
const KC_OPTIONS = [
  {
    value: '불필요(14세 이상)',
    label: '불필요 (14세 이상)',
    isBest: true,
    cost: '무료',
    duration: '-',
    description: '14세 이상 대상 제품은 KC 인증이 면제됩니다.'
  },
  {
    value: '필요(3-8세)',
    label: '필요 (3세-8세 미만)',
    cost: '약 150~200만원',
    duration: '2~4주',
    requirements: ['안전 확인 신고', 'KC 마크 부착', ...],
    description: '어린이제품 안전 특별법 적용...'
  },
  // ... 3세 미만, 8-13세 옵션
];
```

##### 5. 라벨 위치 편집기 통합
```tsx
<LabelLocationEditor
  files={product.originLabelFiles}
  onSave={(imageDataUrl) => {
    updateProduct(productIndex, {
      labelLocationImage: imageDataUrl
    });
  }}
/>
```

##### 6. 배송 시나리오 AI 추천
```tsx
<DeliveryScenarioSection
  targetDeliveryDate={product.targetDeliveryDate}
  actualDeliveryDate={product.actualDeliveryDate}
  initialSampleDeliveryMethod={product.initialSampleDeliveryMethod}
  mainProductionType={product.mainProductionType}
  onTargetDateChange={(date) => updateProduct(i, { targetDeliveryDate: date })}
  onActualDateChange={(date) => updateProduct(i, { actualDeliveryDate: date })}
  // ... 기타 콜백
/>
```

#### 주요 상수 및 옵션

```typescript
// 원단 옵션 (11가지)
FABRIC_OPTIONS = ['크리스탈 벨벳', '전문가 추천', '커스텀', '스판덱스',
                  '토끼털', '브러시 플라워', '밍크', '인조퍼',
                  '양털 플리스', '피치 스킨', '타올지', '나일론']

// 라벨 소재 (6가지)
LABEL_OPTIONS = ['나일론 페이퍼', '실크', '직조', '새틴', '면', '커스텀']

// 충전재 (5가지)
FILLING_OPTIONS = ['PP 솜', '폴리에스터 솜', '메모리폼', '플라스틱 비즈', '기타']

// 라벨링 방법 (4가지)
LABELING_METHOD_OPTIONS = ['스티커', '열전사', '자수', '워싱']

// 패키징 (6가지)
PACKAGING_OPTIONS = ['OPP 봉투', '박스 패키징', '파우치', '행거', '케이스', '기타']

// KC 인증 (3가지)
KC_OPTIONS = ['불필요(14세 이상)', '필요(3-8세)', '필요(3세 미만)', '필요(8-13세)']
```

#### 제출 플로우
1. **Step 1 - 고객 정보 입력**
   - 이름, 회사명, 연락처, 이메일, 문의사항
2. **Step 2 - 제품 정보 입력**
   - 제품 추가/삭제/정렬
   - 각 제품별 모든 옵션 설정
   - 파일 업로드, AI 생성, 라벨 위치 편집
3. **Step 3 - 제출 완료**
   - 애니메이션 효과
   - 견적서 페이지(`/quote`)로 이동

---

### 3. Dashboard.tsx - 종합 대시보드

**파일 경로**: `Dashboard.tsx`

#### 주요 역할
- 견적, 주문, 서류, 문의 등 모든 데이터 한눈에 관리
- 드래그 앤 드롭으로 섹션 순서 커스터마이징
- 다중 뷰 지원 (Grid, Kanban, Calendar, Gallery)

#### 주요 상태
```typescript
const [sections, setSections] = useState<DashboardSection[]>([
  { id: 'my-page', title: '마이 페이지', icon: <User />, component: <MyPageSection /> },
  { id: 'inquiry', title: '1:1 문의', icon: <MessageCircle />, component: <InquirySection /> },
  { id: 'quotes', title: '견적 관리', icon: <FileText />, component: <QuoteManagement /> },
  { id: 'orders', title: '주문 관리', icon: <Package />, component: <OrderManagement /> },
  { id: 'history', title: '오더 히스토리', icon: <Clock />, component: <OrderHistory /> },
  { id: 'defects', title: '불량 접수', icon: <AlertCircle />, component: <DefectReports /> },
  { id: 'documents', title: '서류 관리', icon: <Folder />, component: <DocumentManagement /> },
  { id: 'quote-inquiry', title: '견적 문의', icon: <FileCheck />, component: <QuoteInquiry /> }
]);

const [viewType, setViewType] = useState<ViewType>('grid'); // 'grid' | 'kanban' | 'calendar' | 'gallery'
const [showTour, setShowTour] = useState(false);
```

#### 섹션 상세

##### 1. 마이 페이지
```typescript
// 사용자 통계
<div className="grid grid-cols-3 gap-4">
  <StatCard icon={<FileText />} label="견적 요청" value="12건" trend="+3" />
  <StatCard icon={<Package />} label="진행 중 주문" value="5건" trend="+1" />
  <StatCard icon={<CheckCircle />} label="완료 주문" value="23건" />
</div>
```

##### 2. 견적 관리
```typescript
// 견적 상태별 필터
const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing' | 'completed' | 'confirmed'>('all');

// 견적 카드
{mockQuotes.filter(q => filter === 'all' || q.status === filter).map(quote => (
  <QuoteCard
    id={quote.id}
    productType={quote.productType}
    quantity={quote.quantity}
    status={quote.status}
    estimatedPrice={quote.estimatedPrice}
  />
))}
```

##### 3. 주문 관리 (핵심)

**샘플 주문 (13단계)**:
```typescript
const SAMPLE_STATUS_STEPS = [
  { status: 'payment-pending', label: '결제 대기', progress: 8 },
  { status: 'payment-completed', label: '결제 완료', progress: 15 },
  { status: 'manufacturing', label: '제작 중', progress: 25 },
  { status: 'feedback-pending', label: '피드백 대기', progress: 35 },
  { status: 'revising', label: '수정 중', progress: 42 },
  { status: 'revision-completed', label: '수정 완료', progress: 50 },
  { status: 'final-confirmed', label: '최종 컨펌', progress: 58 },
  { status: 'delivery-method', label: '전달 방식 선택', progress: 65 },
  { status: 'china-korea-shipping', label: '중국→한국 배송', progress: 72 },
  { status: 'customs', label: '통관 진행', progress: 80 },
  { status: 'domestic-shipping', label: '국내 배송', progress: 90 },
  { status: 'delivered', label: '배송 완료', progress: 100 }
];
```

**본주문 (10단계)**:
```typescript
const BULK_STATUS_STEPS = [
  { status: 'payment-pending', label: '계약금 대기', progress: 10 },
  { status: 'contract-completed', label: '계약 완료', progress: 20 },
  { status: 'bulk-manufacturing', label: '본 제작 중', progress: 35 },
  { status: 'qc-inspection', label: '품질 검수', progress: 50 },
  { status: 'china-inland-shipping', label: '중국 내륙 배송', progress: 60 },
  { status: 'china-korea-shipping', label: '중국→한국 배송', progress: 70 },
  { status: 'customs', label: '통관 진행', progress: 80 },
  { status: 'domestic-shipping', label: '국내 배송', progress: 90 },
  { status: 'delivered', label: '배송 완료', progress: 100 }
];
```

**주문 카드 컴포넌트**:
```tsx
<OrderCard
  orderNo={order.orderNo}
  productType={order.productType}
  quantity={order.quantity}
  status={order.status}
  progress={order.progress}
  expectedDelivery={order.expectedDelivery}
  currentLocation={order.currentLocation} // 배송 중일 때
  trackingNo={order.trackingNo} // 국내 배송 시
  manager={order.manager}
/>
```

##### 4. 서류 관리
```typescript
// 폴더 구조
const [folders, setFolders] = useState<FolderItem[]>([
  {
    id: '1',
    name: '견적서',
    type: 'folder',
    color: 'amber',
    date: '2024-12-15',
    children: [
      { id: '1-1', name: 'QT-2024-001.pdf', type: 'file', date: '2024-12-15' },
      // ...
    ]
  },
  { id: '2', name: '계약서', type: 'folder', color: 'blue', ... },
  { id: '3', name: '세금계산서', type: 'folder', color: 'green', ... },
  // ...
]);

// 드래그 앤 드롭 정렬
const moveFolder = (dragIndex: number, hoverIndex: number) => { ... };
```

#### 뷰 타입

##### 1. Grid View (기본)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</div>
```

##### 2. Kanban View
```tsx
<div className="flex gap-4 overflow-x-auto">
  {columns.map(column => (
    <KanbanColumn key={column.id} title={column.title} color={column.color}>
      {column.items.map(item => <KanbanCard {...item} />)}
    </KanbanColumn>
  ))}
</div>
```

##### 3. Calendar View
```tsx
<Calendar
  events={items.map(item => ({
    date: item.expectedDelivery,
    title: item.orderNo,
    type: item.category
  }))}
/>
```

##### 4. Gallery View
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
  {items.map(item => (
    <GalleryItem image={item.imageUrls[0]} title={item.productType} />
  ))}
</div>
```

#### 가이드 투어
```typescript
const TOUR_STEPS = [
  { target: '#my-page', title: '마이 페이지', description: '전체 현황을 한눈에...' },
  { target: '#quotes', title: '견적 관리', description: '견적 상태별로 필터링...' },
  { target: '#orders', title: '주문 관리', description: '샘플/본주문 진행 상황...' },
  { target: '#view-switcher', title: '뷰 전환', description: '그리드, 칸반, 캘린더, 갤러리...' },
  { target: '#drag-sections', title: '섹션 정렬', description: '드래그로 순서 변경...' }
];
```

---

### 4. Quote.tsx - 견적서 확인 및 승인

**파일 경로**: `Quote.tsx`

#### 주요 역할
- 견적서 상세 내용 표시
- 선택적 결제 (샘플/본주문 개별 선택)
- 실시간 채팅 및 파일 첨부
- 고객 서류 업로드
- PDF 인쇄

#### 주요 상태
```typescript
const [items, setItems] = useState<QuoteItem[]>([...]);
const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
const [showTour, setShowTour] = useState(false);
const [currentTourStep, setCurrentTourStep] = useState(0);
```

#### QuoteItem 인터페이스
```typescript
interface QuoteItem {
  id: string;
  productCode: string;
  productName: string;
  imageUrls: string[]; // 제품 이미지 (최대 5개)
  options: {
    material: string; // 원단
    size: string; // 크기
    color: string; // 색상
  };
  quantity: number; // 수량
  unitPrice: number; // 단가
  discount: number; // 할인율 (%)
  salePrice: number; // 공급가 (할인 적용)
  vat: number; // 부가세 (10%)
  productionDays: number; // 제작 일수
  type: 'main' | 'sample'; // 본주문 or 샘플
}
```

#### 핵심 기능

##### 1. 수량 변경
```typescript
const handleQuantityChange = (itemId: string, newQuantity: number) => {
  setItems(items.map(item => {
    if (item.id === itemId) {
      const unitPrice = item.unitPrice;
      const discountedPrice = unitPrice * (1 - item.discount / 100);
      const salePrice = discountedPrice * newQuantity;
      const vat = salePrice * 0.1;

      return {
        ...item,
        quantity: newQuantity,
        salePrice,
        vat
      };
    }
    return item;
  }));
};
```

##### 2. 선택적 결제
```typescript
const handleItemSelect = (itemId: string) => {
  const newSelected = new Set(selectedItems);
  if (newSelected.has(itemId)) {
    newSelected.delete(itemId);
  } else {
    newSelected.add(itemId);
  }
  setSelectedItems(newSelected);
};

// 합계 계산 (선택된 항목만)
const calculateTotal = () => {
  return items
    .filter(item => selectedItems.has(item.id))
    .reduce((acc, item) => ({
      salePrice: acc.salePrice + item.salePrice,
      vat: acc.vat + item.vat,
      total: acc.total + (item.salePrice + item.vat)
    }), { salePrice: 0, vat: 0, total: 0 });
};
```

##### 3. PDF 인쇄
```typescript
const handlePrint = () => {
  // 인쇄 범위 설정
  const printArea = document.getElementById('quote-print-area');

  // 버튼 등 숨김 처리 (CSS .print:hidden)
  window.print();
};
```

##### 4. 채팅 시스템
```typescript
const [newMessage, setNewMessage] = useState('');
const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

const handleSendMessage = () => {
  const message: ChatMessage = {
    id: Date.now().toString(),
    sender: 'customer',
    content: newMessage,
    timestamp: new Date().toISOString(),
    files: attachedFiles.map(f => ({
      name: f.name,
      url: URL.createObjectURL(f)
    }))
  };

  setMessages([...messages, message]);
  setNewMessage('');
  setAttachedFiles([]);
};
```

##### 5. 고객 서류 업로드
```typescript
const REQUIRED_DOCUMENTS = [
  { id: 'business-reg', name: '사업자등록증', required: true },
  { id: 'bank-account', name: '통장 사본', required: true },
  { id: 'id-card', name: '신분증 사본', required: false }
];

const handleFileUpload = (docId: string, files: FileList) => {
  const newFiles: UploadedFile[] = Array.from(files).map(file => ({
    id: Date.now().toString(),
    documentId: docId,
    fileName: file.name,
    fileSize: file.size,
    uploadDate: new Date().toISOString(),
    file
  }));

  setUploadedFiles([...uploadedFiles, ...newFiles]);
};
```

#### 견적 승인 플로우
```typescript
const handleApprove = () => {
  if (selectedItems.size === 0) {
    alert('최소 1개 이상의 항목을 선택해주세요.');
    return;
  }

  // 1. 회원가입 여부 확인
  if (!isLoggedIn) {
    navigate('/signup', {
      state: {
        returnUrl: '/quote',
        selectedItems: Array.from(selectedItems)
      }
    });
    return;
  }

  // 2. 결제 정보 입력
  navigate('/payment', {
    state: {
      selectedItems: Array.from(selectedItems),
      total: calculateTotal()
    }
  });
};
```

#### 가이드 투어 단계
```typescript
const TOUR_STEPS = [
  {
    target: '#quantity-input',
    title: '수량 변경',
    description: '수량을 직접 입력하여 금액을 실시간으로 확인할 수 있습니다.'
  },
  {
    target: '#select-items',
    title: '선택 결제',
    description: '원하는 항목만 체크하여 선택 결제가 가능합니다. 샘플만 먼저 결제하고 본주문은 나중에 결제할 수 있습니다.'
  },
  {
    target: '#print-button',
    title: 'PDF 인쇄',
    description: '견적서를 PDF로 저장하거나 인쇄할 수 있습니다. 인쇄 범위를 지정할 수 있습니다.'
  },
  {
    target: '#basic-documents',
    title: '기본 서류 다운로드',
    description: '견적서, 거래명세서 등 기본 서류를 다운로드할 수 있습니다.'
  },
  {
    target: '#upload-documents',
    title: '고객 서류 제출',
    description: '사업자등록증, 통장사본 등 필요한 서류를 업로드해주세요.'
  },
  {
    target: '#public-documents',
    title: '공공 기관 전용 서류',
    description: '공공기관의 경우 추가 서류를 다운로드할 수 있습니다.'
  },
  {
    target: '#chat-section',
    title: '문의 사항',
    description: '궁금한 점이 있으시면 실시간 채팅으로 문의해주세요.'
  }
];
```

---

### 5. Payment.tsx - 결제 수단 선택

**파일 경로**: `Payment.tsx`

#### 주요 역할
- 다양한 결제 수단 제공
- 결제 조건 설정 (선금/후불)
- 매입 증빙 서류 선택
- 사업자 정보 입력 (OCR 지원)

#### 주요 상태
```typescript
type PaymentMethod = 'tosspayments' | 'keyinpay' | 'bank' | 'narabil' | 'contract' | 'other';
type ProofType = 'tax-invoice' | 'cash-receipt' | 'none' | 'later';

const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tosspayments');
const [paymentTerms, setPaymentTerms] = useState<string>('발주 전 100% 선금');
const [proofType, setProofType] = useState<ProofType>('tax-invoice');
const [payors, setPayors] = useState<Payor[]>([{ id: '1', name: '', amount: 0 }]);
```

#### 결제 수단 옵션

##### 1. 토스페이먼츠 (기본)
```typescript
<PaymentOption
  id="tosspayments"
  title="토스페이먼츠"
  description="카드, 계좌이체, 간편결제"
  icon={<CreditCard />}
  isRecommended={true}
/>
```

##### 2. 안심 키인
```typescript
<PaymentOption
  id="keyinpay"
  title="안심 키인"
  description="카드 정보 수기 입력 결제"
  icon={<Key />}
/>
```

##### 3. 무통장 입금
```typescript
<PaymentOption
  id="bank"
  title="무통장 입금"
  description="계좌 이체"
  icon={<Building2 />}
>
  {/* 무통장 입금 정보 */}
  <BankInfo
    bankName="우리은행"
    accountNumber="1002-123-456789"
    accountHolder="주식회사 큐디솜"
  />
</PaymentOption>
```

##### 4. 나라빌 (공공기관)
```typescript
<PaymentOption
  id="narabil"
  title="나라빌"
  description="공공기관 전용"
  icon={<FileSignature />}
/>
```

##### 5. 수의 계약
```typescript
<PaymentOption
  id="contract"
  title="수의 계약"
  description="계약 기반 결제"
  icon={<FileText />}
/>
```

##### 6. 기타 결제
```typescript
<PaymentOption
  id="other"
  title="기타 결제"
  description="분할 결제, 타인 결제 등"
  icon={<Package />}
>
  {/* 결제자 추가 (타인 결제) */}
  <PayorList
    payors={payors}
    onAdd={() => setPayors([...payors, { id: Date.now().toString(), name: '', amount: 0 }])}
    onRemove={(id) => setPayors(payors.filter(p => p.id !== id))}
    onChange={(id, field, value) => { ... }}
  />
</PaymentOption>
```

#### 결제 조건 옵션
```typescript
const PAYMENT_TERMS = [
  {
    value: '발주 전 100% 선금',
    label: '발주 전 100% 선금',
    isRecommended: true,
    needsContract: false
  },
  {
    value: '출고 전 100% 후불',
    label: '출고 전 100% 후불',
    needsContract: true, // 전자 계약 필수
    warning: '전자 계약이 필요합니다.'
  },
  {
    value: '출고 후 100% 후불',
    label: '출고 후 100% 후불',
    needsContract: true
  },
  {
    value: '50% 선금 + 50% 후불',
    label: '50% 선금 + 50% 후불 (출고 전)',
    needsContract: true
  },
  {
    value: '기타',
    label: '기타 결제 조건 (직접 입력)',
    needsContract: false
  }
];
```

#### 매입 증빙 서류
```typescript
<div className="space-y-4">
  <RadioGroup value={proofType} onValueChange={setProofType}>
    <RadioItem
      value="tax-invoice"
      label="전자세금계산서"
      description="사업자 간 거래 시"
      isRecommended={true}
    />
    <RadioItem
      value="cash-receipt"
      label="현금영수증"
      description="개인사업자, 일반 개인"
    />
    <RadioItem
      value="none"
      label="필요 없음"
      description="증빙 불필요"
    />
    <RadioItem
      value="later"
      label="나중에 선택"
      description="추후 결정"
    />
  </RadioGroup>
</div>
```

#### 사업자 정보 입력 (전자세금계산서 선택 시)
```typescript
interface BusinessInfo {
  businessNumber: string; // 사업자 등록번호
  taxType: '일반' | '간이'; // 과세 유형
  companyName: string; // 상호명
  ceoName: string; // 대표자명
  businessAddress: string; // 사업장 주소
  headquarterAddress: string; // 본점 주소
  businessType: string; // 업태
  businessItem: string; // 종목
  taxEmail: string; // 세금계산서 이메일
}

// OCR 업로드
const handleOCRUpload = async (file: File) => {
  setIsScanning(true);

  // 2초 스캔 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 자동 정보 채우기
  setBusinessInfo({
    businessNumber: '123-45-67890',
    taxType: '일반',
    companyName: '주식회사 큐디솜',
    ceoName: '홍길동',
    businessAddress: '서울시 강남구 테헤란로 123',
    headquarterAddress: '서울시 강남구 테헤란로 123',
    businessType: '제조업',
    businessItem: '봉제인형',
    taxEmail: 'tax@qudisom.com'
  });

  setIsScanning(false);
  setOcrCompleted(true);
};
```

#### 다음 단계 분기
```typescript
const handleNext = () => {
  const needsContract = PAYMENT_TERMS.find(t => t.value === paymentTerms)?.needsContract;

  if (needsContract) {
    // 후불 결제 → 전자 계약 필수
    navigate('/econtract', {
      state: {
        paymentMethod,
        paymentTerms,
        proofType,
        businessInfo
      }
    });
  } else {
    // 선금 결제 → 추가 정보 입력
    navigate('/additional-info', {
      state: {
        paymentMethod,
        paymentTerms,
        proofType
      }
    });
  }
};
```

---

### 6. AdditionalInfo.tsx - 결제 정보 입력

**파일 경로**: `AdditionalInfo.tsx`

#### 주요 역할
- 매입 증빙 서류 재확인
- 사업자 정보 입력 (OCR 지원)
- 결제 시간 설정
- 무통장 입금 정보 표시

#### 주요 상태
```typescript
const [proofType, setProofType] = useState<ProofType>('tax-invoice');
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
const [isScanning, setIsScanning] = useState(false);
const [ocrCompleted, setOcrCompleted] = useState(false);
const [manualInput, setManualInput] = useState(false);
const [paymentTiming, setPaymentTiming] = useState<'now' | 'later'>('now');
const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
  businessNumber: '',
  taxType: '일반',
  companyName: '',
  ceoName: '',
  businessAddress: '',
  headquarterAddress: '',
  businessType: '',
  businessItem: '',
  taxEmail: ''
});
```

#### 핵심 기능

##### 1. 사업자등록증 OCR
```typescript
const handleFileUpload = async (file: File) => {
  setUploadedFile(file);
  setIsScanning(true);

  // 2초 스캔 애니메이션
  await new Promise(resolve => setTimeout(resolve, 2000));

  // OCR 결과 자동 입력
  setBusinessInfo({
    businessNumber: '123-45-67890',
    taxType: '일반',
    companyName: '주식회사 큐디솜',
    ceoName: '홍길동',
    businessAddress: '서울시 강남구 테헤란로 123',
    headquarterAddress: '서울시 강남구 테헤란로 123',
    businessType: '제조업',
    businessItem: '봉제인형',
    taxEmail: 'tax@qudisom.com'
  });

  setIsScanning(false);
  setOcrCompleted(true);
};
```

##### 2. 수기 입력 모드
```typescript
<button
  onClick={() => setManualInput(true)}
  className="text-sm text-blue-600 hover:underline"
>
  OCR 없이 직접 입력하기
</button>

{manualInput && (
  <BusinessInfoForm
    value={businessInfo}
    onChange={setBusinessInfo}
  />
)}
```

##### 3. 이전 정보 불러오기
```typescript
const handleLoadPrevious = () => {
  // 로컬 스토리지 또는 서버에서 불러오기
  const savedInfo = localStorage.getItem('businessInfo');
  if (savedInfo) {
    setBusinessInfo(JSON.parse(savedInfo));
    setOcrCompleted(true);
  }
};
```

##### 4. 결제 시간 설정
```typescript
<RadioGroup value={paymentTiming} onValueChange={setPaymentTiming}>
  <RadioItem
    value="now"
    label="지금 결제"
    description="즉시 결제 진행"
    icon={<Clock />}
  />
  <RadioItem
    value="later"
    label="나중에 결제"
    description="결제 링크를 이메일로 전송"
    icon={<Mail />}
  />
</RadioGroup>
```

##### 5. 무통장 입금 정보 (무통장 입금 선택 시)
```tsx
{paymentMethod === 'bank' && (
  <BankAccountInfo>
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">입금 계좌 정보</h4>
      <div className="space-y-1">
        <p><strong>은행:</strong> 우리은행</p>
        <p><strong>계좌번호:</strong> 1002-123-456789</p>
        <p><strong>예금주:</strong> 주식회사 큐디솜</p>
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText('1002123456789');
          alert('계좌번호가 복사되었습니다.');
        }}
        className="mt-2 text-sm text-blue-600 hover:underline"
      >
        계좌번호 복사
      </button>
    </div>
  </BankAccountInfo>
)}
```

#### 다음 단계
```typescript
const handleNext = () => {
  // 필수 정보 검증
  if (proofType === 'tax-invoice' && !ocrCompleted && !manualInput) {
    alert('사업자 정보를 입력해주세요.');
    return;
  }

  // 정보 저장 (로컬 스토리지)
  localStorage.setItem('businessInfo', JSON.stringify(businessInfo));

  // 배송 정보 입력으로 이동
  navigate('/shipping-design', {
    state: {
      proofType,
      businessInfo,
      paymentTiming
    }
  });
};
```

---

### 7. EContract.tsx - 전자 계약 정보 입력

**파일 경로**: `EContract.tsx`

#### 주요 역할
- 후불 결제 시 전자 계약 필수
- 사업자 정보 입력
- 전자 계약 담당자 정보
- 결제 예정 날짜 설정

#### 주요 상태
```typescript
const [proofType, setProofType] = useState<ProofType>('tax-invoice');
const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({...});
const [contractManager, setContractManager] = useState({
  name: '',
  email: '',
  phone: ''
});
const [paymentDateType, setPaymentDateType] = useState<'specific' | 'undecided'>('specific');
const [paymentDate, setPaymentDate] = useState('');
```

#### 핵심 기능

##### 1. 전자 계약 담당자 정보 (필수)
```tsx
<div className="space-y-4">
  <h3 className="text-lg font-semibold">전자 계약 담당자 정보</h3>
  <p className="text-sm text-gray-600">
    전자 계약서가 발송될 담당자 정보를 입력해주세요.
  </p>

  <Input
    label="담당자명"
    value={contractManager.name}
    onChange={(e) => setContractManager({ ...contractManager, name: e.target.value })}
    required
  />

  <Input
    label="이메일"
    type="email"
    value={contractManager.email}
    onChange={(e) => setContractManager({ ...contractManager, email: e.target.value })}
    placeholder="contract@company.com"
    required
  />

  <Input
    label="연락처"
    type="tel"
    value={contractManager.phone}
    onChange={(e) => setContractManager({ ...contractManager, phone: e.target.value })}
    placeholder="010-1234-5678"
    required
  />
</div>
```

##### 2. 결제 날짜 설정
```tsx
<RadioGroup value={paymentDateType} onValueChange={setPaymentDateType}>
  <RadioItem
    value="specific"
    label="결제 날짜 지정"
    description="특정 날짜에 결제 예정"
  >
    {paymentDateType === 'specific' && (
      <Input
        type="date"
        value={paymentDate}
        onChange={(e) => setPaymentDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
      />
    )}
  </RadioItem>

  <RadioItem
    value="undecided"
    label="결제 날짜 미정"
    description="추후 협의 필요"
  />
</RadioGroup>
```

##### 3. 전자세금계산서 전용 필드
```tsx
{proofType === 'tax-invoice' && (
  <>
    <Input
      label="전자세금계산서 이메일"
      type="email"
      value={businessInfo.taxEmail}
      onChange={(e) => setBusinessInfo({ ...businessInfo, taxEmail: e.target.value })}
      placeholder="tax@company.com"
      required
    />

    <div className="bg-yellow-50 p-4 rounded-lg">
      <h4 className="font-semibold text-sm mb-2">세금계산서 발행 날짜 (선택사항)</h4>
      <p className="text-xs text-gray-600 mb-2">
        특정 날짜에 세금계산서 발행을 원하시면 선택해주세요.
      </p>
      <Input
        type="date"
        value={businessInfo.taxInvoiceDate || ''}
        onChange={(e) => setBusinessInfo({ ...businessInfo, taxInvoiceDate: e.target.value })}
      />
    </div>
  </>
)}
```

##### 4. 전자 계약 발송
```typescript
const handleSendContract = async () => {
  // 필수 정보 검증
  if (!contractManager.name || !contractManager.email || !contractManager.phone) {
    alert('담당자 정보를 모두 입력해주세요.');
    return;
  }

  if (paymentDateType === 'specific' && !paymentDate) {
    alert('결제 날짜를 선택해주세요.');
    return;
  }

  // 전자 계약서 발송 (API 호출)
  const contractData = {
    businessInfo,
    contractManager,
    paymentDateType,
    paymentDate: paymentDateType === 'specific' ? paymentDate : null,
    proofType
  };

  // TODO: API 호출
  // await sendElectronicContract(contractData);

  alert('전자 계약서가 발송되었습니다. 이메일을 확인해주세요.');

  // 배송 정보 입력으로 이동
  navigate('/shipping-design', {
    state: { contractSent: true }
  });
};
```

---

## 주요 컴포넌트

### 1. OrderProgressBar.tsx - 주문 진행 바

**파일 경로**: `components/OrderProgressBar.tsx`

#### Props
```typescript
interface OrderProgressBarProps {
  currentStep: 1 | 2 | 3;
}
```

#### 단계
1. **견적 확인** / 견적 승인 (완료 시)
2. **결제 정보** / 결제 완료 (완료 시)
3. **배송 정보** (진행 중)

#### 구현
```tsx
export function OrderProgressBar({ currentStep }: OrderProgressBarProps) {
  const steps = [
    { number: 1, label: currentStep > 1 ? '견적 승인' : '견적 확인' },
    { number: 2, label: currentStep > 2 ? '결제 완료' : '결제 정보' },
    { number: 3, label: '배송 정보' }
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {/* 스텝 원형 */}
          <div
            className={`flex flex-col items-center ${
              currentStep >= step.number ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step.number
                  ? 'bg-primary border-primary text-white'
                  : 'bg-white border-gray-300'
              }`}
            >
              {currentStep > step.number ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span className="text-sm font-semibold">{step.number}</span>
              )}
            </div>
            <span className="mt-2 text-xs font-medium">{step.label}</span>
          </div>

          {/* 연결선 */}
          {index < steps.length - 1 && (
            <motion.div
              className={`w-24 h-0.5 mx-4 ${
                currentStep > step.number ? 'bg-primary' : 'bg-gray-300'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: currentStep > step.number ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
```

---

### 2. LabelLocationEditor.tsx - 라벨 위치 편집기

**파일 경로**: `components/LabelLocationEditor.tsx`

#### Props
```typescript
interface LabelLocationEditorProps {
  files: FilePreview[]; // 편집할 이미지 파일들
  onSave: (imageDataUrl: string) => void; // 최종 이미지 저장 콜백
}
```

#### 주요 기능
- Canvas 기반 드로잉 (화살표, 브러시, 사각형, 원형)
- 자동 번호 마커 배치 (최대 5곳)
- 여러 이미지 간 전환
- 되돌리기 (Undo)
- 초기화 (Clear)

#### 주요 상태
```typescript
type DrawTool = 'brush' | 'rectangle' | 'circle' | 'arrow';

interface Marker {
  number: number;
  x: number;
  y: number;
}

const [selectedTool, setSelectedTool] = useState<DrawTool>('brush');
const [isDrawing, setIsDrawing] = useState(false);
const [markers, setMarkers] = useState<Marker[]>([]);
const [history, setHistory] = useState<string[]>([]); // 히스토리 (Base64)
const [currentFileIndex, setCurrentFileIndex] = useState(0);
```

#### 핵심 로직

##### 1. Canvas 초기화
```typescript
useEffect(() => {
  const imageCanvas = imageCanvasRef.current;
  const drawCanvas = drawCanvasRef.current;

  if (!imageCanvas || !drawCanvas) return;

  const img = new Image();
  img.src = files[currentFileIndex].preview;

  img.onload = () => {
    // 이미지 캔버스에 배경 이미지 그리기
    const ctx = imageCanvas.getContext('2d');
    imageCanvas.width = img.width;
    imageCanvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // 드로잉 캔버스 크기 맞추기
    drawCanvas.width = img.width;
    drawCanvas.height = img.height;
  };
}, [currentFileIndex, files]);
```

##### 2. 드로잉 시작
```typescript
const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  setIsDrawing(true);

  const canvas = drawCanvasRef.current!;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  startPos.current = { x, y };
};
```

##### 3. 드로잉 진행
```typescript
const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
  if (!isDrawing) return;

  const canvas = drawCanvasRef.current!;
  const ctx = canvas.getContext('2d')!;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.strokeStyle = '#fab803';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  switch (selectedTool) {
    case 'brush':
      ctx.lineTo(x, y);
      ctx.stroke();
      break;

    case 'rectangle':
      // 임시 사각형 그리기 (실시간 미리보기)
      const width = x - startPos.current.x;
      const height = y - startPos.current.y;
      ctx.strokeRect(startPos.current.x, startPos.current.y, width, height);
      break;

    case 'circle':
      // 임시 원 그리기
      const radius = Math.sqrt(
        Math.pow(x - startPos.current.x, 2) + Math.pow(y - startPos.current.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.current.x, startPos.current.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      break;

    case 'arrow':
      // 임시 화살표 그리기
      drawArrow(ctx, startPos.current.x, startPos.current.y, x, y);
      break;
  }
};
```

##### 4. 드로잉 종료 (마커 자동 배치)
```typescript
const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
  if (!isDrawing) return;
  setIsDrawing(false);

  const canvas = drawCanvasRef.current!;
  const rect = canvas.getBoundingClientRect();
  const endX = e.clientX - rect.left;
  const endY = e.clientY - rect.top;

  // 도형 중앙에 번호 마커 배치
  const centerX = (startPos.current.x + endX) / 2;
  const centerY = (startPos.current.y + endY) / 2;

  if (markers.length < 5) {
    const newMarker: Marker = {
      number: markers.length + 1,
      x: centerX,
      y: centerY
    };

    setMarkers([...markers, newMarker]);
    drawMarker(newMarker);
  }

  // 히스토리 저장
  saveHistory();
};
```

##### 5. 마커 그리기
```typescript
const drawMarker = (marker: Marker) => {
  const canvas = drawCanvasRef.current!;
  const ctx = canvas.getContext('2d')!;

  // 노란색 원형 배경
  ctx.fillStyle = '#fab803';
  ctx.beginPath();
  ctx.arc(marker.x, marker.y, 15, 0, 2 * Math.PI);
  ctx.fill();

  // 검은색 번호
  ctx.fillStyle = '#1a2867';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(marker.number.toString(), marker.x, marker.y);
};
```

##### 6. 화살표 그리기
```typescript
const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
  const headLength = 20; // 화살표 머리 길이
  const angle = Math.atan2(toY - fromY, toX - fromX);

  // 선 그리기
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // 화살표 머리 그리기
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
};
```

##### 7. 되돌리기 (Undo)
```typescript
const handleUndo = () => {
  if (history.length === 0) return;

  const prevState = history[history.length - 1];
  const canvas = drawCanvasRef.current!;
  const ctx = canvas.getContext('2d')!;

  const img = new Image();
  img.src = prevState;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };

  setHistory(history.slice(0, -1));
  setMarkers(markers.slice(0, -1)); // 마커도 제거
};
```

##### 8. 최종 이미지 저장
```typescript
const handleSave = () => {
  const imageCanvas = imageCanvasRef.current!;
  const drawCanvas = drawCanvasRef.current!;

  // 임시 캔버스에 합성
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageCanvas.width;
  tempCanvas.height = imageCanvas.height;
  const ctx = tempCanvas.getContext('2d')!;

  // 배경 이미지
  ctx.drawImage(imageCanvas, 0, 0);

  // 드로잉 레이어
  ctx.drawImage(drawCanvas, 0, 0);

  // Base64로 변환
  const finalImage = tempCanvas.toDataURL('image/png');

  onSave(finalImage);
  alert('라벨 위치 편집이 저장되었습니다.');
};
```

---

### 3. DeliveryScenarioSection.tsx - AI 배송 시나리오

**파일 경로**: `components/DeliveryScenarioSection.tsx`

#### Props
```typescript
interface DeliveryScenarioSectionProps {
  targetDeliveryDate: string; // 주문 예상 시점
  actualDeliveryDate: string; // 납기 일자
  initialSampleDeliveryMethod: 'photo' | 'physical'; // 초기 샘플 전달
  mainProductionType: 'standard' | 'express' | 'normal'; // 본 제작 방식
  onTargetDateChange: (date: string) => void;
  onActualDateChange: (date: string) => void;
  onInitialMethodChange: (method: 'photo' | 'physical') => void;
  onMainTypeChange: (type: 'standard' | 'express' | 'normal') => void;
  onScenarioSelect: (scenario: Scenario) => void;
}
```

#### 시나리오 구조
```typescript
interface Scenario {
  id: string;
  name: string; // 예: 'photo-1-physical-normal'
  isBest: boolean;
  totalWeeks: number; // 총 소요 주
  steps: ScenarioStep[];
  expectedCompletionDate: string; // 예상 완료 날짜
  isPossible: boolean; // 납기 가능 여부
}

interface ScenarioStep {
  phase: 'initial-sample' | 'revision' | 'main-production';
  method: 'photo' | 'physical' | 'express' | 'normal';
  weeks: number;
  description: string;
}
```

#### 핵심 알고리즘 - 시나리오 생성
```typescript
const generateScenarios = (orderDate: string): Scenario[] => {
  const scenarios: Scenario[] = [];

  // 초기 샘플 옵션
  const initialOptions = [
    { method: 'photo', weeks: 2, label: '사진 전달' },
    { method: 'physical', weeks: 3, label: '실물 전달' }
  ];

  // 수정 횟수 옵션 (0, 1, 2회)
  const revisionCounts = [0, 1, 2];

  // 수정 방식 옵션
  const revisionOptions = [
    { method: 'photo', weeks: 1, label: '사진 수정' },
    { method: 'physical', weeks: 2, label: '실물 수정' }
  ];

  // 본 제작 옵션
  const mainOptions = [
    { type: 'normal', weeks: 5, label: '일반 제작' },
    { type: 'express', weeks: 2, label: '급행 제작' }
  ];

  // 모든 조합 생성
  for (const initial of initialOptions) {
    for (const revisionCount of revisionCounts) {
      // 수정 횟수만큼 모든 수정 방식 조합 생성
      const revisionCombinations = generateRevisionCombinations(revisionCount);

      for (const revisionCombo of revisionCombinations) {
        for (const main of mainOptions) {
          // 총 소요 기간 계산
          const totalWeeks =
            initial.weeks +
            revisionCombo.reduce((sum, r) => sum + r.weeks, 0) +
            main.weeks;

          // 예상 완료 날짜 계산
          const completionDate = addWeeks(orderDate, totalWeeks);

          // 시나리오 생성
          const scenario: Scenario = {
            id: `${initial.method}-${revisionCount}-${revisionCombo.map(r => r.method).join('-')}-${main.type}`,
            name: `${initial.label} → ${revisionCount}회 수정 → ${main.label}`,
            isBest: false, // 나중에 설정
            totalWeeks,
            steps: [
              {
                phase: 'initial-sample',
                method: initial.method,
                weeks: initial.weeks,
                description: `초기 샘플 (${initial.label}, ${initial.weeks}주)`
              },
              ...revisionCombo.map((r, i) => ({
                phase: 'revision' as const,
                method: r.method,
                weeks: r.weeks,
                description: `${i + 1}차 수정 (${r.label}, ${r.weeks}주)`
              })),
              {
                phase: 'main-production',
                method: main.type,
                weeks: main.weeks,
                description: `본 제작 (${main.label}, ${main.weeks}주)`
              }
            ],
            expectedCompletionDate: completionDate,
            isPossible: true // 나중에 계산
          };

          scenarios.push(scenario);
        }
      }
    }
  }

  // BEST 시나리오 설정 (photo-1-physical-normal)
  const bestScenario = scenarios.find(s =>
    s.id === 'photo-1-physical-normal' ||
    s.id === 'photo-0-normal'
  );
  if (bestScenario) {
    bestScenario.isBest = true;
  }

  // 소요 기간 순으로 정렬
  scenarios.sort((a, b) => a.totalWeeks - b.totalWeeks);

  return scenarios;
};

// 수정 방식 조합 생성
const generateRevisionCombinations = (count: number): Array<{method: 'photo' | 'physical', weeks: number, label: string}> => {
  if (count === 0) return [[]];
  if (count === 1) return [
    [{ method: 'photo', weeks: 1, label: '사진' }],
    [{ method: 'physical', weeks: 2, label: '실물' }]
  ];
  if (count === 2) return [
    [
      { method: 'photo', weeks: 1, label: '사진' },
      { method: 'photo', weeks: 1, label: '사진' }
    ],
    [
      { method: 'photo', weeks: 1, label: '사진' },
      { method: 'physical', weeks: 2, label: '실물' }
    ],
    [
      { method: 'physical', weeks: 2, label: '실물' },
      { method: 'photo', weeks: 1, label: '사진' }
    ],
    [
      { method: 'physical', weeks: 2, label: '실물' },
      { method: 'physical', weeks: 2, label: '실물' }
    ]
  ];

  return [];
};

// 날짜 계산
const addWeeks = (dateString: string, weeks: number): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + weeks * 7);
  return date.toISOString().split('T')[0];
};
```

#### 시나리오 표시
```tsx
{scenarios.map(scenario => (
  <ScenarioCard
    key={scenario.id}
    scenario={scenario}
    isSelected={selectedScenario?.id === scenario.id}
    onClick={() => onScenarioSelect(scenario)}
  >
    {/* BEST 뱃지 */}
    {scenario.isBest && (
      <Badge className="bg-yellow-500">BEST</Badge>
    )}

    {/* 시나리오 이름 */}
    <h4 className="font-semibold">{scenario.name}</h4>

    {/* 총 소요 기간 */}
    <p className="text-sm text-gray-600">
      총 {scenario.totalWeeks}주 소요
    </p>

    {/* 예상 완료 날짜 */}
    <p className={`text-sm ${scenario.isPossible ? 'text-green-600' : 'text-red-600'}`}>
      예상 완료: {scenario.expectedCompletionDate}
    </p>

    {/* 납기 불가 경고 */}
    {!scenario.isPossible && (
      <div className="bg-red-50 text-red-600 p-2 rounded text-xs">
        ⚠️ 납기 일자를 맞추기 어렵습니다
      </div>
    )}

    {/* 타임라인 */}
    <Timeline steps={scenario.steps} />
  </ScenarioCard>
))}
```

#### 타임라인 시각화
```tsx
function Timeline({ steps }: { steps: ScenarioStep[] }) {
  return (
    <div className="mt-4 space-y-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          {/* 진행 바 */}
          <div className="flex-1">
            <div className="h-2 rounded-full bg-gray-200">
              <motion.div
                className={`h-full rounded-full ${getStepColor(step.phase)}`}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          </div>

          {/* 단계 설명 */}
          <span className="text-xs text-gray-600 w-32">
            {step.description}
          </span>
        </div>
      ))}
    </div>
  );
}

const getStepColor = (phase: string): string => {
  switch (phase) {
    case 'initial-sample':
      return 'bg-blue-500';
    case 'revision':
      return 'bg-orange-500';
    case 'main-production':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};
```

---

## 데이터 구조

### mockDashboardData.ts

**파일 경로**: `data/mockDashboardData.ts`

#### 1. 견적 데이터 (mockQuotes)
```typescript
export const mockQuotes = [
  {
    id: 'QT-2024-001',
    productType: '봉제 인형',
    quantity: 500,
    size: '30x25x15cm',
    status: 'pending', // 'pending' | 'reviewing' | 'completed' | 'confirmed'
    requestDate: '2024-12-15',
    estimatedPrice: '₩2,500,000'
  },
  // ... 더 많은 견적
];
```

#### 2. 샘플 주문 데이터 (mockSampleOrders)
```typescript
export const mockSampleOrders = [
  {
    id: 's1',
    orderNo: 'SP-2024-001',
    productType: '봉제 인형 (곰)',
    quantity: 3,
    expectedDelivery: '2024-12-20',
    progress: 8, // 0-100
    status: 'payment-pending',
    price: '150,000원',
    manager: '김담당',
    category: 'sample'
  },
  {
    id: 's2',
    orderNo: 'SP-2024-002',
    productType: '인형 키링 (고양이)',
    quantity: 5,
    expectedDelivery: '2024-12-22',
    progress: 15,
    status: 'payment-completed',
    price: '200,000원',
    manager: '이담당',
    category: 'sample'
  },
  // ... 13단계 모든 상태
];
```

**샘플 주문 상태 목록**:
```typescript
type SampleStatus =
  | 'payment-pending'        // 결제 대기 (8%)
  | 'payment-completed'      // 결제 완료 (15%)
  | 'manufacturing'          // 제작 중 (25%)
  | 'feedback-pending'       // 피드백 대기 (35%)
  | 'revising'              // 수정 중 (42%)
  | 'revision-completed'     // 수정 완료 (50%)
  | 'final-confirmed'        // 최종 컨펌 (58%)
  | 'delivery-method'        // 전달 방식 선택 (65%)
  | 'china-korea-shipping'   // 중국→한국 배송 (72%)
  | 'customs'               // 통관 진행 (80%)
  | 'domestic-shipping'      // 국내 배송 (90%)
  | 'delivered';            // 배송 완료 (100%)
```

#### 3. 본주문 데이터 (mockBulkOrders)
```typescript
export const mockBulkOrders = [
  {
    id: 'b1',
    orderNo: 'BK-2024-001',
    productType: '봉제 인형 (펭귄)',
    quantity: 500,
    expectedDelivery: '2025-01-15',
    progress: 10,
    status: 'payment-pending',
    currentLocation: '',
    price: '2,500,000원',
    manager: '김담당',
    category: 'bulk'
  },
  {
    id: 'b2',
    orderNo: 'BK-2024-002',
    productType: '인형 키링 (토끼)',
    quantity: 1000,
    expectedDelivery: '2025-01-20',
    progress: 20,
    status: 'contract-completed',
    currentLocation: '',
    price: '3,000,000원',
    manager: '이담당',
    category: 'bulk'
  },
  // ... 10단계 모든 상태
];
```

**본주문 상태 목록**:
```typescript
type BulkStatus =
  | 'payment-pending'        // 계약금 대기 (10%)
  | 'contract-completed'     // 계약 완료 (20%)
  | 'bulk-manufacturing'     // 본 제작 중 (35%)
  | 'qc-inspection'         // 품질 검수 (50%)
  | 'china-inland-shipping'  // 중국 내륙 배송 (60%)
  | 'china-korea-shipping'   // 중국→한국 배송 (70%)
  | 'customs'               // 통관 진행 (80%)
  | 'domestic-shipping'      // 국내 배송 (90%)
  | 'delivered';            // 배송 완료 (100%)
```

#### 4. 1:1 문의 데이터 (mockOneOnOne)
```typescript
export const mockOneOnOne = [
  {
    id: 'inq-001',
    title: '견적 관련 문의',
    content: '수량 500개 대신 300개로 변경 가능한가요?',
    status: 'pending', // 'pending' | 'answered' | 'closed'
    createdAt: '2024-12-15',
    answer: null
  },
  {
    id: 'inq-002',
    title: '배송 일정 문의',
    content: '급행 배송 가능한가요?',
    status: 'answered',
    createdAt: '2024-12-14',
    answer: {
      content: '네, 급행 배송 가능합니다. 추가 비용은...',
      answeredAt: '2024-12-14',
      answeredBy: '고객센터'
    }
  }
];
```

#### 5. 주문 히스토리 (mockOrderHistory)
```typescript
export const mockOrderHistory = [
  {
    id: 'hist-001',
    orderNo: 'BK-2023-050',
    productType: '봉제 인형 (곰)',
    quantity: 1000,
    orderDate: '2023-11-01',
    deliveryDate: '2023-12-20',
    totalPrice: '5,000,000원',
    status: 'delivered',
    rating: 5,
    review: '품질이 정말 좋았습니다!'
  }
];
```

#### 6. 불량 접수 (mockDefectReports)
```typescript
export const mockDefectReports = [
  {
    id: 'def-001',
    orderNo: 'BK-2024-001',
    productType: '봉제 인형 (펭귄)',
    defectType: '봉제 불량', // '봉제 불량' | '색상 차이' | '크기 오차' | '기타'
    quantity: 5,
    description: '일부 제품의 봉제선이 터졌습니다.',
    images: ['image1.jpg', 'image2.jpg'],
    reportDate: '2024-12-15',
    status: 'pending', // 'pending' | 'processing' | 'resolved'
    resolution: null
  }
];
```

#### 7. 서류 데이터 (mockDocuments)
```typescript
export const mockDocuments = [
  {
    id: 'doc-001',
    name: 'QT-2024-001_견적서.pdf',
    type: 'quote',
    uploadDate: '2024-12-15',
    size: '1.2MB',
    url: '/documents/QT-2024-001.pdf'
  },
  {
    id: 'doc-002',
    name: 'BK-2024-001_계약서.pdf',
    type: 'contract',
    uploadDate: '2024-12-10',
    size: '2.5MB',
    url: '/documents/BK-2024-001.pdf'
  }
];
```

---

## 주요 알고리즘

### 1. 배송 시나리오 생성 알고리즘

**목적**: 주문 예상 시점과 납기 일자를 기반으로 모든 가능한 배송 시나리오를 생성하고, 최적의 시나리오(BEST)를 추천.

**입력**:
- `orderDate`: 주문 예상 시점
- `deliveryDate`: 납기 일자

**출력**:
- `scenarios[]`: 모든 가능한 시나리오 배열 (소요 기간 순 정렬)

**알고리즘**:
```
1. 초기 샘플 옵션 정의:
   - 사진 전달: 2주
   - 실물 전달: 3주

2. 수정 횟수 옵션: 0회, 1회, 2회

3. 수정 방식 옵션:
   - 사진 수정: 1주
   - 실물 수정: 2주

4. 본 제작 옵션:
   - 일반 제작: 5주
   - 급행 제작: 2주

5. 모든 조합 생성:
   FOR EACH 초기샘플 IN [사진, 실물]:
     FOR EACH 수정횟수 IN [0, 1, 2]:
       FOR EACH 수정조합 IN generate_revision_combinations(수정횟수):
         FOR EACH 본제작 IN [일반, 급행]:
           총소요기간 = 초기샘플.weeks + SUM(수정조합.weeks) + 본제작.weeks
           예상완료일 = orderDate + 총소요기간

           시나리오 생성:
             - id: "initial-revisions-main"
             - totalWeeks: 총소요기간
             - expectedCompletionDate: 예상완료일
             - isPossible: (예상완료일 <= deliveryDate)

           시나리오 추가

6. BEST 시나리오 설정:
   - 기본 추천: 'photo-1-physical-normal'
     (사진 초기샘플 → 1회 실물 수정 → 일반 본제작)
   - 이유: 비용 효율성과 품질의 균형

7. 소요 기간 순 정렬:
   scenarios.sort((a, b) => a.totalWeeks - b.totalWeeks)

8. 납기 가능 여부 계산:
   FOR EACH scenario:
     scenario.isPossible = (scenario.expectedCompletionDate <= deliveryDate)

9. RETURN scenarios
```

**시간 복잡도**: O(n), n = 2 × 3 × (1 + 2 + 4) × 2 = 84개 시나리오

---

### 2. 견적 금액 계산 알고리즘

**목적**: 선택된 항목들의 공급가, 부가세, 합계를 계산.

**입력**:
- `items[]`: 견적 항목 배열
- `selectedItems`: 선택된 항목 ID Set

**출력**:
- `{ salePrice, vat, total }`

**알고리즘**:
```
1. 초기화:
   salePrice = 0
   vat = 0
   total = 0

2. FOR EACH item IN items:
     IF selectedItems.has(item.id):
       salePrice += item.salePrice
       vat += item.vat
       total += (item.salePrice + item.vat)

3. RETURN { salePrice, vat, total }
```

**수량 변경 시 재계산**:
```
1. unitPrice: 단가
2. discount: 할인율 (%)

3. discountedPrice = unitPrice × (1 - discount / 100)
4. salePrice = discountedPrice × quantity
5. vat = salePrice × 0.1

6. item.quantity = quantity
7. item.salePrice = salePrice
8. item.vat = vat
```

---

### 3. KC 인증 비용 및 기간 계산

**목적**: 제품 대상 연령에 따른 KC 인증 비용과 소요 기간 계산.

**입력**:
- `targetAge`: 대상 연령 ('3세 미만', '3-8세', '8-13세', '14세 이상')

**출력**:
- `{ cost, duration, requirements[] }`

**알고리즘**:
```
SWITCH targetAge:
  CASE '3세 미만':
    cost = '약 200만원'
    duration = '3-5주'
    requirements = [
      '안전 확인 신고 필수',
      'KC 마크 부착 (사이즈 5mm 이상)',
      '제품 안전성 테스트 (물리적, 화학적)',
      '경고 표시 필수',
      '사용 연령 명시'
    ]

  CASE '3-8세':
    cost = '약 150-200만원'
    duration = '2-4주'
    requirements = [
      '안전 확인 신고',
      'KC 마크 부착',
      '제품 안전성 테스트',
      '사용 연령 명시'
    ]

  CASE '8-13세':
    cost = '약 80-100만원'
    duration = '2-4주'
    requirements = [
      '안전 확인 신고',
      'KC 마크 부착',
      '기본 안전 테스트'
    ]

  CASE '14세 이상':
    cost = '무료'
    duration = '-'
    requirements = []

RETURN { cost, duration, requirements }
```

---

### 4. OCR 사업자등록증 정보 추출 (시뮬레이션)

**목적**: 업로드된 사업자등록증 이미지에서 정보를 추출.

**입력**:
- `file`: 사업자등록증 이미지 파일

**출력**:
- `BusinessInfo` 객체

**알고리즘** (실제 구현 시 OCR API 사용):
```
1. 파일 업로드 확인:
   IF file.type NOT IN ['image/jpeg', 'image/png', 'image/pdf']:
     RETURN ERROR '지원하지 않는 파일 형식'

2. 스캔 시작 애니메이션:
   setIsScanning(true)
   WAIT 2초 (시뮬레이션)

3. OCR API 호출 (실제):
   result = await ocrAPI.extract(file)

4. 정보 추출 및 파싱:
   businessInfo = {
     businessNumber: extractBusinessNumber(result),
     taxType: extractTaxType(result),
     companyName: extractCompanyName(result),
     ceoName: extractCEOName(result),
     businessAddress: extractAddress(result),
     headquarterAddress: extractHeadquarterAddress(result),
     businessType: extractBusinessType(result),
     businessItem: extractBusinessItem(result),
     taxEmail: '' // 수동 입력 필요
   }

5. 스캔 완료:
   setIsScanning(false)
   setOcrCompleted(true)
   setBusinessInfo(businessInfo)

6. RETURN businessInfo
```

**정규식 패턴** (한국 사업자등록번호):
```javascript
const businessNumberPattern = /\d{3}-\d{2}-\d{5}/;
```

---

### 5. 드래그 앤 드롭 정렬 알고리즘

**목적**: react-dnd를 사용하여 항목 순서 변경.

**입력**:
- `items[]`: 정렬할 항목 배열
- `dragIndex`: 드래그 시작 인덱스
- `hoverIndex`: 드롭 대상 인덱스

**출력**:
- `items[]`: 재정렬된 배열

**알고리즘**:
```
1. 유효성 검증:
   IF dragIndex === hoverIndex:
     RETURN items (변경 없음)

2. 드래그 항목 추출:
   dragItem = items[dragIndex]

3. 새 배열 생성:
   newItems = [...items]

4. 드래그 항목 제거:
   newItems.splice(dragIndex, 1)

5. 드롭 위치에 삽입:
   newItems.splice(hoverIndex, 0, dragItem)

6. RETURN newItems
```

**react-dnd 통합**:
```typescript
const [, drag] = useDrag({
  type: 'ITEM',
  item: { index }
});

const [, drop] = useDrop({
  accept: 'ITEM',
  hover: (draggedItem: { index: number }) => {
    if (draggedItem.index !== index) {
      moveItem(draggedItem.index, index);
      draggedItem.index = index;
    }
  }
});

const ref = useRef<HTMLDivElement>(null);
drag(drop(ref));
```

---

## 개발 가이드

### 1. 코드 스타일

#### 1.1 이중 언어 주석
```typescript
// 견적 요청 폼 (Quote Request Form)
const handleSubmit = () => {
  // 필수 정보 검증 (Validate required fields)
  if (!customerInfo.name) {
    alert('이름을 입력해주세요.');
    return;
  }

  // 견적 데이터 생성 (Generate quote data)
  const quoteData = {
    ...customerInfo,
    products
  };

  // 서버 전송 (Send to server)
  submitQuote(quoteData);
};
```

#### 1.2 컴포넌트 구조
```typescript
// ============================================================================
// 타입 정의 (Type Definitions)
// ============================================================================

interface Props {
  // ...
}

// ============================================================================
// 상수 (Constants)
// ============================================================================

const DEFAULT_OPTIONS = [...];

// ============================================================================
// 메인 컴포넌트 (Main Component)
// ============================================================================

export function ComponentName({ prop1, prop2 }: Props) {
  // 상태 (State)
  const [state, setState] = useState(...);

  // 이벤트 핸들러 (Event Handlers)
  const handleClick = () => { ... };

  // 렌더링 (Rendering)
  return (
    <div>...</div>
  );
}
```

#### 1.3 네이밍 규칙
- **페이지**: PascalCase (예: `Dashboard.tsx`)
- **컴포넌트**: PascalCase (예: `OrderProgressBar.tsx`)
- **훅**: camelCase, `use` 접두사 (예: `useOrderStatus.ts`)
- **유틸리티**: camelCase (예: `formatCurrency.ts`)
- **상수**: UPPER_SNAKE_CASE (예: `FABRIC_OPTIONS`)
- **타입/인터페이스**: PascalCase (예: `QuoteItem`)

---

### 2. 브랜드 컬러 사용

#### 2.1 색상 팔레트
```css
/* globals.css */
:root {
  --primary: #fab803;           /* 메인 노란색 */
  --primary-foreground: #1a2867; /* 노란색 위 텍스트 (네이비) */
  --secondary: #1a2867;          /* 서브 네이비 */
  --secondary-foreground: #ffffff; /* 네이비 위 텍스트 (화이트) */

  --background: #FAFBFC;         /* 배경색 */
  --foreground: #191F28;         /* 기본 텍스트 */
  --muted-foreground: #4E5968;   /* 보조 텍스트 */

  --border: #E5E8EB;             /* 테두리 */
  --input: #E5E8EB;              /* 입력 필드 테두리 */
}
```

#### 2.2 사용 예시
```tsx
{/* ❌ 잘못된 사용 - 텍스트에 노란색 */}
<p className="text-[#fab803]">견적 요청</p>

{/* ✅ 올바른 사용 - 강조/배경에만 노란색 */}
<button className="bg-primary text-primary-foreground">
  견적 요청
</button>

{/* ✅ 올바른 사용 - 네이비 텍스트 */}
<h1 className="text-secondary">큐디솜</h1>

{/* ✅ 올바른 사용 - 일반 텍스트는 블랙/그레이 */}
<p className="text-foreground">인형 제작 전문 업체</p>
<p className="text-muted-foreground">최소 수량 300개</p>
```

---

### 3. 상태 관리 패턴

#### 3.1 로컬 상태 (useState)
```typescript
// 간단한 UI 상태
const [isOpen, setIsOpen] = useState(false);

// 폼 데이터
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});

// 배열 상태
const [items, setItems] = useState<Item[]>([]);
```

#### 3.2 복잡한 객체 업데이트
```typescript
// ❌ 잘못된 방법 - 직접 수정
const updateProduct = (index: number, field: string, value: any) => {
  products[index][field] = value; // 직접 수정 금지!
  setProducts(products);
};

// ✅ 올바른 방법 - 불변성 유지
const updateProduct = (index: number, field: string, value: any) => {
  setProducts(products.map((p, i) =>
    i === index ? { ...p, [field]: value } : p
  ));
};

// ✅ 더 나은 방법 - 헬퍼 함수
const updateProduct = (index: number, updates: Partial<Product>) => {
  setProducts(products.map((p, i) =>
    i === index ? { ...p, ...updates } : p
  ));
};
```

#### 3.3 Props Drilling 최소화
```typescript
// ❌ 과도한 Props Drilling
<Parent>
  <Child1 data={data} />
  <Child2 data={data} />
  <Child3>
    <GrandChild data={data} />
  </Child3>
</Parent>

// ✅ Context API 사용 (필요시)
const DataContext = createContext<Data | null>(null);

<DataContext.Provider value={data}>
  <Parent>
    <Child1 />
    <Child2 />
    <Child3>
      <GrandChild />
    </Child3>
  </Parent>
</DataContext.Provider>
```

---

### 4. 에러 처리

#### 4.1 사용자 입력 검증
```typescript
const validateForm = (): boolean => {
  // 필수 필드 검증
  if (!customerInfo.name) {
    alert('이름을 입력해주세요.');
    return false;
  }

  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerInfo.email)) {
    alert('올바른 이메일 주소를 입력해주세요.');
    return false;
  }

  // 전화번호 형식 검증
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  if (!phoneRegex.test(customerInfo.phone)) {
    alert('전화번호는 010-0000-0000 형식으로 입력해주세요.');
    return false;
  }

  return true;
};
```

#### 4.2 API 호출 에러 처리
```typescript
const fetchQuotes = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch('/api/quotes');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setQuotes(data);
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    setError('견적 목록을 불러오는데 실패했습니다.');

    // 사용자 친화적 메시지
    alert('견적 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
  } finally {
    setIsLoading(false);
  }
};
```

---

### 5. 성능 최적화

#### 5.1 useCallback & useMemo
```typescript
// ❌ 매 렌더링마다 새 함수 생성
const handleClick = () => {
  console.log('Clicked');
};

// ✅ 함수 메모이제이션
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);

// ❌ 매 렌더링마다 재계산
const total = items.reduce((sum, item) => sum + item.price, 0);

// ✅ 값 메모이제이션
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0),
  [items]
);
```

#### 5.2 컴포넌트 분할
```typescript
// ❌ 큰 컴포넌트
function LargeComponent() {
  return (
    <div>
      {/* 1000줄의 JSX */}
    </div>
  );
}

// ✅ 작은 컴포넌트로 분할
function ParentComponent() {
  return (
    <div>
      <Header />
      <MainContent />
      <Sidebar />
      <Footer />
    </div>
  );
}
```

#### 5.3 이미지 최적화
```tsx
// ✅ lazy loading
<img
  src={imageUrl}
  alt="Product"
  loading="lazy"
/>

// ✅ srcset으로 반응형 이미지
<img
  src={imageUrl}
  srcSet={`${imageUrl}?w=400 400w, ${imageUrl}?w=800 800w`}
  sizes="(max-width: 600px) 400px, 800px"
  alt="Product"
/>
```

---

### 6. 접근성 (a11y)

#### 6.1 시맨틱 HTML
```tsx
// ❌ div 남용
<div onClick={handleClick}>클릭</div>

// ✅ 올바른 시맨틱 태그
<button onClick={handleClick}>클릭</button>

// ✅ 폼 라벨
<label htmlFor="email">이메일</label>
<input id="email" type="email" />
```

#### 6.2 키보드 접근성
```tsx
// ✅ 키보드 네비게이션
<div
  tabIndex={0}
  role="button"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  클릭 가능한 영역
</div>
```

#### 6.3 ARIA 속성
```tsx
// ✅ 스크린 리더 지원
<button aria-label="견적서 삭제">
  <Trash2 className="w-4 h-4" />
</button>

<div aria-live="polite" aria-atomic="true">
  {successMessage && <p>{successMessage}</p>}
</div>
```

---

### 7. 테스팅 가이드

#### 7.1 컴포넌트 테스트 (권장)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderProgressBar } from './OrderProgressBar';

describe('OrderProgressBar', () => {
  it('현재 단계를 강조 표시한다', () => {
    render(<OrderProgressBar currentStep={2} />);

    const step2 = screen.getByText('결제 정보');
    expect(step2).toHaveClass('text-primary');
  });

  it('완료된 단계는 체크 아이콘을 표시한다', () => {
    render(<OrderProgressBar currentStep={3} />);

    const checkIcons = screen.getAllByTestId('check-icon');
    expect(checkIcons).toHaveLength(2); // 1, 2단계
  });
});
```

#### 7.2 유틸리티 함수 테스트
```typescript
import { formatCurrency } from './utils';

describe('formatCurrency', () => {
  it('숫자를 한국 통화 형식으로 변환한다', () => {
    expect(formatCurrency(1000000)).toBe('₩1,000,000');
    expect(formatCurrency(500)).toBe('₩500');
  });
});
```

---

## 📝 추가 참고사항

### 개발 환경 설정
1. Node.js 18+ 설치
2. 의존성 설치: `npm install`
3. 개발 서버 실행: `npm run dev`

### Git 워크플로우 (권장)
```bash
# 기능 브랜치 생성
git checkout -b feature/quote-calculator

# 작업 후 커밋
git add .
git commit -m "feat: 자동 견적 산출기 구현"

# 푸시
git push origin feature/quote-calculator
```

### 커밋 메시지 규칙 (권장)
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경 (포맷팅)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 설정 등

### 배포 전 체크리스트
- [ ] 모든 페이지가 정상적으로 로드되는지 확인
- [ ] 브라우저 콘솔 에러 없는지 확인
- [ ] 모바일 반응형 확인
- [ ] 성능 최적화 (Lighthouse 점수 80+ 목표)
- [ ] 접근성 검증 (WAVE, axe)
- [ ] 크로스 브라우저 테스트 (Chrome, Safari, Firefox)

---

**문서 작성일**: 2026-01-05
**마지막 업데이트**: 2026-01-05
**작성자**: Claude Code
**버전**: 1.0.0
