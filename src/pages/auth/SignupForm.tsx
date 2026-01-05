import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  Info, 
  Mail, 
  Phone, 
  User, 
  Building2, 
  Lock, 
  Check, 
  Eye, 
  EyeOff,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';
import { SocialLoginButtons } from '../../components/shared/SocialLoginButtons';

// ========== 타입 정의 ==========
interface FormData {
  userType: 'individual' | 'company' | '';
  email: string;
  phone: string;
  companyName: string;
  name: string;
  password: string;
  confirmPassword: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  termsAgreed: boolean;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

interface ExistingUserData {
  userType: 'individual' | 'company';
  email: string;
  phone: string;
  companyName: string;
  name: string;
}

// ========== Mock 데이터 ==========
const MOCK_DATABASE: Record<string, ExistingUserData> = {
  'test@example.com': {
    userType: 'company',
    email: 'test@example.com',
    phone: '01012345678',
    companyName: '테스트 주식회사',
    name: '홍길동'
  },
  '01098765432': {
    userType: 'individual',
    email: 'user@test.com',
    phone: '01098765432',
    companyName: '',
    name: '김철수'
  }
};

// ========== 유틸리티 ==========
const cn = (...classes: (string | boolean | undefined | null)[]) => 
  classes.filter(Boolean).join(' ');

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
  rightIcon?: React.ReactNode;
  required?: boolean;
  error?: string;
  suffix?: React.ReactNode;
}

