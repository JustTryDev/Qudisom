import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, X, Download, Printer, MessageCircle, Send, Paperclip, Package, Gift, FileText, User, CreditCard, Calendar, Clock, Shirt, Ruler, Palette, Building2, Mail, Phone, Lock, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, AlertCircle, Upload, Trash2, File, MousePointer, CheckSquare, Scroll, FileDown, FolderUp, HelpCircle, Sparkles, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { OrderProgressBar } from '../../components/shared/OrderProgressBar';
import { DeliveryScenarioSection } from '../../components/quote/DeliveryScenarioSection';

interface QuoteItem {
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

interface ChatMessage {
  id: string;
  sender: 'customer' | 'manager';
  message: string;
  timestamp: Date;
  files?: { name: string; url: string }[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  note: string;
}

interface QuoteProps {
  onNavigate?: (page: string) => void;
}

interface TourStep {
  target: string;
  title: string;
  description: string;
}

const TOUR_STEPS: TourStep[] = [
  { target: 'tour-quantity', title: '수량 변경', description: '수량 부분을 직접 선택해서 변경할 수 있어요! 변경된 상태로 견적서 인쇄까지 할 수 있습니다.' },
  { target: 'tour-checkbox', title: '선택 결제', description: '원하는 상품만을 선택해서 결제할 수 있어요! 예를 들어 샘플을 먼저 만들고 싶다면, 샘플만 먼저 결제할 수 있어요!' },
  { target: 'tour-pdf-cutline', title: '인쇄 범위', description: 'PDF 인쇄 시 안내 사항까지만 인쇄되며, 하단의 서류 업로드 및 메모 섹션은 인쇄되지 않아요!' },
  { target: 'tour-basic-docs', title: '기본 서류 다운로드', description: '기본적인 서류는 이 곳에서 다운로드 할 수 있어요!' },
  { target: 'tour-customer-upload', title: '고객 서류 제출', description: '고객님이 아닌 회사에서 작성해야 하는 서류가 있다면 이 곳에 첨부해 주세요!' },
  { target: 'tour-public-docs', title: '공공 기관 전용 서류', description: '해당 섹션에서는 공공 기관 결재 시 필요한 서류를 간편하게 다운로드 받을 수 있어요! *다운로드를 위해서는 공공 기관 인증이 필요합니다!' },
  { target: 'tour-inquiry', title: '문의 사항', description: '견적과 관련된 문의 사항을 자유롭게 남기실 수 있어요!' },
];

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// 가이드 투어 컴포넌트
function QuoteTour({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightBox, setHighlightBox] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  // 위치 업데이트 함수
  const updatePosition = useCallback(() => {
    const targetEl = document.getElementById(step.target);
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    
    // 하이라이트 박스 위치 (뷰포트 기준)
    setHighlightBox({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    });

    // 툴팁 위치 계산
    const tooltipWidth = 420;
    const tooltipHeight = 280;
    const padding = 16;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    let top = rect.bottom + padding;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // 아래 공간이 부족하면 위에 표시
    if (top + tooltipHeight > windowHeight - padding) {
      top = rect.top - tooltipHeight - padding;
    }

    // 좌우 경계 체크
    if (left < padding) left = padding;
    if (left + tooltipWidth > windowWidth - padding) {
      left = windowWidth - tooltipWidth - padding;
    }

    // 위로 올라갔을 때 음수 방지
    if (top < padding) top = padding;

    setTooltipPos({ top, left });
    setIsPositioned(true);
  }, [step.target]);

  // 스텝 변경 시 스크롤 및 위치 업데이트
  useEffect(() => {
    setIsPositioned(false);
    
    const targetEl = document.getElementById(step.target);
    if (!targetEl) return;

    // 먼저 스크롤
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 스크롤 완료 후 위치 업데이트 (여러 번 체크)
    const timers = [
      setTimeout(updatePosition, 100),
      setTimeout(updatePosition, 300),
      setTimeout(updatePosition, 500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [currentStep, step.target, updatePosition]);

  // 스크롤/리사이즈 이벤트 리스너
  useEffect(() => {
    const handleUpdate = () => updatePosition();
    
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [updatePosition]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: 'none' }}>
      {/* 오버레이 with 컷아웃 */}
      <svg className="fixed inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
        <defs>
          <mask id="spotlight">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {isPositioned && (
              <rect
                x={highlightBox.left - 8}
                y={highlightBox.top - 8}
                width={highlightBox.width + 16}
                height={highlightBox.height + 16}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight)"
          onClick={onComplete}
        />
      </svg>

      {/* 타겟 테두리 */}
      {isPositioned && (
        <div
          className="fixed border-4 border-[#fab803] rounded-xl pointer-events-none"
          style={{
            top: highlightBox.top - 8,
            left: highlightBox.left - 8,
            width: highlightBox.width + 16,
            height: highlightBox.height + 16,
            boxShadow: '0 0 0 4px rgba(250, 184, 3, 0.3), 0 0 40px rgba(250, 184, 3, 0.4)',
          }}
        />
      )}

      {/* 툴팁 */}
      {isPositioned && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            width: 420,
            pointerEvents: 'auto',
            zIndex: 10000
          }}
        >
        {/* 헤더 */}
        <div className="bg-[#1a2867] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium">Step {currentStep + 1} / {TOUR_STEPS.length}</p>
                <h3 className="text-white font-bold text-lg">{step.title}</h3>
              </div>
            </div>
            <button
              onClick={onComplete}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              건너뛰기
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed mb-6">{step.description}</p>

          {/* 진행 바 */}
          <div className="flex gap-1.5 mb-6">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-all duration-300',
                  idx <= currentStep ? 'bg-[#1a2867]' : 'bg-gray-200'
                )}
              />
            ))}
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                이전
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1a2867] text-white rounded-xl font-semibold hover:bg-[#1a2867]/90 transition-colors shadow-lg"
            >
              {isLast ? '시작하기' : '다음'}
              {!isLast && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.div>
      )}
    </div>
  );
}

const mockMainOrderItems: QuoteItem[] = [
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
  }
];

