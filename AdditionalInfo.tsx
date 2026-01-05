import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Check, 
  AlertCircle, 
  Building2, 
  Mail, 
  MapPin, 
  Briefcase, 
  Copy, 
  Calendar, 
  Clock,
  ArrowLeft,
  ArrowRight,
  Info,
  User,
  Hash,
  Phone,
  RefreshCw
} from 'lucide-react';
import { OrderProgressBar } from './components/OrderProgressBar';

// ========== 타입 정의 ==========
type ProofType = 'tax-invoice' | 'cash-receipt' | 'none' | 'same-as-previous';
type PaymentTiming = 'now' | 'later';
type CashReceiptType = 'income-deduction' | 'expense-proof';

interface BusinessInfo {
  businessNumber: string;
  taxType: string;
  companyName: string;
  ceoName: string;
  businessAddress: string;
  headquarterAddress: string;
  businessType: string;
  businessItem: string;
  taxEmail: string;
}

// ========== 상수 ==========
const PROOF_TYPES = [
  { id: 'tax-invoice' as const, name: '전자세금계산서', icon: FileText },
  { id: 'cash-receipt' as const, name: '현금영수증', icon: FileText },
  { id: 'none' as const, name: '필요 없음', icon: FileText },
  { id: 'same-as-previous' as const, name: '이전 정보 사용', icon: RefreshCw }
];

const TAX_TYPE_OPTIONS = [
  { value: '', label: '선택하세요' },
  { value: 'general', label: '일반과세자' },
  { value: 'zero-rate', label: '영세율' },
  { value: 'simple', label: '간이과세자' },
  { value: 'exempt', label: '면세사업자' }
];

const PREVIOUS_INFO: BusinessInfo = {
  businessNumber: '123-45-67890',
  taxType: 'general',
  companyName: '주식회사 인프라이즈',
  ceoName: '홍길동',
  businessAddress: '서울특별시 강남구 테헤란로 123',
  headquarterAddress: '서울특별시 강남구 테헤란로 123',
  businessType: '제조업',
  businessItem: '인형 제작',
  taxEmail: 'tax@infrise.com'
};

const BANK_INFO = {
  bank: '기업 은행',
  account: '270-188626-04-011',
  holder: '(주)인프라이즈'
};

// ========== 유틸리티 ==========
const cn = (...classes: (string | boolean | undefined | null)[]) => 
  classes.filter(Boolean).join(' ');

const generateTimeOptions = () => {
  const options = [];
  const now = new Date();
  
  for (let i = 0; i <= 24; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const dateStr = time.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    const timeStr = time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    options.push({
      value: time.toISOString(),
      label: `${dateStr} ${timeStr}`
    });
  }
  
  return options;
};

// ========== UI 컴포넌트 ==========
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'ghost';
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
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100'
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
}

const Input = ({ 
  label, 
  leftIcon, 
  hint,
  error,
  className, 
  ...props 
}: InputProps) => (
  <div className="space-y-2">
    {label && (
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {leftIcon && <span className="text-gray-400">{leftIcon}</span>}
        {label}
      </label>
    )}
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
    <input
      className={cn(
        'w-full rounded-xl border bg-gray-50/50 text-gray-900 placeholder:text-gray-400',
        'py-3.5 px-4 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867] focus:bg-white',
        'hover:border-gray-300',
        'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
        error 
          ? 'border-red-400 focus:ring-red-200 focus:border-red-400' 
          : 'border-gray-200',
        className
      )}
      {...props}
    />
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
  options: { value: string; label: string }[];
}

