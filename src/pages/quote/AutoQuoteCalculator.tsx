import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

// ============================================
// 타입 정의
// ============================================
interface OptionPrice {
  fabric: number;
  label: number;
  tag: number;
  string: number;
  filling: number;
  package: number;
  keyring: number;
}

interface SelectedOptions {
  quantity: number;
  width: number;
  height: number;
  fabric: string;
  label: string;
  tag: string;
  string: string;
  filling: string;
  package: string;
  keyring: string;
}

interface DropdownOption {
  text: string;
  price: number;
  image: string;
  description: string;
}

interface KeyringOption {
  code: string;
  price: number;
  image: string;
  description: string;
}

interface PriceResult {
  unitPrice: number;
  supplyPrice: number;
  vatPrice: number;
  totalPrice: number;
}

interface ImageModalData {
  isOpen: boolean;
  image: string;
  title: string;
  description: string;
  price: number;
}

type OptionType = 'fabric' | 'label' | 'tag' | 'string' | 'filling' | 'package';

// ============================================
// 설정 상수
// ============================================
const CONFIG = {
  pricing: {
    basePrice: 5000,
    referenceArea: 300,
    vatRate: 0.1,
  },
  quantityDiscounts: [
    { minQuantity: 5000, discountRate: 0.8 },
    { minQuantity: 1000, discountRate: 0.85 },
    { minQuantity: 500, discountRate: 0.9 },
  ],
  limits: {
    quantity: { min: 100, max: 10000 },
    size: { min: 5, max: 100 },
  },
  defaults: {
    quantity: 100,
    width: 15,
    height: 20,
  },
  company: {
    name: '주식회사 인프라이즈',
    brand: '쿠디솜 (Qudisom)',
    businessNumber: '150-81-03714',
    customerService: '1666-0211',
    email: 'support@qudisom.com',
    address: '인천광역시 남동구 서창남로 45, 3층',
    bankAccount: '기업은행 : 270-188626-04-011 (예금주: 주식회사 인프라이즈)',
  },
  quotationValidDays: 30,
} as const;

const getPlaceholder = (text: string, bgColor: string = 'e8e8e8') => 
  `https://via.placeholder.com/200x200/${bgColor}/666666?text=${encodeURIComponent(text)}`;

