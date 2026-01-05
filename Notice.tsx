import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Pin, Clock, ChevronRight, Search, X, User, Mail, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

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

// ========== 공지사항 페이지 (Notice Page) ==========
export default function Notice() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [subscribeForm, setSubscribeForm] = useState({
    name: "",
    email: ""
  });

  const ITEMS_PER_PAGE = 5; // 1페이지당 5개 (5 items per page)

  // 공지사항 데이터 (Notice Data)
  const notices = [
    {
      id: 1,
      title: "2025년 설 연휴 휴무 안내",
      category: "공지",
      date: "2024-12-15",
      isPinned: true,
      isNew: true,
      content: "2025년 1월 28일(화)부터 1월 30일(목)까지 설 연휴로 휴무입니다. 휴무 기간 동안의 문의는 1월 31일(금)부터 순차적으로 답변드리겠습니다. 제작 일정에 참고 부탁드립니다."
    },
    {
      id: 2,
      title: "KC 인증 대행 서비스 시작 안내",
      category: "서비스",
      date: "2024-12-10",
      isPinned: true,
      isNew: true,
      content: "고객님들의 편의를 위해 KC 인증 대행 서비스를 시작합니다. 별도 비용 없이 인증 절차를 도와드리며, 필요 서류와 샘플만 준비해주시면 됩니다. 자세한 사항은 견적 문의 시 안내드립니다."
    },
    {
      id: 3,
      title: "신규 원단 라인업 추가",
      category: "제품",
      date: "2024-12-05",
      isPinned: false,
      isNew: true,
      content: "고급 밍크 원단과 프리미엄 벨벳 원단이 새롭게 추가되었습니다. 더욱 다양한 질감과 컬러 옵션으로 고급스러운 인형 제작이 가능합니다. 원단 샘플은 자료실에서 확인하실 수 있습니다."
    },
    {
      id: 4,
      title: "제작 기간 단축 서비스 안내",
      category: "서비스",
      date: "2024-11-28",
      isPinned: false,
      isNew: false,
      content: "긴급 제작이 필요하신 고객님을 위해 특급 제작 서비스를 운영하고 있습니다. 일반 제작 기간 대비 30% 단축 가능하며, 추가 비용은 견적서에 별도 표기됩니다. 상담 시 문의해주세요."
    },
    {
      id: 5,
      title: "친환경 소재 제작 옵션 추가",
      category: "제품",
      date: "2024-11-20",
      isPinned: false,
      isNew: false,
      content: "재활용 원단 및 유기농 소재를 사용한 친환경 인형 제작이 가능합니다. 지속가능한 제품 생산에 관심 있는 고객님들의 많은 문의 바랍니다. 친환경 인증서 발급도 가능합니다."
    },
    {
      id: 6,
      title: "홈페이지 리뉴얼 완료",
      category: "공지",
      date: "2024-11-15",
      isPinned: false,
      isNew: false,
      content: "더 편리한 서비스 이용을 위해 홈페이지를 전면 리뉴얼했습니다. 자동 견적 산출기, 실시간 제작 현황 확인 등 새로운 기능들을 이용해보세요. 사용 중 불편한 점이 있으시면 언제든 문의해주세요."
    },
    {
      id: 7,
      title: "대량 주문 할인 이벤트",
      category: "이벤트",
      date: "2024-11-01",
      isPinned: false,
      isNew: false,
      content: "1000개 이상 주문 시 최대 15% 할인 혜택을 드립니다. 11월 한 달간 진행되는 이벤트이니 대량 주문을 계획 중이신 고객님들은 이 기회를 놓치지 마세요!"
    },
    {
      id: 8,
      title: "샘플 제작 비용 환급 정책 변경",
      category: "정책",
      date: "2024-10-25",
      isPinned: false,
      isNew: false,
      content: "본 제작 진행 시 샘플 비용의 50%를 환급해드리던 정책이 70%로 상향 조정되었습니다. 고객님들의 부담을 줄이고자 정책을 개선했으니 많은 이용 부탁드립니다."
    }
  ];

  // 검색 필터링 (Search filtering)
  const filteredNotices = useMemo(() => {
    if (!searchQuery.trim()) return notices;
    
    const query = searchQuery.toLowerCase();
    return notices.filter(notice => 
      notice.title.toLowerCase().includes(query) ||
      notice.content.toLowerCase().includes(query) ||
      notice.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // 고정 공지와 일반 공지 분리 (Separate pinned and regular notices)
  const pinnedNotices = filteredNotices.filter(item => item.isPinned);
  const regularNotices = filteredNotices.filter(item => !item.isPinned);

  // 공지사항 클릭 핸들러 (Notice click handler)
  const handleNoticeClick = (noticeId: number) => {
    navigate(`/notice/${noticeId}`);
  };

  // 구독 폼 제출 (Subscribe form submit)
  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`알림 구독이 완료되었습니다.\n${subscribeForm.email}로 새로운 공지사항을 발송해드립니다.`);
    setIsSubscribeModalOpen(false);
    setSubscribeForm({ name: "", email: "" });
  };

  // 페이지네이션 핸들러 (Pagination handler)
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(regularNotices.length / ITEMS_PER_PAGE);

  return (
    <div style={{ backgroundColor: BRAND_COLORS.background.secondary, minHeight: "100vh", paddingTop: "80px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>
        {/* 헤더 (Header) */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
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
            <span style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.secondary, letterSpacing: "-0.02em" }}>Notice</span>
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "16px", letterSpacing: "-0.02em" }}>공지사항</h1>
          <p style={{ fontSize: "18px", color: BRAND_COLORS.text.secondary, lineHeight: 1.6 }}>
            새로운 소식과 업데이트를 확인하세요
          </p>
        </div>

        {/* 검색바 (Search Bar) */}
        <div style={{ maxWidth: "600px", margin: "0 auto 32px", position: "relative" }}>
          <Search 
            style={{ 
              position: "absolute", 
              left: "20px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              width: "20px", 
              height: "20px", 
              color: BRAND_COLORS.text.tertiary 
            }} 
          />
          <input
            type="text"
            placeholder="공지사항 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "16px 50px",
              fontSize: "15px",
              border: `2px solid ${BRAND_COLORS.border}`,
              borderRadius: "12px",
              backgroundColor: "white",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${BRAND_COLORS.secondary}20`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = BRAND_COLORS.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X style={{ width: "18px", height: "18px", color: BRAND_COLORS.text.tertiary }} />
            </button>
          )}
        </div>

        {/* 고정 공지사항 (Pinned Notices) */}
        {pinnedNotices.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            {pinnedNotices.map((notice) => (
              <div
                key={notice.id}
                style={{
                  backgroundColor: "#fff8e0",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "12px",
                  border: `2px solid ${BRAND_COLORS.primary}`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleNoticeClick(notice.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 217, 61, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <Pin style={{ width: "16px", height: "16px", color: BRAND_COLORS.primary }} />
                      {notice.isNew && (
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            backgroundColor: "#FF6B6B",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          NEW
                        </span>
                      )}
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: "4px",
                          backgroundColor: BRAND_COLORS.secondary,
                          color: "white",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {notice.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "8px" }}>
                      {notice.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: BRAND_COLORS.text.tertiary }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock style={{ width: "14px", height: "14px" }} />
                        {notice.date}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    style={{
                      width: "20px",
                      height: "20px",
                      color: BRAND_COLORS.text.tertiary,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 일반 공지사항 (Regular Notices) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {regularNotices.length > 0 ? (
            regularNotices.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((notice) => (
              <div
                key={notice.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "2px solid transparent",
                }}
                onClick={() => handleNoticeClick(notice.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = BRAND_COLORS.border;
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      {notice.isNew && (
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            backgroundColor: "#FF6B6B",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          NEW
                        </span>
                      )}
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: "4px",
                          backgroundColor: BRAND_COLORS.background.tertiary,
                          color: BRAND_COLORS.text.secondary,
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {notice.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "17px", fontWeight: 600, color: BRAND_COLORS.text.primary, marginBottom: "8px" }}>
                      {notice.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: BRAND_COLORS.text.tertiary }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock style={{ width: "14px", height: "14px" }} />
                        {notice.date}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    style={{
                      width: "20px",
                      height: "20px",
                      color: BRAND_COLORS.text.tertiary,
                    }}
                  />
                </div>
              </div>
            ))
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
        {regularNotices.length > ITEMS_PER_PAGE && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "10px 16px",
                backgroundColor: currentPage === 1 ? BRAND_COLORS.background.secondary : BRAND_COLORS.background.tertiary,
                color: currentPage === 1 ? BRAND_COLORS.text.tertiary : BRAND_COLORS.text.secondary,
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = BRAND_COLORS.border;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
                }
              }}
            >
              <ChevronLeft style={{ width: "16px", height: "16px" }} />
            </button>

            {/* 페이지 번호 표시 (Page Numbers) */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    padding: "10px 14px",
                    backgroundColor: currentPage === pageNum ? BRAND_COLORS.secondary : "white",
                    color: currentPage === pageNum ? "white" : BRAND_COLORS.text.secondary,
                    border: `2px solid ${currentPage === pageNum ? BRAND_COLORS.secondary : BRAND_COLORS.border}`,
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    minWidth: "40px",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== pageNum) {
                      e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                      e.currentTarget.style.color = BRAND_COLORS.secondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== pageNum) {
                      e.currentTarget.style.borderColor = BRAND_COLORS.border;
                      e.currentTarget.style.color = BRAND_COLORS.text.secondary;
                    }
                  }}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              style={{
                padding: "10px 16px",
                backgroundColor: currentPage >= totalPages ? BRAND_COLORS.background.secondary : BRAND_COLORS.background.tertiary,
                color: currentPage >= totalPages ? BRAND_COLORS.text.tertiary : BRAND_COLORS.text.secondary,
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (currentPage < totalPages) {
                  e.currentTarget.style.backgroundColor = BRAND_COLORS.border;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage < totalPages) {
                  e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
                }
              }}
            >
              <ChevronRightIcon style={{ width: "16px", height: "16px" }} />
            </button>
          </div>
        )}

        {/* 알림 구독 안내 (Notification Subscription) - 자료실과 동일한 디자인 */}
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
          <Bell style={{ width: "48px", height: "48px", color: BRAND_COLORS.primary, margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "8px" }}>
            새로운 소식을 가장 먼저 받아보세요
          </h3>
          <p style={{ fontSize: "15px", color: BRAND_COLORS.text.secondary, marginBottom: "20px" }}>
            이메일 구독 시 공지사항과 이벤트 정보를 빠르게 받아볼 수 있습니다
          </p>
          <button
            onClick={() => setIsSubscribeModalOpen(true)}
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
            알림 구독하기
          </button>
        </div>
      </div>

      {/* 알림 구독 모달 (Subscribe Modal) */}
      {isSubscribeModalOpen && (
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
          onClick={() => setIsSubscribeModalOpen(false)}
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
                  알림 구독하기
                </h2>
                <button
                  onClick={() => setIsSubscribeModalOpen(false)}
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
                이메일을 입력하시면 새로운 공지사항과 이벤트 소식을 받아보실 수 있습니다
              </p>
            </div>

            {/* 구독 폼 (Subscribe Form) */}
            <form onSubmit={handleSubscribeSubmit}>
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
                  value={subscribeForm.name}
                  onChange={(e) => setSubscribeForm({...subscribeForm, name: e.target.value})}
                  placeholder="이름을 입력해주세요"
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
                  <Mail style={{ width: "16px", height: "16px" }} />
                  이메일
                </label>
                <input
                  type="email"
                  required
                  value={subscribeForm.email}
                  onChange={(e) => setSubscribeForm({...subscribeForm, email: e.target.value})}
                  placeholder="example@email.com"
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

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsSubscribeModalOpen(false)}
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
                  구독하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}