const Select = ({ label, leftIcon, options, className, ...props }: SelectProps) => (
  <div className="space-y-2">
    {label && (
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {leftIcon && <span className="text-gray-400">{leftIcon}</span>}
        {label}
      </label>
    )}
    <select
      className={cn(
        'w-full rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900',
        'py-3.5 px-4 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867] focus:bg-white',
        'hover:border-gray-300',
        className
      )}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

interface AlertBoxProps {
  type?: 'info' | 'warning' | 'error' | 'success';
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
    error: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-700',
      titleText: 'text-red-900',
      icon: <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-700',
      titleText: 'text-emerald-900',
      icon: <Check className="w-5 h-5 flex-shrink-0 text-emerald-500" />
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

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const SectionCard = ({ icon, title, subtitle, children }: SectionCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden"
  >
    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-transparent to-transparent">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#1a2867]/10 flex items-center justify-center text-[#1a2867]">
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

interface ProofTypeCardProps {
  id: ProofType;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: boolean;
  onSelect: () => void;
}

const ProofTypeCard = ({ id, name, icon: Icon, selected, onSelect }: ProofTypeCardProps) => (
  <motion.button
    type="button"
    onClick={onSelect}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      'relative flex flex-col items-center justify-center gap-3 px-4 py-6 rounded-xl border-2 transition-all',
      selected
        ? 'border-[#1a2867] bg-[#1a2867]/5 shadow-lg shadow-[#1a2867]/10'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
    )}
  >
    <Icon className={cn('w-6 h-6', selected ? 'text-[#1a2867]' : 'text-gray-400')} />
    <span className={cn(
      'text-sm font-semibold',
      selected ? 'text-gray-900' : 'text-gray-600'
    )}>
      {name}
    </span>
    <AnimatePresence>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-[#1a2867] rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

interface YesNoSelectorProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

const YesNoSelector = ({ value, onChange }: YesNoSelectorProps) => (
  <div className="grid grid-cols-2 gap-3">
    {[{ val: true, label: '예' }, { val: false, label: '아니오' }].map(({ val, label }) => (
      <motion.button
        key={label}
        type="button"
        onClick={() => onChange(val)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium',
          value === val
            ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
        )}
      >
        {label}
      </motion.button>
    ))}
  </div>
);

// ========== 파일 업로드 컴포넌트 ==========
interface FileUploadProps {
  file: File | null;
  isScanning: boolean;
  onFileChange: (file: File) => void;
  onManualInput: () => void;
}

const FileUpload = ({ file, isScanning, onFileChange, onManualInput }: FileUploadProps) => (
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700">사업자등록증 파일 업로드</label>
    <div className={cn(
      'relative border-2 border-dashed rounded-xl p-8 text-center transition-all',
      'hover:border-[#1a2867]/50 hover:bg-[#1a2867]/5',
      file ? 'border-[#1a2867] bg-[#1a2867]/5' : 'border-gray-300'
    )}>
      <input
        type="file"
        id="businessLicense"
        accept="image/*,.pdf"
        onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])}
        className="hidden"
      />
      <label htmlFor="businessLicense" className="cursor-pointer flex flex-col items-center gap-3">
        <div className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
          file ? 'bg-[#1a2867]/10' : 'bg-gray-100'
        )}>
          <Upload className={cn('w-8 h-8', file ? 'text-[#1a2867]' : 'text-gray-400')} />
        </div>
        {file ? (
          <div className="text-sm">
            <p className="font-medium text-[#1a2867]">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">클릭하여 다른 파일 선택</p>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            <p className="font-medium">클릭하여 파일을 업로드하세요</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF 파일 지원</p>
          </div>
        )}
      </label>

      {isScanning && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-6 h-6 border-2 border-[#1a2867]/20 border-t-[#1a2867] rounded-full"
            />
            <p className="text-sm font-medium text-[#1a2867]">사업자등록증을 스캔하고 있습니다...</p>
          </div>
        </div>
      )}
    </div>

    {!file && !isScanning && (
      <div className="text-center">
        <button
          type="button"
          onClick={onManualInput}
          className="text-sm text-[#1a2867] hover:text-[#1a2867]/80 font-medium underline underline-offset-2 transition-colors"
        >
          파일이 없으신가요? 수기로 입력하기
        </button>
      </div>
    )}
  </div>
);

// ========== 사업자 정보 폼 ==========
interface BusinessInfoFormProps {
  data: BusinessInfo;
  onChange: <K extends keyof BusinessInfo>(field: K, value: BusinessInfo[K]) => void;
  hasPreferredTaxDate: boolean | null;
  onHasPreferredTaxDateChange: (value: boolean) => void;
  taxIssueDate: string;
  onTaxIssueDateChange: (value: string) => void;
}

