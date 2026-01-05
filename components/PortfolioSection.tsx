import React, { useState } from "react";

/**
 * PortfolioSection Component
 * 쿠디솜 포트폴리오 섹션 / Qudisom Portfolio Section
 * 포트폴리오 갤러리 그리드 / Portfolio gallery grid
 * 모바일: 2x2 기본, 2개씩 펼쳐보기 / Mobile: 2x2 default, expand 2 items at a time
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

// ========== 포트폴리오 데이터 (Portfolio Data) ==========
const PORTFOLIO_DATA = [
  { id: 1, image: "https://inprise365-inprise-main-24113362.dev.odoo.com/inprise_qudisom_website/static/src/img/portfolio1.jpg" },
  { id: 2, image: "https://inprise365-inprise-main-24113362.dev.odoo.com/inprise_qudisom_website/static/src/img/portfolio2.jpg" },
  { id: 3, image: "https://inprise365-inprise-main-24113362.dev.odoo.com/inprise_qudisom_website/static/src/img/portfolio3.jpg" },
  { id: 4, image: "https://inprise365-inprise-main-24113362.dev.odoo.com/inprise_qudisom_website/static/src/img/portfolio4.jpg" },
  { id: 5, image: "https://inprise365-inprise-main-24113362.dev.odoo.com/inprise_qudisom_website/static/src/img/portfolio5.jpg" },
  { id: 6, image: "https://inprise365-inprise-main-24113362.dev.odoo.com/inprise_qudisom_website/static/src/img/portfolio6.jpg" },
  { id: 7, image: "https://inprise365-inprise-main-24113362.dev.odoo.com/inprise_qudisom_website/static/src/img/portfolio7.jpg" },
  { id: 8, image: "https://inprise365-inprise-main-24113362.dev.odoo.com/inprise_qudisom_website/static/src/img/portfolio8.jpg" },
  { id: 9, image: "https://inprise365-inprise-main-24113362.dev.odoo.com/inprise_qudisom_website/static/src/img/portfolio9.jpg" },
  { id: 10, image: "https://inprise365-inprise-main-24113362.dev.odoo.com/inprise_qudisom_website/static/src/img/portfolio10.jpg" },
];

// ========== 아이콘 컴포넌트 (Icon Components) ==========

// 확대 아이콘 / Zoom Icon
const ZoomIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
    <path d="M11 8v6M8 11h6" />
  </svg>
);

// 닫기 아이콘 / Close Icon
const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

// 왼쪽 화살표 / Left Arrow
const ChevronLeftIcon = () => (
  <svg
    width="28"
    height="28"
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
    width="28"
    height="28"
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

// 아래 화살표 / Down Arrow
const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ========== 메인 컴포넌트 (Main Component) ==========
export default function PortfolioSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 무한 슬라이드를 위해 데이터 2배 복제 / Double data for infinite slide
  const row1Data = [...PORTFOLIO_DATA, ...PORTFOLIO_DATA];
  const row2Data = [...PORTFOLIO_DATA, ...PORTFOLIO_DATA];
  const row3Data = [...PORTFOLIO_DATA, ...PORTFOLIO_DATA];

  // 이미지 클릭 핸들러 / Image click handler
  const handleImageClick = (id: number) => {
    const index = PORTFOLIO_DATA.findIndex(item => item.id === id);
    setSelectedIndex(index);
  };

  // 모달 닫기 / Close modal
  const handleCloseModal = () => {
    setSelectedIndex(null);
  };

  // 이전 이미지 / Previous image
  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? PORTFOLIO_DATA.length - 1 : selectedIndex - 1);
    }
  };

  // 다음 이미지 / Next image
  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === PORTFOLIO_DATA.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  return (
    <section style={styles.section}>
      {/* CSS 스타일 / CSS Styles */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes marqueeReverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .marquee-track {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        
        .marquee-track-reverse {
          display: flex;
          animation: marqueeReverse 30s linear infinite;
        }
        
        .marquee-container:hover .marquee-track,
        .marquee-container:hover .marquee-track-reverse {
          animation-play-state: paused;
        }
        
        .portfolio-item {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .portfolio-item:hover {
          transform: scale(1.05);
          z-index: 2;
        }
        
        .portfolio-item:hover .portfolio-image {
          transform: scale(1.1);
        }
        
        .portfolio-item:hover .portfolio-overlay {
          opacity: 1;
        }
        
        /* 좌우 블러 페이드 효과 / Left/Right blur fade effect */
        .marquee-wrapper {
          position: relative;
        }
        
        .marquee-wrapper::before,
        .marquee-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 120px;
          z-index: 10;
          pointer-events: none;
        }
        
        .marquee-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #FFFFFF 0%, transparent 100%);
        }
        
        .marquee-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #FFFFFF 0%, transparent 100%);
        }
        
        .modal-nav-button:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .modal-close-button:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        
        .view-more-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(250, 184, 3, 0.4) !important;
        }
        
        /* 모바일 / Mobile */
        @media (max-width: 640px) {
          .marquee-track,
          .marquee-track-reverse {
            animation-duration: 25s;
          }
          
          .marquee-wrapper::before,
          .marquee-wrapper::after {
            width: 40px;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* 헤더 영역 / Header Area */}
        <div style={styles.header}>
          <div style={styles.labelBadge}>
            <span style={styles.labelText}>PORTFOLIO</span>
          </div>
          
          <h2 style={styles.title}>
            수많은 제작 사례가
            <br />
            <span style={styles.titleHighlight}>실력을 증명</span>합니다
          </h2>
          
          <p style={{...styles.description, lineHeight: 2}}>
            대기업이나 성공한 프로젝트의 사례만 강조하지 않고
            <br />
            개인의 작품부터 대형 프로젝트의 제작 사례까지 모두 투명하게 공개합니다.
          </p>
        </div>

        {/* 마키 슬라이드 영역 / Marquee Slide Area */}
        <div style={styles.marqueeWrapper} className="marquee-wrapper">
          {/* 첫 번째 줄 (왼쪽으로) / First row (to left) */}
          <div style={styles.marqueeContainer} className="marquee-container">
            <div className="marquee-track">
              {row1Data.map((item, index) => (
                <div
                  key={`row1-${item.id}-${index}`}
                  className="portfolio-item"
                  style={styles.portfolioItem}
                  onClick={() => handleImageClick(item.id)}
                >
                  <div style={styles.imageContainer}>
                    <img
                      src={item.image}
                      alt={`Portfolio ${item.id}`}
                      style={styles.portfolioImage}
                      className="portfolio-image"
                    />
                    {/* 호버 오버레이 / Hover Overlay */}
                    <div style={styles.portfolioOverlay} className="portfolio-overlay">
                      <ZoomIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 두 번째 줄 (오른쪽으로) / Second row (to right) */}
          <div style={styles.marqueeContainer} className="marquee-container">
            <div className="marquee-track-reverse">
              {row2Data.map((item, index) => (
                <div
                  key={`row2-${item.id}-${index}`}
                  className="portfolio-item"
                  style={styles.portfolioItem}
                  onClick={() => handleImageClick(item.id)}
                >
                  <div style={styles.imageContainer}>
                    <img
                      src={item.image}
                      alt={`Portfolio ${item.id}`}
                      style={styles.portfolioImage}
                      className="portfolio-image"
                    />
                    {/* 호버 오버레이 / Hover Overlay */}
                    <div style={styles.portfolioOverlay} className="portfolio-overlay">
                      <ZoomIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 세 번째 줄 (왼쪽으로) / Third row (to left) */}
          <div style={styles.marqueeContainer} className="marquee-container">
            <div className="marquee-track">
              {row3Data.map((item, index) => (
                <div
                  key={`row3-${item.id}-${index}`}
                  className="portfolio-item"
                  style={styles.portfolioItem}
                  onClick={() => handleImageClick(item.id)}
                >
                  <div style={styles.imageContainer}>
                    <img
                      src={item.image}
                      alt={`Portfolio ${item.id}`}
                      style={styles.portfolioImage}
                      className="portfolio-image"
                    />
                    {/* 호버 오버레이 / Hover Overlay */}
                    <div style={styles.portfolioOverlay} className="portfolio-overlay">
                      <ZoomIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 더보기 버튼 / View More Button */}
        <div style={styles.buttonContainer}>
          <button style={styles.viewMoreButton} className="view-more-button">
            <span>포트폴리오 더보기</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 이미지 모달 / Image Modal */}
      {selectedIndex !== null && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* 닫기 버튼 / Close Button */}
            <button
              style={styles.modalCloseButton}
              className="modal-close-button"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <CloseIcon />
            </button>

            {/* 이전 버튼 / Previous Button */}
            <button
              style={{ ...styles.modalNavButton, left: "16px" }}
              className="modal-nav-button"
              onClick={handlePrev}
              aria-label="Previous"
            >
              <ChevronLeftIcon />
            </button>

            {/* 이미지 / Image */}
            <img
              src={PORTFOLIO_DATA[selectedIndex].image}
              alt={`Portfolio ${selectedIndex + 1}`}
              style={styles.modalImage}
            />

            {/* 다음 버튼 / Next Button */}
            <button
              style={{ ...styles.modalNavButton, right: "16px" }}
              className="modal-nav-button"
              onClick={handleNext}
              aria-label="Next"
            >
              <ChevronRightIcon />
            </button>

            {/* 인디케이터 / Indicator */}
            <div style={styles.modalIndicator}>
              {selectedIndex + 1} / {PORTFOLIO_DATA.length}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ========== 스타일 정의 (Style Definitions) ==========
const styles: { [key: string]: React.CSSProperties } = {
  // 섹션 / Section
  section: {
    width: "100%",
    padding: "100px 0",
    backgroundColor: BRAND_COLORS.background.primary,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: "hidden",
  },

  // 컨테이너 / Container
  container: {
    width: "100%",
    margin: "0 auto",
  },

  // 헤더 / Header
  header: {
    textAlign: "center",
    marginBottom: "48px",
  },

  // 라벨 뱃지 / Label Badge
  labelBadge: {
    display: "inline-flex",
    padding: "8px 16px",
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: "100px",
    marginBottom: "24px",
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

  // 포트폴리오 아이템 / Portfolio Item
  portfolioItem: {
    flexShrink: 0,
    width: "240px",
    marginRight: "16px",
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
  },

  // 이미지 컨테이너 / Image Container
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    backgroundColor: BRAND_COLORS.background.primary,
  },

  // 포트폴리오 이미지 / Portfolio Image
  portfolioImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // 오버레이 / Overlay
  portfolioOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(26, 40, 103, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease",
    color: BRAND_COLORS.text.white,
  },

  // 버튼 컨테이너 / Button Container
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "32px",
  },

  // 펼치기 버튼 / Expand Button
  expandButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "12px 24px",
    backgroundColor: BRAND_COLORS.background.primary,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#E5E8EB",
    borderRadius: "100px",
    fontSize: "14px",
    fontWeight: 600,
    color: BRAND_COLORS.text.secondary,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // 더보기 버튼 (노란색 배경, 검정 폰트) / View More Button (Yellow bg, Black font)
  viewMoreButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 28px",
    backgroundColor: BRAND_COLORS.primary,
    border: "none",
    borderRadius: "100px",
    fontSize: "15px",
    fontWeight: 600,
    color: BRAND_COLORS.text.primary,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 16px rgba(255, 217, 61, 0.3)",
  },

  // 모달 오버레이 / Modal Overlay
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "24px",
  },

  // 모달 콘텐츠 / Modal Content
  modalContent: {
    position: "relative",
    maxWidth: "90vw",
    maxHeight: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // 모달 이미지 / Modal Image
  modalImage: {
    maxWidth: "100%",
    maxHeight: "85vh",
    objectFit: "contain",
    borderRadius: "8px",
  },

  // 모달 닫기 버튼 / Modal Close Button
  modalCloseButton: {
    position: "absolute",
    top: "-48px",
    right: "0",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    color: BRAND_COLORS.text.white,
    transition: "background-color 0.2s ease",
  },

  // 모달 네비게이션 버튼 / Modal Navigation Button
  modalNavButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    color: BRAND_COLORS.text.white,
    transition: "background-color 0.2s ease",
  },

  // 모달 인디케이터 / Modal Indicator
  modalIndicator: {
    position: "absolute",
    bottom: "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "14px",
    fontWeight: 600,
    color: BRAND_COLORS.text.white,
  },

  // 마키 슬라이드 컨테이너 / Marquee Slide Container
  marqueeContainer: {
    overflow: "hidden",
    width: "100%",
    marginBottom: "16px",
  },

  // 마키 슬라이드 래퍼 / Marquee Slide Wrapper
  marqueeWrapper: {
    overflow: "hidden",
    width: "100%",
  },
};