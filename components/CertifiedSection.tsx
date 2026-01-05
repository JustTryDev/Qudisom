import React, { useState } from "react";

/**
 * CertifiedSection Component
 * 쿠디솜 인증서 섹션 / Qudisom Certification Section
 * 무한 마키 슬라이드 형태 / Infinite marquee slide style
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

// ========== 인증서 데이터 (Certification Data) ==========
const CERTIFICATION_DATA = [
  { id: 1, name: "ISO 9001", description: "품질경영시스템", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 2, name: "ISO 14001", description: "환경경영시스템", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 3, name: "KC 인증", description: "국가통합인증", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 4, name: "CE 인증", description: "유럽안전인증", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 5, name: "FDA 등록", description: "미국식품의약국", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 6, name: "OEKO-TEX", description: "섬유안전인증", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 7, name: "기업부설연구소", description: "연구개발인증", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 8, name: "벤처기업인증", description: "기술혁신기업", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 9, name: "이노비즈", description: "기술혁신인증", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 10, name: "메인비즈", description: "경영혁신인증", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 11, name: "특허등록", description: "제조공법특허", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
  { id: 12, name: "디자인등록", description: "디자인권보호", image: "https://cdn.imweb.me/thumbnail/20250724/115310d2002ce.png" },
];

// ========== 메인 컴포넌트 (Main Component) ==========
export default function CertifiedSection() {
  // 모바일 더보기 상태 관리 / Mobile "Show More" state management
  const [visibleCount, setVisibleCount] = useState(4); // 모바일 초기 표시 개수 / Initial visible count for mobile
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 감지 / Detect screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 2); // 2개씩 추가 / Add 2 more items
  };

  // 데스크탑에서는 모든 항목 표시, 모바일에서는 visibleCount만큼 표시 / Show all on desktop, limited on mobile
  const displayData = isMobile ? CERTIFICATION_DATA.slice(0, visibleCount) : CERTIFICATION_DATA;

  return (
    <section style={styles.section}>
      {/* CSS 스타일 / CSS Styles */}
      <style>{`
        .cert-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .cert-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
        }
        
        .cert-card:hover .cert-image {
          transform: scale(1.05);
        }

        /* 그리드 레이아웃 / Grid Layout */
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
          padding: 0 24px;
          margin-bottom: 48px;
        }

        /* 모바일 그리드 레이아웃 / Mobile Grid Layout */
        @media (max-width: 768px) {
          .cert-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        /* 더보기 버튼 애니메이션 / Show More Button Animation */
        .show-more-btn {
          transition: all 0.3s ease;
        }

        .show-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(250, 184, 3, 0.4) !important;
        }

        /* 데스크탑에서 더보기 버튼 숨김 / Hide show more button on desktop */
        @media (min-width: 769px) {
          .show-more-container {
            display: none !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* 헤더 영역 / Header Area */}
        <div style={styles.header}>
          <div style={styles.labelBadge}>
            <span style={styles.labelText}>CERTIFIED</span>
          </div>
          
          <h2 style={styles.title}>
            <span style={styles.titleHighlight}>신뢰</span>를 인증으로 증명합니다
          </h2>
          
          <p style={{...styles.description, lineHeight: 2}}>
            국내외 공인 인증을 통해 품질과 안전을 보장합니다.
            <br />
            쿠디솜은 검증된 파트너와 함께합니다.
          </p>
        </div>

        {/* 인증서 카운트 / Certification Count */}
        <div style={styles.countContainer}>
        </div>

        {/* 인증서 그리드 영역 / Certification Grid Area */}
        <div className="cert-grid">
          {displayData.map((cert) => (
            <div key={cert.id} style={styles.certCard} className="cert-card">
              <div style={styles.imageWrapper}>
                <img
                  src={cert.image}
                  alt={cert.name}
                  style={styles.certImage}
                  className="cert-image"
                />
              </div>
              <div style={styles.certInfo}>
                <h4 style={styles.certName}>{cert.name}</h4>
                <p style={styles.certDesc}>{cert.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 (모바일에서만 표시) / Show More Button (Mobile only) */}
        {visibleCount < CERTIFICATION_DATA.length && (
          <div style={styles.showMoreContainer}>
            <button 
              onClick={handleShowMore}
              style={styles.showMoreBtn}
              className="show-more-btn"
            >
              더보기 +{Math.min(2, CERTIFICATION_DATA.length - visibleCount)}
            </button>
          </div>
        )}

        {/* 하단 신뢰 문구 / Bottom Trust Message */}
        <div style={styles.trustMessage}>
          <div style={styles.trustIcon}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={BRAND_COLORS.secondary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <span style={styles.trustText}>
            모든 인증은 공인 기관을 통해 검증되었습니다
          </span>
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
    marginBottom: "40px",
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

  // 설명 / Description
  description: {
    fontSize: "clamp(14px, 1.5vw, 16px)",
    color: BRAND_COLORS.text.tertiary,
    margin: 0,
    lineHeight: 1.6,
  },

  // 카운트 컨테이너 / Count Container
  countContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "48px",
  },

  // 카운트 박스 / Count Box
  countBox: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: "8px",
    padding: "16px 32px",
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(255, 217, 61, 0.3)",
  },

  // 카운트 숫자 / Count Number
  countNumber: {
    fontSize: "clamp(32px, 5vw, 48px)",
    fontWeight: 800,
    color: BRAND_COLORS.text.primary,
    lineHeight: 1,
  },

  // 카운트 라벨 / Count Label
  countLabel: {
    fontSize: "clamp(14px, 2vw, 18px)",
    fontWeight: 600,
    color: BRAND_COLORS.text.primary,
  },

  // 마키 래퍼 / Marquee Wrapper
  marqueeWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "48px",
  },

  // 마키 컨테이너 / Marquee Container
  marqueeContainer: {
    width: "100%",
    overflow: "hidden",
  },

  // 인증서 카드 / Certification Card
  certCard: {
    backgroundColor: BRAND_COLORS.background.secondary,
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
    cursor: "pointer",
  },

  // 이미지 래퍼 / Image Wrapper
  imageWrapper: {
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    backgroundColor: BRAND_COLORS.background.primary,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },

  // 인증서 이미지 / Certification Image
  certImage: {
    width: "80%",
    height: "80%",
    objectFit: "contain",
    transition: "transform 0.3s ease",
  },

  // 인증서 정보 / Certification Info
  certInfo: {
    padding: "16px",
    textAlign: "center",
  },

  // 인증서 이름 / Certification Name
  certName: {
    fontSize: "14px",
    fontWeight: 700,
    color: BRAND_COLORS.text.primary,
    margin: 0,
    marginBottom: "4px",
  },

  // 인증서 설명 / Certification Description
  certDesc: {
    fontSize: "12px",
    fontWeight: 500,
    color: BRAND_COLORS.text.tertiary,
    margin: 0,
  },

  // 신뢰 메시지 / Trust Message
  trustMessage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "0 24px",
  },

  // 신뢰 아이콘 / Trust Icon
  trustIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // 신뢰 텍스트 / Trust Text
  trustText: {
    fontSize: "14px",
    fontWeight: 500,
    color: BRAND_COLORS.text.tertiary,
  },

  // 더보기 컨테이너 / Show More Container
  showMoreContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "48px",
  },

  // 더보기 버튼 / Show More Button
  showMoreBtn: {
    padding: "12px 24px",
    backgroundColor: BRAND_COLORS.primary,
    color: BRAND_COLORS.text.primary,
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },
};