import React from "react";
import ProcessStepsSection from "./ProcessStepsSection";
import SmartOrderProcessSection from "./SmartOrderProcessSection";
import LimitedCategorySection from "./LimitedCategorySection";
import PortfolioSection from "./PortfolioSection";
import CertifiedSection from "./CertifiedSection";
import PartnerBrandSection from "./PartnerBrandSection";
import FAQSection from "./FAQSection";
import ContactSection from "./ContactSection";

/**
 * QudisomHomeSection Component
 * 쿠디솜 메인 홈페이지 Hero 및 Factory 섹션 / Qudisom Main Home Hero & Factory Section
 * 
 * 브랜드 컬러 / Brand Colors:
 * - Main: #ffd93d (Yellow - 버튼, 액센트에 사용 / Used for buttons, accents)
 * - Sub: #1a2867 (Navy - 포인트 요소에 사용 / Used for point elements)
 * - Text: Black, Gray 계열 사용 / Black, Gray tones for text
 */

// 화살표 아이콘 컴포넌트 / Arrow Icon Component
const ArrowRightIcon = () => (
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
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// 공장 아이콘 컴포넌트 / Factory Icon Component
const FactoryIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 20h20" />
    <path d="M5 20V8l5 4V8l5 4V4h5v16" />
    <path d="M9 16h1M14 16h1" />
  </svg>
);

