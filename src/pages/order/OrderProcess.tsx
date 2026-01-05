import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  WebGLRenderer, 
  Scene, 
  OrthographicCamera, 
  Clock, 
  Vector2, 
  ShaderMaterial, 
  PlaneGeometry, 
  Mesh 
} from "../../utils/three";

/**
 * 쿠디솜 스마트 주문 프로세스 컴포넌트 (v6 - WebGL Shader Hero)
 * Qudisom Smart Order Process Component (v6 - WebGL Shader Hero)
 * 
 * 특징 (Features):
 * - WebGL 셰이더 히어로 배경 (WebGL shader hero background)
 * - 반응형 디자인 (Responsive design)
 * - 스크롤 스냅 (Scroll snap)
 * - 이미지 확대 기능 (Image zoom/lightbox)
 * 
 * 브랜드 컬러 (Brand Colors):
 * - 메인 (Primary): #ffd93d
 * - 서브 (Secondary): #1a2867
 */

// 스텝 데이터 타입 정의 (Step data type definition)
interface StepData {
  step: number;
  title: string;
  quote: string;
  description: string[];
  image: string;
}

// 주문 프로세스 스텝 데이터 (Order process step data)
const stepsData: StepData[] = [
  {
    step: 1,
    title: "디자인 개발 및 기획",
    quote: "어떤 모습일지 감이 안 와요…",
    description: [
      "그저 '이런 느낌이면 좋겠어요'라는 말만 남겨주셔도 됩니다. 꼭 완성된 도안이 아니어도 괜찮습니다. 손으로 그린 스케치, 참고 이미지, 혹은 막연한 아이디어만 있어도 쿠디솜은 그것을 하나의 작품으로 풀어낼 준비가 되어 있습니다.",
      "AI 기반 시각화 툴과 숙련된 전문 디자이너가 함께 작품을 완성해 드립니다. 추상적인 감성을 구체적인 결과물로 전환하는 것이 쿠디솜이 잘하는 일입니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/0396cf88ebe9b.jpg"
  },
  {
    step: 2,
    title: "디자인 및 기획안 접수",
    quote: "디자인이 있다는 건 큰 시작입니다.",
    description: [
      "작가님께서 보내주신 디자인은 단순한 그림이 아닌 브랜드의 정체성이 담긴 결과물입니다. 그 의미를 온전히 살리기 위해 디자인을 면밀히 분석하고, 실제 작품으로 구현될 때 어떤 원단과 비율, 질감으로 표현되는 것이 가장 적절할지를 먼저 고민합니다.",
      "라인 하나, 눈동자 하나까지 세심하게 검토하며 자수 표현, 색상 구현, 봉제 구조 등 기술적인 측면을 꼼꼼히 점검합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250806/5a80e757c2fa3.jpg"
  },
  {
    step: 3,
    title: "샘플 및 예상 견적 산출",
    quote: "숫자와 감성 사이, 가장 정직한 대화의 시작",
    description: [
      "견적은 고객님과 저희가 같은 그림을 보고 있는지 확인하는 작업입니다. 쿠디솜은 디자인과 사양을 기준으로 가장 합리적인 가격을 제안하며, 고객님께서 원하시는 수준에 맞춰 현실적인 선택지를 제공해드립니다.",
      "고객님의 선택이 불필요한 부담으로 바뀌지 않도록, 처음부터 끝까지 정직하게 안내드리는 것이 쿠디솜의 기준입니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250822/41b5a1b7b991c.jpg"
  },
  {
    step: 4,
    title: "샘플링 작업",
    quote: "작품의 가장 중요한 리허설",
    description: [
      "샘플 제작은 단순한 테스트가 아닌, 고객님의 작품이 처음 세상에 모습을 드러내는 단계입니다. 질감, 색상, 비율 등이 어떻게 실현되는지를 직접 확인하실 수 있습니다.",
      "이 과정에서 최대 2회까지 무료 수정이 가능합니다. 샘플 수령 전 사진 및 영상으로도 실물 확인이 가능하며, 비대면 상황에서도 빠른 피드백이 가능합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250806/c23c6bf564eb0.png"
  },
  {
    step: 5,
    title: "샘플 피드백 및 최종 컨펌",
    quote: "작은 차이 하나가 작품의 분위기를 결정합니다.",
    description: [
      "많은 고객님들께서 샘플을 보고 나면 처음에는 보지 못했던 디테일을 발견합니다. 미세한 색상 오차, 자수 밀도의 체감, 충전재의 볼륨 등 실물로 확인해야만 알 수 있는 요소들이 존재하기 때문입니다.",
      "고객의 시선과 감각을 바탕으로, 피드백 하나하나를 세밀하게 반영합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250806/9d95daf057ba3.png"
  },
  {
    step: 6,
    title: "최종 견적 및 결제",
    quote: "작가님이 선택한 결과를 하나의 수치로 정리합니다.",
    description: [
      "샘플 피드백이 모두 반영된 최종 사양을 기준으로, 정확한 수량과 납기, 자재 구성에 따른 최종 단가를 투명하게 정리해드립니다.",
      "결제는 토스페이먼츠를 통해 네이버페이, 카카오페이, 카드, 계좌이체 등 다양한 방식으로 안전하고 유연하게 진행하실 수 있습니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/50d9c62f42f79.jpg"
  },
  {
    step: 7,
    title: "원단 및 부자재 발주",
    quote: "가능한 자재가 아닌, 적합한 자재를 선택합니다.",
    description: [
      "원부자재의 조직감이나 충전재의 탄성, 자수 실의 색상 차이는 전체 인상을 좌우하는 핵심 요소입니다. 단가나 납기 일정만을 기준으로 자재를 선택하지 않습니다.",
      "모든 자재는 장기간 긴밀하게 협력해온 공장을 통해 관리되어 최고의 품질을 유지합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250822/f23f8c761a1fc.jpg"
  },
  {
    step: 8,
    title: "본 제품 생산",
    quote: "수량과 관계 없이, 품질은 흔들리지 않습니다.",
    description: [
      "최종 컨펌된 감성, 촉감, 디테일이 그대로 유지될 수 있도록 각 공정에 정밀한 품질 기준을 설정합니다.",
      "'많이 만든다'는 이유로 '대충' 만들지 않는 것이 쿠디솜의 생산 원칙입니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/759aa8c1ae669.jpg"
  },
  {
    step: 9,
    title: "해상 운송",
    quote: "바다를 건너는 시간도 신뢰의 일부입니다.",
    description: [
      "쿠디솜은 충전재 압축 손상, 자수 눌림, 제품 변형 등의 가능성을 사전에 차단하기 위해 적절한 박스 규격과 완충 구조를 설계합니다.",
      "API 기반의 실시간 선박 위치 추적 시스템을 통해 지금 제품이 어느 바다 위를 지나고 있는지 확인할 수 있습니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250812/c4e21190e4ea7.png"
  },
  {
    step: 10,
    title: "제품 납품",
    quote: "납품은 끝이 아니라, 기억에 남는 마무리여야 합니다.",
    description: [
      "단발성 제작이 아닌, 장기적인 브랜드 파트너로서의 관계를 지향합니다.",
      "마지막까지 '쿠디솜다움'을 지키는 것이 쿠디솜의 방식입니다. 프로젝트 종료 이후에도 피드백이나 리오더 요청에 즉시 대응할 수 있는 채널은 항상 열려있습니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250806/7e1a50474d939.jpg"
  }
];

// 반응형 훅 (Responsive hook)
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

// 타이핑 효과 훅 (Typing effect hook)
const useTypingEffect = (text: string, speed: number = 80, startTyping: boolean = true) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!startTyping) {
      setDisplayedText("");
      setIsComplete(false);
      return;
    }

    let index = 0;
    setDisplayedText("");
    setIsComplete(false);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, startTyping]);

  return { displayedText, isComplete };
};

// WebGL 셰이더 배경 컴포넌트 (WebGL Shader Background Component)
// 브랜드 컬러 적용 (Brand colors applied): #ffd93d, #1a2867
const ShaderBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer, Scene, Camera, Clock 설정 (Setup)
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new Clock();

    // GLSL 셰이더 (GLSL Shaders) - 브랜드 컬러 적용
    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // 프래그먼트 셰이더 - 브랜드 컬러 (#ffd93d, #1a2867) 적용
    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
          mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 6; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec2 mouse = (iMouse - 0.5 * iResolution.xy) / iResolution.y;
        float t = iTime * 0.08;

        // 마우스 주변 리플 효과 (Ripple effect around mouse)
        float d = length(uv - mouse);
        float ripple = 1.0 - smoothstep(0.0, 0.4, d);

        // 회전 효과 (Rotation effect)
        float angle = t * 0.3;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        vec2 p = rot * uv;

        // 잉크 패턴 (Ink patterns)
        float pattern = fbm(p * 2.5 + t);
        pattern -= fbm(p * 5.0 - t * 0.3) * 0.3;
        pattern += ripple * 0.4;

        // 브랜드 컬러 (Brand colors)
        // #1a2867 -> vec3(0.102, 0.157, 0.404) - 서브 컬러 (네이비)
        // #ffd93d -> vec3(1.0, 0.851, 0.239) - 메인 컬러 (옐로우)
        vec3 navy = vec3(0.102, 0.157, 0.404);
        vec3 deepNavy = vec3(0.05, 0.08, 0.25);
        vec3 gold = vec3(1.0, 0.851, 0.239);
        vec3 softGold = vec3(0.95, 0.85, 0.5);

        // 색상 혼합 (Color mixing)
        vec3 color = mix(deepNavy, navy, smoothstep(0.3, 0.6, pattern));
        
        // 골드 하이라이트 (Gold highlights)
        float highlight = pow(smoothstep(0.55, 0.75, pattern), 2.5);
        color = mix(color, softGold, highlight * 0.6);
        
        // 밝은 골드 포인트 (Bright gold points)
        float brightSpot = pow(smoothstep(0.7, 0.85, pattern), 3.0);
        color = mix(color, gold, brightSpot * 0.8);

        // 가장자리 비네팅 (Edge vignette)
        float vignette = 1.0 - length(uv) * 0.5;
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Uniforms, Material, Geometry, Mesh 설정
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector2() },
      iMouse: { value: new Vector2(window.innerWidth / 2, window.innerHeight / 2) }
    };

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });
    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    // 리사이즈 핸들러 (Resize handler)
    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.iResolution.value.set(width, height);
    };
    window.addEventListener("resize", onResize);
    onResize();

    // 마우스 핸들러 (Mouse handler)
    const onMouseMove = (e: MouseEvent) => {
      uniforms.iMouse.value.set(e.clientX, container.clientHeight - e.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);

    // 애니메이션 루프 (Animation loop)
    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    // 클린업 (Cleanup)
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      renderer.setAnimationLoop(null);

      // Dispose mesh and its components
      scene.remove(mesh);
      material.dispose();
      geometry.dispose();
      
      // Remove canvas from DOM
      const canvas = renderer.domElement;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }

      // Dispose renderer
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
      aria-label="Animated shader background"
    />
  );
};

