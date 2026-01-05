import React, { useState, useEffect } from "react";

/**
 * ProcessStepsSection Component
 * 쿠디솜 제작 과정 스텝 섹션 / Qudisom Production Process Steps Section
 * 그리드 레이아웃: PC 3x2, 모바일 2x2 / Grid Layout: PC 3x2, Mobile 2x2
 * 고급스러운 전환 애니메이션 적용 / Premium transition animations applied
 * 
 * 브랜드 컬러 / Brand Colors:
 * - Main: #ffd93d (Yellow)
 * - Sub: #1a2867 (Navy)
 */

// ========== 브랜드 컬러 정의 (Brand Color Definition) ==========
const BRAND_COLORS = {
  primary: "#ffd93d",
  secondary: "#1a2867",
  text: {
    primary: "#191F28",
    secondary: "#4E5968",
    tertiary: "#8B95A1",
    white: "#FFFFFF",
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
  },
};

// ========== 스텝 데이터 (Step Data) ==========
const STEPS_DATA = [
  { step: 1, title: "3D 디자인 렌더링", image: "https://cdn.imweb.me/thumbnail/20250724/198421bff1d2b.gif" },
  { step: 2, title: "원단 및 부자재 셀렉", image: "https://cdn.imweb.me/thumbnail/20250724/e40dde37cd85d.gif" },
  { step: 3, title: "패턴 디자인 원단 재단", image: "https://cdn.imweb.me/thumbnail/20250822/8da81ac59a2fe.gif" },
  { step: 4, title: "자수 및 인쇄", image: "https://cdn.imweb.me/thumbnail/20250822/f1451930c979b.gif" },
  { step: 5, title: "봉제 및 미싱", image: "https://cdn.imweb.me/thumbnail/20250822/195c9175923ce.gif" },
  { step: 6, title: "내부 솜 충전", image: "https://cdn.imweb.me/thumbnail/20250724/f7e38eb7686ab.gif" },
  { step: 7, title: "핸드 메이드 & 바느질", image: "https://cdn.imweb.me/thumbnail/20250724/d426cefcceea7.gif" },
  { step: 8, title: "마무리 클리닝", image: "https://cdn.imweb.me/thumbnail/20250724/3121249ccfb66.gif" },
  { step: 9, title: "QC 검사 및 소독", image: "https://cdn.imweb.me/thumbnail/20250724/8f0045805e1af.gif" },
  { step: 10, title: "검수 및 패킹", image: "https://cdn.imweb.me/thumbnail/20250724/8f0045805e1af.gif" },
  { step: 11, title: "해상 운송", image: "https://cdn.imweb.me/thumbnail/20250724/e2a814382ef43.gif" },
  { step: 12, title: "국내 배송", image: "https://cdn.imweb.me/thumbnail/20250724/e2a814382ef43.gif" },
];

// ========== 아이콘 컴포넌트 (Icon Components) ==========

// 왼쪽 화살표 / Left Arrow
const ChevronLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