const mockSampleItems: QuoteItem[] = [
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

export default function Quote({ onNavigate }: QuoteProps = {}) {
  const navigate = useNavigate();
  const [items, setItems] = useState<QuoteItem[]>([...mockMainOrderItems, ...mockSampleItems]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(items.map(item => item.id)));
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'manager',
      message: '안녕하세요! 견적서를 확인해주셔서 감사합니다. 추가 문의사항이 있으시면 언제든지 말씀해주세요.',
      timestamp: new Date(Date.now() - 432000000) // 5일 전
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const messageFileInputRef = useRef<HTMLInputElement>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const accountInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 고객 서류 업로드 관련 state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // 이미지 프리뷰 관련 상태
  const [previewImage, setPreviewImage] = useState<{ urls: string[]; name: string; currentIndex: number } | null>(null);

  // 공공 기관 서류 다운로드 관련 상태
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [otherQuoteQuantity, setOtherQuoteQuantity] = useState(1);
  const [isPublicDocsExpanded, setIsPublicDocsExpanded] = useState(false);
  const [isCustomerUploadExpanded, setIsCustomerUploadExpanded] = useState(false);
  
  // 일반 서류 다운로드 관련 상태
  const [selectedBasicDocs, setSelectedBasicDocs] = useState<Set<string>>(new Set());
  
  // 공공 기관 인증 관련 상태
  const [isPublicAuthVerified, setIsPublicAuthVerified] = useState(false);
  const [showPublicAuthForm, setShowPublicAuthForm] = useState(false);
  const [publicAuthEmail, setPublicAuthEmail] = useState('');
  const [publicAuthFile, setPublicAuthFile] = useState<File | null>(null);
  const [isPublicAuthLoading, setIsPublicAuthLoading] = useState(false);
  const publicAuthFileInputRef = useRef<HTMLInputElement>(null);

  // 배송 시나리오 관련 상태 (Delivery Scenario States)
  const [targetDeliveryDate, setTargetDeliveryDate] = useState(''); // 주문 예상 시점 (Expected order date)
  const [actualDeliveryDate, setActualDeliveryDate] = useState(''); // 납기 일자 (Actual delivery date)
  const [initialSampleDeliveryMethod, setInitialSampleDeliveryMethod] = useState<'photo' | 'physical'>('photo'); // 초기 샘플 전달 방식 (Initial sample delivery method)
  const [mainProductionType, setMainProductionType] = useState<'standard' | 'express'>('standard'); // 본 제작 방식 (Main production type)
  const [isDeliveryScenarioExpanded, setIsDeliveryScenarioExpanded] = useState(false); // 배송 시나리오 펼침 상태 (Delivery scenario expand state)

  // 가이드 투어 관련 상태
  const [showTour, setShowTour] = useState(false);

  const publicDocuments = [
    { id: 'other-quote', name: '타견적서', hasQuantity: true },
    { id: 'sme-cert', name: '중소기업확인서', hasQuantity: false },
    { id: 'startup-cert', name: '창업기업확인서', hasQuantity: false },
    { id: 'local-tax-cert', name: '지방세완납증명서', hasQuantity: false },
    { id: 'national-tax-cert', name: '국세완납증명서', hasQuantity: false },
    { id: 'insurance-cert', name: '4대보험완납증명서', hasQuantity: false },
    { id: 'corporate-reg', name: '법인등기부등본', hasQuantity: false },
    { id: 'seal-cert', name: '인감증명서', hasQuantity: false }
  ];

  const mainOrderItems = items.filter(item => item.type === 'main');
  const sampleItems = items.filter(item => item.type === 'sample');

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => {
      if (item.id === id) {
        const salePrice = item.unitPrice * newQuantity;
        const vat = Math.round(salePrice * 0.1);
        return { ...item, quantity: newQuantity, salePrice, vat };
      }
      return item;
    }));
  };

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleAllMain = () => {
    const mainIds = mainOrderItems.map(item => item.id);
    const allMainSelected = mainIds.every(id => selectedItems.has(id));
    
    const newSelected = new Set(selectedItems);
    if (allMainSelected) {
      mainIds.forEach(id => newSelected.delete(id));
    } else {
      mainIds.forEach(id => newSelected.add(id));
    }
    setSelectedItems(newSelected);
  };

  const toggleAllSample = () => {
    const sampleIds = sampleItems.map(item => item.id);
    const allSampleSelected = sampleIds.every(id => selectedItems.has(id));
    
    const newSelected = new Set(selectedItems);
    if (allSampleSelected) {
      sampleIds.forEach(id => newSelected.delete(id));
    } else {
      sampleIds.forEach(id => newSelected.add(id));
    }
    setSelectedItems(newSelected);
  };

  const calculateTotal = (items: QuoteItem[], selectedItems: Set<string>) => {
    return items
      .filter(item => selectedItems.has(item.id))
      .reduce((acc, item) => ({
        salePrice: acc.salePrice + item.salePrice,
        vat: acc.vat + item.vat,
        total: acc.total + item.salePrice + item.vat
      }), { salePrice: 0, vat: 0, total: 0 });
  };

  const mainTotal = calculateTotal(mainOrderItems, selectedItems);
  const sampleTotal = calculateTotal(sampleItems, selectedItems);
  const grandTotal = {
    salePrice: mainTotal.salePrice + sampleTotal.salePrice,
    vat: mainTotal.vat + sampleTotal.vat,
    total: mainTotal.total + sampleTotal.total
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApprove = () => {
    setShowSignupModal(true);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (rejectReason.trim()) {
      alert(`견적서가 거절되었습니다. 사유: ${rejectReason}`);
      setShowRejectModal(false);
    } else {
      alert('거절 사유를 입력해주세요.');
    }
  };

  // 가이드 투어 초기화
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('quotePageTourCompleted');
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  const handleCompleteTour = () => {
    setShowTour(false);
    localStorage.setItem('quotePageTourCompleted', 'true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestartTour = () => {
    setShowTour(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() || attachedFiles.length > 0) {
      const fileData = attachedFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'customer',
        message: newMessage,
        timestamp: new Date(),
        files: fileData.length > 0 ? fileData : undefined
      };
      setMessages([...messages, message]);
      setNewMessage('');
      setAttachedFiles([]);
    }
  };

  const handleMessageFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      note: ''
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
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

  const passwordStrength = getPasswordStrength(signupPassword);
  const strengthColors = ['bg-gray-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-500'];
  const strengthLabels = ['', '매우 약함', '약함', '보통', '강함', '매우 강함'];

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // 연락처 유효성 검사
  const isValidPhone = (phone: string) => /^[0-9]{10,11}$/.test(phone.replace(/-/g, ''));

  const handleUpdateFileNote = (fileId: string, note: string) => {
    setUploadedFiles(uploadedFiles.map(f => 
      f.id === fileId ? { ...f, note } : f
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'customer',
        message: `파일을 첨부했습니다.`,
        timestamp: new Date(),
        files: Array.from(files).map(f => ({ name: f.name, url: '#' }))
      };
      setMessages([...messages, message]);
    }
  };

  const handleCopyAccount = () => {
    const accountNumber = '270-188626-04-011';
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(accountNumber)
        .then(() => {
          alert('계좌번호가 복사되었습니다.');
        })
        .catch(() => {
          // Fallback to input selection method
          copyViaInput(accountNumber);
        });
    } else {
      // Fallback for browsers that don't support clipboard API
      copyViaInput(accountNumber);
    }
  };

  const copyViaInput = (text: string) => {
    if (accountInputRef.current) {
      accountInputRef.current.value = text;
      accountInputRef.current.select();
      accountInputRef.current.setSelectionRange(0, 99999); // For mobile devices
      
      try {
        document.execCommand('copy');
        alert('계좌번호가 복사되었습니다.');
      } catch (err) {
        alert('복사에 실패했습니다. 수동으로 복사해주세요: ' + text);
      }
    }
  };

  // 공공 기관 서류 선택 처리
  const toggleDocument = (docId: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
  };

  // 전체 선택/해제
  const toggleAllDocuments = () => {
    if (selectedDocs.size === publicDocuments.length) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(publicDocuments.map(doc => doc.id)));
    }
  };

  // 선택한 서류 다운로드
  const handleDownloadSelectedDocs = () => {
    if (selectedDocs.size === 0) {
      alert('다운로드할 서류를 선택해주세요.');
      return;
    }

    const selectedDocNames = publicDocuments
      .filter(doc => selectedDocs.has(doc.id))
      .map(doc => {
        if (doc.id === 'other-quote' && otherQuoteQuantity > 1) {
          return `${doc.name} (${otherQuoteQuantity}부)`;
        }
        return doc.name;
      })
      .join(', ');

    alert(`다음 서류를 다운로드합니다:\n${selectedDocNames}`);
  };

  // 일반 서류 선택 처리
  const basicDocuments = [
    { id: 'bank-copy', name: '통장 사본' },
    { id: 'business-license', name: '사업자 등록증' },
    { id: 'transaction-statement', name: '거래 명세서' }
  ];

  const toggleBasicDocument = (docId: string) => {
    const newSelected = new Set(selectedBasicDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedBasicDocs(newSelected);
  };

  const toggleAllBasicDocuments = () => {
    if (selectedBasicDocs.size === basicDocuments.length) {
      setSelectedBasicDocs(new Set());
    } else {
      setSelectedBasicDocs(new Set(basicDocuments.map(doc => doc.id)));
    }
  };

  const handleDownloadSelectedBasicDocs = () => {
    if (selectedBasicDocs.size === 0) {
      alert('다운로드할 서류를 선택해주세요.');
      return;
    }

    const selectedDocNames = basicDocuments
      .filter(doc => selectedBasicDocs.has(doc.id))
      .map(doc => doc.name)
      .join(', ');

    alert(`다음 서류를 다운로드합니다:\\n${selectedDocNames}`);
  };

  // 공공 기관 인증 요청
  const handlePublicAuthRequest = () => {
    setShowPublicAuthForm(true);
  };

  // 공공 기관 인증 제출
  const handlePublicAuthSubmit = () => {
    if (!publicAuthEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!publicAuthFile) {
      alert('사업자 등록증을 첨부해주세요.');
      return;
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(publicAuthEmail)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    // 로딩 시작
    setIsPublicAuthLoading(true);

    // 5초 후 인증 완료
    setTimeout(() => {
      alert(`인증 요청이 제출되었습니다.\n이메일: ${publicAuthEmail}\n첨부파일: ${publicAuthFile.name}\n\n관리자 검토 후 승인 시 서류를 다운로드하실 수 있습니다.`);
      setIsPublicAuthVerified(true);
      setShowPublicAuthForm(false);
      setIsPublicAuthLoading(false);
    }, 5000);
  };

  // 공공 기관 인증 파일 선택
  const handlePublicAuthFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
      }
      setPublicAuthFile(file);
    }
  };

  // 공공 기관 인증 파일 제거
  const handlePublicAuthFileRemove = () => {
    setPublicAuthFile(null);
    if (publicAuthFileInputRef.current) {
      publicAuthFileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 md:py-12 relative">
      {/* 가이드 투어 */}
      {showTour && <QuoteTour onComplete={handleCompleteTour} />}

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        {/* 인쇄용 스타일 */}
        <style>{`
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            .no-print { display: none !important; }
            .print-container { box-shadow: none !important; }
          }
        `}</style>

        {/* 프로그레스바 */}
        <div className="no-print mb-6 md:mb-8">
          <OrderProgressBar currentStep={1} />
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-border print-container overflow-hidden">
          {/* 헤더 */}
          <div className="border-b border-border p-4 sm:p-6 md:p-10 bg-muted/20">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-8">
              {/* 좌측: 견적 정보 */}
              <div className="flex-1 space-y-3 md:space-y-4 lg:order-1 order-2">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h1 className="text-foreground flex items-center gap-2 md:gap-4 text-[24px] md:text-[32px] font-bold">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-[#fab803]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 md:w-6 md:h-6 text-[#fab803]" />
                    </div>
                    견적서
                  </h1>
                  <button
                    onClick={handleRestartTour}
                    className="no-print flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-[#1a2867] hover:bg-[#fab803]/10 rounded-lg md:rounded-xl transition-all border border-border/50 hover:border-[#fab803]/30"
                  >
                    <HelpCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">가이드 보기</span>
                  </button>
                </div>
                
                {/* 기본 정보 카드 */}
                <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-border">
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground text-xs md:text-sm whitespace-nowrap">견적 번호</span>
                      <span className="text-foreground text-xs md:text-sm text-right">Q-2024-12-001</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground text-xs md:text-sm whitespace-nowrap">수신자</span>
                      <span className="text-foreground text-xs md:text-sm text-right">CUST-2024-123</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground text-xs md:text-sm whitespace-nowrap">회사명</span>
                      <span className="text-foreground text-xs md:text-sm text-right">주식회사 샘플</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground text-xs md:text-sm whitespace-nowrap">이름</span>
                      <span className="text-foreground text-xs md:text-sm text-right">홍길동</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground text-xs md:text-sm whitespace-nowrap">결제 조건</span>
                      <span className="text-foreground text-xs md:text-sm text-right">선입금 50%, 잔금 50%</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground text-xs md:text-sm whitespace-nowrap">발행 날짜</span>
                      <span className="text-foreground text-xs md:text-sm text-right">2024.12.15</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground text-xs md:text-sm whitespace-nowrap">유효 기간</span>
                      <span className="text-foreground text-xs md:text-sm text-right">2024.12.31</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 우측: 회사 정보 및 인감 */}
              <div className="text-left lg:text-right relative lg:order-2 order-1">
                {/* 법인 인감 도장 */}


                <img 
                  src="https://cdn.imweb.me/thumbnail/20251207/2384d8bd634b5.png" 
                  alt="쿠디솜 로고" 
                  className="h-7 md:h-10 lg:ml-auto mb-2 md:mb-4"
                />
                <div className="space-y-0.5 text-xs md:text-sm">
                  <p className="text-[rgb(0,0,0)] font-bold">브랜드 : 쿠디솜</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-1.5 md:mt-3">상호명 : 주식회사 인프라이즈</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">사업자 등록 번호 : 150-81-03714</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">업태 : 도매 및 소매업</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">종목 : 판촉물, 기념품 외</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2">인천광역시 남동구 서창남로 45, 3층</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">TEL : 1666-0211</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Email : support@qudisom.com</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">FAX : 032-726-9175</p>
                  <p className="flex items-center lg:justify-end gap-1 text-[10px] md:text-xs mt-1 md:mt-2 text-[#1a2867]">
                    <User className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span>담당자 : 이상민 매니저</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 견적 내용 */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* 통합 테이블 */}
            <div className="mb-6 md:mb-8">
              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-xs md:text-sm min-w-[900px]">
                  <thead className="bg-muted/50 border-b-2 border-border">
                    <tr>
                      <th className="py-3 md:py-4 px-2 md:px-3 text-center border-r border-border no-print text-foreground">선택</th>
                      <th className="py-3 md:py-4 px-2 md:px-3 text-center border-r border-border text-foreground">
                        <div>상품 종류</div>
                        <div>품명</div>
                      </th>
                      <th className="py-3 md:py-4 px-2 md:px-3 text-center border-r border-border text-foreground">이미지</th>
                      <th className="py-3 md:py-4 px-2 md:px-3 text-center border-r border-border text-foreground">옵션</th>
                      <th className="py-3 md:py-4 px-2 md:px-3 text-center border-r border-border text-foreground">수량</th>
                      <th className="py-3 md:py-4 px-2 md:px-3 text-center border-r border-border text-foreground">단가</th>
                      <th className="py-3 md:py-4 px-2 md:px-3 text-center border-r border-border text-foreground">할인</th>
                      <th className="py-3 md:py-4 px-2 md:px-3 text-center border-r border-border text-foreground">판매가</th>
                      <th className="py-3 md:py-4 px-2 md:px-3 text-center border-r border-border text-foreground">부가세</th>
                      <th className="py-3 md:py-4 px-2 md:px-3 text-center text-foreground">제작기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 본주문 섹션 */}
                    <tr className="bg-[#1a2867]/5">
                      <td colSpan={10} className="py-2.5 md:py-3 px-3 md:px-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#1a2867]" />
                          <span className="text-[rgb(0,0,0)] text-xs md:text-sm font-bold">본주문 제품 (Main Order)</span>
                          <button
                            onClick={toggleAllMain}
                            className="ml-auto text-[10px] md:text-xs text-[rgb(77,77,77)] hover:underline no-print"
                          >
                            {mainOrderItems.every(item => selectedItems.has(item.id)) ? '전체 해제' : '전체 선택'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {mainOrderItems.map((item, index) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td id={index === 0 ? 'tour-checkbox' : undefined} className="py-2.5 md:py-3 px-2 md:px-3 text-center no-print">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="w-3.5 h-3.5 md:w-4 md:h-4 accent-[#fab803] cursor-pointer"
                          />
                        </td>
                        <td className="py-2.5 md:py-3 px-2 md:px-3">
                          <div className="text-foreground text-xs text-center">{item.productCode}</div>
                          <div className="text-foreground mt-1 text-left">{item.productName}</div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div 
                            className="relative w-12 h-12 mx-auto cursor-pointer group"
                            onClick={() => setPreviewImage({ urls: item.imageUrls, name: item.productName, currentIndex: 0 })}
                          >
                            {item.imageUrls.map((url, imgIndex) => (
                              <img 
                                key={imgIndex}
                                src={url} 
                                alt={`${item.productName} ${imgIndex + 1}`}
                                className="absolute w-12 h-12 object-cover rounded border-2 border-white shadow-sm group-hover:opacity-80 transition-opacity"
                                style={{
                                  top: `${imgIndex * 2}px`,
                                  left: `${imgIndex * 2}px`,
                                  zIndex: item.imageUrls.length - imgIndex
                                }}
                              />
                            ))}
                            {item.imageUrls.length > 1 && (
                              <div className="absolute -bottom-1 -right-1 bg-[rgb(255,217,61)] text-[rgb(0,0,0)] text-[10px] rounded-full w-5 h-5 flex items-center justify-center z-50 shadow-sm">
                                {item.imageUrls.length}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-xs text-muted-foreground">
                          <div className="border border-border rounded">
                            {item.options.material && (
                              <div className="grid grid-cols-2 border-b border-border last:border-b-0">
                                <div className="px-2 py-1 border-r border-border bg-muted/30">재질</div>
                                <div className="px-2 py-1">{item.options.material}</div>
                              </div>
                            )}
                            {item.options.size && (
                              <div className="grid grid-cols-2 border-b border-border last:border-b-0">
                                <div className="px-2 py-1 border-r border-border bg-muted/30">사이즈</div>
                                <div className="px-2 py-1">{item.options.size}</div>
                              </div>
                            )}
                            {item.options.color && (
                              <div className="grid grid-cols-2 border-b border-border last:border-b-0">
                                <div className="px-2 py-1 border-r border-border bg-muted/30">색상</div>
                                <div className="px-2 py-1">{item.options.color}</div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td id={index === 0 ? 'tour-quantity' : undefined} className="py-3 px-3 text-center">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </td>
                        <td className="py-3 px-3 text-right">₩{item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">₩{item.discount.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">₩{item.salePrice.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">₩{item.vat.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center text-xs">{item.productionDays}</td>
                      </tr>
                    ))}
                    {/* 본주문 소계 */}
                    {selectedItems.size > 0 && mainOrderItems.some(item => selectedItems.has(item.id)) && (
                      <tr className="bg-[#1a2867]/10">
                        <td colSpan={7} className="py-2.5 md:py-3 px-3 md:px-4 text-right text-foreground text-xs md:text-sm font-bold">본주문 소계</td>
                        <td className="py-2.5 md:py-3 px-2 md:px-3 text-right text-foreground text-xs md:text-sm font-bold">₩{mainTotal.salePrice.toLocaleString()}</td>
                        <td className="py-2.5 md:py-3 px-2 md:px-3 text-right text-foreground text-xs md:text-sm font-bold">₩{mainTotal.vat.toLocaleString()}</td>
                        <td className="py-2.5 md:py-3 px-2 md:px-3 text-right text-foreground text-xs md:text-sm font-bold">₩{mainTotal.total.toLocaleString()}</td>
                      </tr>
                    )}

                    {/* 샘플 섹션 */}
                    <tr className="bg-[#fab803]/5">
                      <td colSpan={10} className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-[#fab803]" />
                          <span className="text-[rgb(0,0,0)] font-bold">샘플 제품 (Sample Order)</span>
                          <button
                            onClick={toggleAllSample}
                            className="ml-auto text-xs text-[rgb(99,99,99)] hover:underline no-print"
                          >
                            {sampleItems.every(item => selectedItems.has(item.id)) ? '전체 해제' : '전체 선택'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {sampleItems.map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3 text-center no-print">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => toggleItem(item.id)}
                            className="w-4 h-4 accent-[#fab803] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-foreground text-xs text-center">{item.productCode}</div>
                          <div className="text-foreground mt-1 text-left">{item.productName}</div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div 
                            className="relative w-12 h-12 mx-auto cursor-pointer group"
                            onClick={() => setPreviewImage({ urls: item.imageUrls, name: item.productName, currentIndex: 0 })}
                          >
                            {item.imageUrls.map((url, index) => (
                              <img 
                                key={index}
                                src={url} 
                                alt={`${item.productName} ${index + 1}`}
                                className="absolute w-12 h-12 object-cover rounded border-2 border-white shadow-sm group-hover:opacity-80 transition-opacity"
                                style={{
                                  top: `${index * 2}px`,
                                  left: `${index * 2}px`,
                                  zIndex: item.imageUrls.length - index
                                }}
                              />
                            ))}
                            {item.imageUrls.length > 1 && (
                              <div className="absolute -bottom-1 -right-1 bg-[rgb(255,217,61)] text-[rgb(0,0,0)] text-[10px] rounded-full w-5 h-5 flex items-center justify-center z-50 shadow-sm font-[Metamorphous]">
                                {item.imageUrls.length}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-xs text-muted-foreground">
                          <div className="border border-border rounded">
                            {item.options.material && (
                              <div className="grid grid-cols-2 border-b border-border last:border-b-0">
                                <div className="px-2 py-1 border-r border-border bg-muted/30">재질</div>
                                <div className="px-2 py-1">{item.options.material}</div>
                              </div>
                            )}
                            {item.options.size && (
                              <div className="grid grid-cols-2 border-b border-border last:border-b-0">
                                <div className="px-2 py-1 border-r border-border bg-muted/30">사이즈</div>
                                <div className="px-2 py-1">{item.options.size}</div>
                              </div>
                            )}
                            {item.options.color && (
                              <div className="grid grid-cols-2 border-b border-border last:border-b-0">
                                <div className="px-2 py-1 border-r border-border bg-muted/30">색상</div>
                                <div className="px-2 py-1">{item.options.color}</div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </td>
                        <td className="py-3 px-3 text-right">₩{item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">₩{item.discount.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">₩{item.salePrice.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right">₩{item.vat.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center text-xs">{item.productionDays}</td>
                      </tr>
                    ))}
                    {/* 샘플 소계 */}
                    {selectedItems.size > 0 && sampleItems.some(item => selectedItems.has(item.id)) && (
                      <tr className="bg-[#fab803]/10">
                        <td colSpan={7} className="py-2.5 md:py-3 px-3 md:px-4 text-right text-foreground text-xs md:text-sm font-bold">샘플 소계</td>
                        <td className="py-2.5 md:py-3 px-2 md:px-3 text-right text-foreground text-xs md:text-sm font-bold">₩{sampleTotal.salePrice.toLocaleString()}</td>
                        <td className="py-2.5 md:py-3 px-2 md:px-3 text-right text-foreground text-xs md:text-sm font-bold">₩{sampleTotal.vat.toLocaleString()}</td>
                        <td className="py-2.5 md:py-3 px-2 md:px-3 text-right text-foreground text-xs md:text-sm font-bold">₩{sampleTotal.total.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 총 합계 */}
            {selectedItems.size > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-white border border-border rounded-xl p-4 md:p-5 text-center">
                  <span className="block text-xs md:text-sm text-muted-foreground mb-1.5 md:mb-2">전체 소계 (Total Subtotal)</span>
                  <span className="block text-lg md:text-xl text-foreground">₩{grandTotal.salePrice.toLocaleString()}</span>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 md:p-5 text-center">
                  <span className="block text-xs md:text-sm text-muted-foreground mb-1.5 md:mb-2">전체 부가세 (Total VAT)</span>
                  <span className="block text-lg md:text-xl text-foreground">₩{grandTotal.vat.toLocaleString()}</span>
                </div>
                <div className="bg-[#1a2867] rounded-xl p-4 md:p-5 text-center">
                  <span className="block text-xs md:text-sm text-white/80 mb-1.5 md:mb-2">최종 총 합계 (Grand Total)</span>
                  <span className="block text-lg md:text-xl text-white">₩{grandTotal.total.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* 안내 사항 */}
            <div id="tour-pdf-cutline" className="bg-muted/30 rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-border">
              <h3 className="text-foreground mb-3 md:mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-[#fab803]" />
                안내 사항
              </h3>
              <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-muted-foreground">
                <li>• 위 견적서는 {new Date().toLocaleDateString('ko-KR')} 기준으로 작성되었습니다.</li>
                <li>• 제작 기간은 입금 확인 후 시작되며, 주말 및 공휴일은 제외됩니다.</li>
                <li>• 샘플 제작 후 본 주문 진행 시, 샘플 비용은 본 주문 금액에서 차감됩니다.</li>
                <li>• 디자인 시안은 최대 3회까지 무료 수정 가능합니다.</li>
                <li>• 결제는 계좌이체 또는 카드결제가 가능하며, 세금계산서 발행이 가능합니다.</li>
                <li>• 제품의 색상은 모니터 환경에 따라 실제와 다소 차이가 있을 수 있습니다.</li>
                <li>• 본 견적서는 발행일로부터 15일간 유효하며, 기간 경과 시 재견적이 필요할 수 있습니다.</li>
              </ul>
              <div className="mt-4 md:mt-5 pt-4 md:pt-5 border-t border-border/50">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Printer className="w-3.5 h-3.5 text-[#fab803]" />
                  <span className="text-[rgb(0,0,0)] font-bold">PDF 인쇄 시 안내 사항까지만 인쇄되며, 하단의 서류 업로드 및 메모 섹션은 인쇄되지 않습니다.</span>
                </p>
              </div>
            </div>

            {/* 배송 시나리오 섹션 (Delivery Scenario Section) */}
            <DeliveryScenarioSection
              targetDeliveryDate={targetDeliveryDate}
              actualDeliveryDate={actualDeliveryDate}
              initialSampleDeliveryMethod={initialSampleDeliveryMethod}
              mainProductionType={mainProductionType}
              onTargetDateChange={setTargetDeliveryDate}
              onActualDateChange={setActualDeliveryDate}
              onInitialMethodChange={setInitialSampleDeliveryMethod}
              onMainTypeChange={setMainProductionType}
            />



            {/* 입금 계좌 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 mt-8 md:mt-12">
              {/* 좌측: 입금 계좌 */}
              <div className="bg-[#1a2867]/5 border border-[#1a2867]/20 rounded-xl p-4 md:p-6">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Building2 className="w-4 h-4 md:w-5 md:h-5 text-[#1a2867]" />
                  <h3 className="text-foreground text-sm md:text-base">입금 계좌</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-xl p-3 md:p-4 border border-border">
                  <div className="flex-1">
                    <p className="text-xs md:text-sm text-muted-foreground mb-1">기업은행</p>
                    <p className="text-base md:text-lg text-foreground">270-188626-04-011</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">예금주: 주식회사 인프라이즈</p>
                  </div>
                  <button
                    onClick={handleCopyAccount}
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-lg transition-colors text-xs md:text-sm whitespace-nowrap"
                  >
                    복사
                  </button>
                  <input
                    type="text"
                    ref={accountInputRef}
                    className="hidden"
                  />
                </div>
              </div>

              {/* 중앙: 서류 다운로드 */}
              <div id="tour-basic-docs" className="bg-[#fab803]/5 border border-[#fab803]/20 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 md:w-5 md:h-5 text-[#fab803]" />
                    <h3 className="text-foreground text-sm md:text-base">서류 다운로드</h3>
                  </div>
                  <button
                    onClick={toggleAllBasicDocuments}
                    className="text-xs md:text-sm text-[rgb(130,130,130)] hover:underline transition-colors whitespace-nowrap"
                  >
                    {selectedBasicDocs.size === basicDocuments.length ? '전체 해제' : '전체 선택'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 mb-4">
                  {basicDocuments.map((doc, index) => {
                    const descriptions = [
                      '기업은행 계좌 확인용',
                      '주식회사 인프라이즈',
                      '거래 내역 확인용'
                    ];
                    const isSelected = selectedBasicDocs.has(doc.id);
                    return (
                      <button
                        key={doc.id}
                        onClick={() => toggleBasicDocument(doc.id)}
                        className={`flex flex-col items-start rounded-xl p-3 md:p-4 border transition-all ${
                          isSelected
                            ? 'bg-[#fab803]/10 border-[#fab803] shadow-sm'
                            : 'bg-white border-border hover:border-[#fab803]/50 hover:bg-[#fab803]/5'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <FileText className="w-4 h-4 md:w-5 md:h-5 text-[#fab803]" />
                          {isSelected && (
                            <Check className="w-4 h-4 md:w-5 md:h-5 text-[#fab803]" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className={`text-xs md:text-sm mb-1 ${isSelected ? 'text-foreground font-medium' : 'text-foreground'}`}>
                            {doc.name}
                          </p>
                          <p className="text-[10px] md:text-xs text-muted-foreground">{descriptions[index]}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 선택 항목 다운로드 버튼 */}
                {selectedBasicDocs.size > 0 && (
                  <div className="flex items-center justify-between pt-3 border-t border-[#fab803]/20">
                    <div className="text-xs md:text-sm">
                      <span className="text-muted-foreground">선택한 서류: </span>
                      <span className="text-[rgb(0,0,0)]">{selectedBasicDocs.size}개</span>
                    </div>
                    <button
                      onClick={handleDownloadSelectedBasicDocs}
                      disabled={selectedBasicDocs.size === 0}
                      className="flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-1.5 md:py-2 bg-[#fab803] hover:bg-[#fab803]/90 text-[rgb(0,0,0)] rounded-lg transition-colors text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      선택 항목 다운로드
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 고객 서류 업로드 */}
            <div id="tour-customer-upload" className="bg-muted/20 border border-border rounded-xl overflow-hidden mb-6 md:mb-8">
              {/* 헤더 - 클릭하여 접기/펼치기 */}
              <button
                onClick={() => setIsCustomerUploadExpanded(!isCustomerUploadExpanded)}
                className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-muted/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#1a2867]/10 rounded-xl flex items-center justify-center">
                    <Upload className="w-4 h-4 md:w-5 md:h-5 text-[#1a2867]" />
                  </div>
                  <h3 className="text-[rgb(0,0,0)] font-bold text-sm md:text-[18px] font-normal">고객 서류 제출</h3>
                  <span className="text-xs md:text-sm text-muted-foreground">({uploadedFiles.length}개)</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="hidden sm:inline text-xs md:text-sm text-muted-foreground">
                    {isCustomerUploadExpanded ? '접기' : '펼치기'}
                  </span>
                  <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-[#1a2867] transition-transform duration-300 ${isCustomerUploadExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* 펼쳐진 내용 */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isCustomerUploadExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-border">
                  <div className="pt-3 md:pt-4 mb-3 md:mb-4">
                    <p className="text-xs md:text-sm text-muted-foreground mb-2">
                      계약서, 인감증명서 등 필요한 서류를 업로드해주세요.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                      <AlertCircle className="w-3 h-3" />
                      <span>파일당 최대 10MB, 지원 형식: PDF, JPG, PNG, DOCX</span>
                    </div>
                  </div>

                  {/* 파일 업로드 영역 */}
                  {uploadedFiles.length === 0 ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => uploadInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 md:p-8 mb-4 md:mb-6 cursor-pointer transition-all ${
                        isDragging 
                          ? 'border-[#1a2867] bg-[#1a2867]/5' 
                          : 'border-border hover:border-[#1a2867]/50 bg-white'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2 md:gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1a2867]/10 rounded-full flex items-center justify-center">
                          <Upload className="w-5 h-5 md:w-6 md:h-6 text-[#1a2867]" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs md:text-sm text-foreground mb-0.5 md:mb-1">
                            파일을 드래그하거나 클릭하여 업로드
                          </p>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            또는 여기를 클릭하여 파일 선택
                          </p>
                        </div>
                      </div>
                      <input
                        ref={uploadInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.docx"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <input
                      ref={uploadInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.docx"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                  )}

                  {/* 업로드된 파일 목록 */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="bg-white border border-border rounded-xl p-3 md:p-4 hover:border-[#1a2867]/30 transition-colors"
                        >
                          <div className="flex items-start gap-2 md:gap-3">
                            {/* 파일 아이콘 */}
                            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-[#1a2867]/10 rounded-lg flex items-center justify-center">
                              <File className="w-4 h-4 md:w-5 md:h-5 text-[#1a2867]" />
                            </div>

                            {/* 파일 정보 */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1.5 md:mb-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs md:text-sm text-foreground truncate">
                                    {file.name}
                                  </p>
                                  <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground mt-0.5">
                                    <span>{formatFileSize(file.size)}</span>
                                    <span>•</span>
                                    <span className="hidden sm:inline">{file.uploadedAt.toLocaleString('ko-KR')}</span>
                                    <span className="sm:hidden">{file.uploadedAt.toLocaleDateString('ko-KR')}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteFile(file.id)}
                                  className="flex-shrink-0 ml-1.5 md:ml-2 p-1 md:p-1.5 hover:bg-destructive/10 rounded-lg transition-colors group"
                                  title="파일 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground group-hover:text-destructive" />
                                </button>
                              </div>

                              {/* 작성 방법 / 메모 입력 */}
                              <textarea
                                value={file.note}
                                onChange={(e) => handleUpdateFileNote(file.id, e.target.value)}
                                placeholder="작성 방법이나 특이사항을 입력하세요..."
                                className="w-full bg-muted/10 border border-border rounded-lg px-2.5 md:px-3 py-1.5 md:py-2 text-xs md:text-sm resize-none focus:outline-none focus:border-[#1a2867] focus:ring-2 focus:ring-[#1a2867]/20 placeholder:text-muted-foreground"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 파일 추가 버튼 (파일이 있을 때만 표시) */}
                  {uploadedFiles.length > 0 && (
                    <div className="flex justify-center mb-4 md:mb-6">
                      <button
                        onClick={() => uploadInputRef.current?.click()}
                        className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 border border-border hover:border-[#1a2867] hover:bg-[#1a2867]/5 rounded-lg transition-all text-xs md:text-sm text-muted-foreground hover:text-[#1a2867]"
                      >
                        <Upload className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        파일 추가
                      </button>
                    </div>
                  )}

                  {/* 전체 제출 버튼 */}
                  {uploadedFiles.length > 0 && (
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => {
                          alert(`총 ${uploadedFiles.length}개의 파일이 제출되었습니다.`);
                        }}
                        className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-lg transition-colors text-xs md:text-sm shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        서류 제출하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 공공 기관 전용 서류 다운로드 */}
            <div id="tour-public-docs" className="bg-muted/20 border border-border rounded-xl overflow-hidden mb-6 md:mb-8">
              {/* 헤더 - 클릭하여 접기/펼치기 */}
              <button
                onClick={() => setIsPublicDocsExpanded(!isPublicDocsExpanded)}
                className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-muted/30 transition-all duration-300"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Emblem_of_the_Government_of_the_Republic_of_Korea.svg/1200px-Emblem_of_the_Government_of_the_Republic_of_Korea.svg.png"
                    alt="대한민국 정부 엠블럼"
                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                  />
                  <h3 className="text-foreground font-bold text-sm md:text-base">공공 기관 전용 서류 다운로드</h3>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <span className="hidden sm:inline text-xs md:text-sm text-muted-foreground">
                    {isPublicDocsExpanded ? '접기' : '펼치기'}
                  </span>
                  <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-[#1a2867] transition-transform duration-300 ${isPublicDocsExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* 펼쳐진 내용 */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isPublicDocsExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {!isPublicAuthVerified && !showPublicAuthForm ? (
                  // 미인증 상태 - 서류 목록 보여주기 (다운로드 불가)
                  <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-border">
                    {/* 안내 메시지 */}
                    <div className="bg-[#1a2867]/10 border border-[#1a2867]/20 rounded-xl p-4 mb-4 mt-3 md:mt-4">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-[#1a2867] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs md:text-sm text-[#1a2867] mb-1">
                            <span className="font-medium">인증 후 다운로드 가능</span>
                          </p>
                          <p className="text-xs text-[#1a2867]/70">
                            공공 기관 전용 서류를 다운로드하시려면 이메일과 사업자 등록증을 통한 인증이 필요합니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 서류 목록 (비활성화 상태) */}
                    <div className="mb-4">
                      <p className="text-xs md:text-sm text-muted-foreground mb-3">다운로드 가능한 서류 목록</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-4">
                        {publicDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="bg-white rounded-xl p-3 md:p-4 border border-border opacity-60"
                          >
                            <div className="flex items-start gap-2 md:gap-3">
                              <input
                                type="checkbox"
                                disabled
                                className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 accent-[#1a2867] cursor-not-allowed"
                              />
                              <div className="flex-1">
                                <label className="text-xs md:text-sm block text-foreground cursor-not-allowed">
                                  {doc.name}
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 인증 요청 버튼 */}
                    <div className="flex justify-center">
                      <button
                        onClick={handlePublicAuthRequest}
                        className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-lg transition-colors text-sm md:text-base shadow-sm"
                      >
                        <Lock className="w-4 h-4 md:w-5 md:h-5" />
                        인증 요청하기
                      </button>
                    </div>
                  </div>
                ) : showPublicAuthForm ? (
                  // 인증 폼
                  <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-border">
                    <div className="bg-white rounded-xl p-5 md:p-6 border border-border">
                      <h4 className="text-foreground mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#1a2867]" />
                        공공 기관 인증
                      </h4>
                      
                      {/* 이메일 입력 */}
                      <div className="mb-4">
                        <label className="block text-xs md:text-sm text-foreground mb-2">
                          이메일 주소 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="email"
                            value={publicAuthEmail}
                            onChange={(e) => setPublicAuthEmail(e.target.value)}
                            placeholder="example@company.com"
                            className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-[#1a2867] focus:ring-2 focus:ring-[#1a2867]/20"
                          />
                        </div>
                      </div>

                      {/* 사업자 등록증 첨부 */}
                      <div className="mb-6">
                        <label className="block text-xs md:text-sm text-foreground mb-2">
                          사업자 등록증 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          ref={publicAuthFileInputRef}
                          onChange={handlePublicAuthFileSelect}
                          accept="image/*,.pdf"
                          className="hidden"
                        />
                        
                        {!publicAuthFile ? (
                          <button
                            onClick={() => publicAuthFileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-background border-2 border-dashed border-border rounded-xl hover:border-[#1a2867] hover:bg-[#1a2867]/5 transition-all text-sm"
                          >
                            <Paperclip className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">파일 선택 (이미지 또는 PDF, 최대 10MB)</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-xl">
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-[#1a2867]" />
                              <span className="text-xs md:text-sm text-foreground">{publicAuthFile.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({(publicAuthFile.size / 1024).toFixed(1)}KB)
                              </span>
                            </div>
                            <button
                              onClick={handlePublicAuthFileRemove}
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 버튼 그룹 */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowPublicAuthForm(false);
                            setPublicAuthEmail('');
                            setPublicAuthFile(null);
                          }}
                          disabled={isPublicAuthLoading}
                          className="flex-1 px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          취소
                        </button>
                        <button
                          onClick={handlePublicAuthSubmit}
                          disabled={isPublicAuthLoading}
                          className="flex-1 px-4 py-2.5 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-lg transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isPublicAuthLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>확인 중...</span>
                            </>
                          ) : (
                            '인증 요청 제출'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 인증 완료 - 기존 서류 다운로드 UI
                <div className="px-4 md:px-6 pb-4 md:pb-6 border-t border-border">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 md:mb-4 pt-3 md:pt-4">
                    <p className="text-xs md:text-sm text-muted-foreground">필요한 서류를 선택하여 다운로드하실 수 있습니다.</p>
                    <button
                      onClick={toggleAllDocuments}
                      className="text-xs md:text-sm text-[#fab803] hover:underline transition-colors whitespace-nowrap"
                    >
                      {selectedDocs.size === publicDocuments.length ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>

                  {/* 서류 체크박스 목록 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
                {publicDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl p-3 md:p-4 border border-border hover:border-[#1a2867]/50 transition-colors"
                  >
                    <div className="flex items-start gap-2 md:gap-3">
                      <input
                        type="checkbox"
                        id={doc.id}
                        checked={selectedDocs.has(doc.id)}
                        onChange={() => toggleDocument(doc.id)}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5 accent-[#1a2867] cursor-pointer"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={doc.id}
                          className="text-xs md:text-sm cursor-pointer block text-foreground"
                        >
                          {doc.name}
                        </label>
                        
                        {/* 타견적서 수량 선택 */}
                        {doc.id === 'other-quote' && selectedDocs.has(doc.id) && (
                          <div className="mt-1.5 md:mt-2 flex items-center gap-1.5 md:gap-2">
                            <label className="text-[10px] md:text-xs text-muted-foreground">수량:</label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={otherQuoteQuantity}
                              onChange={(e) => setOtherQuoteQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                              className="w-14 md:w-16 px-1.5 md:px-2 py-0.5 md:py-1 text-xs md:text-sm border border-border rounded-lg focus:outline-none focus:border-[#fab803] focus:ring-2 focus:ring-[#fab803]/20"
                            />
                            <span className="text-[10px] md:text-xs text-muted-foreground">부</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

                  {/* 선택한 서류 정보 및 다운로드 버튼 */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white rounded-xl p-3 md:p-4 border border-border">
                    <div className="text-xs md:text-sm">
                      <span className="text-muted-foreground">선택한 서류: </span>
                      <span className="text-[#fab803]">{selectedDocs.size}개</span>
                      {selectedDocs.has('other-quote') && (
                        <span className="text-muted-foreground ml-1.5 md:ml-2">(타견적서 {otherQuoteQuantity}부 포함)</span>
                      )}
                    </div>
                    <button
                      onClick={handleDownloadSelectedDocs}
                      disabled={selectedDocs.size === 0}
                      className="flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-1.5 md:py-2 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-lg transition-colors text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      선택 다운로드
                    </button>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* 메모 및 문의사항 */}
            <div id="tour-inquiry" className="bg-white rounded-xl md:rounded-2xl border border-border p-4 md:p-8 mb-4 md:mb-6 no-print">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#fab803]/10 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-[#fab803]" />
                </div>
                <h3 className="text-foreground text-sm md:text-base">메모 및 문의사항</h3>
                <span className="text-xs md:text-sm text-muted-foreground">({messages.length})</span>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 md:gap-3 ${msg.sender === 'customer' ? 'flex-row-reverse' : ''}`}>
                    {/* 아바타 */}
                    <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                      msg.sender === 'manager' 
                        ? 'bg-[#fab803]' 
                        : 'bg-[#1a2867]'
                    }`}>
                      <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>

                    {/* 댓글 내용 */}
                    <div className={`flex-1 min-w-0 ${msg.sender === 'customer' ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                      <div className={`rounded-xl p-3 md:p-4 max-w-[85%] ${
                        msg.sender === 'manager' 
                          ? 'bg-[#fab803] text-black' 
                          : 'bg-[#1a2867] text-white'
                      }`}>
                        <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                          <span className={`text-xs md:text-sm ${msg.sender === 'manager' ? 'text-black font-medium' : 'text-white font-medium'}`}>
                            {msg.sender === 'manager' ? '관리자' : '고객'}
                          </span>
                        </div>
                        {msg.message && (
                          <p className={`text-xs md:text-sm ${msg.sender === 'manager' ? 'text-black' : 'text-white'} break-words`}>
                            {msg.message}
                          </p>
                        )}
                        
                        {/* 첨부 파일 표시 */}
                        {msg.files && msg.files.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            {msg.files.map((file, idx) => (
                              <a
                                key={idx}
                                href={file.url}
                                download={file.name}
                                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                                  msg.sender === 'manager' 
                                    ? 'bg-black/10 hover:bg-black/20' 
                                    : 'bg-white/10 hover:bg-white/20'
                                }`}
                              >
                                <File className="w-4 h-4 flex-shrink-0" />
                                <span className="text-xs truncate flex-1">{file.name}</span>
                                <Download className="w-3.5 h-3.5 flex-shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                          <Clock className={`w-3 h-3 ${msg.sender === 'manager' ? 'text-black/60' : 'text-white/70'}`} />
                          <span className={`text-[10px] md:text-xs ${msg.sender === 'manager' ? 'text-black/60' : 'text-white/70'}`}>
                            5일 전 · {msg.timestamp.toLocaleDateString('ko-KR')} {msg.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 댓글 입력 */}
              <div className="flex gap-2 md:gap-3">
                {/* 고객 아바타 */}
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1a2867] flex items-center justify-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>

                {/* 입력 영역 */}
                <div className="flex-1 bg-muted/20 rounded-xl border border-border p-3 md:p-4">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#1a2867]" />
                    <span className="text-xs md:text-sm text-[#1a2867]">고객</span>
                  </div>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="견적서에 관련하여 문의사항이나 메모를 남겨주세요..."
                    className="w-full bg-transparent border-none outline-none text-xs md:text-sm resize-none placeholder:text-muted-foreground"
                    rows={3}
                  />
                  
                  {/* 첨부 파일 미리보기 */}
                  {attachedFiles.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {attachedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                        >
                          <File className="w-4 h-4 text-[#1a2867] flex-shrink-0" />
                          <span className="text-xs text-foreground truncate flex-1">{file.name}</span>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">
                            {(file.size / 1024).toFixed(1)}KB
                          </span>
                          <button
                            onClick={() => removeAttachedFile(idx)}
                            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-2 md:mt-3 pt-2 md:pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <input
                        ref={messageFileInputRef}
                        type="file"
                        multiple
                        onChange={handleMessageFileAttach}
                        className="hidden"
                      />
                      <button
                        onClick={() => messageFileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-muted/50 hover:bg-muted transition-colors rounded-lg text-xs"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-[#1a2867]" />
                        <span className="text-muted-foreground">파일 첨부</span>
                      </button>
                      <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:inline">Ctrl+Enter 또는 Cmd+Enter로 빠른 입력</span>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && attachedFiles.length === 0}
                      className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-lg transition-colors text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                    >
                      <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      메모 전송
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 플로팅 액션 배너 - Toss Style */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-40 no-print w-[calc(100%-2rem)] md:w-auto max-w-lg md:max-w-none">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-border px-3 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-muted/50 hover:bg-muted/70 text-foreground rounded-lg md:rounded-xl transition-all text-sm md:text-base"
          >
            <Printer className="w-4 h-4 md:w-5 md:h-5" />
            <span>PDF 인쇄</span>
          </button>
          <button
            onClick={handleReject}
            className="flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg md:rounded-xl transition-all text-sm md:text-base"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
            <span>견적 거절</span>
          </button>
          <button
            onClick={handleApprove}
            disabled={selectedItems.size === 0}
            className="flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-lg md:rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm md:text-base"
          >
            <Check className="w-4 h-4 md:w-5 md:h-5" />
            <span>견적 승인</span>
          </button>
        </div>
      </div>

      {/* 거절 모달 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 no-print p-4">
          <div className="bg-white p-6 md:p-8 rounded-xl md:rounded-2xl shadow-2xl w-full max-w-md relative border border-border">
            <button
              onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <h3 className="text-lg md:text-xl text-foreground mb-3 md:mb-4">견적서 거절</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">거절 사유를 입력해주세요.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="거절 사유를 입력해주세요..."
              className="w-full bg-muted/20 border border-border rounded-xl p-3 md:p-4 text-xs md:text-sm resize-none focus:outline-none focus:border-destructive focus:ring-2 focus:ring-destructive/20"
              rows={4}
            />
            <div className="flex items-center justify-end gap-2 md:gap-3 mt-4 md:mt-6">
              <button
                type="button"
                onClick={() => { setShowRejectModal(false); setRejectReason(''); }}
                className="px-4 md:px-6 py-1.5 md:py-2 bg-muted/50 hover:bg-muted/70 text-foreground rounded-lg transition-colors text-xs md:text-sm"
              >
                취소
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-4 md:px-6 py-1.5 md:py-2 bg-destructive hover:bg-destructive/90 text-white rounded-lg transition-colors text-xs md:text-sm"
              >
                거절하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원가입 모달 */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 no-print p-4">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto relative border border-border">
            <button
              onClick={() => setShowSignupModal(false)}
              className="absolute top-3 right-3 md:top-4 md:right-4 z-10 text-muted-foreground hover:text-foreground transition-colors bg-white rounded-full p-1"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            {/* 본문 */}
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">회원 가입</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-[#fab803]/10 to-[#fab803]/5 border border-[#fab803]/20 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#fab803] flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">회원 혜택</p>
                    <p className="text-sm font-semibold text-[rgb(0,0,0)]">3% 즉시 할인</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-[#fab803]/10 to-[#fab803]/5 border border-[#fab803]/20 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#fab803] flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">실시간 추적</p>
                    <p className="text-sm font-semibold text-[rgb(0,0,0)]">주문 상황 확인</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-[#fab803]/10 to-[#fab803]/5 border border-[#fab803]/20 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-[#fab803] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">1:1 매니저 배정</p>
                    <p className="text-sm font-semibold text-[rgb(0,0,0)]">우선 상담</p>
                  </div>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); alert('회원가입이 완료되었습니다!'); setShowSignupModal(false); window.location.href = '/payment'; }}>
                <div className="space-y-5">
                  {/* 개인/회사 선택 */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">계정 유형</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAccountType('personal')}
                        className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 transition-all ${
                          accountType === 'personal'
                            ? 'border-[#fab803] bg-[#fab803]/5 text-[#1a2867] shadow-sm'
                            : 'border-border bg-white text-muted-foreground hover:border-[#fab803]/30 hover:bg-gray-50'
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">개인</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('business')}
                        className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 transition-all ${
                          accountType === 'business'
                            ? 'border-[#fab803] bg-[#fab803]/5 text-[#1a2867] shadow-sm'
                            : 'border-border bg-white text-muted-foreground hover:border-[#fab803]/30 hover:bg-gray-50'
                        }`}
                      >
                        <Building2 className="w-5 h-5" />
                        <span className="font-medium">회사</span>
                      </button>
                    </div>
                  </div>

                  {/* 이름 */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">이름</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        defaultValue="홍길동"
                        className="w-full bg-white border-2 border-border rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#fab803] focus:ring-4 focus:ring-[#fab803]/10 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* 회사명 (회사 선택 시에만 표시) */}
                  {accountType === 'business' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-semibold text-foreground mb-2">회사명</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          defaultValue="(주)쿠디솜"
                          className="w-full bg-white border-2 border-border rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#fab803] focus:ring-4 focus:ring-[#fab803]/10 transition-all"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* 이메일 */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">이메일</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className={`w-full bg-white border-2 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-4 transition-all ${
                          signupEmail && !isValidEmail(signupEmail)
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-border focus:border-[#fab803] focus:ring-[#fab803]/10'
                        }`}
                        placeholder="your@email.com"
                        disabled={emailVerified}
                        required
                      />
                    </div>
                    {signupEmail && !isValidEmail(signupEmail) && (
                      <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
                        <AlertCircle className="w-3 h-3" />
                        올바른 이메일 형식을 입력해주세요
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => { 
                          if (isValidEmail(signupEmail)) {
                            alert('인증번호가 발송되었습니다.'); 
                          }
                        }}
                        disabled={emailVerified || !isValidEmail(signupEmail)}
                        className="flex-1 px-4 py-2.5 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white text-sm font-medium rounded-xl transition-all disabled:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground shadow-sm"
                      >
                        {emailVerified ? '✓ 인증 완료' : '인증번호 발송'}
                      </button>
                      {!emailVerified && (
                        <>
                          <input
                            type="text"
                            placeholder="인증번호 6자리"
                            className="flex-1 bg-white border-2 border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#fab803] focus:ring-4 focus:ring-[#fab803]/10 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => { setEmailVerified(true); alert('이메일이 인증되었습니다.'); }}
                            className="px-5 py-2.5 bg-[#fab803] hover:bg-[#fab803]/90 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
                          >
                            확인
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 연락처 */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">연락처</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className={`w-full bg-white border-2 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-4 transition-all ${
                          signupPhone && !isValidPhone(signupPhone)
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-border focus:border-[#fab803] focus:ring-[#fab803]/10'
                        }`}
                        placeholder="01012345678"
                        disabled={phoneVerified}
                        required
                      />
                    </div>
                    {signupPhone && !isValidPhone(signupPhone) && (
                      <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5">
                        <AlertCircle className="w-3 h-3" />
                        10-11자리 숫자만 입력해주세요
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => { 
                          if (isValidPhone(signupPhone)) {
                            alert('인증번호가 발송되었습니다.'); 
                          }
                        }}
                        disabled={phoneVerified || !isValidPhone(signupPhone)}
                        className="flex-1 px-4 py-2.5 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white text-sm font-medium rounded-xl transition-all disabled:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground shadow-sm"
                      >
                        {phoneVerified ? '✓ 인증 완료' : '인증번호 발송'}
                      </button>
                      {!phoneVerified && (
                        <>
                          <input
                            type="text"
                            placeholder="인증번호 6자리"
                            className="flex-1 bg-white border-2 border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#fab803] focus:ring-4 focus:ring-[#fab803]/10 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => { setPhoneVerified(true); alert('연락처가 인증되었습니다.'); }}
                            className="px-5 py-2.5 bg-[#fab803] hover:bg-[#fab803]/90 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
                          >
                            확인
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 비밀번호 */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">비밀번호</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full bg-white border-2 border-border rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:border-[#fab803] focus:ring-4 focus:ring-[#fab803]/10 transition-all"
                        placeholder="최소 8자 이상"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* 비밀번호 강도 표시 */}
                    {signupPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2 mt-2"
                      >
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                                level <= passwordStrength ? strengthColors[passwordStrength] : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs ${
                          passwordStrength <= 2 ? 'text-red-500' : 
                          passwordStrength === 3 ? 'text-orange-500' : 
                          passwordStrength === 4 ? 'text-yellow-500' : 'text-emerald-600'
                        }`}>
                          비밀번호 강도: {strengthLabels[passwordStrength]}
                        </p>
                      </motion.div>
                    )}
                    
                    {!signupPassword && (
                      <p className="text-xs text-muted-foreground mt-1.5">영문, 숫자 포함 8자 이상</p>
                    )}
                  </div>

                  {/* 비밀번호 확인 */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">비밀번호 확인</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className={`w-full bg-white border-2 rounded-xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:ring-4 transition-all ${
                          signupConfirmPassword && signupPassword !== signupConfirmPassword
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-border focus:border-[#fab803] focus:ring-[#fab803]/10'
                        }`}
                        placeholder="비밀번호 재입력"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* 비밀번호 일치 표시 */}
                    {signupConfirmPassword && signupPassword === signupConfirmPassword && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2"
                      >
                        <Check className="w-3 h-3" />
                        비밀번호가 일치합니다
                      </motion.p>
                    )}
                    
                    {signupConfirmPassword && signupPassword !== signupConfirmPassword && (
                      <p className="flex items-center gap-1.5 text-xs text-red-500 mt-2">
                        <AlertCircle className="w-3 h-3" />
                        비밀번호가 일치하지 않습니다
                      </p>
                    )}
                  </div>

                  {/* 약관 동의 */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={termsAgreed}
                          onChange={(e) => setTermsAgreed(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[#1a2867]/20 ${
                          termsAgreed 
                            ? 'bg-[#1a2867] border-[#1a2867]' 
                            : 'border-gray-300 bg-white group-hover:border-gray-400'
                        }`}>
                          <AnimatePresence>
                            {termsAgreed && (
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
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        <a href="#" className="text-[#1a2867] hover:underline font-medium">서비스 이용약관</a> 및{' '}
                        <a href="#" className="text-[#1a2867] hover:underline font-medium">개인정보 처리방침</a>에 동의합니다.{' '}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      // 유효성 검사
                      if (!isValidEmail(signupEmail)) {
                        alert('올바른 이메일을 입력해주세요.');
                        return;
                      }
                      if (!emailVerified) {
                        alert('이메일 인증을 완료해주세요.');
                        return;
                      }
                      if (!isValidPhone(signupPhone)) {
                        alert('올바른 연락처를 입력해주세요.');
                        return;
                      }
                      if (!phoneVerified) {
                        alert('연락처 인증을 완료해주세요.');
                        return;
                      }
                      if (signupPassword.length < 8) {
                        alert('비밀번호는 최소 8자 이상이어야 합니다.');
                        return;
                      }
                      if (signupPassword !== signupConfirmPassword) {
                        alert('비밀번호가 일치하지 않습니다.');
                        return;
                      }
                      if (!termsAgreed) {
                        alert('서비스 이용약관 및 개인정보 처리방침에 동의해주세요.');
                        return;
                      }
                      
                      alert('회원가입이 완료되었습니다!');
                      setShowSignupModal(false);
                      
                      // Navigate to payment page with quote amount (결제 수단 선택 페이지로 견적 금액과 함께 이동)
                      navigate('/payment', { 
                        state: { 
                          quoteAmount: grandTotal.total,
                          quoteSalePrice: grandTotal.salePrice,
                          quoteVat: grandTotal.vat,
                          selectedItems: Array.from(selectedItems).map(id => items.find(item => item.id === id))
                        } 
                      });
                    }}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#1a2867] to-[#2a3877] hover:from-[#1a2867]/90 hover:to-[#2a3877]/90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-base relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Gift className="w-5 h-5" />
                      3% 할인 받고 가입하기
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fab803]/0 via-[#fab803]/10 to-[#fab803]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignupModal(false);
                      
                      // Navigate to payment page with quote amount (결제 수단 선택 페이지로 견적 금액과 함께 이동)
                      navigate('/payment', { 
                        state: { 
                          quoteAmount: grandTotal.total,
                          quoteSalePrice: grandTotal.salePrice,
                          quoteVat: grandTotal.vat,
                          selectedItems: Array.from(selectedItems).map(id => items.find(item => item.id === id))
                        } 
                      });
                    }}
                    className="w-full px-6 py-4 bg-white hover:bg-gray-50 text-foreground font-medium rounded-xl transition-all border-2 border-border text-base"
                  >
                    나중에 하기
                  </button>
                </div>
              </form>

              <p className="text-sm text-center text-muted-foreground mt-6">
                이미 회원이신가요? <button className="text-[#1a2867] font-semibold hover:underline">로그인</button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 프리뷰 모달 */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 no-print p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative w-full max-w-6xl h-full max-h-[95vh] bg-white rounded-2xl overflow-hidden flex flex-col border border-border" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-colors shadow-lg"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-foreground">{previewImage.name}</h3>
                {previewImage.urls.length > 1 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                    <span>{previewImage.currentIndex + 1} / {previewImage.urls.length}</span>
                  </div>
                )}
              </div>
              <div className="relative flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
                <img 
                  src={previewImage.urls[previewImage.currentIndex]} 
                  alt={`${previewImage.name} ${previewImage.currentIndex + 1}`}
                  className="max-w-full max-h-[calc(95vh-120px)] object-contain"
                />
                {previewImage.urls.length > 1 && (
                  <>
                    {previewImage.currentIndex > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage({ ...previewImage, currentIndex: previewImage.currentIndex - 1 });
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 transition-colors shadow-lg"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </button>
                    )}
                    {previewImage.currentIndex < previewImage.urls.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage({ ...previewImage, currentIndex: previewImage.currentIndex + 1 });
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 transition-colors shadow-lg"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </button>
                    )}
                  </>
                )}
              </div>
              {previewImage.urls.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {previewImage.urls.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage({ ...previewImage, currentIndex: index });
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === previewImage.currentIndex 
                          ? 'bg-primary w-6' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}