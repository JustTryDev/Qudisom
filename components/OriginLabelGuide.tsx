import React, { useState, useRef } from "react";

/**
 * 원산지 라벨 표기 가이드 페이지 컴포넌트
 * Origin Label Guide Page Component
 * 
 * 브랜드 컬러 (Brand Colors):
 * - 메인 (Main): #ffd93d
 * - 서브 (Sub): #1a2867
 */

// 아이콘 컴포넌트들 (Icon Components)
const TagIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 7.5H7.51M21 12L13 20C12.5 20.5 11.5 20.5 11 20L3 12V3H12L21 12C21.5 12.5 21.5 13.5 21 14L21 12Z" stroke="#1a2867" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6V9.5M9 12V12.01" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2.5 14.5L9 3L15.5 14.5H2.5Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7.5" stroke="#dc2626" strokeWidth="1.5"/>
    <path d="M9 5.5V9.5M9 12V12.01" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChevronIcon = ({ isOpen, color = "#64748b" }: { isOpen: boolean; color?: string }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 20 20" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ 
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease'
    }}
  >
    <path d="M5 7.5L10 12.5L15 7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ZoomIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="#ffffff" strokeWidth="1.5"/>
    <path d="M11 11L14 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 5V9M5 7H9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XMarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12M4 4L12 12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ScissorsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="5" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 6.5L17 15M7 13.5L17 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const RulerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 6V9M8 6V10M11 6V9M14 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10.5C11.1046 10.5 12 9.60457 12 8.5C12 7.39543 11.1046 6.5 10 6.5C8.89543 6.5 8 7.39543 8 8.5C8 9.60457 8.89543 10.5 10 10.5Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 17.5C10 17.5 16 13 16 8.5C16 5.18629 13.3137 2.5 10 2.5C6.68629 2.5 4 5.18629 4 8.5C4 13 10 17.5 10 17.5Z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// 일반 라벨 데이터 (Basic label data)
const basicLabel = {
  title: "일반 라벨",
  desc: "백색 라벨 단면에 'Made in China' 표기",
  badge: "기본",
  badgeColor: "#64748b",
  imageUrl: "https://cdn.imweb.me/thumbnail/20251024/43b62f166da36.jpg",
};

// 커스텀 라벨 데이터 (Custom label data)
const customLabels = [
  {
    id: "logo",
    title: "로고 추가",
    desc: "기본 라벨 반대 면에 로고만 추가",
    imageUrl: "https://cdn.imweb.me/thumbnail/20251024/e2d91cacb0ee5.jpg",
  },
  {
    id: "full",
    title: "풀커스텀",
    desc: "색상, 크기, 디자인 전체 커스터마이징",
    imageUrl: "https://cdn.imweb.me/thumbnail/20251024/e2d91cacb0ee5.jpg",
  },
];

// 무지 라벨 데이터 (Blank label data)
const blankLabel = {
  title: "무지 라벨",
  desc: "샘플 제작 시 위치·크기 확인 용도",
  badge: "샘플용",
  badgeColor: "#f59e0b",
  imageUrl: "https://cdn.imweb.me/thumbnail/20251024/43b62f166da36.jpg",
};

