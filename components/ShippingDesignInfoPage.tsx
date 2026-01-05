import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Plus,
  Trash2,
  Send,
  CheckCircle,
  X,
  File,
  Truck,
  MapPin,
  Package,
  Download,
  Upload,
  AlertCircle,
  Clock,
  Building2,
  Settings,
  Search,
  ArrowRight,
  Check,
  User,
  Phone,
  FileText,
  Info,
  Calendar,
  Box,
  Weight,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Hash,
  Minus,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import { BulkShippingTable } from './BulkShippingTable';
import { OrderProgressBar } from './OrderProgressBar';

// ========== 타입 정의 ==========
type DeliveryStatus = 'yes' | 'no' | 'previous' | null;
type DeliveryMethod = 'quick' | 'courier';

// 견적서 상품 인터페이스 (Quote Product Interface - Quote.tsx QuoteItem 구조 반영)
interface QuoteProduct {
  id: string;
  productCode: string;
  productName: string;
  imageUrls: string[];
  options: {
    material?: string;
    size?: string;
    color?: string;
  };
  quantity: number;
  unitPrice: number;
  discount: number;
  salePrice: number;
  vat: number;
  productionDays: string;
  type: 'main' | 'sample';
}

interface PackagingInfo {
  id: string;
  productName: string; // 상품명 (Product Name)
  quantity: number;
  option: string;
  width: string; // 가로 (Width)
  height: string; // 세로 (Height)
  depth: string; // 높이 (Depth)
  boxWeight: string;
  boxCount: number;
  itemsPerBox: number;
  additionalRequest: string; // 기타 요청 사항 (Additional requests)
  photos: File[];
  selectedQuoteProductId?: string; // 선택된 견적서 상품 ID (Selected quote product ID)
}

interface ShippingAddress {
  id: string;
  deliveryMethod: DeliveryMethod;
  recipientName: string;
  recipientPhone: string;
  address: string;
  zipCode: string;
  memo: string;
  courierCompany: string;
  trackingNumber: string;
  availableTime?: string;
  unloadingPossible?: 'possible' | 'impossible';
  elevator?: 'yes' | 'no' | 'first-floor';
  forklift?: 'yes' | 'no';
  quickRequest?: string;
  deliveryName?: string;
  deliveryAddress?: string;
  courierRequest?: string;
  desiredDeliveryDate?: string; // 희망 수령 날짜 (Desired delivery date for quick delivery)
  selectedPackagings?: Array<{ packagingId: string; quantity: number }>; // 선택된 패키징 및 수량 (Selected packagings with quantities)
}

interface ShippingDesignInfoPageProps {
  onBack: () => void;
}

// ========== 상수 ==========
const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const start = `${String(i).padStart(2, '0')}:00`;
  const end = `${String(i + 1).padStart(2, '0')}:00`;
  return { value: `${start} ~ ${end}`, label: `${start} ~ ${end}` };
});

const ELEVATOR_OPTIONS = [
  { value: '', label: '선택하세요' },
  { value: 'yes', label: '있음' },
  { value: 'no', label: '없음' },
  { value: 'first-floor', label: '1층' }
];

const FORKLIFT_OPTIONS = [
  { value: '', label: '선택하세요' },
  { value: 'yes', label: '있음' },
  { value: 'no', label: '없음' }
];

const UNLOADING_OPTIONS = [
  { value: '', label: '선택하세요' },
  { value: 'possible', label: '가능' },
  { value: 'impossible', label: '불가' }
];

const PREVIOUS_SHIPPING_INFO: ShippingAddress = {
  id: 'prev-1',
  deliveryMethod: 'courier',
  recipientName: '김철수',
  selectedPackagings: [],
  recipientPhone: '010-1234-5678',
  address: '서울시 강남구 테헤란로 123',
  zipCode: '06234',
  memo: '문 앞에 놓아주세요',
  courierCompany: 'CJ대한통운',
  trackingNumber: '',
  deliveryName: '본사',
  deliveryAddress: '서울시 강남구 테헤란로 123',
  courierRequest: '문 앞 배송'
};

const createEmptyAddress = (): ShippingAddress => ({
  id: Date.now().toString(),
  deliveryMethod: 'courier',
  recipientName: '',
  recipientPhone: '',
  address: '',
  zipCode: '',
  memo: '',
  courierCompany: '',
  trackingNumber: '',
  deliveryName: '',
  deliveryAddress: '',
  courierRequest: '',
  selectedPackagings: []
});

const createEmptyPackaging = (): PackagingInfo => ({
  id: Date.now().toString() + Math.random(),
  productName: '',
  quantity: 0,
  option: '',
  width: '',
  height: '',
  depth: '',
  boxWeight: '',
  boxCount: 0,
  itemsPerBox: 0,
  additionalRequest: '',
  photos: []
});

// 견적서 실제 데이터 (Quote Data - Quote.tsx 데이터 반영)
const MOCK_QUOTE_PRODUCTS: QuoteProduct[] = [
  {
    id: '1',
    productCode: '인형 키링',
    productName: '커스텀 인형',
    imageUrls: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1587132117816-fb94010a3865?w=200&h=200&fit=crop'
    ],
    options: { material: '면 100%', size: '30cm', color: '베이지' },
    quantity: 500,
    unitPrice: 15000,
    discount: 5000,
    salePrice: 7500000,
    vat: 750000,
    productionDays: '15-20일',
    type: 'main'
  },
  {
    id: '2',
    productCode: '봉제 인형',
    productName: '개구리 인형',
    imageUrls: [
      'https://images.unsplash.com/photo-1566935037221-481ea46c8e28?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200&h=200&fit=crop'
    ],
    options: { material: '폴리에스터', size: '25cm', color: '화이트' },
    quantity: 300,
    unitPrice: 12000,
    discount: 3000,
    salePrice: 3600000,
    vat: 360000,
    productionDays: '12-18일',
    type: 'main'
  },
  {
    id: '3',
    productCode: '봉제 인형',
    productName: '곰돌이 인형',
    imageUrls: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=200&h=200&fit=crop'
    ],
    options: { material: '면 100%', size: '30cm', color: '베이지' },
    quantity: 2,
    unitPrice: 20000,
    discount: 0,
    salePrice: 40000,
    vat: 4000,
    productionDays: '7-10일',
    type: 'sample'
  }
];

// ========== 유틸리티 ==========
const cn = (...classes: (string | boolean | undefined | null)[]) => 
  classes.filter(Boolean).join(' ');

// 숫자에 쉼표 포맷 추가 (Add comma formatting to numbers)
const formatNumber = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString('ko-KR');
};

// 쉼표 제거하고 숫자만 추출 (Remove commas and extract only numbers)
const parseFormattedNumber = (value: string): number => {
  const cleaned = value.replace(/,/g, '');
  const num = parseInt(cleaned);
  return isNaN(num) ? 0 : num;
};

// ========== UI 컴포넌트 ==========
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  leftIcon, 
  rightIcon, 
  children, 
  className, 
  disabled,
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90 shadow-lg shadow-[#1a2867]/20',
    outline: 'border-2 border-gray-200 bg-white text-gray-700 hover:border-[#1a2867]/50 hover:bg-gray-50',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    dark: 'bg-gray-900 text-white hover:bg-gray-800'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base font-semibold'
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </motion.button>
  );
};

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  leftIcon?: React.ReactNode;
  hint?: string;
  error?: string;
  suffix?: React.ReactNode;
}

