import { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  GripVertical, FileText, MessageCircle, HelpCircle, Package, Clock, FileCheck, AlertCircle,
  User, TrendingUp, CheckCircle, Truck, Download, Eye, Upload, RefreshCw, Sparkles, X, Edit3,
  ChevronLeft, ChevronRight, Grid3X3, Columns3, Calendar, LayoutGrid, Info, ArrowRight, ArrowLeft,
  Ship, Building2, FileSignature, PackageCheck, ClipboardCheck, MapPin, Folder, FolderPlus,
  File, Plus, Camera, Save, Pencil, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ============================================================================
// 타입 정의
// ============================================================================

type ViewType = 'grid' | 'kanban' | 'calendar' | 'gallery';
type BadgeColor = 'yellow' | 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'gray' | 'cyan' | 'pink' | 'indigo' | 'teal';
type FolderColor = 'amber' | 'blue' | 'green' | 'purple' | 'red' | 'pink' | 'cyan' | 'gray';

interface DashboardSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface TourStep {
  target: string;
  title: string;
  description: string;
}

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  color?: FolderColor;
  date: string;
  children?: FolderItem[];
}

interface KanbanColumn<T> {
  id: string;
  title: string;
  color: string;
  items: T[];
}

// ============================================================================
// Mock 데이터
// ============================================================================

const mockQuotes = [
  { id: 'QT-2024-001', productType: '봉제 인형', quantity: 500, requestDate: '2024-12-15', status: 'pending', description: '캐릭터 곰돌이 인형, 20cm', estimatedPrice: '2,500,000원' },
  { id: 'QT-2024-002', productType: '인형 키링', quantity: 1000, requestDate: '2024-12-14', status: 'reviewing', description: '고양이 캐릭터 키링, 8cm', estimatedPrice: '3,000,000원' },
  { id: 'QT-2024-003', productType: '마스코트 인형', quantity: 300, requestDate: '2024-12-13', status: 'completed', description: '회사 마스코트 인형, 30cm', estimatedPrice: '1,800,000원' },
  { id: 'QT-2024-004', productType: '봉제 인형', quantity: 2000, requestDate: '2024-12-12', status: 'confirmed', description: '토끼 캐릭터 인형, 25cm', estimatedPrice: '8,000,000원' },
  { id: 'QT-2024-005', productType: '인형 키링', quantity: 800, requestDate: '2024-12-11', status: 'pending', description: '강아지 캐릭터 키링, 10cm', estimatedPrice: '2,400,000원' },
  { id: 'QT-2024-006', productType: '마스코트 인형', quantity: 1500, requestDate: '2024-12-10', status: 'reviewing', description: '브랜드 마스코트, 40cm', estimatedPrice: '9,000,000원' },
  { id: 'QT-2024-007', productType: '봉제 인형', quantity: 600, requestDate: '2024-12-09', status: 'completed', description: '판다 캐릭터 인형, 15cm', estimatedPrice: '2,100,000원' },
  { id: 'QT-2024-008', productType: '인형 키링', quantity: 400, requestDate: '2024-12-08', status: 'confirmed', description: '곰 캐릭터 미니 키링, 5cm', estimatedPrice: '1,200,000원' },
];

// 샘플 주문 13단계
const mockSampleOrders = [
  { id: 's1', orderNo: 'SP-2024-001', productType: '봉제 인형 (곰)', quantity: 3, expectedDelivery: '2024-12-20', progress: 8, status: 'payment-pending', price: '150,000원', manager: '김담당' },
  { id: 's2', orderNo: 'SP-2024-002', productType: '인형 키링 (고양이)', quantity: 5, expectedDelivery: '2024-12-22', progress: 15, status: 'payment-completed', price: '200,000원', manager: '이담당' },
  { id: 's3', orderNo: 'SP-2024-003', productType: '마스코트 인형 (펭귄)', quantity: 2, expectedDelivery: '2024-12-25', progress: 25, status: 'manufacturing', price: '180,000원', manager: '박담당' },
  { id: 's4', orderNo: 'SP-2024-004', productType: '봉제 인형 (토끼)', quantity: 3, expectedDelivery: '2024-12-18', progress: 35, status: 'feedback-pending', price: '165,000원', manager: '김담당' },
  { id: 's5', orderNo: 'SP-2024-005', productType: '인형 키링 (강아지)', quantity: 4, expectedDelivery: '2024-12-19', progress: 42, status: 'revising', price: '160,000원', manager: '이담당' },
  { id: 's6', orderNo: 'SP-2024-006', productType: '마스코트 인형 (사자)', quantity: 2, expectedDelivery: '2024-12-21', progress: 50, status: 'revision-completed', price: '190,000원', manager: '박담당' },
  { id: 's7', orderNo: 'SP-2024-007', productType: '봉제 인형 (판다)', quantity: 3, expectedDelivery: '2024-12-23', progress: 58, status: 'final-confirmed', price: '170,000원', manager: '김담당' },
  { id: 's8', orderNo: 'SP-2024-008', productType: '인형 키링 (곰)', quantity: 5, expectedDelivery: '2024-12-24', progress: 65, status: 'delivery-method', price: '175,000원', manager: '이담당' },
  { id: 's9', orderNo: 'SP-2024-009', productType: '마스코트 인형 (호랑이)', quantity: 2, expectedDelivery: '2024-12-26', progress: 72, status: 'china-korea-shipping', currentLocation: '중국 선전 → 인천항', price: '185,000원', manager: '박담당' },
  { id: 's10', orderNo: 'SP-2024-010', productType: '봉제 인형 (코끼리)', quantity: 3, expectedDelivery: '2024-12-27', progress: 80, status: 'customs', currentLocation: '인천세관', price: '155,000원', manager: '김담당' },
  { id: 's11', orderNo: 'SP-2024-011', productType: '인형 키링 (여우)', quantity: 4, expectedDelivery: '2024-12-28', progress: 90, status: 'domestic-shipping', trackingNo: '612345678901', currentLocation: '서울 송파구', price: '145,000원', manager: '이담당' },
  { id: 's12', orderNo: 'SP-2024-012', productType: '마스코트 인형 (공룡)', quantity: 2, expectedDelivery: '2024-12-15', progress: 100, status: 'delivered', deliveredDate: '2024-12-15', price: '195,000원', manager: '박담당' },
];

// 본주문 9단계
const mockBulkOrders = [
  { id: 'b1', orderNo: 'BO-2024-001', productType: '봉제 인형 (곰)', quantity: 500, expectedDelivery: '2025-01-15', progress: 10, status: 'payment-pending', price: '25,000,000원', manager: '김담당' },
  { id: 'b2', orderNo: 'BO-2024-002', productType: '인형 키링 (고양이)', quantity: 1000, expectedDelivery: '2025-01-20', progress: 22, status: 'contract-completed', price: '30,000,000원', manager: '이담당' },
  { id: 'b3', orderNo: 'BO-2024-003', productType: '마스코트 인형 (펭귄)', quantity: 300, expectedDelivery: '2025-01-25', progress: 38, status: 'bulk-manufacturing', price: '18,000,000원', manager: '박담당' },
  { id: 'b4', orderNo: 'BO-2024-004', productType: '봉제 인형 (토끼)', quantity: 800, expectedDelivery: '2025-01-18', progress: 50, status: 'china-inland-shipping', currentLocation: '광저우 → 선전', price: '40,000,000원', manager: '김담당' },
  { id: 'b5', orderNo: 'BO-2024-005', productType: '인형 키링 (강아지)', quantity: 2000, expectedDelivery: '2025-01-22', progress: 62, status: 'china-korea-shipping', currentLocation: '선전항 → 인천항', price: '60,000,000원', manager: '이담당' },
  { id: 'b6', orderNo: 'BO-2024-006', productType: '마스코트 인형 (사자)', quantity: 500, expectedDelivery: '2025-01-28', progress: 75, status: 'customs', currentLocation: '인천세관', price: '30,000,000원', manager: '박담당' },
  { id: 'b7', orderNo: 'BO-2024-007', productType: '봉제 인형 (판다)', quantity: 1500, expectedDelivery: '2025-01-30', progress: 88, status: 'domestic-shipping', trackingNo: '987654321012', currentLocation: '경기도 이천', price: '75,000,000원', manager: '김담당' },
  { id: 'b8', orderNo: 'BO-2024-008', productType: '인형 키링 세트', quantity: 3000, expectedDelivery: '2025-01-10', progress: 100, status: 'delivered', deliveredDate: '2025-01-10', price: '90,000,000원', manager: '이담당' },
];

