import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, MessageSquare, User, Mail, X, ChevronLeft, ChevronRight } from 'lucide-react';

// ========== 브랜드 컬러 정의 (Brand Color Definition) ==========
const BRAND_COLORS = {
  primary: "#ffd93d", // 메인 컬러 (Main Color - Yellow)
  secondary: "#1a2867", // 서브 컬러 (Sub Color - Navy)
  text: {
    primary: "#191F28", // 기본 텍스트 (Primary Text)
    secondary: "#4E5968", // 보조 텍스트 (Secondary Text)
    tertiary: "#8B95A1", // 삼차 텍스트 (Tertiary Text)
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    tertiary: "#F2F4F6",
  },
  border: "#E5E8EB",
};

// ========== 자주 묻는 질문 페이지 (FAQ Page) ==========
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const ITEMS_PER_PAGE = 10; // 1페이지당 10개 (10 items per page)

  // FAQ 데이터 (FAQ Data)
  const faqData = [
    {
      category: "견적 & 주문",
      question: "최소 주문 수량이 어떻게 되나요?",
      answer: "봉제 인형은 최소 300개부터 제작 가능하며, 인형 키링은 500개부터 가능합니다. 소량 제작이 필요하신 경우 별도 문의 주시면 상담해드립니다."
    },
    {
      category: "견적 & 주문",
      question: "견적은 얼마나 걸리나요?",
      answer: "디자인 시안과 제작 요구사항을 받은 후 1-2 영업일 내에 상세한 견적서를 보내드립니다. 급하신 경우 빠른 견적 서비스도 제공하고 있습니다."
    },
    {
      category: "견적 & 주문",
      question: "디자인 시안이 없는데 제작 가능한가요?",
      answer: "네, 가능합니다. 아이디어나 참고 이미지만 있으시면 저희 디자인팀에서 시안 작업을 도와드립니다. 별도의 디자인 비용이 발생할 수 있습니다."
    },
    {
      category: "견적 & 주문",
      question: "수정 요청은 몇 번까지 가능한가요?",
      answer: "샘플 제작 후 2회까지 무료 수정이 가능합니다. 추가 수정이 필요한 경우 수정 범위에 따라 별도 비용이 발생할 수 있습니다."
    },
    {
      category: "제작 기간",
      question: "제작 기간은 얼마나 걸리나요?",
      answer: "샘플 제작은 약 2-3주, 본 제작은 승인 후 3-4주 정도 소요됩니다. 제품의 복잡도와 수량에 따라 기간이 달라질 수 있으니 견적 시 정확한 기간을 안내해드립니다."
    },
    {
      category: "제작 기간",
      question: "급하게 제작해야 하는데 가능한가요?",
      answer: "긴급 제작이 필요하신 경우 별도로 문의해주세요. 생산 일정에 따라 특급 제작이 가능한 경우가 있으며, 추가 비용이 발생할 수 있습니다."
    },
    {
      category: "제작 기간",
      question: "제작 진행 상황을 확인할 수 있나요?",
      answer: "네, 제작 단계별로 사진과 함께 진행 상황을 공유해드립니다. 카카오톡이나 이메일로 실시간 업데이트를 받으실 수 있습니다."
    },
    {
      category: "샘플",
      question: "샘플은 꼭 제작해야 하나요?",
      answer: "대량 제작 전 품질 확인을 위해 샘플 제작을 강력히 권장드립니다. 샘플 승인 후 본 제작을 진행하므로 최종 제품의 만족도를 높일 수 있습니다."
    },
    {
      category: "샘플",
      question: "샘플 제작 비용은 어떻게 되나요?",
      answer: "샘플 1개 제작 비용은 제품 복잡도에 따라 10만원~30만원 정도이며, 본 제작 진행 시 샘플 비용의 일부를 환급해드립니다."
    },
    {
      category: "샘플",
      question: "샘플을 여러 개 제작할 수 있나요?",
      answer: "네, 가능합니다. 다양한 버전을 테스트하고 싶으시면 여러 개의 샘플을 제작하실 수 있으며, 개당 비용은 동일하게 적용됩니다."
    },
    {
      category: "결제",
      question: "결제는 어떻게 진행되나요?",
      answer: "계약 체결 시 선금 50%, 제작 완료 후 잔금 50%를 입금하시면 됩니다. 법인 고객의 경우 세금계산서 발행이 가능합니다."
    },
    {
      category: "결제",
      question: "해외 결제도 가능한가요?",
      answer: "네, 해외 송금도 가능합니다. Paypal이나 신용카드 결제도 지원하고 있으니 편하신 방법으로 결제하실 수 있습니다."
    },
    {
      category: "결제",
      question: "할부 결제가 가능한가요?",
      answer: "법인 고객의 경우 협의를 통해 분할 결제가 가능합니다. 개인 고객은 신용카드 결제 시 카드사의 할부 서비스를 이용하실 수 있습니다."
    },
    {
      category: "배송",
      question: "배송 기간은 얼마나 걸리나요?",
      answer: "국내 배송은 2-3일, 해외 배송은 국가에 따라 5-14일 정도 소요됩니다. 배송 시작 시 트래킹 번호를 보내드립니다."
    },
    {
      category: "배송",
      question: "해외 배송도 가능한가요?",
      answer: "네, 전 세계 배송이 가능합니다. 국가별 관세 및 배송비는 견적 시 안내해드리며, DHL, FedEx 등 안전한 특송 서비스를 이용합니다."
    },
    {
      category: "배송",
      question: "부분 배송이 가능한가요?",
      answer: "수량이 많은 경우 완성되는 대로 부분 배송이 가능합니다. 배송비는 회차별로 별도 부과되오니 견적 시 함께 안내받으실 수 있습니다."
    },
    {
      category: "품질",
      question: "KC 인증은 받을 수 있나요?",
      answer: "네, KC 인증이 필요하신 경우 대행해드립니다. 인증 비용과 기간은 제품에 따라 다르며, 일반적으로 4-6주 정도 소요됩니다."
    },
    {
      category: "품질",
      question: "불량 제품은 어떻게 처리되나요?",
      answer: "출고 전 엄격한 품질 검수를 진행하며, 만약 불량이 발견되면 무상으로 재제작 또는 교환해드립니다. 품질 보증 기간은 배송 후 30일입니다."
    },
    {
      category: "품질",
      question: "품질 검수는 어떻게 진행되나요?",
      answer: "모든 제품은 출고 전 외관, 봉제 상태, 색상, 프린팅 품질 등을 체크합니다. 요청 시 검수 사진을 보내드리고, 직접 방문 검수도 가능합니다."
    },
    {
      category: "원단 & 재료",
      question: "어떤 원단을 사용하나요?",
      answer: "크리스탈 벨벳, 스판덱스, 밍크, 토끼털 등 다양한 원단을 사용합니다. 원단 샘플을 보내드릴 수 있으니 촉감을 확인하고 선택하실 수 있습니다."
    },
    {
      category: "원단 & 재료",
      question: "친환경 소재로 제작 가능한가요?",
      answer: "네, 재활용 원단이나 유기농 소재 등 친환경 소재로 제작 가능합니다. 별도로 요청해주시면 친환경 인증 원단을 사용하여 제작해드립니다."
    },
    {
      category: "원단 & 재료",
      question: "특정 원단을 지정해서 제작할 수 있나요?",
      answer: "네, 원하시는 원단이 있으시면 샘플을 보내주시거나 사양을 알려주시면 해당 원단으로 제작 가능합니다. 조달 가능 여부는 확인 후 안내드립니다."
    }
  ];

  // 카테고리 목록 (Category List)
  const categories = ["전체", ...Array.from(new Set(faqData.map(item => item.category)))];

  // 필터링된 FAQ (Filtered FAQ)
  const filteredFAQ = useMemo(() => {
    return faqData.filter(item => {
      const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // 페이지네이션 계산 (Pagination calculation)
  const totalPages = Math.ceil(filteredFAQ.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFAQ = filteredFAQ.slice(startIndex, endIndex);

  // 페이지 변경 시 맨 위로 스크롤 및 아코디언 닫기 (Scroll to top and close accordion on page change)
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOpenIndex(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 카테고리나 검색어 변경 시 첫 페이지로 이동 (Reset to first page on filter change)
  React.useEffect(() => {
    setCurrentPage(1);
    setOpenIndex(null);
  }, [selectedCategory, searchQuery]);

  // 문의 폼 제출 (Submit inquiry form)
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`문의가 접수되었습니다.\n담당자가 확인 후 연락드리겠습니다.`);
    setIsInquiryModalOpen(false);
    setInquiryForm({ name: "", email: "", message: "" });
  };

  // 페이지 번호 배열 생성 (Generate page numbers array)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // 최대 표시할 페이지 번호 개수 (Max visible page numbers)

    if (totalPages <= maxVisible) {
      // 전체 페이지가 적으면 모두 표시 (Show all if total pages is small)
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 많으면 현재 페이지 주변만 표시 (Show around current page if many)
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div style={{ backgroundColor: BRAND_COLORS.background.secondary, minHeight: "100vh", paddingTop: "80px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>
        {/* 헤더 (Header) */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "100px",
              backgroundColor: "#fff8e0",
              marginBottom: "16px",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: BRAND_COLORS.primary }} />
            <span style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.secondary, letterSpacing: "-0.02em" }}>FAQ</span>
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "16px", letterSpacing: "-0.02em" }}>자주 묻는 질문</h1>
          <p style={{ fontSize: "18px", color: BRAND_COLORS.text.secondary, lineHeight: 1.6 }}>
            궁금하신 내용을 빠르게 찾아보세요
          </p>
        </div>

        {/* 검색창 (Search Bar) */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <Search
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "20px",
                height: "20px",
                color: BRAND_COLORS.text.tertiary,
              }}
            />
            <input
              type="text"
              placeholder="질문 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "18px 20px 18px 52px",
                border: "none",
                outline: "none",
                fontSize: "16px",
                color: BRAND_COLORS.text.primary,
              }}
            />
          </div>
        </div>

        {/* 카테고리 필터 (Category Filter) */}
        <div style={{ marginBottom: "32px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: "10px 20px",
                borderRadius: "100px",
                border: `2px solid ${selectedCategory === category ? BRAND_COLORS.secondary : BRAND_COLORS.border}`,
                backgroundColor: selectedCategory === category ? BRAND_COLORS.secondary : "white",
                color: selectedCategory === category ? "white" : BRAND_COLORS.text.secondary,
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                  e.currentTarget.style.color = BRAND_COLORS.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.borderColor = BRAND_COLORS.border;
                  e.currentTarget.style.color = BRAND_COLORS.text.secondary;
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 결과 카운트 (Result count) */}
        {filteredFAQ.length > 0 && (
          <div style={{ 
            marginBottom: "16px", 
            textAlign: "center",
            fontSize: "14px",
            color: BRAND_COLORS.text.tertiary
          }}>
            총 {filteredFAQ.length}개의 질문
          </div>
        )}

        {/* FAQ 아코디언 (FAQ Accordion) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: "500px" }}>
          {paginatedFAQ.length > 0 ? (
            paginatedFAQ.map((item, index) => {
              const actualIndex = startIndex + index;
              return (
                <div
                  key={actualIndex}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease",
                    border: `2px solid ${openIndex === actualIndex ? BRAND_COLORS.primary : "transparent"}`,
                  }}
                >
                  {/* 질문 (Question) */}
                  <button
                    onClick={() => setOpenIndex(openIndex === actualIndex ? null : actualIndex)}
                    style={{
                      width: "100%",
                      padding: "24px",
                      backgroundColor: "transparent",
                      border: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: "16px" }}>
                      <div
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "100px",
                          backgroundColor: BRAND_COLORS.background.tertiary,
                          fontSize: "12px",
                          fontWeight: 600,
                          color: BRAND_COLORS.text.tertiary,
                          marginBottom: "8px",
                        }}
                      >
                        {item.category}
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: 600, color: BRAND_COLORS.text.primary, margin: 0, letterSpacing: "-0.01em" }}>
                        {item.question}
                      </h3>
                    </div>
                    <ChevronDown
                      style={{
                        width: "24px",
                        height: "24px",
                        color: BRAND_COLORS.text.tertiary,
                        transition: "transform 0.3s ease",
                        transform: openIndex === actualIndex ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {/* 답변 (Answer) */}
                  {openIndex === actualIndex && (
                    <div
                      style={{
                        padding: "0 24px 24px 24px",
                        borderTop: `1px solid ${BRAND_COLORS.border}`,
                      }}
                    >
                      <div style={{ paddingTop: "20px" }}>
                        <p style={{ fontSize: "15px", color: BRAND_COLORS.text.secondary, lineHeight: 1.7, margin: 0 }}>
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "white",
                borderRadius: "16px",
              }}
            >
              <p style={{ fontSize: "16px", color: BRAND_COLORS.text.tertiary }}>
                검색 결과가 없습니다.
              </p>
            </div>
          )}
        </div>

        {/* 페이지네이션 (Pagination) */}
        {totalPages > 1 && (
          <div style={{ 
            marginTop: "32px", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            gap: "8px"
          }}>
            {/* 이전 페이지 버튼 (Previous page button) */}
            <button
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: currentPage === 1 ? BRAND_COLORS.background.tertiary : "white",
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: "8px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.borderColor = BRAND_COLORS.border;
                }
              }}
            >
              <ChevronLeft style={{ width: "20px", height: "20px", color: BRAND_COLORS.text.secondary }} />
            </button>

            {/* 페이지 번호들 (Page numbers) */}
            {getPageNumbers().map((page, idx) => {
              if (page === '...') {
                return (
                  <span 
                    key={`ellipsis-${idx}`}
                    style={{ 
                      padding: "0 8px",
                      color: BRAND_COLORS.text.tertiary,
                      fontSize: "14px"
                    }}
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  style={{
                    minWidth: "40px",
                    height: "40px",
                    padding: "0 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: currentPage === page ? BRAND_COLORS.secondary : "white",
                    color: currentPage === page ? "white" : BRAND_COLORS.text.secondary,
                    border: `2px solid ${currentPage === page ? BRAND_COLORS.secondary : BRAND_COLORS.border}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                      e.currentTarget.style.color = BRAND_COLORS.secondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.borderColor = BRAND_COLORS.border;
                      e.currentTarget.style.color = BRAND_COLORS.text.secondary;
                    }
                  }}
                >
                  {page}
                </button>
              );
            })}

            {/* 다음 페이지 버튼 (Next page button) */}
            <button
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: currentPage === totalPages ? BRAND_COLORS.background.tertiary : "white",
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: "8px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) {
                  e.currentTarget.style.borderColor = BRAND_COLORS.border;
                }
              }}
            >
              <ChevronRight style={{ width: "20px", height: "20px", color: BRAND_COLORS.text.secondary }} />
            </button>
          </div>
        )}

        {/* 추가 문의 안내 (Additional Contact Info) - 자료실과 동일한 디자인 */}
        <div
          style={{
            marginTop: "60px",
            padding: "32px",
            backgroundColor: "white",
            borderRadius: "20px",
            border: `2px solid ${BRAND_COLORS.border}`,
            textAlign: "center",
          }}
        >
          <MessageSquare style={{ width: "48px", height: "48px", color: BRAND_COLORS.primary, margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "8px" }}>
            원하는 답변을 찾지 못하셨나요?
          </h3>
          <p style={{ fontSize: "15px", color: BRAND_COLORS.text.secondary, marginBottom: "20px" }}>
            언제든지 문의해주시면 빠르게 답변드리겠습니다
          </p>
          <button
            onClick={() => setIsInquiryModalOpen(true)}
            style={{
              padding: "12px 28px",
              backgroundColor: BRAND_COLORS.secondary,
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(26, 40, 103, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            1:1 문의하기
          </button>
        </div>
      </div>

      {/* 1:1 문의 모달 (Inquiry Modal) */}
      {isInquiryModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px",
          }}
          onClick={() => setIsInquiryModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "40px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 (Modal Header) */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 700, color: BRAND_COLORS.text.primary }}>
                  1:1 문의하기
                </h2>
                <button
                  onClick={() => setIsInquiryModalOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X style={{ width: "24px", height: "24px", color: BRAND_COLORS.text.tertiary }} />
                </button>
              </div>
              <p style={{ fontSize: "14px", color: BRAND_COLORS.text.secondary }}>
                궁금하신 사항을 남겨주시면 빠르게 답변드리겠습니다
              </p>
            </div>

            {/* 문의 폼 (Inquiry Form) */}
            <form onSubmit={handleInquirySubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  fontSize: "14px", 
                  fontWeight: 600, 
                  color: BRAND_COLORS.text.primary,
                  marginBottom: "8px" 
                }}>
                  <User style={{ width: "16px", height: "16px" }} />
                  이름
                </label>
                <input
                  type="text"
                  required
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "14px",
                    border: `2px solid ${BRAND_COLORS.border}`,
                    borderRadius: "10px",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = BRAND_COLORS.border;
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  fontSize: "14px", 
                  fontWeight: 600, 
                  color: BRAND_COLORS.text.primary,
                  marginBottom: "8px" 
                }}>
                  <Mail style={{ width: "16px", height: "16px" }} />
                  이메일
                </label>
                <input
                  type="email"
                  required
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "14px",
                    border: `2px solid ${BRAND_COLORS.border}`,
                    borderRadius: "10px",
                    outline: "none",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = BRAND_COLORS.border;
                  }}
                />
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  fontSize: "14px", 
                  fontWeight: 600, 
                  color: BRAND_COLORS.text.primary,
                  marginBottom: "8px" 
                }}>
                  <MessageSquare style={{ width: "16px", height: "16px" }} />
                  문의 내용
                </label>
                <textarea
                  required
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                  rows={5}
                  placeholder="궁금하신 내용을 자세히 적어주세요"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "14px",
                    border: `2px solid ${BRAND_COLORS.border}`,
                    borderRadius: "10px",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = BRAND_COLORS.border;
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: BRAND_COLORS.background.tertiary,
                    color: BRAND_COLORS.text.secondary,
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = BRAND_COLORS.border;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: BRAND_COLORS.secondary,
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(26, 40, 103, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  문의하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
