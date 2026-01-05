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
 * 쿠디솜 제작 과정 컴포넌트 (v2 - WebGL Shader Hero)
 * Qudisom Manufacturing Process Component (v2 - WebGL Shader Hero)
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

// 제작 과정 스텝 데이터 (Manufacturing process step data)
const stepsData: StepData[] = [
  {
    step: 1,
    title: "3D 디자인 렌더링",
    quote: "감성과 기술이 만나는 첫 번째 단계",
    description: [
      "'보여지는 디자인'이 아닌 '만들 수 있는 디자인'을 구현하는 단계입니다. 단순한 일러스트나 아이디어 스케치로는 구현이 어려운 디테일도, 3D 렌더링을 통해 최종 형태를 정밀하게 예측할 수 있습니다.",
      "각 부위의 입체감, 시선 방향, 실루엣의 흐름 등 계산해 실제 제작 가능한 구조로 구성합니다. 이 과정을 통해 단순히 예쁜 캐릭터가 아닌, '완성 가능한 디자인'이 탄생합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/977916d119e25.gif"
  },
  {
    step: 2,
    title: "원단 및 부자재 셀렉",
    quote: "색과 질감은, 단순히 색상 코드로 결정되지 않습니다.",
    description: [
      "예를 들어 같은 노란색이라도 원단에 따라 분위기는 완전히 달라지며, 자칫하면 캐릭터의 감성이 왜곡될 수 있습니다.",
      "단순히 보기 좋은 것을 고르는 것이 아니라, '이 캐릭터의 느낌은 어떤 소재로 표현하면 좋을까'를 중심으로 디자인의 의미를 해석하고, 그 감정선을 가장 섬세하게 전달할 수 있는 원단을 제안합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/cbbd5187e7152.jpg"
  },
  {
    step: 3,
    title: "원단 패턴 디자인 재단",
    quote: "만들 수 있는 디자인을 설계합니다.",
    description: [
      "3D 디자인이 감성을 입체화한 시각적 자료라면, 패턴 디자인은 그것을 실현 가능한 구조로 정제하는 설계도입니다. 실제 원단의 두께, 봉제 특성, 충전재의 탄성과 부피까지 고려해, 디자인을 봉제 가능한 형태로 치환합니다.",
      "이때 구조적인 안정성도 함께 설계되기 때문에, 봉제선을 따라 터지지 않고 충전 후에도 모양이 흐트러지지 않도록 계산합니다. 단순히 보기 좋은 형태를 만드는 데서 그치지 않고, 장기간 사용해도 원형을 유지할 수 있는 내구성과 복원력까지 고려합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/91285ac594c0d.jpg"
  },
  {
    step: 4,
    title: "자수 및 인쇄",
    quote: "원단 위에 남기는 흔적 하나까지 놓치지 않습니다.",
    description: [
      "자수의 밀도와 인쇄의 농도, 모두 샘플 기준으로 정량화하여 관리합니다. 실이 지나치게 뭉치거나, 잉크가 번지는 문제를 방지하기 위해 각 부위마다 최적 조건을 테스트한 뒤 본 생산에 들어갑니다.",
      "땀 하나, 픽셀 하나까지 최대한 균일하게 구현되도록 노력합니다. 자수와 인쇄는 단지 장식이 아니라, 캐릭터의 언어입니다. 눈에 보이는 작은 디테일 하나가 고객사의 스토리를 담고 있고, 소비자에게는 첫 인상을 결정짓는 포인트가 됩니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/55353676cf497.jpg"
  },
  {
    step: 5,
    title: "봉제 및 미싱",
    quote: "효율과 정성의 균형을 유지합니다.",
    description: [
      "인형 제작의 기본 봉제는 산업용 미싱으로 처리되어 빠르고 견고한 이음새를 확보합니다. 하지만 얼굴, 소형 파츠, 끝마감 부분처럼 감성이 중요한 디테일에 대해서는 숙련된 작업자의 핸드 메이드 작업이 필요합니다.",
      "미싱의 속도와 핸드 메이드 작업의 섬세함을 조합해, 첫 샘플의 퀄리티를 그대로 재현합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250822/646b3b56d0e2d.jpg"
  },
  {
    step: 6,
    title: "내부 솜 충전",
    quote: "포근함을 설계합니다.",
    description: [
      "솜이 고르게 들어가지 않으면 시간이 지날수록 한쪽으로 기울거나 눌려 보이게 됩니다. 솜 충전은 단순한 채움이 아니라 '균형'을 설계하는 과정입니다. 몸통은 포근하게, 다리나 귀처럼 모양을 지탱해야 하는 부위는 단단하게 채워 형태를 안정적으로 유지합니다.",
      "기계로 충전한 뒤에는 손으로 눌러보고 밀도를 조절하며, 각 인형이 샘플과 같은 탄성과 복원력을 가질 수 있도록 세심하게 조정합니다. 완성 후에도 탄성과 복원력을 테스트하여 오래도록 처음 그대로의 형태를 유지할 수 있도록 노력합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250822/27cdd3b8f7a44.jpg"
  },
  {
    step: 7,
    title: "핸드 메이드 & 바느질 마감 처리",
    quote: "바늘로 완성하는 감성의 균형",
    description: [
      "미싱으로 봉제된 제품의 끝단을 수작업으로 다시 살피고, 튀어나온 실밥이나 어긋난 박음질을 하나씩 정리합니다. 특히 곡선부나 접합 부위는 형태가 틀어지기 쉬워, 손으로 눌러보며 바느질로 균형을 맞춥니다.",
      "어떤 디자인이든 기계로 할 수 없는 부분이 있습니다. 특히 솜을 넣은 뒤 닫는 마지막 부분은 반드시 사람이 손으로 꿰매야만 자연스러운 형태가 유지됩니다. 마감은 단순한 정리가 아니라, 전체 인형의 인상을 결정하는 중요한 과정입니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/8bfecda19f138.jpg"
  },
  {
    step: 8,
    title: "마무리 클리닝",
    quote: "눈으로, 손으로, 공기로",
    description: [
      "소비자 입장에서의 첫 인상은 쿠디솜의 마지막 과정에서 결정됩니다. 기계로 대량 클리닝을 해도, 마지막은 손으로 해야 합니다.",
      "쿠디솜의 클리닝은 먼저 먼지, 실밥, 이물질 여부를 체크하고, 외부 점검 → 핸드 클리닝 → 공기 분사까지 3단계로 진행됩니다. 원단의 털 방향이나 결을 고려해 먼지를 제거하고, 봉제선에 끼인 실가루도 에어건을 활용해 최상의 상태를 유지합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/0573e073ec916.png"
  },
  {
    step: 9,
    title: "QC 검사 및 소독",
    quote: "숫자로 보이지 않는 차이를 봅니다.",
    description: [
      "품질과 위생은 분리되지 않습니다. 쿠디솜의 QC 검사는 단순한 수량 확인이 아닙니다. 마감, 봉제선, 자수 위치, 오염 여부, 형태 균형 등을 기준표에 따라 개별 확인합니다. 기준에 부합하지 않는 제품은 즉시 선별 되며, 잔오염이나 변형이 있으면 별도 클리닝 후 재검수됩니다.",
      "또한 크기나 형태는 수치로 판단할 수 있지만, 촉감이나 표정의 미묘한 균형은 사람의 감각으로만 느낄 수 있습니다. 숙련된 담당자가 직접 만져보고, 눈으로 보고, 기계로 무게를 측정해 미세한 차이까지 검수합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/f3c446ed9e75b.jpg"
  },
  {
    step: 10,
    title: "검수 및 패킹",
    quote: "검수는 제품, 포장은 신뢰를 담습니다.",
    description: [
      "제품이 아무리 훌륭해도, 포장이 엉성하면 브랜드의 인상이 무너집니다. 쿠디솜은 재질과 형태에 맞는 포장 방식을 선택합니다. 예를 들어 털이 눌리기 쉬운 소재는 부드러운 천을 덧대고, 인쇄가 쉽게 벗겨지는 부위는 비닐 마감을 추가로 덧붙일 수 있습니다.",
      "패킹 작업은 제작의 연장선이며, 인형이 구겨지거나 눌리지 않도록 형태에 맞춘 전용 사이즈의 박스를 사용하고, 배송 중 흔들림을 줄이기 위한 내부 완충재도 함께 구성합니다."
    ],
    image: "https://cdn.imweb.me/thumbnail/20250807/6034790c21f1e.jpg"
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

        // 마우스 주변 리플 ���과 (Ripple effect around mouse)
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
    "SIMPLE IDEA",
    60, // 타이핑 속도 느리게 조정 (Slower typing speed)
    isActive
  );
  const { displayedText: title2, isComplete: title2Complete } = useTypingEffect(
    "SPECIAL ARTWORK",
    60, // 타이핑 속도 느리게 조정 (Slower typing speed)
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
            MANUFACTURING PROCESS
          </span>
        </div>

        {/* 메인 타이틀 - 타이핑 효과 (Main title - Typing effect) */}
        <h1
          style={{
            fontSize: isMobile ? "32px" : "clamp(40px, 8vw, 80px)",
            fontWeight: "800",
            letterSpacing: "-0.02em",
            lineHeight: "1.2",
            marginBottom: isMobile ? "24px" : "32px",
            color: "#ffffff",
            minHeight: isMobile ? "100px" : "clamp(120px, 20vw, 200px)",
            textShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          <span style={{ display: "block" }}>
            {title1}
            {!title1Complete && <span style={{ animation: "blink 1s infinite" }}>|</span>}
          </span>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? "12px" : "20px" }}>
            {title1Complete && (
              <svg 
                width={isMobile ? "24" : "40"} 
                height={isMobile ? "24" : "40"} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ffd93d" 
                strokeWidth="2"
                style={{
                  opacity: title1Complete ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  filter: "drop-shadow(0 2px 10px rgba(255, 217, 61, 0.5))",
                }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
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
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.7",
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease 0.2s",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          섬세한 디자인과 정밀한 제작이 만나,
          <br />
          만들어 내는 완벽한 결과
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
  const { displayedText, isComplete } = useTypingEffect(data.title, 30, isActive); // 타이핑 속도 느리게 조정 (Slower typing speed)

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
              fontSize: isMobile ? "26px" : "clamp(32px, 4vw, 48px)",
              fontWeight: "700",
              letterSpacing: "-0.03em",
              lineHeight: "1.2",
              marginBottom: isMobile ? "12px" : "20px",
              color: "#111827",
              minHeight: isMobile ? "34px" : "clamp(40px, 6vw, 60px)",
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
const ManufacturingProcess: React.FC = () => {
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

export default ManufacturingProcess;