// 오른쪽 화살표 / Right Arrow
const ChevronRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ========== 메인 컴포넌트 (Main Component) ==========
export default function ProcessStepsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isMobile, setIsMobile] = useState(false);

  // 반응형 감지 / Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 페이지당 아이템 수 / Items per page
  const itemsPerPage = isMobile ? 4 : 6; // 모바일: 2x2=4, PC: 3x2=6
  const totalPages = Math.ceil(STEPS_DATA.length / itemsPerPage);

  // 현재 페이지의 아이템들 / Current page items
  const getCurrentItems = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return STEPS_DATA.slice(start, end);
  };

  // 애니메이션 트리거 / Animation trigger
  const triggerAnimation = (newPage: number, dir: "left" | "right") => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    
    setTimeout(() => {
      setCurrentPage(newPage);
    }, 150);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // 이전 페이지 / Previous page
  const handlePrev = () => {
    const newPage = currentPage === 0 ? totalPages - 1 : currentPage - 1;
    triggerAnimation(newPage, "left");
  };

  // 다음 페이지 / Next page
  const handleNext = () => {
    const newPage = currentPage === totalPages - 1 ? 0 : currentPage + 1;
    triggerAnimation(newPage, "right");
  };

  // 특정 페이지로 이동 / Go to specific page
  const handlePageClick = (page: number) => {
    if (page === currentPage || isAnimating) return;
    const dir = page > currentPage ? "right" : "left";
    triggerAnimation(page, dir);
  };

  return (
    <section style={styles.section}>
      {/* CSS 애니메이션 및 미디어 쿼리 / CSS Animations & Media Queries */}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        
        .grid-container.animate-right {
          animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .grid-container.animate-left {
          animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .step-card {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .step-card:nth-child(1) { animation-delay: 0.05s; }
        .step-card:nth-child(2) { animation-delay: 0.1s; }
        .step-card:nth-child(3) { animation-delay: 0.15s; }
        .step-card:nth-child(4) { animation-delay: 0.2s; }
        .step-card:nth-child(5) { animation-delay: 0.25s; }
        .step-card:nth-child(6) { animation-delay: 0.3s; }
        
        .step-card:hover .step-image {
          transform: scale(1.05);
        }
        
        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
        }
        
        .nav-button-desktop {
          display: flex;
        }
        
        .nav-button-desktop:hover {
          background-color: ${BRAND_COLORS.primary} !important;
          color: ${BRAND_COLORS.text.primary} !important;
          transform: scale(1.08);
        }
        
        .nav-button-desktop:active {
          transform: scale(0.95);
        }
        
        .paging-button:hover {
          border-color: ${BRAND_COLORS.secondary} !important;
          color: ${BRAND_COLORS.text.primary} !important;
        }
        
        /* 모바일 스타일 / Mobile styles */
        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          
          .nav-button-desktop {
            display: none !important;
          }
          
          .slider-wrapper {
            padding: 0 !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* 헤더 영역 / Header Area */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            <span style={{ ...styles.titleLight, color: BRAND_COLORS.text.primary }}>SIMPLE IDEA →</span>
            <br />
            <span style={{...styles.titleBold, color: "#1a2867"}}>SPECIAL ARTWORK</span>
          </h2>
          <p style={styles.subtitle}>
            섬세한 디자인과 정밀한 제작이 만나 완벽한 결과를 만들다
          </p>
          <p style={styles.description}>
            단순한 굿즈가 아닌 브랜드가 원하는 감성을 완성합니다.
          </p>
        </div>

        {/* 그리드 슬라이더 영역 / Grid Slider Area */}
        <div style={styles.sliderWrapper} className="slider-wrapper">
          {/* 이전 버튼 / Previous Button */}
          <button
            style={styles.navButton}
            className="nav-button-desktop"
            onClick={handlePrev}
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </button>

          {/* 그리드 컨테이너 / Grid Container */}
          <div style={styles.gridWrapper}>
            <div
              key={currentPage}
              className={`grid-container ${direction === "right" ? "animate-right" : "animate-left"}`}
            >
              {getCurrentItems().map((step, index) => (
                <div key={step.step} style={styles.stepCard} className="step-card">
                  {/* 이미지 컨테이너 / Image Container */}
                  <div style={styles.imageContainer}>
                    <img
                      src={step.image}
                      alt={step.title}
                      style={styles.stepImage}
                      className="step-image"
                    />
                    {/* 스텝 뱃지 / Step Badge */}
                    <div style={{...styles.stepBadge, backgroundColor: "#fab803"}}>
                      <span style={{...styles.stepNumber, color: "#000000"}}>Step {step.step}</span>
                    </div>
                  </div>
                  {/* 스텝 타이틀 / Step Title */}
                  <h3 style={{...styles.stepTitle, backgroundColor: "#ffffff", color: "#000000"}}>{step.title}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* 다음 버튼 / Next Button */}
          <button
            style={styles.navButton}
            className="nav-button-desktop"
            onClick={handleNext}
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </button>
        </div>

        {/* 페이지 네비게이션 / Page Navigation */}
        <div style={styles.pagingContainer}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              style={{
                ...styles.pagingButton,
                ...(index === currentPage ? styles.pagingButtonActive : {}),
              }}
              className="paging-button"
              onClick={() => handlePageClick(index)}
              aria-label={`Go to page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== 스타일 정의 (Style Definitions) ==========
const styles: { [key: string]: React.CSSProperties } = {
  // 섹션 / Section
  section: {
    width: "100%",
    padding: "100px 24px",
    backgroundColor: BRAND_COLORS.background.primary,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // 컨테이너 / Container
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  // 헤더 / Header
  header: {
    textAlign: "center",
    marginBottom: "56px",
  },

  // 타이틀 / Title
  title: {
    fontSize: "clamp(20px, 4vw, 38px)", // 모바일에서 더 작게 조정 (decreased size for mobile)
    fontWeight: 700,
    lineHeight: 1.4,
    margin: 0,
    marginBottom: "24px",
    letterSpacing: "-0.02em",
  },

  titleLight: {
    color: BRAND_COLORS.text.tertiary,
    fontWeight: 500,
  },

  titleBold: {
    color: BRAND_COLORS.text.primary,
  },

  // 서브타이틀 / Subtitle
  subtitle: {
    fontSize: "clamp(14px, 1.5vw, 16px)",
    fontWeight: 400, // 볼드 해제 (removed bold)
    color: BRAND_COLORS.text.tertiary, // description과 동일한 색상으로 변경 (changed to match description color)
    margin: 0,
    marginBottom: "8px",
    lineHeight: 1.6,
  },

  // 설명 / Description
  description: {
    fontSize: "clamp(14px, 1.5vw, 16px)",
    color: BRAND_COLORS.text.tertiary,
    margin: 0,
    lineHeight: 1.6,
  },

  // 슬라이더 래퍼 / Slider Wrapper
  sliderWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "40px",
  },

  // 네비게이션 버튼 (크기 축소) / Navigation Button (smaller size)
  navButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
    backgroundColor: BRAND_COLORS.background.secondary,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#E5E8EB",
    borderRadius: "50%",
    cursor: "pointer",
    color: BRAND_COLORS.text.secondary,
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  // 그리드 래퍼 / Grid Wrapper
  gridWrapper: {
    flex: 1,
    overflow: "hidden",
  },

  // 스텝 카드 / Step Card
  stepCard: {
    backgroundColor: BRAND_COLORS.background.primary,
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    cursor: "pointer",
  },

  // 이미지 컨테이너 / Image Container
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    backgroundColor: BRAND_COLORS.background.secondary,
  },

  // 스텝 이미지 / Step Image
  stepImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // 스텝 뱃지 / Step Badge
  stepBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "6px 12px",
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: "100px",
    boxShadow: "0 2px 8px rgba(26, 40, 103, 0.3)",
  },

  stepNumber: {
    fontSize: "11px",
    fontWeight: 700,
    color: BRAND_COLORS.text.white,
    letterSpacing: "0.3px",
  },

  // 스텝 타이틀 / Step Title
  stepTitle: {
    fontSize: "clamp(13px, 1.5vw, 15px)",
    fontWeight: 600,
    color: BRAND_COLORS.text.primary,
    margin: 0,
    padding: "14px 16px",
    textAlign: "center",
  },

  // 페이징 컨테이너 / Paging Container
  pagingContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },

  // 페이징 버튼 / Paging Button
  pagingButton: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: 600,
    color: BRAND_COLORS.text.tertiary,
    backgroundColor: "transparent",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#E5E8EB",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // 활성 페이징 버튼 / Active Paging Button
  pagingButtonActive: {
    color: BRAND_COLORS.text.primary,
    backgroundColor: BRAND_COLORS.primary,
    borderColor: BRAND_COLORS.primary,
    boxShadow: "0 4px 12px rgba(255, 217, 61, 0.3)",
  },
};