const DROPDOWN_OPTIONS: Record<OptionType, DropdownOption[]> = {
  fabric: [
    { 
      text: '크리스탈 벨벳', 
      price: 0, 
      image: 'https://images.unsplash.com/photo-1638006353284-eca071dd9238?w=400&h=400&fit=crop',
      description: '부드럽고 고급스러운 촉감의 크리스탈 벨벳 원단입니다. 광택이 있어 고급스러운 느낌을 주며, 내구성이 뛰어납니다.'
    },
    { 
      text: '스판덱스', 
      price: 500, 
      image: 'https://images.unsplash.com/photo-1640746760728-2eebb3133bb5?w=400&h=400&fit=crop',
      description: '신축성이 뛰어난 스판덱스 원단입니다. 탄력이 좋아 형태 유지가 잘 되며, 다양한 디자인에 적합합니다.'
    },
    { 
      text: '토끼털', 
      price: 1500, 
      image: 'https://images.unsplash.com/photo-1758201528252-0eb2b548b710?w=400&h=400&fit=crop',
      description: '포근하고 따뜻한 느낌의 토끼털 원단입니다. 겨울 시즌 인형에 특히 인기가 많으며, 프리미엄 제품에 추천합니다.'
    },
  ],
  label: [
    { 
      text: '나일론', 
      price: 0, 
      image: 'https://images.unsplash.com/photo-1680872442645-b3fa7fad5202?w=400&h=400&fit=crop',
      description: '가볍고 내구성이 좋은 나일론 라벨입니다. 세탁에 강하며 선명한 인쇄가 가능합니다.'
    },
    { 
      text: '화이트 공단', 
      price: 200, 
      image: 'https://images.unsplash.com/photo-1550512171-3d4489659ab4?w=400&h=400&fit=crop',
      description: '고급스러운 광택의 화이트 공단 라벨입니다. 부드러운 촉감과 함께 프리미엄 느낌을 줍니다.'
    },
    { 
      text: '블랙 공단', 
      price: 200, 
      image: 'https://images.unsplash.com/photo-1704775989365-eebfd4659a23?w=400&h=400&fit=crop',
      description: '세련된 블랙 공단 라벨입니다. 어두운 색상의 인형에 잘 어���리며 고급스러운 인상을 줍니다.'
    },
  ],
  tag: [
    { 
      text: '직사각형', 
      price: 0, 
      image: 'https://images.unsplash.com/photo-1651761580601-4a77e280c80f?w=400&h=400&fit=crop',
      description: '가장 기본적인 직사각형 행택입니다. 깔끔하고 정돈된 느낌을 주며 다양한 정보를 담을 수 있습니다.'
    },
    { 
      text: '원형', 
      price: 100, 
      image: 'https://images.unsplash.com/photo-1651761711341-cbc2d237661f?w=400&h=400&fit=crop',
      description: '부드러운 인상의 원형 행택입니다. 귀엽고 친근한 느낌을 주어 캐릭터 인형에 잘 어울립니다.'
    },
    { 
      text: '특수 모양', 
      price: 300, 
      image: 'https://images.unsplash.com/photo-1542272606-fe889704e0f6?w=400&h=400&fit=crop',
      description: '브랜드 로고나 캐릭터 모양으로 제작하는 커스텀 행택입니다. 별도 디자인 협의가 필요합니다.'
    },
  ],
  string: [
    { 
      text: '투명 끈', 
      price: 0, 
      image: 'https://images.unsplash.com/photo-1698299328107-e97b472aca68?w=400&h=400&fit=crop',
      description: '눈에 띄지 않는 투명 끈입니다. 행택이 주인공이 되어야 할 때 적합하며 깔끔한 마감을 제공합니다.'
    },
    { 
      text: '화살촉 끈', 
      price: 100, 
      image: 'https://images.unsplash.com/photo-1751603136938-b80e08ac47d7?w=400&h=400&fit=crop',
      description: '고급스러운 화살촉 끈입니다. 단단하게 고정되어 행택이 빠지지 않으며 프리미엄 느낌을 줍니다.'
    },
    { 
      text: '새틴 리본', 
      price: 200, 
      image: 'https://images.unsplash.com/photo-1733817372853-286f5af93ba1?w=400&h=400&fit=crop',
      description: '부드럽고 우아한 새틴 리본입니다. 선물용 제품이나 프리미엄 라인에 추천합니다.'
    },
  ],
  filling: [
    { 
      text: 'PP 솜', 
      price: 0, 
      image: 'https://images.unsplash.com/photo-1617519478819-9f578a5df62f?w=400&h=400&fit=crop',
      description: '가볍고 복원력이 좋은 PP 솜입니다. 가장 널리 사용되는 충전재로 가성비가 뛰어납니다.'
    },
    { 
      text: '마이크로화이버', 
      price: 800, 
      image: 'https://images.unsplash.com/photo-1761934658112-80095148fe87?w=400&h=400&fit=crop',
      description: '초극세사 마이크로화이버 솜입니다. 부드럽고 탄력이 뛰어나며 프리미엄 제품에 추천합니다.'
    },
    { 
      text: '메모리폼', 
      price: 1500, 
      image: 'https://images.unsplash.com/photo-1747494113438-5c87f8d5746b?w=400&h=400&fit=crop',
      description: '천천히 복원되는 메모리폼 충전재입니다. 독특한 촉감을 원하는 특별한 제품에 적합합니다.'
    },
  ],
  package: [
    { 
      text: '벌크 포장', 
      price: 0, 
      image: 'https://images.unsplash.com/photo-1604138290658-2bc80c707bbf?w=400&h=400&fit=crop',
      description: '별도 개별 포장 없이 박스에 담아 배송합니다. 대량 납품이나 직접 포장하실 경우 적합합니다.'
    },
    { 
      text: 'OPP 봉투', 
      price: 300, 
      image: 'https://images.unsplash.com/photo-1581515286364-d47e468ab4ce?w=400&h=400&fit=crop',
      description: '투명한 OPP 봉투에 개별 포장합니다. 먼지와 오염으로부터 제품을 보호하며 판매에 적합합니다.'
    },
    { 
      text: '선물 박스', 
      price: 800, 
      image: 'https://images.unsplash.com/photo-1759563876829-47c081a2afd9?w=400&h=400&fit=crop',
      description: '고급 선물 박스에 포장합니다. 프리미엄 선물용 제품이나 한정판에 추천합니다.'
    },
  ],
};

const KEYRING_OPTIONS: KeyringOption[] = [
  { 
    code: 'QU_01', 
    price: 500, 
    image: 'https://images.unsplash.com/photo-1588257192226-c43cc6a981aa?w=400&h=400&fit=crop',
    description: '심플한 원형 메탈 키링입니다. 가볍고 튼튼하며 가방이나 열쇠에 부착하기 좋습니다.'
  },
  { 
    code: 'QU_02', 
    price: 500, 
    image: 'https://images.unsplash.com/photo-1727154085760-134cc942246e?w=400&h=400&fit=crop',
    description: '하트 모양의 메탈 키링입니다. 귀여운 캐릭터 인형과 잘 어울리며 선물용으로 인기가 많습니다.'
  },
  { 
    code: 'QU_03', 
    price: 700, 
    image: 'https://images.unsplash.com/photo-1609942821011-bdfe750c8862?w=400&h=400&fit=crop',
    description: '별 모양의 프리미엄 키링입니다. 특별한 에디션이나 한정판 제품에 추천합니다.'
  },
];