const Input = ({ 
  label, 
  leftIcon, 
  rightIcon,
  required, 
  error,
  suffix,
  className, 
  disabled,
  ...props 
}: InputProps) => (
  <div className="space-y-2">
    {label && (
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {leftIcon && <span className="text-gray-400">{leftIcon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="flex gap-2">
      <div className="relative flex-1">
        {leftIcon && !label && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            'w-full rounded-xl border bg-gray-50/50 text-gray-900 placeholder:text-gray-400',
            'py-3.5 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867] focus:bg-white',
            'hover:border-gray-300 hover:bg-white',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            leftIcon && !label ? 'pl-11 pr-4' : 'px-4',
            rightIcon ? 'pr-11' : '',
            error 
              ? 'border-red-400 focus:ring-red-200 focus:border-red-400' 
              : 'border-gray-200',
            className
          )}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {suffix}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="flex items-center gap-1.5 text-sm text-red-500"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

interface SelectCardProps {
  name: string;
  icon?: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

const SelectCard = ({ name, icon, selected, onSelect }: SelectCardProps) => (
  <motion.button
    type="button"
    onClick={onSelect}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      'relative flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all',
      selected
        ? 'border-[#1a2867] bg-[#1a2867]/5 shadow-md shadow-[#1a2867]/10'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
    )}
  >
    {icon && (
      <span className={cn(
        'transition-colors',
        selected ? 'text-[#1a2867]' : 'text-gray-400'
      )}>
        {icon}
      </span>
    )}
    <span className={cn(
      'font-medium transition-colors',
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
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1a2867] rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

interface VerifyButtonProps {
  verified: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

const VerifyButton = ({ verified, onClick, isLoading }: VerifyButtonProps) => (
  <motion.button
    type="button"
    onClick={onClick}
    disabled={verified || isLoading}
    whileTap={{ scale: verified ? 1 : 0.98 }}
    className={cn(
      'px-4 py-3.5 rounded-xl whitespace-nowrap font-medium transition-all',
      verified
        ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200 cursor-default'
        : 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90 shadow-md shadow-[#1a2867]/20'
    )}
  >
    {isLoading ? (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
      />
    ) : verified ? (
      <span className="flex items-center gap-1.5">
        <Check className="w-4 h-4" />
        인증완료
      </span>
    ) : (
      '인증받기'
    )}
  </motion.button>
);

// ========== 자동완성 모달 ==========
interface AutoFillModalProps {
  isOpen: boolean;
  data: ExistingUserData | null;
  matchedField: 'email' | 'phone';
  onAccept: () => void;
  onDecline: () => void;
}

const AutoFillModal = ({ isOpen, data, matchedField, onAccept, onDecline }: AutoFillModalProps) => (
  <AnimatePresence>
    {isOpen && data && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDecline}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl border border-gray-100"
        >
          <button
            onClick={onDecline}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1a2867]/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#1a2867]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                연동된 정보 발견
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                해당 {matchedField === 'email' ? '이메일' : '연락처'}과 연동된 정보가 존재합니다. 
                나머지 정보를 자동으로 입력하시겠습니까?
              </p>
              
              {/* 미리보기 */}
              <div className="p-4 bg-gray-50 rounded-xl mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">이름:</span>
                  <span className="font-medium text-gray-900">{data.name}</span>
                </div>
                {data.companyName && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">회사:</span>
                    <span className="font-medium text-gray-900">{data.companyName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">이메일:</span>
                  <span className="font-medium text-gray-900">{data.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">연락처:</span>
                  <span className="font-medium text-gray-900">{data.phone}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={onAccept}
                  variant="primary"
                  className="flex-1"
                >
                  예, 자동입력
                </Button>
                <Button
                  onClick={onDecline}
                  variant="secondary"
                  className="flex-1"
                >
                  아니오
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ========== 메인 컴포넌트 ==========
export function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    userType: '',
    email: '',
    phone: '',
    companyName: '',
    name: '',
    password: '',
    confirmPassword: '',
    emailVerified: false,
    phoneVerified: false,
    termsAgreed: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  
  // 자동완성 모달 상태
  const [showAutoFillPrompt, setShowAutoFillPrompt] = useState(false);
  const [pendingAutoFillData, setPendingAutoFillData] = useState<ExistingUserData | null>(null);
  const [matchedField, setMatchedField] = useState<'email' | 'phone'>('email');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.userType) {
      newErrors.userType = '가입 유형을 선택해주세요';
    }

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    } else if (!formData.emailVerified) {
      newErrors.email = '이메일 인증을 완료해주세요';
    }

    if (!formData.phone) {
      newErrors.phone = '연락처를 입력해주세요';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 연락처를 입력해주세요';
    } else if (!formData.phoneVerified) {
      newErrors.phone = '연락처 인증을 완료해주세요';
    }

    if (formData.userType === 'company' && !formData.companyName) {
      newErrors.companyName = '회사명을 입력해주세요';
    }

    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!formData.termsAgreed) {
      newErrors.termsAgreed = '약관에 동의해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    alert('회원가입이 완료되었습니다!');
    
    setIsLoading(false);
  };

  const updateFormData = <K extends keyof FormData>(
    field: K, 
    value: FormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const checkExistingData = (identifier: string, type: 'email' | 'phone'): boolean => {
    const existingData = MOCK_DATABASE[identifier];
    if (existingData) {
      setPendingAutoFillData(existingData);
      setMatchedField(type);
      setShowAutoFillPrompt(true);
      return true;
    }
    return false;
  };

  const handleAutoFill = (accept: boolean) => {
    if (accept && pendingAutoFillData) {
      setFormData(prev => ({
        ...prev,
        userType: pendingAutoFillData.userType,
        email: pendingAutoFillData.email,
        phone: pendingAutoFillData.phone,
        companyName: pendingAutoFillData.companyName,
        name: pendingAutoFillData.name,
        emailVerified: true,
        phoneVerified: true
      }));
    }
    setShowAutoFillPrompt(false);
    setPendingAutoFillData(null);
  };

  const handleVerifyEmail = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: '유효한 이메일을 먼저 입력해주세요' }));
      return;
    }

    setVerifyingEmail(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const hasExistingData = checkExistingData(formData.email, 'email');
    
    if (!hasExistingData) {
      updateFormData('emailVerified', true);
      alert('이메일 인증이 완료되었습니다.');
    }
    
    setVerifyingEmail(false);
  };

  const handleVerifyPhone = async () => {
    if (!formData.phone || !/^[0-9]{10,11}$/.test(formData.phone.replace(/-/g, ''))) {
      setErrors(prev => ({ ...prev, phone: '유효한 연락처를 먼저 입력해주세요' }));
      return;
    }

    setVerifyingPhone(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const hasExistingData = checkExistingData(formData.phone, 'phone');
    
    if (!hasExistingData) {
      updateFormData('phoneVerified', true);
      alert('연락처 인증이 완료되었습니다.');
    }
    
    setVerifyingPhone(false);
  };

  // 비밀번호 강도 계산
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-500'];
  const strengthLabels = ['', '매우 약함', '약함', '보통', '강함', '매우 강함'];

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white via-gray-50/50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* 헤더 */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              회원가입
            </h1>
            <p className="text-lg text-gray-500">
              회원 정보를 입력해주세요
            </p>
          </motion.div>
        </div>

        {/* 자동완성 모달 */}
        <AutoFillModal
          isOpen={showAutoFillPrompt}
          data={pendingAutoFillData}
          matchedField={matchedField}
          onAccept={() => handleAutoFill(true)}
          onDecline={() => handleAutoFill(false)}
        />

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 가입 유형 선택 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <label className="block text-sm font-semibold text-gray-700">
              가입 유형 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <SelectCard
                name="개인"
                icon={<User className="w-5 h-5" />}
                selected={formData.userType === 'individual'}
                onSelect={() => updateFormData('userType', 'individual')}
              />
              <SelectCard
                name="회사"
                icon={<Building2 className="w-5 h-5" />}
                selected={formData.userType === 'company'}
                onSelect={() => updateFormData('userType', 'company')}
              />
            </div>
            <AnimatePresence>
              {errors.userType && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1.5 text-sm text-red-500"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.userType}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 이메일 입력 + 인증 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Input
              label="이메일"
              leftIcon={<Mail className="w-4 h-4" />}
              required
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="your@email.com"
              error={errors.email}
              disabled={formData.emailVerified}
              suffix={
                <VerifyButton
                  verified={formData.emailVerified}
                  onClick={handleVerifyEmail}
                  isLoading={verifyingEmail}
                />
              }
            />
          </motion.div>

          {/* 연락처 입력 + 인증 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Input
              label="연락처"
              leftIcon={<Phone className="w-4 h-4" />}
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              placeholder="01012345678"
              error={errors.phone}
              disabled={formData.phoneVerified}
              suffix={
                <VerifyButton
                  verified={formData.phoneVerified}
                  onClick={handleVerifyPhone}
                  isLoading={verifyingPhone}
                />
              }
            />
          </motion.div>

          {/* 회사명 (조건부) */}
          <AnimatePresence>
            {formData.userType === 'company' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  label="회사명"
                  leftIcon={<Building2 className="w-4 h-4" />}
                  required
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  placeholder="회사명을 입력하세요"
                  error={errors.companyName}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 이름 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Input
              label="이름"
              leftIcon={<User className="w-4 h-4" />}
              required
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="홍길동"
              error={errors.name}
            />
          </motion.div>

          {/* 비밀번호 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <Input
              label="비밀번호"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              placeholder="최소 8자 이상"
              error={errors.password}
            />
            
            {/* 비밀번호 강도 표시 */}
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'h-1.5 flex-1 rounded-full transition-colors duration-300',
                        level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200'
                      )}
                    />
                  ))}
                </div>
                <p className={cn(
                  'text-xs',
                  passwordStrength <= 2 ? 'text-red-500' : 
                  passwordStrength === 3 ? 'text-orange-500' : 'text-emerald-600'
                )}>
                  비밀번호 강도: {strengthLabels[passwordStrength]}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* 비밀번호 확인 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Input
              label="비밀번호 확인"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => updateFormData('confirmPassword', e.target.value)}
              placeholder="비밀번호 재입력"
              error={errors.confirmPassword}
            />
            
            {/* 비밀번호 일치 표시 */}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5 text-sm text-emerald-600 mt-2"
              >
                <Check className="w-4 h-4" />
                비밀번호가 일치합니다
              </motion.p>
            )}
          </motion.div>

          {/* 약관 동의 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-2"
          >
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={formData.termsAgreed}
                  onChange={(e) => updateFormData('termsAgreed', e.target.checked)}
                  className="sr-only peer"
                />
                <div className={cn(
                  'w-5 h-5 rounded-md border-2 transition-all duration-200',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-[#1a2867]/20',
                  formData.termsAgreed 
                    ? 'bg-[#1a2867] border-[#1a2867]' 
                    : 'border-gray-300 bg-white group-hover:border-gray-400'
                )}>
                  <AnimatePresence>
                    {formData.termsAgreed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                <a href="#" className="text-[#1a2867] hover:underline font-medium">서비스 이용약관</a> 및{' '}
                <a href="#" className="text-[#1a2867] hover:underline font-medium">개인정보 처리방침</a>에 동의합니다.{' '}
                <span className="text-red-500">*</span>
              </span>
            </label>
            <AnimatePresence>
              {errors.termsAgreed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1.5 text-sm text-red-500 mt-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.termsAgreed}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 가입 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              rightIcon={!isLoading && <ArrowRight className="w-5 h-5" />}
              className="w-full"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                '가입 완료'
              )}
            </Button>
          </motion.div>

          {/* 구분선 */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-br from-white via-gray-50/50 to-white text-gray-400 text-sm font-medium">
                또는
              </span>
            </div>
          </div>

          {/* 소셜 로그인 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <SocialLoginButtons />
          </motion.div>
        </form>

        {/* 로그인 링크 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500">
            이미 계정이 있으신가요?{' '}
            <a href="#" className="text-[#1a2867] hover:underline font-semibold">
              로그인
            </a>
          </p>
        </motion.div>

        {/* 테스트 계정 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-700 text-sm">테스트용 자동완성 정보</h3>
            </div>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">test@example.com</code>
                </div>
                <p className="text-gray-500 ml-5">회사 계정으로 자동완성 테스트</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">01098765432</code>
                </div>
                <p className="text-gray-500 ml-5">개인 계정으로 자동완성 테스트</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SignupForm;