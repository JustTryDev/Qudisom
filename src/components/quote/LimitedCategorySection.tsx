import React from "react";

/**
 * LimitedCategorySection Component
 * 쿠디솜 리미티드 카테고리 섹션 / Qudisom Limited Category Section
 * BEST ITEM 4가지 카테고리 표시 / Display 4 best item categories
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

// ========== 카테고리 데이터 (Category Data) ==========
const CATEGORY_DATA = [
  { 
    id: 1, 
    title: "인형", 
    titleEn: "Plush Doll",
    image: "https://cdn.imweb.me/thumbnail/20250801/023fa6148821b.png" 
  },
  { 
    id: 2, 
    title: "인형 키링", 
    titleEn: "Plush Keyring",
    image: "https://cdn.imweb.me/thumbnail/20250801/023fa6148821b.png" 
  },
  { 
    id: 3, 
    title: "쿠션", 
    titleEn: "Cushion",
    image: "https://cdn.imweb.me/thumbnail/20250801/023fa6148821b.png" 
  },
  { 
    id: 4, 
    title: "슬리퍼", 
    titleEn: "Slipper",
    image: "https://cdn.imweb.me/thumbnail/20250801/023fa6148821b.png" 
  },
];

// ========== 메인 컴포넌트 (Main Component) ==========
export default function LimitedCategorySection() {
  return (
    <section style={styles.section}>
      {/* CSS 스타일 / CSS Styles */}
      <style>{`
        .category-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .category-card:hover {
          transform: translateY(-8px);
        }
        
        .category-card:hover .category-image {
          transform: scale(1.05);
        }
        
        .category-card:hover .category-overlay {
          opacity: 1;
        }
        
        .category-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        
        /* 태블릿 / Tablet */
        @media (max-width: 1024px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        
        /* 모바일 / Mobile */
        @media (max-width: 640px) {
          .category-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* 헤더 영역 / Header Area */}
        <div style={styles.header}>
          <div style={styles.labelBadge}>
            <span style={styles.labelText}>LIMITED CATEGORY</span>
          </div>
          
          <h2 style={styles.title}>
            쿠디솜은 <span style={styles.titleHighlight}>'모든 것'</span>을 만들지 않습니다.
          </h2>
          
          <p style={{ ...styles.description, marginBottom: '12px' }}>
            무엇이든 만들 수 있지만, 아무거나 만들지 않습니다.
          </p>
          
          <p style={{ ...styles.description, marginBottom: '12px' }}>
            업계 최고 수준의 제작 기술을 자부할 수 있는 제품만 제작합니다.
          </p>
          
          <p style={styles.description}>
            작품의 완성도를 높이기 위해, 쿠디솜은 선택과 집중을 합니다.
          </p>
        </div>

        {/* BEST ITEM 라벨 / BEST ITEM Label */}
        <div style={styles.bestItemLabel}>
          <span style={{...styles.bestItemText, fontSize: "28px"}}>BEST ITEM</span>
          <div style={styles.bestItemLine} />
        </div>

        {/* 카테고리 그리드 / Category Grid */}
        <div className="category-grid">
          {CATEGORY_DATA.map((category) => (
            <div key={category.id} className="category-card" style={styles.card}>
              {/* 이미지 컨테이너 / Image Container */}
              <div style={styles.imageContainer}>
                <img
                  src={category.image}
                  alt={category.title}
                  style={styles.categoryImage}
                  className="category-image"
                />
                {/* 호버 오버레이 / Hover Overlay */}
                <div style={styles.categoryOverlay} className="category-overlay">
                  <span style={styles.overlayText}>VIEW MORE</span>
                </div>
              </div>
              
              {/* 카드 콘텐츠 / Card Content */}
              <div style={{...styles.cardContent, backgroundColor: BRAND_COLORS.primary}}>
                <h3 style={styles.cardTitle}>{category.title}</h3>
                <span style={styles.cardTitleEn}>{category.titleEn}</span>
              </div>
            </div>
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

  // 서브타이틀 / Subtitle
  subtitle: {
    fontSize: "clamp(14px, 1.5vw, 16px)",
    fontWeight: 400, // 볼드 해제 (removed bold)
    color: BRAND_COLORS.text.tertiary, // description과 동일한 색상으로 변경 (changed to match description color)
    margin: 0,
    marginBottom: "12px", // description과의 간격 조정 (adjusted spacing from description)
    lineHeight: 1.6,
  },

  // 설명 / Description
  description: {
    fontSize: "clamp(14px, 1.5vw, 16px)",
    color: BRAND_COLORS.text.tertiary,
    margin: 0,
    lineHeight: 1.6,
  },

  // BEST ITEM 라벨 / BEST ITEM Label
  bestItemLabel: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
  },

  bestItemText: {
    fontSize: "14px",
    fontWeight: 700,
    color: BRAND_COLORS.secondary,
    letterSpacing: "1px",
    whiteSpace: "nowrap",
  },

  bestItemLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#E5E8EB",
  },

  // 카드 / Card
  card: {
    backgroundColor: BRAND_COLORS.background.secondary,
    borderRadius: "20px",
    overflow: "hidden",
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

  // 카테고리 이미지 / Category Image
  categoryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  },

  // 오버레이 / Overlay
  categoryOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(26, 40, 103, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },

  overlayText: {
    fontSize: "14px",
    fontWeight: 700,
    color: BRAND_COLORS.text.white,
    letterSpacing: "2px",
  },

  // 카드 콘텐츠 / Card Content
  cardContent: {
    padding: "20px",
    textAlign: "center",
  },

  // 카드 타이틀 / Card Title
  cardTitle: {
    fontSize: "clamp(16px, 2vw, 20px)",
    fontWeight: 700,
    color: BRAND_COLORS.text.primary,
    margin: 0,
    marginBottom: "4px",
  },

  // 카드 영문 타이틀 / Card English Title
  cardTitleEn: {
    fontSize: "12px",
    fontWeight: 500,
    color: BRAND_COLORS.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
};