const OPTION_LABELS: Record<OptionType | 'keyring', string> = {
  fabric: '원단',
  label: '라벨',
  tag: '행택',
  string: '택 끈',
  filling: '충전 솜',
  package: '패키지',
  keyring: '키링',
};

// ============================================
// 아이콘 컴포넌트
// ============================================
const Icons = {
  Calculator: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <line x1="8" y1="6" x2="16" y2="6"/>
      <line x1="8" y1="10" x2="8" y2="10.01"/>
      <line x1="12" y1="10" x2="12" y2="10.01"/>
      <line x1="16" y1="10" x2="16" y2="10.01"/>
      <line x1="8" y1="14" x2="8" y2="14.01"/>
      <line x1="12" y1="14" x2="12" y2="14.01"/>
      <line x1="16" y1="14" x2="16" y2="14.01"/>
      <line x1="8" y1="18" x2="8" y2="18.01"/>
      <line x1="12" y1="18" x2="16" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Copy: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  ),
  ZoomIn: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="11" y1="8" x2="11" y2="14"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  ),
};

// ============================================
// 가격 계산 훅
// ============================================
const usePriceCalculator = (
  selectedOptions: SelectedOptions,
  optionPrices: OptionPrice
): PriceResult => {
  return useMemo(() => {
    const { quantity, width, height } = selectedOptions;
    const sizeMultiplier = (width * height) / CONFIG.pricing.referenceArea;
    let basePrice = Math.round(CONFIG.pricing.basePrice * sizeMultiplier);
    
    for (const discount of CONFIG.quantityDiscounts) {
      if (quantity >= discount.minQuantity) {
        basePrice = Math.round(basePrice * discount.discountRate);
        break;
      }
    }
    
    const optionTotal = Object.values(optionPrices).reduce((sum, price) => sum + price, 0);
    const unitPrice = basePrice + optionTotal;
    const supplyPrice = unitPrice * quantity;
    const vatPrice = Math.round(supplyPrice * CONFIG.pricing.vatRate);
    const totalPrice = supplyPrice + vatPrice;
    
    return { unitPrice, supplyPrice, vatPrice, totalPrice };
  }, [selectedOptions, optionPrices]);
};

// ============================================
// 애니메이션 숫자 훅
// ============================================
const useAnimatedNumber = (value: number, duration: number = 200): number => {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  
  useEffect(() => {
    if (previousValue.current === value) return;
    const startValue = previousValue.current;
    const startTime = Date.now();
    const diff = value - startValue;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + diff * easeOut));
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    previousValue.current = value;
  }, [value, duration]);
  
  return displayValue;
};