const mockOneOnOne = [
  { id: '1', title: '샘플 배송 일정 문의드립니다', category: '배송', date: '2024-12-15', status: 'waiting', unread: true, content: '안녕하세요, 주문한 샘플의 배송이 언제쯤 도착할지 문의드립니다.', answer: '' },
  { id: '2', title: '결제 방법 변경 요청', category: '결제', date: '2024-12-14', status: 'answered', unread: false, content: '기존 카드 결제에서 계좌이체로 변경하고 싶습니다.', answer: '안녕하세요, 결제 방법 변경이 완료되었습니다.' },
  { id: '3', title: '디자인 수정 관련 문의', category: '디자인', date: '2024-12-13', status: 'waiting', unread: true, content: '현재 진행 중인 샘플의 색상을 변경하고 싶은데요.', answer: '' },
  { id: '4', title: '대량 주문 할인 문의', category: '가격', date: '2024-12-12', status: 'answered', unread: false, content: '5000개 이상 주문 시 할인율이 어떻게 되나요?', answer: '안녕하세요, 5000개 이상 주문 시 15% 할인이 적용됩니다.' },
  { id: '5', title: '통관 서류 관련 질문', category: '서류', date: '2024-12-11', status: 'waiting', unread: false, content: '수입 통관에 필요한 서류 목록을 알려주세요.', answer: '' },
];

const mockOrderHistory = [
  { id: '1', orderNo: 'BO-2024-100', product: '봉제 인형 (곰)', quantity: 1000, orderDate: '2024-11-20', totalPrice: '50,000,000원', status: '배송완료' },
  { id: '2', orderNo: 'BO-2024-099', product: '인형 키링 세트', quantity: 2000, orderDate: '2024-11-15', totalPrice: '60,000,000원', status: '배송완료' },
  { id: '3', orderNo: 'BO-2024-098', product: '마스코트 인형 (펭귄)', quantity: 500, orderDate: '2024-11-10', totalPrice: '30,000,000원', status: '배송완료' },
  { id: '4', orderNo: 'BO-2024-097', product: '봉제 인형 (토끼)', quantity: 800, orderDate: '2024-11-05', totalPrice: '40,000,000원', status: '배송완료' },
];

const mockDefectReports = [
  { id: '1', orderNo: 'BO-2024-095', title: '봉제 불량', issue: '이음새 터짐 5개 발견', reportDate: '2024-12-10', status: 'processing', description: '배송받은 제품 중 5개에서 이음새가 터져있습니다.' },
  { id: '2', orderNo: 'BO-2024-094', title: '색상 불일치', issue: '샘플 대비 색상이 어두움', reportDate: '2024-12-08', status: 'done', resolution: '전량 재제작 완료', description: '샘플과 본제품의 색상이 많이 다릅니다.' },
  { id: '3', orderNo: 'BO-2024-093', title: '수량 부족', issue: '주문 수량 대비 10개 부족', reportDate: '2024-12-05', status: 'done', resolution: '추가 10개 발송 완료', description: '1000개 주문했는데 990개만 도착했습니다.' },
  { id: '4', orderNo: 'BO-2024-092', title: '포장 파손', issue: '외부 박스 훼손', reportDate: '2024-12-03', status: 'processing', description: '배송 중 박스가 파손되었습니다.' },
];

const initialFolders: FolderItem[] = [
  { id: 'f1', name: '2024년 견적서', type: 'folder', color: 'amber', date: '2024-12-01', children: [{ id: 'f1-1', name: '견적서_2024_12.pdf', type: 'file', date: '2024-12-15' }, { id: 'f1-2', name: '견적서_2024_11.pdf', type: 'file', date: '2024-11-20' }] },
  { id: 'f2', name: '계약서', type: 'folder', color: 'blue', date: '2024-11-15', children: [{ id: 'f2-1', name: '본계약서_2024.pdf', type: 'file', date: '2024-11-15' }] },
  { id: 'f3', name: '세금계산서', type: 'folder', color: 'green', date: '2024-10-01', children: [] },
  { id: 'f4', name: '거래명세서', type: 'folder', color: 'purple', date: '2024-09-01', children: [] },
  { id: 'f5', name: '통관서류', type: 'folder', color: 'cyan', date: '2024-08-01', children: [] },
  { id: 'f6', name: '원산지증명', type: 'folder', color: 'pink', date: '2024-07-01', children: [] },
];

// ============================================================================
// 상수
// ============================================================================

const VIEW_OPTIONS = [
  { id: 'grid' as ViewType, name: '그리드', icon: <Grid3X3 className="w-4 h-4" /> },
  { id: 'kanban' as ViewType, name: '칸반', icon: <Columns3 className="w-4 h-4" /> },
  { id: 'calendar' as ViewType, name: '캘린더', icon: <Calendar className="w-4 h-4" /> },
  { id: 'gallery' as ViewType, name: '갤러리', icon: <LayoutGrid className="w-4 h-4" /> }
];

// 샘플 주문 탭 (13단계)
const SAMPLE_ORDER_TABS = [
  { id: 'all', label: 'ALL' },
  { id: 'payment-pending', label: '결제 대기' },
  { id: 'payment-completed', label: '결제 완료' },
  { id: 'manufacturing', label: '제작 중' },
  { id: 'feedback-pending', label: '피드백 대기' },
  { id: 'revising', label: '수정 중' },
  { id: 'revision-completed', label: '수정 완료' },
  { id: 'final-confirmed', label: '최종 컨펌' },
  { id: 'delivery-method', label: '전달 방식' },
  { id: 'china-korea-shipping', label: '중국→한국' },
  { id: 'customs', label: '통관 중' },
  { id: 'domestic-shipping', label: '배송 중' },
  { id: 'delivered', label: '배송 완료' },
];

// 본주문 탭 (9단계)
const BULK_ORDER_TABS = [
  { id: 'all', label: 'ALL' },
  { id: 'payment-pending', label: '결제 대기' },
  { id: 'contract-completed', label: '계약 완료' },
  { id: 'bulk-manufacturing', label: '제작 중' },
  { id: 'china-inland-shipping', label: '중국 내륙' },
  { id: 'china-korea-shipping', label: '중국→한국' },
  { id: 'customs', label: '통관 중' },
  { id: 'domestic-shipping', label: '배송 중' },
  { id: 'delivered', label: '배송 완료' },
];

const TOUR_STEPS: TourStep[] = [
  { target: 'tour-header', title: '대시보드에 오신 것을 환영합니다!', description: '이 대시보드에서 견적 요청, 주문 관리, 서류 관리 등 모든 업무를 한 곳에서 처리할 수 있습니다. 가이드를 따라 주요 기능을 알아보세요!' },
  { target: 'tour-mypage', title: '마이 페이지', description: '회원 정보를 확인하고 직접 수정할 수 있습니다. 총 견적 요청, 진행 중인 주문, 완료된 주문 등 주요 통계도 한눈에 볼 수 있어요.' },
  { target: 'tour-one-on-one', title: '1:1 문의', description: '궁금한 점이 있으시면 언제든 문의해주세요. 새 문의 작성 버튼으로 질문을 등록하고, 답변 현황도 확인할 수 있습니다.' },
  { target: 'tour-quote-management', title: '견적 관리', description: '요청한 견적의 진행 상태를 확인하세요. 그리드, 칸반, 캘린더, 갤러리 뷰를 지원하며, 클릭하면 상세 정보를 볼 수 있습니다.' },
  { target: 'tour-order-management', title: '주문 관리', description: '샘플(13단계)과 본주문(9단계)의 진행 상황을 실시간으로 추적합니다. 결제부터 배송완료까지 모든 단계를 확인하세요.' },
  { target: 'tour-order-history', title: '오더 히스토리', description: '완료된 주문 내역을 확인할 수 있습니다. 테이블의 행을 클릭하면 상세 정보를 볼 수 있어요.' },
  { target: 'tour-defect-report', title: '불량 접수', description: '제품에 문제가 있으면 여기서 불량 접수를 해주세요. 사진 첨부도 가능하며, 처리 현황도 확인할 수 있습니다.' },
  { target: 'tour-document-management', title: '서류 관리', description: '견적서, 계약서, 세금계산서 등을 폴더별로 관리합니다. 폴더를 드래그하여 순서를 변경하고, 색상도 지정할 수 있어요.' },
  { target: 'tour-quote-inquiry', title: '견적 문의', description: '새로운 제품의 견적을 요청할 수 있습니다. 파일을 첨부하면 더 정확한 견적을 받을 수 있어요.' },
  { target: 'tour-complete', title: '가이드 완료! 🎉', description: '이제 대시보드를 자유롭게 사용해보세요. 섹션의 헤더를 드래그하여 순서를 변경할 수 있습니다. 가이드는 우측 상단 버튼으로 언제든 다시 볼 수 있어요!' },
];

