import React, { useState, useEffect, useRef, useCallback } from "react";
import QuoteRequestPopupWithAI from "./new-file";
import QudisomHomeSection from "./components/QudisomHomeSection";

// ============================================
// 메인 홈 히어로 섹션 컴포넌트 (Main Home Hero Section Component)
// 브랜드: Qudisom - 인형 제작 OEM 스타트업
// 스타일: 토스 스타일 미니멀 & 트렌디 디자인
// ============================================

// ========== 브랜드 컬러 정의 (Brand Color Definition) ==========
const BRAND_COLORS = {
  primary: "#ffd93d", // 메인 컬러 (Main Color - Yellow)
  secondary: "#1a2867", // 서브 컬러 (Sub Color - Navy)
  text: {
    primary: "#191F28",
    secondary: "#4E5968",
    tertiary: "#8B95A1",
    white: "#FFFFFF",
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    dark: "#0a0a0a",
  },
};

// ========== 타이핑 텍스트 데이터 (Typing Text Data) ==========
const TYPING_TEXTS = [
  "상상 속 캐릭터가 현실이 되는 공간",
  "당신만을 위한, 특별한 '작품'을 만듭니다.",
];

// ========== 카운터 데이터 (Counter Data) ==========
const COUNTER_DATA = [
  { target: 1028, suffix: "+", label: "고객사" },
  { target: 11413, suffix: "+", label: "제작 사례" },
  { target: 132179, suffix: "+", label: "제작 아이템" },
  { target: 77, suffix: "%+", label: "재구매율" },
];

// ========== 슬로건 데이터 (Slogan Data) ==========
const SLOGAN_DATA = [
  { text: "HIGH ", highlight: "QU", rest: "ALITY" },
  { text: "", highlight: "DI", rest: "SCOVER DESIGN" },
  { text: "", highlight: "SOM", rest: "THING SPECIAL" },
];

// ========== 아이콘 컴포넌트 (Icon Components) ==========
const ExternalLinkIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

// ========== 타이핑 효과 훅 (Typing Effect Hook) ==========
const useTypingEffect = (texts: string[], typingSpeed: number = 80, startDelay: number = 500) => {
  const [displayTexts, setDisplayTexts] = useState<string[]>(texts.map(() => ""));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // 시작 딜레이 (Start Delay)
    const startTimer = setTimeout(() => {
      setHasStarted(true);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!hasStarted || isComplete) return;

    const currentText = texts[currentIndex];

    if (currentCharIndex < currentText.length) {
      // 타이핑 중 (Typing in progress)
      const timer = setTimeout(() => {
        setDisplayTexts((prev) => {
          const newTexts = [...prev];
          newTexts[currentIndex] = currentText.substring(0, currentCharIndex + 1);
          return newTexts;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else if (currentIndex < texts.length - 1) {
      // 다음 텍스트로 이동 (Move to next text)
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      // 모든 타이핑 완료 (All typing complete)
      setIsComplete(true);
    }
  }, [hasStarted, currentIndex, currentCharIndex, texts, typingSpeed, isComplete]);

  return { displayTexts, currentIndex, isComplete, hasStarted };
};

// ========== 카운터 애니메이션 훅 (Counter Animation Hook) ==========
const useCounterAnimation = (target: number, duration: number = 2000, startAnimation: boolean = false) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!startAnimation || hasAnimated) return;

    setHasAnimated(true);
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // EaseOutQuad 이징 효과 (Easing Effect)
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(easedProgress * target);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, startAnimation, hasAnimated]);

  return count;
};

// ========== 인터섹션 옵저버 훅 (Intersection Observer Hook) ==========
const useIntersectionObserver = (threshold: number = 0.2) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

// ========== 카운터 아이템 컴포넌트 (Counter Item Component) ==========
const CounterItem = ({
  target,
  suffix,
  label,
  startAnimation,
}: {
  target: number;
  suffix: string;
  label: string;
  startAnimation: boolean;
}) => {
  const count = useCounterAnimation(target, 2000, startAnimation);

  return (
    <div style={styles.counterBox} className="counter-box-mobile">
      <div style={styles.counterNumber} className="counter-number-mobile">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div style={styles.counterLabel} className="counter-label-mobile">{label}</div>
    </div>
  );
};

