import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Gift, Mail, Phone, Lock, User, Check, Info, Eye, EyeOff, ArrowRight, Percent, Bell, UserCheck } from 'lucide-react';
import { SocialLoginButtons } from '../../components/shared/SocialLoginButtons';

// ========== 타입 정의 ==========
interface LoginFormData {
  loginType: 'email' | 'phone';
  identifier: string;
  password: string;
  rememberMe: boolean;
}

type FormErrors = Partial<Record<keyof LoginFormData | 'general', string>>;

// ========== Mock 데이터 ==========
const MOCK_USERS = {
  'test@example.com': { password: 'password123', name: '홍길동' },
  '01012345678': { password: 'password123', name: '홍길동' },
  'user@test.com': { password: 'test1234', name: '김철수' },
  '01098765432': { password: 'test1234', name: '김철수' }
} as const;

// ========== 유틸리티 ==========
const cn = (...classes: (string | boolean | undefined | null)[]) => 
  classes.filter(Boolean).join(' ');

// ========== UI 컴포넌트 ==========
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'accent' | 'ghost';
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
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20',
    outline: 'border-2 border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-gray-50',
    accent: 'bg-[#fab803] text-gray-900 hover:bg-[#fab803]/90 shadow-lg shadow-[#fab803]/20',
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
}