const FOLDER_COLORS: { id: FolderColor; name: string; bg: string; icon: string }[] = [
  { id: 'amber', name: '노랑', bg: 'bg-amber-100', icon: 'text-amber-600' },
  { id: 'blue', name: '파랑', bg: 'bg-blue-100', icon: 'text-blue-600' },
  { id: 'green', name: '초록', bg: 'bg-green-100', icon: 'text-green-600' },
  { id: 'purple', name: '보라', bg: 'bg-purple-100', icon: 'text-purple-600' },
  { id: 'red', name: '빨강', bg: 'bg-red-100', icon: 'text-red-600' },
  { id: 'pink', name: '분홍', bg: 'bg-pink-100', icon: 'text-pink-600' },
  { id: 'cyan', name: '청록', bg: 'bg-cyan-100', icon: 'text-cyan-600' },
  { id: 'gray', name: '회색', bg: 'bg-gray-200', icon: 'text-gray-600' },
];

const INQUIRY_CATEGORIES = ['배송', '결제', '디자인', '가격', '품질', '서류', '기타'];
const ItemTypes = { SECTION: 'SECTION', FOLDER: 'FOLDER' };

// ============================================================================
// 유틸리티
// ============================================================================

const cn = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// ============================================================================
// 가이드 투어 컴포넌트 (완전 재작성)
// ============================================================================

