import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  Building2, 
  Check, 
  AlertCircle, 
  FileText, 
  Shield, 
  Wallet, 
  ArrowLeft,
  ArrowRight,
  Info,
  Receipt,
  Hash,
  User,
  Mail,
  Calendar,
  Lock,
  Plus,
  X,
  Phone,
  MapPin,
  Upload,
  RefreshCw,
  Copy,
  Briefcase,
  ChevronDown
} from 'lucide-react';
import { OrderProgressBar } from '../../components/shared/OrderProgressBar';

// ========== 타입 정의 ==========
type PaymentMethod = 'toss' | 'keyin' | 'bank' | 'narabill' | 'contract' | 'other';

interface PaymentTermOption {
  value: string;
  label: string;
  hasDeferred: boolean;
}

interface PaymentProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

// ========== 상수 ==========
const PAYMENT_TERM_OPTIONS: PaymentTermOption[] = [
  { value: '100-pre', label: '발주 전 100% 선금', hasDeferred: false },
  { value: '100-before-ship', label: '출고 전 100% 후불', hasDeferred: true },
  { value: '100-after-ship', label: '출고 후 100% 후불', hasDeferred: true },
  { value: '50-50-after', label: '발주 전 50% 선금, 출고 후 50% 후불', hasDeferred: true },
  { value: '50-50-before', label: '발주 전 50% 선금, 출고 전 50% 후불', hasDeferred: true },
  { value: 'custom', label: '기타 결제(선택 시 직접 입력)', hasDeferred: false }
];

const PAYMENT_METHODS = [
  { id: 'toss' as const, name: '토스페이먼츠', desc: '카드/간편결제', icon: CreditCard },
  { id: 'keyin' as const, name: '안심 키인', desc: '수기 결제', icon: Shield },
  { id: 'bank' as const, name: '무통장 입금', desc: '계좌 이체', icon: Building2 },
  { id: 'narabill' as const, name: '나라빌', desc: '공공기관 결제', icon: FileText },
  { id: 'contract' as const, name: '수의 계약', desc: '계약 결제', icon: Briefcase },
  { id: 'other' as const, name: '기타 결제', desc: '분할 결제, 타인 결제 등', icon: Wallet }
];

const TAX_TYPE_OPTIONS = [
  { value: '', label: '선택하세요' },
  { value: 'general', label: '일반과세자' },
  { value: 'zero-rate', label: '영세율' },
  { value: 'simple', label: '간이과세자' },
  { value: 'exempt', label: '면세사업자' }
];

const BANK_INFO = {
  bank: '기업 은행',
  account: '270-188626-04-011',
  holder: '(주)인프라이즈'
};

// ========== 유틸리티 ==========
const cn = (...classes: (string | boolean | undefined | null)[]) => 
  classes.filter(Boolean).join(' ');

const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);

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
  disabled,
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
        'w-full rounded-xl border bg-white text-gray-900 placeholder:text-gray-400',
        'py-3.5 px-4 transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
        'hover:border-gray-300',
        'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
        error 
          ? 'border-red-400 focus:ring-red-200 focus:border-red-400' 
          : 'border-gray-200',
        className
      )}
      disabled={disabled}
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
  options: { value: string; label: string }[];
}

const Select = ({ label, options, className, ...props }: SelectProps) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-gray-700">{label}</label>
    )}
    <select
      className={cn(
        'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
        'py-3.5 px-4 transition-all duration-200',
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
      text: 'text-blue-800',
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

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

const SectionHeader = ({ icon, title }: SectionHeaderProps) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-10 h-10 rounded-xl bg-[#1a2867]/10 flex items-center justify-center text-[#1a2867]">
      {icon}
    </div>
    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
  </div>
);

// Bank Transfer Section for Single Payor (단일 결제 주체용 무통장 입금 섹션)
const BankTransferSectionSingle = ({ payorInfo, setPayorInfo }: any) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const [showBizInfo, setShowBizInfo] = useState(false);
  const [hasPreferredTaxDate, setHasPreferredTaxDate] = useState<boolean | null>(null);
  const [taxIssueDate, setTaxIssueDate] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsScanning(true);
    setOcrCompleted(false);
    setManualInput(false);

    // OCR 시뮬레이션 (OCR simulation)
    setTimeout(() => {
      setIsScanning(false);
      setOcrCompleted(true);
      
      // 스캔 완료 후 자동으로 정보 채우기 (Auto-fill after scan)
      const currentData = payorInfo.bankData || { depositorName: '', proofType: 'tax-invoice' as const };
      setPayorInfo({
        ...payorInfo,
        bankData: {
          ...currentData,
          businessInfo: {
            businessNumber: '123-45-67890',
            taxType: 'general',
            companyName: '주식회사 인프라이즈',
            ceoName: '홍길동',
            businessAddress: '서울특별시 강남구 테헤란로 123',
            headquarterAddress: '서울특별시 강남구 테헤란로 123',
            businessType: '제조업',
            businessItem: '인형 제작',
            taxEmail: 'tax@infrise.com'
          }
        }
      });
      setShowBizInfo(true);
    }, 2000);
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_INFO.account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const updateBusinessInfo = (field: string, value: string) => {
    const currentData = payorInfo.bankData!;
    const currentBizInfo = currentData.businessInfo || { 
      businessNumber: '', taxType: '', companyName: '', ceoName: '', 
      businessAddress: '', headquarterAddress: '', businessType: '', 
      businessItem: '', taxEmail: '' 
    };
    setPayorInfo({
      ...payorInfo,
      bankData: {
        ...currentData,
        businessInfo: {
          ...currentBizInfo,
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-5 pt-4 border-t border-gray-200">

      {/* 매입 증빙 서류 선택 (Proof type selection) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          매입 증빙 서류
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'tax-invoice' as const, name: '전자세금계산서' },
            { id: 'cash-receipt' as const, name: '현금영수증' },
            { id: 'none' as const, name: '필요 없음' },
            { id: 'later' as const, name: '나중에 입력' }
          ].map((proof) => (
            <button
              key={proof.id}
              type="button"
              onClick={() => {
                const currentData = payorInfo.bankData || { depositorName: '', proofType: 'none' as const };
                setPayorInfo({
                  ...payorInfo,
                  bankData: {
                    ...currentData,
                    proofType: proof.id
                  }
                });
                setShowBizInfo(false);
                setOcrCompleted(false);
                setManualInput(false);
                setUploadedFile(null);
              }}
              className={cn(
                'px-3 py-2.5 rounded-lg border-2 transition-all text-sm font-medium',
                (payorInfo.bankData?.proofType || 'none') === proof.id
                  ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              )}
            >
              {proof.name}
            </button>
          ))}
        </div>
      </div>

      {/* 전자세금계산서 정보 (Tax invoice info) */}
      {payorInfo.bankData?.proofType === 'tax-invoice' && (
        <div className="space-y-5 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">사업자 정보</p>
          </div>

          {/* 파일 업로드 또는 수기 입력 선택 (File upload or manual input) */}
          {!showBizInfo && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed transition-all',
                  uploadedFile 
                    ? 'border-[#1a2867] bg-[#1a2867]/5' 
                    : 'border-gray-300 hover:border-[#1a2867] hover:bg-gray-50'
                )}
              >
                <Upload className="w-5 h-5 text-[#1a2867]" />
                <span className="text-sm font-medium text-gray-700">
                  {uploadedFile ? '파일 업로드됨' : '사업자등록증 업로드'}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setManualInput(true);
                    setShowBizInfo(true);
                    setUploadedFile(null);
                    setIsScanning(false);
                  }}
                  className="text-sm font-bold text-gray-700 underline hover:text-[#1a2867] transition-colors"
                >
                  수기 입력
                </button>
              </div>

              {isScanning && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                  />
                  <p className="text-sm text-blue-700 font-medium">스캔 중...</p>
                </div>
              )}

              {ocrCompleted && !manualInput && (
                <AlertBox type="success">
                  스캔이 완료되었습니다. 아래 정보를 확인해주세요.
                </AlertBox>
              )}

              {manualInput && (
                <AlertBox type="info">
                  수기 입력 모드입니다. 아래 정보를 직접 입력해주세요.
                </AlertBox>
              )}
            </div>
          )}

          {/* 사업자 정보 입력 필드 (Business info fields) */}
          {showBizInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="사업자등록번호"
                  leftIcon={<Hash className="w-4 h-4" />}
                  value={payorInfo.bankData?.businessInfo?.businessNumber || ''}
                  onChange={(e) => updateBusinessInfo('businessNumber', e.target.value)}
                  placeholder="123-45-67890"
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">과세유형</label>
                  <select
                    value={payorInfo.bankData?.businessInfo?.taxType || ''}
                    onChange={(e) => updateBusinessInfo('taxType', e.target.value)}
                    className={cn(
                      'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                      'py-2.5 px-3 text-sm transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]'
                    )}
                  >
                    {TAX_TYPE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="회사명"
                leftIcon={<Building2 className="w-4 h-4" />}
                value={payorInfo.bankData?.businessInfo?.companyName || ''}
                onChange={(e) => updateBusinessInfo('companyName', e.target.value)}
                placeholder="주식회사 인프라이즈"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="대표자명"
                  leftIcon={<User className="w-4 h-4" />}
                  value={payorInfo.bankData?.businessInfo?.ceoName || ''}
                  onChange={(e) => updateBusinessInfo('ceoName', e.target.value)}
                  placeholder="홍길동"
                />

                <Input
                  label="전자세금계산서 전용 이메일"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={payorInfo.bankData?.businessInfo?.taxEmail || ''}
                  onChange={(e) => updateBusinessInfo('taxEmail', e.target.value)}
                  placeholder="tax@company.com"
                />
              </div>

              <Input
                label="사업장 소재지"
                leftIcon={<MapPin className="w-4 h-4" />}
                value={payorInfo.bankData?.businessInfo?.businessAddress || ''}
                onChange={(e) => updateBusinessInfo('businessAddress', e.target.value)}
                placeholder="서울특별시 강남구 테헤란로 123"
              />

              <Input
                label="본점 소재지"
                leftIcon={<MapPin className="w-4 h-4" />}
                value={payorInfo.bankData?.businessInfo?.headquarterAddress || ''}
                onChange={(e) => updateBusinessInfo('headquarterAddress', e.target.value)}
                placeholder="서울특별시 강남구 테헤란로 123"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="업태"
                  leftIcon={<Briefcase className="w-4 h-4" />}
                  value={payorInfo.bankData?.businessInfo?.businessType || ''}
                  onChange={(e) => updateBusinessInfo('businessType', e.target.value)}
                  placeholder="제조업"
                />

                <Input
                  label="종목"
                  leftIcon={<Briefcase className="w-4 h-4" />}
                  value={payorInfo.bankData?.businessInfo?.businessItem || ''}
                  onChange={(e) => updateBusinessInfo('businessItem', e.target.value)}
                  placeholder="인형 제작"
                />
              </div>

              {/* 입력 완료 후 세금계산서 발행 날짜 질문 (Tax invoice date question) */}
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  세금계산서 발행을 원하시는 날짜가 있으신가요?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHasPreferredTaxDate(true)}
                    className={cn(
                      'px-4 py-3 rounded-xl border-2 font-medium transition-all',
                      hasPreferredTaxDate === true
                        ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    )}
                  >
                    예
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasPreferredTaxDate(false)}
                    className={cn(
                      'px-4 py-3 rounded-xl border-2 font-medium transition-all',
                      hasPreferredTaxDate === false
                        ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    )}
                  >
                    아니오
                  </button>
                </div>

                {/* 발행 희망 날짜 선택 (Preferred issue date) */}
                {hasPreferredTaxDate === true && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Input
                      label="발행 희망 날짜"
                      type="date"
                      leftIcon={<Calendar className="w-4 h-4" />}
                      value={taxIssueDate}
                      onChange={(e) => setTaxIssueDate(e.target.value)}
                    />
                  </motion.div>
                )}

                {/* 발행 날짜 안내 (Issue date notice) */}
                {hasPreferredTaxDate === false && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertBox type="info">
                      <p className="font-medium mb-2">세금계산서 발행 날짜를 별도로 지정하지 않으실 경우 아래와 같이 발행됩니다.</p>
                      <ul className="space-y-1 text-sm">
                        <li>• 매 주 금요일 또는 월 말에 일괄 발행</li>
                        <li>• 입금 날짜에 발행</li>
                      </ul>
                    </AlertBox>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* 현금영수증 정보 (Cash receipt info) */}
      {payorInfo.bankData?.proofType === 'cash-receipt' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm font-medium text-gray-900">현금영수증 정보</p>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">발급 유형</label>
            <select
              value={payorInfo.bankData?.cashReceiptType || 'income-deduction'}
              onChange={(e) => {
                const currentData = payorInfo.bankData!;
                setPayorInfo({
                  ...payorInfo,
                  bankData: {
                    ...currentData,
                    cashReceiptType: e.target.value as 'income-deduction' | 'expense-proof'
                  }
                });
              }}
              className={cn(
                'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                'py-3 px-4 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]'
              )}
            >
              <option value="income-deduction">소득공제용(휴대폰 번호)</option>
              <option value="expense-proof">지출증빙용(사업자등록번호)</option>
            </select>
          </div>

          <Input
            label={payorInfo.bankData?.cashReceiptType === 'expense-proof' ? '사업자등록번호' : '휴대폰 번호'}
            leftIcon={payorInfo.bankData?.cashReceiptType === 'expense-proof' ? <Hash className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            value={payorInfo.bankData?.cashReceiptNumber || ''}
            onChange={(e) => {
              const currentData = payorInfo.bankData!;
              setPayorInfo({
                ...payorInfo,
                bankData: {
                  ...currentData,
                  cashReceiptNumber: e.target.value
                }
              });
            }}
            placeholder={payorInfo.bankData?.cashReceiptType === 'expense-proof' ? '123-45-67890' : '010-1234-5678'}
          />
        </div>
      )}

      {/* 무통장 입금 계좌 정보 (Bank account info) */}
      {payorInfo.bankData?.proofType !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-5 bg-gradient-to-br from-[#fab803]/5 to-[#1a2867]/5 rounded-xl border-2 border-[#fab803]/20">
            <p className="text-sm font-medium text-gray-900 mb-3">무통장 입금 계좌</p>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">{BANK_INFO.bank}</p>
                <p className="text-lg font-bold text-gray-900 font-mono">{BANK_INFO.account}</p>
                <p className="text-xs text-gray-500 mt-1">예금주: {BANK_INFO.holder}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyAccount}
                className={cn(
                  'px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2',
                  copied 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90'
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
          </div>

          {/* 입금자명 (Depositor name - Optional) */}
          <Input
            label="입금자명 (선택사항)"
            leftIcon={<User className="w-4 h-4" />}
            value={payorInfo.bankData?.depositorName || ''}
            onChange={(e) => {
              const currentData = payorInfo.bankData!;
              setPayorInfo({
                ...payorInfo,
                bankData: {
                  ...currentData,
                  depositorName: e.target.value
                }
              });
            }}
            placeholder="홍길동"
            hint="정확한 입금자명을 알려주시면 빠른 입금 확인이 가능합니다."
          />
        </motion.div>
      )}
    </div>
  );
};

