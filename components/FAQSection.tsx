import React, { useState } from "react";

/**
 * FAQSection Component
 * 쿠디솜 자주 묻는 질문 섹션 / Qudisom FAQ Section
 * 좌측: FAQ 리스트 (50%), 우측: 네이비 연락처 카드 (50%)
 * 미니멀한 디자인 / Minimal design
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

// ========== FAQ 데이터 (FAQ Data) ==========
const FAQ_DATA = [
  {
    id: 1,
    question: "'전기용품 및 생활용품 안전관리법에 의한 표시'는 필수인가요?",
    answer: "네, 해당 법에 따라 KC 인증이 필요한 제품의 경우 필수적으로 표시해야 합니다.",
  },
  {
    id: 2,
    question: "원산지 표기는 필수인가요?",
    answer: "네, 국내 판매 시 원산지 표기는 필수입니다. 제품에 맞는 표기 방법을 안내해 드립니다.",
  },
  {
    id: 3,
    question: "원산지는 반드시 \"봉제\"해서 표시해야 할까요?",
    answer: "봉제 라벨 외에도 스티커, 택 등 다양한 방식으로 표기 가능합니다.",
  },
  {
    id: 4,
    question: "14세 이상으로 표기 시, KC 인증은 필요 없을까요?",
    answer: "14세 이상 대상 제품도 품목에 따라 KC 인증이 필요할 수 있습니다.",
  },
  {
    id: 5,
    question: "KC 인증 비용과 기간이 궁금해요.",
    answer: "KC 인증 비용은 제품 종류에 따라 다르며, 보통 2~4주 정도 소요됩니다.",
  },
  {
    id: 6,
    question: "본 발주 진행 시 생산 기간은 얼마나 소요되나요?",
    answer: "수량과 제품 복잡도에 따라 4~8주 정도 소요됩니다.",
  },
  {
    id: 7,
    question: "오프라인 미팅이 가능할까요?",
    answer: "네, 사전 예약을 통해 오프라인 미팅이 가능합니다.",
  },
  {
    id: 8,
    question: "샘플 수정은 최대 몇 번까지 가능한가요?",
    answer: "기본적으로 2회까지 무료 수정이 가능합니다.",
  },
  {
    id: 9,
    question: "샘플 제작 비용은 얼마인가요?",
    answer: "제품 크기와 복잡도에 따라 달라지며, 본 생산 진행 시 일부 환급됩니다.",
  },
  {
    id: 10,
    question: "샘플 제작 기간은 얼마나 소요되나요?",
    answer: "일반적으로 2~3주 정도 소요됩니다.",
  },
];

// ========== 아이콘 컴포넌트 (Icon Components) ==========

// 펼침 화살표 아이콘 / Chevron Down Icon
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.3s ease",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// 돋보기 아이콘 / Search Icon
const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

// ========== 메인 컴포넌트 (Main Component) ==========
export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // 아코디언 토글 / Toggle accordion
  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  // 검색 필터링 / Search filtering
  const filteredFAQs = FAQ_DATA.filter((faq) => {
    const query = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
  });

  // 페이징 계산 / Pagination calculation
  const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFAQs = filteredFAQs.slice(startIndex, endIndex);

  // 검색어 변경 시 첫 페이지로 / Reset to first page on search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // 페이지 변경 / Change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOpenId(null); // 페이지 변경 시 열린 아코디언 닫기 / Close accordion on page change
  };

  return (
    <section style={styles.section}>
      {/* CSS 스타일 / CSS Styles */}
      <style>{`
        .faq-item:hover {
          background-color: ${BRAND_COLORS.background.secondary};
        }
        
        .faq-answer {
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .page-number-button:hover {
          background-color: ${BRAND_COLORS.primary} !important;
          color: ${BRAND_COLORS.text.primary} !important;
        }
        
        .content-wrapper {
          display: flex;
          gap: 48px;
          align-items: stretch;
        }
        
        /* 태블릿 이하 / Tablet and below */
        @media (max-width: 1024px) {
          .content-wrapper {
            flex-direction: column;
            gap: 40px;
          }
          
          .faq-left {
            width: 100% !important;
          }
          
          .faq-right {
            width: 100% !important;
          }
        }
        
        /* 모바일 / Mobile */
        @media (max-width: 640px) {
          .pagination-wrapper {
            justify-content: center !important;
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .page-number-button {
            margin-left: 0 !important;
            padding: 6px 12px !important;
            font-size: 13px !important;
          }
          
          .search-input-mobile {
            font-size: 16px !important; /* iOS 줌 방지 / Prevent iOS zoom */
          }
          
          .mascot-wrapper-mobile {
            right: 10px !important;
            bottom: 10px !important;
          }
          
          .mascot-image-mobile {
            width: 120px !important;
          }
          
          .contact-card-mobile {
            padding: 24px !important;
            min-height: 320px !important;
          }
          
          .contact-text-mobile {
            font-size: 15px !important;
          }
          
          .phone-number-mobile {
            font-size: 26px !important;
            margin-bottom: 20px !important;
          }
          
          .hours-row-mobile {
            font-size: 14px !important;
          }
        }
      `}</style>

      <div style={styles.container}>
        {/* 콘텐츠 영역 / Content Area */}
        <div className="content-wrapper">
          {/* 좌측: FAQ 리스트 (50%) / Left: FAQ List (50%) */}
          <div style={styles.faqLeft} className="faq-left">
            {/* 타이틀 / Title */}
            <h2 style={styles.faqTitle}>자주 묻는 질문</h2>

            {/* 검색 입력 필드 / Search Input Field */}
            <div style={styles.searchWrapper}>
              <span style={styles.searchIcon}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="질문을 입력하세요..."
                value={searchQuery}
                onChange={handleSearch}
                style={styles.searchInput}
                className="search-input-mobile"
              />
            </div>

            {/* FAQ 리스트 / FAQ List */}
            <div style={styles.faqList}>
              {currentFAQs.map((faq) => (
                <div
                  key={faq.id}
                  style={styles.faqItem}
                  className="faq-item"
                >
                  {/* 질문 버튼 / Question Button */}
                  <button
                    style={styles.faqButton}
                    onClick={() => handleToggle(faq.id)}
                    aria-expanded={openId === faq.id}
                  >
                    <span style={styles.faqQuestion}>{faq.question}</span>
                    <span style={styles.chevronIcon}>
                      <ChevronDownIcon isOpen={openId === faq.id} />
                    </span>
                  </button>

                  {/* 답변 / Answer */}
                  <div
                    style={{
                      ...styles.faqAnswer,
                      maxHeight: openId === faq.id ? "150px" : "0px",
                      opacity: openId === faq.id ? 1 : 0,
                      paddingBottom: openId === faq.id ? "12px" : "0px",
                    }}
                    className="faq-answer"
                  >
                    <p style={styles.faqAnswerText}>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이징 버튼 / Pagination Buttons */}
            {totalPages > 1 && (
              <div style={styles.paginationWrapper} className="pagination-wrapper">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      style={{
                        ...styles.pageNumberButton,
                        ...(currentPage === page
                          ? styles.pageNumberButtonActive
                          : {}),
                      }}
                      className="page-number-button"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* 우측: 네이비 연락처 카드 (50%) / Right: Navy Contact Card (50%) */}
          <div style={styles.faqRight} className="faq-right">
            <div style={styles.contactCard} className="contact-card-mobile">
              {/* 안내 문구 / Guide Text */}
              <div style={styles.contactTextWrapper}>
                <p style={styles.contactText} className="contact-text-mobile">
                  아직 쿠디솜을 잘 모르셔도 괜찮아요.
                </p>
                <p style={styles.contactText} className="contact-text-mobile">
                  궁금한 점은 언제든, 부담 없이 물어봐 주세요.
                </p>
              </div>

              {/* 전화번호 / Phone Number */}
              <div style={{...styles.phoneNumber, fontSize: "clamp(24px, 3vw, 30px)"}} className="phone-number-mobile">
                Tel. 1666-0211
              </div>

              {/* 운영시간 / Operating Hours */}
              <div style={styles.hoursWrapper}>
                <div style={styles.hoursRow} className="hours-row-mobile">
                  <span style={styles.hoursLabel}>운영 시간</span>
                  <span style={styles.hoursDivider}>|</span>
                  <span style={styles.hoursValue}>09:00 ~ 18:00</span>
                </div>
                <div style={styles.hoursRow} className="hours-row-mobile">
                  <span style={styles.hoursLabel}>점심 시간</span>
                  <span style={styles.hoursDivider}>|</span>
                  <span style={styles.hoursValue}>12:00 ~ 13:00</span>
                </div>
              </div>

              {/* 마스코트 이미지 / Mascot Image */}
              <div style={styles.mascotWrapper} className="mascot-wrapper-mobile">
                <img
                  src="https://cdn.imweb.me/upload/S20250219f0f96de489a65/c81e0c081dc5c.png"
                  alt="Qudisom Mascot"
                  style={styles.mascotImage} className="mascot-image-mobile"
                />
              </div>
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
    backgroundColor: BRAND_COLORS.background.primary,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  // 컨테이너 / Container
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  // FAQ 좌측 (50%) / FAQ Left (50%)
  faqLeft: {
    flex: 1,
    width: "50%",
  },

  // FAQ 타이틀 / FAQ Title
  faqTitle: {
    fontSize: "clamp(18px, 2.5vw, 22px)",
    fontWeight: 700,
    color: BRAND_COLORS.text.primary,
    margin: 0,
    marginBottom: "20px",
  },

  // 검색 입력 필드 / Search Input Field
  searchWrapper: {
    position: "relative",
    marginBottom: "20px",
  },
  searchIcon: {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: BRAND_COLORS.text.tertiary,
  },
  searchInput: {
    width: "100%",
    padding: "10px 30px 10px 40px",
    border: "1px solid #E5E8EB",
    borderRadius: "4px",
    fontSize: "14px",
    color: BRAND_COLORS.text.primary,
  },

  // FAQ 리스트 / FAQ List
  faqList: {
    borderTop: `1px solid #E5E8EB`,
  },

  // FAQ 아이템 / FAQ Item
  faqItem: {
    borderBottom: "1px solid #E5E8EB",
  },

  // FAQ 버튼 (간격 축소) / FAQ Button (reduced padding)
  faqButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    gap: "12px",
  },

  // FAQ 질문 / FAQ Question
  faqQuestion: {
    fontSize: "14px",
    fontWeight: 500,
    color: BRAND_COLORS.text.primary,
    lineHeight: 1.5,
    flex: 1,
  },

  // 펼침 아이콘 / Chevron Icon
  chevronIcon: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: BRAND_COLORS.text.tertiary,
  },

  // FAQ 답변 / FAQ Answer
  faqAnswer: {
    paddingLeft: "0",
    paddingRight: "24px",
  },

  // FAQ 답변 텍스트 / FAQ Answer Text
  faqAnswerText: {
    fontSize: "13px",
    color: BRAND_COLORS.text.secondary,
    lineHeight: 1.6,
    margin: 0,
  },

  // FAQ 우측 (50%) / FAQ Right (50%)
  faqRight: {
    flex: 1,
    width: "50%",
  },

  // 연락처 카드 / Contact Card
  contactCard: {
    backgroundColor: BRAND_COLORS.secondary,
    borderRadius: "20px",
    padding: "32px",
    position: "relative",
    overflow: "hidden",
    height: "100%",
    minHeight: "400px",
    display: "flex",
    flexDirection: "column" as const,
  },

  // 연락처 텍스트 래퍼 / Contact Text Wrapper
  contactTextWrapper: {
    marginBottom: "24px",
  },

  // 연락처 텍스트 / Contact Text
  contactText: {
    fontSize: "18px",
    color: BRAND_COLORS.text.white,
    lineHeight: 1.6,
    margin: 0,
  },

  // 전화번호 / Phone Number
  phoneNumber: {
    fontSize: "clamp(32px, 4vw, 40px)",
    fontWeight: 700,
    color: BRAND_COLORS.text.white,
    marginBottom: "32px",
  },

  // 운영시간 래퍼 / Hours Wrapper
  hoursWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },

  // 운영시간 행 / Hours Row
  hoursRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "16px",
  },

  // 운영시간 라벨 / Hours Label
  hoursLabel: {
    color: "rgba(255, 255, 255, 0.7)",
  },

  // 운영시간 구분자 / Hours Divider
  hoursDivider: {
    color: "rgba(255, 255, 255, 0.4)",
  },

  // 운영시간 값 / Hours Value
  hoursValue: {
    color: BRAND_COLORS.text.white,
    fontWeight: 500,
  },

  // 마스코트 래퍼 / Mascot Wrapper
  mascotWrapper: {
    position: "absolute",
    right: "20px",
    bottom: "20px",
  },

  // 마스코트 이미지 / Mascot Image
  mascotImage: {
    width: "170px",
    height: "auto",
  },

  // 페이징 래퍼 / Pagination Wrapper
  paginationWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },

  // 페이지 번호 버튼 / Page Number Button
  pageNumberButton: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: BRAND_COLORS.text.primary,
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    marginLeft: "10px",
    transition: "all 0.3s ease",
  },

  // 활성 페이지 번호 버튼 / Active Page Number Button
  pageNumberButtonActive: {
    backgroundColor: BRAND_COLORS.primary,
    color: BRAND_COLORS.text.primary,
    fontWeight: 700,
  },
};