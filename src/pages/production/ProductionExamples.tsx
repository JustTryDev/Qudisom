import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, SlidersHorizontal, Lock } from 'lucide-react';

// ========== 브랜드 컬러 정의 (Brand Color Definition) ==========
const BRAND_COLORS = {
  primary: "#ffd93d", // 메인 컬러 (Main Color - Yellow)
  secondary: "#1a2867", // 서브 컬러 (Sub Color - Navy)
  text: {
    primary: "#191F28", // 기본 텍스트 (Primary Text)
    secondary: "#4E5968", // 보조 텍스트 (Secondary Text)
    tertiary: "#8B95A1", // 삼차 텍스트 (Tertiary Text)
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    tertiary: "#F2F4F6",
  },
  border: "#E5E8EB",
};

// ========== 제작 사례 페이지 (Production Examples Page) ==========
export default function ProductionExamples() {
  const [selectedCategory, setSelectedCategory] = useState("전체"); // 선택된 카테고리 (Selected Category)
  const [selectedIndustry, setSelectedIndustry] = useState<string[]>(["전체"]); // 선택된 업종들 (Selected Industries)
  const [selectedPurpose, setSelectedPurpose] = useState<string[]>(["전체"]); // 선택된 용도들 (Selected Purposes)
  const [displayCount, setDisplayCount] = useState(12); // 표시할 아이템 수 (Number of items to display)
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 (Loading state)
  const [selectedItem, setSelectedItem] = useState<any>(null); // 선택된 아이템 (Selected item for modal)
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 (Search query)
  const [isSearchOpen, setIsSearchOpen] = useState(false); // 검색창 열림 상태 (Search bar open state)
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스 (Current image index for slider)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true); // 자동 재생 상태 (Auto-play state)
  const [isIndustryOpen, setIsIndustryOpen] = useState(true); // 업종 필터 열림 상태 (Industry filter open state)
  const [isPurposeOpen, setIsPurposeOpen] = useState(true); // 용도 필터 열림 상태 (Purpose filter open state)
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 (Mobile detection)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // 필터 모달 열림 상태 (Filter modal open state)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // 검색 모달 열림 상태 (Search modal open state)
  const [activeFilterTab, setActiveFilterTab] = useState<"industry" | "purpose">("industry"); // 필터 탭 상태 (Filter tab state)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null); // 확대된 이미지 (Enlarged image)

  // 제작 사례 데이터 생성 함수 (Generate production examples data)
  const allExamples = useMemo(() => {
    const categories = ["봉제 인형", "인형 키링", "쿠션", "슬리퍼", "가방", "목베개", "허리 쿠션", "방석", "기타"];
    const industries = [
      "공공기관 ᛫ 관공서",
      "단체 ᛫ 협회", 
      "학교 ᛫ 학원 ᛫ 교육",
      "보험 ᛫ 금융 기관",
      "일반 기업",
      "대기업"
    ];
    const purposes = [
      "증정용",
      "판매용",
      "행사 ᛫ 이벤트",
      "마케팅 ᛫ 홍보",
      "브랜딩",
      "회사 사내용",
      "VIP 선물"
    ];
    const images = [
      "https://images.unsplash.com/photo-1669212409006-4684413000aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVzaCUyMHRveSUyMGRvbGx8ZW58MXx8fHwxNzY2MDg0NDc4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1718818316580-ab6fc6114389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVmZmVkJTIwYW5pbWFsJTIwY2hhcmFjdGVyfGVufDF8fHx8MTc2NjA4NDQ3OXww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1671043119167-d1b8f88a88c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwcGx1c2glMjB0b3l8ZW58MXx8fHwxNzY2MDg0NDc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1762924250446-e86b225fb81f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0JTIwdG95JTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NjYwODQ0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1652379546952-a5e71b6c8e3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGRvbGx8ZW58MXx8fHwxNzY2MDg0NDgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1553315164-49bb0615e0c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBwbHVzaHxlbnwxfHx8fDE3NjYwODQ0ODB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ];

    const titles = {
      "봉제 인형": [
        "캐릭터 인형 시리즈", "동물 인형 컬렉션", "프리미엄 인형", "커스텀 마스코트",
        "미니 플러시 세트", "대형 봉제인형", "특별 에디션", "한정판 인형",
        "수제 인형", "브랜드 마스코트", "이벤트 인형", "기념품 인형",
        "인기 캐릭터 인형", "애니메이션 굿즈", "동화 인형", "스포츠 마스코트",
        "기업 캐릭터", "학교 마스코트", "시리즈 콜렉션", "시즌 한정"
      ],
      "인형 키링": [
        "미니 키링 세트", "브랜드 키링", "캐릭터 키링", "한정판 키링",
        "이벤트 키링", "콜라보 키링", "기념 키링", "프리미엄 키링",
        "미니 플러시 키링", "동물 키링", "마스코트 키링", "커스텀 키링",
        "시리즈 키링", "인기 키링", "베스트 키링", "신상 키링",
        "특별 키링", "한정 키링", "콜렉션 키링", "에디션 키링"
      ],
      "쿠션": [
        "캐릭터 쿠션", "프리미엄 쿠션", "커스텀 쿠션", "이벤트 쿠션",
        "브랜드 쿠션", "마스코트 쿠션", "특별 에디션 쿠션", "한정판 쿠션",
        "인테리어 쿠션", "기념품 쿠션", "홈데코 쿠션", "선물용 쿠션",
        "시리즈 쿠션", "콜라보 쿠션", "인기 쿠션", "베스트 쿠션",
        "대형 쿠션", "미니 쿠션", "스페셜 쿠션", "럭셔리 쿠션"
      ],
      "슬리퍼": [
        "캐릭터 슬리퍼", "봉제 슬리퍼", "커스텀 슬리퍼", "이벤트 슬리퍼",
        "브랜드 슬리퍼", "마스코트 슬리퍼", "특별 에디션 슬리퍼", "한정판 슬리퍼",
        "실내용 슬리퍼", "기념품 슬리퍼", "프리미엄 슬리퍼", "선물용 슬리퍼",
        "겨울 슬리퍼", "여름 슬리퍼", "인기 슬리퍼", "베스트 슬리퍼",
        "아동용 슬리퍼", "성인용 슬리퍼", "스페셜 슬리퍼", "럭셔리 슬리퍼"
      ],
      "가방": [
        "캐릭터 에코백", "토트백", "크로스백", "이벤트 가방",
        "브랜드 가방", "마스코트 가방", "특별 에디션 가방", "한정판 가방",
        "숄더백", "기념품 가방", "프리미엄 가방", "선물용 가방",
        "커스텀 가방", "콜라보 가방", "인기 가방", "베스트 가방",
        "미니 가방", "대형 가방", "스페셜 가방", "럭셔리 가방"
      ],
      "목베개": [
        "캐릭터 목베개", "프리미엄 목베개", "커스텀 목베개", "이벤트 목베개",
        "브랜드 목베개", "마스코트 목베개", "특별 에디션 목베개", "한정판 목베개",
        "여행용 목베개", "기념품 목베개", "차량용 목베개", "선물용 목베개",
        "메모리폼 목베개", "봉제 목베개", "인기 목베개", "베스트 목베개",
        "휴대용 목베개", "오피스 목베개", "스페셜 목베개", "럭셔리 목베개"
      ],
      "허리 쿠션": [
        "캐릭터 허리쿠션", "프리미엄 허리쿠션", "커스텀 허리쿠션", "이벤트 허리쿠션",
        "브랜드 허리쿠션", "마스코트 허리쿠션", "특별 에디션 허리쿠션", "한정판 허리쿠션",
        "오피스 허리쿠션", "기념품 허리쿠션", "차량용 허리쿠션", "선물용 허리쿠션",
        "메모리폼 허리쿠션", "봉제 허리쿠션", "인기 허리쿠션", "베스트 허리쿠션",
        "인체공학 허리쿠션", "의자 허리쿠션", "스페셜 허리쿠션", "럭셔리 허리쿠션"
      ],
      "방석": [
        "캐릭터 방석", "프리미엄 방석", "커스텀 방석", "이벤트 방석",
        "브랜드 방석", "마스코트 방석", "특별 에디션 방석", "한정판 방석",
        "원형 방석", "기념품 방석", "의자 방석", "선물용 방석",
        "두꺼운 방석", "얇은 방석", "인기 방석", "베스트 방석",
        "대형 방석", "미니 방석", "스페셜 방석", "럭셔리 방석"
      ],
      "기타": [
        "핸드메이드 특별판", "이벤트 굿즈", "커스텀 제작", "특별 주문",
        "맞춤 제작", "기념품", "선물용", "프로모션 굿즈",
        "한정 제작", "특별 주문품", "오리지널 디자인", "수제 제작",
        "기업 선물", "이벤트 상품", "프로모션 제품", "마케팅 굿즈",
        "브랜딩 제품", "기념일 선물", "특별 패키지", "한정 수량"
      ]
    };

    const clients = [
      "A 엔터테인먼트", "B 출판사", "C 브랜드", "D 기업", "E 작가",
      "F 대학교", "G 카페", "H 이벤트", "I 회사", "J 스튜디오",
      "K 브랜드", "L 기업", "M 쇼핑몰", "N 출판사", "O 엔터",
      "P 대학", "Q 기관", "R 재단", "S 협회", "T 그룹",
      "U 컴퍼니", "V 스토어", "W 마켓", "X 플랫폼", "Y 파트너스",
      "Z 솔루션", "AA 크리에이티브", "BB 디자인"
    ];

    const descriptions = [
      "고품질 소재로 제작된 프리미엄 인형",
      "부드러운 촉감과 세밀한 디테일",
      "브랜드 정체성을 담은 커스텀 디자인",
      "친환경 소재로 제작한 안전한 인형",
      "트렌디한 디자인의 인기 상품",
      "정교한 수작업으로 완성된 특별한 인형",
      "이벤트 및 프로모션용 굿즈",
      "기념품으로 완벽한 퀄리티",
      "대량 생산에도 일정한 품질 유지",
      "고객 만족도 높은 베스트셀러",
      "독창적인 캐릭터 디자인 적용",
      "마케팅 효과 극대화한 제품",
      "세련된 패키징으로 완성",
      "빠른 납기와 합리적인 가격",
      "디테일한 재현도가 뛰어난 제작",
      "다양한 사이즈 옵션 제공",
      "내구성 높은 고급 소재 사용",
      "감성적인 디자인으로 인기 만점",
      "실용성과 디자인 모두 만족",
      "특별한 날을 위한 맞춤 제작"
    ];

    const productionDates = [
      "2024년 12월", "2024년 11월", "2024년 10월", "2024년 9월",
      "2024년 8월", "2024년 7월", "2024년 6월", "2024년 5월",
      "2024년 4월", "2024년 3월", "2024년 2월", "2024년 1월"
    ];

    const examples = [];
    let id = 1;

    // 각 카테고리별로 28개씩 생성 (Generate 28 items per category)
    categories.forEach((category, catIndex) => {
      for (let i = 0; i < 28; i++) {
        const imageCount = Math.floor(Math.random() * 5) + 1; // 1-5개의 이미지
        const isBlurred = Math.random() < 0.15; // 15% 확률로 블러 처리
        const selectedImages = [];
        
        // 랜덤으로 이미지 선택
        for (let j = 0; j < imageCount; j++) {
          selectedImages.push(images[Math.floor(Math.random() * images.length)]);
        }

        examples.push({
          id: id++,
          images: selectedImages,
          imageCount: imageCount,
          title: titles[category][i],
          client: clients[Math.floor(Math.random() * clients.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          productionDate: productionDates[Math.floor(Math.random() * productionDates.length)],
          category: category,
          industry: industries[Math.floor(Math.random() * industries.length)],
          purpose: purposes[Math.floor(Math.random() * purposes.length)],
          isBlurred: isBlurred
        });
      }
    });

    return examples;
  }, []);

  // 카테고리 목록 (Category List)
  const categoryList = ["전체", "봉제 인형", "인형 키링", "쿠션", "슬리퍼", "가방", "목베개", "허리 쿠션", "방석", "기타"];
  
  // 업종 목록 (Industry List)
  const industryList = ["전체", "공공기관 ᛫ 관공서", "단체 ᛫ 협회", "학교 ᛫ 학원 ᛫ 교육", "보험 ᛫ 금융 기관", "IP ᛫ 캐릭터", "교회 ᛫ 종교", "스포츠 ᛫ 레저", "패션 ᛫ 뷰티", "프렌차이즈", "라이프 스타일", "연예 기획사", "일반 기업", "대기업", "제조업", "건설업", "기타"];

  // 용도 목록 (Purpose List)
  const purposeList = ["전체", "행사 ᛫ 이벤트", "마케팅 ᛫ 홍보", "브랜딩", "증정용", "판매용", "회사 사내용", "VIP 선물", "기타"];

  // 필터링된 아이템 (Filtered Items)
  const filteredExamples = allExamples.filter(item => {
    // 카테고리 필터링 (Category filtering)
    const categoryMatch = selectedCategory === "전체" || item.category === selectedCategory;
    // 업종 필터링 (Industry filtering)
    const industryMatch = selectedIndustry.includes("전체") || selectedIndustry.includes(item.industry);
    // 용도 필터링 (Purpose filtering)
    const purposeMatch = selectedPurpose.includes("전체") || selectedPurpose.includes(item.purpose);
    return categoryMatch && industryMatch && purposeMatch;
  });

  // 검색 필터링 (Search filtering)
  const searchFilteredExamples = searchQuery
    ? filteredExamples.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.client && item.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredExamples;

  // 현재 표시할 아이템 (Currently displayed items)
  const displayedItems = searchFilteredExamples.slice(0, displayCount);

  // 무한 스크롤 핸들러 (Infinite scroll handler)
  const handleScroll = useCallback(() => {
    if (isLoading || displayCount >= filteredExamples.length) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // 페이지 하단 200px 전에 도달하면 로딩 (Load when 200px from bottom)
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      setIsLoading(true);
      
      // 0.5초 후 12개 더 로드 (Load 12 more items after 0.5s)
      setTimeout(() => {
        setDisplayCount(prev => prev + 12);
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading, displayCount, filteredExamples.length]);

  // 스크롤 이벤트 리스너 등록 (Register scroll event listener)
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 모바일 감지 (Mobile detection)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 카테고리 변경 시 표시 개수 초기화 (Reset display count on category change)
  useEffect(() => {
    setDisplayCount(12);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, selectedIndustry, selectedPurpose]);

  // 자동 슬라이드 기능 (Auto-slide functionality)
  useEffect(() => {
    if (!selectedItem || !isAutoPlaying || selectedItem.imageCount <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        // 2개씩 넘기되, 마지막에 도달하면 처음으로 돌아가기 (Move by 2, return to start at end)
        const next = prev + 1;
        return next >= selectedItem.images.length ? 0 : next;
      });
    }, 3000); // 3초마다 자동 전환 (Auto-switch every 3 seconds)

    return () => clearInterval(interval);
  }, [selectedItem, isAutoPlaying]);

  // 필터 초기화 함수 (Reset filters function)
  const resetFilters = () => {
    setSelectedIndustry(["전체"]);
    setSelectedPurpose(["전체"]);
    setDisplayCount(12);
  };

  return (
    <div style={{ backgroundColor: BRAND_COLORS.background.secondary, minHeight: "100vh", paddingTop: "80px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1480px", margin: "0 auto", padding: "0 24px" }}>
        {/* 헤더 (Header) */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "100px",
              backgroundColor: "#fff8e0",
              marginBottom: "16px",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: BRAND_COLORS.primary }} />
            <span style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.secondary, letterSpacing: "-0.02em" }}>Production Examples</span>
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "16px", letterSpacing: "-0.02em" }}>제작 사례</h1>
          <p style={{ fontSize: "18px", color: BRAND_COLORS.text.secondary, lineHeight: 1.6 }}>
            다양한 기업과 브랜드가 선택한 퀄리티를 확인하세요
          </p>
        </div>

        {/* 카테고리 탭 (Category Tabs) */}
        <div 
          style={{ 
            position: "sticky",
            top: "64px",
            zIndex: 10,
            display: "flex", 
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "48px",
            paddingTop: "12px",
            paddingBottom: "12px",
          }}
          className="category-tabs-sticky"
        >
          {/* 카테고리 버튼 (Category Buttons) */}
          <div
            style={{
              display: "inline-flex",
              gap: "8px",
              padding: "6px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            {categoryList.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: selectedCategory === category ? BRAND_COLORS.secondary : "transparent",
                  color: selectedCategory === category ? "white" : BRAND_COLORS.text.secondary,
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 검색 버튼 (Search Button) - 데스크톱만 표시 */}
          {!isMobile && (
            <button
              onClick={() => setIsSearchOpen(true)}
              style={{
                position: "absolute",
                right: "24px",
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: "white",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              <Search style={{ width: "20px", height: "20px", color: BRAND_COLORS.secondary }} />
            </button>
          )}
        </div>

        {/* 모바일 필터 & 검색 버튼 (Mobile Filter & Search Buttons) */}
        {isMobile && (
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px", padding: "0 4px" }}>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px",
                borderRadius: "12px",
                border: `1px solid ${BRAND_COLORS.border}`,
                backgroundColor: "white",
                fontSize: "14px",
                fontWeight: 600,
                color: BRAND_COLORS.text.primary,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <SlidersHorizontal style={{ width: "18px", height: "18px" }} />
              필터
              {(!selectedIndustry.includes("전체") || !selectedPurpose.includes("전체")) && (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "20px",
                  height: "20px",
                  padding: "0 6px",
                  borderRadius: "10px",
                  backgroundColor: BRAND_COLORS.primary,
                  color: BRAND_COLORS.secondary,
                  fontSize: "11px",
                  fontWeight: 700,
                }}>
                  {selectedIndustry.filter(i => i !== "전체").length + selectedPurpose.filter(p => p !== "전체").length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsSearchModalOpen(true)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px",
                borderRadius: "12px",
                border: `1px solid ${BRAND_COLORS.border}`,
                backgroundColor: "white",
                fontSize: "14px",
                fontWeight: 600,
                color: BRAND_COLORS.text.primary,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <Search style={{ width: "18px", height: "18px" }} />
              검색
            </button>
          </div>
        )}

        {/* 메인 컨텐츠 영역: 좌측 필터 + 우측 그리드 (Main Content: Left Filter + Right Grid) */}
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          {/* 좌측 필터 패널 (Left Filter Panel) - 데스크톱만 표시 */}
          {!isMobile && (
          <div
            style={{
              width: "280px",
              flexShrink: 0,
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              position: "sticky",
              top: "140px",
              maxHeight: "calc(100vh - 160px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* 필터 헤더 (Filter Header) */}
            <div style={{ padding: "24px 24px 0 24px", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: BRAND_COLORS.text.primary, margin: 0 }}>
                  필터
                </h3>
                {(!selectedIndustry.includes("전체") || !selectedPurpose.includes("전체")) && (
                  <button
                    onClick={resetFilters}
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: BRAND_COLORS.secondary,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    초기화
                  </button>
                )}
              </div>

              {/* 선택된 필터 표시 (Selected Filters Display) */}
              {(!selectedIndustry.includes("전체") || !selectedPurpose.includes("전체")) && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedIndustry.filter(i => i !== "전체").map((industry) => (
                      <div
                        key={industry}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(26, 40, 103, 0.08)",
                          border: `1px solid ${BRAND_COLORS.secondary}`,
                          fontSize: "12px",
                          fontWeight: 600,
                          color: BRAND_COLORS.secondary,
                        }}
                      >
                        <span>{industry}</span>
                        <button
                          onClick={() => {
                            setSelectedIndustry(prev => {
                              const filtered = prev.filter(i => i !== industry);
                              return filtered.length === 0 ? ["전체"] : filtered;
                            });
                            setDisplayCount(12);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "16px",
                            height: "16px",
                            padding: 0,
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: BRAND_COLORS.secondary,
                          }}
                        >
                          <X style={{ width: "14px", height: "14px" }} />
                        </button>
                      </div>
                    ))}
                    {selectedPurpose.filter(p => p !== "전체").map((purpose) => (
                      <div
                        key={purpose}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(255, 217, 61, 0.2)",
                          border: `1px solid ${BRAND_COLORS.primary}`,
                          fontSize: "12px",
                          fontWeight: 600,
                          color: BRAND_COLORS.secondary,
                        }}
                      >
                        <span>{purpose}</span>
                        <button
                          onClick={() => {
                            setSelectedPurpose(prev => {
                              const filtered = prev.filter(p => p !== purpose);
                              return filtered.length === 0 ? ["전체"] : filtered;
                            });
                            setDisplayCount(12);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "16px",
                            height: "16px",
                            padding: 0,
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: BRAND_COLORS.secondary,
                          }}
                        >
                          <X style={{ width: "14px", height: "14px" }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 필터 콘텐츠 (스크롤 영역) - Filter Content (Scrollable Area) */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px 24px" }}>
              {/* 업종 필터 (Industry Filter) */}
              <div style={{ marginBottom: "24px" }}>
                <button
                  onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    업종
                  </h4>
                  {isIndustryOpen ? (
                    <ChevronUp style={{ width: "16px", height: "16px", color: BRAND_COLORS.text.secondary }} />
                  ) : (
                    <ChevronDown style={{ width: "16px", height: "16px", color: BRAND_COLORS.text.secondary }} />
                  )}
                </button>
                {isIndustryOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                    {industryList.map((industry) => (
                      <button
                        key={industry}
                        onClick={() => {
                          if (industry === "전체") {
                            setSelectedIndustry(["전체"]);
                          } else {
                            setSelectedIndustry(prev => {
                              const withoutAll = prev.filter(i => i !== "전체");
                              if (prev.includes(industry)) {
                                const filtered = withoutAll.filter(i => i !== industry);
                                return filtered.length === 0 ? ["전체"] : filtered;
                              } else {
                                return [...withoutAll, industry];
                              }
                            });
                          }
                          setDisplayCount(12);
                        }}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: selectedIndustry.includes(industry) ? `2px solid ${BRAND_COLORS.secondary}` : `1px solid ${BRAND_COLORS.border}`,
                          backgroundColor: selectedIndustry.includes(industry) ? "rgba(26, 40, 103, 0.05)" : "white",
                          color: selectedIndustry.includes(industry) ? BRAND_COLORS.secondary : BRAND_COLORS.text.primary,
                          fontSize: "14px",
                          fontWeight: selectedIndustry.includes(industry) ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedIndustry.includes(industry)) {
                            e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedIndustry.includes(industry)) {
                            e.currentTarget.style.backgroundColor = "white";
                          }
                        }}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 용도 필터 (Purpose Filter) */}
              <div>
                <button
                  onClick={() => setIsPurposeOpen(!isPurposeOpen)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    용도
                  </h4>
                  {isPurposeOpen ? (
                    <ChevronUp style={{ width: "16px", height: "16px", color: BRAND_COLORS.text.secondary }} />
                  ) : (
                    <ChevronDown style={{ width: "16px", height: "16px", color: BRAND_COLORS.text.secondary }} />
                  )}
                </button>
                {isPurposeOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                    {purposeList.map((purpose) => (
                      <button
                        key={purpose}
                        onClick={() => {
                          if (purpose === "전체") {
                            setSelectedPurpose(["전체"]);
                          } else {
                            setSelectedPurpose(prev => {
                              const withoutAll = prev.filter(i => i !== "전체");
                              if (prev.includes(purpose)) {
                                const filtered = withoutAll.filter(i => i !== purpose);
                                return filtered.length === 0 ? ["전체"] : filtered;
                              } else {
                                return [...withoutAll, purpose];
                              }
                            });
                          }
                          setDisplayCount(12);
                        }}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: selectedPurpose.includes(purpose) ? `2px solid ${BRAND_COLORS.secondary}` : `1px solid ${BRAND_COLORS.border}`,
                          backgroundColor: selectedPurpose.includes(purpose) ? "rgba(26, 40, 103, 0.05)" : "white",
                          color: selectedPurpose.includes(purpose) ? BRAND_COLORS.secondary : BRAND_COLORS.text.primary,
                          fontSize: "14px",
                          fontWeight: selectedPurpose.includes(purpose) ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedPurpose.includes(purpose)) {
                            e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedPurpose.includes(purpose)) {
                            e.currentTarget.style.backgroundColor = "white";
                          }
                        }}
                      >
                        {purpose}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          )}

          {/* 우측 그리드 영역 (Right Grid Area) */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 그리드 갤러리 (Grid Gallery) */}
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
                gap: isMobile ? "16px" : "24px",
                marginBottom: "40px"
              }}
              className="production-examples-grid"
            >
              {displayedItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => {
                    if (!item.isBlurred) {
                      setSelectedItem(item);
                      setCurrentImageIndex(0);
                    }
                  }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    cursor: item.isBlurred ? "not-allowed" : "pointer",
                    opacity: item.isBlurred ? 0.8 : 1,
                  }}
                  className="portfolio-card"
                >
                  {/* 이미지 (Image) */}
                  <div
                    style={{
                      position: "relative",
                      paddingTop: "100%",
                      overflow: "hidden",
                      backgroundColor: BRAND_COLORS.background.tertiary,
                    }}
                    className="portfolio-image-container"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: item.isBlurred ? "blur(10px)" : "none",
                      }}
                    />
                    
                    {/* 블러 처리된 경우 문구 (Blur message) */}
                    {item.isBlurred && (
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(26, 40, 103, 0.9)",
                          padding: "16px 24px",
                          borderRadius: "12px",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: 600,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          zIndex: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Lock style={{ width: "16px", height: "16px" }} />
                        디자인 동의 대기
                      </div>
                    )}

                    {/* 호버 시 돋보기 아이콘 (Hover zoom icon) */}
                    <div
                      className="portfolio-zoom-icon"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "48px",
                        height: "48px",
                        backgroundColor: "rgba(26, 40, 103, 0.9)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        zIndex: item.isBlurred ? 1 : 3,
                      }}
                    >
                      <Search style={{ width: "24px", height: "24px", color: "white" }} />
                    </div>

                    {/* 카테고리 뱃지 (Category Badge) */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        padding: "4px 12px",
                        borderRadius: "100px",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(8px)",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: BRAND_COLORS.secondary,
                        zIndex: 1,
                      }}
                    >
                      {item.category}
                    </div>

                    {/* 업종 & 용도 뱃지 (Industry & Purpose Badges) */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "12px",
                        left: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(8px)",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: BRAND_COLORS.text.secondary,
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {item.industry}
                      </div>
                      <div
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(255, 217, 61, 0.95)",
                          backdropFilter: "blur(8px)",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: BRAND_COLORS.secondary,
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {item.purpose}
                      </div>
                    </div>

                    {/* 이미지 개수 표시 (Image count) */}
                    {item.imageCount > 1 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "12px",
                          right: "12px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          backdropFilter: "blur(8px)",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "white",
                          zIndex: 1,
                        }}
                      >
                        +{item.imageCount}
                      </div>
                    )}
                  </div>

                  {/* 내용 (Content) */}
                  <div style={{ padding: "20px" }}>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: BRAND_COLORS.text.primary,
                        marginBottom: "8px",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.title}
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <p style={{ fontSize: "13px", color: BRAND_COLORS.text.tertiary, margin: 0 }}>
                        {item.client}
                      </p>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: BRAND_COLORS.secondary, margin: 0 }}>
                        {item.productionDate}
                      </p>
                    </div>
                    {/* 설명 (Description) */}
                    <p style={{ fontSize: "13px", color: BRAND_COLORS.text.secondary, lineHeight: 1.5, margin: 0 }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 로딩 인디케이터 (Loading Indicator) */}
            {isLoading && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div
                  style={{
                    display: "inline-block",
                    width: "40px",
                    height: "40px",
                    border: `4px solid ${BRAND_COLORS.background.tertiary}`,
                    borderTop: `4px solid ${BRAND_COLORS.secondary}`,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              </div>
            )}

            {/* 더 이상 로드할 아이템이 없을 때 (When no more items to load) */}
            {!isLoading && displayCount >= filteredExamples.length && filteredExamples.length > 0 && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ fontSize: "16px", color: BRAND_COLORS.text.secondary }}>
                  모든 제작 사례를 확인하셨습니다
                </p>
              </div>
            )}

            {/* 검색 결과가 없을 때 (No results) */}
            {filteredExamples.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p style={{ fontSize: "18px", color: BRAND_COLORS.text.secondary, marginBottom: "8px" }}>
                  선택하신 필터에 맞는 제작 사례가 없습니다
                </p>
                <p style={{ fontSize: "14px", color: BRAND_COLORS.text.tertiary }}>
                  다른 필터를 선택해 주세요
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 필터 모달 (Filter Modal) - 모바일 전용 */}
      {isFilterModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
          }}
          onClick={() => setIsFilterModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxHeight: "85vh",
              backgroundColor: "white",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              display: "flex",
              flexDirection: "column",
              animation: "slideUp 0.3s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 필터 모달 헤더 (Filter Modal Header) */}
            <div style={{ padding: "24px", borderBottom: `1px solid ${BRAND_COLORS.border}`, flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: BRAND_COLORS.text.primary, margin: 0 }}>
                  필터
                </h3>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: BRAND_COLORS.background.tertiary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X style={{ width: "20px", height: "20px", color: BRAND_COLORS.text.primary }} />
                </button>
              </div>

              {/* 선택된 필터 표시 (Selected Filters Display) */}
              {(!selectedIndustry.includes("전체") || !selectedPurpose.includes("전체")) && (
                <div style={{ marginTop: "16px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedIndustry.filter(i => i !== "전체").map((industry) => (
                      <div
                        key={industry}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(26, 40, 103, 0.08)",
                          border: `1px solid ${BRAND_COLORS.secondary}`,
                          fontSize: "12px",
                          fontWeight: 600,
                          color: BRAND_COLORS.secondary,
                        }}
                      >
                        <span>{industry}</span>
                        <button
                          onClick={() => {
                            setSelectedIndustry(prev => {
                              const filtered = prev.filter(i => i !== industry);
                              return filtered.length === 0 ? ["전체"] : filtered;
                            });
                            setDisplayCount(12);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "16px",
                            height: "16px",
                            padding: 0,
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: BRAND_COLORS.secondary,
                          }}
                        >
                          <X style={{ width: "14px", height: "14px" }} />
                        </button>
                      </div>
                    ))}
                    {selectedPurpose.filter(p => p !== "전체").map((purpose) => (
                      <div
                        key={purpose}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(255, 217, 61, 0.2)",
                          border: `1px solid ${BRAND_COLORS.primary}`,
                          fontSize: "12px",
                          fontWeight: 600,
                          color: BRAND_COLORS.secondary,
                        }}
                      >
                        <span>{purpose}</span>
                        <button
                          onClick={() => {
                            setSelectedPurpose(prev => {
                              const filtered = prev.filter(p => p !== purpose);
                              return filtered.length === 0 ? ["전체"] : filtered;
                            });
                            setDisplayCount(12);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "16px",
                            height: "16px",
                            padding: 0,
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: BRAND_COLORS.secondary,
                          }}
                        >
                          <X style={{ width: "14px", height: "14px" }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 필터 콘텐츠 (Filter Content) */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* 탭 메뉴 (Tab Menu) */}
              <div style={{ display: "flex", gap: "8px", padding: "0 24px", borderBottom: `1px solid ${BRAND_COLORS.border}`, flexShrink: 0 }}>
                <button
                  onClick={() => setActiveFilterTab("industry")}
                  style={{
                    flex: 1,
                    padding: "16px",
                    border: "none",
                    backgroundColor: "transparent",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: activeFilterTab === "industry" ? BRAND_COLORS.secondary : BRAND_COLORS.text.tertiary,
                    cursor: "pointer",
                    position: "relative",
                    borderBottom: activeFilterTab === "industry" ? `3px solid ${BRAND_COLORS.secondary}` : "3px solid transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  업종
                  {!selectedIndustry.includes("전체") && (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "20px",
                      height: "20px",
                      padding: "0 6px",
                      marginLeft: "6px",
                      borderRadius: "10px",
                      backgroundColor: activeFilterTab === "industry" ? BRAND_COLORS.secondary : BRAND_COLORS.text.tertiary,
                      color: "white",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}>
                      {selectedIndustry.filter(i => i !== "전체").length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveFilterTab("purpose")}
                  style={{
                    flex: 1,
                    padding: "16px",
                    border: "none",
                    backgroundColor: "transparent",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: activeFilterTab === "purpose" ? BRAND_COLORS.secondary : BRAND_COLORS.text.tertiary,
                    cursor: "pointer",
                    position: "relative",
                    borderBottom: activeFilterTab === "purpose" ? `3px solid ${BRAND_COLORS.secondary}` : "3px solid transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  용도
                  {!selectedPurpose.includes("전체") && (
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "20px",
                      height: "20px",
                      padding: "0 6px",
                      marginLeft: "6px",
                      borderRadius: "10px",
                      backgroundColor: activeFilterTab === "purpose" ? BRAND_COLORS.secondary : BRAND_COLORS.text.tertiary,
                      color: "white",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}>
                      {selectedPurpose.filter(p => p !== "전체").length}
                    </span>
                  )}
                </button>
              </div>

              {/* 탭 콘텐츠 (Tab Content) */}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                {activeFilterTab === "industry" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {industryList.map((industry) => (
                      <button
                        key={industry}
                        onClick={() => {
                          if (industry === "전체") {
                            setSelectedIndustry(["전체"]);
                          } else {
                            setSelectedIndustry(prev => {
                              const withoutAll = prev.filter(i => i !== "전체");
                              if (prev.includes(industry)) {
                                const filtered = withoutAll.filter(i => i !== industry);
                                return filtered.length === 0 ? ["전체"] : filtered;
                              } else {
                                return [...withoutAll, industry];
                              }
                            });
                          }
                          setDisplayCount(12);
                        }}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "10px",
                          border: selectedIndustry.includes(industry) ? `2px solid ${BRAND_COLORS.secondary}` : `1px solid ${BRAND_COLORS.border}`,
                          backgroundColor: selectedIndustry.includes(industry) ? "rgba(26, 40, 103, 0.05)" : "white",
                          color: selectedIndustry.includes(industry) ? BRAND_COLORS.secondary : BRAND_COLORS.text.primary,
                          fontSize: "15px",
                          fontWeight: selectedIndustry.includes(industry) ? 600 : 500,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                )}

                {activeFilterTab === "purpose" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {purposeList.map((purpose) => (
                      <button
                        key={purpose}
                        onClick={() => {
                          if (purpose === "전체") {
                            setSelectedPurpose(["전체"]);
                          } else {
                            setSelectedPurpose(prev => {
                              const withoutAll = prev.filter(i => i !== "전체");
                              if (prev.includes(purpose)) {
                                const filtered = withoutAll.filter(i => i !== purpose);
                                return filtered.length === 0 ? ["전체"] : filtered;
                              } else {
                                return [...withoutAll, purpose];
                              }
                            });
                          }
                          setDisplayCount(12);
                        }}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "10px",
                          border: selectedPurpose.includes(purpose) ? `2px solid ${BRAND_COLORS.secondary}` : `1px solid ${BRAND_COLORS.border}`,
                          backgroundColor: selectedPurpose.includes(purpose) ? "rgba(26, 40, 103, 0.05)" : "white",
                          color: selectedPurpose.includes(purpose) ? BRAND_COLORS.secondary : BRAND_COLORS.text.primary,
                          fontSize: "15px",
                          fontWeight: selectedPurpose.includes(purpose) ? 600 : 500,
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {purpose}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 필터 모달 푸터 (Filter Modal Footer) */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${BRAND_COLORS.border}`, flexShrink: 0 }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={resetFilters}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "12px",
                    border: `1px solid ${BRAND_COLORS.border}`,
                    backgroundColor: "white",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: BRAND_COLORS.text.primary,
                    cursor: "pointer",
                  }}
                >
                  초기화
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  style={{
                    flex: 2,
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: BRAND_COLORS.secondary,
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  적용하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색 모달 (Search Modal) */}
      {(isSearchOpen || isSearchModalOpen) && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "120px",
          }}
          onClick={() => {
            setIsSearchOpen(false);
            setIsSearchModalOpen(false);
            setSearchQuery("");
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              margin: "0 24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 검색창 (Search Input) */}
            <div
              style={{
                position: "relative",
                marginBottom: "24px",
              }}
            >
              <Search
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "24px",
                  height: "24px",
                  color: BRAND_COLORS.text.tertiary,
                }}
              />
              <input
                type="text"
                placeholder="찾으시는 제작 사례를 검색해보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  width: "100%",
                  padding: "18px 60px 18px 60px",
                  borderRadius: "16px",
                  border: "none",
                  fontSize: "16px",
                  outline: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  backgroundColor: "white",
                  color: BRAND_COLORS.text.primary,
                }}
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setIsSearchModalOpen(false);
                  setSearchQuery("");
                }}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: BRAND_COLORS.background.tertiary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND_COLORS.secondary;
                  e.currentTarget.querySelector('svg')!.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
                  e.currentTarget.querySelector('svg')!.style.color = BRAND_COLORS.text.tertiary;
                }}
              >
                <X style={{ width: "18px", height: "18px", color: BRAND_COLORS.text.tertiary, transition: "all 0.3s ease" }} />
              </button>
            </div>

            {/* 검색 결과 (Search results) */}
            {searchQuery && (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  maxHeight: "500px",
                  overflowY: "auto",
                }}
              >
                {searchFilteredExamples.length > 0 ? (
                  <>
                    <p style={{ fontSize: "14px", color: BRAND_COLORS.text.tertiary, marginTop: 0, marginBottom: "16px", marginLeft: 0, marginRight: 0, padding: "0 8px" }}>
                      {searchFilteredExamples.length}개의 검색 결과
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {searchFilteredExamples.slice(0, 10).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedItem(item);
                            setIsSearchOpen(false);
                            setIsSearchModalOpen(false);
                          }}
                          style={{
                            display: "flex",
                            gap: "12px",
                            padding: "12px",
                            borderRadius: "12px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                              width: "60px",
                              height: "60px",
                              flexShrink: 0,
                              borderRadius: "8px",
                              overflow: "hidden",
                              backgroundColor: BRAND_COLORS.background.tertiary,
                            }}
                          >
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                filter: item.isBlurred ? "blur(5px)" : "none",
                              }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                color: BRAND_COLORS.text.primary,
                                marginTop: 0,
                                marginBottom: "4px",
                                marginLeft: 0,
                                marginRight: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.title}
                            </h4>
                            <p
                              style={{
                                fontSize: "12px",
                                color: BRAND_COLORS.text.tertiary,
                                marginTop: 0,
                                marginBottom: "4px",
                                marginLeft: 0,
                                marginRight: 0,
                              }}
                            >
                              {item.client} · {item.productionDate}
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                color: BRAND_COLORS.text.secondary,
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 0,
                                marginRight: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: "14px", color: BRAND_COLORS.text.secondary, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, textAlign: "center", padding: "24px 0" }}>
                    검색 결과가 없습니다
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 모달 (Modal) */}
      {selectedItem && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div 
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 (Close button) */}
            <button
              onClick={() => setSelectedItem(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
              }}
            >
              <X style={{ width: "20px", height: "20px", color: "white" }} />
            </button>

            {/* 이미지 갤러리 (Image gallery) */}
            <div style={{ position: "relative", padding: "24px", overflow: "hidden" }}>
              {/* 2열 그리드 레이아웃 (2-column grid layout) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "12px",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
                key={currentImageIndex}
                className="image-slide-animation"
              >
                {selectedItem.images.slice(currentImageIndex, currentImageIndex + 2).map((image: string, idx: number) => {
                  const actualIndex = currentImageIndex + idx;
                  if (actualIndex >= selectedItem.images.length) return null;
                  
                  return (
                    <div
                      key={actualIndex}
                      style={{
                        position: "relative",
                        paddingTop: "100%",
                        overflow: "hidden",
                        borderRadius: "12px",
                        backgroundColor: BRAND_COLORS.background.tertiary,
                        cursor: selectedItem.isBlurred ? "default" : "pointer",
                      }}
                      onClick={() => {
                        if (!selectedItem.isBlurred) {
                          setEnlargedImage(image);
                        }
                      }}
                    >
                      <img
                        src={image}
                        alt={`${selectedItem.title} ${actualIndex + 1}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "0",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: selectedItem.isBlurred ? "blur(10px)" : "none",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedItem.isBlurred) {
                            e.currentTarget.style.transform = "scale(1.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      />
                      {selectedItem.isBlurred && (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "rgba(26, 40, 103, 0.9)",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            color: "white",
                            fontSize: "12px",
                            fontWeight: 600,
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            zIndex: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Lock style={{ width: "14px", height: "14px" }} />
                          디자인 동의 대기
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 네비게이션 컨트롤 (Navigation controls) - 이미지가 2개 초과일 때만 표시 */}
              {selectedItem.imageCount > 2 && (
                <>
                  {/* 이전 버튼 (Previous button) */}
                  {currentImageIndex > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex((prev) => Math.max(0, prev - 2));
                      }}
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 3,
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                      }}
                    >
                      <ChevronLeft style={{ width: "24px", height: "24px", color: BRAND_COLORS.secondary }} />
                    </button>
                  )}

                  {/* 다음 버튼 (Next button) */}
                  {currentImageIndex + 2 < selectedItem.images.length && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex((prev) => Math.min(selectedItem.images.length - 2, prev + 2));
                      }}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 3,
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                      }}
                    >
                      <ChevronRight style={{ width: "24px", height: "24px", color: BRAND_COLORS.secondary }} />
                    </button>
                  )}

                  {/* 페이지 인디케이터 (Page indicator) */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "6px 16px",
                      borderRadius: "100px",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: 600,
                      zIndex: 3,
                    }}
                  >
                    {Math.floor(currentImageIndex / 2) + 1} / {Math.ceil(selectedItem.images.length / 2)}
                  </div>
                </>
              )}
            </div>

            {/* 내용 (Content) */}
            <div style={{ padding: "0 24px 24px 24px" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  backgroundColor: "#fff8e0",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: BRAND_COLORS.secondary,
                  marginBottom: "12px",
                }}
              >
                {selectedItem.category}
              </div>
              <h2 style={{ fontSize: "28px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "16px", letterSpacing: "-0.02em" }}>
                {selectedItem.title}
              </h2>
              <div style={{ display: "flex", gap: "24px", marginBottom: "16px", flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontSize: "13px", color: BRAND_COLORS.text.tertiary, margin: 0, marginBottom: "4px" }}>
                    고객사
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: 600, color: BRAND_COLORS.text.primary, margin: 0 }}>
                    {selectedItem.client}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "13px", color: BRAND_COLORS.text.tertiary, margin: 0, marginBottom: "4px" }}>
                    제작 시기
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: 600, color: BRAND_COLORS.secondary, margin: 0 }}>
                    {selectedItem.productionDate}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: "16px", color: BRAND_COLORS.text.secondary, lineHeight: 1.6, margin: 0 }}>
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 확대 모달 (Image Enlargement Modal) */}
      {enlargedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            cursor: "zoom-out",
          }}
          onClick={() => setEnlargedImage(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEnlargedImage(null);
            }}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            <X style={{ width: "24px", height: "24px", color: "white" }} />
          </button>
          <img
            src={enlargedImage}
            alt="Enlarged view"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* 스타일 (Styles) */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          0% { 
            opacity: 0;
            transform: translateX(50px);
          }
          100% { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          0% { 
            transform: translateY(100%);
          }
          100% { 
            transform: translateY(0);
          }
        }

        .image-slide-animation {
          animation: slideIn 0.5s ease-out;
        }

        .portfolio-card:hover .portfolio-zoom-icon {
          opacity: 1 !important;
        }

        .portfolio-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }

        @media (max-width: 1280px) {
          .production-examples-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
          }
        }

        @media (max-width: 968px) {
          .production-examples-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }

        @media (max-width: 640px) {
          .production-examples-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}