const BusinessInfoForm = ({
  data,
  onChange,
  hasPreferredTaxDate,
  onHasPreferredTaxDateChange,
  taxIssueDate,
  onTaxIssueDateChange
}: BusinessInfoFormProps) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    exit={{ opacity: 0, height: 0 }}
    className="space-y-5"
  >
    <AlertBox type="warning">
      자동으로 입력된 정보를 확인하고, 필요한 경우 수정해주세요.
    </AlertBox>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="사업자등록번호"
        leftIcon={<Hash className="w-4 h-4" />}
        value={data.businessNumber}
        onChange={(e) => onChange('businessNumber', e.target.value)}
        placeholder="123-45-67890"
      />
      <Select
        label="세금 유형"
        value={data.taxType}
        onChange={(e) => onChange('taxType', e.target.value)}
        options={TAX_TYPE_OPTIONS}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="회사 이름"
        leftIcon={<Building2 className="w-4 h-4" />}
        value={data.companyName}
        onChange={(e) => onChange('companyName', e.target.value)}
        placeholder="주식회사 OOO"
      />
      <Input
        label="대표자"
        leftIcon={<User className="w-4 h-4" />}
        value={data.ceoName}
        onChange={(e) => onChange('ceoName', e.target.value)}
        placeholder="홍길동"
      />
    </div>

    <Input
      label="사업장 소재지"
      leftIcon={<MapPin className="w-4 h-4" />}
      value={data.businessAddress}
      onChange={(e) => onChange('businessAddress', e.target.value)}
      placeholder="서울특별시 강남구..."
    />

    <Input
      label="본점 소재지"
      leftIcon={<MapPin className="w-4 h-4" />}
      value={data.headquarterAddress}
      onChange={(e) => onChange('headquarterAddress', e.target.value)}
      placeholder="서울특별시 강남구..."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="업태"
        leftIcon={<Briefcase className="w-4 h-4" />}
        value={data.businessType}
        onChange={(e) => onChange('businessType', e.target.value)}
        placeholder="제조업"
      />
      <Input
        label="종목"
        leftIcon={<Briefcase className="w-4 h-4" />}
        value={data.businessItem}
        onChange={(e) => onChange('businessItem', e.target.value)}
        placeholder="인형 제작"
      />
    </div>

    <Input
      label="전자세금계산서 전용 이메일"
      leftIcon={<Mail className="w-4 h-4" />}
      value={data.taxEmail}
      onChange={(e) => onChange('taxEmail', e.target.value)}
      placeholder="tax@company.com"
      type="email"
    />

    {/* 세금계산서 발행 날짜 */}
    <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        세금 계산서 발행을 원하시는 날짜가 있으신가요?
      </label>
      
      <YesNoSelector value={hasPreferredTaxDate} onChange={onHasPreferredTaxDateChange} />

      <AnimatePresence>
        {hasPreferredTaxDate === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              label="발행 희망 날짜"
              leftIcon={<Calendar className="w-4 h-4" />}
              type="date"
              value={taxIssueDate}
              onChange={(e) => onTaxIssueDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </motion.div>
        )}
        
        {hasPreferredTaxDate === false && (
          <AlertBox type="info">
            <p className="mb-2">세금 계산서 발행 날짜를 별도로 지정하지 않으실 경우 아래와 같이 발행됩니다.</p>
            <ul className="space-y-1 ml-2">
              <li>• 매 주 금요일 또는 월 말에 일괄 발행</li>
              <li>• 입금 날짜에 발행</li>
            </ul>
          </AlertBox>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

// ========== 메인 컴포넌트 ==========
export default function AdditionalInfo() {
  const navigate = useNavigate();
  
  const [proofType, setProofType] = useState<ProofType>('tax-invoice');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // 결제 시간
  const [paymentTiming, setPaymentTiming] = useState<PaymentTiming>('now');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const accountInputRef = useRef<HTMLInputElement>(null);

  // 세금계산서 날짜
  const [hasPreferredTaxDate, setHasPreferredTaxDate] = useState<boolean | null>(null);
  const [taxIssueDate, setTaxIssueDate] = useState('');

  // 현금영수증
  const [cashReceiptType, setCashReceiptType] = useState<CashReceiptType>('income-deduction');
  const [cashReceiptNumber, setCashReceiptNumber] = useState('');

  // 무통장 입금자명 (Depositor Name for Bank Transfer)
  const [depositorName, setDepositorName] = useState('');

  // 사업자 정보
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessNumber: '',
    taxType: '',
    companyName: '',
    ceoName: '',
    businessAddress: '',
    headquarterAddress: '',
    businessType: '',
    businessItem: '',
    taxEmail: ''
  });

  const updateBusinessInfo = <K extends keyof BusinessInfo>(field: K, value: BusinessInfo[K]) => {
    setBusinessInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleUsePreviousInfo = () => {
    setProofType('same-as-previous');
    setBusinessInfo(PREVIOUS_INFO);
    setOcrCompleted(true);
    setManualInput(false);
    setUploadedFile(null);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsScanning(true);
    setOcrCompleted(false);

    // OCR 시뮬레이션
    setTimeout(() => {
      setIsScanning(false);
      setOcrCompleted(true);
      setManualInput(false);
      setBusinessInfo(PREVIOUS_INFO);
    }, 2000);
  };

  const handleManualInput = () => {
    setManualInput(true);
    setOcrCompleted(false);
    setUploadedFile(null);
    setIsScanning(false);
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_INFO.account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (accountInputRef.current) {
        accountInputRef.current.value = BANK_INFO.account;
        accountInputRef.current.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleSubmit = async () => {
    if (proofType === 'tax-invoice' && !ocrCompleted && !manualInput) {
      alert('사업자등록증을 업로드하고 정보를 확인해주세요.');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 결제 정보 입력 후 → 배송 정보 입력 페이지로 이동
    // After submitting payment info → Navigate to Shipping Info page
    navigate('/shipping-design');
    
    setIsLoading(false);
  };

  const timeOptions = [
    { value: '', label: '시간을 선택하세요' },
    ...generateTimeOptions()
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* 프로그레스바 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-10"
        >
          <OrderProgressBar currentStep={2} />
        </motion.div>

        {/* 헤더 - 카드 외부로 이동 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-[#1a2867] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-[#1a2867]/20">
              <FileText className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-[24px]">결제 정보 입력</h1>
              <p className="text-base md:text-lg text-gray-500 text-[15px]">매입 증빙 서류를 선택해주세요.</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* 매입 증빙 서류 선택 */}
          <SectionCard icon={<FileText className="w-5 h-5" />} title="매입 증빙 서류 선택">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PROOF_TYPES.map((type) => (
                <ProofTypeCard
                  key={type.id}
                  {...type}
                  selected={proofType === type.id}
                  onSelect={() => type.id === 'same-as-previous' ? handleUsePreviousInfo() : setProofType(type.id)}
                />
              ))}
            </div>
          </SectionCard>

          {/* 전자세금계산서 */}
          <AnimatePresence>
            {(proofType === 'tax-invoice' || proofType === 'same-as-previous') && (
              <SectionCard 
                icon={<Building2 className="w-5 h-5" />} 
                title="사업자 정보"
                subtitle={proofType === 'same-as-previous' ? '이전 정보 사용' : undefined}
              >
                {proofType === 'tax-invoice' && (
                  <>
                    <FileUpload
                      file={uploadedFile}
                      isScanning={isScanning}
                      onFileChange={handleFileUpload}
                      onManualInput={handleManualInput}
                    />

                    {ocrCompleted && !manualInput && (
                      <div className="mt-4">
                        <AlertBox type="success">
                          스캔이 완료되었습니다. 아래 정보를 확인해주세요.
                        </AlertBox>
                      </div>
                    )}

                    {manualInput && (
                      <div className="mt-4">
                        <AlertBox type="info">
                          수기 입력 모드입니다. 아래 정보를 직접 입력해주세요.
                        </AlertBox>
                      </div>
                    )}
                  </>
                )}

                {proofType === 'same-as-previous' && (
                  <div className="mb-6">
                    <AlertBox type="success">
                      이전에 입력한 정보로 자동으로 채워졌습니다. 아래 정보를 확인해주세요.
                    </AlertBox>
                  </div>
                )}

                {(ocrCompleted || manualInput || proofType === 'same-as-previous') && (
                  <div className="mt-6">
                    <BusinessInfoForm
                      data={businessInfo}
                      onChange={updateBusinessInfo}
                      hasPreferredTaxDate={hasPreferredTaxDate}
                      onHasPreferredTaxDateChange={setHasPreferredTaxDate}
                      taxIssueDate={taxIssueDate}
                      onTaxIssueDateChange={setTaxIssueDate}
                    />
                  </div>
                )}
              </SectionCard>
            )}
          </AnimatePresence>

          {/* 현금영수증 */}
          <AnimatePresence>
            {proofType === 'cash-receipt' && (
              <SectionCard icon={<FileText className="w-5 h-5" />} title="현금영수증 정보">
                <div className="space-y-5">
                  <AlertBox type="warning">
                    현금영수증 발행 날짜는 당일만 가능합니다.
                  </AlertBox>

                  <Select
                    label="현금영수증 발급 유형"
                    value={cashReceiptType}
                    onChange={(e) => setCashReceiptType(e.target.value as CashReceiptType)}
                    options={[
                      { value: 'income-deduction', label: '소득공제용(휴대폰 번호)' },
                      { value: 'expense-proof', label: '지출증빙용(사업자등록번호)' }
                    ]}
                  />

                  <Input
                    label={cashReceiptType === 'income-deduction' ? '휴대폰 번호' : '사업자등록번호'}
                    leftIcon={cashReceiptType === 'income-deduction' ? <Phone className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                    value={cashReceiptNumber}
                    onChange={(e) => setCashReceiptNumber(e.target.value)}
                    placeholder={cashReceiptType === 'income-deduction' ? '010-1234-5678' : '123-45-67890'}
                  />
                </div>
              </SectionCard>
            )}
          </AnimatePresence>

          {/* 결제 시간 */}
          <SectionCard icon={<Clock className="w-5 h-5" />} title="결제 시간">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'now' as const, name: '지금 결제', icon: Clock },
                  { id: 'later' as const, name: '나중에 결제', icon: Calendar }
                ].map((timing) => (
                  <motion.button
                    key={timing.id}
                    type="button"
                    onClick={() => setPaymentTiming(timing.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 transition-all',
                      paymentTiming === timing.id
                        ? 'border-[#1a2867] bg-[#1a2867]/5 shadow-md shadow-[#1a2867]/10'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    )}
                  >
                    <timing.icon className={cn(
                      'w-5 h-5',
                      paymentTiming === timing.id ? 'text-[#1a2867]' : 'text-gray-400'
                    )} />
                    <span className={cn(
                      'font-medium',
                      paymentTiming === timing.id ? 'text-gray-900' : 'text-gray-600'
                    )}>
                      {timing.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              <AnimatePresence>
                {paymentTiming === 'later' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Select
                      label="결제 예정 시간"
                      leftIcon={<Clock className="w-4 h-4" />}
                      value={selectedDateTime}
                      onChange={(e) => setSelectedDateTime(e.target.value)}
                      options={timeOptions}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SectionCard>

          {/* 계좌 정보 */}
          <SectionCard icon={<Building2 className="w-5 h-5" />} title="무통장 입금 계좌">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{BANK_INFO.bank}</p>
                  <p className="text-xl font-bold text-gray-900 font-mono">{BANK_INFO.account}</p>
                  <p className="text-xs text-gray-500 mt-1">예금주: {BANK_INFO.holder}</p>
                </div>
                <Button
                  variant={copied ? 'secondary' : 'primary'}
                  onClick={handleCopyAccount}
                  leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? '복사됨' : '복사'}
                </Button>
              </div>

              {/* 입금자명 입력 (Depositor Name Input) */}
              <Input
                label="입금자명 (선택사항)"
                leftIcon={<User className="w-4 h-4" />}
                value={depositorName}
                onChange={(e) => setDepositorName(e.target.value)}
                placeholder="예: 홍길동"
                hint="정확한 입금자명을 알려주시면 빠른 입금 확인이 가능합니다. 입금자명을 모르시는 경우, 입력하지 않으셔도 됩니다."
              />
            </div>
            <input
              ref={accountInputRef}
              type="text"
              className="absolute opacity-0 pointer-events-none"
              tabIndex={-1}
              aria-hidden="true"
            />
          </SectionCard>

          {/* 액션 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-end gap-3 pt-4"
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.history.back()}
              leftIcon={<ArrowLeft className="w-5 h-5" />}
            >
              이전으로
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={isLoading}
              rightIcon={!isLoading && <ArrowRight className="w-5 h-5" />}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                '입력 완료'
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}