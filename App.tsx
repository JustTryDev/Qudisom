import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { SignupCarousel } from './components/SignupCarousel';
import { SignupForm } from './components/SignupForm';
import { LoginForm } from './components/LoginForm';
import { ShippingDesignInfoPage } from './components/ShippingDesignInfoPage';
import Dashboard from './Dashboard';
import Quote from './Quote';
import Payment from './Payment';
import AdditionalInfo from './AdditionalInfo';
import EContract from './EContract';
import NewQuoteForm from './new-file';
import AboutUs from './AboutUs';
import AutoQuoteCalculator from './AutoQuoteCalculator';
import QuoteRequest from './QuoteRequest';
import OrderProcess from './OrderProcess';
import ProductionProcess from './ProductionProcess';
import ProductionExamples from './ProductionExamples';
import FAQ from './FAQ';
import ResourceCenter from './ResourceCenter';
import Notice from './Notice';
import NoticeDetail from './NoticeDetail';
import GoodsStore from './GoodsStore';
import MainHeroSection from './MainHeroSection';
import TransactionStatement from './TransactionStatement';
import WorkOrder from './WorkOrder';
import DefectReport from './DefectReport';
import ShippingOrder from './ShippingOrder';
import QuickDeliveryBooking from './QuickDeliveryBooking';
import InventoryStatus from './InventoryStatus';
import ElectronicContract from './ElectronicContract';
import QuoteRequestPage from './QuoteRequestPage';
import { Home, LogIn, UserPlus, FileText, Menu, X, LayoutDashboard, Receipt, Truck, CreditCard, FileSignature, ChevronDown, Info, Calculator, ClipboardList, Package, Wrench, ImageIcon, HelpCircle, FolderOpen, Bell, Store, ClipboardCheck, AlertTriangle, PackageX, Zap, FileEdit } from 'lucide-react';

