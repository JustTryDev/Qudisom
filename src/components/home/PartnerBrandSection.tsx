import React from "react";

/**
 * PartnerBrandSection Component
 * 쿠디솜 파트너 브랜드 섹션 / Qudisom Partner Brand Section
 * 무한 마키 로고 슬라이드 / Infinite marquee logo slide
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

// ========== 파트너 데이터 (Partner Data) - 50개 ==========
const PARTNER_DATA = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Partner ${i + 1}`,
  logo: "https://cdn.imweb.me/thumbnail/20250802/4006eeffacc2e.jpg",
}));

// 3줄로 분리 / Split into 3 rows
const ROW_1 = PARTNER_DATA.slice(0, 17);
const ROW_2 = PARTNER_DATA.slice(17, 34);
const ROW_3 = PARTNER_DATA.slice(34, 50);

// ========== 메인 컴포넌트 (Main Component) ==========
export default function PartnerBrandSection() {
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
        
        .logo-marquee-track {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        
        .logo-marquee-track-reverse {
          display: flex;
          animation: marqueeReverse 30s linear infinite;
        }
        
        .logo-marquee-track-slow {
          display: flex;
          animation: marquee 40s linear infinite;
        }
        
        .logo-marquee-container {
          position: relative;
        }
        
        .logo-marquee-container::before,
        .logo-marquee-container::after {
          content: '';
          position: absolute;
          top: 0;
          width: 100px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }
        
        .logo-marquee-container::before {
          left: 0;
          background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
        }
        
        .logo-marquee-container::after {
          right: 0;
          background: linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
        }
        
        .logo-marquee-container:hover .logo-marquee-track,
        .logo-marquee-container:hover .logo-marquee-track-reverse,
        .logo-marquee-container:hover .logo-marquee-track-slow {
          animation-play-state: paused;
        }
        
        .logo-item {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0.7;
        }
        
        .logo-item:hover {
          opacity: 1;
          transform: scale(1.05);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* 모바일 / Mobile */
        @media (max-width: 640px) {
          .logo-marquee-track,
          .logo-marquee-track-reverse {
            animation-duration: 15s;
          }
          .logo-marquee-track-slow {
            animation-duration: 20s;
          }
          
          .logo-marquee-container::before,
          .logo-marquee-container::after {
            width: 50px;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* 헤더 영역 / Header Area */}
        <div style={styles.header}>
          <div style={styles.labelBadge}>
            <span style={styles.labelText}>PARTNER BRAND</span>
          </div>
          
          <h2 style={styles.title}>
            프로젝트의 크기가 아닌,
            <br />
            <span style={styles.titleHighlight}>브랜드의 스토리</span>를 만듭니다
          </h2>
          
          {/* 3문장 동일 간격 / 3 sentences with equal spacing */}
          <div style={styles.descriptionWrapper}>
            <p style={styles.descriptionLine}>
              SMB규모의 중소기업부터 대기업, 공공기관까지
            </p>
            <p style={styles.descriptionLine}>
              모든 클라이언트를 동등하게 대하며, 차별하지 않습니다.
            </p>
            <p style={styles.descriptionLine}>
              쿠디솜은 브랜드의 가치를 담아내는 파트너입니다.
            </p>
          </div>
        </div>

        {/* 로고 마키 영역 / Logo Marquee Area */}
        <div style={styles.marqueeWrapper}>
          {/* 첫 번째 줄 (왼쪽으로) / First row (to left) */}
          <div style={styles.marqueeContainer} className="logo-marquee-container">
            <div className="logo-marquee-track">
              {[...ROW_1, ...ROW_1].map((partner, index) => (
                <div key={`row1-${partner.id}-${index}`} style={styles.logoItem} className="logo-item">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={styles.logoImage}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 두 번째 줄 (오른쪽으로) / Second row (to right) */}
          <div style={styles.marqueeContainer} className="logo-marquee-container">
            <div className="logo-marquee-track-reverse">
              {[...ROW_2, ...ROW_2].map((partner, index) => (
                <div key={`row2-${partner.id}-${index}`} style={styles.logoItem} className="logo-item">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={styles.logoImage}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 세 번째 줄 (왼쪽으로, 느리게) / Third row (to left, slower) */}
          <div style={styles.marqueeContainer} className="logo-marquee-container">
            <div className="logo-marquee-track-slow">
              {[...ROW_3, ...ROW_3].map((partner, index) => (
                <div key={`row3-${partner.id}-${index}`} style={styles.logoItem} className="logo-item">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={styles.logoImage}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== 스타일 정의 (Style Definitions) ==========
const styles: { [key: string]: React.CSSProperties } = {
  // 섹션 (흰색 배경) / Section (White background)
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
    maxWidth: "1400px",
    margin: "0 auto",
  },

  // 헤더 / Header
  header: {
    textAlign: "center",
    marginBottom: "56px",
    padding: "0 24px",
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

  // 설명 래퍼 (동일 간격) / Description Wrapper (equal spacing)
  descriptionWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },

  // 설명 라인 / Description Line
  descriptionLine: {
    fontSize: "clamp(14px, 1.5vw, 16px)",
    color: BRAND_COLORS.text.tertiary,
    margin: 0,
    lineHeight: 1.6,
  },

  // 마키 래퍼 / Marquee Wrapper
  marqueeWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },

  // 마키 컨테이너 / Marquee Container
  marqueeContainer: {
    width: "100%",
    overflow: "hidden",
  },

  // 로고 아이템 / Logo Item
  logoItem: {
    flexShrink: 0,
    width: "140px",
    height: "80px",
    marginRight: "16px",
    backgroundColor: BRAND_COLORS.background.primary,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    cursor: "pointer",
  },

  // 로고 이미지 / Logo Image
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
};