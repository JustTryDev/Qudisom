import { useState } from "react";

/**
 * 표시 사항 표기 방식 가이드 컴포넌트
 * Labeling Method Guide Component
 * 
 * 브랜드 컬러 (Brand Colors):
 * - 메인 (Main): #ffd93d
 * - 서브 (Sub): #1a2867
 */

// 아이콘 컴포넌트들 (Icon Components)
const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7.5" stroke="#ffffff" strokeWidth="1.5"/>
    <path d="M9 8V12M9 6V6.01" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
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

export default function LabelingMethodGuide() {
  // 이미지 모달 상태 관리 (Image modal state management)
  const [modalImage, setModalImage] = useState<{ title: string; url: string } | null>(null);

  return (
    <div style={styles.container}>
      {/* 법률 소개 카드 (Law Introduction Card) */}
      <div style={styles.introCard}>
        <div style={styles.introHeader}>
          <span style={styles.introLabel}>전기용품 및 생활용품 안전관리법이란?</span>
        </div>
        <p style={styles.introText}>
          전기용품 및 생활용품의 안전관리에 관한 사항을 규정함으로써 
          <strong> 국민의 생명·신체 및 재산을 보호</strong>하고, 
          <strong> 소비자의 이익과 안전</strong>을 도모하는 제도입니다.
        </p>
      </div>

      {/* 필수 표기 사항 섹션 (Required labeling section) */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>필수 표기 사항</h3>
        </div>

        {/* 표기 사항 예시 이미지 갤러리 (Example image gallery) */}
        <div style={styles.exampleGallery}>
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

        {/* 법률 안내 박스 (Law notice box) */}
        <div style={styles.lawNoticeBox}>
          <InfoIcon />
          <span style={{...styles.lawNoticeText, fontSize: '13px'}}>
            [전기용품 및 생활용품 안전관리법]에 따른 필수 표기 사항입니다.
          </span>
        </div>

        {/* 기본 표기 사항 (Basic labeling items) */}
        <div style={styles.labelingSection}>
          
          {/* 테이블 형태 (Table format) */}
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
      </div>

      {/* 표기 위치 섹션 (Labeling location section) */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>표기 위치 (택 1)</h3>
        </div>

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
    margin: "0",
  },

  // 섹션 (Section)
  section: {
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "18px",
    marginBottom: "12px",
  },
  sectionHeader: {
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e293b",
    margin: "0",
  },

  // 필수 표기 사항 섹션 (Required labeling section)
  labelingSection: {
    marginBottom: "16px",
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
  labelingSectionBadge: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#64748b",
    backgroundColor: "#e2e8f0",
    padding: "3px 8px",
    borderRadius: "4px",
  },

  // 테이블 (Table)
  tableContainer: {
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  tableHeaderCell: {
    padding: "10px 12px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
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

  // 필수 문구 박스 (Required text box)
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
  locationNotice: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "12px",
    lineHeight: "1.5",
  },
  locationGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
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

  // 섹션 알림 (Section notice)
  sectionNotice: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "4px",
  },
  sectionNoticeText: {
    fontSize: "11px",
    color: "#64748b",
  },

  // 법률 안내 박스 (Law notice box)
  lawNoticeBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#1a2867",
    borderRadius: "10px",
    padding: "12px 14px",
    marginTop: "16px",
    marginBottom: "16px",
  },
  lawNoticeText: {
    fontSize: "11px",
    color: "#ffffff",
    lineHeight: "1.5",
  },
};