export default function OriginLabelGuide({ onConfirmationChange }: { onConfirmationChange?: (confirmed: boolean) => void }) {
  // 아코디언 상태 관리 (Accordion state management)
  const [openSection, setOpenSection] = useState<string | null>("sample");
  
  // 커스텀 라벨 탭 상태 관리 (Custom label tab state management)
  const [customTab, setCustomTab] = useState<string>("logo");
  
  // 이미지 모달 상태 관리 (Image modal state management)
  const [modalImage, setModalImage] = useState<{ title: string; url: string } | null>(null);

  // 확인 상태 관리 (Confirmation state management)
  const [sampleConfirmed, setSampleConfirmed] = useState<boolean>(false);
  const [labelTypeConfirmed, setLabelTypeConfirmed] = useState<boolean>(false);
  
  // ref for scrolling (스크롤을 위한 ref)
  const labelTypesRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // 샘플 섹션 확인 핸들러 (Sample section confirmation handler)
  const handleSampleConfirm = () => {
    setSampleConfirmed(true);
    setOpenSection("types");
    setTimeout(() => {
      labelTypesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // 라벨 종류 섹션 확인 핸들러 (Label types section confirmation handler)
  const handleLabelTypeConfirm = () => {
    setLabelTypeConfirmed(true);
  };

  // 확인 상태 변경 시 부모에게 알림 (Notify parent when confirmation state changes)
  React.useEffect(() => {
    if (onConfirmationChange) {
      onConfirmationChange(sampleConfirmed && labelTypeConfirmed);
    }
  }, [sampleConfirmed, labelTypeConfirmed, onConfirmationChange]);

  // 현재 선택된 커스텀 라벨 데이터 (Current selected custom label data)
  const currentCustomLabel = customLabels.find(label => label.id === customTab) || customLabels[0];

  return (
    <div style={styles.container}>
      {/* 헤더 섹션 (Header Section) */}
      <div style={styles.header}>
        <h1 style={styles.title}>원산지 라벨 표기 가이드</h1>
      </div>

      {/* 원칙 안내 카드 (Principle card) */}
      <div style={styles.principleCard}>
        <div style={styles.principleHeader}>
          <span style={styles.principleLabel}>표기 원칙</span>
        </div>
        <p style={styles.principleText}>
          <strong>[대외무역법]</strong>에 의거하여, 원산지 표기(라벨)는 
          제품 본품에 <strong>'봉제'</strong>하는 것을 원칙으로 합니다.
        </p>
      </div>

      {/* 주의사항 박스 (Warning box) */}
      <div style={styles.warningCard}>
        <div style={styles.warningHeader}>
          <WarningIcon />
          <span style={styles.warningTitle}>주의사항</span>
        </div>
        <p style={styles.warningText}>
          제품 본품에 라벨로 봉제하지 않고, OPP 포장 후 <strong>스티커 부착</strong>으로 
          표기하는 경우에도 대부분 문제없이 통관(<strong>90% 이상</strong>)됩니다.
        </p>
        <div style={styles.warningDivider} />
        <p style={styles.warningTextDanger}>
          단, 낮은 확률(<strong>10% 이하</strong>)로 선별 검사 대상이 될 경우 
          반드시 라벨 봉제가 필요하며, 세관에서 랜덤으로 작업을 진행하기 때문에 라벨 사이즈나 소재, 위치 등을 지정할 수 없습니다.
          <br /><br />
          또한 이 과정에서 일정 지연이나 추가 비용이 발생하는 경우, 모두 <strong>제작자의 귀책사유</strong>로 제작자에게 비용이 청구됩니다.
        </p>
      </div>

      {/* 샘플 제작 전 필수 확인 아코디언 (Pre-sample checklist accordion) */}
      <div style={styles.accordionHighlight}>
        <button 
          style={styles.accordionHeaderHighlight}
          onClick={() => toggleSection("sample")}
        >
          <div style={styles.accordionHeaderLeft}>
            <span style={styles.accordionBadge}>필독</span>
            <span style={styles.accordionTitleHighlight}>샘플 제작 전 필수 확인</span>
          </div>
          <ChevronIcon isOpen={openSection === "sample"} color="#ffffff" />
        </button>
        
        {openSection === "sample" && (
          <div style={styles.accordionContent}>
            {/* 디자인 파일 표기 안내 (Design file marking guide) */}
            <div style={styles.ruleSection}>
              <div style={styles.ruleSectionHeader}>
                <LocationIcon />
                <span style={styles.ruleSectionTitle}>디자인 파일에 위치 표기</span>
              </div>
              <div 
                style={styles.exampleImageWrapper}
                onClick={() => setModalImage({ 
                  title: "라벨 위치 표기 예시", 
                  url: "https://cdn.imweb.me/thumbnail/20251024/2c5c0244c70be.png" 
                })}
              >
                <img 
                  src="https://cdn.imweb.me/thumbnail/20251024/2c5c0244c70be.png" 
                  alt="라벨 위치 표기 예시"
                  style={styles.exampleImage}
                />
                <div style={styles.exampleImageOverlay}>
                  <ZoomIcon />
                  <span style={styles.exampleImageText}>클릭하여 확대</span>
                </div>
              </div>
            </div>

            {/* 부착 위치 규칙 (Attachment rules) */}
            <div style={styles.ruleSection}>
              <div style={styles.ruleCards}>
                <div style={styles.ruleCardSuccess}>
                  <CheckIcon />
                  <span style={styles.ruleCardText}>
                    <strong>봉제선이 있는 곳</strong>에만 부착 가능
                  </span>
                </div>
                <div style={styles.ruleCardDanger}>
                  <XMarkIcon />
                  <span style={styles.ruleCardText}>
                    <strong>봉제선이 없는 곳</strong>에는 부착 불가
                  </span>
                </div>
              </div>
              <p style={{
                fontSize: "13px",
                color: "#713f12",
                backgroundColor: "#fefce8",
                border: "1px solid #fef08a",
                padding: "14px",
                borderRadius: "10px",
                margin: "0",
                lineHeight: "1.6",
              }}>
                샘플 제작 전에는 봉제선의 위치를 정확히 파악하기 어려워, 요청하신 위치에 라벨 부착이 불가능 할 수 있습니다.
              </p>
            </div>

            {/* 무지 라벨 및 비용 안내 (Blank label and cost notice) */}
            <div style={styles.sampleLabelNotice}>
              <div style={styles.sampleLabelNoticeHeader}>
                <TagIcon />
                <span style={styles.sampleLabelNoticeTitle}>샘플 제작 시 라벨 안내</span>
              </div>
              
              {/* 무지 라벨 카드 (Blank label card) */}
              <div style={styles.labelCardInSection}>
                <div style={styles.labelCardHeader}>
                  <div style={styles.labelCardInfo}>
                    <span style={styles.labelCardTitle}>{blankLabel.title}</span>
                    <span style={styles.labelCardDesc}>{blankLabel.desc}</span>
                  </div>
                  <span style={{
                    ...styles.labelCardBadge,
                    backgroundColor: blankLabel.badgeColor,
                  }}>
                    {blankLabel.badge}
                  </span>
                </div>
                <div 
                  style={styles.labelCardImageWrapper}
                  onClick={() => setModalImage({ title: blankLabel.title, url: blankLabel.imageUrl })}
                >
                  <img 
                    src={blankLabel.imageUrl} 
                    alt={`${blankLabel.title} 예시`}
                    style={styles.labelCardImage}
                  />
                  <div style={styles.labelCardImageOverlay}>
                    <ZoomIcon />
                  </div>
                </div>
              </div>

              <div style={styles.costAlertBox}>
                <AlertIcon />
                <p style={styles.costAlertText}>
                  <strong>라벨 샘플 제작</strong>을 원하실 경우 추가 비용 
                  <strong style={{ color: "#dc2626" }}> 100,000원</strong>이 발생하며, 
                  <strong> 제작 기간이 지연</strong>될 수 있습니다.
                </p>
              </div>
            </div>

            {/* 확인 버튼 (Confirmation button) */}
            <button 
              style={{
                ...styles.confirmButton,
                ...(sampleConfirmed ? styles.confirmButtonDisabled : {})
              }}
              onClick={handleSampleConfirm}
              disabled={sampleConfirmed}
            >
              {sampleConfirmed ? '✓ 확인완료' : '확인했어요!'}
            </button>
          </div>
        )}
      </div>

      {/* 라벨 종류 아코디언 (Label types accordion) */}
      <div style={styles.accordion} ref={labelTypesRef}>
        <button 
          style={styles.accordionHeader}
          onClick={() => toggleSection("types")}
        >
          <span style={styles.accordionTitle}>라벨 디자인 종류</span>
          <ChevronIcon isOpen={openSection === "types"} />
        </button>
        
        {openSection === "types" && (
          <div style={styles.accordionContent}>
            {/* 일반 라벨 카드 (Basic label card) */}
            <div style={styles.labelCard}>
              <div style={styles.labelCardHeader}>
                <div style={styles.labelCardInfo}>
                  <span style={styles.labelCardTitle}>{basicLabel.title}</span>
                  <span style={styles.labelCardDesc}>{basicLabel.desc}</span>
                </div>
                <span style={{
                  ...styles.labelCardBadge,
                  backgroundColor: basicLabel.badgeColor,
                }}>
                  {basicLabel.badge}
                </span>
              </div>
              <div 
                style={styles.labelCardImageWrapper}
                onClick={() => setModalImage({ title: basicLabel.title, url: basicLabel.imageUrl })}
              >
                <img 
                  src={basicLabel.imageUrl} 
                  alt={`${basicLabel.title} 예시`}
                  style={styles.labelCardImage}
                />
                <div style={styles.labelCardImageOverlay}>
                  <ZoomIcon />
                </div>
              </div>
            </div>

            {/* 커스텀 라벨 탭 영역 (Custom label tab area) */}
            <div style={styles.customLabelSection}>
              <div style={styles.customLabelHeader}>
                <span style={styles.customLabelTitle}>커스텀 라벨</span>
                <span style={styles.customLabelBadge}>커스텀</span>
              </div>
              
              {/* 탭 버튼들 (Tab buttons) */}
              <div style={styles.tabContainer}>
                {customLabels.map((label) => (
                  <button
                    key={label.id}
                    style={{
                      ...styles.tabButton,
                      ...(customTab === label.id ? styles.tabButtonActive : {}),
                    }}
                    onClick={() => setCustomTab(label.id)}
                  >
                    {label.title}
                  </button>
                ))}
              </div>

              {/* 탭 콘텐츠 (Tab content) */}
              <div style={styles.tabContent}>
                <p style={styles.tabContentDesc}>{currentCustomLabel.desc}</p>
                <div 
                  style={{
                    position: "relative" as const,
                    width: "100%",
                    aspectRatio: "16/9",
                    cursor: "pointer",
                    overflow: "hidden",
                    borderRadius: "8px",
                  }}
                  onClick={() => setModalImage({ title: `커스텀 라벨 (${currentCustomLabel.title})`, url: currentCustomLabel.imageUrl })}
                >
                  <img 
                    src={currentCustomLabel.imageUrl} 
                    alt={`${currentCustomLabel.title} 예시`}
                    style={styles.labelCardImage}
                  />
                  <div style={styles.labelCardImageOverlay}>
                    <ZoomIcon />
                  </div>
                </div>
              </div>
            </div>

            {/* 확인 버튼 (Confirmation button) */}
            <button 
              style={{
                ...styles.confirmButton,
                ...(labelTypeConfirmed ? styles.confirmButtonDisabled : {})
              }}
              onClick={handleLabelTypeConfirm}
              disabled={labelTypeConfirmed}
            >
              {labelTypeConfirmed ? '✓ 확인완료' : '확인했어요!'}
            </button>
          </div>
        )}
      </div>

      {/* 이미지 모달 (Image Modal) */}
      {modalImage && (
        <div style={styles.modalOverlay} onClick={() => setModalImage(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setModalImage(null)}>
              <CloseIcon />
            </button>
            <img 
              src={modalImage.url} 
              alt={`${modalImage.title} 예시`}
              style={styles.modalImage}
            />
            <p style={styles.modalTitle}>{modalImage.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// 스타일 정의 (Style definitions)
const styles: { [key: string]: React.CSSProperties } = {
  // 컨테이너 (Container)
  container: {
    maxWidth: "420px",
    margin: "0 auto",
    padding: "0px 20px 24px", // 상단 패딩 최소화 (Top padding minimized)
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
  },

  // 헤더 (Header)
  header: {
    textAlign: "center",
    marginBottom: "16px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0",
    letterSpacing: "-0.3px",
  },

  // 원칙 카드 (Principle card)
  principleCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "12px",
  },
  principleHeader: {
    marginBottom: "10px",
  },
  principleLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1a2867",
    backgroundColor: "#e8ebf4",
    padding: "4px 10px",
    borderRadius: "6px",
  },
  principleText: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#475569",
    margin: "0",
  },

  // 주의사항 카드 (Warning card)
  warningCard: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "16px",
  },
  warningHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  warningTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#92400e",
  },
  warningText: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#92400e",
    margin: "0",
  },
  warningDivider: {
    height: "1px",
    backgroundColor: "#fcd34d",
    margin: "12px 0",
  },
  warningTextDanger: {
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#b91c1c",
    margin: "0",
  },

  // 강조 아코디언 (Highlight accordion)
  accordionHighlight: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "2px solid #1a2867",
    marginBottom: "12px",
    overflow: "hidden",
  },
  accordionHeaderHighlight: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 18px",
    backgroundColor: "#1a2867",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  accordionHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  accordionBadge: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#1a2867",
    backgroundColor: "#ffd93d",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  accordionTitleHighlight: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#ffffff",
  },

  // 일반 아코디언 (Normal accordion)
  accordion: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    marginBottom: "12px",
    overflow: "hidden",
  },
  accordionHeader: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 18px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  accordionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e293b",
  },
  accordionContent: {
    padding: "18px 18px 18px 18px",
  },

  // 규칙 섹션 (Rule section)
  ruleSection: {
    marginBottom: "20px",
  },
  ruleSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
    color: "#1a2867",
  },
  ruleSectionTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  ruleSectionDesc: {
    fontSize: "13px",
    color: "#475569",
    margin: "0 0 12px 0",
    lineHeight: "1.5",
  },
  ruleCards: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "12px",
  },
  ruleCardSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
  },
  ruleCardDanger: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
  },
  ruleCardText: {
    fontSize: "13px",
    color: "#1e293b",
  },
  ruleNotice: {
    fontSize: "12px",
    color: "#64748b",
    backgroundColor: "#f8fafc",
    padding: "12px",
    borderRadius: "8px",
    margin: "0",
    lineHeight: "1.6",
  },

  // 예시 이미지 (Example image)
  exampleImageWrapper: {
    position: "relative",
    width: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
  },
  exampleImage: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  exampleImageOverlay: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  exampleImageText: {
    fontSize: "12px",
    color: "#ffffff",
    fontWeight: "500",
  },

  // 샘플 라벨 안내 (Sample label notice)
  sampleLabelNotice: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "24px",
  },
  sampleLabelNoticeHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
    color: "#1a2867",
  },
  sampleLabelNoticeTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  sampleLabelNoticeText: {
    fontSize: "13px",
    color: "#475569",
    margin: "0 0 12px 0",
    lineHeight: "1.6",
  },
  costAlertBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "12px 14px",
  },
  costAlertText: {
    fontSize: "13px",
    color: "#991b1b",
    margin: "0",
    lineHeight: "1.5",
  },

  // 라벨 카드 (Label card)
  labelCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "12px",
  },
  labelCardInSection: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "12px",
    border: "1px solid #e2e8f0",
  },
  labelCardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "14px",
    gap: "12px",
  },
  labelCardInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  labelCardTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  labelCardDesc: {
    fontSize: "12px",
    color: "#64748b",
    lineHeight: "1.4",
  },
  labelCardBadge: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#ffffff",
    padding: "4px 8px",
    borderRadius: "4px",
    flexShrink: 0,
  },
  labelCardImageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    cursor: "pointer",
    overflow: "hidden",
  },
  labelCardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  labelCardImageOverlay: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: "1",
  },

  // 커스텀 라벨 섹션 (Custom label section)
  customLabelSection: {
    backgroundColor: "#f0f3f9",
    border: "1px solid #c7d0e8",
    borderRadius: "12px",
    padding: "14px",
    marginBottom: "12px",
  },
  customLabelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  customLabelTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a2867",
  },
  customLabelBadge: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#1a2867",
    padding: "4px 8px",
    borderRadius: "4px",
  },

  // 탭 (Tab)
  tabContainer: {
    display: "flex",
    gap: "6px",
    marginBottom: "12px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "4px",
  },
  tabButton: {
    flex: "1",
    padding: "10px 8px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#64748b",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  tabButtonActive: {
    backgroundColor: "#1a2867",
    color: "#ffffff",
    fontWeight: "600",
  },
  tabContent: {
  },
  tabContentDesc: {
    fontSize: "13px",
    color: "#475569",
    margin: "0 0 12px 0",
    lineHeight: "1.5",
  },

  // 모달 (Modal)
  modalOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "1000",
    padding: "20px",
  },
  modalContent: {
    position: "relative",
    maxWidth: "90vw",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: "-40px",
    right: "0",
    width: "32px",
    height: "32px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    maxWidth: "100%",
    maxHeight: "80vh",
    borderRadius: "12px",
    objectFit: "contain",
  },
  modalTitle: {
    fontSize: "14px",
    color: "#ffffff",
    marginTop: "16px",
    fontWeight: "500",
  },

  // 확인 버튼 (Confirmation button)
  confirmButton: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#1a2867",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    marginTop: "16px",
  },
  confirmButtonDisabled: {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed",
  },
};