// ============================================
// 스타일
// ============================================
const styles = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  :root {
    --primary: #1a2867;
    --primary-hover: #243278;
    --accent: #ffd93d;
    --text-primary: #111111;
    --text-secondary: #555555;
    --text-tertiary: #888888;
    --border: #e0e0e0;
    --border-light: #f0f0f0;
    --bg-subtle: #f7f7f7;
    --white: #ffffff;
    --success: #10b981;
    --radius: 10px;
    --radius-lg: 14px;
    --transition: 150ms ease;
  }

  .calculator * { margin: 0; padding: 0; box-sizing: border-box; }

  .calculator {
    font-family: 'Pretendard', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    line-height: 1.5;
  }

  /* 플로팅 버튼 */
  .fab {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 24px;
    background: var(--primary);
    color: var(--white);
    border: none;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
    box-shadow: 0 4px 20px rgba(26, 40, 103, 0.3);
    z-index: 1000;
  }

  .fab:hover {
    background: var(--primary-hover);
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 24px rgba(26, 40, 103, 0.35);
  }

  /* 오버레이 */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: all 0.25s ease;
    z-index: 9998;
  }
  .overlay.open { opacity: 1; visibility: visible; }

  /* 메인 모달 - 2단 레이아웃 */
  .modal {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    max-width: 960px;
    height: 100vh;
    background: var(--white);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
    z-index: 9999;
    display: flex;
    flex-direction: column;
  }
  .modal.open { transform: translateX(0); }

  /* 헤더 */
  .header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    background: var(--white);
  }

  .header h1 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .close-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: var(--text-tertiary);
    transition: all var(--transition);
  }
  .close-btn:hover {
    background: var(--bg-subtle);
    color: var(--text-primary);
  }

  /* 2단 레이아웃 컨테이너 */
  .modal-body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  /* 좌측: 옵션 선택 영역 */
  .options-panel {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    background: var(--bg-subtle);
  }

  /* 우측: 선택 요약 + 가격 */
  .summary-panel {
    width: 320px;
    background: var(--white);
    border-left: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .summary-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }

  .summary-section {
    margin-bottom: 20px;
  }

  .summary-section:last-child {
    margin-bottom: 0;
  }

  .summary-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--border-light);
  }

  .summary-item:last-child {
    border-bottom: none;
  }

  .summary-item-label {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .summary-item-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    text-align: right;
  }

  .summary-item-price {
    font-size: 12px;
    color: var(--primary);
    margin-left: 6px;
  }

  /* 가격 요약 (하단 고정) */
  .price-footer {
    padding: 20px;
    background: var(--white);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }

  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
  }

  .price-row .label {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .price-row .value {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .price-row.total {
    padding-top: 12px;
    margin-top: 8px;
    border-top: 1px dashed var(--border);
  }

  .price-row.total .label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .price-row.total .value {
    font-size: 22px;
    font-weight: 700;
    color: var(--primary);
  }

  /* 버튼 그룹 */
  .btn-group {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .btn {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .btn-primary {
    background: var(--primary);
    color: var(--white);
  }
  .btn-primary:hover { background: var(--primary-hover); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-secondary {
    background: var(--bg-subtle);
    color: var(--text-primary);
    border: 1px solid var(--border);
  }
  .btn-secondary:hover { background: var(--border-light); }

  /* 섹션 */
  .section {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: 20px;
    margin-bottom: 16px;
    border: 1px solid var(--border-light);
  }
  .section:last-child { margin-bottom: 0; }

  .section-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .section-title .required {
    color: #ef4444;
  }

  /* 입력 그룹 */
  .input-group {
    margin-bottom: 16px;
  }
  .input-group:last-child { margin-bottom: 0; }

  .input-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .input-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .input-value-group {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .input-field {
    width: 72px;
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    color: var(--text-primary);
    background: var(--white);
    transition: all var(--transition);
  }
  .input-field:focus {
    outline: none;
    border-color: var(--primary);
  }

  .input-unit {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .discount-badge {
    padding: 3px 8px;
    background: #dcfce7;
    color: #15803d;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
  }

  /* 슬라이더 */
  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--border);
    outline: none;
    margin: 8px 0;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }

  .slider-hints {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text-tertiary);
  }

  .input-hint {
    font-size: 11px;
    color: var(--text-tertiary);
    margin-top: 6px;
  }

  /* 사이즈 그리드 */
  .size-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* 옵션 그리드 - 항상 3열 */
  .option-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  /* 옵션 카드 */
  .option-card {
    position: relative;
    background: var(--white);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all var(--transition);
    overflow: hidden;
  }

  .option-card:hover {
    border-color: var(--text-tertiary);
  }

  .option-card:hover .option-zoom {
    opacity: 1;
  }

  .option-card.selected {
    border-color: var(--primary);
    background: var(--primary);
  }

  .option-card-image {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
    transition: opacity var(--transition);
  }

  .option-card.selected .option-card-image {
    opacity: 0.85;
  }

  .option-card-content {
    padding: 10px;
    text-align: center;
  }

  .option-card-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
    transition: color var(--transition);
  }

  .option-card.selected .option-card-name {
    color: var(--white);
  }

  .option-card-price {
    font-size: 11px;
    color: var(--text-tertiary);
    transition: color var(--transition);
  }

  .option-card.selected .option-card-price {
    color: rgba(255,255,255,0.8);
  }

  /* 선택 체크 */
  .option-check {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    background: var(--white);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    opacity: 0;
    transform: scale(0.8);
    transition: all var(--transition);
  }

  .option-card.selected .option-check {
    opacity: 1;
    transform: scale(1);
  }

  /* 확대 버튼 */
  .option-zoom {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 28px;
    height: 28px;
    background: rgba(0,0,0,0.6);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    opacity: 0;
    transition: all var(--transition);
    border: none;
    cursor: pointer;
  }

  .option-zoom:hover {
    background: rgba(0,0,0,0.8);
  }

  /* 이미지 상세 모달 */
  .image-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10002;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
  }

  .image-modal-overlay.open {
    opacity: 1;
    visibility: visible;
  }

  .image-modal {
    background: var(--white);
    border-radius: var(--radius-lg);
    max-width: 480px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    transform: scale(0.95);
    transition: transform 0.2s ease;
  }

  .image-modal-overlay.open .image-modal {
    transform: scale(1);
  }

  .image-modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .image-modal-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .image-modal-price {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary);
  }

  .image-modal-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-tertiary);
    transition: all var(--transition);
  }

  .image-modal-close:hover {
    background: var(--bg-subtle);
    color: var(--text-primary);
  }

  .image-modal-image {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
  }

  .image-modal-body {
    padding: 20px;
  }

  .image-modal-description {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  /* 스피너 */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: var(--white);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* 토스트 */
  .toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--text-primary);
    color: var(--white);
    padding: 12px 20px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 500;
    opacity: 0;
    visibility: hidden;
    transition: all 0.25s ease;
    z-index: 10003;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .toast.show {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
  .toast-icon { color: var(--success); }

  /* 반응형 */
  @media (max-width: 960px) {
    .modal { max-width: 100%; }
    .summary-panel { width: 280px; }
  }

  @media (max-width: 768px) {
    .modal-body { flex-direction: column; }
    .summary-panel { 
      width: 100%; 
      border-left: none;
      border-top: 1px solid var(--border-light);
      max-height: 40vh;
    }
    .options-panel { max-height: 60vh; }
    .option-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
  }

  @media (max-width: 480px) {
    .fab { 
      bottom: 16px;
      padding: 12px 20px;
      font-size: 14px;
    }
    .section { padding: 16px; }
    .option-grid { gap: 6px; }
    .option-card-content { padding: 8px; }
    .option-card-name { font-size: 11px; }
  }
`;

// ============================================
// 메인 컴포넌트
// ============================================
const QuoteCalculator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [imageModal, setImageModal] = useState<ImageModalData>({
    isOpen: false,
    image: '',
    title: '',
    description: '',
    price: 0,
  });

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    quantity: CONFIG.defaults.quantity,
    width: CONFIG.defaults.width,
    height: CONFIG.defaults.height,
    fabric: DROPDOWN_OPTIONS.fabric[0].text,
    label: DROPDOWN_OPTIONS.label[0].text,
    tag: DROPDOWN_OPTIONS.tag[0].text,
    string: DROPDOWN_OPTIONS.string[0].text,
    filling: DROPDOWN_OPTIONS.filling[0].text,
    package: DROPDOWN_OPTIONS.package[0].text,
    keyring: '',
  });

  const [optionPrices, setOptionPrices] = useState<OptionPrice>({
    fabric: 0, label: 0, tag: 0, string: 0, filling: 0, package: 0, keyring: 0,
  });

  const prices = usePriceCalculator(selectedOptions, optionPrices);
  const animatedTotal = useAnimatedNumber(prices.totalPrice);

  const discountRate = useMemo(() => {
    for (const d of CONFIG.quantityDiscounts) {
      if (selectedOptions.quantity >= d.minQuantity) {
        return Math.round((1 - d.discountRate) * 100);
      }
    }
    return 0;
  }, [selectedOptions.quantity]);

  const updateOption = useCallback(<K extends keyof SelectedOptions>(key: K, value: SelectedOptions[K]) => {
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleOptionSelect = useCallback((type: OptionType, option: DropdownOption) => {
    updateOption(type, option.text);
    setOptionPrices(prev => ({ ...prev, [type]: option.price }));
  }, [updateOption]);

  const handleKeyringToggle = useCallback((keyring: KeyringOption) => {
    const isSelected = selectedOptions.keyring === keyring.code;
    updateOption('keyring', isSelected ? '' : keyring.code);
    setOptionPrices(prev => ({ ...prev, keyring: isSelected ? 0 : keyring.price }));
  }, [selectedOptions.keyring, updateOption]);

  const openImageModal = useCallback((image: string, title: string, description: string, price: number) => {
    setImageModal({ isOpen: true, image, title, description, price });
  }, []);

  const closeImageModal = useCallback(() => {
    setImageModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const showToastMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  }, []);

  const handleCopy = useCallback(async () => {
    const text = `[쿠디솜 견적 요청]
━━━━━━━━━━━━━━━
수량: ${selectedOptions.quantity.toLocaleString()}개
사이즈: ${selectedOptions.width}×${selectedOptions.height}cm
원단: ${selectedOptions.fabric}
라벨: ${selectedOptions.label}
행택: ${selectedOptions.tag}
택 끈: ${selectedOptions.string}
충전솜: ${selectedOptions.filling}
패키지: ${selectedOptions.package}${selectedOptions.keyring ? `\n키링: ${selectedOptions.keyring}` : ''}
━━━━━━━━━━━━━━━
개별단가: ${prices.unitPrice.toLocaleString()}원
공급가액: ${prices.supplyPrice.toLocaleString()}원
부가세: ${prices.vatPrice.toLocaleString()}원
━━━━━━━━━━━━━━━
총 예상 금액: ${prices.totalPrice.toLocaleString()}원 (VAT 포함)`;

    try {
      await navigator.clipboard.writeText(text);
      showToastMessage('견적 내용이 복사되었습니다');
    } catch {
      showToastMessage('복사에 실패했습니다');
    }
  }, [selectedOptions, prices, showToastMessage]);

  const handleDownloadPDF = useCallback(() => {
    setIsLoading(true);
    
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToastMessage('팝업이 차단되었습니다');
      setIsLoading(false);
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>쿠디솜 견적서</title>
        <style>
          @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Pretendard', sans-serif; padding: 40px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #1a2867; }
          .logo { font-size: 24px; font-weight: 700; color: #1a2867; margin-bottom: 8px; }
          .title { font-size: 20px; color: #333; }
          .date { font-size: 13px; color: #666; margin-top: 10px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 14px; font-weight: 700; color: #1a2867; margin-bottom: 12px; padding-left: 10px; border-left: 3px solid #ffd93d; }
          .info-table { width: 100%; border-collapse: collapse; }
          .info-table td { padding: 10px 12px; border: 1px solid #e0e0e0; font-size: 13px; }
          .info-table .label { background: #f8f8f8; font-weight: 600; width: 100px; }
          .price-box { background: #f8f8f8; border-radius: 8px; padding: 16px; }
          .price-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
          .price-row.total { border-top: 1px solid #ddd; margin-top: 8px; padding-top: 12px; font-size: 18px; font-weight: 700; color: #1a2867; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center; }
          .bank-info { background: #fafafa; padding: 12px; border-radius: 6px; margin-top: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">QUDISOM</div>
            <div class="title">예상 견적서</div>
            <div class="date">견적일: ${dateStr} | 유효기간: ${CONFIG.quotationValidDays}일</div>
          </div>
          
          <div class="section">
            <div class="section-title">공급자 정보</div>
            <table class="info-table">
              <tr><td class="label">상호</td><td>${CONFIG.company.name}</td></tr>
              <tr><td class="label">브랜드</td><td>${CONFIG.company.brand}</td></tr>
              <tr><td class="label">사업자번호</td><td>${CONFIG.company.businessNumber}</td></tr>
              <tr><td class="label">연락처</td><td>${CONFIG.company.customerService}</td></tr>
              <tr><td class="label">이메일</td><td>${CONFIG.company.email}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">견적 상세</div>
            <table class="info-table">
              <tr><td class="label">수량</td><td>${selectedOptions.quantity.toLocaleString()}개</td></tr>
              <tr><td class="label">사이즈</td><td>${selectedOptions.width}cm × ${selectedOptions.height}cm</td></tr>
              <tr><td class="label">원단</td><td>${selectedOptions.fabric}</td></tr>
              <tr><td class="label">라벨</td><td>${selectedOptions.label}</td></tr>
              <tr><td class="label">행택</td><td>${selectedOptions.tag}</td></tr>
              <tr><td class="label">택 끈</td><td>${selectedOptions.string}</td></tr>
              <tr><td class="label">충전 솜</td><td>${selectedOptions.filling}</td></tr>
              <tr><td class="label">패키지</td><td>${selectedOptions.package}</td></tr>
              ${selectedOptions.keyring ? `<tr><td class="label">키링</td><td>${selectedOptions.keyring}</td></tr>` : ''}
            </table>
          </div>

          <div class="section">
            <div class="section-title">예상 금액</div>
            <div class="price-box">
              <div class="price-row"><span>개별 단가</span><span>${prices.unitPrice.toLocaleString()}원</span></div>
              <div class="price-row"><span>공급가액</span><span>${prices.supplyPrice.toLocaleString()}원</span></div>
              <div class="price-row"><span>부가세 (10%)</span><span>${prices.vatPrice.toLocaleString()}원</span></div>
              <div class="price-row total"><span>총 예상 금액</span><span>${prices.totalPrice.toLocaleString()}원</span></div>
            </div>
          </div>

          <div class="footer">
            <p>본 견적서는 예상 견적이며, 실제 샘플에 따라 최종 가격이 변경될 수 있습니다.</p>
            <div class="bank-info">
              <strong>입금계좌</strong><br>
              ${CONFIG.company.bankAccount}
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      setIsLoading(false);
      showToastMessage('PDF 저장 창이 열렸습니다');
    }, 500);
  }, [selectedOptions, prices, showToastMessage]);

  // 옵션 카드 렌더링 함수
  const renderOptionCard = useCallback((
    opt: DropdownOption | KeyringOption,
    isSelected: boolean,
    onSelect: () => void,
    name: string
  ) => (
    <div
      key={name}
      className={`option-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <button
        className="option-zoom"
        onClick={(e) => {
          e.stopPropagation();
          openImageModal(
            opt.image,
            'code' in opt ? opt.code : opt.text,
            opt.description,
            opt.price
          );
        }}
      >
        <Icons.ZoomIn />
      </button>
      <div className="option-check"><Icons.Check /></div>
      <img src={opt.image} alt={name} className="option-card-image" />
      <div className="option-card-content">
        <div className="option-card-name">{name}</div>
        <div className="option-card-price">
          {opt.price > 0 ? `+${opt.price.toLocaleString()}원` : '기본'}
        </div>
      </div>
    </div>
  ), [openImageModal]);

  return (
    <div className="calculator">
      <style>{styles}</style>

      {/* 플로팅 버튼 */}
      <button className="fab" onClick={() => setIsOpen(true)}>
        <Icons.Calculator />
        <span>견적 계산하기</span>
      </button>

      {/* 오버레이 */}
      <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />

      {/* 메인 모달 */}
      <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="header">
          <h1>견적 계���기</h1>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <Icons.Close />
          </button>
        </div>

        <div className="modal-body">
          {/* 좌측: 옵션 선택 */}
          <div className="options-panel">
            {/* 기본 정보 */}
            <div className="section">
              <div className="section-title">기본 정보 <span className="required">*</span></div>
              
              <div className="input-group">
                <div className="input-header">
                  <span className="input-label">수량</span>
                  <div className="input-value-group">
                    <input
                      type="number"
                      className="input-field"
                      value={selectedOptions.quantity}
                      min={CONFIG.limits.quantity.min}
                      max={CONFIG.limits.quantity.max}
                      onChange={(e) => {
                        const val = Math.max(
                          CONFIG.limits.quantity.min,
                          Math.min(CONFIG.limits.quantity.max, parseInt(e.target.value) || CONFIG.limits.quantity.min)
                        );
                        updateOption('quantity', val);
                      }}
                    />
                    <span className="input-unit">개</span>
                    {discountRate > 0 && <span className="discount-badge">{discountRate}% 할인</span>}
                  </div>
                </div>
                <input
                  type="range"
                  className="slider"
                  value={selectedOptions.quantity}
                  min={CONFIG.limits.quantity.min}
                  max={CONFIG.limits.quantity.max}
                  step={100}
                  onChange={(e) => updateOption('quantity', parseInt(e.target.value))}
                />
                <div className="slider-hints">
                  <span>100개</span>
                  <span>10,000개</span>
                </div>
                <p className="input-hint">10,000개 이상은 별도 상담이 필요합니다.</p>
              </div>

              <div className="size-row">
                <div className="input-group">
                  <div className="input-header">
                    <span className="input-label">가로</span>
                    <div className="input-value-group">
                      <input
                        type="number"
                        className="input-field"
                        value={selectedOptions.width}
                        min={CONFIG.limits.size.min}
                        max={CONFIG.limits.size.max}
                        onChange={(e) => {
                          const val = Math.max(CONFIG.limits.size.min, Math.min(CONFIG.limits.size.max, parseInt(e.target.value) || CONFIG.limits.size.min));
                          updateOption('width', val);
                        }}
                      />
                      <span className="input-unit">cm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    className="slider"
                    value={selectedOptions.width}
                    min={CONFIG.limits.size.min}
                    max={CONFIG.limits.size.max}
                    onChange={(e) => updateOption('width', parseInt(e.target.value))}
                  />
                </div>

                <div className="input-group">
                  <div className="input-header">
                    <span className="input-label">세로</span>
                    <div className="input-value-group">
                      <input
                        type="number"
                        className="input-field"
                        value={selectedOptions.height}
                        min={CONFIG.limits.size.min}
                        max={CONFIG.limits.size.max}
                        onChange={(e) => {
                          const val = Math.max(CONFIG.limits.size.min, Math.min(CONFIG.limits.size.max, parseInt(e.target.value) || CONFIG.limits.size.min));
                          updateOption('height', val);
                        }}
                      />
                      <span className="input-unit">cm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    className="slider"
                    value={selectedOptions.height}
                    min={CONFIG.limits.size.min}
                    max={CONFIG.limits.size.max}
                    onChange={(e) => updateOption('height', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* 원단 */}
            <div className="section">
              <div className="section-title">원단</div>
              <div className="option-grid">
                {DROPDOWN_OPTIONS.fabric.map((opt) => 
                  renderOptionCard(opt, selectedOptions.fabric === opt.text, () => handleOptionSelect('fabric', opt), opt.text)
                )}
              </div>
            </div>

            {/* 충전 솜 */}
            <div className="section">
              <div className="section-title">충전 솜</div>
              <div className="option-grid">
                {DROPDOWN_OPTIONS.filling.map((opt) => 
                  renderOptionCard(opt, selectedOptions.filling === opt.text, () => handleOptionSelect('filling', opt), opt.text)
                )}
              </div>
            </div>

            {/* 라벨 */}
            <div className="section">
              <div className="section-title">라벨</div>
              <div className="option-grid">
                {DROPDOWN_OPTIONS.label.map((opt) => 
                  renderOptionCard(opt, selectedOptions.label === opt.text, () => handleOptionSelect('label', opt), opt.text)
                )}
              </div>
            </div>

            {/* 행택 */}
            <div className="section">
              <div className="section-title">행택</div>
              <div className="option-grid">
                {DROPDOWN_OPTIONS.tag.map((opt) => 
                  renderOptionCard(opt, selectedOptions.tag === opt.text, () => handleOptionSelect('tag', opt), opt.text)
                )}
              </div>
            </div>

            {/* 택 끈 */}
            <div className="section">
              <div className="section-title">택 끈</div>
              <div className="option-grid">
                {DROPDOWN_OPTIONS.string.map((opt) => 
                  renderOptionCard(opt, selectedOptions.string === opt.text, () => handleOptionSelect('string', opt), opt.text)
                )}
              </div>
            </div>

            {/* 패키지 */}
            <div className="section">
              <div className="section-title">패키지</div>
              <div className="option-grid">
                {DROPDOWN_OPTIONS.package.map((opt) => 
                  renderOptionCard(opt, selectedOptions.package === opt.text, () => handleOptionSelect('package', opt), opt.text)
                )}
              </div>
            </div>

            {/* 키링 */}
            <div className="section">
              <div className="section-title">키링 (선택)</div>
              <div className="option-grid">
                {KEYRING_OPTIONS.map((k) => 
                  renderOptionCard(k, selectedOptions.keyring === k.code, () => handleKeyringToggle(k), k.code)
                )}
              </div>
            </div>
          </div>

          {/* 우측: 요약 패널 */}
          <div className="summary-panel">
            <div className="summary-content">
              <div className="summary-section">
                <div className="summary-title">선택된 옵션</div>
                
                <div className="summary-item">
                  <span className="summary-item-label">수량</span>
                  <span className="summary-item-value">{selectedOptions.quantity.toLocaleString()}개</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">사이즈</span>
                  <span className="summary-item-value">{selectedOptions.width} × {selectedOptions.height}cm</span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">원단</span>
                  <span className="summary-item-value">
                    {selectedOptions.fabric}
                    {optionPrices.fabric > 0 && <span className="summary-item-price">+{optionPrices.fabric.toLocaleString()}원</span>}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">충전 솜</span>
                  <span className="summary-item-value">
                    {selectedOptions.filling}
                    {optionPrices.filling > 0 && <span className="summary-item-price">+{optionPrices.filling.toLocaleString()}원</span>}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">라벨</span>
                  <span className="summary-item-value">
                    {selectedOptions.label}
                    {optionPrices.label > 0 && <span className="summary-item-price">+{optionPrices.label.toLocaleString()}원</span>}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">행택</span>
                  <span className="summary-item-value">
                    {selectedOptions.tag}
                    {optionPrices.tag > 0 && <span className="summary-item-price">+{optionPrices.tag.toLocaleString()}원</span>}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">택 끈</span>
                  <span className="summary-item-value">
                    {selectedOptions.string}
                    {optionPrices.string > 0 && <span className="summary-item-price">+{optionPrices.string.toLocaleString()}원</span>}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-item-label">패키지</span>
                  <span className="summary-item-value">
                    {selectedOptions.package}
                    {optionPrices.package > 0 && <span className="summary-item-price">+{optionPrices.package.toLocaleString()}원</span>}
                  </span>
                </div>
                {selectedOptions.keyring && (
                  <div className="summary-item">
                    <span className="summary-item-label">키링</span>
                    <span className="summary-item-value">
                      {selectedOptions.keyring}
                      <span className="summary-item-price">+{optionPrices.keyring.toLocaleString()}원</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 가격 하단 고정 */}
            <div className="price-footer">
              <div className="price-row">
                <span className="label">개별 단가</span>
                <span className="value">{prices.unitPrice.toLocaleString()}원</span>
              </div>
              <div className="price-row">
                <span className="label">공급가액</span>
                <span className="value">{prices.supplyPrice.toLocaleString()}원</span>
              </div>
              <div className="price-row">
                <span className="label">부가세 (10%)</span>
                <span className="value">{prices.vatPrice.toLocaleString()}원</span>
              </div>
              <div className="price-row total">
                <span className="label">총 예상 금액</span>
                <span className="value">{animatedTotal.toLocaleString()}원</span>
              </div>

              <div className="btn-group">
                <button className="btn btn-secondary" onClick={handleCopy}>
                  <Icons.Copy />
                  <span>복사</span>
                </button>
                <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={isLoading}>
                  {isLoading ? <div className="spinner" /> : <Icons.Download />}
                  <span>{isLoading ? '생성 중' : 'PDF 저장'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 상세 모달 */}
      <div 
        className={`image-modal-overlay ${imageModal.isOpen ? 'open' : ''}`}
        onClick={closeImageModal}
      >
        <div className="image-modal" onClick={(e) => e.stopPropagation()}>
          <div className="image-modal-header">
            <div>
              <div className="image-modal-title">{imageModal.title}</div>
              <div className="image-modal-price">
                {imageModal.price > 0 ? `+${imageModal.price.toLocaleString()}원` : '기본 옵션'}
              </div>
            </div>
            <button className="image-modal-close" onClick={closeImageModal}>
              <Icons.Close />
            </button>
          </div>
          <img src={imageModal.image} alt={imageModal.title} className="image-modal-image" />
          <div className="image-modal-body">
            <p className="image-modal-description">{imageModal.description}</p>
          </div>
        </div>
      </div>

      {/* 토스트 */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        <span className="toast-icon"><Icons.Check /></span>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

export default QuoteCalculator;