// 이미지 라이트박스 컴포넌트 (Image lightbox component)
const ImageLightbox: React.FC<{ 
  src: string; 
  alt: string; 
  onClose: () => void 
}> = ({ src, alt, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        cursor: "zoom-out",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          objectFit: "contain",
          borderRadius: "12px",
          cursor: "default",
          animation: "scaleIn 0.3s ease",
        }}
      />
    </div>
  );
};

// 확대 가능한 이미지 컴포넌트 (Zoomable image component)
const ZoomableImage: React.FC<{
  src: string;
  alt: string;
  isMobile: boolean;
  isVisible: boolean;
  stepNumber: number;
}> = ({ src, alt, isMobile, isVisible, stepNumber }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowLightbox(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          width: "100%",
          height: isMobile ? "200px" : "520px",
          borderRadius: isMobile ? "16px" : "24px",
          overflow: "hidden",
          boxShadow: isMobile ? "0 15px 40px rgba(0, 0, 0, 0.1)" : "0 25px 60px rgba(0, 0, 0, 0.12)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          cursor: "zoom-in",
          flexShrink: 0,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: isHovered ? "rgba(0, 0, 0, 0.4)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "scale(1)" : "scale(0.5)",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a2867" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M11 8v6M8 11h6" />
            </svg>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: isMobile ? "60px" : "100px",
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "12px" : "24px",
            left: isMobile ? "12px" : "24px",
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
            ...(isMobile && {
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "6px 12px",
              borderRadius: "8px",
            }),
          }}
        >
          <span style={{ fontSize: isMobile ? "24px" : "42px", fontWeight: "800", color: "#ffffff" }}>
            {stepNumber.toString().padStart(2, "0")}
          </span>
          <span style={{ fontSize: isMobile ? "12px" : "16px", fontWeight: "500", color: "rgba(255,255,255,0.6)" }}>
            / 10
          </span>
        </div>
      </div>
      {showLightbox && (
        <ImageLightbox src={src} alt={alt} onClose={() => setShowLightbox(false)} />
      )}
    </>
  );
};

