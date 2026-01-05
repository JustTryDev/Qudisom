import React, { useState, useEffect, useRef } from "react";

/**
 * SmartOrderProcessSection Component
 * 쿠디솜 스마트 오더 프로세스 섹션 / Qudisom Smart Order Process Section
 * 가로 자동 슬라이드: PC 4~5개, 모바일 2~3개 표시 / Horizontal auto-slide: PC 4-5, Mobile 2-3 items
 * 1개씩 자동 슬라이드 / Auto-slide 1 item at a time
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
];

// ========== 메인 컴포넌트 (Main Component) ==========
export default function SmartOrderProcessSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // 자동 슬라이드 / Auto slide
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STEPS_DATA.length);
    }, 3000); // 3초마다 슬라이드 / Slide every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  // 특정 인덱스로 이동 / Go to specific index
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // 마우스 진입 시 일시정지 / Pause on mouse enter
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  // 마우스 이탈 시 재개 / Resume on mouse leave
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <section style={styles.section}>
      {/* CSS 스타일 / CSS Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .slide-item {
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .slide-item:hover {
          transform: translateY(-6px);
        }
        
        .slide-item:hover .slide-image {
          transform: scale(1.05);
        }
        
        .dot-button:hover {
          background-color: ${BRAND_COLORS.text.tertiary} !important;
        }
        
        .slider-track {
          display: flex;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* PC: 5개 표시 / PC: Show 5 items */
        .slide-item {
          flex: 0 0 calc(100% / 5);
          padding: 0 8px;
        }
        
        /* 태블릿: 3개 표시 / Tablet: Show 3 items */
        @media (max-width: 1024px) {
          .slide-item {
            flex: 0 0 calc(100% / 3);
          }
        }
        
        /* 모바일: 2개 표시 / Mobile: Show 2 items */
        @media (max-width: 640px) {
          .slide-item {
            flex: 0 0 calc(100% / 2);
            padding: 0 6px;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* 헤더 영역 / Header Area */}
        <div style={styles.header}>
          <div style={styles.labelBadge}>
            <span style={styles.labelText}>SMART ORDER PROCESS</span>
          </div>
          <h2 style={styles.title}>
            아이디어가 떠오르는 순간부터
            <br />
            <span style={styles.titleHighlight}>제작까지</span> 복잡한 과정은 걱정하지 마세요
          </h2>
          <p style={{...styles.description, lineHeight: 2}}>
            효율적이지만 결코 기계적이지 않게,
            <br />
            효율 속에서도 감각적인 완성도를 유지합니다.
          </p>
        </div>

        {/* 슬라이더 영역 / Slider Area */}
        <div
          style={styles.sliderContainer}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={sliderRef}
        >
          <div
            className="slider-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / 5)}%)`,
            }}
          >
            {/* 무한 루프를 위해 데이터 복제 / Duplicate data for infinite loop */}
            {[...STEPS_DATA, ...STEPS_DATA].map((step, index) => (
              <div
                key={`${step.step}-${index}`}
                className="slide-item"
                style={styles.slideItem}
              >
                <div style={styles.card}>
                  {/* 이미지 컨테이너 / Image Container */}
                  <div style={styles.imageContainer}>
                    <img
                      src={step.image}
                      alt={step.title}
                      style={styles.slideImage}
                      className="slide-image"
                    />
                    {/* 스텝 뱃지 (네이비 배경, 흰색 폰트) / Step Badge (Navy bg, White font) */}
                    <div style={{...styles.stepBadge, backgroundColor: "#fab803"}}>
                      <span style={{...styles.stepNumber, color: "#000000"}}>{step.step}</span>
                    </div>
                  </div>
                  {/* 타이틀 / Title */}
                  <div style={styles.cardContent}>
                    <h3 style={styles.cardTitle}>{step.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 프로그레스 바 / Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressBar,
                width: `${((currentIndex + 1) / STEPS_DATA.length) * 100}%`,
              }}
            />
          </div>
          <span style={styles.progressText}>
            {String(currentIndex + 1).padStart(2, "0")} / {String(STEPS_DATA.length).padStart(2, "0")}
          </span>
        </div>

        {/* 도트 인디케이터 / Dot Indicators */}
        <div style={styles.dotsContainer}>
          {STEPS_DATA.map((_, index) => (
            <button
              key={index}
              style={{
                ...styles.dot,
                ...(index === currentIndex ? styles.dotActive : {}),
              }}
              className="dot-button"
              onClick={() => handleDotClick(index)}
              aria-label={`Go to step ${index + 1}`}
            />
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
    padding: "100px 0",
    backgroundColor: BRAND_COLORS.background.secondary,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: "hidden",
  },

  // 컨테이너 / Container
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
  },

  // 헤더 / Header
  header: {
    textAlign: "center",
    marginBottom: "56px",
  },

  // 라벨 뱃지 / Label Badge
  labelBadge: {
    display: "inline-flex",
    padding: "8px 16px",
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: "100px",
    marginBottom: "20px",
  },

  labelText: {
    fontSize: "12px",
    fontWeight: 700,
    color: BRAND_COLORS.text.white,
    letterSpacing: "1px",
  },

  // 타이틀 / Title
  title: {
    fontSize: "clamp(24px, 4vw, 38px)",
    fontWeight: 700,
    color: BRAND_COLORS.text.primary,
    lineHeight: 1.4,
    margin: 0,
    marginBottom: "24px",
    letterSpacing: "-0.02em",
  },

  titleHighlight: {
    color: BRAND_COLORS.secondary,
  },

  // 설명 / Description
  description: {
    fontSize: "clamp(14px, 1.5vw, 16px)",
    color: BRAND_COLORS.text.tertiary,
    margin: 0,
    lineHeight: 1.6,
  },

  // 슬라이더 컨테이너 / Slider Container
  sliderContainer: {
    width: "100%",
    overflow: "hidden",
    marginBottom: "32px",
    cursor: "grab",
  },

  // 슬라이드 아이템 / Slide Item
  slideItem: {
    boxSizing: "border-box",
  },

  // 카드 / Card
  card: {
    backgroundColor: BRAND_COLORS.background.primary,
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // 이미지 컨테이너 / Image Container
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    backgroundColor: BRAND_COLORS.background.secondary,
  },

  // 슬라이드 이미지 / Slide Image
  slideImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // 스텝 뱃지 (네이비 배경, 흰색 폰트) / Step Badge (Navy bg, White font)
  stepBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(26, 40, 103, 0.3)",
  },

  stepNumber: {
    fontSize: "13px",
    fontWeight: 700,
    color: BRAND_COLORS.text.white,
  },

  // 카드 콘텐츠 / Card Content
  cardContent: {
    padding: "16px",
  },

  // 카드 타이틀 / Card Title
  cardTitle: {
    fontSize: "clamp(12px, 1.2vw, 14px)",
    fontWeight: 600,
    color: BRAND_COLORS.text.primary,
    margin: 0,
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  // 프로그레스 컨테이너 / Progress Container
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "24px",
  },

  // 프로그레스 트랙 / Progress Track
  progressTrack: {
    width: "200px",
    height: "4px",
    backgroundColor: "#E5E8EB",
    borderRadius: "2px",
    overflow: "hidden",
  },

  // 프로그레스 바 / Progress Bar
  progressBar: {
    height: "100%",
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: "2px",
    transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // 프로그레스 텍스트 / Progress Text
  progressText: {
    fontSize: "14px",
    fontWeight: 600,
    color: BRAND_COLORS.text.secondary,
  },

  // 도트 컨테이너 / Dots Container
  dotsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },

  // 도트 / Dot
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#E5E8EB",
    border: "none",
    padding: 0,
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // 활성 도트 / Active Dot
  dotActive: {
    width: "24px",
    borderRadius: "4px",
    backgroundColor: BRAND_COLORS.primary,
  },
};