const Input = ({ 
  label, 
  leftIcon, 
  rightIcon,
  required, 
  error,
  className, 
  ...props 
}: InputProps) => (
  <div className="space-y-2">
    {label && (
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {leftIcon && <span className="text-gray-400">{leftIcon}</span>}
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
    )}
    <div className="relative">
      {leftIcon && !label && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}
      <input
        className={cn(
          'w-full rounded-xl border bg-gray-50/50 text-gray-900 placeholder:text-gray-400',
          'py-3.5 transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white',
          'hover:border-gray-300 hover:bg-white',
          leftIcon && !label ? 'pl-11 pr-4' : 'px-4',
          rightIcon ? 'pr-11' : '',
          error 
            ? 'border-destructive focus:ring-destructive/20 focus:border-destructive' 
            : 'border-gray-200',
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightIcon}
        </div>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          className="flex items-center gap-1.5 text-sm text-destructive"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

interface AlertBoxProps {
  type?: 'info' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}

const AlertBox = ({ type = 'error', title, children }: AlertBoxProps) => {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-800',
      icon: <Info className="w-5 h-5 flex-shrink-0 text-blue-500" />
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-800',
      icon: <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-800',
      icon: <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
    }
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn('flex gap-3 p-4 rounded-xl border', styles.bg, styles.border)}
    >
      {styles.icon}
      <div className={cn('text-sm', styles.text)}>
        {title && <p className="font-semibold mb-1">{title}</p>}
        {children}
      </div>
    </motion.div>
  );
};

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
        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
    )}
  >
    {icon && (
      <span className={cn(
        'transition-colors',
        selected ? 'text-primary' : 'text-gray-400'
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
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

// ========== 메인 컴포넌트 ==========
export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    loginType: 'email',
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.identifier) {
      newErrors.identifier = formData.loginType === 'email' 
        ? '이메일을 입력해주세요' 
        : '연락처를 입력해주세요';
    } else {
      if (formData.loginType === 'email' && !/\S+@\S+\.\S+/.test(formData.identifier)) {
        newErrors.identifier = '유효한 이메일 주소를 입력해주세요';
      }
      if (formData.loginType === 'phone' && !/^[0-9]{10,11}$/.test(formData.identifier.replace(/-/g, ''))) {
        newErrors.identifier = '유효한 연락처를 입력해주세요';
      }
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // 로그인 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS[formData.identifier as keyof typeof MOCK_USERS];
    
    if (user && user.password === formData.password) {
      console.log('Login successful:', formData);
      alert(`로그인 성공! ${user.name}님 환영합니다.`);
    } else {
      setErrors({ general: '이메일/연락처 또는 비밀번호가 일치하지 않습니다.' });
    }
    
    setIsLoading(false);
  };

  const updateFormData = <K extends keyof LoginFormData>(
    field: K, 
    value: LoginFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 입력 시 관련 에러 클리어
    if (errors[field] || errors.general) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const handleLoginTypeChange = (type: 'email' | 'phone') => {
    updateFormData('loginType', type);
    updateFormData('identifier', '');
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white via-gray-50/50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* 헤더 */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              로그인
            </h1>
            <p className="text-lg text-gray-500">
              계정에 로그인하세요
            </p>
          </motion.div>
        </div>

        {/* 일반 에러 메시지 */}
        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <AlertBox type="error">{errors.general}</AlertBox>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 로그인 타입 선택 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <label className="block text-sm font-semibold text-gray-700">
              로그인 방법
            </label>
            <div className="grid grid-cols-2 gap-3">
              <SelectCard
                name="이메일"
                icon={<Mail className="w-5 h-5" />}
                selected={formData.loginType === 'email'}
                onSelect={() => handleLoginTypeChange('email')}
              />
              <SelectCard
                name="연락처"
                icon={<Phone className="w-5 h-5" />}
                selected={formData.loginType === 'phone'}
                onSelect={() => handleLoginTypeChange('phone')}
              />
            </div>
          </motion.div>

          {/* 이메일/연락처 입력 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Input
              label={formData.loginType === 'email' ? '이메일' : '연락처'}
              leftIcon={formData.loginType === 'email' 
                ? <Mail className="w-4 h-4" /> 
                : <Phone className="w-4 h-4" />
              }
              required
              type={formData.loginType === 'email' ? 'email' : 'tel'}
              value={formData.identifier}
              onChange={(e) => updateFormData('identifier', e.target.value)}
              placeholder={formData.loginType === 'email' ? 'your@email.com' : '01012345678'}
              error={errors.identifier}
              autoComplete={formData.loginType === 'email' ? 'email' : 'tel'}
            />
          </motion.div>

          {/* 비밀번호 입력 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
                  {showPassword 
                    ? <EyeOff className="w-4 h-4" /> 
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              }
              required
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              placeholder="비밀번호를 입력하세요"
              error={errors.password}
              autoComplete="current-password"
            />
          </motion.div>

          {/* 로그인 상태 유지 & 비밀번호 찾기 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between"
          >
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => updateFormData('rememberMe', e.target.checked)}
                  className="sr-only peer"
                />
                <div className={cn(
                  'w-5 h-5 rounded-md border-2 transition-all duration-200',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20',
                  formData.rememberMe 
                    ? 'bg-primary border-primary' 
                    : 'border-gray-300 bg-white group-hover:border-gray-400'
                )}>
                  <AnimatePresence>
                    {formData.rememberMe && (
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
                로그인 상태 유지
              </span>
            </label>
            <a 
              href="#" 
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              비밀번호 찾기
            </a>
          </motion.div>

          {/* 로그인 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              rightIcon={!isLoading && <ArrowRight className="w-5 h-5" />}
              className="w-full !bg-[#1a2867] hover:!bg-[#1a2867]/90 !shadow-none"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                '로그인'
              )}
            </Button>
          </motion.div>
        </form>

        {/* 회원가입 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all hover:shadow-xl hover:border-primary/30">
            {/* 헤더 */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fab803]/10 rounded-full mb-3">
                <Gift className="w-5 h-5 text-[#fab803]" />
                <span className="text-sm font-bold text-[rgb(0,0,0)] text-[15px]">회원 가입 혜택</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-[18px]">
                지금 가입하고 전용 혜택을 누리세요 😊
              </h3>
              <p className="text-sm text-gray-600">
                모든 프로세스를 더 효율적으로 관리하세요!
              </p>
            </div>

            {/* 혜택 리스트 */}
            <div className="space-y-3 mb-6">
              {/* 혜택 1 */}
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#fab803]/5 to-transparent rounded-xl border border-[#fab803]/20">
                <div className="flex-shrink-0 w-10 h-10 bg-[#fab803] rounded-lg flex items-center justify-center">
                  <Percent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-[14px]">
                    모든 주문의 추가 할인 자동 적용
                  </h4>
                  <p className="text-sm text-gray-600 text-[13px]">
                    회원님의 모든 주문에 할인이 자동으로 적용됩니다
                  </p>
                </div>
              </div>

              {/* 혜택 2 */}
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#fab803]/5 to-transparent rounded-xl border border-[#fab803]/20">
                <div className="flex-shrink-0 w-10 h-10 bg-[#fab803] rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-[14px]">
                    주문 내역 실시간 대시보드 제공
                  </h4>
                  <p className="text-sm text-gray-600 text-[13px]">
                    제작 진행 상황을 실시간으로 확인할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 혜택 3 */}
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#fab803]/5 to-transparent rounded-xl border border-[#fab803]/20">
                <div className="flex-shrink-0 w-10 h-10 bg-[#fab803] rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-[14px]">
                    전담 매니저 배정 및 우선 상담
                  </h4>
                  <p className="text-sm text-gray-600 text-[13px]">
                    전문 매니저가 빠른 1:1 상담을 받을 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full"
            >
              <div className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                <span>회원 가입</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.a>
          </div>
        </motion.div>

        {/* 구분선 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-br from-white via-gray-50/50 to-white text-gray-400 text-sm font-medium">
                또는
              </span>
            </div>
          </div>
        </motion.div>

        {/* 소셜 로그인 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <SocialLoginButtons />
        </motion.div>

        {/* 테스트 계정 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-700 text-sm">테스트용 계정 정보</h3>
            </div>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">test@example.com</code>
                  <span className="text-gray-300">|</span>
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">01012345678</code>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>비밀번호:</span>
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">password123</code>
                </div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">user@test.com</code>
                  <span className="text-gray-300">|</span>
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">01098765432</code>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>비밀번호:</span>
                  <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">test1234</code>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginForm;