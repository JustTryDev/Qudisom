import { useState } from "react";

/**
 * KC인증 가이드 페이지 컴포넌트
 * KC Certification Guide Page Component
 * 
 * 브랜드 컬러 (Brand Colors):
 * - 메인 (Main): #ffd93d
 * - 서브 (Sub): #1a2867
 */

// 아이콘 컴포넌트들 (Icon Components)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12M4 4L12 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7.5" stroke="#94a3b8" strokeWidth="1.5"/>
    <path d="M9 8V12M9 6V6.01" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6V9.5M9 12V12.01" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2.5 14.5L9 3L15.5 14.5H2.5Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 6.5H6.51M17.5 11.5L11.5 17.5C11.1 17.9 10.5 17.9 10.1 17.5L2.5 10V2.5H10L17.5 10.1C17.9 10.5 17.9 11.1 17.5 11.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StickerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 2.5V8C12 8.55 12.45 9 13 9H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 6.5L10 2.5L17.5 6.5V13.5L10 17.5L2.5 13.5V6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 6.5L10 10.5M10 10.5L17.5 6.5M10 10.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
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
    <path d="M5 7.5L10 12.5L15 7.5" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="#1a2867" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="#1a2867" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

// 연령대별 인증 데이터 (Age-based certification data)
const certificationData = [
  {
    category: "3세 미만 완구",
    ageRange: "36개월 미만",
    required: true,
    cost: "약 200만원~",
    period: "3~5주",
  },
  {
    category: "3세 이상~8세 미만",
    ageRange: "만 3~7세",
    required: true,
    cost: "약 150만원~",
    period: "2~4주",
  },
  {
    category: "8세 이상~13세 이하",
    ageRange: "만 8~13세",
    required: true,
    cost: "약 80만원~",
    period: "2~4주",
  },
  {
    category: "14세 이상",
    ageRange: "만 14세 이상",
    required: false,
    cost: "-",
    period: "-",
  },
];

// 기본 표기 사항 데이터 - 전기용품 및 생활용품 안전관리법 (Basic labeling items - Electrical Appliances and Consumer Products Safety Control Act)
const basicLabelingItems = [
  { name: "품명", example: "완구" },
  { name: "모델명", example: "피코 인형" },
  { name: "규격", example: "5cm x 10cm" },
  { name: "사용 연령", example: "만 8세 이상" },
  { name: "원산지", example: "중국" },
  { name: "제조년월", example: "2025.12" },
  { name: "제조원", example: "Qudisom Plush Toy Co Ltd.," },
  { name: "수입원", example: "주식회사 인프라이즈" },
  { name: "판매원", example: "쿠디솜" },
  { name: "주소", example: "인천광역시 남동구 서창남로 45, 3층" },
  { name: "고객 센터", example: "1666-0211" },
  { name: "재질", example: "코튼 100%" },
];

// KC 인증 시 추가 필수 항목 - 어린이제품 안전특별법 (Additional items for KC certification - Children's Product Safety Special Act)
const kcOnlyLabelingItems = [
  { name: "인증 번호", example: "CB123-4567" },
  { name: "인증 마크", example: "KC 인증 로고" },
  { name: "어린이 제품 주의 사항", example: "텍스트 또는 아이콘" },
  { name: "3세 미만 사용 안내", example: "사용 금지 안내" },
];

// 표기 위치 옵션 데이터 (Labeling location options data)
const labelingLocations = [
  { 
    icon: <TagIcon />, 
    title: "행택", 
    desc: "제품에 달린 태그에 표기",
    imageUrl: "https://placehold.co/400x400/f8fafc/64748b?text=행택+예시",
  },
  { 
    icon: <StickerIcon />, 
    title: "스티커", 
    desc: "포장 박스나 봉투에 부착",
    imageUrl: "https://placehold.co/400x400/f8fafc/64748b?text=스티커+예시",
  },
  { 
    icon: <BoxIcon />, 
    title: "패키징", 
    desc: "포장 박스나 봉투에 인쇄",
    imageUrl: "https://placehold.co/400x400/f8fafc/64748b?text=패키징+예시",
  },
];

// 예시 이미지 데이터 (Example images data)
const exampleImages = [
  {
    title: "만 8세 이상",
    url: "https://cdn.imweb.me/thumbnail/20250724/115c0382571ff.jpg",
  },
  {
    title: "만 3세 이상",
    url: "https://cdn.imweb.me/thumbnail/20250724/1ba10723c59da.jpg",
  },
];

export default function KCCertificationGuide() {
  // 아코디언 상태 관리 (Accordion state management)
  const [openSection, setOpenSection] = useState<string | null>("table");
  
  // 이미지 모달 상태 관리 (Image modal state management)
  const [modalImage, setModalImage] = useState<{ title: string; url: string } | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div style={styles.container}>
      {/* 헤더 섹션 (Header Section) */}
      <div style={{...styles.header, marginBottom: "4px"}}>
        <h1 style={styles.title}>KC 인증 가이드</h1>
      </div>

      {/* KC인증 소개 카드 (KC Certification Introduction Card) */}
      <div style={styles.introCard}>
        <div style={styles.introHeader}>
          <span style={styles.introLabel}>KC인증이란?</span>
        </div>
        <p style={styles.introText}>
          소비자가 사용하는 제품이 <strong>안전·보건·환경·품질 기준</strong>을 
          충족했는지 정부가 확인해주는 통합 국가 안전인증 제도입니다.
        </p>
        <div style={styles.highlightBox}>
          <InfoIcon />
          <span style={styles.highlightText}>
            <strong>13세 이하</strong> 어린이용 인형은 KC인증이 <strong>필수</strong>입니다
          </span>
        </div>
      </div>

      {/* 연령대별 인증 정보 아코디언 (Age-based certification accordion) */}
      <div style={styles.accordion}>
        <button 
          style={styles.accordionHeader}
          onClick={() => toggleSection("table")}
        >
          <span style={styles.accordionTitle}>연령대별 인증 정보</span>
          <ChevronIcon isOpen={openSection === "table"} />
        </button>
        
        {openSection === "table" && (
          <div style={styles.accordionContent}>
            {/* 테이블 (Table) */}
            <div style={styles.tableContainer}>
              {/* 테이블 헤더 (Table Header) */}
              <div style={{...styles.tableHeader, backgroundColor: '#1a2867', color: '#ffffff'}}>
                <span style={{...styles.tableHeaderCell, color: '#ffffff'}}>사용 연령</span>
                <span style={{...styles.tableHeaderCell, color: '#ffffff'}}>KC 인증</span>
                <span style={{...styles.tableHeaderCell, color: '#ffffff'}}>비용</span>
                <span style={{...styles.tableHeaderCell, color: '#ffffff'}}>기간</span>
              </div>
              
              {/* 테이블 바디 (Table Body) */}
              {certificationData.map((item, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.tableBodyRow,
                    ...(index === certificationData.length - 1 ? styles.tableBodyRowLast : {}),
                    ...(item.required ? {} : styles.tableBodyRowExempt)
                  }}
                >
                  <span style={styles.tableBodyCellAge}>{item.ageRange}</span>
                  <span style={styles.tableBodyCellStatus}>
                    {item.required ? (
                      <span style={styles.statusBadgeRequired}>필수</span>
                    ) : (
                      <span style={styles.statusBadgeExempt}>면제</span>
                    )}
                  </span>
                  <span style={styles.tableBodyCell}>{item.cost}</span>
                  <span style={styles.tableBodyCell}>{item.period}</span>
                </div>
              ))}
            </div>
            
            {/* 14세 이상 주의사항 (14+ age notice) */}
            <div style={styles.warningBox}>
              <WarningIcon />
              <p style={styles.warningText}>
                단, <strong>'14세 이상'</strong>으로 제작 및 표기되었다 하더라도, 
                어린이 제품이라고 판단된 경우 <strong>세관에서 KC 인증을 요구</strong>할 수 있습니다.
              </p>
            </div>
            
            {/* 주의사항 (Notice) */}
            <p style={styles.notice}>
              * 비용 및 기간은 제품 특성과 인증 기관에 따라 달라질 수 있으며, 
              재심사 과정이 여러 번 있을 수 있어 정확한 기간을 예측하기 어렵습니다.
            </p>
          </div>
        )}
      </div>

      {/* 필수 표기 사항 아코디언 (Required labeling accordion) */}
      <div style={styles.accordion}>
        <button 
          style={styles.accordionHeader}
          onClick={() => toggleSection("labeling")}
        >
          <span style={styles.accordionTitle}>필수 표기 사항</span>
          <ChevronIcon isOpen={openSection === "labeling"} />
        </button>
        
        {openSection === "labeling" && (
          <div style={styles.accordionContent}>
            {/* 표기 사항 예시 이미지 갤러리 (Example image gallery) */}
            <div style={{...styles.exampleGallery, marginBottom: '20px'}}>
              <p style={styles.exampleGalleryTitle}>표기 사항 예시</p>
              <div style={styles.imageGrid}>
                {exampleImages.map((image, index) => (
                  <div 
                    key={index} 
                    style={styles.imageCard}
                    onClick={() => setModalImage(image)}
                  >
                    <div style={styles.imageWrapper}>
                      <img 
                        src={image.url} 
                        alt={`${image.title} 표기 예시`}
                        style={styles.exampleImage}
                      />
                      <div style={styles.imageOverlay}>
                        <ZoomIcon />
                      </div>
                    </div>
                    <span style={styles.imageLabel}>{image.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 법률 안내 (Legal notice) */}
            <p style={{...styles.legalNotice, backgroundColor: '#1a2867', color: '#ffffff', fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '8px'}}>
              <InfoIcon />
              <span className="text-[12px]">
                <strong>[어린이제품 안전특별법]</strong>에 따른 필수 표기 사항입니다. 
                일반적으로 <strong>[전기용품 및 생활용품 안전관리법]</strong>에 의한 표시 사항이 포함됩니다.
              </span>
            </p>

            {/* 기본 표기 사항 (Basic labeling items) */}
            <div style={styles.labelingSection}>
              <div style={styles.labelingSectionHeader}>
                <span style={styles.labelingSectionTitle}>기본 표기 사항</span>
                <span style={styles.labelingSectionBadge}>공통</span>
              </div>
              
              {/* 테이블 형태로 변경 (Changed to table format) */}
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableHeaderCell}>항목명</th>
                      <th style={styles.tableHeaderCell}>내용 예시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {basicLabelingItems.map((item, index) => {
                      const isModelName = item.name === "모델명"; // 모델명만 고객이 작성 (Only model name is filled by customer)
                      return (
                        <tr 
                          key={index} 
                          style={{
                            ...styles.tableRow,
                            ...(isModelName ? styles.tableRowHighlight : {})
                          }}
                        >
                          <td style={{
                            ...styles.tableCell,
                            ...styles.tableCellName,
                            ...(isModelName ? styles.tableCellHighlight : {})
                          }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <span>{item.name}</span>
                              {isModelName && <span style={styles.customerBadge}>고객 작성</span>}
                            </div>
                          </td>
                          <td style={{
                            ...styles.tableCell,
                            ...(isModelName ? styles.tableCellHighlight : {})
                          }}>{item.example}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* 안내 문구 (Notice text) */}
                <p style={styles.tableNotice}>
                  "모델명" 외에 나머지 사항은 쿠디솜이 작성합니다.
                </p>
              </div>
            </div>

            {/* 필수 문구 안내 (Required text notice) */}
            <div style={styles.requiredTextBox}>
              <p style={styles.requiredTextLabel}>필수 문구</p>
              <p style={styles.requiredText}>
                "본 제품은 공정거래위원회 고시 소비자분쟁 해결 기준에 의거 
                교환 또는 보상 받을 수 있습니다."
              </p>
            </div>

            {/* KC 인증 시 추가 항목 (KC certification additional items) */}
            <div style={styles.labelingSectionKC}>
              <div style={styles.labelingSectionHeader}>
                <span style={styles.labelingSectionTitleKC}>추가 표기 사항</span>
                <span style={styles.labelingSectionBadgeKC}>KC 인증 시</span>
              </div>
              <div style={styles.labelingList}>
                {kcOnlyLabelingItems.map((item, index) => (
                  <div key={index} style={styles.labelingListItemKC}>
                    <span style={styles.labelingItemNameKC}>{item.name}</span>
                    <span style={styles.labelingItemExampleKC}>{item.example}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 표기 위치 아코디언 (Labeling location accordion) */}
      <div style={styles.accordion}>
        <button 
          style={styles.accordionHeader}
          onClick={() => toggleSection("location")}
        >
          <span style={styles.accordionTitle}>표기 위치 (택 1)</span>
          <ChevronIcon isOpen={openSection === "location"} />
        </button>
        
        {openSection === "location" && (
          <div style={styles.accordionContent}>
            {/* 표기 위치 안내 문구 (Labeling location notice) */}
            <p style={styles.locationNotice}>
              최소 포장 단위에 표기해야 하며, 대표적으로 아래 3가지 방식이 가장 많이 사용됩니다. 
              (라벨에 표기하는 경우도 있지만, 공간이 작기 때문에 권장 드리지 않습니다.)
            </p>
            
            <div style={styles.locationGrid}>
              {labelingLocations.map((location, index) => (
                <div key={index} style={styles.locationCardWithImage}>
                  <div style={styles.locationCardTop}>
                    <div style={styles.locationIcon}>{location.icon}</div>
                    <div style={styles.locationInfo}>
                      <span style={styles.locationTitle}>{location.title}</span>
                      <span style={styles.locationDesc}>{location.desc}</span>
                    </div>
                  </div>
                  <div 
                    style={styles.locationImageWrapper}
                    onClick={() => setModalImage({ title: location.title, url: location.imageUrl })}
                  >
                    <img 
                      src={location.imageUrl} 
                      alt={`${location.title} 예시`}
                      style={styles.locationImage}
                    />
                    <div style={styles.locationImageOverlay}>
                      <ZoomIcon />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              alt={`${modalImage.title} 표기 예시`}
              style={styles.modalImage}
            />
            <p style={styles.modalTitle}>{modalImage.title} 예시</p>
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
    padding: "0 20px 24px 20px",
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    backgroundColor: "#ffffff",
    minHeight: "100vh",
  },

  // 헤더 (Header)
  header: {
    textAlign: "center",
    marginBottom: "24px",
  },
  headerBadge: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#ffd93d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 6px 0",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0",
    fontWeight: "400",
  },

  // 소개 카드 (Introduction card)
  introCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
  },
  introHeader: {
    marginBottom: "10px",
  },
  introLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1a2867",
    backgroundColor: "#e8ebf4",
    padding: "4px 10px",
    borderRadius: "6px",
  },
  introText: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#475569",
    margin: "0 0 14px 0",
  },
  highlightBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#fff7e6",
    border: "1px solid #ffd93d",
    borderRadius: "10px",
    padding: "12px 14px",
  },
  highlightText: {
    fontSize: "13px",
    color: "#1e293b",
    lineHeight: "1.4",
  },

  // 아코디언 (Accordion)
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
    padding: "0 18px 18px",
  },

  // 테이블 (Table)
  tableContainer: {
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr 1fr 0.8fr",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    padding: "10px 12px",
    gap: "4px",
  },
  tableHeaderCell: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
  },
  tableBodyRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr 1fr 0.8fr",
    padding: "12px",
    borderBottom: "1px solid #f1f5f9",
    alignItems: "center",
    gap: "4px",
  },
  tableBodyRowLast: {
    borderBottom: "none",
  },
  tableBodyRowExempt: {
    backgroundColor: "#fafafa",
  },
  tableBodyCell: {
    fontSize: "12px",
    color: "#475569",
    textAlign: "center",
  },
  tableBodyCellAge: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "center",
  },
  tableBodyCellStatus: {
    display: "flex",
    justifyContent: "center",
  },
  statusBadgeRequired: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#22c55e",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  statusBadgeExempt: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#64748b",
    backgroundColor: "#e2e8f0",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  
  // 14세 이상 주의사항 박스 (14+ age warning box)
  warningBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    backgroundColor: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: "10px",
    padding: "12px 14px",
    marginTop: "14px",
  },
  warningText: {
    fontSize: "12px",
    color: "#92400e",
    margin: "0",
    lineHeight: "1.5",
  },
  
  notice: {
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "12px",
    marginBottom: "0",
    lineHeight: "1.5",
  },

  // 법률 안내 (Legal notice)
  legalNotice: {
    fontSize: "12px",
    color: "#64748b",
    backgroundColor: "#f8fafc",
    padding: "12px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    lineHeight: "1.5",
  },

  // 필수 표기 사항 섹션 (Required labeling section)
  labelingSection: {
    marginBottom: "16px",
  },
  labelingSectionKC: {
    marginBottom: "16px",
    backgroundColor: "#f0f3f9",
    borderRadius: "12px",
    padding: "14px",
    border: "1px solid #c7d0e8",
  },
  labelingSectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  labelingSectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
  },
  labelingSectionTitleKC: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1a2867",
  },
  labelingSectionBadge: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#64748b",
    backgroundColor: "#e2e8f0",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  labelingSectionBadgeKC: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#ffffff",
    backgroundColor: "#1a2867",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  labelingList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  labelingListItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  labelingListItemKC: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
  },
  labelingItemName: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#334155",
  },
  labelingItemNameKC: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1a2867",
  },
  labelingItemExample: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  labelingItemExampleKC: {
    fontSize: "12px",
    color: "#6b7aa1",
  },

  requiredTextBox: {
    backgroundColor: "#fefce8",
    border: "1px solid #fef08a",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "16px",
  },
  requiredTextLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#a16207",
    margin: "0 0 6px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  requiredText: {
    fontSize: "12px",
    color: "#713f12",
    margin: "0",
    lineHeight: "1.5",
  },

  // 예시 이미지 갤러리 (Example image gallery)
  exampleGallery: {
    marginTop: "4px",
  },
  exampleGalleryTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "12px",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  imageCard: {
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  imageWrapper: {
    position: "relative",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    aspectRatio: "1",
  },
  exampleImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageOverlay: {
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
  imageLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: "500",
    color: "#64748b",
    textAlign: "center",
    marginTop: "8px",
  },

  // 표기 위치 (Labeling location)
  locationGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  locationCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    backgroundColor: "#1a2867",
    borderRadius: "10px",
  },
  locationCardWithImage: {
    backgroundColor: "#1a2867",
    borderRadius: "12px",
    overflow: "hidden",
  },
  locationCardTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
  },
  locationIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    flexShrink: 0,
  },
  locationInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  locationTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#ffffff",
  },
  locationDesc: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.7)",
  },
  locationImageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    cursor: "pointer",
    overflow: "hidden",
  },
  locationImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  locationImageOverlay: {
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
  locationNotice: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "12px",
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

  // 테이블 스타일 추가 (Additional table styles)
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  tableRow: {
    borderBottom: "1px solid #f1f5f9",
  },
  tableRowHighlight: {
    backgroundColor: "#ffd93d",
  },
  tableCell: {
    padding: "12px",
    textAlign: "center",
    fontSize: "12px",
    color: "#475569",
  },
  tableCellName: {
    fontWeight: "500",
    color: "#334155",
  },
  tableCellWriter: {
    color: "#6b7aa1",
  },
  tableCellWriterHighlight: {
    color: "#a16207",
  },
  tableCellHighlight: {
    color: "#000000",
  },
  customerBadge: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#1a2867",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  tableNotice: {
    fontSize: "11px",
    color: "#94a3b8",
    marginTop: "8px",
    marginBottom: "0",
    padding: "0 12px 12px 12px",
    lineHeight: "1.5",
  },
};