// Bank Transfer Section Component (무통장 입금 섹션)
const BankTransferSection = ({ payment, setSplitPayments, splitPayments }: any) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const [showBizInfo, setShowBizInfo] = useState(false);
  const [hasPreferredTaxDate, setHasPreferredTaxDate] = useState<boolean | null>(null);
  const [taxIssueDate, setTaxIssueDate] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsScanning(true);
    setOcrCompleted(false);
    setManualInput(false);

    // OCR 시뮬레이션 (OCR simulation)
    setTimeout(() => {
      setIsScanning(false);
      setOcrCompleted(true);
      
      // 스캔 완료 후 자동으로 정보 채우기 (Auto-fill after scan)
      const currentData = payment.bankData || { depositorName: '', proofType: 'tax-invoice' as const };
      setSplitPayments(splitPayments.map((p: any) => 
        p.id === payment.id 
          ? { 
              ...p, 
              bankData: { 
                ...currentData,
                businessInfo: {
                  businessNumber: '123-45-67890',
                  taxType: 'general',
                  companyName: '주식회사 인프라이즈',
                  ceoName: '홍길동',
                  businessAddress: '서울특별시 강남구 테헤란로 123',
                  headquarterAddress: '서울특별시 강남구 테헤란로 123',
                  businessType: '제조업',
                  businessItem: '인형 제작',
                  taxEmail: 'tax@infrise.com'
                }
              } 
            } 
          : p
      ));
      setShowBizInfo(true);
    }, 2000);
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_INFO.account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const updateBusinessInfo = (field: string, value: string) => {
    const currentData = payment.bankData!;
    const currentBizInfo = currentData.businessInfo || { 
      businessNumber: '', taxType: '', companyName: '', ceoName: '', 
      businessAddress: '', headquarterAddress: '', businessType: '', 
      businessItem: '', taxEmail: '' 
    };
    setSplitPayments(splitPayments.map((p: any) => 
      p.id === payment.id 
        ? { ...p, bankData: { ...currentData, businessInfo: { ...currentBizInfo, [field]: value } } } 
        : p
    ));
  };

  return (
    <div className="space-y-5 pt-4 border-t border-gray-200">

      {/* 매입 증빙 서류 선택 (Proof type selection) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          매입 증빙 서류
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'tax-invoice' as const, name: '전자세금계산서' },
            { id: 'cash-receipt' as const, name: '현금영수증' },
            { id: 'none' as const, name: '필요 없음' },
            { id: 'later' as const, name: '나중에 입력' }
          ].map((proof) => (
            <button
              key={proof.id}
              type="button"
              onClick={() => {
                const currentData = payment.bankData || { depositorName: '', proofType: 'none' as const };
                setSplitPayments(splitPayments.map((p: any) => 
                  p.id === payment.id 
                    ? { ...p, bankData: { ...currentData, proofType: proof.id } } 
                    : p
                ));
                setShowBizInfo(false);
                setOcrCompleted(false);
                setManualInput(false);
                setUploadedFile(null);
              }}
              className={cn(
                'px-3 py-2.5 rounded-lg border-2 transition-all text-sm font-medium',
                (payment.bankData?.proofType || 'none') === proof.id
                  ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              )}
            >
              {proof.name}
            </button>
          ))}
        </div>
      </div>

      {/* 전자세금계산서 정보 (Tax invoice info) */}
      {payment.bankData?.proofType === 'tax-invoice' && (
        <div className="space-y-5 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">사업자 정보</p>
          </div>

          {/* 파일 업로드 또는 수기 입력 선택 (File upload or manual input) */}
          {!showBizInfo && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed transition-all',
                  uploadedFile 
                    ? 'border-[#1a2867] bg-[#1a2867]/5' 
                    : 'border-gray-300 hover:border-[#1a2867] hover:bg-gray-50'
                )}
              >
                <Upload className="w-5 h-5 text-[#1a2867]" />
                <span className="text-sm font-medium text-gray-700">
                  {uploadedFile ? '파일 업로드됨' : '사업자등록증 업로드'}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setManualInput(true);
                    setShowBizInfo(true);
                    setUploadedFile(null);
                    setIsScanning(false);
                  }}
                  className="text-sm font-bold text-gray-700 underline hover:text-[#1a2867] transition-colors"
                >
                  수기 입력
                </button>
              </div>

              {isScanning && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"
                  />
                  <p className="text-sm text-blue-700 font-medium">스캔 중...</p>
                </div>
              )}

              {ocrCompleted && !manualInput && (
                <AlertBox type="success">
                  스캔이 완료되었습니다. 아래 정보를 확인해주세요.
                </AlertBox>
              )}

              {manualInput && (
                <AlertBox type="info">
                  수기 입력 모드입니다. 아래 정보를 직접 입력해주세요.
                </AlertBox>
              )}
            </div>
          )}

          {/* 사업자 정보 입력 필드 (Business info fields) */}
          {showBizInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="사업자등록번호"
                  leftIcon={<Hash className="w-4 h-4" />}
                  value={payment.bankData?.businessInfo?.businessNumber || ''}
                  onChange={(e) => updateBusinessInfo('businessNumber', e.target.value)}
                  placeholder="123-45-67890"
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">과세유형</label>
                  <select
                    value={payment.bankData?.businessInfo?.taxType || ''}
                    onChange={(e) => updateBusinessInfo('taxType', e.target.value)}
                    className={cn(
                      'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                      'py-2.5 px-3 text-sm transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]'
                    )}
                  >
                    {TAX_TYPE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="회사명"
                leftIcon={<Building2 className="w-4 h-4" />}
                value={payment.bankData?.businessInfo?.companyName || ''}
                onChange={(e) => updateBusinessInfo('companyName', e.target.value)}
                placeholder="주식회사 인프라이즈"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="대표자명"
                  leftIcon={<User className="w-4 h-4" />}
                  value={payment.bankData?.businessInfo?.ceoName || ''}
                  onChange={(e) => updateBusinessInfo('ceoName', e.target.value)}
                  placeholder="홍길동"
                />

                <Input
                  label="전자세금계산서 전용 이메일"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={payment.bankData?.businessInfo?.taxEmail || ''}
                  onChange={(e) => updateBusinessInfo('taxEmail', e.target.value)}
                  placeholder="tax@company.com"
                />
              </div>

              <Input
                label="사업장 소재지"
                leftIcon={<MapPin className="w-4 h-4" />}
                value={payment.bankData?.businessInfo?.businessAddress || ''}
                onChange={(e) => updateBusinessInfo('businessAddress', e.target.value)}
                placeholder="서울특별시 강남구 테헤란로 123"
              />

              <Input
                label="본점 소재지"
                leftIcon={<MapPin className="w-4 h-4" />}
                value={payment.bankData?.businessInfo?.headquarterAddress || ''}
                onChange={(e) => updateBusinessInfo('headquarterAddress', e.target.value)}
                placeholder="서울특별시 강남구 테헤란로 123"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="업태"
                  leftIcon={<Briefcase className="w-4 h-4" />}
                  value={payment.bankData?.businessInfo?.businessType || ''}
                  onChange={(e) => updateBusinessInfo('businessType', e.target.value)}
                  placeholder="제조업"
                />

                <Input
                  label="종목"
                  leftIcon={<Briefcase className="w-4 h-4" />}
                  value={payment.bankData?.businessInfo?.businessItem || ''}
                  onChange={(e) => updateBusinessInfo('businessItem', e.target.value)}
                  placeholder="인형 제작"
                />
              </div>

              {/* 입력 완료 후 세금계산서 발행 날짜 질문 (Tax invoice date question) */}
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <p className="text-sm font-medium text-gray-900 mb-3">
                  세금계산서 발행을 원하시는 날짜가 있으신가요?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHasPreferredTaxDate(true)}
                    className={cn(
                      'px-4 py-3 rounded-xl border-2 font-medium transition-all',
                      hasPreferredTaxDate === true
                        ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    )}
                  >
                    예
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasPreferredTaxDate(false)}
                    className={cn(
                      'px-4 py-3 rounded-xl border-2 font-medium transition-all',
                      hasPreferredTaxDate === false
                        ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    )}
                  >
                    아니오
                  </button>
                </div>

                {/* 발행 희망 날짜 선택 (Preferred issue date) */}
                {hasPreferredTaxDate === true && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Input
                      label="발행 희망 날짜"
                      type="date"
                      leftIcon={<Calendar className="w-4 h-4" />}
                      value={taxIssueDate}
                      onChange={(e) => setTaxIssueDate(e.target.value)}
                    />
                  </motion.div>
                )}

                {/* 발행 날짜 안내 (Issue date notice) */}
                {hasPreferredTaxDate === false && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertBox type="info">
                      <p className="font-medium mb-2">세금계산서 발행 날짜를 별도로 지정하지 않으실 경우 아래와 같이 발행됩니다.</p>
                      <ul className="space-y-1 text-sm">
                        <li>• 매 주 금요일 또는 월 말에 일괄 발행</li>
                        <li>• 입금 날짜에 발행</li>
                      </ul>
                    </AlertBox>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* 현금영수증 정보 (Cash receipt info) */}
      {payment.bankData?.proofType === 'cash-receipt' && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm font-medium text-gray-900">현금영수증 정보</p>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">발급 유형</label>
            <select
              value={payment.bankData?.cashReceiptType || 'income-deduction'}
              onChange={(e) => {
                const currentData = payment.bankData!;
                setSplitPayments(splitPayments.map((p: any) => 
                  p.id === payment.id 
                    ? { ...p, bankData: { ...currentData, cashReceiptType: e.target.value as 'income-deduction' | 'expense-proof' } } 
                    : p
                ));
              }}
              className={cn(
                'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                'py-3 px-4 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]'
              )}
            >
              <option value="income-deduction">소득공제용(휴대폰 번호)</option>
              <option value="expense-proof">지출증빙용(사업자등록번호)</option>
            </select>
          </div>

          <Input
            label={payment.bankData?.cashReceiptType === 'expense-proof' ? '사업자등록번호' : '휴대폰 번호'}
            leftIcon={payment.bankData?.cashReceiptType === 'expense-proof' ? <Hash className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
            value={payment.bankData?.cashReceiptNumber || ''}
            onChange={(e) => {
              const currentData = payment.bankData!;
              setSplitPayments(splitPayments.map((p: any) => 
                p.id === payment.id 
                  ? { ...p, bankData: { ...currentData, cashReceiptNumber: e.target.value } } 
                  : p
              ));
            }}
            placeholder={payment.bankData?.cashReceiptType === 'expense-proof' ? '123-45-67890' : '010-1234-5678'}
          />
        </div>
      )}

      {/* 무통장 입금 계좌 정보 (Bank account info) */}
      {payment.bankData?.proofType !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-5 bg-gradient-to-br from-[#fab803]/5 to-[#1a2867]/5 rounded-xl border-2 border-[#fab803]/20">
            <p className="text-sm font-medium text-gray-900 mb-3">무통장 입금 계좌</p>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">{BANK_INFO.bank}</p>
                <p className="text-lg font-bold text-gray-900 font-mono">{BANK_INFO.account}</p>
                <p className="text-xs text-gray-500 mt-1">예금주: {BANK_INFO.holder}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyAccount}
                className={cn(
                  'px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2',
                  copied 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90'
                )}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
          </div>

          {/* 입금자명 (Depositor name - Optional) */}
          <Input
            label="입금자명 (선택사항)"
            leftIcon={<User className="w-4 h-4" />}
            value={payment.bankData?.depositorName || ''}
            onChange={(e) => {
              const currentData = payment.bankData!;
              setSplitPayments(splitPayments.map((p: any) => 
                p.id === payment.id 
                  ? { ...p, bankData: { ...currentData, depositorName: e.target.value } } 
                  : p
              ));
            }}
            placeholder="홍길동"
            hint="정확한 입금자명을 알려주시면 빠른 입금 확인이 가능합니다."
          />
        </motion.div>
      )}
    </div>
  );
};

