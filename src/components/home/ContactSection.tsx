import React, { useState } from "react";

/**
 * ContactSection Component
 * 쿠디솜 연락처 섹션 / Qudisom Contact Section
 * 좌측: 안내 텍스트 + 연락 방법(하단 정렬), 우측: 상담 예약 폼
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

// ========== 시간 옵션 생성 (Generate Time Options) ==========
const TIME_OPTIONS = [
  "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

// ========== 아이콘 컴포넌트 (Icon Components) ==========

// 이메일 아이콘 / Email Icon
const EmailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// 카카오톡 아이콘 / KakaoTalk Icon
const KakaoIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="#000000"
  >
    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.86 5.25 4.64 6.64-.15.54-.97 3.48-.99 3.7 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.77-2.46 4.36-2.89.54.08 1.09.12 1.66.12 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
  </svg>
);

// 채팅 아이콘 / Chat Icon
const ChatIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// 업로드 아이콘 / Upload Icon
const UploadIcon = () => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// 화살표 아이콘 / Arrow Icon
const ArrowRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ========== 메인 컴포넌트 (Main Component) ==========
export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });
  const [fileName, setFileName] = useState("");

  // 입력 핸들러 / Input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 업로드 핸들러 / File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  // 폼 제출 핸들러 / Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData, fileName);
  };

  return (
    <section style={styles.section}>
      {/* CSS 스타일 / CSS Styles */}
      <style>{`
        .contact-input:focus {
          outline: none;
          border-color: ${BRAND_COLORS.secondary} !important;
        }
        
        .contact-input::placeholder {
          color: ${BRAND_COLORS.text.tertiary};
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 217, 61, 0.4) !important;
        }
        
        .contact-method-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26, 40, 103, 0.3) !important;
        }
        
        .content-wrapper {
          display: flex;
          gap: 64px;
          align-items: stretch;
        }
        
        /* 태블릿 이하 / Tablet and below */
        @media (max-width: 1024px) {
          .content-wrapper {
            flex-direction: column;
            gap: 48px;
          }
          
          .contact-left {
            width: 100% !important;
          }
          
          .contact-right {
            width: 100% !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* 헤더 영역 / Header Area */}
        <div style={styles.header}>
          <div style={styles.labelBadge}>
            <span style={styles.labelText}>CONTACT</span>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 / Main Content Area */}
        <div className="content-wrapper">
          {/* 좌측: 안내 텍스트 + 연락 방법 / Left: Guide Text + Contact Methods */}
          <div style={styles.contactLeft} className="contact-left">
            {/* 상단 텍스트 영역 / Top Text Area */}
            <div>
              <h2 style={styles.title}>
                쿠디솜이 처음이신가요?
                <br />
                <span style={styles.titleHighlight}>부담 없이</span> 시작하세요.
              </h2>
              
              {/* 강조 박스 / Highlight Box */}
              <div style={styles.highlightBox}>
                <div style={styles.highlightIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BRAND_COLORS.secondary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p style={styles.highlightText}>
                  상담과 문의는 <strong>무료</strong>입니다 😊
                  {/* 색연필 밑줄 효과 / Colored pencil underline effect */}
                  <svg 
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '100%',
                      height: '12px',
                      pointerEvents: 'none'
                    }}
                    viewBox="0 0 300 12" 
                    preserveAspectRatio="none"
                  >
                    <path 
                      d="M 0 8 Q 25 4, 50 7 T 100 6 T 150 8 T 200 6 T 250 7 T 300 8" 
                      stroke={BRAND_COLORS.primary}
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                    <path 
                      d="M 0 9 Q 25 5, 50 8 T 100 7 T 150 9 T 200 7 T 250 8 T 300 9" 
                      stroke={BRAND_COLORS.primary}
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  </svg>
                </p>
              </div>
            </div>

            {/* 중간 정렬 텍스트 영역 / Middle Text Area */}
            <div style={{marginTop: "auto", marginBottom: "auto"}}>
              <p style={styles.description}>
                아이디어만 있다면 충분합니다.
                <br />
                제작 과정의 모든 것을 함께 고민하고 해결해 드립니다.
              </p>

              <div style={styles.divider} />

              <p style={styles.descriptionSmall}>
                <strong>예약 상담</strong>이 필요하신가요?
                <br />
                우측 폼을 통해 원하시는 시간에 전화 상담을 받으실 수 있습니다.
              </p>
            </div>

            {/* 연락 방법 리스트 (하단 정렬) / Contact Methods List (Bottom aligned) */}
            <div style={styles.contactMethodsWrapper}>
              <p style={styles.methodsLabel}>즉시 문의 가능한 채널</p>
              
              {/* 이메일 / Email */}
              <div style={{...styles.contactMethodItem, backgroundColor: "#fab803", boxShadow: "0 2px 8px rgba(250, 184, 3, 0.25)"}} className="contact-method-item">
                <div style={{...styles.methodIcon, backgroundColor: "rgba(0, 0, 0, 0.1)"}}>
                  <EmailIcon />
                </div>
                <div style={styles.methodContent}>
                  <span style={{...styles.methodTitle, color: "rgba(0, 0, 0, 0.6)"}}>이메일 문의</span>
                  <span style={{...styles.methodValue, color: "#000000"}}>support@qudisom.com</span>
                </div>
                <ArrowRightIcon />
              </div>

              {/* 카카오톡 / KakaoTalk */}
              <div style={{...styles.contactMethodItem, backgroundColor: "#fab803", boxShadow: "0 2px 8px rgba(250, 184, 3, 0.25)"}} className="contact-method-item">
                <div style={{...styles.methodIcon, backgroundColor: "rgba(0, 0, 0, 0.1)"}}>
                  <KakaoIcon />
                </div>
                <div style={styles.methodContent}>
                  <span style={{...styles.methodTitle, color: "rgba(0, 0, 0, 0.6)"}}>카카오톡 간편 문의</span>
                  <span style={{...styles.methodValue, color: "#000000"}}>QUDISOM</span>
                </div>
                <ArrowRightIcon />
              </div>

              {/* 채널톡 / Channel Talk */}
              <div style={{...styles.contactMethodItem, backgroundColor: "#fab803", boxShadow: "0 2px 8px rgba(250, 184, 3, 0.25)"}} className="contact-method-item">
                <div style={{...styles.methodIcon, backgroundColor: "rgba(0, 0, 0, 0.1)"}}>
                  <ChatIcon />
                </div>
                <div style={styles.methodContent}>
                  <span style={{...styles.methodTitle, color: "rgba(0, 0, 0, 0.6)"}}>1:1 실시간 채팅 문의</span>
                  <span style={{...styles.methodValue, color: "#000000"}}>@Channeltalk</span>
                </div>
                <ArrowRightIcon />
              </div>
            </div>
          </div>

          {/* 우측: 상담 예약 폼 / Right: Consultation Form */}
          <div style={styles.contactRight} className="contact-right">
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>간편 전화 상담 예약</h3>

              <form onSubmit={handleSubmit} style={styles.form}>
                {/* 이름 / Name */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>이름</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="이름을 입력해 주세요"
                    style={styles.input}
                    className="contact-input"
                  />
                </div>

                {/* 연락처 / Phone */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>연락처</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    style={styles.input}
                    className="contact-input"
                  />
                </div>

                {/* 상담 예약 시간 / Consultation Time */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>상담 예약 시간</label>
                  <div style={styles.dateTimeWrapper}>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      style={{ ...styles.input, ...styles.dateInput }}
                      className="contact-input"
                    />
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      style={{ ...styles.input, ...styles.timeSelect }}
                      className="contact-input"
                    >
                      <option value="">시간 선택</option>
                      {TIME_OPTIONS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 문의 내용 / Message */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>문의 내용</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="문의하실 내용을 입력해 주세요"
                    style={styles.textarea}
                    className="contact-input"
                    rows={4}
                  />
                </div>

                {/* 파일 업로드 / File Upload */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>디자인 파일</label>
                  <div style={styles.fileUploadWrapper}>
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      style={styles.fileInput}
                      accept=".jpg,.jpeg,.png,.pdf,.ai,.psd"
                    />
                    <label htmlFor="file-upload" style={styles.fileLabel}>
                      <UploadIcon />
                      <span>{fileName || "파일을 선택해 주세요"}</span>
                    </label>
                  </div>
                  <p style={styles.fileHint}>
                    jpg, png, pdf, ai, psd 파일 업로드 가능
                  </p>
                </div>

                {/* 제출 버튼 / Submit Button */}
                <button type="submit" style={styles.submitButton} className="submit-button">
                  상담 예약하기
                </button>
              </form>
            </div>
          </div>
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
    backgroundColor: BRAND_COLORS.background.secondary,
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
  },

  labelText: {
    fontSize: "12px",
    fontWeight: 700,
    color: BRAND_COLORS.text.white,
    letterSpacing: "1px",
  },

  // 좌측 영역 (flex column, 하단 정렬) / Left Area (flex column, bottom align)
  contactLeft: {
    flex: 1,
    width: "45%",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
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
    fontWeight: 600,
    color: BRAND_COLORS.text.primary,
    margin: 0,
    marginBottom: "8px",
    lineHeight: 1.6,
  },

  // 설명 / Description
  description: {
    fontSize: "clamp(14px, 1.5vw, 16px)",
    color: BRAND_COLORS.text.secondary,
    lineHeight: 1.6,
    margin: 0,
    marginBottom: "8px",
  },

  // 강조 박스 / Highlight Box
  highlightBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0",
    backgroundColor: "transparent",
    borderRadius: "0",
    border: "none",
    marginBottom: "16px",
    position: 'relative' as const,
  },

  // 강조 아이콘 / Highlight Icon
  highlightIcon: {
    flexShrink: 0,
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderRadius: "10px",
  },

  // 강조 텍스트 / Highlight Text
  highlightText: {
    fontSize: "14px",
    color: BRAND_COLORS.text.primary,
    position: 'relative' as const,
    paddingBottom: "6px",
    margin: 0,
  },

  // 구분선 / Divider
  divider: {
    height: "1px",
    backgroundColor: "#E5E8EB",
    margin: "16px 0",
  },

  // 작은 설명 / Small Description
  descriptionSmall: {
    fontSize: "clamp(14px, 1.5vw, 16px)",
    color: BRAND_COLORS.text.secondary,
    lineHeight: 1.6,
    margin: 0,
    marginBottom: "8px",
  },

  // 연락 방법 래퍼 (하단 정렬) / Contact Methods Wrapper (Bottom aligned)
  contactMethodsWrapper: {
    marginTop: "auto",
  },

  // 연락 방법 라벨 / Methods Label
  methodsLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: BRAND_COLORS.text.tertiary,
    margin: 0,
    marginBottom: "12px",
  },

  // 연락 방법 아이템 (네이비 배경, 흰색 폰트) / Contact Method Item (Navy bg, White font)
  contactMethodItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: "12px",
    marginBottom: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(26, 40, 103, 0.15)",
  },

  // 방법 아이콘 / Method Icon
  methodIcon: {
    flexShrink: 0,
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "10px",
  },

  // 방법 콘텐츠 / Method Content
  methodContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },

  // 방법 타이틀 / Method Title
  methodTitle: {
    fontSize: "12px",
    color: "rgba(255, 255, 255, 0.7)",
  },

  // 방법 값 / Method Value
  methodValue: {
    fontSize: "14px",
    fontWeight: 600,
    color: BRAND_COLORS.text.white,
  },

  // 우측 영역 / Right Area
  contactRight: {
    flex: 1,
    width: "50%",
  },

  // 폼 카드 / Form Card
  formCard: {
    backgroundColor: BRAND_COLORS.background.primary,
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
  },

  // 폼 타이틀 / Form Title
  formTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: BRAND_COLORS.text.primary,
    margin: 0,
    marginBottom: "24px",
  },

  // 폼 / Form
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },

  // 폼 그룹 / Form Group
  formGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },

  // 라벨 / Label
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: BRAND_COLORS.text.secondary,
  },

  // 입력 필드 / Input Field
  input: {
    padding: "12px 14px",
    fontSize: "14px",
    border: "1px solid #E5E8EB",
    borderRadius: "10px",
    backgroundColor: BRAND_COLORS.background.primary,
    color: BRAND_COLORS.text.primary,
    transition: "border-color 0.2s ease",
  },

  // 날짜/시간 래퍼 / Date/Time Wrapper
  dateTimeWrapper: {
    display: "flex",
    gap: "10px",
  },

  // 날짜 입력 / Date Input
  dateInput: {
    flex: 1,
  },

  // 시간 선택 / Time Select
  timeSelect: {
    flex: 1,
    cursor: "pointer",
  },

  // 텍스트 영역 / Textarea
  textarea: {
    padding: "12px 14px",
    fontSize: "14px",
    border: "1px solid #E5E8EB",
    borderRadius: "10px",
    backgroundColor: BRAND_COLORS.background.primary,
    color: BRAND_COLORS.text.primary,
    resize: "vertical" as const,
    minHeight: "100px",
    fontFamily: "inherit",
    transition: "border-color 0.2s ease",
  },

  // 파일 업로드 래퍼 / File Upload Wrapper
  fileUploadWrapper: {
    position: "relative" as const,
  },

  // 파일 입력 (숨김) / File Input (hidden)
  fileInput: {
    position: "absolute" as const,
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    border: 0,
  },

  // 파일 라벨 / File Label
  fileLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    fontSize: "14px",
    border: "1px dashed #D1D5DB",
    borderRadius: "10px",
    backgroundColor: BRAND_COLORS.background.secondary,
    color: BRAND_COLORS.text.tertiary,
    cursor: "pointer",
    transition: "border-color 0.2s ease, background-color 0.2s ease",
  },

  // 파일 힌트 / File Hint
  fileHint: {
    fontSize: "12px",
    color: BRAND_COLORS.text.tertiary,
    margin: 0,
    marginTop: "4px",
  },

  // 제출 버튼 / Submit Button
  submitButton: {
    marginTop: "8px",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: 600,
    color: BRAND_COLORS.text.primary,
    backgroundColor: BRAND_COLORS.primary,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 16px rgba(255, 217, 61, 0.3)",
  },
};