function DashboardTour({ onComplete }: { onComplete: () => void }) {
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

      {/* 타겟 테두리 - 노란색 하이라이트 */}
      {isPositioned && (
        <div
          className="fixed rounded-xl pointer-events-none animate-pulse"
          style={{
            top: highlightBox.top - 10,
            left: highlightBox.left - 10,
            width: highlightBox.width + 20,
            height: highlightBox.height + 20,
            border: '3px solid #fab803',
            boxShadow: '0 0 0 4px rgba(250, 184, 3, 0.3), 0 0 30px rgba(250, 184, 3, 0.5), 0 0 60px rgba(250, 184, 3, 0.3), inset 0 0 20px rgba(250, 184, 3, 0.1)',
            background: 'linear-gradient(135deg, rgba(250, 184, 3, 0.05) 0%, transparent 100%)',
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

// ============================================================================
// 모달 컴포넌트
// ============================================================================

function Modal({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={cn('bg-white rounded-2xl shadow-2xl w-full overflow-hidden', sizes[size])} onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// UI 컴포넌트
// ============================================================================

function Button({ variant = 'primary', size = 'md', leftIcon, children, className, ...props }: { variant?: 'primary' | 'outline' | 'secondary'; size?: 'sm' | 'md' | 'lg'; leftIcon?: React.ReactNode; children: React.ReactNode; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = { primary: 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90 shadow-lg shadow-[#1a2867]/20', outline: 'border-2 border-gray-200 bg-white text-gray-700 hover:border-[#1a2867]/50', secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200' };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
  return <button className={cn('inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all disabled:opacity-50', variants[variant], sizes[size], className)} {...props}>{leftIcon}{children}</button>;
}

function Tabs({ tabs, activeTab, onTabChange }: { tabs: { id: string; label: string }[]; activeTab: string; onTabChange: (id: string) => void }) {
  return <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">{tabs.map(tab => <button key={tab.id} onClick={() => onTabChange(tab.id)} className={cn('px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all font-medium', activeTab === tab.id ? 'bg-[#1a2867] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>{tab.label}</button>)}</div>;
}

function ViewSelector({ currentView, onViewChange }: { currentView: ViewType; onViewChange: (v: ViewType) => void }) {
  return <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">{VIEW_OPTIONS.map(v => <button key={v.id} onClick={() => onViewChange(v.id)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all', currentView === v.id ? 'bg-white text-[#1a2867] shadow-sm' : 'text-gray-500 hover:text-gray-700')} title={v.name}>{v.icon}<span className="hidden sm:inline">{v.name}</span></button>)}</div>;
}

function StatusBadge({ label, color }: { label: string; color: BadgeColor }) {
  const colors: Record<BadgeColor, string> = { yellow: 'bg-amber-50 text-amber-700 border-amber-200', blue: 'bg-blue-50 text-blue-700 border-blue-200', green: 'bg-emerald-50 text-emerald-700 border-emerald-200', purple: 'bg-purple-50 text-purple-700 border-purple-200', red: 'bg-red-50 text-red-700 border-red-200', orange: 'bg-orange-50 text-orange-700 border-orange-200', gray: 'bg-gray-50 text-gray-700 border-gray-200', cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200', pink: 'bg-pink-50 text-pink-700 border-pink-200', indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200', teal: 'bg-teal-50 text-teal-700 border-teal-200' };
  return <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', colors[color])}>{label}</span>;
}

function EmptyState({ icon, title }: { icon?: React.ReactNode; title: string }) {
  return <div className="flex flex-col items-center justify-center py-12 text-center">{icon && <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-400">{icon}</div>}<p className="text-gray-900 font-semibold">{title}</p></div>;
}

function AlertBox({ children }: { children: React.ReactNode }) {
  return <div className="flex items-start gap-3 p-4 rounded-xl border bg-blue-50 border-blue-200 text-blue-800"><Info className="w-5 h-5 text-blue-500 flex-shrink-0" /><div className="text-sm">{children}</div></div>;
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return <div className="flex items-center justify-center gap-2 mt-4"><button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>{Array.from({ length: totalPages }, (_, i) => <button key={i} onClick={() => onPageChange(i + 1)} className={cn('w-8 h-8 rounded-lg text-sm font-medium', currentPage === i + 1 ? 'bg-[#1a2867] text-white' : 'hover:bg-gray-100 text-gray-600')}>{i + 1}</button>)}<button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button></div>;
}

// ============================================================================
// 뷰 컴포넌트
// ============================================================================

function CalendarView<T>({ items, dateKey, renderItem }: { items: T[]; dateKey: keyof T; renderItem: (item: T) => React.ReactNode }) {
  const [viewDate, setViewDate] = useState(new Date());
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const getItems = (day: number) => items.filter(item => { const d = new Date(item[dateKey] as string); return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year; });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
        <h3 className="font-bold text-gray-900">{year}년 {month + 1}월</h3>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => <div key={d} className={cn('text-center text-xs font-semibold py-2', i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500')}>{d}</div>)}
        {days.map((day, idx) => {
          const dayItems = day ? getItems(day) : [];
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          return <div key={idx} className={cn('min-h-[80px] p-1 border border-gray-100 rounded-lg', day ? 'bg-white' : 'bg-gray-50/50', isToday && 'ring-2 ring-[#1a2867]/30')}>{day && <><span className={cn('text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center', isToday ? 'bg-[#1a2867] text-white' : '')}>{day}</span><div className="mt-1 space-y-1">{dayItems.slice(0, 2).map((item, i) => <div key={i} className="text-xs truncate">{renderItem(item)}</div>)}</div></>}</div>;
        })}
      </div>
    </div>
  );
}

function KanbanView<T extends { id: string }>({ columns, renderCard }: { columns: KanbanColumn<T>[]; renderCard: (item: T) => React.ReactNode }) {
  return <div className="flex gap-4 overflow-x-auto pb-4">{columns.map(col => <div key={col.id} className="flex-shrink-0 w-72"><div className={cn('flex items-center justify-between px-4 py-3 rounded-t-xl font-semibold', col.color)}>{col.title}<span className="text-xs bg-white/60 px-2 py-1 rounded-full">{col.items.length}</span></div><div className="bg-gray-50 rounded-b-xl p-3 min-h-[200px] space-y-3">{col.items.map(item => <div key={item.id} className="bg-white rounded-xl shadow-sm border p-4 cursor-pointer hover:shadow-md">{renderCard(item)}</div>)}</div></div>)}</div>;
}

function GalleryView<T extends { id: string }>({ items, renderCard }: { items: T[]; renderCard: (item: T) => React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{items.map(item => <div key={item.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg cursor-pointer group">{renderCard(item)}</div>)}</div>;
}

// ============================================================================
// 드래그 가능한 섹션 카드 (헤더만 드래그 가능)
// ============================================================================

function DraggableSectionCard({ section, index, moveCard }: { section: DashboardSection; index: number; moveCard: (from: number, to: number) => void }) {
  const dragRef = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SECTION,
    item: { index },
    collect: monitor => ({ isDragging: monitor.isDragging() })
  });

  const [, drop] = useDrop({
    accept: ItemTypes.SECTION,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    }
  });

  // 헤더에만 드래그 핸들 연결
  drag(dragRef);
  
  return (
    <div
      ref={drop}
      id={`tour-${section.id}`}
      className={cn('transition-all duration-200', isDragging && 'opacity-50 scale-[0.98]')}
    >
      <div className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden">
        {/* 헤더 - 드래그 핸들 */}
        <div
          ref={dragRef}
          className="flex items-center gap-3 px-6 py-4 cursor-grab active:cursor-grabbing bg-[#1a2867] select-none"
        >
          <GripVertical className="w-5 h-5 text-white/40" />
          <div className="flex items-center gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              {section.icon}
            </div>
            <h3 className="font-bold text-white text-lg">{section.title}</h3>
          </div>
        </div>
        {/* 컨텐츠 - 드래그 불가 */}
        <div className="p-6">{section.component}</div>
      </div>
    </div>
  );
}

// ============================================================================
// 마이페이지 섹션
// ============================================================================

function MyPageSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({ type: '회사', companyName: '(주)샘플컴퍼니', name: '홍길동', email: 'hong@sample.com', phone: '010-1234-5678' });
  const [editData, setEditData] = useState(userInfo);
  const stats = [{ label: '총 견적 요청', value: '24건', trend: '+3', color: 'from-blue-500 to-blue-600' }, { label: '진행 중인 주문', value: '8건', trend: '+1', color: 'from-purple-500 to-purple-600' }, { label: '완료된 주문', value: '16건', trend: '+5', color: 'from-emerald-500 to-emerald-600' }];

  return (
    <div className="space-y-5">
      <div className="p-5 bg-gradient-to-br from-[#1a2867]/5 to-transparent border border-[#1a2867]/10 rounded-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1a2867]/10">
          <div className="flex items-center gap-2"><User className="w-5 h-5 text-[#1a2867]" /><h4 className="font-semibold text-gray-900">회원 정보</h4></div>
          {!isEditing ? <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-sm text-[#1a2867] hover:underline"><Pencil className="w-4 h-4" />수정</button> : <div className="flex gap-2"><button onClick={() => { setEditData(userInfo); setIsEditing(false); }} className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">취소</button><button onClick={() => { setUserInfo(editData); setIsEditing(false); alert('저장되었습니다.'); }} className="flex items-center gap-1 px-3 py-1 text-sm bg-[#1a2867] text-white rounded-lg"><Save className="w-3 h-3" />저장</button></div>}
        </div>
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-gray-500 block mb-1">구분</label><select value={editData.type} onChange={e => setEditData(p => ({ ...p, type: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg bg-white border focus:border-[#1a2867] focus:outline-none"><option>회사</option><option>개인</option></select></div>
            <div><label className="text-xs text-gray-500 block mb-1">회사명</label><input value={editData.companyName} onChange={e => setEditData(p => ({ ...p, companyName: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg bg-white border focus:border-[#1a2867] focus:outline-none" /></div>
            <div><label className="text-xs text-gray-500 block mb-1">이름</label><input value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg bg-white border focus:border-[#1a2867] focus:outline-none" /></div>
            <div><label className="text-xs text-gray-500 block mb-1">이메일</label><input value={editData.email} onChange={e => setEditData(p => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg bg-white border focus:border-[#1a2867] focus:outline-none" /></div>
            <div className="col-span-2"><label className="text-xs text-gray-500 block mb-1">연락처</label><input value={editData.phone} onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-lg bg-white border focus:border-[#1a2867] focus:outline-none" /></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500 mb-1">구분</p><p className="text-sm font-medium">{userInfo.type}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">회사명</p><p className="text-sm font-medium">{userInfo.companyName}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">이름</p><p className="text-sm font-medium">{userInfo.name}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">이메일</p><p className="text-sm font-medium">{userInfo.email}</p></div>
            <div className="col-span-2"><p className="text-xs text-gray-500 mb-1">연락처</p><p className="text-sm font-medium">{userInfo.phone}</p></div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">{stats.map((s, i) => <div key={i} className={cn('p-4 bg-gradient-to-br rounded-xl text-white shadow-lg', s.color)}><p className="text-2xl font-bold mb-1">{s.value}</p><p className="text-xs opacity-90 mb-2">{s.label}</p><span className="text-xs flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full w-fit"><TrendingUp className="w-3 h-3" />{s.trend}</span></div>)}</div>
    </div>
  );
}

// ============================================================================
// 1:1 문의 섹션
// ============================================================================

function OneOnOneSection() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof mockOneOnOne[0] | null>(null);
  const [newInquiry, setNewInquiry] = useState({ category: '', content: '' });
  
  const itemsPerPage = 2;
  const tabs = [{ id: 'all', label: 'ALL' }, { id: 'waiting', label: '답변 대기' }, { id: 'answered', label: '답변 완료' }];
  const filtered = activeTab === 'all' ? mockOneOnOne : mockOneOnOne.filter(m => m.status === activeTab);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={t => { setActiveTab(t); setCurrentPage(1); }} />
      <div className="space-y-3">
        {paginated.length === 0 ? <EmptyState icon={<MessageCircle className="w-6 h-6" />} title="문의가 없습니다" /> : paginated.map(msg => (
          <div key={msg.id} onClick={() => setSelectedItem(msg)} className={cn('p-4 rounded-xl border-2 cursor-pointer transition-all', msg.unread ? 'bg-blue-50/50 border-blue-200 hover:shadow-md' : 'bg-white border-gray-100 hover:border-gray-200')}>
            <div className="flex items-start gap-3">
              <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', msg.unread ? 'bg-[#1a2867]' : 'bg-gray-200')}><MessageCircle className="w-5 h-5 text-white" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1"><p className={cn('text-sm font-semibold truncate', msg.unread ? 'text-gray-900' : 'text-gray-600')}>{msg.title}</p>{msg.unread && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full flex-shrink-0">NEW</span>}</div>
                <p className="text-xs text-gray-400 mb-2">{msg.category} · {msg.date}</p>
                <StatusBadge label={msg.status === 'waiting' ? '답변 대기' : '답변 완료'} color={msg.status === 'waiting' ? 'orange' : 'green'} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <Button variant="primary" className="w-full" leftIcon={<Edit3 className="w-4 h-4" />} onClick={() => setShowModal(true)}>새 문의 작성</Button>

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="문의 상세" size="lg">
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex justify-between items-start"><h4 className="text-xl font-bold">{selectedItem.title}</h4><StatusBadge label={selectedItem.status === 'waiting' ? '답변 대기' : '답변 완료'} color={selectedItem.status === 'waiting' ? 'orange' : 'green'} /></div>
            <div className="flex gap-4 text-sm text-gray-500"><span>카테고리: {selectedItem.category}</span><span>작성일: {selectedItem.date}</span></div>
            <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">문의 내용</p><p className="text-gray-900">{selectedItem.content}</p></div>
            {selectedItem.answer && <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500"><p className="text-xs text-blue-600 mb-1 font-semibold">답변</p><p className="text-gray-900">{selectedItem.answer}</p></div>}
          </div>
        )}
      </Modal>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="새 문의 작성">
        <div className="space-y-4">
          <div><label className="text-sm font-semibold text-gray-700">카테고리 *</label><select value={newInquiry.category} onChange={e => setNewInquiry(p => ({ ...p, category: e.target.value }))} className="w-full mt-1 px-4 py-3 text-sm rounded-xl bg-gray-50 border focus:border-[#1a2867] focus:outline-none"><option value="">선택하세요</option>{INQUIRY_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="text-sm font-semibold text-gray-700">내용 *</label><textarea value={newInquiry.content} onChange={e => setNewInquiry(p => ({ ...p, content: e.target.value }))} className="w-full mt-1 px-4 py-3 text-sm rounded-xl bg-gray-50 border focus:border-[#1a2867] focus:outline-none resize-none" rows={5} placeholder="문의 내용을 입력하세요" /></div>
          <div className="flex gap-3"><Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>취소</Button><Button variant="primary" className="flex-1" onClick={() => { if (!newInquiry.category || !newInquiry.content) { alert('모두 입력해주세요.'); return; } alert('문의가 접수되었습니다.'); setShowModal(false); setNewInquiry({ category: '', content: '' }); }}>문의하기</Button></div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================================
// 견적 관리 섹션
// ============================================================================

function QuoteManagementSection() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentView, setCurrentView] = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<typeof mockQuotes[0] | null>(null);
  
  const itemsPerPage = 9;
  const tabs = [{ id: 'all', label: 'ALL' }, { id: 'pending', label: '대기 중' }, { id: 'reviewing', label: '작성 중' }, { id: 'completed', label: '산출 완료' }, { id: 'confirmed', label: '주문 확정' }];
  const filtered = activeTab === 'all' ? mockQuotes : mockQuotes.filter(q => q.status === activeTab);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatus = (s: string): { color: BadgeColor; label: string } => ({ pending: { color: 'yellow', label: '대기 중' }, reviewing: { color: 'blue', label: '작성 중' }, completed: { color: 'green', label: '산출 완료' }, confirmed: { color: 'purple', label: '주문 확정' } }[s] || { color: 'gray', label: '알 수 없음' });

  const kanbanColumns: KanbanColumn<typeof mockQuotes[0]>[] = [
    { id: 'pending', title: '대기 중', color: 'bg-amber-100 text-amber-800', items: mockQuotes.filter(q => q.status === 'pending') },
    { id: 'reviewing', title: '작성 중', color: 'bg-blue-100 text-blue-800', items: mockQuotes.filter(q => q.status === 'reviewing') },
    { id: 'completed', title: '산출 완료', color: 'bg-emerald-100 text-emerald-800', items: mockQuotes.filter(q => q.status === 'completed') },
    { id: 'confirmed', title: '주문 확정', color: 'bg-purple-100 text-purple-800', items: mockQuotes.filter(q => q.status === 'confirmed') }
  ];

  const renderCard = (q: typeof mockQuotes[0]) => {
    const s = getStatus(q.status);
    return <div onClick={() => setSelectedItem(q)} className="space-y-2"><div className="flex justify-between"><span className="text-sm font-semibold">{q.id}</span><StatusBadge label={s.label} color={s.color} /></div><p className="text-sm text-gray-600">{q.productType}</p><div className="flex justify-between text-xs text-gray-400 pt-2 border-t"><span>{q.quantity.toLocaleString()}개</span><span>{q.requestDate}</span></div></div>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4"><div className="flex-1 overflow-hidden"><Tabs tabs={tabs} activeTab={activeTab} onTabChange={t => { setActiveTab(t); setCurrentPage(1); }} /></div><ViewSelector currentView={currentView} onViewChange={v => { setCurrentView(v); setCurrentPage(1); }} /></div>
      
      {currentView === 'grid' && <><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{paginated.length === 0 ? <div className="col-span-3"><EmptyState icon={<FileText className="w-6 h-6" />} title="견적이 없습니다" /></div> : paginated.map(q => <div key={q.id} className="p-4 bg-white border rounded-xl hover:shadow-md cursor-pointer transition-all hover:border-[#1a2867]/30">{renderCard(q)}</div>)}</div><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></>}
      {currentView === 'kanban' && <KanbanView columns={kanbanColumns} renderCard={renderCard} />}
      {currentView === 'calendar' && <CalendarView items={mockQuotes} dateKey="requestDate" renderItem={q => <div onClick={() => setSelectedItem(q)} className="px-2 py-1 rounded bg-amber-100 text-amber-700 text-[10px] truncate cursor-pointer">{q.id}</div>} />}
      {currentView === 'gallery' && <GalleryView items={filtered} renderCard={q => <div onClick={() => setSelectedItem(q)}><div className="h-32 bg-gradient-to-br from-[#1a2867]/10 to-[#1a2867]/5 flex items-center justify-center"><Package className="w-12 h-12 text-[#1a2867]/20" /></div><div className="p-4">{renderCard(q)}</div></div>} />}

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="견적 상세" size="lg">
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex justify-between"><h4 className="text-xl font-bold">{selectedItem.id}</h4><StatusBadge label={getStatus(selectedItem.status).label} color={getStatus(selectedItem.status).color} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">제품 유형</p><p className="font-semibold">{selectedItem.productType}</p></div>
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">수량</p><p className="font-semibold">{selectedItem.quantity.toLocaleString()}개</p></div>
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">요청일</p><p className="font-semibold">{selectedItem.requestDate}</p></div>
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">예상 금액</p><p className="font-semibold text-[#1a2867]">{selectedItem.estimatedPrice}</p></div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">상세 설명</p><p>{selectedItem.description}</p></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================================================
// 주문 관리 섹션 (13단계 샘플, 9단계 본주문)
// ============================================================================

function OrderManagementSection() {
  const [categoryTab, setCategoryTab] = useState<'sample' | 'bulk'>('sample');
  const [activeTab, setActiveTab] = useState('all');
  const [currentView, setCurrentView] = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const itemsPerPage = 6;
  const orders = categoryTab === 'sample' ? mockSampleOrders : mockBulkOrders;
  const tabs = categoryTab === 'sample' ? SAMPLE_ORDER_TABS : BULK_ORDER_TABS;
  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatus = (s: string): { color: BadgeColor; label: string } => {
    const map: Record<string, { color: BadgeColor; label: string }> = {
      'payment-pending': { color: 'orange', label: '결제 대기' }, 'payment-completed': { color: 'blue', label: '결제 완료' },
      'contract-completed': { color: 'blue', label: '계약 완료' }, 'manufacturing': { color: 'purple', label: '제작 중' },
      'bulk-manufacturing': { color: 'purple', label: '제작 중' }, 'feedback-pending': { color: 'teal', label: '피드백 대기' },
      'revising': { color: 'yellow', label: '수정 중' }, 'revision-completed': { color: 'cyan', label: '수정 완료' },
      'final-confirmed': { color: 'indigo', label: '최종 컨펌' }, 'delivery-method': { color: 'pink', label: '전달 방식' },
      'china-inland-shipping': { color: 'cyan', label: '중국 내륙' }, 'china-korea-shipping': { color: 'indigo', label: '중국→한국' },
      'customs': { color: 'pink', label: '통관 중' }, 'domestic-shipping': { color: 'teal', label: '배송 중' },
      'delivered': { color: 'green', label: '배송 완료' }
    };
    return map[s] || { color: 'gray', label: s };
  };

  const kanbanColumns: KanbanColumn<any>[] = categoryTab === 'sample'
    ? [
        { id: 'payment', title: '결제', color: 'bg-orange-100 text-orange-800', items: orders.filter(o => ['payment-pending', 'payment-completed'].includes(o.status)) },
        { id: 'production', title: '제작/피드백', color: 'bg-purple-100 text-purple-800', items: orders.filter(o => ['manufacturing', 'feedback-pending', 'revising', 'revision-completed', 'final-confirmed', 'delivery-method'].includes(o.status)) },
        { id: 'shipping', title: '배송', color: 'bg-blue-100 text-blue-800', items: orders.filter(o => ['china-korea-shipping', 'customs', 'domestic-shipping'].includes(o.status)) },
        { id: 'done', title: '완료', color: 'bg-emerald-100 text-emerald-800', items: orders.filter(o => o.status === 'delivered') }
      ]
    : [
        { id: 'contract', title: '계약', color: 'bg-orange-100 text-orange-800', items: orders.filter(o => ['payment-pending', 'contract-completed'].includes(o.status)) },
        { id: 'production', title: '제작', color: 'bg-purple-100 text-purple-800', items: orders.filter(o => o.status === 'bulk-manufacturing') },
        { id: 'shipping', title: '물류', color: 'bg-blue-100 text-blue-800', items: orders.filter(o => ['china-inland-shipping', 'china-korea-shipping', 'customs', 'domestic-shipping'].includes(o.status)) },
        { id: 'done', title: '완료', color: 'bg-emerald-100 text-emerald-800', items: orders.filter(o => o.status === 'delivered') }
      ];

  const renderCard = (o: any) => {
    const s = getStatus(o.status);
    return (
      <div onClick={() => setSelectedItem(o)} className="space-y-2">
        <div className="flex justify-between"><span className="text-sm font-bold">{o.orderNo}</span><StatusBadge label={s.label} color={s.color} /></div>
        <p className="text-sm text-gray-600">{o.productType}</p>
        {o.currentLocation && <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{o.currentLocation}</p>}
        <div className="space-y-1"><div className="flex justify-between text-xs"><span className="text-gray-400">진행률</span><span className="text-[#1a2867] font-semibold">{o.progress}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="h-full bg-[#1a2867] rounded-full" style={{ width: `${o.progress}%` }} /></div></div>
        <div className="flex justify-between text-xs text-gray-400 pt-2 border-t"><span>{o.quantity.toLocaleString()}개</span><span>{o.expectedDelivery}</span></div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {(['sample', 'bulk'] as const).map(c => (
          <button key={c} onClick={() => { setCategoryTab(c); setActiveTab('all'); setCurrentPage(1); }} className={cn('flex-1 py-4 rounded-xl font-semibold transition-all', categoryTab === c ? 'bg-[#1a2867] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
            <span className="block">{c === 'sample' ? '샘플' : '본주문'}</span>
            <span className="text-xs opacity-70">{c === 'sample' ? '13단계' : '9단계'} · {(c === 'sample' ? mockSampleOrders : mockBulkOrders).length}건</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4"><div className="flex-1 overflow-hidden"><Tabs tabs={tabs} activeTab={activeTab} onTabChange={t => { setActiveTab(t); setCurrentPage(1); }} /></div><ViewSelector currentView={currentView} onViewChange={v => { setCurrentView(v); setCurrentPage(1); }} /></div>
      
      {currentView === 'grid' && <><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{paginated.length === 0 ? <div className="col-span-2"><EmptyState icon={<Package className="w-6 h-6" />} title="주문이 없습니다" /></div> : paginated.map(o => <div key={o.id} className="p-4 bg-white border rounded-xl hover:shadow-md cursor-pointer transition-all hover:border-[#1a2867]/30">{renderCard(o)}</div>)}</div><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></>}
      {currentView === 'kanban' && <KanbanView columns={kanbanColumns} renderCard={renderCard} />}
      {currentView === 'calendar' && <CalendarView items={filtered} dateKey="expectedDelivery" renderItem={o => <div onClick={() => setSelectedItem(o)} className="px-2 py-1 rounded bg-[#1a2867]/10 text-[#1a2867] text-[10px] truncate cursor-pointer">{o.orderNo}</div>} />}
      {currentView === 'gallery' && <GalleryView items={filtered} renderCard={o => <div onClick={() => setSelectedItem(o)}><div className="h-24 bg-gradient-to-br from-[#1a2867]/10 to-purple-500/10 flex items-center justify-center"><Package className="w-10 h-10 text-[#1a2867]/20" /></div><div className="p-4">{renderCard(o)}</div></div>} />}

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="주문 상세" size="lg">
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex justify-between"><h4 className="text-xl font-bold">{selectedItem.orderNo}</h4><StatusBadge label={getStatus(selectedItem.status).label} color={getStatus(selectedItem.status).color} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">제품</p><p className="font-semibold">{selectedItem.productType}</p></div>
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">수량</p><p className="font-semibold">{selectedItem.quantity.toLocaleString()}개</p></div>
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">예상 배송일</p><p className="font-semibold">{selectedItem.expectedDelivery}</p></div>
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">금액</p><p className="font-semibold text-[#1a2867]">{selectedItem.price}</p></div>
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">담당자</p><p className="font-semibold">{selectedItem.manager}</p></div>
              <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">진행률</p><p className="font-semibold">{selectedItem.progress}%</p></div>
            </div>
            {selectedItem.currentLocation && <div className="p-4 bg-blue-50 rounded-xl"><p className="text-xs text-blue-600 mb-1">현재 위치</p><p className="font-semibold text-blue-900 flex items-center gap-2"><MapPin className="w-4 h-4" />{selectedItem.currentLocation}</p></div>}
            {selectedItem.trackingNo && <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">송장번호</p><p className="font-mono font-semibold">{selectedItem.trackingNo}</p></div>}
            <div className="w-full bg-gray-200 rounded-full h-3"><div className="h-full bg-[#1a2867] rounded-full" style={{ width: `${selectedItem.progress}%` }} /></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================================================
// 오더 히스토리 섹션
// ============================================================================

function OrderHistorySection() {
  const [selectedItem, setSelectedItem] = useState<typeof mockOrderHistory[0] | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead><tr className="border-b"><th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">주문번호</th><th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">제품</th><th className="text-right py-3 px-4 text-xs font-semibold text-gray-500">수량</th><th className="text-right py-3 px-4 text-xs font-semibold text-gray-500">주문일</th></tr></thead>
        <tbody className="divide-y">{mockOrderHistory.map(item => <tr key={item.id} onClick={() => setSelectedItem(item)} className="hover:bg-gray-50 cursor-pointer"><td className="py-4 px-4 text-sm font-semibold">{item.orderNo}</td><td className="py-4 px-4 text-sm text-gray-600">{item.product}</td><td className="py-4 px-4 text-right text-sm">{item.quantity.toLocaleString()}개</td><td className="py-4 px-4 text-right text-sm text-gray-400">{item.orderDate}</td></tr>)}</tbody>
      </table>
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="주문 히스토리 상세">
        {selectedItem && <div className="space-y-4"><div className="flex justify-between"><h4 className="text-xl font-bold">{selectedItem.orderNo}</h4><StatusBadge label={selectedItem.status} color="green" /></div><div className="grid grid-cols-2 gap-4"><div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">제품</p><p className="font-semibold">{selectedItem.product}</p></div><div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">수량</p><p className="font-semibold">{selectedItem.quantity.toLocaleString()}개</p></div><div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">주문일</p><p className="font-semibold">{selectedItem.orderDate}</p></div><div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">총 금액</p><p className="font-semibold text-[#1a2867]">{selectedItem.totalPrice}</p></div></div></div>}
      </Modal>
    </div>
  );
}

// ============================================================================
// 서류 관리 섹션
// ============================================================================

function DraggableFolder({ folder, index, moveFolder, onOpen, onColorChange }: { folder: FolderItem; index: number; moveFolder: (from: number, to: number) => void; onOpen: () => void; onColorChange: (color: FolderColor) => void }) {
  const [showPicker, setShowPicker] = useState(false);
  const [{ isDragging }, drag] = useDrag({ type: ItemTypes.FOLDER, item: { index }, collect: m => ({ isDragging: m.isDragging() }) });
  const [, drop] = useDrop({ accept: ItemTypes.FOLDER, hover: (item: { index: number }) => { if (item.index !== index) { moveFolder(item.index, index); item.index = index; } } });
  const colorInfo = FOLDER_COLORS.find(c => c.id === folder.color) || FOLDER_COLORS[0];

  return (
    <div ref={node => drag(drop(node))} className={cn('relative p-4 rounded-xl cursor-pointer transition-all text-center group', isDragging ? 'opacity-50' : '', colorInfo.bg, 'hover:shadow-md')}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={e => { e.stopPropagation(); setShowPicker(!showPicker); }} className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-50"><Palette className="w-3 h-3 text-gray-500" /></button>
        {showPicker && (
          <div className="absolute right-0 top-9 bg-white rounded-2xl shadow-2xl p-4 min-w-[200px] border border-gray-100" onClick={e => e.stopPropagation()}>
            <p className="text-xs font-semibold text-gray-700 mb-3">폴더 색상 선택</p>
            <div className="grid grid-cols-4 gap-2">
              {FOLDER_COLORS.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => { onColorChange(c.id); setShowPicker(false); }} 
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110',
                    c.bg,
                    folder.color === c.id ? 'ring-2 ring-[#1a2867] ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'
                  )}
                  title={c.name}
                >
                  {folder.color === c.id && <Check className="w-4 h-4 text-gray-700" />}
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 text-center">선택: {FOLDER_COLORS.find(c => c.id === folder.color)?.name}</p>
            </div>
          </div>
        )}
      </div>
      <div onClick={onOpen}><div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center"><Folder className={cn('w-8 h-8', colorInfo.icon)} /></div><p className="text-xs font-medium text-gray-700 truncate">{folder.name}</p>{folder.children && <p className="text-[10px] text-gray-400 mt-1">{folder.children.length}개</p>}</div>
    </div>
  );
}

function DocumentManagementSection() {
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders);
  const [openFolder, setOpenFolder] = useState<FolderItem | null>(null);

  const moveFolder = (from: number, to: number) => { const n = [...folders]; const [m] = n.splice(from, 1); n.splice(to, 0, m); setFolders(n); };
  const changeColor = (id: string, color: FolderColor) => setFolders(folders.map(f => f.id === id ? { ...f, color } : f));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-gray-500"><Folder className="w-4 h-4" />내 서류함</div><Button variant="outline" size="sm" leftIcon={<FolderPlus className="w-4 h-4" />}>새 폴더</Button></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">{folders.filter(f => f.type === 'folder').map((f, i) => <DraggableFolder key={f.id} folder={f} index={i} moveFolder={moveFolder} onOpen={() => setOpenFolder(f)} onColorChange={c => changeColor(f.id, c)} />)}</div>
      <Modal isOpen={!!openFolder} onClose={() => setOpenFolder(null)} title={openFolder?.name || ''}>
        <div className="space-y-3">{openFolder?.children?.length ? openFolder.children.map(file => <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 group"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><File className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm font-medium">{file.name}</p><p className="text-xs text-gray-400">{file.date}</p></div></div><button className="p-2 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100"><Download className="w-4 h-4 text-[#1a2867]" /></button></div>) : <EmptyState icon={<File className="w-6 h-6" />} title="폴더가 비어있습니다" />}</div>
      </Modal>
    </div>
  );
}

// ============================================================================
// 불량 접수 섹션
// ============================================================================

function DefectReportSection() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof mockDefectReports[0] | null>(null);
  const [newReport, setNewReport] = useState({ title: '', content: '' });
  const [images, setImages] = useState<string[]>([]);
  
  const itemsPerPage = 2;
  const tabs = [{ id: 'all', label: 'ALL' }, { id: 'processing', label: '처리 중' }, { id: 'done', label: '처리 완료' }];
  const filtered = activeTab === 'all' ? mockDefectReports : mockDefectReports.filter(r => r.status === activeTab);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4"><div className="flex-1 overflow-hidden"><Tabs tabs={tabs} activeTab={activeTab} onTabChange={t => { setActiveTab(t); setCurrentPage(1); }} /></div><Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>불량 접수</Button></div>
      <div className="space-y-3">
        {paginated.length === 0 ? <EmptyState icon={<AlertCircle className="w-6 h-6" />} title="불량 접수가 없습니다" /> : paginated.map(r => (
          <div key={r.id} onClick={() => setSelectedItem(r)} className="p-4 bg-red-50/50 border border-red-100 rounded-xl hover:shadow-md cursor-pointer">
            <div className="flex justify-between mb-2"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-500" /></div><div><p className="text-sm font-semibold">{r.title}</p><p className="text-xs text-gray-500">{r.orderNo}</p></div></div><StatusBadge label={r.status === 'done' ? '처리 완료' : '처리 중'} color={r.status === 'done' ? 'green' : 'yellow'} /></div>
            <p className="text-sm text-red-600 mb-2">{r.issue}</p>
            <p className="text-xs text-gray-400">접수일: {r.reportDate}</p>
            {r.resolution && <div className="mt-3 p-3 bg-white rounded-lg text-sm text-emerald-700 border-l-4 border-emerald-500"><span className="font-semibold">처리 결과:</span> {r.resolution}</div>}
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="불량 접수 상세" size="lg">
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex justify-between"><h4 className="text-xl font-bold">{selectedItem.title}</h4><StatusBadge label={selectedItem.status === 'done' ? '처리 완료' : '처리 중'} color={selectedItem.status === 'done' ? 'green' : 'yellow'} /></div>
            <div className="grid grid-cols-2 gap-4"><div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">주문번호</p><p className="font-semibold">{selectedItem.orderNo}</p></div><div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">접수일</p><p className="font-semibold">{selectedItem.reportDate}</p></div></div>
            <div className="p-4 bg-red-50 rounded-xl"><p className="text-xs text-red-600 mb-1">문제 내용</p><p>{selectedItem.issue}</p></div>
            <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">상세 설명</p><p>{selectedItem.description}</p></div>
            {selectedItem.resolution && <div className="p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-500"><p className="text-xs text-emerald-600 mb-1 font-semibold">처리 결과</p><p>{selectedItem.resolution}</p></div>}
          </div>
        )}
      </Modal>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="불량 접수하기">
        <div className="space-y-4">
          <div><label className="text-sm font-semibold">제목 *</label><input value={newReport.title} onChange={e => setNewReport(p => ({ ...p, title: e.target.value }))} className="w-full mt-1 px-4 py-3 text-sm rounded-xl bg-gray-50 border focus:border-[#1a2867] focus:outline-none" placeholder="불량 유형을 입력하세요" /></div>
          <div><label className="text-sm font-semibold">내용 *</label><textarea value={newReport.content} onChange={e => setNewReport(p => ({ ...p, content: e.target.value }))} className="w-full mt-1 px-4 py-3 text-sm rounded-xl bg-gray-50 border focus:border-[#1a2867] focus:outline-none resize-none" rows={4} placeholder="상세 내용을 입력하세요" /></div>
          <div><label className="text-sm font-semibold">사진 첨부</label><input type="file" id="defect-img" multiple accept="image/*" onChange={e => { Array.from(e.target.files || []).forEach(f => { const r = new FileReader(); r.onloadend = () => setImages(p => [...p, r.result as string]); r.readAsDataURL(f); }); }} className="hidden" /><label htmlFor="defect-img" className="flex flex-col items-center gap-2 w-full mt-1 px-4 py-6 rounded-xl bg-gray-50 border-2 border-dashed hover:border-red-300 cursor-pointer"><Camera className="w-8 h-8 text-gray-400" /><p className="text-sm text-gray-500">클릭하여 사진 첨부</p></label></div>
          {images.length > 0 && <div className="grid grid-cols-3 gap-2">{images.map((img, i) => <div key={i} className="relative"><img src={img} className="w-full h-20 object-cover rounded-lg" /><button onClick={() => setImages(p => p.filter((_, j) => j !== i))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"><X className="w-4 h-4" /></button></div>)}</div>}
          <div className="flex gap-3"><Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>취소</Button><Button variant="primary" className="flex-1" onClick={() => { if (!newReport.title || !newReport.content) { alert('모두 입력해주세요.'); return; } alert('불량 접수가 완료되었습니다.'); setShowModal(false); setNewReport({ title: '', content: '' }); setImages([]); }}>접수하기</Button></div>
        </div>
      </Modal>
    </div>
  );
}

// ============================================================================
// 견적 문의 섹션
// ============================================================================

function QuoteInquirySection() {
  const [formData, setFormData] = useState({ productType: '', quantity: 300, deliveryDate: '', width: '', height: '', depth: '', additionalRequest: '' });
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([]);

  return (
    <form onSubmit={e => { e.preventDefault(); alert('견적 문의가 접수되었습니다!'); }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div><label className="text-sm font-semibold">제작 아이템 *</label><select value={formData.productType} onChange={e => setFormData(p => ({ ...p, productType: e.target.value }))} className="w-full mt-1 px-4 py-3 text-sm rounded-xl bg-gray-50 border focus:border-[#1a2867] focus:outline-none" required><option value="">선택하세요</option><option>봉제 인형</option><option>인형 키링</option><option>마스코트 인형</option><option>기타</option></select></div>
          <div><label className="flex justify-between text-sm font-semibold">수량 *<span className="px-3 py-1 bg-[#1a2867]/10 text-[#1a2867] rounded-lg text-sm">{formData.quantity.toLocaleString()}개</span></label><input type="range" min="300" max="100000" step="10" value={formData.quantity} onChange={e => setFormData(p => ({ ...p, quantity: +e.target.value }))} className="w-full mt-2 accent-[#1a2867]" /></div>
          <div><label className="text-sm font-semibold">납기일자</label><input type="date" value={formData.deliveryDate} onChange={e => setFormData(p => ({ ...p, deliveryDate: e.target.value }))} className="w-full mt-1 px-4 py-3 text-sm rounded-xl bg-gray-50 border focus:border-[#1a2867] focus:outline-none" /></div>
          <div><label className="text-sm font-semibold">사이즈 (가로×세로×깊이)</label><div className="grid grid-cols-3 gap-3 mt-1">{(['width', 'height', 'depth'] as const).map(f => <input key={f} value={formData[f]} onChange={e => setFormData(p => ({ ...p, [f]: e.target.value }))} className="px-3 py-3 text-sm rounded-xl bg-gray-50 border text-center focus:border-[#1a2867] focus:outline-none" placeholder={f === 'width' ? '가로' : f === 'height' ? '세로' : '깊이'} />)}</div></div>
          <div><label className="text-sm font-semibold">기타 요청사항</label><textarea value={formData.additionalRequest} onChange={e => setFormData(p => ({ ...p, additionalRequest: e.target.value }))} className="w-full mt-1 px-4 py-3 text-sm rounded-xl bg-gray-50 border focus:border-[#1a2867] focus:outline-none resize-none" rows={4} placeholder="추가 요청사항을 입력하세요" /></div>
        </div>
        <div className="space-y-5">
          <div><label className="text-sm font-semibold">파일 업로드</label><input type="file" id="quote-files" multiple accept="image/*,.pdf" onChange={e => { Array.from(e.target.files || []).forEach(f => { const r = new FileReader(); r.onloadend = () => setFiles(p => [...p, { file: f, preview: r.result as string }]); r.readAsDataURL(f); }); }} className="hidden" /><label htmlFor="quote-files" className="flex flex-col items-center gap-4 w-full mt-1 px-4 py-10 rounded-xl bg-gray-50 border-2 border-dashed hover:border-[#1a2867]/50 cursor-pointer"><div className="w-14 h-14 rounded-2xl bg-[#1a2867]/10 flex items-center justify-center"><Upload className="w-7 h-7 text-[#1a2867]" /></div><div className="text-center"><p className="text-sm font-semibold">클릭하여 파일 선택</p><p className="text-xs text-gray-400 mt-1">이미지, PDF 지원</p></div></label></div>
          {files.length > 0 && <div className="grid grid-cols-2 gap-3">{files.map((f, i) => <div key={i} className="relative group"><img src={f.preview} className="w-full h-28 object-cover rounded-xl border" /><button type="button" onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"><X className="w-4 h-4" /></button><p className="text-xs text-gray-500 mt-2 truncate">{f.file.name}</p></div>)}</div>}
          <AlertBox><p className="font-semibold mb-1">AI 미리보기 안내</p><p className="text-xs">이미지를 업로드하면 AI가 제품 미리보기를 생성해드립니다.</p></AlertBox>
        </div>
      </div>
      <Button type="submit" variant="primary" className="w-full" size="lg" leftIcon={<FileText className="w-5 h-5" />}>견적 문의하기</Button>
    </form>
  );
}

// ============================================================================
// 메인 대시보드
// ============================================================================

export default function Dashboard() {
  const [sections, setSections] = useState<DashboardSection[]>([]);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => { if (!localStorage.getItem('dashboardTourCompleted')) setShowTour(true); }, []);

  useEffect(() => {
    const defaultSections: DashboardSection[] = [
      { id: 'mypage', title: '마이 페이지', icon: <User className="w-5 h-5" />, component: <MyPageSection /> },
      { id: 'one-on-one', title: '1:1 문의', icon: <HelpCircle className="w-5 h-5" />, component: <OneOnOneSection /> },
      { id: 'quote-management', title: '견적 관리', icon: <FileText className="w-5 h-5" />, component: <QuoteManagementSection /> },
      { id: 'order-management', title: '주문 관리', icon: <Package className="w-5 h-5" />, component: <OrderManagementSection /> },
      { id: 'order-history', title: '오더 히스토리', icon: <Clock className="w-5 h-5" />, component: <OrderHistorySection /> },
      { id: 'defect-report', title: '불량 접수', icon: <AlertCircle className="w-5 h-5" />, component: <DefectReportSection /> },
      { id: 'document-management', title: '서류 관리', icon: <FileCheck className="w-5 h-5" />, component: <DocumentManagementSection /> },
      { id: 'quote-inquiry', title: '견적 문의', icon: <MessageCircle className="w-5 h-5" />, component: <QuoteInquirySection /> }
    ];
    const saved = localStorage.getItem('dashboardOrder');
    if (saved) { try { const ids = JSON.parse(saved); setSections(ids.map((id: string) => defaultSections.find(s => s.id === id)).filter(Boolean)); } catch { setSections(defaultSections); } } else setSections(defaultSections);
  }, []);

  const moveCard = (from: number, to: number) => { const n = [...sections]; const [m] = n.splice(from, 1); n.splice(to, 0, m); setSections(n); localStorage.setItem('dashboardOrder', JSON.stringify(n.map(s => s.id))); };
  const resetLayout = () => { localStorage.removeItem('dashboardOrder'); localStorage.removeItem('dashboardTourCompleted'); window.location.reload(); };
  const completeTour = () => { 
    localStorage.setItem('dashboardTourCompleted', 'true'); 
    setShowTour(false); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const isWide = (id: string) => ['quote-management', 'order-management', 'document-management', 'quote-inquiry'].includes(id);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* 헤더 */}
        <div id="tour-header" className="bg-white/90 backdrop-blur-md border-b border-gray-100 py-8 px-6 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div><h1 className="text-3xl font-bold text-gray-900 mb-1">대시보드</h1><p className="text-gray-500">견적 및 주문 현황을 한눈에 확인하세요</p></div>
            <div id="tour-complete" className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setShowTour(true)} leftIcon={<Sparkles className="w-4 h-4" />}>가이드 보기</Button>
              <Button variant="secondary" onClick={resetLayout}>레이아웃 초기화</Button>
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <AlertBox><div className="flex items-center gap-2"><GripVertical className="w-4 h-4" /><div><strong>섹션의 헤더를 드래그하여 순서를 변경하세요</strong><span className="text-xs ml-2 opacity-80"></span></div></div></AlertBox>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">{sections.map((s, i) => <div key={s.id} className={cn(isWide(s.id) ? 'lg:col-span-2' : '')}><DraggableSectionCard section={s} index={i} moveCard={moveCard} /></div>)}</div>
        </div>

        {/* 투어 */}
        {showTour && <DashboardTour onComplete={completeTour} />}
      </div>
    </DndProvider>
  );
}