// 히어로 섹션 컴포넌트 - WebGL 셰이더 배경 적용 (Hero section with WebGL shader background)
const HeroSection: React.FC<{ isActive: boolean; isMobile: boolean }> = ({ isActive, isMobile }) => {
  const { displayedText: title1, isComplete: title1Complete } = useTypingEffect(
    "원하는 작품을 빠르고 쉽게",
    80,
    isActive
  );
  const { displayedText: title2, isComplete: title2Complete } = useTypingEffect(
    "정확하고 간편한 주문 시스템",
    80,
    title1Complete
  );

  const showContent = title2Complete;

  return (
    <section
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        scrollSnapAlign: "start",
        overflow: "hidden",
      }}
    >
      {/* WebGL 셰이더 배경 (WebGL Shader Background) */}
      <ShaderBackground />

      {/* 상단 장식 라인 (Top decorative line) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: isMobile ? "80px" : "120px",
          backgroundColor: "#ffd93d",
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
          zIndex: 2,
        }}
      />

      {/* 콘텐츠 (Content) */}
      <div style={{ position: "relative", textAlign: "center", zIndex: 1, padding: isMobile ? "0 20px" : "0 24px" }}>
        {/* 뱃지 (Badge) */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: isMobile ? "8px 16px" : "10px 20px",
            backgroundColor: "#ffd93d",
            borderRadius: "100px",
            marginBottom: isMobile ? "28px" : "40px",
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease",
          }}
        >
          <span 
            style={{ 
              fontSize: isMobile ? "11px" : "13px", 
              fontWeight: "700", 
              color: "#1a2867", 
              letterSpacing: "0.08em" 
            }}
          >
            SMART ORDER PROCESS
          </span>
        </div>

        {/* 메인 타이틀 - 타이핑 효과 (Main title - Typing effect) */}
        <h1
          style={{
            fontSize: isMobile ? "33.6px" : "clamp(38.4px, 8vw, 80px)",
            fontWeight: "800",
            letterSpacing: "-0.04em",
            lineHeight: "1.5",
            marginBottom: isMobile ? "24px" : "32px",
            color: "#ffffff",
            minHeight: isMobile ? "88px" : "clamp(96px, 20vw, 192px)",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          <span style={{ display: "block" }}>
            {title1}
            {!title1Complete && <span style={{ animation: "blink 1s infinite" }}>|</span>}
          </span>
          <span style={{ display: "block" }}>
            {title2}
            {title1Complete && !title2Complete && <span style={{ animation: "blink 1s infinite" }}>|</span>}
          </span>
        </h1>

        {/* 서브 타이틀 (Subtitle) */}
        <p
          style={{
            fontSize: isMobile ? "15px" : "clamp(16px, 2.5vw, 22px)",
            fontWeight: "400",
            color: "rgba(255, 255, 255, 0.8)",
            maxWidth: "500px",
            margin: "0 auto",
            lineHeight: "1.7",
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease 0.2s",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          10단계의 체계적인 프로세스로
          <br />
          당신의 작품을 완성합니다
        </p>

        {/* 스크롤 힌트 (Scroll hint) */}
        <div
          style={{
            marginTop: isMobile ? "40px" : "60px",
            opacity: showContent ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              animation: "bounce 2s infinite",
            }}
          >
            <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)", letterSpacing: "0.15em" }}>
              SCROLL
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

// 스텝 섹션 컴포넌트 (Step section component)
const StepSection: React.FC<{ data: StepData; isActive: boolean; isMobile: boolean }> = ({ 
  data, 
  isActive, 
  isMobile 
}) => {
  const { displayedText, isComplete } = useTypingEffect(data.title, 30, isActive);

  return (
    <section
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        position: "relative",
        scrollSnapAlign: "start",
        backgroundColor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            right: "-2%",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "clamp(250px, 35vw, 450px)",
            fontWeight: "900",
            color: "#f3f4f6",
            lineHeight: "1",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {data.step.toString().padStart(2, "0")}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "24px" : "60px",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "20px" : "0 60px",
          width: "100%",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          height: isMobile ? "100%" : "auto",
          paddingTop: isMobile ? "80px" : "0",
          paddingBottom: isMobile ? "100px" : "0",
        }}
      >
        {isMobile && (
          <ZoomableImage
            src={data.image}
            alt={data.title}
            isMobile={true}
            isVisible={isComplete}
            stepNumber={data.step}
          />
        )}

        <div style={{ flex: isMobile ? "1" : "1", overflow: isMobile ? "auto" : "visible" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: isMobile ? "12px" : "16px",
              marginBottom: isMobile ? "16px" : "24px",
            }}
          >
            <div
              style={{
                width: isMobile ? "40px" : "48px",
                height: isMobile ? "40px" : "48px",
                borderRadius: "12px",
                backgroundColor: "#ffd93d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: isMobile ? "14px" : "18px", fontWeight: "800", color: "#1a2867" }}>
                {data.step.toString().padStart(2, "0")}
              </span>
            </div>
            <div style={{ width: isMobile ? "40px" : "60px", height: "2px", backgroundColor: "#e5e7eb" }} />
            <span style={{ fontSize: isMobile ? "11px" : "13px", fontWeight: "500", color: "#9ca3af", letterSpacing: "0.05em" }}>
              STEP {data.step} OF 10
            </span>
          </div>

          <h2
            style={{
              fontSize: isMobile ? "28px" : "clamp(32px, 4vw, 52px)",
              fontWeight: "700",
              letterSpacing: "-0.03em",
              lineHeight: "1.2",
              marginBottom: isMobile ? "12px" : "20px",
              color: "#111827",
              minHeight: isMobile ? "36px" : "clamp(40px, 6vw, 70px)",
            }}
          >
            {displayedText}
            {!isComplete && isActive && <span style={{ animation: "blink 1s infinite", color: "#1a2867" }}>|</span>}
          </h2>

          <p
            style={{
              fontSize: isMobile ? "15px" : "18px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: isMobile ? "16px" : "28px",
              letterSpacing: "-0.02em",
              lineHeight: "1.5",
              opacity: isComplete ? 1 : 0,
              transform: isComplete ? "translateY(0)" : "translateY(-10px)",
              transition: "all 0.5s ease",
            }}
          >
            "{data.quote}"
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "12px" : "16px" }}>
            {data.description.map((paragraph, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: isMobile ? "14px" : "15px",
                  fontWeight: "400",
                  color: "#6b7280",
                  lineHeight: "1.85",
                  letterSpacing: "-0.01em",
                  opacity: isComplete ? 1 : 0,
                  transform: isComplete ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.6s ease ${0.1 + idx * 0.15}s`,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {!isMobile && (
          <div style={{ flex: "1" }}>
            <ZoomableImage
              src={data.image}
              alt={data.title}
              isMobile={false}
              isVisible={isComplete}
              stepNumber={data.step}
            />
          </div>
        )}
      </div>
    </section>
  );
};

// 메인 컴포넌트 (Main component)
const SmartOrderProcess: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSections = stepsData.length + 1;

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const sectionHeight = window.innerHeight;
    const currentSection = Math.round(scrollTop / sectionHeight);
    setActiveSection(Math.min(currentSection, totalSections - 1));
  }, [totalSections]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = (index: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth",
    });
  };

  const isHeroSection = activeSection === 0;

  return (
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* 하단 중앙 프로그레스 인디케이터 (Bottom center progress indicator) */}
      <div
        style={{
          position: "fixed",
          bottom: isMobile ? "24px" : "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "6px" : "8px",
          padding: isMobile ? "10px 16px" : "12px 20px",
          backgroundColor: isHeroSection ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.7)",
          borderRadius: "100px",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          transition: "background-color 0.3s ease",
        }}
      >
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            style={{
              width: activeSection === index ? (isMobile ? "18px" : "24px") : (isMobile ? "6px" : "8px"),
              height: isMobile ? "6px" : "8px",
              borderRadius: "4px",
              backgroundColor: activeSection === index 
                ? "#ffd93d" 
                : isHeroSection 
                  ? "rgba(255, 255, 255, 0.3)" 
                  : "rgba(255, 255, 255, 0.4)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              padding: 0,
            }}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      <HeroSection isActive={activeSection === 0} isMobile={isMobile} />

      {stepsData.map((step, index) => (
        <StepSection
          key={step.step}
          data={step}
          isActive={activeSection === index + 1}
          isMobile={isMobile}
        />
      ))}

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        ::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default SmartOrderProcess;