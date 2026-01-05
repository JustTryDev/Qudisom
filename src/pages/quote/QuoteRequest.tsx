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
  User,
  Plus,
  X,
  Upload,
  Copy,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Coins,
  Calendar,
  Sparkles,
  Clock,
  Edit3,
  FolderOpen,
  Mail,
  Phone,
  Save
} from 'lucide-react';
import { OrderProgressBar } from '../../components/shared/OrderProgressBar';

// ========== 타입 ==========
type PaymentMethodType = 'toss' | 'keyin' | 'bank' | 'narabill' | 'contract';
type ProofType = 'tax-invoice' | 'cash-receipt' | 'none';
type PaymentTiming = 'pre-order' | 'pre-ship' | 'post-ship';
type AccountType = 'personal' | 'company';

interface KeyinData {
  cardNumbers: string[];
  expMonth: string;
  expYear: string;
  installment: string;
}

interface BusinessInfo {
  businessNumber: string;
  companyName: string;
  ceoName: string;
  email: string;
}

interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  amount: number;
  keyinData?: KeyinData;
}

interface Proof {
  id: string;
  type: ProofType;
  amount: number;
  recipientType: 'same' | 'other';
  businessInfo?: BusinessInfo;
}

interface PaymentSchedule {
  id: string;
  label: string;
  amount: number;
  timing: PaymentTiming;
  dueDate: string;
  methods: PaymentMethod[];
  proofs: Proof[];
}

interface PayorInfo {
  type: AccountType;
  name: string;
  company: string;
  phone: string;
  email: string;
  businessInfo?: BusinessInfo;
}

interface SavedPayor {
  id: string;
  label: string;
  info: PayorInfo;
}

// ========== 상수 ==========
const PAYMENT_METHODS = [
  { id: 'toss' as const, name: '토스페이먼츠', desc: '카드/간편결제', icon: CreditCard, autoProof: true },
  { id: 'keyin' as const, name: '안심 키인', desc: '수기 카드결제', icon: Shield, autoProof: true },
  { id: 'bank' as const, name: '무통장 입금', desc: '계좌이체', icon: Building2, autoProof: false },
  { id: 'narabill' as const, name: '나라빌', desc: '공공기관', icon: FileText, autoProof: false },
  { id: 'contract' as const, name: '수의계약', desc: '계약 결제', icon: Briefcase, autoProof: false }
];

const TIMING_OPTIONS = [
  { value: 'pre-order' as const, label: '발주 전', desc: '주문 확정 전 결제' },
  { value: 'pre-ship' as const, label: '출고 전', desc: '제작 완료 후 결제' },
  { value: 'post-ship' as const, label: '출고 후', desc: '배송 후 결제' }
];

const BANK_INFO = { bank: '기업은행', account: '270-188626-04-011', holder: '(주)인프라이즈' };

const SAMPLE_SAVED_PAYORS: SavedPayor[] = [
  { id: 's1', label: '주식회사 인프라이즈', info: { type: 'company', name: '홍길동', company: '주식회사 인프라이즈', phone: '010-1234-5678', email: 'hong@infrise.com', businessInfo: { businessNumber: '123-45-67890', companyName: '주식회사 인프라이즈', ceoName: '홍길동', email: 'tax@infrise.com' } } },
  { id: 's2', label: '테크솔루션', info: { type: 'company', name: '김철수', company: '테크솔루션', phone: '010-9876-5432', email: 'kim@tech.com' } }
];

// ========== 유틸리티 ==========
const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');
const formatCurrency = (amount: number) => new Intl.NumberFormat('ko-KR').format(amount) + '원';
const formatAmount = (num: number): string => num ? new Intl.NumberFormat('ko-KR').format(num) : '';
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createEmptyMethod = (amount: number = 0): PaymentMethod => ({
  id: generateId(), type: 'toss', amount, keyinData: { cardNumbers: ['', '', '', ''], expMonth: '', expYear: '', installment: '0' }
});

const createEmptyProof = (amount: number = 0): Proof => ({
  id: generateId(), type: 'tax-invoice', amount, recipientType: 'same'
});

const needsProofInput = (methods: PaymentMethod[]) => 
  methods.some(m => !['toss', 'keyin'].includes(m.type));