const Input = ({ 
  label, 
  leftIcon, 
  hint,
  error,
  suffix,
  className, 
  required,
  value,
  onChange,
  ...props 
}: InputProps) => (
  <div className="space-y-1.5">
    {label && (
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {leftIcon && <span className="text-gray-400">{leftIcon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
    <div className="flex gap-3">
      <input
        className={cn(
          'w-full rounded-xl border bg-white text-gray-900 placeholder:text-gray-400',
          'py-2.5 px-3.5 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
          'hover:border-gray-300',
          'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
          'read-only:bg-gray-50 read-only:cursor-default read-only:text-gray-900',
          error ? 'border-red-400' : 'border-gray-200',
          className
        )}
        value={value}
        onChange={onChange}
        {...props}
      />
      {suffix}
    </div>
    {error && (
      <p className="flex items-center gap-1.5 text-sm text-red-500">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>
    )}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  hint?: string;
  options: { value: string; label: string }[];
}

const Select = ({ label, leftIcon, hint, options, className, required, ...props }: SelectProps) => (
  <div className="space-y-1.5">
    {label && (
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {leftIcon && <span className="text-gray-400">{leftIcon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      className={cn(
        'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
        'py-2.5 px-3.5 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
        'hover:border-gray-300',
        className
      )}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = ({ label, className, ...props }: TextareaProps) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <textarea
      className={cn(
        'w-full rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400',
        'py-3.5 px-4 transition-all duration-200 resize-none',
        'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
        'hover:border-gray-300',
        className
      )}
      {...props}
    />
  </div>
);

interface AlertBoxProps {
  type?: 'info' | 'warning' | 'success';
  title?: string;
  children: React.ReactNode;
}

const AlertBox = ({ type = 'info', title, children }: AlertBoxProps) => {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700',
      titleText: 'text-blue-900',
      icon: <Info className="w-5 h-5 flex-shrink-0 text-blue-500" />
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-700',
      titleText: 'text-amber-900',
      icon: <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-700',
      titleText: 'text-emerald-900',
      icon: <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500" />
    }
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-3 p-4 rounded-xl border', styles.bg, styles.border)}
    >
      {styles.icon}
      <div className="text-sm">
        {title && <p className={cn('font-semibold mb-1', styles.titleText)}>{title}</p>}
        <div className={styles.text}>{children}</div>
      </div>
    </motion.div>
  );
};

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const SectionHeader = ({ icon, title, subtitle, action }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    {action}
  </div>
);

interface SelectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
}

const SelectionCard = ({ icon, title, subtitle, selected, onClick }: SelectionCardProps) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      'relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left',
      selected
        ? 'border-[#1a2867] bg-[#1a2867]/5 shadow-lg shadow-[#1a2867]/10'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
    )}
  >
    <span className={cn('transition-colors flex-shrink-0', selected ? 'text-[#1a2867]' : 'text-gray-400')}>
      {icon}
    </span>
    <div className="flex-1 min-w-0">
      <div className={cn('text-sm font-medium', selected ? 'text-gray-900' : 'text-gray-600')}>
        {title}
      </div>
      {subtitle && (
        <div className={cn('text-xs mt-0.5', selected ? 'text-red-500' : 'text-gray-400')}>
          {subtitle}
        </div>
      )}
    </div>
    <AnimatePresence>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-[#1a2867] rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

// ========== 상품 선택 모달 컴포넌트 (Product Selection Modal Component) ==========
interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedProducts: QuoteProduct[]) => void;
  products: QuoteProduct[];
  usedProductIds?: string[]; // 이미 다른 패키징에서 사용 중인 상품 ID 목록 (Product IDs already used in other packagings)
}

const ProductSelectionModal = ({ isOpen, onClose, onConfirm, products, usedProductIds = [] }: ProductSelectionModalProps) => {
  const [selectedProducts, setSelectedProducts] = useState<QuoteProduct[]>([]);
  const [tempQuantities, setTempQuantities] = useState<{[key: string]: number}>({});
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [currentImageProduct, setCurrentImageProduct] = useState<QuoteProduct | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 모달 열릴 때 초기화 (Initialize when modal opens)
  React.useEffect(() => {
    if (isOpen) {
      setSelectedProducts([]);
      const initialQuantities: {[key: string]: number} = {};
      products.forEach(p => {
        initialQuantities[p.id] = p.quantity;
      });
      setTempQuantities(initialQuantities);
      setImageViewerOpen(false);
      setCurrentImageProduct(null);
      setCurrentImageIndex(0);
    }
  }, [isOpen, products]);

  const toggleProductSelection = (product: QuoteProduct) => {
    const isSelected = selectedProducts.find(p => p.id === product.id);
    
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      // 이미 1개가 선택되어 있으면 경고 (Warn if already 1 product selected)
      if (selectedProducts.length >= 1) {
        alert('한 패키징에는 하나의 상품만 선택할 수 있습니다.');
        return;
      }
      setSelectedProducts([product]);
    }
  };

  const updateTempQuantity = (productId: string, quantity: number) => {
    // 원본 상품 데이터에서 최대 수량 가져오기 (Get max quantity from original product data)
    const originalProduct = products.find(p => p.id === productId);
    if (!originalProduct) return;
    
    const maxQuantity = originalProduct.quantity;
    
    // 최대값 초과 시 경고 및 제한 (Warn and limit if exceeds max quantity)
    if (quantity > maxQuantity) {
      alert(`수량은 견적서의 원래 수량(${formatNumber(maxQuantity)}개)을 초과할 수 없습니다.`);
      quantity = maxQuantity;
    }
    
    // 최소값 제한 (Limit to minimum 0)
    quantity = Math.max(0, quantity);
    
    setTempQuantities({
      ...tempQuantities,
      [productId]: quantity
    });
  };

  const handleConfirm = () => {
    if (selectedProducts.length === 0) {
      alert('상품을 선택해주세요.');
      return;
    }

    // 선택된 상품에 수정된 수량 반영 (Apply modified quantities to selected products)
    const productsWithUpdatedQuantity = selectedProducts.map(p => ({
      ...p,
      quantity: tempQuantities[p.id] || p.quantity
    }));
    
    onConfirm(productsWithUpdatedQuantity);
    onClose();
  };

  // 이미지 뷰어 열기 (Open image viewer)
  const openImageViewer = (product: QuoteProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageProduct(product);
    setCurrentImageIndex(0);
    setImageViewerOpen(true);
  };

  // 이미지 뷰어 닫기 (Close image viewer)
  const closeImageViewer = () => {
    setImageViewerOpen(false);
    setCurrentImageProduct(null);
    setCurrentImageIndex(0);
  };

  // 다음 이미지 (Next image)
  const nextImage = () => {
    if (currentImageProduct && currentImageIndex < currentImageProduct.imageUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // 이전 이미지 (Previous image)
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* 모달 헤더 (Modal Header) */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#1a2867]/5 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-gray-900">견적서에서 상품 선택</h2>
            <p className="text-sm text-gray-500 mt-1">한 패키징에는 하나의 상품만 선택할 수 있습니다</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 상품 목록 (Product List) */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-4">
            {products.map((product) => {
              const isSelected = selectedProducts.find(p => p.id === product.id);
              const isUsed = usedProductIds.includes(product.id); // 다른 패키징에서 이미 사용 중인지 확인 (Check if already used in other packaging)
              const isDisabled = isUsed;
              
              return (
                <motion.div
                  key={product.id}
                  whileHover={!isDisabled ? { scale: 1.01 } : {}}
                  className={cn(
                    'relative border-2 rounded-xl p-4 transition-all',
                    isDisabled
                      ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#1a2867] bg-[#1a2867]/5 shadow-lg cursor-pointer'
                      : 'border-gray-200 hover:border-gray-300 bg-white cursor-pointer'
                  )}
                  onClick={() => !isDisabled && toggleProductSelection(product)}
                >
                  <div className="flex gap-4">
                    {/* 체크박스 (Checkbox) */}
                    <div className="flex-shrink-0 pt-1">
                      <div className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                        isSelected
                          ? 'bg-[#1a2867] border-[#1a2867]'
                          : 'border-gray-300 bg-white'
                      )}>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>

                    {/* 상품 이미지 (Product Image) */}
                    <div 
                      className="flex-shrink-0 relative group cursor-zoom-in"
                      onClick={(e) => openImageViewer(product, e)}
                    >
                      <img
                        src={product.imageUrls[0]}
                        alt={product.productName}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200 transition-all group-hover:brightness-75"
                      />
                      {/* 돋보기 아이콘 오버레이 (Magnifying glass icon overlay) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 rounded-full p-2 shadow-lg">
                          <ZoomIn className="w-5 h-5 text-[#1a2867]" />
                        </div>
                      </div>
                      {/* 이미지 개수 표시 (Image count badge) */}
                      {product.imageUrls.length > 1 && (
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          +{product.imageUrls.length - 1}
                        </div>
                      )}
                    </div>

                    {/* 상품 정보 (Product Info) */}
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{product.productName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {product.productCode} | {product.type === 'main' ? '본 주문' : '샘플'}
                        </p>
                      </div>
                      
                      {/* 옵션 정보 (Options) */}
                      <div className="flex flex-wrap gap-2">
                        {product.options.material && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                            <span className="font-medium mr-1">원단:</span> {product.options.material}
                          </span>
                        )}
                        {product.options.size && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                            <span className="font-medium mr-1">사이즈:</span> {product.options.size}
                          </span>
                        )}
                        {product.options.color && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                            <span className="font-medium mr-1">색상:</span> {product.options.color}
                          </span>
                        )}
                      </div>
                      
                      {/* 수량 조절 with 상/하 버튼 (Quantity Control with Up/Down Buttons) */}
                      <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">수량:</label>
                          <div className="flex items-center gap-1">
                            <div className="flex flex-col">
                              <button
                                type="button"
                                onClick={() => updateTempQuantity(product.id, (tempQuantities[product.id] || product.quantity) + 100)}
                                className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                              >
                                <ChevronUp className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                              <button
                                type="button"
                                onClick={() => updateTempQuantity(product.id, (tempQuantities[product.id] || product.quantity) - 100)}
                                className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                              >
                                <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={formatNumber(tempQuantities[product.id] || product.quantity)}
                              onChange={(e) => updateTempQuantity(product.id, parseFormattedNumber(e.target.value))}
                              className="w-28 px-3 py-1.5 text-right border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]"
                            />
                            <span className="text-sm text-gray-600">개</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 ml-12">
                          최대: {formatNumber(product.quantity)}개
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 사용 불가 메시지 (Product already used message) */}
                  {isUsed && (
                    <div className="mt-3 flex items-center gap-2 p-2 bg-gray-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <p className="text-xs text-gray-700">
                        다른 패키징에서 이미 선택되어 수량이 모두 소진되었습니다.
                      </p>
                    </div>
                  )}

                  {/* 선택 표시 (Selected Indicator) */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-[#1a2867] rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 모달 푸터 (Modal Footer) */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600">
            {selectedProducts.length > 0 ? (
              <span className="font-medium text-[#1a2867]">
                {selectedProducts.length}개 선택됨
              </span>
            ) : (
              '상품을 선택해주세요'
            )}
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              취소
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              확인
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 이미지 뷰어 모달 (Image Viewer Modal) */}
      <AnimatePresence>
        {imageViewerOpen && currentImageProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeImageViewer}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 (Close button) */}
              <button
                onClick={closeImageViewer}
                className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-lg transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* 이미지 표시 (Image display) */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={currentImageProduct.imageUrls[currentImageIndex]}
                  alt={`${currentImageProduct.productName} - ${currentImageIndex + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />

                {/* 이미지 네비게이션 (Image navigation) */}
                {currentImageProduct.imageUrls.length > 1 && (
                  <>
                    {/* 이전 버튼 (Previous button) */}
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      className={cn(
                        'absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all',
                        currentImageIndex === 0 && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>

                    {/* 다음 버튼 (Next button) */}
                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === currentImageProduct.imageUrls.length - 1}
                      className={cn(
                        'absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all',
                        currentImageIndex === currentImageProduct.imageUrls.length - 1 && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <ChevronRight className="w-6 h-6 text-gray-900" />
                    </button>

                    {/* 이미지 인디케이터 (Image indicator) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                      {currentImageIndex + 1} / {currentImageProduct.imageUrls.length}
                    </div>
                  </>
                )}
              </div>

              {/* 상품 정보 (Product info) */}
              <div className="mt-4 text-center text-white">
                <h3 className="font-bold">{currentImageProduct.productName}</h3>
                <p className="text-sm text-gray-300 mt-1">{currentImageProduct.productCode}</p>
              </div>

              {/* 썸네일 갤러리 (Thumbnail gallery) */}
              {currentImageProduct.imageUrls.length > 1 && (
                <div className="mt-4 flex gap-2 justify-center overflow-x-auto pb-2">
                  {currentImageProduct.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                        index === currentImageIndex
                          ? 'border-[#fab803] shadow-lg scale-110'
                          : 'border-white/30 hover:border-white/60'
                      )}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ========== 배송지 폼 컴포넌트 ==========
interface ShippingFormProps {
  address: ShippingAddress;
  onUpdate: (field: keyof ShippingAddress, value: string | number | Array<{ packagingId: string; quantity: number }>) => void;
  showDelete?: boolean;
  onDelete?: () => void;
  index?: number;
  isSingleAddress?: boolean; // 단일 배송지 여부 (Single address mode flag)
  packagingInfos?: PackagingInfo[]; // 패키징 정보 목록 (Packaging info list)
  allShippingAddresses?: ShippingAddress[]; // 모든 배송지 목록 (All shipping addresses for duplicate prevention)
}

const QuickDeliveryForm = ({ address, onUpdate }: { address: ShippingAddress; onUpdate: (field: keyof ShippingAddress, value: string | number) => void }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className="p-6 bg-white border border-gray-100 rounded-xl space-y-5"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Input
        label="수령인"
        leftIcon={<User className="w-4 h-4" />}
        required
        value={address.recipientName}
        onChange={(e) => onUpdate('recipientName', e.target.value)}
        placeholder="이름"
      />
      <Input
        label="연락처"
        leftIcon={<Phone className="w-4 h-4" />}
        required
        type="tel"
        value={address.recipientPhone}
        onChange={(e) => onUpdate('recipientPhone', e.target.value)}
        placeholder="010-0000-0000"
      />
    </div>

    <Input
      label="배송지 주소"
      leftIcon={<MapPin className="w-4 h-4" />}
      required
      value={address.address}
      onChange={(e) => onUpdate('address', e.target.value)}
      placeholder="주소를 입력하세요"
      readOnly
      suffix={
        <Button variant="dark" leftIcon={<Search className="w-4 h-4" />}>
          주소 검색
        </Button>
      }
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Input
        label="희망 수령 날짜"
        leftIcon={<Calendar className="w-4 h-4" />}
        type="date"
        value={address.desiredDeliveryDate || ''}
        onChange={(e) => onUpdate('desiredDeliveryDate', e.target.value)}
      />
      <Select
        label="수령 가능 시간"
        value={address.availableTime || ''}
        onChange={(e) => onUpdate('availableTime', e.target.value)}
        options={[{ value: '', label: '선택하세요' }, ...TIME_OPTIONS]}
        hint="* 기사님과 교통 상황에 따라 100% 원하는 시간에 도착하지 못할 수 있습니다."
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Select
        label="하차 작업 가능 여부"
        value={address.unloadingPossible || ''}
        onChange={(e) => onUpdate('unloadingPossible', e.target.value)}
        options={UNLOADING_OPTIONS}
      />
      <Select
        label="엘리베이터 유무"
        value={address.elevator || ''}
        onChange={(e) => onUpdate('elevator', e.target.value)}
        options={ELEVATOR_OPTIONS}
      />
    </div>

    <Select
      label="지게차 유무"
      value={address.forklift || ''}
      onChange={(e) => onUpdate('forklift', e.target.value)}
      options={FORKLIFT_OPTIONS}
    />

    <Textarea
      label="배송 요청사항"
      value={address.quickRequest || ''}
      onChange={(e) => onUpdate('quickRequest', e.target.value)}
      rows={4}
      placeholder="배송 시 특이사항이나 요청사항을 입력해주세요"
    />
  </motion.div>
);

const CourierDeliveryForm = ({ address, onUpdate }: { address: ShippingAddress; onUpdate: (field: keyof ShippingAddress, value: string | number) => void }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className="p-6 bg-white border border-gray-100 rounded-xl space-y-5"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Input
        label="수령인"
        leftIcon={<User className="w-4 h-4" />}
        required
        value={address.recipientName}
        onChange={(e) => onUpdate('recipientName', e.target.value)}
        placeholder="이름"
      />
      <Input
        label="연락처"
        leftIcon={<Phone className="w-4 h-4" />}
        required
        type="tel"
        value={address.recipientPhone}
        onChange={(e) => onUpdate('recipientPhone', e.target.value)}
        placeholder="010-0000-0000"
      />
    </div>

    <Input
      label="배송지 주소"
      leftIcon={<MapPin className="w-4 h-4" />}
      required
      value={address.address}
      onChange={(e) => onUpdate('address', e.target.value)}
      placeholder="주소를 입력하세요"
      readOnly
      suffix={
        <Button variant="dark" leftIcon={<Search className="w-4 h-4" />}>
          검색
        </Button>
      }
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Input
        label="우편번호"
        value={address.zipCode}
        onChange={(e) => onUpdate('zipCode', e.target.value)}
        placeholder="00000"
      />
      <Input
        label="배송지명"
        value={address.deliveryName || ''}
        onChange={(e) => onUpdate('deliveryName', e.target.value)}
        placeholder="예: 본사, 지점"
      />
    </div>

    <Textarea
      label="배송 요청사항"
      value={address.courierRequest || ''}
      onChange={(e) => onUpdate('courierRequest', e.target.value)}
      rows={4}
      placeholder="배송 시 특이사항이나 요청사항을 입력해주세요"
    />
  </motion.div>
);

const ShippingAddressCard = ({ address, onUpdate, showDelete, onDelete, index = 0, isSingleAddress = false, packagingInfos = [], allShippingAddresses = [] }: ShippingFormProps) => {
  // 특정 패키징의 다른 배송지 배분 수량 계산 (Calculate distributed quantity for a packaging in other addresses)
  const getOtherAddressesQuantity = (packagingId: string): number => {
    return allShippingAddresses
      .filter(addr => addr.id !== address.id)
      .flatMap(addr => addr.selectedPackagings || [])
      .filter(p => p.packagingId === packagingId)
      .reduce((sum, p) => sum + p.quantity, 0);
  };

  // 현재 배송지의 특정 패키징 수량 가져오기 (Get current quantity for a packaging)
  const getCurrentQuantity = (packagingId: string): number => {
    const selected = (address.selectedPackagings || []).find(p => p.packagingId === packagingId);
    return selected?.quantity || 0;
  };

  // 패키징 수량 업데이트 핸들러 (Update packaging quantity handler)
  const updatePackagingQuantity = (packagingId: string, quantity: number) => {
    const currentSelected = address.selectedPackagings || [];
    const exists = currentSelected.find(p => p.packagingId === packagingId);
    
    if (quantity === 0) {
      // 수량이 0이면 제거 (Remove if quantity is 0)
      onUpdate('selectedPackagings', currentSelected.filter(p => p.packagingId !== packagingId));
    } else if (exists) {
      // 기존 항목 업데이트 (Update existing)
      onUpdate('selectedPackagings', currentSelected.map(p => 
        p.packagingId === packagingId ? { ...p, quantity } : p
      ));
    } else {
      // 새 항목 추가 (Add new)
      onUpdate('selectedPackagings', [...currentSelected, { packagingId, quantity }]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">배송지 #{index + 1}</h3>
        {showDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 패키징 선택 및 수량 입력 - 패키징이 여러개일 때 표시 (Packaging selection with quantity - show when multiple packagings exist) */}
      {packagingInfos.length >= 1 && !isSingleAddress && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Box className="w-4 h-4 inline mr-1.5" />
            이 배송지로 받을 패키징 및 수량
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {packagingInfos.map((pkg) => {
              const currentQty = getCurrentQuantity(pkg.id);
              const otherQty = getOtherAddressesQuantity(pkg.id);
              const remainingQty = pkg.quantity - otherQty;
              const isOverLimit = currentQty > remainingQty;
              const isDisabled = remainingQty <= 0; // 남은 수량이 0 이하일 때만 비활성화 (Disable only when no quantity remains)
              const isSelected = currentQty > 0;
              
              return (
                <motion.div
                  key={pkg.id}
                  className={`flex flex-col gap-3 p-3 rounded-xl border-2 transition-all ${
                    isDisabled
                      ? 'border-gray-200 bg-gray-100 opacity-50'
                      : currentQty > 0
                      ? isOverLimit 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-[#fab803] bg-[#fab803]/5'
                      : 'border-gray-200 bg-white'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* 체크박스와 상품명 (Checkbox and product name) */}
                  <div 
                    className={`flex items-center gap-3 ${!isDisabled && 'cursor-pointer'}`}
                    onClick={() => {
                      if (!isDisabled && !isSelected) {
                        updatePackagingQuantity(pkg.id, remainingQty);
                      } else if (!isDisabled && isSelected) {
                        updatePackagingQuantity(pkg.id, 0);
                      }
                    }}
                  >
                    <div className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors flex-shrink-0 ${
                      isDisabled
                        ? 'border-gray-300 bg-gray-200'
                        : isSelected 
                        ? 'border-[#fab803] bg-[#fab803]' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && !isDisabled && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {pkg.productName || '상품명 미입력'}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        전체: {pkg.quantity}개
                        {pkg.option && ` · ${pkg.option}`}
                      </div>
                      {otherQty > 0 && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          다른 배송지: {otherQty}개 / 남은 수량: {remainingQty}개
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 수량 입력 - 체크박스 선택 후에만 활성화 (Quantity input - enabled only after checkbox is selected) */}
                  {isSelected && !isDisabled && (
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <input
                        type="number"
                        min="1"
                        max={remainingQty}
                        value={currentQty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          if (val > 0) {
                            updatePackagingQuantity(pkg.id, val);
                          }
                        }}
                        className={`flex-1 px-3 py-2 text-sm border-2 rounded-lg transition-colors ${
                          isOverLimit
                            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                            : 'border-gray-300 focus:border-[#fab803] focus:ring-2 focus:ring-[#fab803]/20'
                        }`}
                        placeholder="수량 입력"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm text-gray-500">개</span>
                    </motion.div>
                  )}
                  {isOverLimit && !isDisabled && (
                    <div className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      수량 초과! 최대 {remainingQty}개까지 가능
                    </div>
                  )}
                  {isDisabled && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      다른 배송지에서 모두 배분됨
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
      {/* 배송 방법 선택 */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          배송 방법 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectionCard
            icon={<Package className="w-5 h-5" />}
            title="택배 배송"
            selected={address.deliveryMethod === 'courier'}
            onClick={() => onUpdate('deliveryMethod', 'courier')}
          />
          <SelectionCard
            icon={<Truck className="w-5 h-5" />}
            title="개별 화물 (퀵)"
            subtitle="* 추가 비용 발생 가능"
            selected={address.deliveryMethod === 'quick'}
            onClick={() => onUpdate('deliveryMethod', 'quick')}
          />
        </div>
      </div>

      {/* 배송 방법별 상세 폼 */}
    <AnimatePresence mode="wait">
      {address.deliveryMethod === 'quick' ? (
        <QuickDeliveryForm key="quick" address={address} onUpdate={onUpdate} />
      ) : (
        <CourierDeliveryForm key="courier" address={address} onUpdate={onUpdate} />
      )}
    </AnimatePresence>
  </motion.div>
  );
};

// ========== 메인 컴포넌트 ==========
export function ShippingDesignInfoPage({ onBack }: ShippingDesignInfoPageProps) {
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>(null);
  const [multipleAddresses, setMultipleAddresses] = useState<boolean | null>(null);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  
  // Packaging states (패키징 정보 상태)
  const [packagingInfos, setPackagingInfos] = useState<PackagingInfo[]>([createEmptyPackaging()]);
  const [selectedPackagingTab, setSelectedPackagingTab] = useState(0);
  const [isPackagingExpanded, setIsPackagingExpanded] = useState(false);
  const [packagingRequired, setPackagingRequired] = useState<boolean | null>(false); // 패키징 옵션 필요 여부 (Packaging option required) - 기본값: 아니오
  const [packagingInputCompleted, setPackagingInputCompleted] = useState(true); // 패키징 입력 완료 여부 (Packaging input completed) - 기본값: 완료
  const [isPackagingSectionCollapsed, setIsPackagingSectionCollapsed] = useState(true); // 패키징 섹션 접기 상태 (Packaging section collapse state) - 기본값: 접힌 상태
  
  // Shipping address tab state (배송지 탭 상태)
  const [selectedShippingTab, setSelectedShippingTab] = useState(0);
  const [isShippingInfoCollapsed, setIsShippingInfoCollapsed] = useState(false); // 배송지 정보 섹션 접기 상태 (Shipping info section collapse state)
  const [isShippingAddressCollapsed, setIsShippingAddressCollapsed] = useState(false); // 배송지 주소 섹션 접기 상태 (Shipping address section collapse state)
  
  // Product selection modal state (상품 선택 모달 상태)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentPackagingId, setCurrentPackagingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addShippingAddress = () => {
    setShippingAddresses([...shippingAddresses, createEmptyAddress()]);
    setSelectedShippingTab(shippingAddresses.length);
  };

  const removeShippingAddress = (id: string) => {
    if (shippingAddresses.length === 1) {
      alert('최소 1개의 배송지가 필요합니다.');
      return;
    }
    const filteredAddresses = shippingAddresses.filter(addr => addr.id !== id);
    setShippingAddresses(filteredAddresses);
    if (selectedShippingTab >= filteredAddresses.length) {
      setSelectedShippingTab(filteredAddresses.length - 1);
    }
  };

  const updateShippingAddress = (id: string, field: keyof ShippingAddress, value: string | number | Array<{ packagingId: string; quantity: number }>) => {
    setShippingAddresses(shippingAddresses.map(addr => 
      addr.id === id ? { ...addr, [field]: value } : addr
    ));
  };

  // Packaging functions (패키징 정보 관련 함수)
  const addPackaging = () => {
    const newPackaging = createEmptyPackaging();
    setPackagingInfos([...packagingInfos, newPackaging]);
    setSelectedPackagingTab(packagingInfos.length);
  };

  const removePackaging = (id: string) => {
    if (packagingInfos.length === 1) {
      alert('최소 1개의 패키징 정보가 필요합니다.');
      return;
    }
    const filteredPackagings = packagingInfos.filter(pkg => pkg.id !== id);
    setPackagingInfos(filteredPackagings);
    if (selectedPackagingTab >= filteredPackagings.length) {
      setSelectedPackagingTab(filteredPackagings.length - 1);
    }
  };

  const updatePackaging = (id: string, field: keyof PackagingInfo, value: any) => {
    setPackagingInfos(packagingInfos.map(pkg => 
      pkg.id === id ? { ...pkg, [field]: value } : pkg
    ));
  };

  const handlePackagingRequiredChange = (required: boolean) => {
    setPackagingRequired(required);
    setPackagingInputCompleted(false); // 옵션 변경 시 입력 완료 상태 초기화 (Reset completion status on option change)
    setIsPackagingSectionCollapsed(false); // 섹션 펼치기 (Expand section)
    if (required) {
      setIsPackagingExpanded(true);
    } else {
      setIsPackagingExpanded(false);
    }
  };

  const handleDeliveryStatusChange = (status: DeliveryStatus) => {
    setDeliveryStatus(status);
    
    if (status === 'previous') {
      // 이전 배송 주소: 모든 패키징을 기본 선택 (Previous address: select all packagings by default)
      const allPackagings = packagingInfos.map(pkg => ({ packagingId: pkg.id, quantity: pkg.quantity }));
      const prevAddress = { ...PREVIOUS_SHIPPING_INFO, id: Date.now().toString(), selectedPackagings: allPackagings };
      setShippingAddresses([prevAddress]);
      setMultipleAddresses(false);
      setIsShippingInfoCollapsed(true); // 이전 배송 주소 선택 시 바로 접기 (Collapse immediately when previous address is selected)
    } else if (status === 'yes') {
      setMultipleAddresses(null);
      setShippingAddresses([]);
    } else {
      setMultipleAddresses(null);
      setShippingAddresses([]);
      // 입력 완료 버튼 클릭 시 접히도록 변경 (Changed to collapse when input complete button is clicked)
    }
  };

  const handleMultipleAddressesChange = (isMultiple: boolean) => {
    setMultipleAddresses(isMultiple);
    setIsShippingInfoCollapsed(true); // 선택 후 배송지 정보 섹션 접기 (Collapse shipping info section after selection)
    if (isMultiple) {
      addShippingAddress();
    } else {
      // 단일 배송지: 모든 패키징을 기본 선택 (Single address: select all packagings by default)
      const allPackagings = packagingInfos.map(pkg => ({ packagingId: pkg.id, quantity: pkg.quantity }));
      const newAddress = createEmptyAddress();
      newAddress.selectedPackagings = allPackagings;
      setShippingAddresses([newAddress]);
    }
  };

  const handleExcelUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      alert('엑셀 파일(.xlsx, .xls, .csv)만 업로드 가능합니다.');
      return;
    }
    
    setExcelFile(file);
    alert('엑셀 파일이 업로드되었습니다.');
  };

  const downloadTemplate = () => {
    alert('배송지 정보 엑셀 템플릿 다운로드가 시작됩니다.');
  };

  // 상품 선택 모달 열기 (Open product selection modal)
  const openProductModal = (packagingId: string) => {
    setCurrentPackagingId(packagingId);
    setIsProductModalOpen(true);
  };

  // 상품 선택 확인 (Confirm product selection)
  const handleProductSelect = (selectedProducts: QuoteProduct[]) => {
    if (currentPackagingId && selectedProducts.length > 0) {
      const product = selectedProducts[0];
      
      // 옵션 정보 생성 (Generate option string from product details)
      const optionParts = [];
      if (product.options.material) optionParts.push(product.options.material);
      if (product.options.size) optionParts.push(product.options.size);
      if (product.options.color) optionParts.push(product.options.color);
      const optionString = optionParts.join(', ');
      
      // 한 번에 모든 필드를 업데이트 (Update all fields at once to avoid batching issues)
      setPackagingInfos(prevInfos => prevInfos.map(pkg => 
        pkg.id === currentPackagingId ? { 
          ...pkg, 
          productName: product.productName,
          option: optionString,
          quantity: product.quantity,
          selectedQuoteProductId: product.id
        } : pkg
      ));
    }
    setCurrentPackagingId(null);
  };

  const handleSubmit = async () => {
    if (deliveryStatus === null) {
      alert('배송지 정보를 선택해주세요.');
      return;
    }

    if (deliveryStatus === 'yes' && shippingAddresses.length === 0) {
      alert('최소 1개의 배송지를 추가해주세요.');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('제출된 배송 정보:', { deliveryStatus, multipleAddresses, shippingAddresses });
    setIsSubmitted(true);
    setIsLoading(false);
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-5 h-5" />}>
            뒤로 가기
          </Button>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-6xl mx-auto px-2 md:px-6 py-8 md:py-12">
        {/* 프로그레스바 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <OrderProgressBar currentStep={3} />
        </motion.div>

        {/* 페이지 헤더 - 카드 외부로 이동 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#1a2867] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-[#1a2867]/20">
              <Truck className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 text-[24px]">배송 정보 입력</h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                제품 배송에 필요한 정보를 입력해주세요.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border md:border-gray-100 md:shadow-xl md:shadow-gray-200/50 overflow-hidden"
        >
          <div className="p-3 md:p-6 space-y-6 md:space-y-7">
            {/* 패키징 정보 질문 섹션 (Packaging Information Question Section) */}
            <section>
              {/* 접기/펼치기 헤더 (Collapsible Header) */}
              <div 
                className="flex items-center justify-between cursor-pointer mb-4 p-4 rounded-xl bg-white border-2 border-gray-100 hover:border-[#fab803]/30 transition-all"
                onClick={() => setIsPackagingSectionCollapsed(!isPackagingSectionCollapsed)}
              >
                <div className="flex items-center gap-3">
                  <Box className="w-5 h-5 text-[#1a2867]" />
                  <div>
                    <h3 className="font-semibold text-gray-900">패키징 정보</h3>
                    {isPackagingSectionCollapsed && packagingRequired !== null && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        {packagingRequired ? `별도 패키징 옵션 있음 (${packagingInfos.length}개)` : '별도 패키징 옵션 없음'}
                      </p>
                    )}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isPackagingSectionCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </motion.div>
              </div>
              
              {!isPackagingSectionCollapsed && (
              <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 mb-4 text-[15px]">
                    별도로 원하시는 패키징 옵션이 있으신가요?
                    <div className="text-xs font-normal text-gray-500 mt-1 text-[13px]">
                      (예시 : 1박스에 50개씩 담아서, 20박스로 나누어 담아주세요.)
                    </div>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SelectionCard
                      icon={<CheckCircle className="w-5 h-5" />}
                      title="예"
                      selected={packagingRequired === true}
                      onClick={() => handlePackagingRequiredChange(true)}
                    />
                    <SelectionCard
                      icon={<X className="w-5 h-5" />}
                      title="아니오"
                      selected={packagingRequired === false}
                      onClick={() => handlePackagingRequiredChange(false)}
                    />
                  </div>
                </div>

                {/* 패키징 입력 완료 버튼 - "아니오" 선택 시에만 표시 (Packaging Completion Button - Only for "No") */}
                {packagingRequired === false && (
                  <div className="mt-4">
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        setPackagingInputCompleted(true);
                        setIsPackagingSectionCollapsed(true); // 입력 완료 후 섹션 접기 (Collapse section after completion)
                      }}
                      className="w-full"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      입력 완료
                    </Button>
                  </div>
                )}

                {/* 패키징 안내 문구 (Packaging Information Notice) */}
                <div className="mt-5 pt-5 border-t border-gray-200">
                  <div className="bg-blue-50/80 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-800 font-medium">
                        자세한 패키징 정보(박스 사이즈 및 무게 등)은 제작 완료 후 안내가 가능합니다.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-800 font-medium">
                        일반적으로 제품 부피에 따라 적당한 크기 박스의 15~20kg 내외로 나누어 포장됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </section>

            {/* 패키징 정보 상세 입력 - "예" 선택 시에만 표시 (Packaging Details - Only shown when "Yes" is selected) */}
            <AnimatePresence>
              {packagingRequired === true && !isPackagingSectionCollapsed && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-4">
                    {/* 탭 버튼들과 휴지통 버튼 (Tab Buttons and Delete Button) */}
                    <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {packagingInfos.map((pkg, index) => (
                          <button
                            key={pkg.id}
                            onClick={() => setSelectedPackagingTab(index)}
                            className={cn(
                              'flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all',
                              selectedPackagingTab === index
                                ? 'bg-[#1a2867] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            )}
                          >
                            패키징 #{index + 1}
                          </button>
                        ))}
                        <button
                          onClick={addPackaging}
                          className="flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm bg-white text-gray-600 hover:bg-gray-100 border-2 border-dashed border-gray-300 transition-all"
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          패키징 추가
                        </button>
                      </div>
                      
                      {/* 휴지통 버튼 우측 상단 (Delete Button on Top Right) */}
                      {packagingInfos.length > 1 && (
                        <button
                          onClick={() => removePackaging(packagingInfos[selectedPackagingTab].id)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* 선택된 탭의 패키징 정보 (Selected Tab Content - No animation for tab switching) */}
                    {packagingInfos[selectedPackagingTab] && (
                        <div className="bg-white rounded-xl p-5 border border-gray-100 space-y-4">
                          {/* 상품명, 옵션, 수량 - 활성화 (Product Name, Option, Quantity - Enabled) */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                상품명
                              </label>
                              <input
                                type="text"
                                readOnly
                                placeholder="클릭하여 견적서에서 선택"
                                value={packagingInfos[selectedPackagingTab].productName}
                                onClick={() => openProductModal(packagingInfos[selectedPackagingTab].id)}
                                className="w-full rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 py-2.5 px-3.5 transition-all duration-200 cursor-pointer hover:border-[#1a2867] focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]"
                              />
                            </div>
                            <Input
                              label="옵션"
                              placeholder="예: 빨강, 대형"
                              readOnly
                              value={packagingInfos[selectedPackagingTab].option}
                              onChange={(e) => updatePackaging(packagingInfos[selectedPackagingTab].id, 'option', e.target.value)}
                            />
                            <Input
                              label="수량"
                              placeholder="0"
                              readOnly
                              value={formatNumber(packagingInfos[selectedPackagingTab].quantity)}
                              onChange={(e) => updatePackaging(packagingInfos[selectedPackagingTab].id, 'quantity', parseFormattedNumber(e.target.value))}
                            />
                          </div>

                          {/* 박스 크기 - 가로/세로/높이 분리 (Box Size - Separated into Width/Height/Depth) */}
                          <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <Box className="w-4 h-4 text-gray-400" />
                              박스 크기
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Input
                                label="가로"
                                placeholder="예: 40cm"
                                disabled
                                value={packagingInfos[selectedPackagingTab].width}
                                onChange={(e) => updatePackaging(packagingInfos[selectedPackagingTab].id, 'width', e.target.value)}
                              />
                              <Input
                                label="세로"
                                placeholder="예: 30cm"
                                disabled
                                value={packagingInfos[selectedPackagingTab].height}
                                onChange={(e) => updatePackaging(packagingInfos[selectedPackagingTab].id, 'height', e.target.value)}
                              />
                              <Input
                                label="높이"
                                placeholder="예: 25cm"
                                disabled
                                value={packagingInfos[selectedPackagingTab].depth}
                                onChange={(e) => updatePackaging(packagingInfos[selectedPackagingTab].id, 'depth', e.target.value)}
                              />
                            </div>
                          </div>

                          {/* 박스 무게와 박스 갯수 (Box Weight and Box Count) */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              label="박스 무게"
                              leftIcon={<Weight className="w-4 h-4" />}
                              placeholder="예: 5kg"
                              disabled
                              value={packagingInfos[selectedPackagingTab].boxWeight}
                              onChange={(e) => updatePackaging(packagingInfos[selectedPackagingTab].id, 'boxWeight', e.target.value)}
                            />
                            <div className="space-y-1.5">
                              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Hash className="w-4 h-4 text-gray-400" />
                                한 박스당 제품 수량
                              </label>
                              <input
                                type="text"
                                placeholder="0"
                                value={formatNumber(packagingInfos[selectedPackagingTab].productsPerBox || 0)}
                                onChange={(e) => updatePackaging(packagingInfos[selectedPackagingTab].id, 'productsPerBox', parseFormattedNumber(e.target.value))}
                                className="w-full rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 py-2.5 px-3.5 transition-all duration-200 hover:border-[#1a2867] focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]"
                              />
                            </div>
                            <Input
                              label="박스 갯수"
                              leftIcon={<Package className="w-4 h-4" />}
                              placeholder="0"
                              disabled
                              value={packagingInfos[selectedPackagingTab].productsPerBox > 0 
                                ? formatNumber(Math.ceil(packagingInfos[selectedPackagingTab].quantity / packagingInfos[selectedPackagingTab].productsPerBox))
                                : '0'
                              }
                              onChange={() => {}}
                            />
                          </div>

                          {/* 박스 수량 안내 메시지 (Box Quantity Notice) */}
                          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700">
                              제품 부피에 따라 한 박스당 박스 수량은 유동적으로 변경될 수 있습니다.
                            </p>
                          </div>

                          {/* 기타 요청 사항 - 활성화 (Additional Requests - Enabled) */}
                          <Textarea
                            label="기타 요청 사항"
                            value={packagingInfos[selectedPackagingTab].additionalRequest}
                            onChange={(e) => updatePackaging(packagingInfos[selectedPackagingTab].id, 'additionalRequest', e.target.value)}
                            rows={3}
                            placeholder="패키징 관련 추가 요청사항을 입력해주세요"
                          />

                          {/* 패키징 사진 업로드 - 비활성화 유지 (Packaging Photos - Remains Disabled) */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                              <ImageIcon className="w-4 h-4 text-gray-400" />
                              패키징 사진
                            </label>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-100 cursor-not-allowed">
                              <div className="flex flex-col items-center gap-2 text-gray-400">
                                <ImageIcon className="w-8 h-8" />
                                <p className="text-xs text-center">제작 완료 후 업로드됩니다</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    
                    {/* 패키징 입력 완료 버튼 (Packaging Completion Button) */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          setPackagingInputCompleted(true);
                          setIsPackagingSectionCollapsed(true); // 입력 완료 후 섹션 접기 (Collapse section after completion)
                        }}
                        className="w-full"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        입력 완료
                      </Button>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* 배송지 정보 질문 - 패키징 입력 완료 후에만 표시 (Shipping Info - Only shown after packaging completion) */}
            {packagingInputCompleted && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* 접기/펼치기 헤더 (Collapsible Header) */}
              <div 
                className="flex items-center justify-between cursor-pointer mb-4 p-4 rounded-xl bg-white border-2 border-gray-100 hover:border-[#fab803]/30 transition-all"
                onClick={() => setIsShippingInfoCollapsed(!isShippingInfoCollapsed)}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#1a2867]" />
                  <div>
                    <h3 className="font-semibold text-gray-900">배송지 정보</h3>
                    {isShippingInfoCollapsed && deliveryStatus && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        {deliveryStatus === 'yes' && multipleAddresses === true && `배송지 ${shippingAddresses.length}곳`}
                        {deliveryStatus === 'yes' && multipleAddresses === false && '배송지 1곳'}
                        {deliveryStatus === 'no' && '배송지 미정'}
                        {deliveryStatus === 'previous' && '이전 배송 주소와 동일'}
                      </p>
                    )}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isShippingInfoCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </motion.div>
              </div>
              
              {!isShippingInfoCollapsed && (
              <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 mb-4 text-[15px]">
                    현재 기준 배송지가 정해져 있으신가요?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <SelectionCard
                      icon={<CheckCircle className="w-5 h-5" />}
                      title="예"
                      selected={deliveryStatus === 'yes'}
                      onClick={() => handleDeliveryStatusChange('yes')}
                    />
                    <SelectionCard
                      icon={<X className="w-5 h-5" />}
                      title="아니오"
                      selected={deliveryStatus === 'no'}
                      onClick={() => handleDeliveryStatusChange('no')}
                    />
                    <SelectionCard
                      icon={<Clock className="w-5 h-5" />}
                      title="이전 배송 주소와 동일"
                      selected={deliveryStatus === 'previous'}
                      onClick={() => handleDeliveryStatusChange('previous')}
                    />
                  </div>
                </div>

                {/* 상태별 안내 메시지 */}
                <AnimatePresence>
                  {deliveryStatus === 'no' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <AlertBox type="info" title="배송지 미정">
                        나중에 배송지가 결정되면 다시 입력하실 수 있습니다. 
                        정보 제출을 완료하시면 배송지는 비워둔 상태로 저장됩니다.
                      </AlertBox>
                      <button
                        onClick={() => setIsShippingInfoCollapsed(true)}
                        className="w-full px-6 py-3 bg-[#1a2867] text-white rounded-lg hover:bg-[#1a2867]/90 transition-colors font-medium"
                      >
                        입력 완료
                      </button>
                    </motion.div>
                  )}

                  {deliveryStatus === 'yes' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5"
                    >
                      <label className="block text-sm font-semibold text-gray-900 mb-4">
                        배송지는 몇 곳인가요?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <SelectionCard
                          icon={<Package className="w-5 h-5" />}
                          title="배송 주소가 여러 곳입니다"
                          selected={multipleAddresses === true}
                          onClick={() => handleMultipleAddressesChange(true)}
                        />
                        <SelectionCard
                          icon={<MapPin className="w-5 h-5" />}
                          title="배송 주소가 한 곳입니다"
                          selected={multipleAddresses === false}
                          onClick={() => handleMultipleAddressesChange(false)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              )}
            </motion.section>
            )}

            {/* 배송지 목록 (여러 곳) - 패키징 입력 완료 후에만 표시 */}
            {packagingInputCompleted && (
            <AnimatePresence>
              {multipleAddresses === true && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* 여러 배송지 추가 비용 안내 (Multiple addresses cost notice) */}
                  <div className="mb-6">
                    <AlertBox type="warning" title="추가 비용 안내">
                      배송지가 여러 곳인 경우 추가 배송 비용이 발생할 수 있습니다.
                    </AlertBox>
                  </div>

                  <SectionHeader
                    icon={<Package className="w-5 h-5" />}
                    title="배송지 목록"
                    subtitle={`${shippingAddresses.length}개`}
                    action={
                      <div className="flex items-center gap-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          className="hidden"
                          onChange={(e) => handleExcelUpload(e.target.files)}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-700 hover:bg-green-800 text-white transition-colors shadow-sm"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          엑셀 업로드
                        </button>
                        <Button
                          variant="secondary"
                          size="sm"
                          leftIcon={<Download className="w-4 h-4" />}
                          onClick={downloadTemplate}
                        >
                          템플릿 다운로드
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Building2 className="w-4 h-4" />}
                          onClick={() => setBulkMode(!bulkMode)}
                        >
                          {bulkMode ? '카드 모드' : '대량 업로드'}
                        </Button>
                      </div>
                    }
                  />

                  {excelFile && (
                    <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <File className="w-5 h-5 text-[#1a2867]" />
                        <span className="font-medium text-gray-900">{excelFile.name}</span>
                      </div>
                      <button
                        onClick={() => setExcelFile(null)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {!bulkMode ? (
                    <div className="space-y-4">
                      {/* 배송지 탭 버튼들 (Shipping Address Tab Buttons) */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {shippingAddresses.map((addr, index) => (
                          <button
                            key={addr.id}
                            onClick={() => setSelectedShippingTab(index)}
                            className={cn(
                              'flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all',
                              selectedShippingTab === index
                                ? 'bg-[#1a2867] text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            )}
                          >
                            배송지 #{index + 1}
                          </button>
                        ))}
                        <button
                          onClick={addShippingAddress}
                          className="flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm bg-white text-gray-600 hover:bg-gray-100 border-2 border-dashed border-gray-300 transition-all"
                        >
                          <Plus className="w-4 h-4 inline mr-1" />
                          배송지 추가
                        </button>
                      </div>

                      {/* 선택된 탭의 배송지 카드 (Selected Tab Shipping Address Card - No animation for tab switching) */}
                      {shippingAddresses[selectedShippingTab] && (
                        <ShippingAddressCard
                          address={shippingAddresses[selectedShippingTab]}
                          index={selectedShippingTab}
                          showDelete={shippingAddresses.length > 1}
                          onDelete={() => removeShippingAddress(shippingAddresses[selectedShippingTab].id)}
                          onUpdate={(field, value) => updateShippingAddress(shippingAddresses[selectedShippingTab].id, field, value)}
                          packagingInfos={packagingInfos}
                          allShippingAddresses={shippingAddresses}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* 대량 업로드 모드 안내 문구 (Bulk upload mode notice) */}
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-800">
                          대량 업로드 모드는 단일 옵션인 경우에만 사용 가능합니다.
                        </p>
                      </div>

                      <BulkShippingTable
                        addresses={shippingAddresses}
                        onUpdate={updateShippingAddress}
                        onRemove={removeShippingAddress}
                      />
                      <div className="flex justify-center mt-8">
                        <Button
                          variant="outline"
                          leftIcon={<Plus className="w-5 h-5" />}
                          onClick={addShippingAddress}
                        >
                          배송지 추가
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.section>
              )}
            </AnimatePresence>
            )}

            {/* 단일 배송지 폼 - 패키징 입력 완료 후에만 표시 */}
            {packagingInputCompleted && (
            <AnimatePresence>
              {(multipleAddresses === false || deliveryStatus === 'previous') && shippingAddresses.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* 이전 배송 정보 안내 메시지 (Previous shipping info notice) */}
                  {deliveryStatus === 'previous' && (
                    <div className="mb-6">
                      <AlertBox type="success" title="이전 배송 정보 불러오기 완료">
                        이전 주문의 배송 정보가 자동으로 입력되었습니다. 필요 시 수정하실 수 있습니다.
                      </AlertBox>
                    </div>
                  )}

                  <SectionHeader icon={<MapPin className="w-5 h-5" />} title="배송지 정보" />
                  <ShippingAddressCard
                    address={shippingAddresses[0]}
                    index={0}
                    showDelete={false}
                    isSingleAddress={true}
                    onUpdate={(field, value) => updateShippingAddress(shippingAddresses[0].id, field, value)}
                    packagingInfos={packagingInfos}
                    allShippingAddresses={shippingAddresses}
                  />
                </motion.section>
              )}
            </AnimatePresence>
            )}

            {/* 제출 버튼 - 모든 프로세스 완료 후에만 표시 (Submit Button - Only shown after all processes are completed) */}
            {packagingInputCompleted && deliveryStatus !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end pt-8 border-t border-gray-100"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={isLoading || isSubmitted}
                leftIcon={isSubmitted ? <CheckCircle className="w-5 h-5" /> : undefined}
                rightIcon={!isSubmitted && !isLoading && <ArrowRight className="w-5 h-5" />}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : isSubmitted ? (
                  '제출 완료'
                ) : (
                  '정보 제출'
                )}
              </Button>
            </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 상품 선택 모달 (Product Selection Modal) */}
      <ProductSelectionModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onConfirm={handleProductSelect}
        products={MOCK_QUOTE_PRODUCTS}
        usedProductIds={packagingInfos
          .filter(pkg => pkg.id !== currentPackagingId) // 현재 편집 중인 패키징 제외 (Exclude currently editing packaging)
          .map(pkg => pkg.selectedQuoteProductId)
          .filter((id): id is string => id !== undefined)} // undefined 제거 (Remove undefined)
      />
    </div>
  );
}

export default ShippingDesignInfoPage;