// 네비게이션 바 컴포넌트 (Navigation Bar Component)
function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNewQuoteModalOpen, setIsNewQuoteModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHyunseoDropdownOpen, setIsHyunseoDropdownOpen] = useState(false);
  const [isFinishedDropdownOpen, setIsFinishedDropdownOpen] = useState(false);
  const [isHabibDropdownOpen, setIsHabibDropdownOpen] = useState(false);
  const [isFinalFinishedDropdownOpen, setIsFinalFinishedDropdownOpen] = useState(false);

  const currentPath = location.pathname;

  // Working(Hyunseo) 메뉴 경로 리스트
  const hyunseoPages = [
    '/dashboard', '/auto-quote', '/quote-request', 
    '/payment',
    '/goods-store', 
    '/transaction-statement', '/work-order', '/defect-report', 
    '/shipping-order', '/quick-delivery', '/inventory-status', 
    '/quote-request-page'
  ];

  // Finished 메뉴 경로 리스트
  const finishedPages = ['/quote', '/additional-info', '/econtract', '/shipping-design', '/order-process', '/production-process', '/production-examples', '/notice', '/faq', '/resource-center'];

  // Working(Habib) 메뉴 경로 리스트
  const habibPages = ['/new-file', '/about'];

  // Final Finished 메뉴 경로 리스트 (Final Finished menu path list)
  const finalFinishedPages = ['/login', '/signup'];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            {/* Desktop Menu - 중앙 정렬 (Center aligned) */}
            <div className="hidden md:flex items-center gap-1">
              {/* Home */}
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-2 ${
                  currentPath === '/'
                    ? 'bg-foreground text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>

              {/* Working(Hyunseo) Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsHyunseoDropdownOpen(true)}
                onMouseLeave={() => setIsHyunseoDropdownOpen(false)}
              >
                <button
                  className={`px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-2 ${
                    hyunseoPages.includes(currentPath)
                      ? 'bg-foreground text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  Working(Hyunseo)
                  <ChevronDown className={`w-4 h-4 transition-transform ${isHyunseoDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 호버 영역 확장을 위한 투명한 브릿지 (Transparent bridge for hover area) */}
                {isHyunseoDropdownOpen && (
                  <div className="absolute top-full left-0 w-full h-2" />
                )}

                {isHyunseoDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[680px] bg-white border border-border rounded-xl shadow-lg p-4 z-50">
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/dashboard' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">대시보드</span>
                      </Link>
                      <Link
                        to="/transaction-statement"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/transaction-statement' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Receipt className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">거래명세서</span>
                      </Link>
                      <Link
                        to="/payment"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/payment' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">결제 수단 선택</span>
                      </Link>
                      <Link
                        to="/goods-store"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/goods-store' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Store className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">굿즈 스토어</span>
                      </Link>
                      <Link
                        to="/auto-quote"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/auto-quote' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Calculator className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">자동 견적 산출기</span>
                      </Link>
                      <Link
                        to="/quote-request"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/quote-request' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <ClipboardList className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">견적 요청</span>
                      </Link>
                      <Link
                        to="/work-order"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/work-order' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <FileEdit className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">작업 지시서</span>
                      </Link>
                      <Link
                        to="/defect-report"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/defect-report' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">결함 보고서</span>
                      </Link>
                      <Link
                        to="/shipping-order"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/shipping-order' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <PackageX className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">출하 지시서</span>
                      </Link>
                      <Link
                        to="/quick-delivery"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/quick-delivery' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Zap className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">급속 배송 예약</span>
                      </Link>
                      <Link
                        to="/inventory-status"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/inventory-status' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <ClipboardCheck className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">재고 현황</span>
                      </Link>
                      <Link
                        to="/electronic-contract"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/electronic-contract' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <FileSignature className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">전자 계약</span>
                      </Link>
                      <Link
                        to="/quote-request-page"
                        onClick={() => setIsHyunseoDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/quote-request-page' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">견적 요청서(페이지)</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Finished Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsFinishedDropdownOpen(true)}
                onMouseLeave={() => setIsFinishedDropdownOpen(false)}
              >
                <button
                  className={`px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-2 ${
                    finishedPages.includes(currentPath)
                      ? 'bg-foreground text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  Finished
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFinishedDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 호버 영역 확장을 위한 투명한 브릿지 (Transparent bridge for hover area) */}
                {isFinishedDropdownOpen && (
                  <div className="absolute top-full left-0 w-full h-2" />
                )}

                {isFinishedDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[520px] bg-white border border-border rounded-xl shadow-lg p-4 z-50">
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        to="/quote"
                        onClick={() => setIsFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/quote' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Receipt className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">견적서 양식</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsNewQuoteModalOpen(true);
                          setIsFinishedDropdownOpen(false);
                        }}
                        className="px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 text-muted-foreground"
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">견적 요청 양식</span>
                      </button>
                      <Link
                        to="/additional-info"
                        onClick={() => setIsFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/additional-info' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">결제 정보 입력</span>
                      </Link>
                      <Link
                        to="/econtract"
                        onClick={() => setIsFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/econtract' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <FileSignature className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">전자 계약 정보 입력</span>
                      </Link>
                      <Link
                        to="/shipping-design"
                        onClick={() => setIsFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/shipping-design' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Truck className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">배송 정보 입력</span>
                      </Link>
                      <Link
                        to="/order-process"
                        onClick={() => setIsFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/order-process' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Package className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">주문 과정</span>
                      </Link>
                      <Link
                        to="/production-process"
                        onClick={() => setIsFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/production-process' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Wrench className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">제작 과정</span>
                      </Link>
                      <Link
                        to="/production-examples"
                        onClick={() => setIsFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/production-examples' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <ImageIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">제작 사례</span>
                      </Link>
                      <Link
                        to="/notice"
                        onClick={() => setIsFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/notice' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Bell className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">공지사항</span>
                      </Link>
                      <Link
                        to="/faq"
                        onClick={() => setIsFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/faq' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">자주 묻는 질문</span>
                      </Link>
                      <Link
                        to="/resource-center"
                        onClick={() => setIsFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/resource-center' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <FolderOpen className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">자료실</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Working(Habib) Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsHabibDropdownOpen(true)}
                onMouseLeave={() => setIsHabibDropdownOpen(false)}
              >
                <button
                  className={`px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-2 ${
                    habibPages.includes(currentPath)
                      ? 'bg-foreground text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  Working(Habib)
                  <ChevronDown className={`w-4 h-4 transition-transform ${isHabibDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 호버 영역 확장을 위한 투명한 브릿지 (Transparent bridge for hover area) */}
                {isHabibDropdownOpen && (
                  <div className="absolute top-full left-0 w-full h-2" />
                )}

                {isHabibDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[400px] bg-white border border-border rounded-xl shadow-lg p-4 z-50">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/new-file"
                        onClick={() => setIsHabibDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/new-file' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">견적 요청서</span>
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setIsHabibDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/about' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <Info className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">About Us</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Final Finished Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsFinalFinishedDropdownOpen(true)}
                onMouseLeave={() => setIsFinalFinishedDropdownOpen(false)}
              >
                <button
                  className={`px-4 py-2 rounded-xl transition-all font-semibold flex items-center gap-2 ${
                    finalFinishedPages.includes(currentPath)
                      ? 'bg-foreground text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  Final Finished
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFinalFinishedDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 호버 영역 확장을 위한 투명한 브릿지 (Transparent bridge for hover area) */}
                {isFinalFinishedDropdownOpen && (
                  <div className="absolute top-full left-0 w-full h-2" />
                )}

                {isFinalFinishedDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-[300px] bg-white border border-border rounded-xl shadow-lg p-4 z-50">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/login"
                        onClick={() => setIsFinalFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/login' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <LogIn className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">로그인 페이지</span>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsFinalFinishedDropdownOpen(false)}
                        className={`px-4 py-2.5 rounded-lg text-left transition-all font-medium hover:bg-muted flex items-center gap-3 ${
                          currentPath === '/signup' ? 'bg-muted text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        <UserPlus className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">회원가입 페이지</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors absolute right-6"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full block px-4 py-3 rounded-xl transition-all font-semibold text-left ${
                  currentPath === '/'
                    ? 'bg-foreground text-white'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                Home
              </Link>
              
              <div className="text-xs px-4 py-2 text-muted-foreground font-semibold">Working(Hyunseo)</div>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/dashboard' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>대시보드</Link>
              <Link to="/transaction-statement" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/transaction-statement' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>거래명세서</Link>
              <Link to="/payment" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/payment' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>결제 수단 선택</Link>
              <Link to="/goods-store" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/goods-store' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>굿즈 스토어</Link>
              <Link to="/auto-quote" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/auto-quote' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>자동 견적 산출기</Link>
              <Link to="/quote-request" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/quote-request' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>견적 요청</Link>
              <Link to="/work-order" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/work-order' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>작업 지시서</Link>
              <Link to="/defect-report" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/defect-report' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>결함 보고서</Link>
              <Link to="/shipping-order" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/shipping-order' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>출하 지시서</Link>
              <Link to="/quick-delivery" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/quick-delivery' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>급속 배송 예약</Link>
              <Link to="/inventory-status" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/inventory-status' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>재고 현황</Link>
              <Link to="/electronic-contract" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/electronic-contract' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>전자 계약</Link>
              <Link to="/quote-request-page" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/quote-request-page' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>견적 요청서(페이지)</Link>

              <div className="text-xs px-4 py-2 text-muted-foreground font-semibold">Finished</div>
              <Link to="/quote" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/quote' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>견적서</Link>
              <button onClick={() => { setIsNewQuoteModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full px-6 py-3 rounded-xl transition-all font-semibold text-left text-muted-foreground">새 견적폼</button>
              <Link to="/additional-info" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/additional-info' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>결제 정보 입력</Link>
              <Link to="/econtract" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/econtract' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>전자계약</Link>
              <Link to="/shipping-design" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/shipping-design' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>배송·설계정보</Link>
              <Link to="/order-process" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/order-process' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>주문 과정</Link>
              <Link to="/production-process" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/production-process' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>제작 과정</Link>
              <Link to="/production-examples" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/production-examples' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>제작 사례</Link>
              <Link to="/notice" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/notice' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>공지사항</Link>
              <Link to="/faq" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/faq' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>자주 묻는 질문</Link>
              <Link to="/resource-center" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/resource-center' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>자료실</Link>

              <div className="text-xs px-4 py-2 text-muted-foreground font-semibold">Working(Habib)</div>
              <Link to="/new-file" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/new-file' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>견적 요청서</Link>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/about' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>About Us</Link>

              <div className="text-xs px-4 py-2 text-muted-foreground font-semibold">Final Finished</div>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/login' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>로그인 페이지</Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className={`w-full block px-6 py-3 rounded-xl transition-all font-semibold text-left ${currentPath === '/signup' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>회원가입 페이지</Link>
            </div>
          )}
        </div>
      </nav>

      {/* 견적 요청 모달 (Quote Request Modal) */}
      {isNewQuoteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">견적 요청서</h2>
              <button
                onClick={() => setIsNewQuoteModalOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <NewQuoteForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <NavigationBar />
        
        {/* Main Content - with padding to account for fixed navbar */}
        <div className="pt-16">
          <Routes>
            {/* Home */}
            <Route path="/" element={<MainHeroSection />} />
            
            {/* Working(Hyunseo) Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transaction-statement" element={<TransactionStatement />} />
            <Route path="/production-examples" element={<ProductionExamples />} />
            <Route path="/goods-store" element={<GoodsStore />} />
            <Route path="/auto-quote" element={<AutoQuoteCalculator />} />
            <Route path="/quote-request" element={<QuoteRequest />} />
            <Route path="/work-order" element={<WorkOrder />} />
            <Route path="/defect-report" element={<DefectReport />} />
            <Route path="/shipping-order" element={<ShippingOrder />} />
            <Route path="/quick-delivery" element={<QuickDeliveryBooking />} />
            <Route path="/inventory-status" element={<InventoryStatus />} />
            <Route path="/electronic-contract" element={<ElectronicContract />} />
            <Route path="/quote-request-page" element={<QuoteRequestPage />} />
            
            {/* Finished Routes */}
            <Route path="/quote" element={<Quote onNavigate={(page) => window.location.href = `/${page}`} />} />
            <Route path="/payment" element={<Payment onNavigate={(page) => window.location.href = `/${page}`} />} />
            <Route path="/additional-info" element={<AdditionalInfo />} />
            <Route path="/econtract" element={<EContract onNavigate={(page) => window.location.href = `/${page}`} />} />
            <Route path="/shipping-design" element={<ShippingDesignInfoPage onBack={() => window.location.href = '/dashboard'} />} />
            <Route path="/order-process" element={<OrderProcess />} />
            <Route path="/production-process" element={<ProductionProcess />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/notice/:id" element={<NoticeDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/resource-center" element={<ResourceCenter />} />
            
            {/* Working(Habib) Routes */}
            <Route path="/new-file" element={<NewQuoteForm />} />
            <Route path="/about" element={<AboutUs />} />
            
            {/* Final Finished Routes */}
            <Route path="/login" element={
              <div className="flex min-h-[calc(100vh-4rem)]">
                <SignupCarousel />
                <LoginForm />
              </div>
            } />
            <Route path="/signup" element={
              <div className="flex min-h-[calc(100vh-4rem)]">
                <SignupCarousel />
                <SignupForm />
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}