// ========== 메인 컴포넌트 (Main Component) ==========
export default function MainHeroSection() {
  const { displayTexts, currentIndex, isComplete, hasStarted } = useTypingEffect(TYPING_TEXTS, 80, 800);
  const { ref: counterRef, isVisible: counterVisible } = useIntersectionObserver(0.3);
  
  // 견적 요청 모달 상태 관리 (Quote Request Modal State Management)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // YouTube 영상 ID 추출 (Extract YouTube Video ID)
  const youtubeVideoId = "hS8AJotPO4c";

  return (
    <>
      <section style={styles.heroSection}>
        {/* YouTube 배경 영상 (YouTube Background Video) */}
        <div style={styles.videoBackground}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`}
            style={styles.videoIframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Background Video"
          />
        </div>

        {/* 어두운 오버레이 (Dark Overlay) */}
        <div style={styles.overlay} />

        {/* 파티클 효과 (Particle Effect) */}
        <div style={styles.particleContainer}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.particle,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* 메인 콘텐츠 (Main Content) */}
        <div style={styles.contentWrapper} className="content-wrapper-mobile">
          {/* 타이핑 텍스트 영역 (Typing Text Area) */}
          <div style={styles.typingContainer}>
            {TYPING_TEXTS.map((text, index) => (
              <p
                key={index}
                style={{
                  ...styles.typingText,
                  opacity: hasStarted ? 1 : 0,
                  fontSize: "clamp(24px, 5vw, 42px)", // 모바일에서 더 크게 조정 (increased size for mobile)
                  fontWeight: 700, // 볼드 처리
                }}
                className="typing-text-mobile"
              >
                {displayTexts[index]}
                {/* 커서 (Cursor) */}
                {hasStarted && currentIndex === index && !isComplete && (
                  <span style={styles.cursor}>|</span>
                )}
              </p>
            ))}
          </div>

          {/* 슬로건 영역 (Slogan Area) */}
          <div style={styles.sloganContainer} className="slogan-container-mobile">
            {SLOGAN_DATA.map((slogan, index) => (
              <p 
                key={index} 
                style={{
                  ...styles.sloganText,
                  fontSize: "clamp(20px, 3vw, 28px)", // 모바일에서 더 크게 조정 (increased size for mobile)
                }} 
                className="slogan-text-mobile"
              >
                <span style={styles.sloganNormal}>{slogan.text}</span>
                <span style={styles.sloganHighlight}>{slogan.highlight}</span>
                <span style={styles.sloganNormal}>{slogan.rest}</span>
              </p>
            ))}
          </div>

          {/* 배경 브랜드명 (Background Brand Name) */}
          <div style={styles.brandWatermark} className="brand-watermark-mobile">QUDISOM</div>

          {/* CTA 버튼 (CTA Button) */}
          <button 
            style={styles.ctaButton}
            className="cta-button-mobile" 
            onClick={() => setIsQuoteModalOpen(true)}
          >
            <ExternalLinkIcon size={18} />
            <span>나만의 캐릭터 작품 만들기</span>
          </button>

          {/* 카운터 섹션 (Counter Section) */}
          <div ref={counterRef} style={styles.counterContainer} className="counter-container-mobile">
            {COUNTER_DATA.map((item, index) => (
              <CounterItem
                key={index}
                target={item.target}
                suffix={item.suffix}
                label={item.label}
                startAnimation={counterVisible}
              />
            ))}
          </div>
        </div>

        {/* CSS 애니메이션 (CSS Animations) */}
        <style>{`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          
          @keyframes float {
            0%, 100% { 
              transform: translateY(0) scale(1);
              opacity: 0.6;
            }
            50% { 
              transform: translateY(-20px) scale(1.2);
              opacity: 1;
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.1; }
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          /* 모바일 반응형 (Mobile Responsive) */
          @media (max-width: 768px) {
            .content-wrapper-mobile {
              padding: 24px !important;
            }
            
            .typing-text-mobile {
              font-size: clamp(18px, 4vw, 22px) !important;
              line-height: 1.4 !important;
            }
            
            .slogan-container-mobile {
              margin-top: 20px !important;
              margin-bottom: 20px !important;
            }
            
            .slogan-text-mobile {
              font-size: clamp(14px, 4vw, 24px) !important;
              line-height: 1.1 !important;
            }
            
            .brand-watermark-mobile {
              font-size: clamp(60px, 15vw, 100px) !important;
            }
            
            .cta-button-mobile {
              padding: 14px 24px !important;
              font-size: 14px !important;
            }
            
            .cta-button-mobile span {
              display: inline !important;
            }
            
            .counter-container-mobile {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 16px !important;
              margin-top: 32px !important;
            }
            
            .counter-box-mobile {
              padding: 16px !important;
            }
            
            .counter-number-mobile {
              font-size: clamp(14px, 3.5vw, 20px) !important;
            }
            
            .counter-label-mobile {
              font-size: 12px !important;
              margin-top: 4px !important;
            }
          }
          
          @media (max-width: 480px) {
            .content-wrapper-mobile {
              padding: 20px !important;
            }
            
            .typing-text-mobile {
              font-size: 16px !important;
            }
            
            .slogan-text-mobile {
              font-size: 28px !important;
            }
            
            .brand-watermark-mobile {
              font-size: 50px !important;
            }
            
            .cta-button-mobile {
              padding: 12px 20px !important;
              font-size: 13px !important;
              flex-direction: column !important;
              gap: 8px !important;
            }
            
            .counter-number-mobile {
              font-size: 20px !important;
            }
          }
        `}</style>
        
        {/* 견적 요청 모달 (Quote Request Modal) */}
        {isQuoteModalOpen && (
          <QuoteRequestPopupWithAI 
            onNavigate={(page) => {
              if (page === 'close') {
                setIsQuoteModalOpen(false);
              }
            }} 
          />
        )}
      </section>
      
      {/* 쿠디솜 홈 섹션 (Qudisom Home Section - Hero & Factory) */}
      <QudisomHomeSection />
    </>
  );
}

// ========== 스타일 정의 (Style Definitions) ==========
const styles: { [key: string]: React.CSSProperties } = {
  // 히어로 섹션 (Hero Section)
  heroSection: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: BRAND_COLORS.background.dark,
  },

  // 비디오 배경 (Video Background)
  videoBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 0,
  },

  // 비디오 아이프레임 (Video Iframe)
  videoIframe: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100vw",
    height: "56.25vw", // 16:9 비율 (16:9 aspect ratio)
    minHeight: "100vh",
    minWidth: "177.77vh", // 16:9 비율 (16:9 aspect ratio)
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    border: "none",
  },

  // 오버레이 (Overlay)
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 1,
  },

  // 파티클 컨테이너 (Particle Container)
  particleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 2,
  },

  // 파티클 (Particle)
  particle: {
    position: "absolute",
    width: "4px",
    height: "4px",
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: "50%",
    animation: "float infinite ease-in-out",
    opacity: 0.6,
  },

  // 콘텐츠 래퍼 (Content Wrapper)
  contentWrapper: {
    position: "relative",
    zIndex: 3,
    maxWidth: "1200px",
    width: "100%",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },

  // 타이핑 컨테이너 (Typing Container)
  typingContainer: {
    marginBottom: "30px",
  },

  // 타이핑 텍스트 (Typing Text)
  typingText: {
    fontSize: "clamp(20px, 2.5vw, 28px)",
    color: BRAND_COLORS.text.white,
    margin: "8px 0",
    opacity: 0,
    transition: "opacity 0.5s ease",
    lineHeight: 1.5,
  },

  // 커서 (Cursor)
  cursor: {
    marginLeft: "4px",
    animation: "blink 1s step-end infinite",
    color: BRAND_COLORS.primary,
  },

  // 슬로건 컨테이너 (Slogan Container)
  sloganContainer: {
    marginTop: "40px",
    marginBottom: "40px",
  },

  // 슬로건 텍스트 (Slogan Text)
  sloganText: {
    fontSize: "clamp(20px, 3vw, 35px)",
    fontWeight: 800,
    margin: "8px 0",
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },

  // 슬로건 일반 텍스트 (Slogan Normal Text)
  sloganNormal: {
    color: BRAND_COLORS.text.white,
  },

  // 슬로건 강조 텍스트 (Slogan Highlight Text)
  sloganHighlight: {
    color: BRAND_COLORS.primary,
  },

  // 브랜드 워터마크 (Brand Watermark)
  brandWatermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "clamp(80px, 15vw, 180px)",
    fontWeight: 900,
    color: "rgba(255, 255, 255, 0.03)",
    letterSpacing: "0.1em",
    userSelect: "none",
    pointerEvents: "none",
    zIndex: -1,
  },

  // CTA 버튼 (CTA Button)
  ctaButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "18px 36px",
    fontSize: "16px",
    fontWeight: 600,
    borderRadius: "24px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    marginTop: "40px",
    marginBottom: "60px",
    background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, #ffed4e 50%, ${BRAND_COLORS.primary} 100%)`,
    backgroundSize: "200% 200%",
    animation: "gradientShift 3s ease infinite",
    color: BRAND_COLORS.text.primary,
    border: "none",
    boxShadow: `0 0 20px rgba(255, 217, 61, 0.6), 0 0 40px rgba(255, 217, 61, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)`,
  } as React.CSSProperties,

  // 카운터 컨테이너 (Counter Container)
  counterContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    width: "100%",
    maxWidth: "900px",
    marginTop: "60px",
  },

  // 카운터 박스 (Counter Box)
  counterBox: {
    backgroundColor: BRAND_COLORS.primary,
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
    border: `1px solid ${BRAND_COLORS.primary}`,
    transition: "all 0.3s ease",
  },

  // 카운터 숫자 (Counter Number)
  counterNumber: {
    fontSize: "clamp(17px, 2.1vw, 25px)",
    fontWeight: 700,
    color: BRAND_COLORS.text.primary,
    marginBottom: "8px",
  },

  // 카운터 라벨 (Counter Label)
  counterLabel: {
    fontSize: "14px",
    color: BRAND_COLORS.text.primary,
    marginTop: "8px",
  },
};