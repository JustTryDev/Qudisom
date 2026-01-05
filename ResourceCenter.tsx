import React, { useState, useMemo } from 'react';
import { Download, FileText, Image, Video, Eye, Search, X, Check, Mail, User, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

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

// ========== 자료실 페이지 (Resource Center Page) ==========
export default function ResourceCenter() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResources, setSelectedResources] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const ITEMS_PER_PAGE = 12; // 1페이지당 12개 (12 items per page)

  // 자료 데이터 (Resource Data)
  const resources = [
    {
      id: 1,
      title: "인형 제작 가이드북",
      description: "인형 제작을 위한 필수 가이드라인과 체크리스트",
      type: "PDF",
      icon: <FileText style={{ width: "24px", height: "24px" }} />,
      size: "2.4 MB",
      category: "가이드",
      subCategory: null,
      color: "#FF6B6B",
      date: "2024.11.15"
    },
    {
      id: 2,
      title: "원단 샘플 카탈로그",
      description: "다양한 원단 종류와 특성 설명 자료",
      type: "PDF",
      icon: <FileText style={{ width: "24px", height: "24px" }} />,
      size: "8.1 MB",
      category: "카탈로그",
      subCategory: null,
      color: "#4ECDC4",
      date: "2024.11.20"
    },
    {
      id: 3,
      title: "공통 디자인 템플릿",
      description: "AI 및 PSD 형식의 기본 디자인 작업용 템플릿",
      type: "ZIP",
      icon: <Image style={{ width: "24px", height: "24px" }} />,
      size: "15.3 MB",
      category: "디자인 템플릿",
      subCategory: "공통",
      color: "#FFD93D",
      date: "2024.12.01"
    },
    {
      id: 4,
      title: "어린이 제품 디자인 가이드",
      description: "어린이 제품 안전 기준과 디자인 가이드",
      type: "PDF",
      icon: <FileText style={{ width: "24px", height: "24px" }} />,
      size: "5.2 MB",
      category: "디자인 템플릿",
      subCategory: "어린이 제품",
      color: "#95E1D3",
      date: "2024.11.28"
    },
    {
      id: 5,
      title: "일반 제품 디자인 템플릿",
      description: "일반 제품용 디자인 시안 템플릿",
      type: "ZIP",
      icon: <Image style={{ width: "24px", height: "24px" }} />,
      size: "12.8 MB",
      category: "디자인 템플릿",
      subCategory: "일반 제품",
      color: "#A8DADC",
      date: "2024.12.05"
    },
    {
      id: 6,
      title: "포장 옵션 가이드",
      description: "다양한 포장 방식과 비용 안내",
      type: "PDF",
      icon: <FileText style={{ width: "24px", height: "24px" }} />,
      size: "3.2 MB",
      category: "가이드",
      subCategory: null,
      color: "#F4A261",
      date: "2024.11.10"
    },
    {
      id: 7,
      title: "KC 인증 안내서",
      description: "KC 인증 절차와 필요 서류 안내",
      type: "PDF",
      icon: <FileText style={{ width: "24px", height: "24px" }} />,
      size: "1.8 MB",
      category: "인증 자료",
      subCategory: null,
      color: "#E76F51",
      date: "2024.10.25"
    },
    {
      id: 8,
      title: "CE 인증 가이드",
      description: "유럽 수출을 위한 CE 인증 절차",
      type: "PDF",
      icon: <FileText style={{ width: "24px", height: "24px" }} />,
      size: "2.1 MB",
      category: "인증 자료",
      subCategory: null,
      color: "#2A9D8F",
      date: "2024.10.30"
    },
    {
      id: 9,
      title: "사이즈 가이드",
      description: "인형 사이즈별 제작 비용 및 특징",
      type: "PDF",
      icon: <FileText style={{ width: "24px", height: "24px" }} />,
      size: "1.5 MB",
      category: "기타",
      subCategory: null,
      color: "#264653",
      date: "2024.11.05"
    },
    {
      id: 10,
      title: "원산지 라벨 기본 템플릿",
      description: "제품 원산지 표기를 위한 라벨 디자인 템플릿",
      type: "AI",
      icon: <Image style={{ width: "24px", height: "24px" }} />,
      size: "3.5 MB",
      category: "디자인 템플릿",
      subCategory: "공통",
      color: "#FFD93D",
      date: "2024.12.12"
    },
    {
      id: 11,
      title: "행택 기본 템플릿(3세 이상, 8세 이상)",
      description: "어린이 제품용 행택 디자인 템플릿",
      type: "AI",
      icon: <Image style={{ width: "24px", height: "24px" }} />,
      size: "2.8 MB",
      category: "디자인 템플릿",
      subCategory: "어린이 제품",
      color: "#95E1D3",
      date: "2024.12.13"
    },
    {
      id: 12,
      title: "행택 기본 템플릿(14세 이상)",
      description: "일반 제품용 행택 디자인 템플릿",
      type: "AI",
      icon: <Image style={{ width: "24px", height: "24px" }} />,
      size: "2.6 MB",
      category: "디자인 템플릿",
      subCategory: "일반 제품",
      color: "#A8DADC",
      date: "2024.12.13"
    },
    {
      id: 13,
      title: "KC 인증 마크 템플릿(3세 이상, 8세 이상 공통)",
      description: "어린이 제품 KC 인증 마크 디자인 템플릿 파일",
      type: "PSD",
      icon: <Image style={{ width: "24px", height: "24px" }} />,
      size: "4.2 MB",
      category: "디자인 템플릿",
      subCategory: "어린이 제품",
      color: "#95E1D3",
      date: "2024.12.14"
    },
    {
      id: 14,
      title: "어린이 제품 안전 표시 사항 템플릿(3세 이상)",
      description: "어린이 제품 안전 표시 사항 디자인 템플릿 파일",
      type: "PSD",
      icon: <Image style={{ width: "24px", height: "24px" }} />,
      size: "3.6 MB",
      category: "디자인 템플릿",
      subCategory: "어린이 제품",
      color: "#95E1D3",
      date: "2024.12.14"
    },
    {
      id: 15,
      title: "생활용품 안전관리법 품질 표시 사항 템플릿(14세 이상)",
      description: "생활용품 안전 표시 사항 디자인 템플릿 파일",
      type: "PSD",
      icon: <Image style={{ width: "24px", height: "24px" }} />,
      size: "3.9 MB",
      category: "디자인 템플릿",
      subCategory: "공통",
      color: "#FFD93D",
      date: "2024.12.15"
    }
  ];

  // 카테고리 목록 (Category List)
  const mainCategories = ["전체", "가이드", "카탈로그", "인증 자료", "디자인 템플릿", "기타"];
  
  // 디자인 템플릿 하위 카테고리 (Design Template Sub-categories)
  const designTemplateSubCategories = ["전체", "공통", "어린이 제품", "일반 제품"];

  // 필터링된 자료 (Filtered Resources)
  const filteredResources = useMemo(() => {
    let filtered = resources;

    // 카테고리 필터 (Category filter)
    if (selectedCategory !== "전체") {
      filtered = filtered.filter(item => item.category === selectedCategory);
      
      // 하위 카테고리 필터 (Sub-category filter)
      if (selectedCategory === "디자인 템플릿" && selectedSubCategory && selectedSubCategory !== "전체") {
        filtered = filtered.filter(item => item.subCategory === selectedSubCategory);
      }
    }

    // 검색 필터 (Search filter)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, selectedSubCategory, searchQuery]);

  // 자료 선택 토글 (Toggle resource selection)
  const toggleResourceSelection = (id: number) => {
    setSelectedResources(prev => 
      prev.includes(id) 
        ? prev.filter(resId => resId !== id)
        : [...prev, id]
    );
  };

  // 전체 선택/해제 (Select/Deselect all)
  const toggleSelectAll = () => {
    if (selectedResources.length === filteredResources.length) {
      setSelectedResources([]);
    } else {
      setSelectedResources(filteredResources.map(r => r.id));
    }
  };

  // 선택 항목 다운로드 (Download selected items)
  const downloadSelected = () => {
    const selectedTitles = resources
      .filter(r => selectedResources.includes(r.id))
      .map(r => r.title)
      .join(', ');
    alert(`다음 자료를 다운로드합니다:\n${selectedTitles}`);
    setSelectedResources([]);
  };

  // 자료 요청 제출 (Submit resource request)
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`자료 요청이 접수되었습니다.\n담당자가 확인 후 연락드리겠습니다.`);
    setIsRequestModalOpen(false);
    setRequestForm({ name: "", email: "", message: "" });
  };

  // 카테고리 변경 시 하위 카테고리 초기화 (Reset sub-category on category change)
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(category === "디자인 템플릿" ? "전체" : null);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 (Reset to first page on category change)
  };

  // 페이지 변경 (Change page)
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 카테고리나 검색어 변경 시 첫 페이지로 이동 (Reset to first page on filter change)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubCategory, searchQuery]);

  // 페이지 번호 배열 생성 (Generate page numbers array)
  const getPageNumbers = () => {
    const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
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
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 16px", overflowX: "hidden" }} className="resource-center-container">
        <style>{`
          @media (min-width: 768px) {
            .resource-center-container {
              padding: 0 20px !important;
            }
            .resource-center-title {
              font-size: 40px !important;
            }
            .resource-center-subtitle {
              font-size: 18px !important;
            }
            .resource-center-search {
              padding: 16px 50px !important;
            }
            .resource-center-card {
              padding: 24px !important;
            }
            .resource-center-bottom-info {
              padding: 32px !important;
            }
          }
          @media (max-width: 767px) {
            .resource-center-title {
              font-size: 28px !important;
            }
            .resource-center-subtitle {
              font-size: 16px !important;
            }
            .resource-center-search {
              padding: 14px 40px !important;
              font-size: 14px !important;
            }
            .resource-center-card {
              padding: 16px !important;
            }
            .resource-center-bottom-info {
              padding: 24px !important;
            }
          }
        `}</style>
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
            <span style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.secondary, letterSpacing: "-0.02em" }}>Resource Center</span>
          </div>
          <h1 className="resource-center-title" style={{ fontSize: "40px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "16px", letterSpacing: "-0.02em" }}>자료실</h1>
          <p className="resource-center-subtitle" style={{ fontSize: "18px", color: BRAND_COLORS.text.secondary, lineHeight: 1.6 }}>
            제작에 필요한 모든 자료를 한 곳에서 다운로드하세요
          </p>
        </div>

        {/* 검색바 (Search Bar) */}
        <div style={{ maxWidth: "600px", margin: "0 auto 32px", position: "relative" }}>
          <Search 
            style={{ 
              position: "absolute", 
              left: "16px", 
              top: "50%", 
              transform: "translateY(-50%)", 
              width: "18px", 
              height: "18px", 
              color: BRAND_COLORS.text.tertiary 
            }} 
          />
          <input
            type="text"
            placeholder="자료 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="resource-center-search"
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
                right: "16px",
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

        {/* 카테고리 필터 (Category Filter) */}
        <div style={{ marginBottom: "24px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
          {mainCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              style={{
                padding: "10px 20px",
                borderRadius: "100px",
                border: "none",
                backgroundColor: selectedCategory === category ? BRAND_COLORS.secondary : "white",
                color: selectedCategory === category ? "white" : BRAND_COLORS.text.secondary,
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = "white";
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 디자인 템플릿 하위 카테고리 (Design Template Sub-categories) */}
        {selectedCategory === "디자인 템플릿" && (
          <div style={{ marginBottom: "32px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            {designTemplateSubCategories.map((subCat) => (
              <button
                key={subCat}
                onClick={() => setSelectedSubCategory(subCat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "100px",
                  border: `2px solid ${selectedSubCategory === subCat ? BRAND_COLORS.primary : BRAND_COLORS.border}`,
                  backgroundColor: selectedSubCategory === subCat ? `${BRAND_COLORS.primary}20` : "white",
                  color: selectedSubCategory === subCat ? BRAND_COLORS.secondary : BRAND_COLORS.text.secondary,
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {subCat}
              </button>
            ))}
          </div>
        )}

        {/* 선택 컨트롤 (Selection Controls) */}
        {filteredResources.length > 0 && (
          <div style={{ 
            marginBottom: "24px", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "12px 20px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <button
              onClick={toggleSelectAll}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                color: BRAND_COLORS.text.primary,
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                  border: `2px solid ${selectedResources.length === filteredResources.length ? BRAND_COLORS.secondary : BRAND_COLORS.border}`,
                  backgroundColor: selectedResources.length === filteredResources.length ? BRAND_COLORS.secondary : "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                {selectedResources.length === filteredResources.length && (
                  <Check style={{ width: "14px", height: "14px", color: "white", strokeWidth: 3 }} />
                )}
              </div>
              전체 선택
            </button>
            <span style={{ fontSize: "14px", color: BRAND_COLORS.text.secondary }}>
              {selectedResources.length}개 선택됨
            </span>
          </div>
        )}

        {/* 자료 그리드 (Resource Grid) - 모바일 2개, 데스크톱 4개 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }} className="resource-grid-mobile">
          <style>{`
            @media (min-width: 768px) {
              .resource-grid-mobile {
                grid-template-columns: repeat(4, 1fr) !important;
                gap: 20px !important;
              }
            }
          `}</style>
          {filteredResources.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((resource) => (
            <div
              key={resource.id}
              className="resource-center-card"
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                border: `2px solid ${selectedResources.includes(resource.id) ? BRAND_COLORS.secondary : "transparent"}`,
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
              }}
            >
              {/* 체크박스 (Checkbox) - 네이비 배경에 흰색 체크 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleResourceSelection(resource.id);
                }}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    border: `2px solid ${selectedResources.includes(resource.id) ? BRAND_COLORS.secondary : BRAND_COLORS.border}`,
                    backgroundColor: selectedResources.includes(resource.id) ? BRAND_COLORS.secondary : "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}
                >
                  {selectedResources.includes(resource.id) && (
                    <Check style={{ width: "16px", height: "16px", color: "white", strokeWidth: 3 }} />
                  )}
                </div>
              </button>

              {/* 아이콘 & 타입 (Icon & Type) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", paddingRight: "32px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `${resource.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: resource.color,
                  }}
                >
                  {resource.icon}
                </div>
                <div
                  style={{
                    padding: "4px 10px",
                    borderRadius: "6px",
                    backgroundColor: BRAND_COLORS.background.tertiary,
                    fontSize: "11px",
                    fontWeight: 600,
                    color: BRAND_COLORS.text.secondary,
                  }}
                >
                  {resource.type}
                </div>
              </div>

              {/* 제목 & 설명 (Title & Description) */}
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: BRAND_COLORS.text.primary,
                  marginBottom: "6px",
                  letterSpacing: "-0.01em",
                  lineHeight: "1.4",
                }}
              >
                {resource.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: BRAND_COLORS.text.secondary,
                  lineHeight: 1.5,
                  marginBottom: "16px",
                  minHeight: "40px",
                }}
              >
                {resource.description}
              </p>

              {/* 날짜 표기 (Date) */}
              <div style={{ 
                fontSize: "12px", 
                color: BRAND_COLORS.text.tertiary,
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {resource.date}
              </div>

              {/* 하단 정보 (Bottom Info) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1 }}>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor: `${resource.color}15`,
                      fontSize: "11px",
                      fontWeight: 600,
                      color: resource.color,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {resource.subCategory || resource.category}
                  </span>
                  <span style={{ fontSize: "12px", color: BRAND_COLORS.text.tertiary, whiteSpace: "nowrap" }}>
                    {resource.size}
                  </span>
                </div>

                {/* 다운로드 버튼 (Download Button) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`"${resource.title}" 다운로드를 시작합니다.`);
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: resource.color,
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Download style={{ width: "18px", height: "18px", color: "white" }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 페이징 (Pagination) */}
        {filteredResources.length > ITEMS_PER_PAGE && (() => {
          const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
          return (
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
          );
        })()}

        {/* 검색 결과 없음 (No search results) */}
        {filteredResources.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: "60px 20px",
            backgroundColor: "white",
            borderRadius: "20px",
          }}>
            <Eye style={{ width: "64px", height: "64px", color: BRAND_COLORS.text.tertiary, margin: "0 auto 20px" }} />
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "8px" }}>
              검색 결과가 없습니다
            </h3>
            <p style={{ fontSize: "15px", color: BRAND_COLORS.text.secondary }}>
              다른 검색어나 카테고리를 시도해보세요
            </p>
          </div>
        )}

        {/* 추가 안내 (Additional Info) */}
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
          <Eye style={{ width: "48px", height: "48px", color: BRAND_COLORS.primary, margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "8px" }}>
            필요한 자료가 없으신가요?
          </h3>
          <p style={{ fontSize: "15px", color: BRAND_COLORS.text.secondary, marginBottom: "20px" }}>
            추가로 필요하신 자료가 있으시면 문의해주세요
          </p>
          <button
            onClick={() => setIsRequestModalOpen(true)}
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
            자료 요청하기
          </button>
        </div>
      </div>

      {/* 선택 항목 다운로드 플로팅 버튼 (Floating download button for selected items) */}
      {selectedResources.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            backgroundColor: BRAND_COLORS.secondary,
            color: "white",
            padding: "16px 28px",
            borderRadius: "100px",
            boxShadow: "0 8px 24px rgba(26, 40, 103, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            zIndex: 1000,
            transition: "all 0.3s ease",
          }}
          onClick={downloadSelected}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(26, 40, 103, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(26, 40, 103, 0.4)";
          }}
        >
          <Download style={{ width: "20px", height: "20px" }} />
          <span style={{ fontSize: "15px", fontWeight: 600 }}>
            선택 항목 다운로드 ({selectedResources.length})
          </span>
        </div>
      )}

      {/* 자료 요청 모달 (Resource Request Modal) */}
      {isRequestModalOpen && (
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
          onClick={() => setIsRequestModalOpen(false)}
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
                  자료 요청하기
                </h2>
                <button
                  onClick={() => setIsRequestModalOpen(false)}
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
                필요하신 자료를 알려주시면 확인 후 연락드리겠습니다
              </p>
            </div>

            {/* 요청 폼 (Request Form) */}
            <form onSubmit={handleRequestSubmit}>
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
                  value={requestForm.name}
                  onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
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
                  value={requestForm.email}
                  onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
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
                  필요한 자료 설명
                </label>
                <textarea
                  required
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({...requestForm, message: e.target.value})}
                  rows={5}
                  placeholder="어떤 자료가 필요하신지 구체적으로 설명해주세요"
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
                  onClick={() => setIsRequestModalOpen(false)}
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
                  요청하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}