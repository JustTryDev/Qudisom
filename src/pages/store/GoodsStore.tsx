import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Filter } from 'lucide-react';

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

// ========== 굿즈 스토어 페이지 (Goods Store Page) ==========
export default function GoodsStore() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [favorites, setFavorites] = useState<number[]>([]);

  // 굿즈 상품 데이터 (Goods Products Data)
  const products = [
    {
      id: 1,
      name: "베이직 곰돌이 인형",
      price: 25000,
      originalPrice: 30000,
      image: "https://images.unsplash.com/photo-1669212409006-4684413000aa?w=500",
      category: "인형",
      rating: 4.8,
      reviews: 124,
      isNew: true,
      discount: 17
    },
    {
      id: 2,
      name: "동물 키링 세트",
      price: 15000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1671043119167-d1b8f88a88c6?w=500",
      category: "키링",
      rating: 4.9,
      reviews: 89,
      isNew: true,
      discount: 0
    },
    {
      id: 3,
      name: "프리미엄 토끼 인형",
      price: 35000,
      originalPrice: 42000,
      image: "https://images.unsplash.com/photo-1718818316580-ab6fc6114389?w=500",
      category: "인형",
      rating: 5.0,
      reviews: 67,
      isNew: false,
      discount: 17
    },
    {
      id: 4,
      name: "미니 인형 키링",
      price: 8000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1652379546952-a5e71b6c8e3f?w=500",
      category: "키링",
      rating: 4.7,
      reviews: 203,
      isNew: false,
      discount: 0
    },
    {
      id: 5,
      name: "에코백 세트",
      price: 18000,
      originalPrice: 22000,
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      category: "기타",
      rating: 4.6,
      reviews: 45,
      isNew: true,
      discount: 18
    },
    {
      id: 6,
      name: "캐릭터 쿠션",
      price: 28000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1616627988971-18547fbb42a1?w=500",
      category: "쿠션",
      rating: 4.8,
      reviews: 156,
      isNew: false,
      discount: 0
    },
    {
      id: 7,
      name: "한정판 고양이 인형",
      price: 45000,
      originalPrice: 55000,
      image: "https://images.unsplash.com/photo-1553315164-49bb0615e0c6?w=500",
      category: "인형",
      rating: 4.9,
      reviews: 32,
      isNew: true,
      discount: 18
    },
    {
      id: 8,
      name: "스티커 팩",
      price: 5000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500",
      category: "기타",
      rating: 4.5,
      reviews: 278,
      isNew: false,
      discount: 0
    }
  ];

  // 카테고리 목록 (Category List)
  const categories = ["전체", ...Array.from(new Set(products.map(item => item.category)))];

  // 필터링된 상품 (Filtered Products)
  const filteredProducts = selectedCategory === "전체"
    ? products
    : products.filter(item => item.category === selectedCategory);

  // 찜하기 토글 (Toggle Favorite)
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ backgroundColor: BRAND_COLORS.background.secondary, minHeight: "100vh", paddingTop: "80px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
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
            <span style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.secondary, letterSpacing: "-0.02em" }}>Goods Store</span>
          </div>
          <h1 style={{ fontSize: "40px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "16px", letterSpacing: "-0.02em" }}>굿즈 스토어</h1>
          <p style={{ fontSize: "18px", color: BRAND_COLORS.text.secondary, lineHeight: 1.6 }}>
            퀄리티 높은 완제품을 바로 구매하세요
          </p>
        </div>

        {/* 카테고리 & 필터 (Category & Filter) */}
        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
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

          {/* 정렬 버튼 (Sort Button) */}
          <button
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              border: `1px solid ${BRAND_COLORS.border}`,
              backgroundColor: "white",
              color: BRAND_COLORS.text.secondary,
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = BRAND_COLORS.border;
            }}
          >
            <Filter style={{ width: "16px", height: "16px" }} />
            정렬
          </button>
        </div>

        {/* 상품 그리드 (Product Grid) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)";
              }}
            >
              {/* 이미지 영역 (Image Area) */}
              <div
                style={{
                  position: "relative",
                  paddingTop: "100%",
                  overflow: "hidden",
                  backgroundColor: BRAND_COLORS.background.tertiary,
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* 뱃지 (Badges) */}
                <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
                  {product.isNew && (
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        backgroundColor: "#FF6B6B",
                        color: "white",
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      NEW
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        backgroundColor: BRAND_COLORS.primary,
                        color: BRAND_COLORS.secondary,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {product.discount}%
                    </span>
                  )}
                </div>

                {/* 찜하기 버튼 (Favorite Button) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Heart
                    style={{
                      width: "18px",
                      height: "18px",
                      color: favorites.includes(product.id) ? "#FF6B6B" : BRAND_COLORS.text.tertiary,
                      fill: favorites.includes(product.id) ? "#FF6B6B" : "none",
                    }}
                  />
                </button>
              </div>

              {/* 상품 정보 (Product Info) */}
              <div style={{ padding: "20px" }}>
                {/* 카테고리 (Category) */}
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    backgroundColor: BRAND_COLORS.background.tertiary,
                    fontSize: "11px",
                    fontWeight: 600,
                    color: BRAND_COLORS.text.tertiary,
                    marginBottom: "8px",
                  }}
                >
                  {product.category}
                </div>

                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: BRAND_COLORS.text.primary,
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {product.name}
                </h3>

                {/* 평점 (Rating) */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <Star style={{ width: "14px", height: "14px", fill: BRAND_COLORS.primary, stroke: BRAND_COLORS.primary }} />
                  <span style={{ fontSize: "13px", fontWeight: 600, color: BRAND_COLORS.text.primary }}>
                    {product.rating}
                  </span>
                  <span style={{ fontSize: "12px", color: BRAND_COLORS.text.tertiary }}>
                    ({product.reviews})
                  </span>
                </div>

                {/* 가격 (Price) */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {product.originalPrice && (
                    <span
                      style={{
                        fontSize: "14px",
                        color: BRAND_COLORS.text.tertiary,
                        textDecoration: "line-through",
                      }}
                    >
                      {product.originalPrice.toLocaleString()}원
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: BRAND_COLORS.text.primary,
                    }}
                  >
                    {product.price.toLocaleString()}원
                  </span>
                </div>

                {/* 장바구니 버튼 (Cart Button) */}
                <button
                  style={{
                    width: "100%",
                    marginTop: "16px",
                    padding: "12px",
                    backgroundColor: BRAND_COLORS.secondary,
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0f1841";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = BRAND_COLORS.secondary;
                  }}
                >
                  <ShoppingCart style={{ width: "16px", height: "16px" }} />
                  장바구니
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 배송 안내 (Shipping Info) */}
        <div
          style={{
            marginTop: "60px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "20px",
            border: `2px solid ${BRAND_COLORS.border}`,
          }}
        >
          <h3 style={{ fontSize: "24px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "24px", textAlign: "center" }}>
            배송 안내
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  backgroundColor: `${BRAND_COLORS.primary}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: "32px",
                }}
              >
                🚚
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: 600, color: BRAND_COLORS.text.primary, marginBottom: "6px" }}>
                무료 배송
              </h4>
              <p style={{ fontSize: "14px", color: BRAND_COLORS.text.secondary }}>
                5만원 이상 구매 시
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  backgroundColor: `${BRAND_COLORS.primary}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: "32px",
                }}
              >
                📦
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: 600, color: BRAND_COLORS.text.primary, marginBottom: "6px" }}>
                빠른 배송
              </h4>
              <p style={{ fontSize: "14px", color: BRAND_COLORS.text.secondary }}>
                평균 2-3일 배송
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  backgroundColor: `${BRAND_COLORS.primary}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: "32px",
                }}
              >
                🔄
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: 600, color: BRAND_COLORS.text.primary, marginBottom: "6px" }}>
                간편 교환/환불
              </h4>
              <p style={{ fontSize: "14px", color: BRAND_COLORS.text.secondary }}>
                7일 이내 무료 반품
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