// 체크 아이콘 컴포넌트 / Check Icon Component
const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function QudisomHomeSection() {
  // 직영 공장의 핵심 가치 / Key values of direct production factory
  const factoryValues = [
    "중간 유통 없는 직영 생산 / Direct production without intermediaries",
    "품질과 가격의 완벽한 균형 / Perfect balance of quality and price",
    "디테일까지 관리하는 제작 과정 / Manufacturing process managing every detail",
  ];

  return (
    <div style={styles.container}>
      {/* 직영 공장 섹션 / Direct Production Factory Section */}
      <section style={{ ...styles.factorySection, position: "relative", backgroundColor: "#ffffff", overflow: "hidden" }}>
        {/* 배경 장식 요소 / Background decorative elements */}
        <div style={styles.heroBgDecor} />
        <div style={styles.heroBgDecorSub} />
        
        <div style={styles.factorySectionInner}>
          {/* 섹션 헤더 / Section header */}
          <div style={{ ...styles.factoryHeader, position: "relative", zIndex: 1 }}>
            <div style={{...styles.factoryIconWrapper, backgroundColor: "#fab803", color: "#000000"}}>
              <FactoryIcon />
            </div>
            <span style={{...styles.factoryLabel, fontSize: "15.6px", color: "#1a2867"}}>DIRECT PRODUCTION FACTORY</span>
          </div>

          {/* 메인 콘텐츠 영역 / Main content area */}
          <div style={{ ...styles.factoryContent, position: "relative", zIndex: 1 }}>
            {/* 왼쪽: 텍스트 콘텐츠 / Left: Text content */}
            <div style={styles.factoryTextContent}>
              <h2 style={styles.factoryTitle}>
                중간 유통 없이,
                <br />
                <span style={styles.factoryTitleAccent}>직영 공장</span>에서 직접 제작
              </h2>

              <p style={{...styles.factoryDescription, lineHeight: 2}}>
                쿠디솜은 품질과 가격의 균형을 완벽하게 맞춥니다.
                <br />
                단순히 '저렴한' 가격에 집중하는 것이 아닌, 제작 과정의 모든 순간을 관리하여
                <br />
                클라이언트가 원하는 디테일까지 놓치지 않습니다.
              </p>

              {/* 핵심 가치 리스트 / Key values list */}
              <ul style={styles.valuesList}>
                {factoryValues.map((value, index) => (
                  <li key={index} style={styles.valueItem}>
                    <div style={{...styles.valueIconWrapper, backgroundColor: "#fab803", color: "#1a2867"}}>
                      <CheckIcon />
                    </div>
                    <span style={styles.valueText}>{value.split(" / ")[0]}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 오른쪽: 유튜브 영상 / Right: YouTube video */}
            <div style={styles.videoWrapper}>
              <div style={styles.videoContainer}>
                <iframe
                  src="https://www.youtube.com/embed/Mm0M8ObcViE"
                  title="쿠디솜 직영 공장 소개 / Qudisom Factory Introduction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={styles.videoIframe}
                />
              </div>
              {/* 영상 하단 캡션 / Video caption */}
              <p style={styles.videoCaption}>
                쿠디솜 직영 공장 제작 과정 보기
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 제작 과정 섹션 / Production Process Section */}
      <ProcessStepsSection />

      {/* 스마트 주문 프로세스 섹션 / Smart Order Process Section */}
      <SmartOrderProcessSection />

      {/* 제한된 카테고리 섹션 / Limited Category Section */}
      <LimitedCategorySection />

      {/* 포트폴리오 섹션 / Portfolio Section */}
      <PortfolioSection />

      {/* 인증 섹션 / Certified Section */}
      <CertifiedSection />

      {/* 파트너 브랜드 섹션 / Partner Brand Section */}
      <PartnerBrandSection />

      {/* FAQ 섹션 / FAQ Section */}
      <FAQSection />

      {/* 연락처 섹션 / Contact Section */}
      <ContactSection />
    </div>
  );
}

// 스타일 정의 / Style definitions
const styles: { [key: string]: React.CSSProperties } = {
  // 컨테이너 / Container
  container: {
    width: "100%",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: "#ffffff",
    overflowX: "hidden",
  },

  // ===== 공장 섹션 스타일 / Factory Section Styles =====
  factorySection: {
    padding: "120px 24px",
    backgroundColor: "#f9fafb",
  },

  factorySectionInner: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  // 섹션 헤더 / Section header
  factoryHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "48px",
  },

  factoryIconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    backgroundColor: "#1a2867",
    borderRadius: "12px",
    color: "#ffffff",
  },

  factoryLabel: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#1a2867",
    letterSpacing: "1px",
  },

  // 메인 콘텐츠 / Main content
  factoryContent: {
    display: "flex",
    gap: "60px",
    alignItems: "flex-start",
    flexWrap: "wrap" as const,
  },

  // 텍스트 콘텐츠 / Text content
  factoryTextContent: {
    flex: "1 1 400px",
    minWidth: "300px",
  },

  factoryTitle: {
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 700,
    color: "#191f28",
    lineHeight: 1.35,
    margin: 0,
    marginBottom: "24px",
    letterSpacing: "-0.02em",
  },

  factoryTitleAccent: {
    color: "#1a2867",
  },

  factoryDescription: {
    fontSize: "16px",
    color: "#6b7684",
    lineHeight: 1.8,
    margin: 0,
    marginBottom: "36px",
  },

  // 가치 리스트 / Values list
  valuesList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  valueItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  valueIconWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    backgroundColor: "rgba(255, 217, 61, 0.2)",
    borderRadius: "8px",
    color: "#1a2867",
    flexShrink: 0,
  },

  valueText: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#333d4b",
  },

  // 비디오 래퍼 / Video wrapper
  videoWrapper: {
    flex: "1 1 500px",
    minWidth: "300px",
  },

  videoContainer: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%", // 16:9 비율 / 16:9 aspect ratio
    borderRadius: "20px",
    overflow: "hidden",
    backgroundColor: "#191f28",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
  },

  videoIframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },

  videoCaption: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#8b95a1",
    textAlign: "center",
  },

  // 배경 장식 / Background decoration
  heroBgDecor: {
    position: "absolute",
    top: "-20%",
    right: "-10%",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 217, 61, 0.15) 0%, rgba(255, 217, 61, 0) 70%)",
    pointerEvents: "none",
  },

  heroBgDecorSub: {
    position: "absolute",
    bottom: "-10%",
    left: "-5%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(26, 40, 103, 0.08) 0%, rgba(26, 40, 103, 0) 70%)",
    pointerEvents: "none",
  },
};