interface PaymentMethodCardProps {
  id: PaymentMethod;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: boolean;
  onSelect: () => void;
}

const PaymentMethodCard = ({ id, name, desc, icon: Icon, selected, onSelect }: PaymentMethodCardProps) => (
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
    <Icon className={cn('w-7 h-7', selected ? 'text-[#1a2867]' : 'text-gray-500')} />
    <div className="text-center">
      <span className={cn(
        'block text-sm font-semibold',
        selected ? 'text-gray-900' : 'text-gray-700'
      )}>
        {name}
      </span>
      <span className="block text-xs text-gray-500 mt-0.5">{desc}</span>
    </div>
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

// ========== 카드 입력 컴포넌트 ==========
interface CardNumberInputProps {
  values: string[];
  onChange: (index: number, value: string) => void;
}

const CardNumberInput = ({ values, onChange }: CardNumberInputProps) => {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 4) {
      onChange(index, cleanValue);
      if (cleanValue.length === 4 && index < 3) {
        refs[index + 1].current?.focus();
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <CreditCard className="w-4 h-4 text-gray-400" />
        카드 번호
      </label>
      <div className="grid grid-cols-4 gap-3">
        {values.map((value, index) => (
          <input
            key={index}
            ref={refs[index]}
            type="text"
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            placeholder={['1234', '5678', '9012', '3456'][index]}
            maxLength={4}
            className={cn(
              'w-full rounded-xl border border-gray-200 bg-white text-gray-900 text-center font-mono',
              'py-3.5 px-3 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
              'hover:border-gray-300 placeholder:text-gray-300'
            )}
          />
        ))}
      </div>
    </div>
  );
};

// ========== 메인 컴포넌트 ==========
export default function Payment({ onNavigate, onBack }: PaymentProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const quoteData = location.state; // 견적서에서 전달된 데이터 (Quote data from previous page)
  
  const [paymentTerm, setPaymentTerm] = useState('100-pre');
  const [customPaymentTerm, setCustomPaymentTerm] = useState('');
  const [customInputMode, setCustomInputMode] = useState<'simple' | 'manual'>('simple'); // 간편 입력 / 수동 입력 (Simple input / Manual input)
  const [orderTiming, setOrderTiming] = useState('before'); // 발주 전/후 (Before/After ordering)
  const [orderPercent, setOrderPercent] = useState(''); // 발주 % (Order %)
  const [shipmentTiming, setShipmentTiming] = useState('before'); // 출고 전/후 (Before/After shipment)
  const [shipmentPercent, setShipmentPercent] = useState(''); // 출고 % (Shipment %)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('toss');
  const [isLoading, setIsLoading] = useState(false);
  
  // 키인 결제 상태
  const [keyinData, setKeyinData] = useState({
    name: '홍길동',
    productName: '인형 제작 견적 - Q-2024-12-001',
    orderNumber: 'Q-2024-12-001',
    installment: '0',
    cardNumbers: ['', '', '', ''],
    expMonth: '',
    expYear: '',
    email: 'customer@example.com'
  });

  // 기타 결제 상태
  const [otherPaymentDetails, setOtherPaymentDetails] = useState('');
  
  // 기타 결제 - 분할 결제 여부 (Other payment - Split payment status)
  const [splitPayment, setSplitPayment] = useState<boolean | null>(null);
  
  // 기타 결제 - 결제 주체가 여러명인지 (Other payment - Multiple payors)
  const [multiplePayors, setMultiplePayors] = useState<boolean | null>(null);
  
  // 기타 결제 - 결제 주체가 다른가요? (Other payment - Is the payor different?)
  const [isDifferentPayor, setIsDifferentPayor] = useState<boolean | null>(null);
  
  // 질문 접힘/펼침 상태 (Question collapsed/expanded state)
  const [isSplitQuestionCollapsed, setIsSplitQuestionCollapsed] = useState(false);
  const [isPayorQuestionCollapsed, setIsPayorQuestionCollapsed] = useState(false);
  
  // 단일 결제 주체 정보 (Single payor information)
  const [singlePayorInfo, setSinglePayorInfo] = useState({
    accountType: 'personal' as 'personal' | 'company',
    name: '',
    company: '',
    email: '',
    phone: '',
    paymentMethod: 'toss' as PaymentMethod,
    keyinData: null as KeyinData | null,
    bankData: null as BankData | null,
    memo: ''
  });

  // 분할 결제 정보 (Split payment details)
  const [splitPayments, setSplitPayments] = useState([
    { 
      id: 1, 
      amount: '', 
      memo: '', 
      paymentMethod: 'toss' as PaymentMethod, 
      keyinData: null as { installment: string; cardNumbers: string[]; expMonth: string; expYear: string } | null,
      bankData: null as { 
        depositorName: string;
        proofType: 'tax-invoice' | 'cash-receipt' | 'none';
        businessInfo?: {
          businessNumber: string;
          taxType: string;
          companyName: string;
          ceoName: string;
          businessAddress: string;
          headquarterAddress: string;
          businessType: string;
          businessItem: string;
          taxEmail: string;
        };
        cashReceiptType?: 'income-deduction' | 'expense-proof';
        cashReceiptNumber?: string;
        hasPreferredTaxDate?: boolean;
        taxIssueDate?: string;
      } | null,
      narabillFiles: [] as Array<{ id: string; file: File; instructions: string }>,
      contractFiles: [] as Array<{ id: string; file: File; instructions: string }>,
      isCompleted: false
    }
  ]);
  const [activePaymentTab, setActivePaymentTab] = useState(1);

  // 나라빌 파일 업로드 상태 (Narabill file upload state)
  const [narabillFiles, setNarabillFiles] = useState<Array<{ id: string; file: File; instructions: string }>>([]);
  const narabillFileInputRef = useRef<HTMLInputElement>(null);
  const [narabillNotes, setNarabillNotes] = useState(''); // 나라빌 기타 안내사항 (Narabill additional notes)

  // 수의 계약 파일 업로드 상태 (Contract file upload state)
  const [contractFiles, setContractFiles] = useState<Array<{ id: string; file: File; instructions: string }>>([]);
  const contractFileInputRef = useRef<HTMLInputElement>(null);
  const [contractNotes, setContractNotes] = useState(''); // 수의 계약 기타 안내사항 (Contract additional notes)

  // 총 결제 금액 (Total payment amount)
  const totalAmount = quoteData?.quoteAmount || 12254000;

  // 이미 입력된 금액의 합계 (Sum of entered amounts)
  const enteredTotal = splitPayments.reduce((sum, payment) => {
    const amount = parseInt(payment.amount.replace(/,/g, '')) || 0;
    return sum + amount;
  }, 0);

  // 남은 금액 (Remaining amount)
  const remainingAmount = totalAmount - enteredTotal;

  const selectedOption = PAYMENT_TERM_OPTIONS.find(opt => opt.value === paymentTerm);
  const showDeferredWarning = selectedOption?.hasDeferred;

  const updateKeyinData = <K extends keyof typeof keyinData>(
    field: K, 
    value: typeof keyinData[K]
  ) => {
    setKeyinData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 후불이 포함된 결제 조건 선택 시 → 전자 계약 정보 입력 페이지로 이동
    // If deferred payment is selected → Navigate to Electronic Contract page
    if (showDeferredWarning) {
      navigate('/econtract');
    } 
    // 무통장 입금 선택 시 → 결제 정보 입력 페이지로 이동
    // If bank transfer is selected → Navigate to Additional Info (Payment Info) page
    else if (paymentMethod === 'bank') {
      navigate('/additional-info');
    } 
    // 나라빌, 수의 계약 선택 시 → 배송 정보 입력 페이지로 이동
    // If Narabill or Contract is selected → Navigate to Shipping Info page
    else if (paymentMethod === 'narabill' || paymentMethod === 'contract') {
      navigate('/shipping-design');
    }
    // 토스페이먼츠, 안심 키인, 기타 결제 선택 시 → 배송 정보 입력 페이지로 이동
    // If Toss Payments, Keyin, or Other payment is selected → Navigate to Shipping Info page
    else if (paymentMethod === 'toss' || paymentMethod === 'keyin' || paymentMethod === 'other') {
      navigate('/shipping-design');
    }
    
    setIsLoading(false);
  };

  const getButtonText = () => {
    if (showDeferredWarning) return '전자 계약 정보 작성';
    if (paymentMethod === 'toss' || paymentMethod === 'keyin') return '결제하기';
    if (paymentMethod === 'narabill') return '나라빌 서류 제출 완료';
    if (paymentMethod === 'contract') return '수의 계약 서류 제출 완료';
    if (paymentMethod === 'other') return '기타 결제 문의 작성';
    return '결제 정보 입력';
  };

  // 월/년 옵션 생성
  const monthOptions = [
    { value: '', label: '월' },
    ...Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1).padStart(2, '0'),
      label: `${String(i + 1).padStart(2, '0')}월`
    }))
  ];

  const yearOptions = [
    { value: '', label: '년' },
    ...Array.from({ length: 10 }, (_, i) => {
      const year = new Date().getFullYear() + i;
      return { value: String(year).slice(-2), label: `${year}년` };
    })
  ];

  const installmentOptions = [
    { value: '0', label: '일시불' },
    ...Array.from({ length: 36 }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1}개월`
    }))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={onBack || (() => window.history.back())}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            뒤로 가기
          </Button>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-5xl mx-auto px-2 md:px-6 py-4 md:py-8">
        {/* 프로그레스바 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <OrderProgressBar currentStep={2} />
        </motion.div>

        {/* 페이지 헤더 - 카드 외부로 이동 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-[#1a2867] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-[#1a2867]/20">
              <CreditCard className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 text-[24px]">결제 수단 선택</h1>
              <p className="text-gray-500 mt-1 text-sm md:text-base">
                결제 조건과 결제 수단을 선택해주세요.
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
          <div className="p-3 md:p-8 space-y-6 md:space-y-8">
            {/* 결제 조건 선택 */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SectionHeader icon={<FileText className="w-5 h-5" />} title="결제 조건" />
              
              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-5">
                <Select
                  label="결제 방식 선택"
                  value={paymentTerm}
                  onChange={(e) => setPaymentTerm(e.target.value)}
                  options={PAYMENT_TERM_OPTIONS.map(opt => ({ 
                    value: opt.value, 
                    label: opt.label 
                  }))}
                />

                <AnimatePresence>
                  {paymentTerm === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {/* 입력 방식 선택 (Input mode selection) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          입력 방식 선택
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setCustomInputMode('simple')}
                            className={cn(
                              'px-4 py-3 rounded-xl border-2 font-medium transition-all text-sm',
                              customInputMode === 'simple'
                                ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            )}
                          >
                            간편 입력
                          </button>
                          <button
                            type="button"
                            onClick={() => setCustomInputMode('manual')}
                            className={cn(
                              'px-4 py-3 rounded-xl border-2 font-medium transition-all text-sm',
                              customInputMode === 'manual'
                                ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            )}
                          >
                            수동 입력
                          </button>
                        </div>
                      </div>

                      {/* 간편 입력 폼 (Simple input form) */}
                      {customInputMode === 'simple' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4 p-4 bg-white rounded-xl border border-gray-200"
                        >
                          {/* 발주 (Order) */}
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-900">발주</p>
                            <div className="grid grid-cols-2 gap-3">
                              <select
                                value={orderTiming}
                                onChange={(e) => setOrderTiming(e.target.value)}
                                className={cn(
                                  'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                                  'py-2.5 px-3 text-sm transition-all duration-200',
                                  'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]'
                                )}
                              >
                                <option value="before">전</option>
                                <option value="after">후</option>
                              </select>
                              <div className="space-y-1">
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={orderPercent}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, '');
                                      if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                                        setOrderPercent(value);
                                      }
                                    }}
                                    placeholder="0"
                                    className={cn(
                                      'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                                      'py-2.5 px-3 pr-8 text-sm transition-all duration-200',
                                      'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                      'placeholder:text-gray-400'
                                    )}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">%</span>
                                </div>
                                {orderPercent && (
                                  <p className="text-xs text-gray-500 px-1">
                                    ≈ {formatCurrency(Math.round(totalAmount * parseInt(orderPercent) / 100))}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 출고 (Shipment) */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">출고</p>
                              {orderPercent && !shipmentPercent && parseInt(orderPercent) < 100 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const remaining = 100 - parseInt(orderPercent);
                                    setShipmentPercent(remaining.toString());
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1a2867] bg-[#fab803]/10 hover:bg-[#fab803]/20 rounded-lg transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  잔금 입력
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <select
                                value={shipmentTiming}
                                onChange={(e) => setShipmentTiming(e.target.value)}
                                className={cn(
                                  'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                                  'py-2.5 px-3 text-sm transition-all duration-200',
                                  'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]'
                                )}
                              >
                                <option value="before">전</option>
                                <option value="after">후</option>
                              </select>
                              <div className="space-y-1">
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={shipmentPercent}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, '');
                                      if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                                        setShipmentPercent(value);
                                      }
                                    }}
                                    placeholder="0"
                                    className={cn(
                                      'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                                      'py-2.5 px-3 pr-8 text-sm transition-all duration-200',
                                      'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                      'placeholder:text-gray-400'
                                    )}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">%</span>
                                </div>
                                {shipmentPercent && (
                                  <p className="text-xs text-gray-500 px-1">
                                    ≈ {formatCurrency(Math.round(totalAmount * parseInt(shipmentPercent) / 100))}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 합계 확인 (Total check) */}
                          {(orderPercent || shipmentPercent) && (
                            <div className="pt-3 border-t border-gray-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">합계</span>
                                <span className={cn(
                                  "text-sm font-bold",
                                  (parseInt(orderPercent || '0') + parseInt(shipmentPercent || '0')) === 100
                                    ? 'text-emerald-600'
                                    : 'text-red-600'
                                )}>
                                  {parseInt(orderPercent || '0') + parseInt(shipmentPercent || '0')}%
                                </span>
                              </div>
                              {(parseInt(orderPercent || '0') + parseInt(shipmentPercent || '0')) === 100 && (
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">총 결제 금액</span>
                                  <span className="text-sm font-bold text-gray-900">
                                    {formatCurrency(totalAmount)}
                                  </span>
                                </div>
                              )}
                              {(parseInt(orderPercent || '0') + parseInt(shipmentPercent || '0')) !== 100 && (
                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  합계가 100%가 되어야 합니다.
                                </p>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* 수동 입력 폼 (Manual input form) */}
                      {customInputMode === 'manual' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            결제 방식 직접 입력
                          </label>
                          <textarea
                            value={customPaymentTerm}
                            onChange={(e) => setCustomPaymentTerm(e.target.value)}
                            placeholder="예 : 발주 전 30% 선금, 출고 전 40%, 출고 후 30%"
                            rows={3}
                            className={cn(
                              'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                              'py-3.5 px-4 transition-all duration-200 resize-none',
                              'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                              'placeholder:text-gray-400'
                            )}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {(showDeferredWarning || (paymentTerm === 'custom' && (orderTiming === 'after' || shipmentTiming === 'after'))) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <AlertBox type="warning" title="전자 계약 필수">
                        일반적으로 공공 기관 또는 상장사 외에는 후불 결제가 어려울 수 있으며, 내부 심사 기준에 따라 후불 결제가 불가할 수 있습니다.
                      </AlertBox>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* 결제 수단 선택 */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SectionHeader icon={<Wallet className="w-5 h-5" />} title="결제 수단" />
              
              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      {...method}
                      selected={paymentMethod === method.id}
                      onSelect={() => setPaymentMethod(method.id)}
                    />
                  ))}
                </div>

                {/* 토스페이먼츠 안내 문구 (Toss Payments Notice) */}
                <AnimatePresence>
                  {paymentMethod === 'toss' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 leading-relaxed">
                          토스페이먼츠 결제창 내에서 이메일을 입력해 주시면, 결제 완료 후 결제 영수증이 자동으로 발송됩니다.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 키인 결제 폼 */}
                <AnimatePresence>
                  {paymentMethod === 'keyin' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-6 mt-6 space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="이름"
                          leftIcon={<User className="w-4 h-4" />}
                          value={keyinData.name}
                          disabled
                        />
                        <Input
                          label="주문 번호"
                          leftIcon={<Hash className="w-4 h-4" />}
                          value={keyinData.orderNumber}
                          disabled
                        />
                      </div>

                      <Input
                        label="상품명"
                        leftIcon={<FileText className="w-4 h-4" />}
                        value={keyinData.productName}
                        disabled
                      />

                      <Select
                        label="할부 개월"
                        value={keyinData.installment}
                        onChange={(e) => updateKeyinData('installment', e.target.value)}
                        options={installmentOptions}
                      />

                      <CardNumberInput
                        values={keyinData.cardNumbers}
                        onChange={(index, value) => {
                          const newNumbers = [...keyinData.cardNumbers];
                          newNumbers[index] = value;
                          updateKeyinData('cardNumbers', newNumbers);
                        }}
                      />

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          유효 기간
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <Select
                            value={keyinData.expMonth}
                            onChange={(e) => updateKeyinData('expMonth', e.target.value)}
                            options={monthOptions}
                          />
                          <Select
                            value={keyinData.expYear}
                            onChange={(e) => updateKeyinData('expYear', e.target.value)}
                            options={yearOptions}
                          />
                        </div>
                      </div>

                      <Input
                        label="이메일"
                        leftIcon={<Mail className="w-4 h-4" />}
                        hint="*결제 영수증을 수령할 이메일을 입력해 주세요."
                        value={keyinData.email}
                        disabled
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 무통장 입금 안내 */}
                <AnimatePresence>
                  {paymentMethod === 'bank' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-6 mt-6"
                    >
                      <AlertBox type="info">
                        <p className="font-medium mb-1">무통장 입금 선택</p>
                        무통장 입금을 선택하셨습니다. 다음 단계에서 추가 정보를 입력해주세요.
                      </AlertBox>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 나라빌 안내 (Narabill Notice) */}
                <AnimatePresence>
                  {paymentMethod === 'narabill' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-6 mt-6 space-y-4"
                    >
                      <AlertBox type="info">
                        <p className="font-medium mb-1">나라빌 결제 선택</p>
                        필요한 서류를 업로드하고 작성 가이드를 입력해 주세요. 담당자가 확인 후 연락드립니다.
                      </AlertBox>

                      {/* 파일 업로드 버튼 (File upload button) */}
                      <div>
                        <input
                          ref={narabillFileInputRef}
                          type="file"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const newFiles = files.map(file => ({
                              id: `${Date.now()}-${Math.random()}`,
                              file,
                              instructions: ''
                            }));
                            setNarabillFiles([...narabillFiles, ...newFiles]);
                            if (narabillFileInputRef.current) {
                              narabillFileInputRef.current.value = '';
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => narabillFileInputRef.current?.click()}
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1a2867] hover:bg-[#1a2867]/5 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-[#1a2867]"
                        >
                          <Upload className="w-5 h-5" />
                          <span className="font-medium">서류 파일 업로드</span>
                        </button>
                      </div>

                      {/* 업로드된 파일 목록 (Uploaded files list) */}
                      {narabillFiles.length > 0 && (
                        <div className="space-y-3">
                          {narabillFiles.map((fileItem) => (
                            <div key={fileItem.id} className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <FileText className="w-5 h-5 text-[#1a2867] flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {fileItem.file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(fileItem.file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNarabillFiles(narabillFiles.filter(f => f.id !== fileItem.id));
                                  }}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                                >
                                  <X className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                              
                              {/* 작성 요령 입력 (Instructions input) */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  작성 가이드
                                </label>
                                <textarea
                                  value={fileItem.instructions}
                                  onChange={(e) => {
                                    setNarabillFiles(narabillFiles.map(f => 
                                      f.id === fileItem.id 
                                        ? { ...f, instructions: e.target.value }
                                        : f
                                    ));
                                  }}
                                  placeholder="필요한 계약 서류를 업로드하고 작성 가이드를 입력해 주세요. 담당자가 확인 후 연락드립니다."
                                  rows={3}
                                  className={cn(
                                    'w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-sm',
                                    'py-2.5 px-3 transition-all duration-200 resize-none',
                                    'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                    'placeholder:text-gray-400'
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {narabillFiles.length === 0 && (
                        <div className="text-center py-6 text-sm text-gray-500">
                          업로드된 서류가 없습니다. 위 버튼을 클릭하여 서류를 업로드해주세요.
                        </div>
                      )}

                      {/* 기타 안내 사항 입력 (Additional notes input) */}
                      <div className="pt-4 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          기타 안내 사항 (선택사항)
                        </label>
                        <textarea
                          value={narabillNotes}
                          onChange={(e) => setNarabillNotes(e.target.value)}
                          placeholder="나라빌 관련 추가 안내 사항이나 요청사항을 입력해 주세요. (예: 특정 기관명으로 발행 필요, 납품 기한 등)"
                          rows={4}
                          className={cn(
                            'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                            'py-3 px-4 transition-all duration-200 resize-none',
                            'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                            'placeholder:text-gray-400'
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 수의 계약 안내 (Contract Notice) */}
                <AnimatePresence>
                  {paymentMethod === 'contract' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-6 mt-6 space-y-4"
                    >
                      <AlertBox type="info">
                        <p className="font-medium mb-1">수의 계약 선택</p>
                        필요한 계약 서류를 업로드하고 작성 가이드를 입력해 주세요. 담당자가 확인 후 연락드립니다.
                      </AlertBox>

                      {/* 파일 업로드 버튼 (File upload button) */}
                      <div>
                        <input
                          ref={contractFileInputRef}
                          type="file"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            const newFiles = files.map(file => ({
                              id: `${Date.now()}-${Math.random()}`,
                              file,
                              instructions: ''
                            }));
                            setContractFiles([...contractFiles, ...newFiles]);
                            if (contractFileInputRef.current) {
                              contractFileInputRef.current.value = '';
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => contractFileInputRef.current?.click()}
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1a2867] hover:bg-[#1a2867]/5 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-[#1a2867]"
                        >
                          <Upload className="w-5 h-5" />
                          <span className="font-medium">계약 서류 업로드</span>
                        </button>
                      </div>

                      {/* 업로드된 파일 목록 (Uploaded files list) */}
                      {contractFiles.length > 0 && (
                        <div className="space-y-3">
                          {contractFiles.map((fileItem) => (
                            <div key={fileItem.id} className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <Briefcase className="w-5 h-5 text-[#1a2867] flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {fileItem.file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(fileItem.file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContractFiles(contractFiles.filter(f => f.id !== fileItem.id));
                                  }}
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                                >
                                  <X className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                              
                              {/* 작성 요령 입력 (Instructions input) */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-2">
                                  작성 가이드
                                </label>
                                <textarea
                                  value={fileItem.instructions}
                                  onChange={(e) => {
                                    setContractFiles(contractFiles.map(f => 
                                      f.id === fileItem.id 
                                        ? { ...f, instructions: e.target.value }
                                        : f
                                    ));
                                  }}
                                  placeholder="필요한 계약 서류를 업로드하고 작성 가이드를 입력해 주세요. 담당자가 확인 후 연락드립니다."
                                  rows={3}
                                  className={cn(
                                    'w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-sm',
                                    'py-2.5 px-3 transition-all duration-200 resize-none',
                                    'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                    'placeholder:text-gray-400'
                                  )}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {contractFiles.length === 0 && (
                        <div className="text-center py-6 text-sm text-gray-500">
                          업로드된 서류가 없습니다. 위 버튼을 클릭하여 서류를 업로드해주세요.
                        </div>
                      )}

                      {/* 기타 안내 사항 입력 (Additional notes input) */}
                      <div className="pt-4 border-t border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          기타 안내 사항 (선택사항)
                        </label>
                        <textarea
                          value={contractNotes}
                          onChange={(e) => setContractNotes(e.target.value)}
                          placeholder="수의 계약 관련 추가 안내 사항이나 요청사항을 입력해 주세요. (예: 계약 기간, 특정 조건, 납품 요구사항 등)"
                          rows={4}
                          className={cn(
                            'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                            'py-3 px-4 transition-all duration-200 resize-none',
                            'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                            'placeholder:text-gray-400'
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 기타 결제 */}
                <AnimatePresence>
                  {paymentMethod === 'other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200 pt-6 mt-6 space-y-5"
                    >
                      {/* 첫 번째 질문: 결제 대금을 나누어서 결제하실 예정인가요? (First Question: Will you split the payment?) */}
                      <div>
                        {/* 접힌 상태 헤더 (Collapsed header) */}
                        {isSplitQuestionCollapsed && splitPayment !== null && (
                          <motion.button
                            type="button"
                            onClick={() => setIsSplitQuestionCollapsed(false)}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-[#1a2867] bg-[#1a2867]/5 hover:bg-[#1a2867]/10 transition-all mb-3"
                          >
                            <div className="text-left">
                              <p className="text-sm text-gray-700">
                                결제 대금을 나누어서 결제하실 예정인가요?{' '}
                                <span className="font-semibold text-[#1a2867]">
                                  {splitPayment ? '예' : '아니오'}
                                </span>
                              </p>
                            </div>
                            <ChevronDown className="w-5 h-5 text-[#1a2867] flex-shrink-0" />
                          </motion.button>
                        )}

                        {/* 펼쳐진 상태 질문 (Expanded question) */}
                        {!isSplitQuestionCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              결제 대금을 나누어서 결제하실 예정인가요?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setSplitPayment(true);
                                  setMultiplePayors(null); // Reset second question
                                  setOtherPaymentDetails(''); // Reset details
                                  setIsSplitQuestionCollapsed(true); // 질문 접기 (Collapse question)
                                  setIsPayorQuestionCollapsed(false); // 두 번째 질문 펼치기 (Expand second question)
                                }}
                                className={cn(
                                  'p-4 rounded-xl border-2 transition-all font-medium',
                                  splitPayment === true
                                    ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                )}
                              >
                                예
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSplitPayment(false);
                                  setMultiplePayors(null); // Reset second question
                                  setIsDifferentPayor(null); // Reset different payor question
                                  setOtherPaymentDetails(''); // Reset details
                                  setIsSplitQuestionCollapsed(true); // 질문 접기 (Collapse question)
                                  setIsPayorQuestionCollapsed(false); // 두 번째 질문 펼치기 (Expand second question)
                                }}
                                className={cn(
                                  'p-4 rounded-xl border-2 transition-all font-medium',
                                  splitPayment === false
                                    ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                )}
                              >
                                아니오
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* 두 번째 질문: 결제 주체가 여러명인가요? (Second Question: Are there multiple payors?) */}
                      <AnimatePresence>
                        {splitPayment === true && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {/* 접힌 상태 헤더 (Collapsed header) */}
                            {isPayorQuestionCollapsed && multiplePayors !== null && (
                              <motion.button
                                type="button"
                                onClick={() => setIsPayorQuestionCollapsed(false)}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-[#1a2867] bg-[#1a2867]/5 hover:bg-[#1a2867]/10 transition-all mb-3"
                              >
                                <div className="text-left">
                                  <p className="text-sm text-gray-700">
                                    결제 주체가 여러명인가요?{' '}
                                    <span className="font-semibold text-[#1a2867]">
                                      {multiplePayors ? '예' : '아니오'}
                                    </span>
                                  </p>
                                </div>
                                <ChevronDown className="w-5 h-5 text-[#1a2867] flex-shrink-0" />
                              </motion.button>
                            )}

                            {/* 펼쳐진 상태 질문 (Expanded question) */}
                            {!isPayorQuestionCollapsed && (
                              <>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                  결제 주체가 여러명인가요?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMultiplePayors(true);
                                      setOtherPaymentDetails(''); // Reset details
                                      setIsPayorQuestionCollapsed(true); // 질문 접기 (Collapse question)
                                    }}
                                    className={cn(
                                      'p-4 rounded-xl border-2 transition-all font-medium',
                                      multiplePayors === true
                                        ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    )}
                                  >
                                    예
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMultiplePayors(false);
                                      setOtherPaymentDetails(''); // Reset details
                                      setIsPayorQuestionCollapsed(true); // 질문 접기 (Collapse question)
                                    }}
                                    className={cn(
                                      'p-4 rounded-xl border-2 transition-all font-medium',
                                      multiplePayors === false
                                        ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    )}
                                  >
                                    아니오
                                  </button>
                                </div>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* 두 번째 질문: 실제 결제 주체가 다른가요? (Second Question: Is the payor different?) */}
                      <AnimatePresence>
                        {splitPayment === false && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {/* 접힌 상태 헤더 (Collapsed header) */}
                            {isPayorQuestionCollapsed && isDifferentPayor !== null && (
                              <motion.button
                                type="button"
                                onClick={() => setIsPayorQuestionCollapsed(false)}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-[#1a2867] bg-[#1a2867]/5 hover:bg-[#1a2867]/10 transition-all mb-3"
                              >
                                <div className="text-left">
                                  <p className="text-sm text-gray-700">
                                    실제 결제 주체가 다른가요?{' '}
                                    <span className="font-semibold text-[#1a2867]">
                                      {isDifferentPayor ? '예' : '아니오'}
                                    </span>
                                  </p>
                                </div>
                                <ChevronDown className="w-5 h-5 text-[#1a2867] flex-shrink-0" />
                              </motion.button>
                            )}

                            {/* 펼쳐진 상태 질문 (Expanded question) */}
                            {!isPayorQuestionCollapsed && (
                              <>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                  실제 결제 주체가 다른가요?
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsDifferentPayor(true);
                                      setOtherPaymentDetails(''); // Reset details
                                      setIsPayorQuestionCollapsed(true); // 질문 접기 (Collapse question)
                                    }}
                                    className={cn(
                                      'p-4 rounded-xl border-2 transition-all font-medium',
                                      isDifferentPayor === true
                                        ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    )}
                                  >
                                    예
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsDifferentPayor(false);
                                      setSinglePayorInfo({
                                        accountType: 'personal',
                                        name: '',
                                        company: '',
                                        email: '',
                                        phone: '',
                                        paymentMethod: 'toss',
                                        keyinData: null,
                                        bankData: null,
                                        memo: ''
                                      }); // Reset payor info
                                      setIsPayorQuestionCollapsed(true); // 질문 접기 (Collapse question)
                                    }}
                                    className={cn(
                                      'p-4 rounded-xl border-2 transition-all font-medium',
                                      isDifferentPayor === false
                                        ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    )}
                                  >
                                    아니오
                                  </button>
                                </div>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* 결제 주체 정보 입력 - "실제 결제 주체가 다른가요? 예" 선택 시 표시 (Payor information input - shown when "Yes" is selected) */}
                      <AnimatePresence>
                        {splitPayment === false && isDifferentPayor === true && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-900">
                                  <span className="font-medium">중요:</span> 입력하신 담당자 이메일과 연락처로 결제 안내가 발송됩니다. 정확하게 입력해 주세요.
                                </p>
                              </div>
                            </div>

                            {/* 가입 유형 선택 (Account type selection) */}
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">유형</label>
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  type="button"
                                  onClick={() => setSinglePayorInfo({ ...singlePayorInfo, accountType: 'personal' })}
                                  className={cn(
                                    'px-4 py-2.5 rounded-xl border-2 font-medium transition-all text-sm',
                                    singlePayorInfo.accountType === 'personal'
                                      ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                  )}
                                >
                                  개인
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSinglePayorInfo({ ...singlePayorInfo, accountType: 'company' })}
                                  className={cn(
                                    'px-4 py-2.5 rounded-xl border-2 font-medium transition-all text-sm',
                                    singlePayorInfo.accountType === 'company'
                                      ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                  )}
                                >
                                  회사
                                </button>
                              </div>
                            </div>

                            {/* 이름 (Name) */}
                            <Input
                              label="이름"
                              leftIcon={<User className="w-4 h-4" />}
                              value={singlePayorInfo.name}
                              onChange={(e) => setSinglePayorInfo({ ...singlePayorInfo, name: e.target.value })}
                              placeholder="홍길동"
                            />

                            {/* 회사명 (Company name - only for company type) */}
                            {singlePayorInfo.accountType === 'company' && (
                              <Input
                                label="회사명"
                                leftIcon={<Building2 className="w-4 h-4" />}
                                value={singlePayorInfo.company}
                                onChange={(e) => setSinglePayorInfo({ ...singlePayorInfo, company: e.target.value })}
                                placeholder="주식회사 인프라이즈"
                              />
                            )}

                            {/* 담당자 이메일 (Contact email) */}
                            <Input
                              label="담당자 이메일"
                              leftIcon={<Mail className="w-4 h-4" />}
                              value={singlePayorInfo.email}
                              onChange={(e) => setSinglePayorInfo({ ...singlePayorInfo, email: e.target.value })}
                              placeholder="contact@example.com"
                            />

                            {/* 담당자 연락처 (Contact phone) */}
                            <Input
                              label="담당자 연락처"
                              leftIcon={<Phone className="w-4 h-4" />}
                              value={singlePayorInfo.phone}
                              onChange={(e) => setSinglePayorInfo({ ...singlePayorInfo, phone: e.target.value })}
                              placeholder="010-1234-5678"
                            />

                            {/* 결제 수단 선택 (Payment method selection) */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                결제 수단 선택
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {PAYMENT_METHODS.filter(m => m.id !== 'other').map((method) => (
                                  <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => {
                                      setSinglePayorInfo({ ...singlePayorInfo, paymentMethod: method.id });
                                    }}
                                    className={cn(
                                      'flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all text-sm',
                                      singlePayorInfo.paymentMethod === method.id
                                        ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867] font-medium'
                                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    )}
                                  >
                                    <method.icon className="w-4 h-4" />
                                    <span>{method.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 토스페이먼츠 안내 (Toss Payments notice) */}
                            {singlePayorInfo.paymentMethod === 'toss' && (
                              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-700 leading-relaxed">
                                  토스페이먼츠 결제창에서 이메일 입력 시 결제 영수증이 자동 발송됩니다.
                                </p>
                              </div>
                            )}

                            {/* 키인 결제 추가 정보 (Keyin additional info) */}
                            {singlePayorInfo.paymentMethod === 'keyin' && (
                              <div className="space-y-4 pt-4 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-700">키인 결제 정보</p>
                                
                                <Select
                                  label="할부 개월"
                                  value={singlePayorInfo.keyinData?.installment || '0'}
                                  onChange={(e) => {
                                    setSinglePayorInfo({
                                      ...singlePayorInfo,
                                      keyinData: {
                                        installment: e.target.value,
                                        cardNumbers: singlePayorInfo.keyinData?.cardNumbers || ['', '', '', ''],
                                        expMonth: singlePayorInfo.keyinData?.expMonth || '',
                                        expYear: singlePayorInfo.keyinData?.expYear || ''
                                      }
                                    });
                                  }}
                                  options={installmentOptions}
                                />

                                <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    카드 번호
                                  </label>
                                  <div className="grid grid-cols-4 gap-2">
                                    {[0, 1, 2, 3].map((index) => (
                                      <input
                                        key={index}
                                        type="text"
                                        value={singlePayorInfo.keyinData?.cardNumbers?.[index] || ''}
                                        onChange={(e) => {
                                          const value = e.target.value.replace(/\D/g, '');
                                          if (value.length <= 4) {
                                            const newCardNumbers = [...(singlePayorInfo.keyinData?.cardNumbers || ['', '', '', ''])];
                                            newCardNumbers[index] = value;
                                            setSinglePayorInfo({
                                              ...singlePayorInfo,
                                              keyinData: {
                                                installment: singlePayorInfo.keyinData?.installment || '0',
                                                cardNumbers: newCardNumbers,
                                                expMonth: singlePayorInfo.keyinData?.expMonth || '',
                                                expYear: singlePayorInfo.keyinData?.expYear || ''
                                              }
                                            });
                                          }
                                        }}
                                        placeholder={['1234', '5678', '9012', '3456'][index]}
                                        maxLength={4}
                                        className={cn(
                                          'w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-center font-mono text-sm',
                                          'py-2.5 px-2 transition-all duration-200',
                                          'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                          'placeholder:text-gray-400'
                                        )}
                                      />
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <Select
                                    label="유효기간 (월)"
                                    value={singlePayorInfo.keyinData?.expMonth || ''}
                                    onChange={(e) => {
                                      setSinglePayorInfo({
                                        ...singlePayorInfo,
                                        keyinData: {
                                          installment: singlePayorInfo.keyinData?.installment || '0',
                                          cardNumbers: singlePayorInfo.keyinData?.cardNumbers || ['', '', '', ''],
                                          expMonth: e.target.value,
                                          expYear: singlePayorInfo.keyinData?.expYear || ''
                                        }
                                      });
                                    }}
                                    options={monthOptions}
                                  />

                                  <Select
                                    label="유효기간 (년)"
                                    value={singlePayorInfo.keyinData?.expYear || ''}
                                    onChange={(e) => {
                                      setSinglePayorInfo({
                                        ...singlePayorInfo,
                                        keyinData: {
                                          installment: singlePayorInfo.keyinData?.installment || '0',
                                          cardNumbers: singlePayorInfo.keyinData?.cardNumbers || ['', '', '', ''],
                                          expMonth: singlePayorInfo.keyinData?.expMonth || '',
                                          expYear: e.target.value
                                        }
                                      });
                                    }}
                                    options={yearOptions}
                                  />
                                </div>
                              </div>
                            )}

                            {/* 무통장 입금 추가 정보 (Bank transfer additional info) */}
                            {singlePayorInfo.paymentMethod === 'bank' && (
                              <BankTransferSectionSingle 
                                payorInfo={singlePayorInfo} 
                                setPayorInfo={setSinglePayorInfo} 
                              />
                            )}

                            {/* 메모 (Memo) */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                메모 (선택사항)
                              </label>
                              <textarea
                                value={singlePayorInfo.memo}
                                onChange={(e) => setSinglePayorInfo({ ...singlePayorInfo, memo: e.target.value })}
                                placeholder="추가 요청사항이나 특이사항을 입력해 주세요."
                                rows={3}
                                className={cn(
                                  'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                                  'py-3 px-4 transition-all duration-200 resize-none',
                                  'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                  'placeholder:text-gray-400'
                                )}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* 기타 결제 상세 내용 입력 - "아니오" 선택 시 표시 (Payment details input - shown when "No" is selected) */}
                      <AnimatePresence>
                        {splitPayment === false && isDifferentPayor === false && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                기타 결제 상세 내용
                              </label>
                              <p className="text-xs text-gray-500 mb-3">
                                *결제 방법을 상세히 입력해 주세요. (예: 법인카드 결제, 특정 결제 수단 요청 등)
                              </p>
                              <textarea
                                value={otherPaymentDetails}
                                onChange={(e) => setOtherPaymentDetails(e.target.value)}
                                placeholder="예: 법인카드로 일시불 결제 예정"
                                rows={6}
                                className={cn(
                                  'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                                  'py-3.5 px-4 transition-all duration-200 resize-none',
                                  'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                  'placeholder:text-gray-400'
                                )}
                              />
                            </div>
                            
                            <AlertBox type="info" title="기타 결제 안내">
                              담당자가 입력하신 내용을 검토한 후 연락드립니다. 
                              영업일 기준 1~2시간 내에 회신 예정입니다.
                            </AlertBox>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* 분할 결제 탭 UI - "결제 주체 여러명? 아니오" 선택 시 (Split payment tabs - Single payor splitting payments) */}
                      <AnimatePresence>
                        {splitPayment === true && multiplePayors === false && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            {/* 남은 금액 표시 (Remaining amount display) */}
                            <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">총 결제 금액</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">입력한 금액 합계</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(enteredTotal)}</span>
                              </div>
                              <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">남은 금액</span>
                                  <span className={cn(
                                    "text-lg font-bold",
                                    remainingAmount < 0 ? "text-red-600" : remainingAmount === 0 ? "text-emerald-600" : "text-[#1a2867]"
                                  )}>
                                    {formatCurrency(remainingAmount)}
                                  </span>
                                </div>
                                {remainingAmount < 0 && (
                                  <p className="text-xs text-red-600 mt-1">
                                    * 입력한 금액이 총 결제 금액을 초과했습니다.
                                  </p>
                                )}
                                {remainingAmount === 0 && (
                                  <p className="text-xs text-emerald-600 mt-1">
                                    * 금액이 정확히 일치합니다.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* 탭 메뉴 (Tab menu) */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                              {splitPayments.map((payment) => (
                                <button
                                  key={payment.id}
                                  type="button"
                                  onClick={(e) => {
                                    // X 버튼 클릭 시에는 탭 전환하지 않음 (Don't switch tab when clicking X button)
                                    if ((e.target as HTMLElement).closest('.delete-btn')) return;
                                    setActivePaymentTab(payment.id);
                                  }}
                                  className={cn(
                                    'flex-shrink-0 px-4 py-2.5 rounded-lg transition-all font-medium text-sm flex items-center gap-2',
                                    activePaymentTab === payment.id
                                      ? 'bg-[#1a2867] text-white shadow-md'
                                      : payment.isCompleted
                                      ? 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  )}
                                >
                                  {payment.isCompleted && (
                                    <Check className="w-4 h-4" />
                                  )}
                                  <span>{payment.id}차 결제</span>
                                  {splitPayments.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newPayments = splitPayments.filter(p => p.id !== payment.id);
                                        setSplitPayments(newPayments);
                                        if (activePaymentTab === payment.id && newPayments.length > 0) {
                                          setActivePaymentTab(newPayments[0].id);
                                        }
                                      }}
                                      className="delete-btn p-0.5 rounded hover:bg-white/20 transition-all"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newId = Math.max(...splitPayments.map(p => p.id)) + 1;
                                  setSplitPayments([...splitPayments, { id: newId, amount: '', memo: '', paymentMethod: 'toss' as PaymentMethod, keyinData: null, bankData: null, narabillFiles: [], contractFiles: [], isCompleted: false }]);
                                  setActivePaymentTab(newId);
                                }}
                                className="flex-shrink-0 p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* 활성 탭 내용 (Active tab content) */}
                            <AnimatePresence mode="wait">
                              {splitPayments.map((payment) => 
                                payment.id === activePaymentTab && (
                                  <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white rounded-xl p-5 border border-gray-200 space-y-5"
                                  >
                                    {/* 금액 입력 (Amount input) */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        결제 금액
                                      </label>
                                      <input
                                        type="text"
                                        value={payment.amount}
                                        onChange={(e) => {
                                          const value = e.target.value.replace(/[^0-9]/g, '');
                                          const formatted = value ? new Intl.NumberFormat('ko-KR').format(parseInt(value)) : '';
                                          setSplitPayments(splitPayments.map(p => 
                                            p.id === payment.id ? { ...p, amount: formatted } : p
                                          ));
                                        }}
                                        placeholder="금액 입력"
                                        className={cn(
                                          'w-full rounded-xl border bg-white text-gray-900',
                                          'py-3.5 px-4 transition-all duration-200',
                                          'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                          'placeholder:text-gray-400',
                                          remainingAmount < 0 ? 'border-red-300' : 'border-gray-200'
                                        )}
                                      />
                                      {remainingAmount < 0 && (
                                        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3" />
                                          입력한 금액이 총 결제 금액을 초과했습니다.
                                        </p>
                                      )}
                                    </div>

                                    {/* 결제 수단 선택 (Payment method selection) */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-3">
                                        결제 수단 선택
                                      </label>
                                      <div className="grid grid-cols-2 gap-2">
                                        {PAYMENT_METHODS.filter(m => m.id !== 'other').map((method) => (
                                          <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => {
                                              setSplitPayments(splitPayments.map(p => 
                                                p.id === payment.id ? { ...p, paymentMethod: method.id } : p
                                              ));
                                            }}
                                            className={cn(
                                              'flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all text-sm',
                                              payment.paymentMethod === method.id
                                                ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867] font-medium'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                            )}
                                          >
                                            <method.icon className="w-4 h-4" />
                                            <span>{method.name}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* 토스페이먼츠 안내 (Toss Payments notice) */}
                                    {payment.paymentMethod === 'toss' && (
                                      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-gray-700 leading-relaxed">
                                          토스페이먼츠 결제창에서 이메일 입력 시 결제 영수증이 자동 발송됩니다.
                                        </p>
                                      </div>
                                    )}

                                    {/* 키인 결제 추가 정보 (Keyin additional info) */}
                                    {payment.paymentMethod === 'keyin' && (
                                      <div className="space-y-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-medium text-gray-700">키인 결제 정보</p>
                                        
                                        <Select
                                          label="할부 개월"
                                          value={payment.keyinData?.installment || '0'}
                                          onChange={(e) => {
                                            setSplitPayments(splitPayments.map(p => 
                                              p.id === payment.id 
                                                ? { 
                                                    ...p, 
                                                    keyinData: { 
                                                      installment: e.target.value,
                                                      cardNumbers: payment.keyinData?.cardNumbers || ['', '', '', ''],
                                                      expMonth: payment.keyinData?.expMonth || '',
                                                      expYear: payment.keyinData?.expYear || ''
                                                    } 
                                                  } 
                                                : p
                                            ));
                                          }}
                                          options={installmentOptions}
                                        />

                                        <div className="space-y-2">
                                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                            카드 번호
                                          </label>
                                          <div className="grid grid-cols-4 gap-2">
                                            {[0, 1, 2, 3].map((index) => (
                                              <input
                                                key={index}
                                                type="text"
                                                value={payment.keyinData?.cardNumbers?.[index] || ''}
                                                onChange={(e) => {
                                                  const value = e.target.value.replace(/\D/g, '');
                                                  if (value.length <= 4) {
                                                    const newCardNumbers = [...(payment.keyinData?.cardNumbers || ['', '', '', ''])];
                                                    newCardNumbers[index] = value;
                                                    setSplitPayments(splitPayments.map(p => 
                                                      p.id === payment.id 
                                                        ? { 
                                                            ...p, 
                                                            keyinData: { 
                                                              installment: payment.keyinData?.installment || '0',
                                                              cardNumbers: newCardNumbers,
                                                              expMonth: payment.keyinData?.expMonth || '',
                                                              expYear: payment.keyinData?.expYear || ''
                                                            } 
                                                          } 
                                                        : p
                                                    ));
                                                  }
                                                }}
                                                placeholder={['1234', '5678', '9012', '3456'][index]}
                                                maxLength={4}
                                                className={cn(
                                                  'w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-center font-mono text-sm',
                                                  'py-2.5 px-2 transition-all duration-200',
                                                  'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                                  'placeholder:text-gray-300'
                                                )}
                                              />
                                            ))}
                                          </div>
                                        </div>

                                        <div>
                                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            유효 기간
                                          </label>
                                          <div className="grid grid-cols-2 gap-3">
                                            <Select
                                              value={payment.keyinData?.expMonth || ''}
                                              onChange={(e) => {
                                                setSplitPayments(splitPayments.map(p => 
                                                  p.id === payment.id 
                                                    ? { 
                                                        ...p, 
                                                        keyinData: { 
                                                          installment: payment.keyinData?.installment || '0',
                                                          cardNumbers: payment.keyinData?.cardNumbers || ['', '', '', ''],
                                                          expMonth: e.target.value,
                                                          expYear: payment.keyinData?.expYear || ''
                                                        } 
                                                      } 
                                                    : p
                                                ));
                                              }}
                                              options={monthOptions}
                                            />
                                            <Select
                                              value={payment.keyinData?.expYear || ''}
                                              onChange={(e) => {
                                                setSplitPayments(splitPayments.map(p => 
                                                  p.id === payment.id 
                                                    ? { 
                                                        ...p, 
                                                        keyinData: { 
                                                          installment: payment.keyinData?.installment || '0',
                                                          cardNumbers: payment.keyinData?.cardNumbers || ['', '', '', ''],
                                                          expMonth: payment.keyinData?.expMonth || '',
                                                          expYear: e.target.value
                                                        } 
                                                      } 
                                                    : p
                                                ));
                                              }}
                                              options={yearOptions}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* 무통장 입금 추가 정보 (Bank transfer additional info) */}
                                    {payment.paymentMethod === 'bank' && (
                                      <BankTransferSection payment={payment} setSplitPayments={setSplitPayments} splitPayments={splitPayments} />
                                    )}

                                    {/* 나라빌 파일 업로드 (Narabill file upload) */}
                                    {payment.paymentMethod === 'narabill' && (
                                      <div className="space-y-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-medium text-gray-700">나라빌 서류 업로드</p>
                                        
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.multiple = true;
                                            input.onchange = (e: any) => {
                                              const files = Array.from(e.target.files || []) as File[];
                                              const newFiles = files.map(file => ({
                                                id: `${Date.now()}-${Math.random()}`,
                                                file,
                                                instructions: ''
                                              }));
                                              setSplitPayments(splitPayments.map(p => 
                                                p.id === payment.id 
                                                  ? { ...p, narabillFiles: [...(p.narabillFiles || []), ...newFiles] }
                                                  : p
                                              ));
                                            };
                                            input.click();
                                          }}
                                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1a2867] hover:bg-[#1a2867]/5 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-[#1a2867]"
                                        >
                                          <Upload className="w-5 h-5" />
                                          <span className="font-medium">서류 파일 업로드</span>
                                        </button>

                                        {payment.narabillFiles && payment.narabillFiles.length > 0 && (
                                          <div className="space-y-3">
                                            {payment.narabillFiles.map((fileItem) => (
                                              <div key={fileItem.id} className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <FileText className="w-5 h-5 text-[#1a2867] flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                      <p className="text-sm font-medium text-gray-900 truncate">
                                                        {fileItem.file.name}
                                                      </p>
                                                      <p className="text-xs text-gray-500">
                                                        {(fileItem.file.size / 1024).toFixed(1)} KB
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setSplitPayments(splitPayments.map(p => 
                                                        p.id === payment.id 
                                                          ? { ...p, narabillFiles: (p.narabillFiles || []).filter(f => f.id !== fileItem.id) }
                                                          : p
                                                      ));
                                                    }}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                                                  >
                                                    <X className="w-4 h-4 text-gray-500" />
                                                  </button>
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                                    작성 가이드
                                                  </label>
                                                  <textarea
                                                    value={fileItem.instructions}
                                                    onChange={(e) => {
                                                      setSplitPayments(splitPayments.map(p => 
                                                        p.id === payment.id 
                                                          ? { 
                                                              ...p, 
                                                              narabillFiles: (p.narabillFiles || []).map(f => 
                                                                f.id === fileItem.id 
                                                                  ? { ...f, instructions: e.target.value }
                                                                  : f
                                                              ) 
                                                            }
                                                          : p
                                                      ));
                                                    }}
                                                    placeholder="필요한 계약 서류를 업로드하고 작성 가이드를 입력해 주세요. 담당자가 확인 후 연락드립니다."
                                                    rows={3}
                                                    className={cn(
                                                      'w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-sm',
                                                      'py-2.5 px-3 transition-all duration-200 resize-none',
                                                      'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                                      'placeholder:text-gray-400'
                                                    )}
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {(!payment.narabillFiles || payment.narabillFiles.length === 0) && (
                                          <div className="text-center py-6 text-sm text-gray-500">
                                            업로드된 서류가 없습니다. 위 버튼을 클릭하여 서류를 업로드해주세요.
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* 수의 계약 파일 업로드 (Contract file upload) */}
                                    {payment.paymentMethod === 'contract' && (
                                      <div className="space-y-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-medium text-gray-700">수의 계약 서류 업로드</p>
                                        
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.multiple = true;
                                            input.onchange = (e: any) => {
                                              const files = Array.from(e.target.files || []) as File[];
                                              const newFiles = files.map(file => ({
                                                id: `${Date.now()}-${Math.random()}`,
                                                file,
                                                instructions: ''
                                              }));
                                              setSplitPayments(splitPayments.map(p => 
                                                p.id === payment.id 
                                                  ? { ...p, contractFiles: [...(p.contractFiles || []), ...newFiles] }
                                                  : p
                                              ));
                                            };
                                            input.click();
                                          }}
                                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1a2867] hover:bg-[#1a2867]/5 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-[#1a2867]"
                                        >
                                          <Upload className="w-5 h-5" />
                                          <span className="font-medium">계약 서류 업로드</span>
                                        </button>

                                        {payment.contractFiles && payment.contractFiles.length > 0 && (
                                          <div className="space-y-3">
                                            {payment.contractFiles.map((fileItem) => (
                                              <div key={fileItem.id} className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <Briefcase className="w-5 h-5 text-[#1a2867] flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                      <p className="text-sm font-medium text-gray-900 truncate">
                                                        {fileItem.file.name}
                                                      </p>
                                                      <p className="text-xs text-gray-500">
                                                        {(fileItem.file.size / 1024).toFixed(1)} KB
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setSplitPayments(splitPayments.map(p => 
                                                        p.id === payment.id 
                                                          ? { ...p, contractFiles: (p.contractFiles || []).filter(f => f.id !== fileItem.id) }
                                                          : p
                                                      ));
                                                    }}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                                                  >
                                                    <X className="w-4 h-4 text-gray-500" />
                                                  </button>
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                                    작성 요령 / 요청사항
                                                  </label>
                                                  <textarea
                                                    value={fileItem.instructions}
                                                    onChange={(e) => {
                                                      setSplitPayments(splitPayments.map(p => 
                                                        p.id === payment.id 
                                                          ? { 
                                                              ...p, 
                                                              contractFiles: (p.contractFiles || []).map(f => 
                                                                f.id === fileItem.id 
                                                                  ? { ...f, instructions: e.target.value }
                                                                  : f
                                                              ) 
                                                            }
                                                          : p
                                                      ));
                                                    }}
                                                    placeholder="이 서류에 대한 작성 요령이나 특이사항을 입력해 주세요. (예: 계약 기간은 2024년 12월 ~ 2025년 2월까지)"
                                                    rows={3}
                                                    className={cn(
                                                      'w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-sm',
                                                      'py-2.5 px-3 transition-all duration-200 resize-none',
                                                      'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                                      'placeholder:text-gray-400'
                                                    )}
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {(!payment.contractFiles || payment.contractFiles.length === 0) && (
                                          <div className="text-center py-6 text-sm text-gray-500">
                                            업로드된 서류가 없습니다. 위 버튼을 클릭하여 서류를 업로드해주세요.
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* 입력 완료 버튼 (Complete input button) */}
                                    <div className="pt-4 border-t border-gray-200">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSplitPayments(splitPayments.map(p => 
                                            p.id === payment.id 
                                              ? { ...p, isCompleted: !p.isCompleted }
                                              : p
                                          ));
                                          
                                          // 입력 완료 시 다음 탭으로 자동 전환 (Auto switch to next tab when completed)
                                          if (!payment.isCompleted) {
                                            const currentIndex = splitPayments.findIndex(p => p.id === payment.id);
                                            if (currentIndex < splitPayments.length - 1) {
                                              setActivePaymentTab(splitPayments[currentIndex + 1].id);
                                            } else {
                                              // 마지막 탭이면 새로운 탭 생성 후 전환 (Create new tab and switch if at the end)
                                              const newId = Math.max(...splitPayments.map(p => p.id)) + 1;
                                              setSplitPayments([...splitPayments, { id: newId, amount: '', memo: '', paymentMethod: 'toss' as PaymentMethod, keyinData: null, bankData: null, narabillFiles: [], contractFiles: [], isCompleted: false }]);
                                              setActivePaymentTab(newId);
                                            }
                                          }
                                        }}
                                        className={cn(
                                          'w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2',
                                          payment.isCompleted
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                                            : 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90 shadow-md'
                                        )}
                                      >
                                        <Check className="w-5 h-5" />
                                        {payment.isCompleted ? '수정하기' : '입력 완료'}
                                      </button>
                                    </div>
                                  </motion.div>
                                )
                              )}
                            </AnimatePresence>

                            <AlertBox type="info" title="분할 결제 안내">
                              각 차수별로 결제 금액을 입력해주세요. 담당자가 확인 후 차수별 결제 링크를 순차적으로 발송해드립니다.
                            </AlertBox>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* 결제 주체 여러명 - "예" 선택 시 (Multiple payors - "Yes" selected) */}
                      <AnimatePresence>
                        {splitPayment === true && multiplePayors === true && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4"
                          >
                            {/* 남은 금액 표시 (Remaining amount display) */}
                            <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">총 결제 금액</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">입력한 금액 합계</span>
                                <span className="font-semibold text-gray-900">{formatCurrency(enteredTotal)}</span>
                              </div>
                              <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">남은 금액</span>
                                  <span className={cn(
                                    "text-lg font-bold",
                                    remainingAmount < 0 ? "text-red-600" : remainingAmount === 0 ? "text-emerald-600" : "text-[#1a2867]"
                                  )}>
                                    {formatCurrency(remainingAmount)}
                                  </span>
                                </div>
                                {remainingAmount < 0 && (
                                  <p className="text-xs text-red-600 mt-1">
                                    * 입력한 금액이 총 결제 금액을 초과했습니다.
                                  </p>
                                )}
                                {remainingAmount === 0 && (
                                  <p className="text-xs text-emerald-600 mt-1">
                                    * 금액이 정확히 일치합니다.
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* 탭 메뉴 (Tab menu) */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                              {splitPayments.map((payment) => (
                                <button
                                  key={payment.id}
                                  type="button"
                                  onClick={(e) => {
                                    // X 버튼 클릭 시에는 탭 전환하지 않음 (Don't switch tab when clicking X button)
                                    if ((e.target as HTMLElement).closest('.delete-btn')) return;
                                    setActivePaymentTab(payment.id);
                                  }}
                                  className={cn(
                                    'flex-shrink-0 px-4 py-2.5 rounded-lg transition-all font-medium text-sm flex items-center gap-2',
                                    activePaymentTab === payment.id
                                      ? 'bg-[#1a2867] text-white shadow-md'
                                      : payment.isCompleted
                                      ? 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  )}
                                >
                                  {payment.isCompleted && (
                                    <Check className="w-4 h-4" />
                                  )}
                                  <span>결제 유형 {payment.id}</span>
                                  {splitPayments.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newPayments = splitPayments.filter(p => p.id !== payment.id);
                                        setSplitPayments(newPayments);
                                        if (activePaymentTab === payment.id && newPayments.length > 0) {
                                          setActivePaymentTab(newPayments[0].id);
                                        }
                                      }}
                                      className="delete-btn p-0.5 rounded hover:bg-white/20 transition-all"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </button>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newId = Math.max(...splitPayments.map(p => p.id)) + 1;
                                  setSplitPayments([...splitPayments, { id: newId, amount: '', memo: '', paymentMethod: 'toss' as PaymentMethod, keyinData: null, bankData: null, narabillFiles: [], contractFiles: [], isCompleted: false }]);
                                  setActivePaymentTab(newId);
                                }}
                                className="flex-shrink-0 p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* 활성 탭 내용 (Active tab content) */}
                            <AnimatePresence mode="wait">
                              {splitPayments.map((payment) => 
                                payment.id === activePaymentTab && (
                                  <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white rounded-xl p-5 border border-gray-200 space-y-5"
                                  >
                                    {/* 결제 주체 정보 (Payor information) */}
                                    <div className="space-y-4">
                                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                          <p className="text-xs text-blue-900">
                                            <span className="font-medium">중요:</span> 입력하신 담당자 이메일과 연락처로 결제 안내가 발송됩니다. 정확하게 입력해 주세요.
                                          </p>
                                        </div>
                                      </div>
                                      
                                      {/* 가입 유형 선택 (Account type selection) */}
                                      <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">유형</label>
                                        <div className="grid grid-cols-2 gap-3">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSplitPayments(splitPayments.map(p => 
                                                p.id === payment.id 
                                                  ? { ...p, bankData: { ...p.bankData, accountType: 'personal' } as any }
                                                  : p
                                              ));
                                            }}
                                            className={cn(
                                              'px-4 py-2.5 rounded-xl border-2 font-medium transition-all text-sm',
                                              (payment.bankData as any)?.accountType === 'personal'
                                                ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                            )}
                                          >
                                            개인
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSplitPayments(splitPayments.map(p => 
                                                p.id === payment.id 
                                                  ? { ...p, bankData: { ...p.bankData, accountType: 'company' } as any }
                                                  : p
                                              ));
                                            }}
                                            className={cn(
                                              'px-4 py-2.5 rounded-xl border-2 font-medium transition-all text-sm',
                                              (payment.bankData as any)?.accountType === 'company'
                                                ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]'
                                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                                            )}
                                          >
                                            회사
                                          </button>
                                        </div>
                                      </div>

                                      {/* 이름 (Name) */}
                                      <Input
                                        label="이름"
                                        leftIcon={<User className="w-4 h-4" />}
                                        value={(payment.bankData as any)?.payorName || ''}
                                        onChange={(e) => {
                                          setSplitPayments(splitPayments.map(p => 
                                            p.id === payment.id 
                                              ? { ...p, bankData: { ...p.bankData, payorName: e.target.value } as any }
                                              : p
                                          ));
                                        }}
                                        placeholder="홍길동"
                                      />

                                      {/* 회사명 (Company name - only for company type) */}
                                      {(payment.bankData as any)?.accountType === 'company' && (
                                        <Input
                                          label="회사명"
                                          leftIcon={<Building2 className="w-4 h-4" />}
                                          value={(payment.bankData as any)?.payorCompany || ''}
                                          onChange={(e) => {
                                            setSplitPayments(splitPayments.map(p => 
                                              p.id === payment.id 
                                                ? { ...p, bankData: { ...p.bankData, payorCompany: e.target.value } as any }
                                                : p
                                            ));
                                          }}
                                          placeholder="주식회사 인프라이즈"
                                        />
                                      )}

                                      {/* 담당자 이메일 (Contact email) */}
                                      <Input
                                        label="담당자 이메일"
                                        leftIcon={<Mail className="w-4 h-4" />}
                                        value={(payment.bankData as any)?.payorEmail || ''}
                                        onChange={(e) => {
                                          setSplitPayments(splitPayments.map(p => 
                                            p.id === payment.id 
                                              ? { ...p, bankData: { ...p.bankData, payorEmail: e.target.value } as any }
                                              : p
                                          ));
                                        }}
                                        placeholder="contact@example.com"
                                      />

                                      {/* 담당자 연락처 (Contact phone) */}
                                      <Input
                                        label="담당자 연락처"
                                        leftIcon={<Phone className="w-4 h-4" />}
                                        value={(payment.bankData as any)?.payorPhone || ''}
                                        onChange={(e) => {
                                          setSplitPayments(splitPayments.map(p => 
                                            p.id === payment.id 
                                              ? { ...p, bankData: { ...p.bankData, payorPhone: e.target.value } as any }
                                              : p
                                          ));
                                        }}
                                        placeholder="010-1234-5678"
                                      />
                                    </div>

                                    {/* 금액 입력 (Amount input) */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        결제 금액
                                      </label>
                                      <input
                                        type="text"
                                        value={payment.amount}
                                        onChange={(e) => {
                                          const value = e.target.value.replace(/[^0-9]/g, '');
                                          const formatted = value ? new Intl.NumberFormat('ko-KR').format(parseInt(value)) : '';
                                          setSplitPayments(splitPayments.map(p => 
                                            p.id === payment.id ? { ...p, amount: formatted } : p
                                          ));
                                        }}
                                        placeholder="금액 입력"
                                        className={cn(
                                          'w-full rounded-xl border bg-white text-gray-900',
                                          'py-3.5 px-4 transition-all duration-200',
                                          'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                          'placeholder:text-gray-400',
                                          remainingAmount < 0 ? 'border-red-300' : 'border-gray-200'
                                        )}
                                      />
                                      {remainingAmount < 0 && (
                                        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                          <AlertCircle className="w-3 h-3" />
                                          입력한 금액이 총 결제 금액을 초과했습니다.
                                        </p>
                                      )}
                                    </div>

                                    {/* 결제 수단 선택 (Payment method selection) */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-3">
                                        결제 수단 선택
                                      </label>
                                      <div className="grid grid-cols-2 gap-2">
                                        {PAYMENT_METHODS.filter(m => m.id !== 'other').map((method) => (
                                          <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => {
                                              setSplitPayments(splitPayments.map(p => 
                                                p.id === payment.id ? { ...p, paymentMethod: method.id } : p
                                              ));
                                            }}
                                            className={cn(
                                              'flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm',
                                              payment.paymentMethod === method.id
                                                ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867] font-medium'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                            )}
                                          >
                                            <method.icon className="w-4 h-4" />
                                            <span>{method.name}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* 메모 (Memo - Optional) */}
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        메모 (선택사항)
                                      </label>
                                      <textarea
                                        value={payment.memo}
                                        onChange={(e) => {
                                          setSplitPayments(splitPayments.map(p => 
                                            p.id === payment.id ? { ...p, memo: e.target.value } : p
                                          ));
                                        }}
                                        placeholder="추가 메모를 입력하세요"
                                        rows={3}
                                        className={cn(
                                          'w-full rounded-xl border border-gray-200 bg-white text-gray-900',
                                          'py-3 px-4 transition-all duration-200 resize-none',
                                          'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                          'placeholder:text-gray-400'
                                        )}
                                      />
                                    </div>

                                    {/* 무통장 입금 추가 정보 (Bank transfer additional info) */}
                                    {payment.paymentMethod === 'bank' && (
                                      <BankTransferSection payment={payment} setSplitPayments={setSplitPayments} splitPayments={splitPayments} />
                                    )}

                                    {/* 나라빌 파일 업로드 (Narabill file upload) */}
                                    {payment.paymentMethod === 'narabill' && (
                                      <div className="space-y-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-medium text-gray-700">나라빌 서류 업로드</p>
                                        
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.multiple = true;
                                            input.onchange = (e: any) => {
                                              const files = Array.from(e.target.files || []) as File[];
                                              const newFiles = files.map(file => ({
                                                id: `${Date.now()}-${Math.random()}`,
                                                file,
                                                instructions: ''
                                              }));
                                              setSplitPayments(splitPayments.map(p => 
                                                p.id === payment.id 
                                                  ? { ...p, narabillFiles: [...(p.narabillFiles || []), ...newFiles] }
                                                  : p
                                              ));
                                            };
                                            input.click();
                                          }}
                                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1a2867] hover:bg-[#1a2867]/5 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-[#1a2867]"
                                        >
                                          <Upload className="w-5 h-5" />
                                          <span className="font-medium">서류 파일 업로드</span>
                                        </button>

                                        {payment.narabillFiles && payment.narabillFiles.length > 0 && (
                                          <div className="space-y-3">
                                            {payment.narabillFiles.map((fileItem) => (
                                              <div key={fileItem.id} className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <FileText className="w-5 h-5 text-[#1a2867] flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                      <p className="text-sm font-medium text-gray-900 truncate">
                                                        {fileItem.file.name}
                                                      </p>
                                                      <p className="text-xs text-gray-500">
                                                        {(fileItem.file.size / 1024).toFixed(1)} KB
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setSplitPayments(splitPayments.map(p => 
                                                        p.id === payment.id 
                                                          ? { ...p, narabillFiles: (p.narabillFiles || []).filter(f => f.id !== fileItem.id) }
                                                          : p
                                                      ));
                                                    }}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                                                  >
                                                    <X className="w-4 h-4 text-gray-500" />
                                                  </button>
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                                    작성 요령 / 요청사항
                                                  </label>
                                                  <textarea
                                                    value={fileItem.instructions}
                                                    onChange={(e) => {
                                                      setSplitPayments(splitPayments.map(p => 
                                                        p.id === payment.id 
                                                          ? { 
                                                              ...p, 
                                                              narabillFiles: (p.narabillFiles || []).map(f => 
                                                                f.id === fileItem.id 
                                                                  ? { ...f, instructions: e.target.value }
                                                                  : f
                                                              ) 
                                                            }
                                                          : p
                                                      ));
                                                    }}
                                                    placeholder="이 서류에 대한 작성 요령이나 특이사항을 입력해 주세요. (예: 발주처명은 '주식회사 인프라이즈'로 작성)"
                                                    rows={3}
                                                    className={cn(
                                                      'w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-sm',
                                                      'py-2.5 px-3 transition-all duration-200 resize-none',
                                                      'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                                      'placeholder:text-gray-400'
                                                    )}
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {(!payment.narabillFiles || payment.narabillFiles.length === 0) && (
                                          <div className="text-center py-6 text-sm text-gray-500">
                                            업로드된 서류가 없습니다. 위 버튼을 클릭하여 서류를 업로드해주세요.
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* 수의 계약 파일 업로드 (Contract file upload) */}
                                    {payment.paymentMethod === 'contract' && (
                                      <div className="space-y-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-medium text-gray-700">수의 계약 서류 업로드</p>
                                        
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.multiple = true;
                                            input.onchange = (e: any) => {
                                              const files = Array.from(e.target.files || []) as File[];
                                              const newFiles = files.map(file => ({
                                                id: `${Date.now()}-${Math.random()}`,
                                                file,
                                                instructions: ''
                                              }));
                                              setSplitPayments(splitPayments.map(p => 
                                                p.id === payment.id 
                                                  ? { ...p, contractFiles: [...(p.contractFiles || []), ...newFiles] }
                                                  : p
                                              ));
                                            };
                                            input.click();
                                          }}
                                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1a2867] hover:bg-[#1a2867]/5 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-[#1a2867]"
                                        >
                                          <Upload className="w-5 h-5" />
                                          <span className="font-medium">계약 서류 업로드</span>
                                        </button>

                                        {payment.contractFiles && payment.contractFiles.length > 0 && (
                                          <div className="space-y-3">
                                            {payment.contractFiles.map((fileItem) => (
                                              <div key={fileItem.id} className="bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <Briefcase className="w-5 h-5 text-[#1a2867] flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                      <p className="text-sm font-medium text-gray-900 truncate">
                                                        {fileItem.file.name}
                                                      </p>
                                                      <p className="text-xs text-gray-500">
                                                        {(fileItem.file.size / 1024).toFixed(1)} KB
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      setSplitPayments(splitPayments.map(p => 
                                                        p.id === payment.id 
                                                          ? { ...p, contractFiles: (p.contractFiles || []).filter(f => f.id !== fileItem.id) }
                                                          : p
                                                      ));
                                                    }}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                                                  >
                                                    <X className="w-4 h-4 text-gray-500" />
                                                  </button>
                                                </div>
                                                
                                                <div>
                                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                                    작성 가이드
                                                  </label>
                                                  <textarea
                                                    value={fileItem.instructions}
                                                    onChange={(e) => {
                                                      setSplitPayments(splitPayments.map(p => 
                                                        p.id === payment.id 
                                                          ? { 
                                                              ...p, 
                                                              contractFiles: (p.contractFiles || []).map(f => 
                                                                f.id === fileItem.id 
                                                                  ? { ...f, instructions: e.target.value }
                                                                  : f
                                                              ) 
                                                            }
                                                          : p
                                                      ));
                                                    }}
                                                    placeholder="필요한 계약 서류를 업로드하고 작성 가이드를 입력해 주세요. 담당자가 확인 후 연락드립니다."
                                                    rows={3}
                                                    className={cn(
                                                      'w-full rounded-lg border border-gray-200 bg-white text-gray-900 text-sm',
                                                      'py-2.5 px-3 transition-all duration-200 resize-none',
                                                      'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]',
                                                      'placeholder:text-gray-400'
                                                    )}
                                                  />
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {(!payment.contractFiles || payment.contractFiles.length === 0) && (
                                          <div className="text-center py-6 text-sm text-gray-500">
                                            업로드된 서류가 없습니다. 위 버튼을 클릭하여 서류를 업로드해주세요.
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* 입력 완료 버튼 (Complete input button) */}
                                    <div className="pt-4 border-t border-gray-200">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSplitPayments(splitPayments.map(p => 
                                            p.id === payment.id 
                                              ? { ...p, isCompleted: !p.isCompleted }
                                              : p
                                          ));
                                          
                                          // 입력 완료 시 다음 탭으로 자동 전환 (Auto switch to next tab when completed)
                                          if (!payment.isCompleted) {
                                            const currentIndex = splitPayments.findIndex(p => p.id === payment.id);
                                            if (currentIndex < splitPayments.length - 1) {
                                              setActivePaymentTab(splitPayments[currentIndex + 1].id);
                                            } else {
                                              // 마지막 탭이면 새로운 탭 생성 후 전환 (Create new tab and switch if at the end)
                                              const newId = Math.max(...splitPayments.map(p => p.id)) + 1;
                                              setSplitPayments([...splitPayments, { id: newId, amount: '', memo: '', paymentMethod: 'toss' as PaymentMethod, keyinData: null, bankData: null, narabillFiles: [], contractFiles: [], isCompleted: false }]);
                                              setActivePaymentTab(newId);
                                            }
                                          }
                                        }}
                                        className={cn(
                                          'w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2',
                                          payment.isCompleted
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-300'
                                            : 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90 shadow-md'
                                        )}
                                      >
                                        <Check className="w-5 h-5" />
                                        {payment.isCompleted ? '수정하기' : '입력 완료'}
                                      </button>
                                    </div>
                                  </motion.div>
                                )
                              )}
                            </AnimatePresence>

                            <AlertBox type="info" title="여러 결제 주체 안내">
                              각 결제 주체별로 결제 정보를 입력해주세요. 담당자가 확인 후 각 결제 주체에게 개별 결제 링크를 발송해드립니다.
                            </AlertBox>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* 결제 정보 요약 */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SectionHeader icon={<Receipt className="w-5 h-5" />} title="결제 정보 요약" />
              
              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">견적 번호</span>
                    <span className="font-medium text-gray-900">Q-2024-12-001</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">전체 소계</span>
                    <span className="font-medium text-gray-900">{formatCurrency(quoteData?.quoteSalePrice || 11140000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">전체 부가세</span>
                    <span className="font-medium text-gray-900">{formatCurrency(quoteData?.quoteVat || 1114000)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-gray-900">최종 총 합계</span>
                  <span className="text-2xl font-bold text-[#1a2867]">
                    {formatCurrency(quoteData?.quoteAmount || 12254000)}
                  </span>
                </div>

                <AlertBox type="warning">
                  결제 완료 후 주문이 확정됩니다. 입금 확인은 영업일 기준 1~2시간 소요됩니다.
                </AlertBox>
              </div>
            </motion.section>

            {/* 액션 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-end gap-3 pt-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handlePayment}
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
                  getButtonText()
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}