// ========== UI 컴포넌트 ==========
const Button = ({ variant = 'primary', size = 'md', leftIcon, rightIcon, children, className, disabled, ...props }: {
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variants = {
    primary: 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90 shadow-lg shadow-[#1a2867]/20',
    outline: 'border-2 border-gray-200 bg-white text-gray-700 hover:border-[#1a2867] hover:text-[#1a2867]',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100'
  };
  const sizes = { sm: 'px-3 py-2 text-sm', md: 'px-5 py-3 text-sm', lg: 'px-6 py-4 text-base font-semibold' };

  return (
    <motion.button whileTap={{ scale: disabled ? 1 : 0.98 }} className={cn('inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size], className)} disabled={disabled} {...props}>
      {leftIcon}{children}{rightIcon}
    </motion.button>
  );
};

const Input = ({ label, value, onChange, placeholder, type = 'text', hint, className, ...props }: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
  className?: string;
}) => (
  <div className={cn('space-y-1.5', className)}>
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867] transition-all"
      {...props}
    />
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
  </div>
);

const Select = ({ label, value, onChange, options }: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867]">
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

// 스텝 카드
const StepCard = ({ step, title, isActive, isCompleted, onEdit, summary, children }: {
  step: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onEdit?: () => void;
  summary?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className={cn('rounded-2xl border-2 overflow-hidden transition-all', isActive ? 'border-[#1a2867] shadow-xl' : isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 bg-gray-50/50 opacity-60')}>
    <div className={cn('px-5 py-4 flex items-center gap-4', isActive ? 'bg-[#1a2867]' : 'bg-white')}>
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold', isActive ? 'bg-white text-[#1a2867]' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500')}>
        {isCompleted && !isActive ? <Check className="w-4 h-4" /> : step}
      </div>
      <span className={cn('flex-1 font-semibold', isActive ? 'text-white' : 'text-gray-900')}>{title}</span>
      {isCompleted && !isActive && onEdit && (
        <button type="button" onClick={onEdit} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><Edit3 className="w-4 h-4" /></button>
      )}
    </div>
    <AnimatePresence>
      {isActive && (
        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.3 }}>
          <div className="p-5 bg-white border-t border-gray-100">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
    {isCompleted && !isActive && summary && <div className="px-5 py-3 bg-white border-t border-gray-100 text-sm text-gray-600">{summary}</div>}
  </div>
);

// 옵션 카드
const OptionCard = ({ selected, onClick, icon: Icon, title, description, badge, small }: {
  selected: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  badge?: string;
  small?: boolean;
}) => (
  <button type="button" onClick={onClick} className={cn('relative w-full rounded-xl border-2 text-left transition-all', selected ? 'border-[#1a2867] bg-[#1a2867]/5' : 'border-gray-200 hover:border-gray-300', small ? 'p-3' : 'p-4')}>
    <div className={cn('flex items-center gap-3', small && 'gap-2')}>
      {Icon && <div className={cn('rounded-lg flex items-center justify-center', selected ? 'bg-[#1a2867] text-white' : 'bg-gray-100 text-gray-500', small ? 'w-8 h-8' : 'w-10 h-10')}><Icon className={small ? 'w-4 h-4' : 'w-5 h-5'} /></div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('font-medium', selected ? 'text-[#1a2867]' : 'text-gray-900', small && 'text-sm')}>{title}</span>
          {badge && <span className="px-1.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">{badge}</span>}
        </div>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      {selected && <div className="w-5 h-5 rounded-full bg-[#1a2867] flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
    </div>
  </button>
);

// ========== 결제 수단 입력 컴포넌트 ==========
const PaymentMethodInput = ({ method, onChange, onRemove, canRemove, totalAmount }: {
  method: PaymentMethod;
  onChange: (updates: Partial<PaymentMethod>) => void;
  onRemove: () => void;
  canRemove: boolean;
  totalAmount: number;
}) => {
  const [copied, setCopied] = useState(false);
  const methodInfo = PAYMENT_METHODS.find(m => m.id === method.type);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(BANK_INFO.account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const monthOptions = [{ value: '', label: '월' }, ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: `${i + 1}월` }))];
  const yearOptions = [{ value: '', label: '년' }, ...Array.from({ length: 10 }, (_, i) => ({ value: String(new Date().getFullYear() + i).slice(-2), label: `${new Date().getFullYear() + i}년` }))];
  const installmentOptions = [{ value: '0', label: '일시불' }, ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `${i + 1}개월` }))];

  return (
    <div className="p-4 bg-gray-50 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">결제 수단</span>
        {canRemove && <button type="button" onClick={onRemove} className="p-1 hover:bg-gray-200 rounded"><X className="w-4 h-4 text-gray-500" /></button>}
      </div>

      {/* 금액 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={method.amount ? formatAmount(method.amount) : ''}
          onChange={(e) => onChange({ amount: parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0 })}
          placeholder="금액"
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 text-lg font-semibold"
        />
        <span className="text-gray-500">원</span>
        <button type="button" onClick={() => onChange({ amount: totalAmount })} className="text-xs text-[#1a2867] hover:underline whitespace-nowrap">전액</button>
      </div>

      {/* 수단 선택 */}
      <div className="grid grid-cols-5 gap-2">
        {PAYMENT_METHODS.map(pm => (
          <button
            key={pm.id}
            type="button"
            onClick={() => onChange({ type: pm.id })}
            className={cn('flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-xs', method.type === pm.id ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]' : 'border-gray-200 text-gray-600 hover:border-gray-300')}
          >
            <pm.icon className="w-4 h-4" />
            <span className="font-medium text-center leading-tight">{pm.name}</span>
          </button>
        ))}
      </div>

      {/* 자동 증빙 안내 */}
      {methodInfo?.autoProof && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg text-emerald-700 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>결제 완료 시 영수증이 자동 발급됩니다</span>
        </div>
      )}

      {/* 키인 결제 상세 */}
      {method.type === 'keyin' && (
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <Select label="할부" value={method.keyinData?.installment || '0'} onChange={(v) => onChange({ keyinData: { ...method.keyinData!, installment: v } })} options={installmentOptions} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">카드번호</label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map(idx => (
                <input
                  key={idx}
                  type="text"
                  maxLength={4}
                  value={method.keyinData?.cardNumbers?.[idx] || ''}
                  onChange={(e) => {
                    const newNumbers = [...(method.keyinData?.cardNumbers || ['', '', '', ''])];
                    newNumbers[idx] = e.target.value.replace(/\D/g, '');
                    onChange({ keyinData: { ...method.keyinData!, cardNumbers: newNumbers } });
                  }}
                  placeholder="0000"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20"
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="유효기간 (월)" value={method.keyinData?.expMonth || ''} onChange={(v) => onChange({ keyinData: { ...method.keyinData!, expMonth: v } })} options={monthOptions} />
            <Select label="유효기간 (년)" value={method.keyinData?.expYear || ''} onChange={(v) => onChange({ keyinData: { ...method.keyinData!, expYear: v } })} options={yearOptions} />
          </div>
        </div>
      )}

      {/* 무통장 입금 */}
      {method.type === 'bank' && (
        <div className="p-4 bg-white rounded-lg border border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">{BANK_INFO.bank}</p>
              <p className="text-lg font-bold font-mono text-gray-900">{BANK_INFO.account}</p>
              <p className="text-xs text-gray-500">예금주: {BANK_INFO.holder}</p>
            </div>
            <Button variant={copied ? 'primary' : 'outline'} size="sm" onClick={handleCopy} leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
              {copied ? '복사됨' : '복사'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ========== 증빙 입력 컴포넌트 ==========
const ProofInput = ({ proof, onChange, onRemove, canRemove, totalAmount }: {
  proof: Proof;
  onChange: (updates: Partial<Proof>) => void;
  onRemove: () => void;
  canRemove: boolean;
  totalAmount: number;
}) => {
  const [showBizForm, setShowBizForm] = useState(!!proof.businessInfo);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onChange({ businessInfo: { businessNumber: '123-45-67890', companyName: '주식회사 인프라이즈', ceoName: '홍길동', email: 'tax@infrise.com' } });
      setShowBizForm(true);
    }, 1500);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">증빙 서류</span>
        {canRemove && <button type="button" onClick={onRemove} className="p-1 hover:bg-gray-200 rounded"><X className="w-4 h-4 text-gray-500" /></button>}
      </div>

      {/* 금액 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={proof.amount ? formatAmount(proof.amount) : ''}
          onChange={(e) => onChange({ amount: parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0 })}
          placeholder="금액"
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 text-lg font-semibold"
        />
        <span className="text-gray-500">원</span>
        <button type="button" onClick={() => onChange({ amount: totalAmount })} className="text-xs text-[#1a2867] hover:underline whitespace-nowrap">전액</button>
      </div>

      {/* 증빙 종류 */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'tax-invoice' as const, label: '세금계산서' },
          { id: 'cash-receipt' as const, label: '현금영수증' },
          { id: 'none' as const, label: '필요없음' }
        ].map(type => (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange({ type: type.id })}
            className={cn('py-2.5 rounded-lg border-2 text-sm font-medium transition-all', proof.type === type.id ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]' : 'border-gray-200 text-gray-600 hover:border-gray-300')}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* 세금계산서 수령자 */}
      {proof.type === 'tax-invoice' && (
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { onChange({ recipientType: 'same', businessInfo: undefined }); setShowBizForm(false); }} className={cn('py-2.5 rounded-lg border-2 text-sm font-medium', proof.recipientType === 'same' ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]' : 'border-gray-200 text-gray-600')}>
              결제자와 동일
            </button>
            <button type="button" onClick={() => onChange({ recipientType: 'other' })} className={cn('py-2.5 rounded-lg border-2 text-sm font-medium', proof.recipientType === 'other' ? 'border-[#1a2867] bg-[#1a2867]/5 text-[#1a2867]' : 'border-gray-200 text-gray-600')}>
              다른 수령자
            </button>
          </div>

          {proof.recipientType === 'other' && !showBizForm && (
            <div className="space-y-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#1a2867] flex flex-col items-center gap-1">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">사업자등록증 업로드</span>
              </button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} accept="image/*,.pdf" />
              {isScanning && (
                <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg text-blue-700">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <span className="text-sm">스캔 중...</span>
                </div>
              )}
              <button type="button" onClick={() => setShowBizForm(true)} className="w-full text-sm text-gray-500 hover:text-[#1a2867] underline">직접 입력</button>
            </div>
          )}

          {proof.recipientType === 'other' && showBizForm && (
            <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <Input label="사업자번호" value={proof.businessInfo?.businessNumber || ''} onChange={(v) => onChange({ businessInfo: { ...proof.businessInfo!, businessNumber: v } })} placeholder="000-00-00000" />
                <Input label="회사명" value={proof.businessInfo?.companyName || ''} onChange={(v) => onChange({ businessInfo: { ...proof.businessInfo!, companyName: v } })} placeholder="주식회사 OOO" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="대표자명" value={proof.businessInfo?.ceoName || ''} onChange={(v) => onChange({ businessInfo: { ...proof.businessInfo!, ceoName: v } })} placeholder="홍길동" />
                <Input label="이메일" value={proof.businessInfo?.email || ''} onChange={(v) => onChange({ businessInfo: { ...proof.businessInfo!, email: v } })} placeholder="tax@company.com" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ========== 메인 컴포넌트 ==========
export default function Payment({ onBack }: { onBack?: () => void } = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const quoteData = location.state;

  const totalAmount = quoteData?.quoteAmount || 12254000;
  const availableDeposit = 500000;

  // 상태
  const [currentStep, setCurrentStep] = useState(1);
  const [scheduleType, setScheduleType] = useState<'single' | 'split' | null>(null);
  const [schedules, setSchedules] = useState<PaymentSchedule[]>([]);
  const [payorInfo, setPayorInfo] = useState<PayorInfo>({ type: 'personal', name: '', company: '', phone: '', email: '' });
  const [savePayor, setSavePayor] = useState(false);
  const [useDeposit, setUseDeposit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);

  const actualAmount = totalAmount - (useDeposit ? availableDeposit : 0);

  // 스텝 이동
  const goToStep = (step: number) => setCurrentStep(step);
  const nextStep = () => setCurrentStep(prev => prev + 1);

  // 일정 업데이트
  const updateSchedule = (index: number, updates: Partial<PaymentSchedule>) => {
    setSchedules(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s));
  };

  // 결제 수단 관리
  const addMethod = (scheduleIndex: number) => {
    const schedule = schedules[scheduleIndex];
    const remaining = schedule.amount - schedule.methods.reduce((sum, m) => sum + m.amount, 0);
    updateSchedule(scheduleIndex, { methods: [...schedule.methods, createEmptyMethod(remaining)] });
  };

  const updateMethod = (scheduleIndex: number, methodIndex: number, updates: Partial<PaymentMethod>) => {
    const schedule = schedules[scheduleIndex];
    const newMethods = schedule.methods.map((m, i) => i === methodIndex ? { ...m, ...updates } : m);
    updateSchedule(scheduleIndex, { methods: newMethods });
  };

  const removeMethod = (scheduleIndex: number, methodIndex: number) => {
    const schedule = schedules[scheduleIndex];
    if (schedule.methods.length > 1) {
      updateSchedule(scheduleIndex, { methods: schedule.methods.filter((_, i) => i !== methodIndex) });
    }
  };

  // 증빙 관리
  const addProof = (scheduleIndex: number) => {
    const schedule = schedules[scheduleIndex];
    const remaining = schedule.amount - schedule.proofs.reduce((sum, p) => sum + p.amount, 0);
    updateSchedule(scheduleIndex, { proofs: [...schedule.proofs, createEmptyProof(remaining)] });
  };

  const updateProof = (scheduleIndex: number, proofIndex: number, updates: Partial<Proof>) => {
    const schedule = schedules[scheduleIndex];
    const newProofs = schedule.proofs.map((p, i) => i === proofIndex ? { ...p, ...updates } : p);
    updateSchedule(scheduleIndex, { proofs: newProofs });
  };

  const removeProof = (scheduleIndex: number, proofIndex: number) => {
    const schedule = schedules[scheduleIndex];
    if (schedule.proofs.length > 1) {
      updateSchedule(scheduleIndex, { proofs: schedule.proofs.filter((_, i) => i !== proofIndex) });
    }
  };

  // 저장된 정보 불러오기
  const loadSavedPayor = (saved: SavedPayor) => {
    setPayorInfo(saved.info);
    setShowSavedList(false);
  };

  // 제출
  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const hasDeferred = schedules.some(s => s.timing !== 'pre-order');
    navigate(hasDeferred ? '/econtract' : '/shipping-design');
  };

  // 검증
  const isStep1Valid = scheduleType && schedules.length > 0 && (scheduleType === 'single' || schedules.reduce((sum, s) => sum + s.amount, 0) === totalAmount);
  const isStep2Valid = payorInfo.name && payorInfo.email;
  const isStep3Valid = schedules.every(s => s.methods.length > 0 && s.methods.every(m => m.amount > 0) && Math.abs(s.methods.reduce((sum, m) => sum + m.amount, 0) - s.amount) < 1);
  const isStep4Valid = schedules.every(s => !needsProofInput(s.methods) || s.proofs.every(p => p.amount > 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Button variant="ghost" onClick={onBack || (() => window.history.back())} leftIcon={<ArrowLeft className="w-5 h-5" />}>뒤로</Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <OrderProgressBar currentStep={2} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a2867] rounded-2xl shadow-lg mb-4">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">결제 정보</h1>
          <p className="text-gray-500 mt-1">총 결제 금액 <span className="font-semibold text-[#1a2867]">{formatCurrency(totalAmount)}</span></p>
        </motion.div>

        <div className="space-y-4">
          {/* Step 1: 결제 일정 */}
          <StepCard
            step={1}
            title="결제 일정"
            isActive={currentStep === 1}
            isCompleted={currentStep > 1}
            onEdit={() => goToStep(1)}
            summary={
              <div className="space-y-1">
                {schedules.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1a2867]" />
                    <span>{schedules.length > 1 ? `${s.label}: ` : ''}{formatCurrency(s.amount)} ({TIMING_OPTIONS.find(t => t.value === s.timing)?.label})</span>
                  </div>
                ))}
              </div>
            }
          >
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <OptionCard
                  selected={scheduleType === 'single'}
                  onClick={() => {
                    setScheduleType('single');
                    setSchedules([{ id: '1', label: '전액', amount: totalAmount, timing: 'pre-order', dueDate: '', methods: [createEmptyMethod(totalAmount)], proofs: [createEmptyProof(totalAmount)] }]);
                  }}
                  icon={Sparkles}
                  title="한 번에 결제"
                  description="전액을 한 번에"
                />
                <OptionCard
                  selected={scheduleType === 'split'}
                  onClick={() => {
                    setScheduleType('split');
                    const half = Math.floor(totalAmount * 0.5);
                    setSchedules([
                      { id: '1', label: '선금', amount: half, timing: 'pre-order', dueDate: '', methods: [createEmptyMethod(half)], proofs: [createEmptyProof(half)] },
                      { id: '2', label: '잔금', amount: totalAmount - half, timing: 'post-ship', dueDate: '', methods: [createEmptyMethod(totalAmount - half)], proofs: [createEmptyProof(totalAmount - half)] }
                    ]);
                  }}
                  icon={Calendar}
                  title="나눠서 결제"
                  description="선금/잔금 분할"
                />
              </div>

              {scheduleType === 'single' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">결제 시점</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIMING_OPTIONS.map(t => (
                      <OptionCard key={t.value} selected={schedules[0]?.timing === t.value} onClick={() => updateSchedule(0, { timing: t.value })} title={t.label} small />
                    ))}
                  </div>
                  {schedules[0]?.timing !== 'pre-order' && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5" />
                      <span>후불 결제는 전자계약이 필요하며 심사 결과에 따라 불가할 수 있습니다.</span>
                    </div>
                  )}
                </motion.div>
              )}

              {scheduleType === 'split' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {schedules.map((schedule, index) => (
                    <div key={schedule.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{schedule.label}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={schedule.amount ? formatAmount(schedule.amount) : ''}
                            onChange={(e) => {
                              const amount = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                              updateSchedule(index, { amount, methods: [createEmptyMethod(amount)], proofs: [createEmptyProof(amount)] });
                              if (index === 0) {
                                updateSchedule(1, { amount: totalAmount - amount, methods: [createEmptyMethod(totalAmount - amount)], proofs: [createEmptyProof(totalAmount - amount)] });
                              }
                            }}
                            className="w-32 px-3 py-2 rounded-lg border border-gray-200 text-right font-semibold focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20"
                          />
                          <span className="text-gray-500">원</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {TIMING_OPTIONS.map(t => (
                          <OptionCard key={t.value} selected={schedule.timing === t.value} onClick={() => updateSchedule(index, { timing: t.value })} title={t.label} small />
                        ))}
                      </div>
                    </div>
                  ))}
                  {schedules.reduce((sum, s) => sum + s.amount, 0) !== totalAmount && (
                    <div className="text-sm text-red-500 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      합계가 {formatCurrency(totalAmount)}이어야 합니다
                    </div>
                  )}
                </motion.div>
              )}

              {scheduleType && (
                <Button variant="primary" size="lg" className="w-full" onClick={nextStep} disabled={!isStep1Valid} rightIcon={<ArrowRight className="w-5 h-5" />}>
                  다음
                </Button>
              )}
            </div>
          </StepCard>

          {/* Step 2: 결제 주체 */}
          {currentStep >= 2 && (
            <StepCard
              step={2}
              title="결제 주체"
              isActive={currentStep === 2}
              isCompleted={currentStep > 2}
              onEdit={() => goToStep(2)}
              summary={
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1a2867]" />
                  <span>{payorInfo.type === 'company' ? payorInfo.company : payorInfo.name} ({payorInfo.email})</span>
                </div>
              }
            >
              <div className="space-y-5">
                {/* 저장된 정보 */}
                <div className="relative">
                  <button type="button" onClick={() => setShowSavedList(!showSavedList)} className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100">
                    <span className="flex items-center gap-2 text-sm text-gray-700"><FolderOpen className="w-4 h-4" />저장된 정보 불러오기</span>
                    <ChevronDown className={cn('w-5 h-5 text-gray-400 transition-transform', showSavedList && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {showSavedList && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {SAMPLE_SAVED_PAYORS.map(saved => (
                          <button key={saved.id} type="button" onClick={() => loadSavedPayor(saved)} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left">
                            <div className="w-8 h-8 rounded-full bg-[#1a2867]/10 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-[#1a2867]" />
                            </div>
                            <span className="font-medium text-gray-900">{saved.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 유형 선택 */}
                <div className="grid grid-cols-2 gap-3">
                  <OptionCard selected={payorInfo.type === 'personal'} onClick={() => setPayorInfo(prev => ({ ...prev, type: 'personal' }))} icon={User} title="개인" />
                  <OptionCard selected={payorInfo.type === 'company'} onClick={() => setPayorInfo(prev => ({ ...prev, type: 'company' }))} icon={Building2} title="회사/기관" />
                </div>

                {/* 정보 입력 */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="이름" value={payorInfo.name} onChange={(v) => setPayorInfo(prev => ({ ...prev, name: v }))} placeholder="홍길동" />
                    {payorInfo.type === 'company' && (
                      <Input label="회사명" value={payorInfo.company} onChange={(v) => setPayorInfo(prev => ({ ...prev, company: v }))} placeholder="주식회사 OOO" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="연락처" value={payorInfo.phone} onChange={(v) => setPayorInfo(prev => ({ ...prev, phone: v }))} placeholder="010-0000-0000" />
                    <Input label="이메일" value={payorInfo.email} onChange={(v) => setPayorInfo(prev => ({ ...prev, email: v }))} placeholder="email@example.com" />
                  </div>
                </div>

                {/* 저장 체크 */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={savePayor} onChange={(e) => setSavePayor(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#1a2867]" />
                  <span className="text-sm text-gray-700 flex items-center gap-1"><Save className="w-4 h-4 text-gray-400" />이 정보 저장하기</span>
                </label>

                <Button variant="primary" size="lg" className="w-full" onClick={nextStep} disabled={!isStep2Valid} rightIcon={<ArrowRight className="w-5 h-5" />}>
                  다음
                </Button>
              </div>
            </StepCard>
          )}

          {/* Step 3: 결제 수단 */}
          {currentStep >= 3 && (
            <StepCard
              step={3}
              title="결제 수단"
              isActive={currentStep === 3}
              isCompleted={currentStep > 3}
              onEdit={() => goToStep(3)}
              summary={
                <div className="space-y-1">
                  {schedules.map(schedule => (
                    <div key={schedule.id}>
                      {schedules.length > 1 && <span className="text-gray-500">{schedule.label}: </span>}
                      {schedule.methods.map((m, i) => {
                        const info = PAYMENT_METHODS.find(pm => pm.id === m.type);
                        return (
                          <span key={m.id} className="inline-flex items-center gap-1">
                            {i > 0 && ' + '}
                            {info && <info.icon className="w-4 h-4 text-[#1a2867]" />}
                            {info?.name} {formatCurrency(m.amount)}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
              }
            >
              <div className="space-y-6">
                {schedules.map((schedule, scheduleIndex) => (
                  <div key={schedule.id} className="space-y-3">
                    {schedules.length > 1 && (
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <span className="w-6 h-6 rounded-full bg-[#1a2867] text-white flex items-center justify-center text-xs">{scheduleIndex + 1}</span>
                        {schedule.label} - {formatCurrency(schedule.amount)}
                      </div>
                    )}

                    {schedule.methods.map((method, methodIndex) => (
                      <PaymentMethodInput
                        key={method.id}
                        method={method}
                        onChange={(updates) => updateMethod(scheduleIndex, methodIndex, updates)}
                        onRemove={() => removeMethod(scheduleIndex, methodIndex)}
                        canRemove={schedule.methods.length > 1}
                        totalAmount={schedule.amount - schedule.methods.filter((_, i) => i !== methodIndex).reduce((sum, m) => sum + m.amount, 0)}
                      />
                    ))}

                    <button type="button" onClick={() => addMethod(scheduleIndex)} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#1a2867] hover:text-[#1a2867] flex items-center justify-center gap-1">
                      <Plus className="w-4 h-4" />결제 수단 추가
                    </button>

                    {/* 금액 검증 */}
                    {schedule.methods.length > 1 && (
                      <div className={cn('text-sm p-2 rounded-lg', Math.abs(schedule.methods.reduce((sum, m) => sum + m.amount, 0) - schedule.amount) < 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                        수단 합계: {formatCurrency(schedule.methods.reduce((sum, m) => sum + m.amount, 0))} / {formatCurrency(schedule.amount)}
                      </div>
                    )}
                  </div>
                ))}

                <Button variant="primary" size="lg" className="w-full" onClick={nextStep} disabled={!isStep3Valid} rightIcon={<ArrowRight className="w-5 h-5" />}>
                  {schedules.some(s => needsProofInput(s.methods)) ? '다음' : '확인하기'}
                </Button>
              </div>
            </StepCard>
          )}

          {/* Step 4: 증빙 (필요한 경우만) */}
          {currentStep >= 4 && schedules.some(s => needsProofInput(s.methods)) && (
            <StepCard
              step={4}
              title="증빙 서류"
              isActive={currentStep === 4}
              isCompleted={currentStep > 4}
              onEdit={() => goToStep(4)}
              summary={
                <div className="space-y-1">
                  {schedules.filter(s => needsProofInput(s.methods)).map(schedule => (
                    <div key={schedule.id}>
                      {schedules.length > 1 && <span className="text-gray-500">{schedule.label}: </span>}
                      {schedule.proofs.map((p, i) => (
                        <span key={p.id}>
                          {i > 0 && ' + '}
                          {p.type === 'tax-invoice' ? '세금계산서' : p.type === 'cash-receipt' ? '현금영수증' : '없음'} {formatCurrency(p.amount)}
                          {p.recipientType === 'other' && p.businessInfo && ` → ${p.businessInfo.companyName}`}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              }
            >
              <div className="space-y-6">
                {schedules.map((schedule, scheduleIndex) => {
                  if (!needsProofInput(schedule.methods)) return null;
                  
                  return (
                    <div key={schedule.id} className="space-y-3">
                      {schedules.length > 1 && (
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Receipt className="w-4 h-4 text-[#1a2867]" />
                          {schedule.label} - {formatCurrency(schedule.amount)}
                        </div>
                      )}

                      {schedule.proofs.map((proof, proofIndex) => (
                        <ProofInput
                          key={proof.id}
                          proof={proof}
                          onChange={(updates) => updateProof(scheduleIndex, proofIndex, updates)}
                          onRemove={() => removeProof(scheduleIndex, proofIndex)}
                          canRemove={schedule.proofs.length > 1}
                          totalAmount={schedule.amount - schedule.proofs.filter((_, i) => i !== proofIndex).reduce((sum, p) => sum + p.amount, 0)}
                        />
                      ))}

                      <button type="button" onClick={() => addProof(scheduleIndex)} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#1a2867] hover:text-[#1a2867] flex items-center justify-center gap-1">
                        <Plus className="w-4 h-4" />증빙 추가 (분할 발행)
                      </button>

                      {schedule.proofs.length > 1 && (
                        <div className={cn('text-sm p-2 rounded-lg', Math.abs(schedule.proofs.reduce((sum, p) => sum + p.amount, 0) - schedule.amount) < 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
                          증빙 합계: {formatCurrency(schedule.proofs.reduce((sum, p) => sum + p.amount, 0))} / {formatCurrency(schedule.amount)}
                        </div>
                      )}
                    </div>
                  );
                })}

                <Button variant="primary" size="lg" className="w-full" onClick={nextStep} disabled={!isStep4Valid} rightIcon={<ArrowRight className="w-5 h-5" />}>
                  확인하기
                </Button>
              </div>
            </StepCard>
          )}

          {/* Step 5: 최종 확인 */}
          {((currentStep >= 4 && !schedules.some(s => needsProofInput(s.methods))) || currentStep >= 5) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border-2 border-[#1a2867] shadow-xl overflow-hidden">
              <div className="px-6 py-4 bg-[#1a2867]">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Check className="w-5 h-5" />최종 확인
                </h3>
              </div>

              <div className="p-6 space-y-5">
                {/* 예치금 */}
                {availableDeposit > 0 && (
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-gray-900">예치금 사용</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-amber-700 font-semibold">{formatCurrency(availableDeposit)}</span>
                        <button
                          type="button"
                          onClick={() => setUseDeposit(!useDeposit)}
                          className={cn('relative w-12 h-6 rounded-full transition-colors', useDeposit ? 'bg-amber-500' : 'bg-gray-300')}
                        >
                          <motion.div animate={{ x: useDeposit ? 24 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 결제 요약 */}
                <div className="space-y-3">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="p-4 bg-gray-50 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{schedules.length > 1 ? schedule.label : '결제'}</span>
                        <span className="font-bold text-[#1a2867]">{formatCurrency(schedule.amount)}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {TIMING_OPTIONS.find(t => t.value === schedule.timing)?.label}
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          {schedule.methods.map((m, i) => {
                            const info = PAYMENT_METHODS.find(pm => pm.id === m.type);
                            return <span key={m.id}>{i > 0 && ' + '}{info?.name}</span>;
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4" />
                          {PAYMENT_METHODS.find(pm => pm.id === schedule.methods[0]?.type)?.autoProof ? (
                            <span className="text-emerald-600">영수증 자동 발급</span>
                          ) : (
                            schedule.proofs.map((p, i) => (
                              <span key={p.id}>
                                {i > 0 && ' + '}
                                {p.type === 'tax-invoice' ? '세금계산서' : p.type === 'cash-receipt' ? '현금영수증' : '없음'}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 금액 */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">주문 금액</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  {useDeposit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">예치금 차감</span>
                      <span className="text-amber-600">-{formatCurrency(availableDeposit)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>최종 결제 금액</span>
                    <span className="text-[#1a2867]">{formatCurrency(actualAmount)}</span>
                  </div>
                </div>

                <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit} disabled={isLoading} rightIcon={!isLoading && <ArrowRight className="w-5 h-5" />}>
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : schedules.some(s => s.timing !== 'pre-order') ? '전자 계약 작성' : '결제 진행'}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}