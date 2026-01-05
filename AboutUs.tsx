/**
 * QudisomLandingPage Component
 * 쿠디솜 랜딩 페이지 통합 컴포넌트 | Qudisom Landing Page Combined Component
 * 
 * @description 섹션 1: 쿠디솜을 선택하는 이유 + 섹션 2: 실적 현황
 *              Section 1: Why Choose Qudisom + Section 2: Performance Statistics
 * 
 * @brand 메인 컬러 Main Color: #ffd93d | 서브 컬러 Sub Color: #1a2867
 * @style 토스 스타일 미니멀 디자인 | Toss-style minimal design
 */

import React, { useEffect, useRef, useState } from 'react';

// ============================================================
// 타입 정의 | Type Definitions
// ============================================================

interface ReasonCardData {
  id: number;
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ChartData {
  year: string;
  value: string;
  percentage: number;
}

interface StatCardData {
  id: string;
  title: string;
  description: string[];
  type: 'chart' | 'clients' | 'export';
  chartData?: ChartData[];
  clientData?: { year: string; count: string; icons: number }[];
  exportData?: { year: string; count: string }[];
}

// ============================================================
// Why Choose 아이콘 컴포넌트 | Why Choose Icon Components
// ============================================================

const ManagerIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    <path d="M16 4l2 2-2 2" />
    <path d="M18 6h-4" />
  </svg>
);

const PriceIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12" />
    <path d="M9 9c0-1 1-2 3-2s3 1 3 2-1 2-3 2" />
    <path d="M9 15c0 1 1 2 3 2s3-1 3-2-1-2-3-2" />
  </svg>
);

const BoxIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const ClockIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
);

const WalletIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <circle cx="16" cy="14" r="2" />
  </svg>
);

const PenIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

// ============================================================
// Why Choose 카드 데이터 | Why Choose Card Data
// ============================================================

const reasonsData: ReasonCardData[] = [
  {
    id: 1,
    number: '01',
    title: '1:1 매니저 배정',
    description: '체계적인 교육을 수료한 전문 담당 매니저가 배정되어 신속한 피드백을 제공합니다.',
    icon: <ManagerIcon />,
  },
  {
    id: 2,
    number: '02',
    title: '최저가 보증',
    description: '견적 받으신 가격이 국내 최저가가 아닐 경우 최저가를 보장해 드립니다.',
    icon: <PriceIcon />,
  },
  {
    id: 3,
    number: '03',
    title: '낮은 MOQ',
    description: '낮은 최소 주문 수량으로 소량 제작이 가능합니다. 부담 없이 시작해 보세요.',
    icon: <BoxIcon />,
  },
  {
    id: 4,
    number: '04',
    title: '빠른 제작 기간',
    description: '체계적인 생산 시스템으로 국내 최단 기간 제작을 보장해 드립니다.',
    icon: <ClockIcon />,
  },
  {
    id: 5,
    number: '05',
    title: '샘플 비용 지원',
    description: '샘플 제작 비용은 본 발주 진행 시 전액 환급 처리됩니다. (500개 이상)',
    icon: <WalletIcon />,
  },
  {
    id: 6,
    number: '06',
    title: '디자인 지원',
    description: '디자인 파일이 없으신가요? 간단한 스케치 또는 그림을 현실로 구현해 드립니다.',
    icon: <PenIcon />,
  },
];

// ============================================================
// Why Choose 카드 컴포넌트 | Why Choose Card Component
// ============================================================

interface ReasonCardProps {
  data: ReasonCardData;
  index: number;
  isVisible: boolean;
}

const ReasonCard: React.FC<ReasonCardProps> = ({ data, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '32px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #f0f0f0',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? (isHovered ? 'translateY(-8px)' : 'translateY(0)')
          : 'translateY(30px)',
        transition: `
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s,
          transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)
        `,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(26, 40, 103, 0.12), 0 8px 16px rgba(26, 40, 103, 0.08)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: isHovered ? '#ffd93d' : '#f8f9fa',
          color: isHovered ? '#1a2867' : '#868e96',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
          transition: 'all 0.3s ease',
        }}>
          {data.number}
        </span>

        <div style={{
          width: '44px',
          height: '44px',
          color: isHovered ? '#1a2867' : '#adb5bd',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}>
          {data.icon}
        </div>
      </div>

      <h3 style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#1a1a1a',
        marginBottom: '12px',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        lineHeight: 1.3,
      }}>
        {data.title}
      </h3>

      <p style={{
        fontSize: '15px',
        fontWeight: 400,
        color: '#666666',
        lineHeight: 1.7,
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        wordBreak: 'keep-all',
      }}>
        {data.description}
      </p>

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '32px',
        right: '32px',
        height: '3px',
        borderRadius: '3px 3px 0 0',
        background: '#ffd93d',
        transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }} />
    </div>
  );
};

// ============================================================
// Why Choose 섹션 컴포넌트 | Why Choose Section Component
// ============================================================

const WhyChooseSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '80px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '100px',
            background: '#fff8e0',
            marginBottom: '24px',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ffd93d',
            }} />
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#1a2867',
              letterSpacing: '-0.02em',
            }}>
              Why Qudisom
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 40px)',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '20px',
            lineHeight: 1.3,
            letterSpacing: '-0.03em',
          }}>
            쿠디솜을 선택하는 이유
          </h2>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            fontWeight: 400,
            color: '#666666',
            lineHeight: 1.8,
            maxWidth: '600px',
            margin: '0 auto',
            wordBreak: 'keep-all',
          }}>
            <span style={{ color: '#1a2867', fontWeight: 600 }}>가격, 퀄리티, 감성</span> 어느 하나와 타협하지 않고
            <br />
            합리적인 작품을 만듭니다.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {reasonsData.map((reason, index) => (
            <ReasonCard
              key={reason.id}
              data={reason}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// 실적 현황 데이터 | Performance Statistics Data
// ============================================================

const statsData: StatCardData[] = [
  {
    id: 'production',
    title: '연간 생산량',
    description: [
      '많이 만들지만, 대충 만들지 않습니다.',
      '모두 같은 퀄리티, 같은 정성으로',
      '수량보다 완성도로 기억되고 싶습니다.'
    ],
    type: 'chart',
    chartData: [
      { year: '2023', value: '3,200만+', percentage: 40 },
      { year: '2024', value: '4,900만+', percentage: 61 },
      { year: '2025', value: '8,000만~', percentage: 100 },
    ],
  },
  {
    id: 'revenue',
    title: '연간 거래액',
    description: [
      '한 번의 선택으로 만들어지는 수치는 아닙니다.',
      '수많은 브랜드와 나눈 수많은 프로젝트들,',
      '화려한 마케팅보다 강력한 것은 믿음입니다.'
    ],
    type: 'chart',
    chartData: [
      { year: '2023', value: '13억+', percentage: 22 },
      { year: '2024', value: '45억+', percentage: 78 },
      { year: '2025', value: '58억~', percentage: 100 },
    ],
  },
  {
    id: 'clients',
    title: '클라이언트',
    description: [
      '마케팅이 시작을 알렸다면',
      '품질은 관계를 이어주었습니다.',
      '그 결과가 지금의 숫자입니다.'
    ],
    type: 'clients',
    clientData: [
      { year: '2023', count: '100+', icons: 3 },
      { year: '2024', count: '1,200+', icons: 6 },
      { year: '2025', count: '3,500~', icons: 12 },
    ],
  },
  {
    id: 'export',
    title: '수출 국가',
    description: [
      '한국을 넘어, 동남아시아·미국·유럽까지',
      '국내에서 인정받는 것만으론 부족했습니다.',
      '그래서 쿠디솜은 글로벌 품질 기준에 맞췄습니다.'
    ],
    type: 'export',
    exportData: [
      { year: '2023', count: '3+' },
      { year: '2024', count: '5+' },
      { year: '2025', count: '11~' },
    ],
  },
];

// ============================================================
// 실적 현황 아이콘 컴포넌트 | Performance Icon Components
// ============================================================

const PersonIcon: React.FC<{ delay: number; isVisible: boolean }> = ({ delay, isVisible }) => (
  <div
    style={{
      width: '16px',
      height: '16px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.5)',
      transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    }}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="#1a2867" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" fill="#ffd93d" stroke="#1a2867" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#fff8e0" stroke="#1a2867" />
    </svg>
  </div>
);

const GlobeIcon: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="50" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" />
    <ellipse cx="60" cy="60" rx="50" ry="20" fill="none" stroke="#e9ecef" strokeWidth="1.5" />
    <ellipse cx="60" cy="60" rx="25" ry="50" fill="none" stroke="#e9ecef" strokeWidth="1.5" />
    <line x1="10" y1="60" x2="110" y2="60" stroke="#e9ecef" strokeWidth="1.5" />
    <line x1="60" y1="10" x2="60" y2="110" stroke="#e9ecef" strokeWidth="1.5" />
    <g style={{
      transformOrigin: '60px 60px',
      animation: isVisible ? 'orbitPoint 8s ease-in-out infinite' : 'none',
    }}>
      <circle cx="60" cy="60" r="12" fill="#ffd93d" fillOpacity="0.3" />
      <circle cx="60" cy="60" r="6" fill="#ffd93d" />
    </g>
  </svg>
);

// ============================================================
// 막대 차트 컴포넌트 | Bar Chart Component
// ============================================================

const BarChart: React.FC<{ data: ChartData[]; isVisible: boolean }> = ({ data, isVisible }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '180px',
    padding: '0 16px',
    marginBottom: '24px',
  }}>
    {data.map((item, index) => (
      <div
        key={item.year}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          flex: 1,
        }}
      >
        <span style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#1a2867',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
          transition: `all 0.5s ease ${300 + index * 150}ms`,
        }}>
          {item.value}
        </span>
        
        <div style={{
          width: '48px',
          height: '120px',
          background: '#f1f3f5',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: isVisible ? `${item.percentage}%` : '0%',
            background: index === data.length - 1 
              ? 'linear-gradient(180deg, #ffd93d 0%, #ffcc00 100%)'
              : 'linear-gradient(180deg, #1a2867 0%, #2a3d7c 100%)',
            borderRadius: '8px',
            transition: `height 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 200}ms`,
          }} />
        </div>
        
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#868e96' }}>
          {item.year}년
        </span>
      </div>
    ))}
  </div>
);

// ============================================================
// 클라이언트 비주얼 컴포넌트 | Client Visual Component
// ============================================================

const ClientVisual: React.FC<{ data: { year: string; count: string; icons: number }[]; isVisible: boolean }> = ({ data, isVisible }) => (
  <div style={{ marginBottom: '24px' }}>
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      marginBottom: '24px',
      minHeight: '80px',
    }}>
      {data.map((item, groupIndex) => (
        <div key={item.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(item.icons, 4)}, 1fr)`,
            gap: '2px',
            padding: '4px',
          }}>
            {Array.from({ length: item.icons }).map((_, iconIndex) => (
              <PersonIcon key={iconIndex} delay={groupIndex * 200 + iconIndex * 50} isVisible={isVisible} />
            ))}
          </div>
        </div>
      ))}
    </div>
    
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      padding: '16px 0',
      borderTop: '1px solid #f1f3f5',
    }}>
      {data.map((item, index) => (
        <div key={item.year} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#868e96', marginBottom: '4px' }}>{item.year}년</div>
          <div style={{
            fontSize: '20px',
            fontWeight: 700,
            color: index === data.length - 1 ? '#1a2867' : '#495057',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transition: `all 0.5s ease ${index * 150}ms`,
          }}>
            {item.count}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================================
// 수출 비주얼 컴포넌트 | Export Visual Component
// ============================================================

const ExportVisual: React.FC<{ data: { year: string; count: string }[]; isVisible: boolean }> = ({ data, isVisible }) => {
  const lineAngles = [-60, -30, 0, 30, 60, 90, 120, 150, 180, 210, 240];
  
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '160px', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <GlobeIcon isVisible={isVisible} />
          
          {lineAngles.map((angle, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                height: '2px',
                background: `linear-gradient(90deg, #ffd93d, rgba(255, 217, 61, 0.3))`,
                transformOrigin: 'left center',
                transform: `rotate(${angle}deg) translateX(20px)`,
                width: isVisible ? '40px' : '0px',
                opacity: isVisible ? 1 : 0,
                transition: `width 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms, opacity 0.3s ease ${index * 80}ms`,
              }}
            >
              <div style={{
                position: 'absolute',
                right: '-4px',
                top: '-3px',
                width: '8px',
                height: '8px',
                background: '#1a2867',
                borderRadius: '50%',
                transform: isVisible ? 'scale(1)' : 'scale(0)',
                transition: `transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 80 + 400}ms`,
              }} />
            </div>
          ))}
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        padding: '16px 0',
        borderTop: '1px solid #f1f3f5',
      }}>
        {data.map((item, index) => (
          <div key={item.year} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#868e96', marginBottom: '4px' }}>{item.year}년</div>
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: index === data.length - 1 ? '#1a2867' : '#495057',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 0.5s ease ${index * 150}ms`,
            }}>
              {item.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// 통계 카드 컴포넌트 | Stat Card Component
// ============================================================

const StatCard: React.FC<{ data: StatCardData; index: number; isVisible: boolean }> = ({ data, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid #f0f0f0',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? (isHovered ? 'translateY(-8px)' : 'translateY(0)') : 'translateY(30px)',
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
        boxShadow: isHovered ? '0 20px 40px rgba(26, 40, 103, 0.12), 0 8px 16px rgba(26, 40, 103, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      <h3 style={{
        fontSize: '18px',
        fontWeight: 700,
        color: '#1a1a1a',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ width: '4px', height: '20px', background: '#ffd93d', borderRadius: '2px' }} />
        {data.title}
      </h3>

      {data.type === 'chart' && data.chartData && <BarChart data={data.chartData} isVisible={cardVisible} />}
      {data.type === 'clients' && data.clientData && <ClientVisual data={data.clientData} isVisible={cardVisible} />}
      {data.type === 'export' && data.exportData && <ExportVisual data={data.exportData} isVisible={cardVisible} />}

      <p style={{
        fontSize: '14px',
        fontWeight: 400,
        color: '#666666',
        lineHeight: 1.8,
        textAlign: 'center',
        wordBreak: 'keep-all',
      }}>
        {data.description.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < data.description.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
};

// ============================================================
// 실적 현황 섹션 컴포넌트 | Performance Section Component
// ============================================================

const PerformanceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '80px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '100px',
            background: '#fff8e0',
            marginBottom: '24px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd93d' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a2867', letterSpacing: '-0.02em' }}>
              Performance
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '20px',
            lineHeight: 1.4,
            letterSpacing: '-0.03em',
          }}>
            쿠디솜이 선택한 글로벌 파트너 공장,
            <br />
            <span style={{ color: '#1a2867' }}>그들의 실적이 품질을 증명합니다.</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: '24px',
        }}>
          {statsData.map((stat, index) => (
            <StatCard key={stat.id} data={stat} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// 메인 통합 컴포넌트 | Main Combined Component
// ============================================================

const QudisomLandingPage: React.FC = () => {
  return (
    <>
      {/* Pretendard 폰트 로드 | Load Pretendard Font */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
      />

      {/* 섹션 1: 쿠디솜을 선택하는 이유 | Section 1: Why Choose Qudisom */}
      <WhyChooseSection />

      {/* 섹션 2: 실적 현황 | Section 2: Performance Statistics */}
      <PerformanceSection />

      {/* 글로벌 스타일 | Global Styles */}
      <style>{`
        @keyframes orbitPoint {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(15px, -10px); }
          50% { transform: translate(-10px, -15px); }
          75% { transform: translate(-15px, 10px); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

// ============================================================
// ============================================================
// 
// 📌 사용 방법:
//    1. QudisomLandingPage.tsx 파일 맨 아래의
//       "export default QudisomLandingPage;" 줄을 삭제
//    2. 이 코드 전체를 그 아래에 붙여넣기
//
// ============================================================
// ============================================================

// ============================================================
// 인프라 현황 타입 정의 | Infrastructure Type Definitions
// ============================================================

interface InfraCardData {
  id: string;
  title: string;
  value: number;
  unit: string;
  description: string[];
  icon: React.ReactNode;
}

// ============================================================
// 인프라 아이콘 컴포넌트 | Infrastructure Icon Components
// ============================================================

// 생산 인력 아이콘 | Production Workers Icon
const WorkersIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" />
    <circle cx="5" cy="8" r="2.5" />
    <path d="M2 21v-1.5a3 3 0 0 1 3-3" />
    <circle cx="19" cy="8" r="2.5" />
    <path d="M22 21v-1.5a3 3 0 0 0-3-3" />
  </svg>
);

// 생산 공장 아이콘 | Factory Icon
const FactoryIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V7l8 4V7l6 4v10" />
    <path d="M9 21v-4h4v4" />
    <path d="M7 11h.01" />
    <path d="M7 15h.01" />
    <path d="M17 11h.01" />
    <path d="M17 15h.01" />
  </svg>
);

// 물류 센터 아이콘 | Logistics Icon
const TruckIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.684-.949V8a1 1 0 0 1 1-1h1.382a1 1 0 0 1 .894.553l1.448 2.894A1 1 0 0 0 20.382 11H22v6a1 1 0 0 1-1 1h-1" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

// ============================================================
// 인프라 데이터 | Infrastructure Data
// ============================================================

const infraData: InfraCardData[] = [
  {
    id: 'workers',
    title: '생산 인력',
    value: 500,
    unit: 'Member+',
    description: [
      '기계보다 중요한 건, 숙련된 손입니다.',
      '단순히 많은 것이 아닙니다.',
      '각 공정에 최적화된 인력입니다.'
    ],
    icon: <WorkersIcon />,
  },
  {
    id: 'factory',
    title: '생산 공장',
    value: 5,
    unit: 'Factory+',
    description: [
      '공장의 수가 아니라, 공정의 깊이',
      '각 라인은 단일 공정에 집중하며 숙련도를 높입니다.',
      '완성된 결과는 "쿠디솜 표준"으로 통일됩니다.'
    ],
    icon: <FactoryIcon />,
  },
  {
    id: 'logistics',
    title: '물류 센터',
    value: 3,
    unit: 'Warehouse+',
    description: [
      '멀티 캐리어 연결',
      '해상·항공 포워딩 유연 연동',
      '출고지·도착지 따라 최적 루트 선택'
    ],
    icon: <TruckIcon />,
  },
];

// ============================================================
// 카운터 컴포넌트 | Counter Component
// ============================================================

interface CounterProps {
  target: number;
  isVisible: boolean;
}

const Counter: React.FC<CounterProps> = ({ target, isVisible }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 1500;
      const steps = 50;
      const increment = target / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, target]);

  return <span>+{count}</span>;
};

// ============================================================
// 인프라 카드 컴포넌트 | Infrastructure Card Component
// ============================================================

interface InfraCardProps {
  data: InfraCardData;
  index: number;
  isVisible: boolean;
}

const InfraCard: React.FC<InfraCardProps> = ({ data, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '48px 32px',
        borderRadius: '24px',
        background: '#ffffff',
        border: '1px solid #f0f0f0',
        cursor: 'pointer',
        textAlign: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? (isHovered ? 'translateY(-8px)' : 'translateY(0)')
          : 'translateY(30px)',
        transition: `
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s,
          transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)
        `,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(26, 40, 103, 0.12), 0 8px 16px rgba(26, 40, 103, 0.08)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* 아이콘 | Icon */}
      <div style={{
        width: '72px',
        height: '72px',
        margin: '0 auto 24px',
        padding: '18px',
        borderRadius: '20px',
        background: isHovered ? '#fff8e0' : '#f8f9fa',
        color: isHovered ? '#1a2867' : '#868e96',
        transition: 'all 0.3s ease',
      }}>
        {data.icon}
      </div>

      {/* 타이틀 | Title */}
      <h3 style={{
        fontSize: '15px',
        fontWeight: 600,
        color: '#000000',
        marginBottom: '16px',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        letterSpacing: '-0.01em',
      }}>
        {data.title}
      </h3>

      {/* 숫자 | Number */}
      <div style={{
        fontSize: '48px',
        fontWeight: 800,
        color: '#1a2867',
        marginBottom: '8px',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      }}>
        <Counter target={data.value} isVisible={cardVisible} />
      </div>

      {/* 단위 | Unit */}
      <div style={{
        fontSize: '13px',
        fontWeight: 700,
        color: '#ffd93d',
        marginBottom: '28px',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        background: '#1a2867',
        padding: '6px 16px',
        borderRadius: '100px',
        display: 'inline-block',
        letterSpacing: '0.02em',
      }}>
        {data.unit}
      </div>

      {/* 설명 | Description */}
      <p style={{
        fontSize: '14px',
        fontWeight: 400,
        color: '#666666',
        lineHeight: 1.8,
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        wordBreak: 'keep-all',
      }}>
        {data.description.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < data.description.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>

      {/* 호버 시 상단 액센트 바 | Top accent bar on hover */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '32px',
        right: '32px',
        height: '3px',
        borderRadius: '0 0 3px 3px',
        background: '#ffd93d',
        transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'center',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }} />
    </div>
  );
};

// ============================================================
// 인프라 현황 섹션 컴포넌트 | Infrastructure Section Component
// ============================================================

const InfrastructureSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 헤더 | Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '80px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* 라벨 뱃지 | Label Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '100px',
            background: '#fff8e0',
            marginBottom: '24px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd93d' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a2867', letterSpacing: '-0.02em' }}>
              Infrastructure
            </span>
          </div>

          {/* 메인 타이틀 | Main Title */}
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '20px',
            lineHeight: 1.4,
            letterSpacing: '-0.03em',
          }}>
            글로벌 수준의 생산 인프라
          </h2>

          {/* 서브 타이틀 | Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            fontWeight: 400,
            color: '#666666',
            lineHeight: 1.8,
            maxWidth: '600px',
            margin: '0 auto',
            wordBreak: 'keep-all',
          }}>
            쿠디솜이 선택한 파트너 공장의 인프라입니다.
          </p>
        </div>

        {/* 인프라 카드 그리드 | Infrastructure Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '24px',
        }}>
          {infraData.map((infra, index) => (
            <InfraCard
              key={infra.id}
              data={infra}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// ============================================================
// 
// 📌 사용 방법:
//    1. 기존 TSX 파일 맨 아래의 "export default ..." 줄을 삭제
//    2. 이 코드 전체를 그 아래에 붙여넣기
//
// ============================================================
// ============================================================

// ============================================================
// About 섹션 타입 정의 | About Section Type Definitions
// ============================================================

interface StrengthItemData {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface ProcessItemData {
  id: string;
  icon: string;
  name: string;
  description: string;
}

interface TagItemData {
  text: string;
  variant: 'primary' | 'secondary' | 'outline';
}

// ============================================================
// About 섹션 데이터 | About Section Data
// ============================================================

const strengthItems: StrengthItemData[] = [
  {
    id: 'expertise',
    icon: '⧉',
    title: '프로젝트 경험의 전문성',
    description: '수많은 프로젝트 경험을 통해 축적된 제작 노하우를 바탕으로 완성도 높은 결과물을 자신 있게 제공합니다',
  },
  {
    id: 'system',
    icon: '∞',
    title: '안정적인 생산 시스템',
    description: '해외 지사 공장 MOU 계약을 통한 일관된 품질 관리와 안정적인 대량 생산 체계를 보유하고 있습니다',
  },
  {
    id: 'design',
    icon: '✦',
    title: '트렌디한 디자인 감각',
    description: '젊은 인재들의 창의적인 아이디어와 최신 트렌드를 반영한 디자인으로 차별화된 결과물을 만듭니다',
  },
];

const processItems: ProcessItemData[] = [
  { id: 'consult', icon: '💬', name: '상담', description: '맞춤 컨설팅' },
  { id: 'design', icon: '🎨', name: '디자인', description: '창의적 구현' },
  { id: 'sample', icon: '✨', name: '샘플', description: '품질 검증' },
  { id: 'production', icon: '⚙️', name: '생산', description: '정밀 제작' },
  { id: 'delivery', icon: '📦', name: '납품', description: '완벽한 마무리' },
];

const tagItems: TagItemData[] = [
  { text: 'KC 인증', variant: 'primary' },
  { text: '우수한 퀄리티', variant: 'secondary' },
  { text: '합리적인 가격', variant: 'outline' },
  { text: '샘플 수정', variant: 'secondary' },
  { text: '빠른 납기', variant: 'outline' },
  { text: '샘플 제작', variant: 'primary' },
  { text: '1:1 매니저 배정', variant: 'outline' },
];

// ============================================================
// 강점 카드 컴포넌트 | Strength Card Component
// ============================================================

interface StrengthItemProps {
  data: StrengthItemData;
  index: number;
  isVisible: boolean;
}

const StrengthItem: React.FC<StrengthItemProps> = ({ data, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '32px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #f0f0f0',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? (isHovered ? 'translateY(-8px)' : 'translateY(0)')
          : 'translateY(30px)',
        transition: `
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s,
          transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)
        `,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(26, 40, 103, 0.12), 0 8px 16px rgba(26, 40, 103, 0.08)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* 아이콘 | Icon */}
      <div style={{
        width: '56px',
        height: '56px',
        marginBottom: '20px',
        borderRadius: '14px',
        background: isHovered 
          ? 'linear-gradient(135deg, #ffd93d 0%, #ffcc00 100%)'
          : '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: isHovered ? '#1a2867' : '#868e96',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? '0 8px 20px rgba(255, 217, 61, 0.3)' : 'none',
      }}>
        {data.icon}
      </div>

      {/* 타이틀 | Title */}
      <h3 style={{
        fontSize: '18px',
        fontWeight: 700,
        color: '#1a1a1a',
        marginBottom: '12px',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        lineHeight: 1.3,
      }}>
        {data.title}
      </h3>

      {/* 설명 | Description */}
      <p style={{
        fontSize: '14px',
        fontWeight: 400,
        color: '#666666',
        lineHeight: 1.7,
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        wordBreak: 'keep-all',
      }}>
        {data.description}
      </p>

      {/* 호버 시 하단 액센트 바 | Bottom accent bar on hover */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '32px',
        right: '32px',
        height: '3px',
        borderRadius: '3px 3px 0 0',
        background: '#ffd93d',
        transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }} />
    </div>
  );
};

// ============================================================
// 프로세스 스텝 컴포넌트 | Process Step Component
// ============================================================

interface ProcessItemProps {
  data: ProcessItemData;
  index: number;
  isLast: boolean;
  isVisible: boolean;
}

const ProcessItem: React.FC<ProcessItemProps> = ({ data, index, isLast, isVisible }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
    }}>
      {/* 스텝 콘텐츠 | Step Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        minWidth: '72px',
      }}>
        {/* 아이콘 | Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}>
          {data.icon}
        </div>
        
        {/* 텍스트 | Text */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: '2px',
            fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
          }}>
            {data.name}
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: 400,
            color: '#868e96',
            fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
          }}>
            {data.description}
          </div>
        </div>
      </div>

      {/* 화살표 | Arrow */}
      {!isLast && (
        <div style={{
          color: '#ffd93d',
          fontSize: '18px',
          fontWeight: 700,
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.3s ease ${index * 0.1 + 0.3}s`,
        }}>
          →
        </div>
      )}
    </div>
  );
};

// ============================================================
// 태그 컴포넌트 | Tag Component (with floating animation)
// ============================================================

interface TagComponentProps {
  data: TagItemData;
  index: number;
  isVisible: boolean;
}

const TagComponent: React.FC<TagComponentProps> = ({ data, index, isVisible }) => {
  // 각 태그마다 다른 애니메이션 속도와 딜레이 | Different animation speed and delay for each tag
  const animationDuration = 15 + (index * 2); // 15s ~ 27s
  const animationDelay = index * 0.5; // 0s ~ 3s

  const getTagStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: '6px 14px',
      borderRadius: '100px',
      fontSize: '13px',
      fontWeight: 600,
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.8)',
      transition: `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`,
      animation: isVisible ? `tagFloat ${animationDuration}s ease-in-out ${animationDelay}s infinite` : 'none',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
    };

    switch (data.variant) {
      case 'primary':
        return {
          ...baseStyle,
          background: '#1a2867',
          color: '#ffd93d',
        };
      case 'secondary':
        return {
          ...baseStyle,
          background: '#fff8e0',
          color: '#1a2867',
        };
      default:
        return {
          ...baseStyle,
          background: '#ffffff',
          color: '#495057',
          border: '1px solid #e9ecef',
        };
    }
  };

  return <span className="floating-tag" style={getTagStyle()}>{data.text}</span>;
};

// ============================================================
// About 섹션 컴포넌트 | About Section Component
// ============================================================

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* -------------------------------------------------------- */}
        {/* 헤더 섹션 | Header Section */}
        {/* -------------------------------------------------------- */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* 라벨 뱃지 | Label Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '100px',
            background: '#fff8e0',
            marginBottom: '24px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd93d' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a2867', letterSpacing: '-0.02em' }}>
              About Us
            </span>
          </div>

          {/* 메인 타이틀 | Main Title */}
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 40px)',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '16px',
            lineHeight: 1.3,
            letterSpacing: '-0.03em',
          }}>
            쿠디솜은 작지만 강합니다
          </h2>

          {/* 서브 타이틀 | Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            fontWeight: 400,
            color: '#666666',
            marginBottom: '40px',
          }}>
            축적된 제작 노하우와 글로벌 생산 기술의 결합
          </p>

          {/* 철학 카드 | Philosophy Card */}
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            padding: '32px',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          }}>
            <p style={{
              fontSize: 'clamp(15px, 2vw, 17px)',
              fontWeight: 400,
              color: '#495057',
              lineHeight: 1.8,
              marginBottom: '20px',
              wordBreak: 'keep-all',
            }}>
              단순히 상품을 만드는 것은 누구나 할 수 있습니다.<br />
              하지만 <span style={{ color: '#1a2867', fontWeight: 700 }}>"완벽히"</span> 만드는 것은 누구나 할 수 없습니다.<br />
              쿠디솜은 완성도 있게 <span style={{ color: '#1a2867', fontWeight: 700 }}>"완벽히"</span> 만들 수 있습니다.
            </p>
            <p style={{
              fontSize: 'clamp(18px, 2.5vw, 22px)',
              fontWeight: 700,
              color: '#1a2867',
              letterSpacing: '-0.02em',
            }}>
              ❝ 가격이 아닌 실력으로 경쟁합니다 ❞
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* 강점 카드 그리드 | Strengths Card Grid */}
        {/* -------------------------------------------------------- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '24px',
          marginBottom: '60px',
        }}>
          {strengthItems.map((strength, index) => (
            <StrengthItem
              key={strength.id}
              data={strength}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* -------------------------------------------------------- */}
        {/* 프로세스 섹션 | Process Section */}
        {/* -------------------------------------------------------- */}
        <div style={{
          padding: '40px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #f0f0f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          marginBottom: '60px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
        }}>
          {/* 프로세스 타이틀 | Process Title */}
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}>
            <span style={{
              width: '4px',
              height: '20px',
              background: '#ffd93d',
              borderRadius: '2px',
            }} />
            체계적인 제작 프로세스
          </h3>

          {/* 프로세스 플로우 | Process Flow */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            {processItems.map((step, index) => (
              <ProcessItem
                key={step.id}
                data={step}
                index={index}
                isLast={index === processItems.length - 1}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* 프로그레스 바 | Progress Bar */}
          <div style={{
            marginTop: '32px',
            height: '4px',
            background: '#f1f3f5',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div 
              className={isVisible ? 'gauge-animated' : ''}
              style={{
                height: '100%',
                width: '0%',
                background: '#fab803',
                borderRadius: '2px',
                position: 'relative',
              }}
            >
              {/* 게이지 끝 화살표 | Gauge end arrow */}
              <div style={{
                position: 'absolute',
                right: '-10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#fab803',
                fontWeight: 'bold',
              }}>
                ›
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* 프로페셔널 태그 섹션 | Professional Tags Section */}
        {/* -------------------------------------------------------- */}
        <div style={{
          textAlign: 'center',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '000000',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '20px',
          }}>
            Our Professional
          </h3>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            padding: '16px 0',
            minHeight: '80px',
          }}>
            {tagItems.map((tag, index) => (
              <TagComponent
                key={tag.text}
                data={tag}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// Made in China 섹션 타입 정의 | Made in China Section Type Definitions
// ============================================================

interface TimelineItemData {
  id: string;
  year: string;
  title: string;
  description: string;
  highlight: string;
}

interface InnovationCardData {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// ============================================================
// Made in China 섹션 데이터 | Made in China Section Data
// ============================================================

const timelineData: TimelineItemData[] = [
  {
    id: 'past',
    year: '과거',
    title: '저렴한 가성비의 시대',
    description: "'Made in China'는 오랫동안 저렴한 가격의 대명사였습니다. 많은 소비자들이 품질보다는 가격을 우선시했던 시절, 중국 제조업은 대량 생산과 낮은 단가로 시장을 점유했습니다.",
    highlight: '저렴한 가격',
  },
  {
    id: 'change',
    year: '변화',
    title: '기술 혁신의 시작',
    description: "중국은 더 이상 모방의 단계를 벗어나 'Invented in China'라 불릴 만큼 독자적인 기술력을 확보하기 시작했습니다. R&D 투자 확대와 인재 육성으로 새로운 도약을 준비했습니다.",
    highlight: 'Invented in China',
  },
  {
    id: 'present',
    year: '현재',
    title: '글로벌 혁신의 중심',
    description: "애플, 삼성, 테슬라와 같은 글로벌 기업들이 중국에서 최첨단 제품을 생산합니다. 세계 최고 수준의 생산 인프라와 기술력을 보유한 제조 강국으로 자리매김했습니다.",
    highlight: '애플, 삼성, 테슬라',
  },
  {
    id: 'innovation',
    year: '혁신',
    title: '새로운 기준의 정립',
    description: "쿠디솜은 축적된 제작 노하우와 중국의 첨단 생산 시스템을 결합하여 최고 품질의 제품을 만들어냅니다. 단순한 생산이 아닌, 혁신적인 파트너십으로 새로운 가치를 창출합니다.",
    highlight: '축적된 제작 노하우',
  },
];

const innovationCardsData: InnovationCardData[] = [
  {
    id: 'global',
    icon: '🌏',
    title: '글로벌 공급망',
    description: '전 세계 자재의 허브인 중국의 방대한 공급망을 활용하여 특수 원단과 독특한 부자재까지 완벽하게 구현합니다.',
  },
  {
    id: 'tech',
    icon: '⚡',
    title: '최첨단 기술력',
    description: '세계에서 가장 빠르게 발전하는 생산 기술과 인프라를 활용하여 최고 품질의 제품을 제작합니다.',
  },
  {
    id: 'expert',
    icon: '🎯',
    title: '숙련된 전문가',
    description: '수많은 글로벌 프로젝트를 통해 축적된 기술자들의 경험으로 한 치의 오차도 없이 구현합니다.',
  },
];

// ============================================================
// 타임라인 아이템 컴포넌트 | Timeline Item Component
// ============================================================

interface TimelineItemProps {
  data: TimelineItemData;
  index: number;
  isActive: boolean;
  isLeft: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ data, index, isActive, isLeft }) => {
  // 설명에서 하이라이트 텍스트 강조 처리 | Highlight text in description
  const highlightDescription = () => {
    const parts = data.description.split(data.highlight);
    if (parts.length === 1) return data.description;
    
    return (
      <>
        {parts[0]}
        <span style={{ color: '#1a2867', fontWeight: 600 }}>{data.highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div 
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        paddingBottom: '60px',
      }}
      className="timeline-item-wrapper"
    >
      {/* 연도 라벨 | Year Label */}
      <div 
        style={{
          position: 'absolute',
          top: '8px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
        }}
        className="timeline-year-label"
      >
        <div style={{
          padding: '6px 16px',
          borderRadius: '100px',
          background: isActive ? '#ffd93d' : '#f1f3f5',
          color: isActive ? '#1a2867' : '#868e96',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
          transition: 'all 0.4s ease',
          boxShadow: isActive ? '0 4px 12px rgba(255, 217, 61, 0.3)' : 'none',
        }}>
          {data.year}
        </div>
      </div>

      {/* 카드 콘텐츠 | Card Content */}
      <div 
        style={{
          width: 'calc(50% - 48px)',
          marginTop: '48px',
          padding: '28px',
          borderRadius: '20px',
          background: '#ffffff',
          border: '1px solid #f0f0f0',
          opacity: isActive ? 1 : 0,
          transform: isActive 
            ? 'translateX(0) translateY(0)' 
            : `translateX(${isLeft ? '-30px' : '30px'}) translateY(10px)`,
          transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`,
          boxShadow: isActive 
            ? '0 8px 30px rgba(0, 0, 0, 0.06)'
            : '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
        className="timeline-card-content"
      >
        <h4 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#1a1a1a',
          marginBottom: '12px',
          fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{
            width: '4px',
            height: '18px',
            background: '#ffd93d',
            borderRadius: '2px',
          }} />
          {data.title}
        </h4>
        <p style={{
          fontSize: '14px',
          fontWeight: 400,
          color: '#666666',
          lineHeight: 1.7,
          fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
          wordBreak: 'keep-all',
        }}>
          {highlightDescription()}
        </p>
      </div>
    </div>
  );
};

// ============================================================
// 이노베이션 카드 컴포넌트 | Innovation Card Component
// ============================================================

interface InnovationItemProps {
  data: InnovationCardData;
  index: number;
  isVisible: boolean;
}

const InnovationItem: React.FC<InnovationItemProps> = ({ data, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '32px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #f0f0f0',
        textAlign: 'center',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? (isHovered ? 'translateY(-8px)' : 'translateY(0)')
          : 'translateY(30px)',
        transition: `
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s,
          transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)
        `,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(26, 40, 103, 0.12), 0 8px 16px rgba(26, 40, 103, 0.08)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* 아이콘 | Icon */}
      <div style={{
        fontSize: '40px',
        marginBottom: '20px',
        transition: 'transform 0.3s ease',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        {data.icon}
      </div>

      {/* 타이틀 | Title */}
      <h4 style={{
        fontSize: '17px',
        fontWeight: 700,
        color: '#1a1a1a',
        marginBottom: '12px',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        {data.title}
      </h4>

      {/* 설명 | Description */}
      <p style={{
        fontSize: '14px',
        fontWeight: 400,
        color: '#666666',
        lineHeight: 1.7,
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        wordBreak: 'keep-all',
      }}>
        {data.description}
      </p>

      {/* 호버 시 하단 액센트 바 | Bottom accent bar on hover */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '32px',
        right: '32px',
        height: '3px',
        borderRadius: '3px 3px 0 0',
        background: '#ffd93d',
        transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'center',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }} />
    </div>
  );
};

// ============================================================
// 타이핑 효과 컴포넌트 | Typing Effect Component
// ============================================================

interface TypingEffectProps {
  text: string;
  isVisible: boolean;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, isVisible }) => {
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [started, setStarted] = useState(false);

  // 시작 트리거 | Start trigger
  useEffect(() => {
    if (isVisible && !started) {
      const startTimer = setTimeout(() => setStarted(true), 300);
      return () => clearTimeout(startTimer);
    }
  }, [isVisible, started]);

  // 타이핑 애니메이션 | Typing animation
  useEffect(() => {
    if (!started) return;
    if (charIndex >= text.length) return;

    const timer = setTimeout(() => {
      setCharIndex(prev => prev + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [started, charIndex, text.length]);

  // 커서 깜빡임 | Cursor blink
  useEffect(() => {
    const isComplete = charIndex >= text.length;
    
    if (isComplete) {
      const hideTimer = setTimeout(() => setShowCursor(false), 1500);
      return () => clearTimeout(hideTimer);
    }
    
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorTimer);
  }, [charIndex, text.length]);

  return (
    <h2 style={{
      fontSize: 'clamp(28px, 4vw, 40px)',
      fontWeight: 800,
      color: '#1a1a1a',
      lineHeight: 1.3,
      letterSpacing: '-0.03em',
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {text.slice(0, charIndex)}
      <span style={{
        display: 'inline-block',
        width: '3px',
        height: '36px',
        background: '#ffd93d',
        marginLeft: '4px',
        opacity: showCursor ? 1 : 0,
        transition: 'opacity 0.1s',
      }} />
    </h2>
  );
};

// ============================================================
// Made in China 섹션 컴포넌트 | Made in China Section Component
// ============================================================

const MadeInChinaSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeItems, setActiveItems] = useState<number[]>([]);
  const [progressHeight, setProgressHeight] = useState(0);
  const [showRipple, setShowRipple] = useState(false);
  const rippleTriggered = useRef(false);

  // 섹션 진입 감지 | Detect section entry
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 타임라인 스크롤 기반 애니메이션 | Timeline scroll-based animation
  useEffect(() => {
    if (!isVisible || !timelineRef.current) return;

    const handleScroll = () => {
      if (!timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const timelineTop = timelineRect.top;
      const timelineHeight = timelineRect.height;
      const windowHeight = window.innerHeight;

      // 타임라인이 화면에 보이는 비율 계산 | Calculate visibility ratio
      const visibleStart = windowHeight * 0.7;
      const scrollProgress = Math.max(0, Math.min(1, (visibleStart - timelineTop) / (timelineHeight * 0.7)));
      
      // 게이지바 높이 업데이트 | Update gauge bar height
      setProgressHeight(scrollProgress * 100);

      // 활성화할 아이템 결정 | Determine which items to activate
      const itemCount = timelineData.length;
      const activeCount = Math.floor(scrollProgress * itemCount) + (scrollProgress > 0 ? 1 : 0);
      
      const newActiveItems: number[] = [];
      for (let i = 0; i < Math.min(activeCount, itemCount); i++) {
        newActiveItems.push(i);
      }
      setActiveItems(newActiveItems);

      // 게이지바 완료 시 물결 효과 | Ripple effect when gauge complete
      if (scrollProgress >= 0.95 && !rippleTriggered.current) {
        rippleTriggered.current = true;
        setShowRipple(true);
        setTimeout(() => setShowRipple(false), 3000);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 실행 | Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #fafbfc 0%, #f0f4ff 50%, #fafbfc 100%)',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* -------------------------------------------------------- */}
        {/* 헤더 섹션 | Header Section */}
        {/* -------------------------------------------------------- */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* 라벨 뱃지 | Label Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '100px',
            background: '#fff8e0',
            marginBottom: '24px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd93d' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a2867', letterSpacing: '-0.02em' }}>
              Made in China
            </span>
          </div>

          {/* "made in china" 정적 텍스트 | Static "made in china" text */}
          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: 500,
            color: '#1a2867',
            marginBottom: '12px',
            letterSpacing: '-0.01em',
          }}>
            ❝ made in china ❞
          </p>

          {/* 타이핑 효과 타이틀 | Typing Effect Title */}
          <div style={{ marginBottom: '24px', minHeight: '50px' }}>
            <TypingEffect
              text="새로운 기준을 제시하다"
              isVisible={isVisible}
            />
          </div>

          {/* 서브 타이틀 | Subtitle */}
          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            fontWeight: 400,
            color: '#666666',
            lineHeight: 1.8,
            maxWidth: '700px',
            margin: '0 auto 32px',
            wordBreak: 'keep-all',
          }}>
            과거의 편견을 넘어, 혁신과 기술력으로 세계를 선도하는<br />
            새로운 'Made in China'의 시대가 열렸습니다.
          </p>

          {/* 인트로 카드 | Intro Card */}
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '28px 32px',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
            textAlign: 'left',
          }}>
            <p style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#000000',
              lineHeight: 1.8,
              wordBreak: 'keep-all',
            }}>
              지금 여러분 주변에 있는 제품들 중 'Made in China'라는 문구를 한 번쯤 보신 적이 있지 않으신가요?
              요즘의 'Made in China' 제품의 사용감이 옛날과 정말 같던가요?
              <br /><br />
              브랜드 로고를 가리고 써도, 완성도는 손으로 먼저 느낄 수 있습니다.
              그 체감, 우연이 아닙니다. 중국의 제조 기술은 이미 세계 최고 수준으로 발전했습니다.
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* 타임라인 섹션 | Timeline Section */}
        {/* -------------------------------------------------------- */}
        <div style={{
          marginBottom: '40px', // 줄임: 80px -> 40px | Reduced margin
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}>
            <span style={{
              width: '4px',
              height: '20px',
              background: '#1a2867',
              borderRadius: '2px',
            }} />
            변화의 시간선
          </h3>

          {/* 타임라인 컨테이너 | Timeline Container */}
          <div 
            ref={timelineRef}
            style={{
              position: 'relative',
              maxWidth: '900px',
              margin: '0 auto',
              paddingBottom: '80px', // 게이지바를 더 길게 | Extend gauge bar
            }}
            className="timeline-container"
          >
            {/* 타임라인 세로선 (배경) | Timeline vertical line (background) */}
            <div 
              style={{
                position: 'absolute',
                left: '50%',
                top: '40px',
                bottom: '0',
                width: '3px',
                background: '#e9ecef',
                transform: 'translateX(-50%)',
                borderRadius: '2px',
              }}
              className="timeline-vertical-line"
            />

            {/* 타임라인 게이지바 (진행) | Timeline gauge bar (progress) */}
            <div 
              style={{
                position: 'absolute',
                left: '50%',
                top: '40px',
                width: '3px',
                height: `${progressHeight}%`,
                maxHeight: 'calc(100% - 40px)',
                background: '#ffd93d',
                transform: 'translateX(-50%)',
                borderRadius: '2px',
                transition: 'height 0.15s ease-out',
                boxShadow: '0 0 12px rgba(255, 217, 61, 0.5)',
              }}
              className="timeline-gauge-bar"
            >
              {/* 게이지바 끝 화살표 | Gauge bar end arrow */}
              <div style={{
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '14px',
                color: '#ffd93d',
                filter: 'drop-shadow(0 0 4px rgba(255, 217, 61, 0.6))',
              }}>
                ▼
              </div>
            </div>

            {/* 물결 효과 컨테이너 | Ripple Effect Container */}
            <div style={{
              position: 'absolute',
              left: '50%',
              bottom: '-40px',
              transform: 'translateX(-50%)',
              width: '220px',
              height: '220px',
              pointerEvents: 'none',
            }}>
              {showRipple && (
                <>
                  <div className="ripple-wave ripple-1" />
                  <div className="ripple-wave ripple-2" />
                  <div className="ripple-wave ripple-3" />
                </>
              )}
            </div>

            {/* 타임라인 아이템들 | Timeline Items */}
            {timelineData.map((item, index) => (
              <TimelineItem
                key={item.id}
                data={item}
                index={index}
                isActive={activeItems.includes(index)}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* 혁신 섹션 | Innovation Section */}
        {/* -------------------------------------------------------- */}
        <div style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}>
            <span style={{
              width: '4px',
              height: '20px',
              background: '#ffd93d',
              borderRadius: '2px',
            }} />
            품질의 새로운 기준
          </h3>

          {/* 이노베이션 카드 그리드 | Innovation Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}>
            {innovationCardsData.map((card, index) => (
              <InnovationItem
                key={card.id}
                data={card}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* 하단 메시지 | Bottom Message */}
          <p style={{
            textAlign: 'center',
            fontSize: 'clamp(15px, 2vw, 17px)',
            fontWeight: 400,
            color: '#495057',
            lineHeight: 1.8,
            wordBreak: 'keep-all',
          }}>
            쿠디솜은 과거 가성비 'Made in China'에 대한 편견을 깨고,<br />
            <span style={{ color: '#1a2867', fontWeight: 600 }}>최고의 품질과 합리적인 가격</span>으로 새로운 기준을 제시합니다.
          </p>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// 경쟁사 비교 섹션 타입 정의 | Comparison Section Type Definitions
// ============================================================

interface ComparisonRowData {
  category: string;
  companyA: string;
  companyB: string;
  qudisom: string;
  companyC: string;
  companyD: string;
}

// ============================================================
// 경쟁사 비교 섹션 데이터 | Comparison Section Data
// ============================================================

const comparisonData: ComparisonRowData[] = [
  {
    category: '샘플 비용',
    companyA: '₩300,000',
    companyB: '₩200,000',
    qudisom: '₩150,000',
    companyC: '₩200,000',
    companyD: '₩250,000',
  },
  {
    category: '샘플 제작 기간',
    companyA: '3주',
    companyB: '3주',
    qudisom: '2주',
    companyC: '4주',
    companyD: '5주',
  },
  {
    category: '샘플 수정 비용',
    companyA: '₩50,000',
    companyB: '무료',
    qudisom: '무료',
    companyC: '₩100,000',
    companyD: '₩100,000',
  },
  {
    category: '샘플 최대 수정 횟수',
    companyA: '3회',
    companyB: '1회',
    qudisom: '3회',
    companyC: '불가',
    companyD: '2회',
  },
  {
    category: '가격',
    companyA: '₩12,000',
    companyB: '₩15,000',
    qudisom: '₩5,000',
    companyC: '₩8,000',
    companyD: '₩7,000',
  },
  {
    category: '제작 기간',
    companyA: '50일',
    companyB: '40일',
    qudisom: '30일',
    companyC: '35일',
    companyD: '80일',
  },
  {
    category: '최소 주문 수량(MOQ)',
    companyA: '1,000개',
    companyB: '500개',
    qudisom: '300개',
    companyC: '2,000개',
    companyD: '1,000개',
  },
  {
    category: '품질',
    companyA: '하',
    companyB: '상',
    qudisom: '최상',
    companyC: '중',
    companyD: '중',
  },
];

const companyHeaders = ['A사', 'B사', 'Qudisom', 'C사', 'D사'];

// ============================================================
// 경쟁사 비교 섹션 컴포넌트 | Comparison Section Component
// ============================================================

const ComparisonSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // 섹션 진입 감지 | Detect section entry
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 셀 값 가져오기 | Get cell value
  const getCellValue = (row: ComparisonRowData, colIndex: number): string => {
    switch (colIndex) {
      case 0: return row.companyA;
      case 1: return row.companyB;
      case 2: return row.qudisom;
      case 3: return row.companyC;
      case 4: return row.companyD;
      default: return '';
    }
  };

  return (
    <section
  ref={sectionRef}
  style={{
    padding: '120px 24px',
    background: 'linear-gradient(180deg, #fafbfc 0%, #f0f4ff 50%, #fafbfc 100%)',
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
  }}
>
  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
    {/* -------------------------------------------------------- */}
    {/* 헤더 섹션 | Header Section */}
    {/* -------------------------------------------------------- */}
    <div style={{
      textAlign: 'center',
      marginBottom: '60px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      willChange: 'transform, opacity',
    }}>
      {/* 라벨 뱃지 | Label Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '100px',
        background: '#fff8e0',
        marginBottom: '24px',
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd93d' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a2867', letterSpacing: '-0.02em' }}>
          경쟁사 비교
        </span>
      </div>

      {/* 메인 타이틀 | Main Title */}
      <h2 style={{
        fontSize: 'clamp(28px, 4vw, 40px)',
        fontWeight: 800,
        color: '#1a1a1a',
        marginBottom: '16px',
        lineHeight: 1.4,
        letterSpacing: '-0.03em',
      }}>
        다르게 고민하고,<br />다르게 설계합니다.
      </h2>

    </div>

    {/* -------------------------------------------------------- */}
    {/* 비교 테이블 | Comparison Table */}
    {/* -------------------------------------------------------- */}
    <div style={{
      background: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #e9ecef',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      overflow: 'hidden',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 30px, 0)',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
      willChange: 'transform, opacity',
    }}>
      {/* 테이블 래퍼 (스크롤) | Table Wrapper (scroll) */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '800px',
        }}>
          {/* 테이블 헤더 | Table Header */}
          <thead>
            <tr>
              <th style={{
                padding: '34px 16px 20px 16px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                background: '#f8f9fa',
                borderBottom: '1px solid #e9ecef',
                borderRight: '1px solid #e9ecef',
                minWidth: '140px',
              }}>
                서비스 비교
              </th>
              {companyHeaders.map((header, index) => {
                const isQudisom = index === 2;
                return (
                  <th
                    key={header}
                    style={{
                      padding: '34px 16px 20px 16px',
                      textAlign: 'center',
                      fontSize: isQudisom ? '16px' : '14px',
                      fontWeight: isQudisom ? 700 : 600,
                      color: isQudisom ? '#1a2867' : '#495057',
                      background: isQudisom ? '#fff8e0' : '#f8f9fa',
                      borderBottom: isQudisom ? '2px solid #ffd93d' : '1px solid #e9ecef',
                      position: 'relative',
                    }}
                  >
                    {isQudisom && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#ffd93d',
                        color: '#1a2867',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '11px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}>
                        BEST
                      </span>
                    )}
                    {header}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* 테이블 바디 | Table Body */}
          <tbody>
            {comparisonData.map((row, rowIndex) => (
              <tr
                key={row.category}
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  background: hoveredRow === rowIndex ? '#fafbfc' : 'transparent',
                  transition: 'background 0.2s ease',
                }}
              >
                {/* 카테고리 셀 | Category Cell */}
                <td style={{
                  padding: '18px 16px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  borderBottom: rowIndex === comparisonData.length - 1 ? 'none' : '1px solid #f1f3f5',
                  borderRight: '1px solid #e9ecef',
                }}>
                  {row.category}
                </td>

                {/* 데이터 셀들 | Data Cells */}
                {[0, 1, 2, 3, 4].map((colIndex) => {
                  const isQudisom = colIndex === 2;
                  const isHovered = hoveredRow === rowIndex && isQudisom;
                  const isLastRow = rowIndex === comparisonData.length - 1;
                  const cellValue = getCellValue(row, colIndex);

                  return (
                    <td
                      key={colIndex}
                      className={isHovered ? 'qudisom-cell-glow' : ''}
                      style={{
                        padding: '18px 16px',
                        textAlign: 'center',
                        fontSize: isQudisom ? '15px' : '14px',
                        fontWeight: isQudisom ? 700 : 400,
                        color: isQudisom ? '#1a2867' : '#666666',
                        background: isQudisom 
                          ? (isHovered ? '#fff3c4' : '#fffbeb')
                          : 'transparent',
                        borderBottom: isLastRow ? 'none' : '1px solid #f1f3f5',
                        position: 'relative',
                        transition: 'background 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: isHovered 
                          ? 'inset 0 0 0 2px #ffd93d, 0 0 12px rgba(255, 217, 61, 0.3)'
                          : 'none',
                      }}
                    >
                      {/* 품질 행의 Qudisom 셀 특별 스타일 | Special style for Quality row Qudisom cell */}
                      {isLastRow && isQudisom ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#1a2867',
                          fontWeight: 800,
                          fontSize: '16px',
                        }}>
                          <span style={{ color: '#ffd93d' }}>★</span>
                          {cellValue}
                        </span>
                      ) : (
                        cellValue
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* -------------------------------------------------------- */}
    {/* 하단 메시지 | Bottom Message */}
    {/* -------------------------------------------------------- */}
    <div style={{
      textAlign: 'center',
      marginTop: '40px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 20px, 0)',
      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
      willChange: 'transform, opacity',
    }}>
      <p style={{
        fontSize: '14px',
        fontWeight: 400,
        color: '#868e96',
      }}>
        *위 비교표는 예시이며, 실제 제품에 따라 차이가 존재할 수 있습니다.
      </p>
    </div>
  </div>
</section>
  );
};

// ============================================================
// 인재상 & 핵심 가치 섹션 타입 정의 | Values Section Type Definitions
// ============================================================

interface ValueCardData {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// ============================================================
// SVG 아이콘 컴포넌트들 | SVG Icon Components
// ============================================================

const CheckCircleIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const CalendarIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
  </svg>
);

const PlusCircleIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </svg>
);

const StarIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const ShareIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>
  </svg>
);

const InfoIconValue: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
);

// ============================================================
// 인재상 & 핵심 가치 섹션 데이터 | Values Section Data
// ============================================================

const talentData: ValueCardData[] = [
  {
    id: 'collaborator',
    icon: <CheckCircleIcon />,
    title: '이야기를 완성하는 협력가',
    description: '개인의 성과보다 팀 전체의 목표를 중요하게 생각하며, 긍정적인 태도로 동료들과 시너지를 만들어내는 사람입니다. 고객의 이야기에 귀 기울이고, 그 가치를 함께 완성해가는 협력가를 찾습니다.',
  },
  {
    id: 'expert',
    icon: <CalendarIcon />,
    title: '집념을 가진 전문가',
    description: '자신의 분야에 깊은 이해와 책임감을 가지고, 완벽한 결과물을 위해 끊임없이 노력하는 사람입니다. 정해진 일만 하는 것이 아니라, 더 좋은 방법을 능동적으로 찾아 실행하는 전문가입니다.',
  },
  {
    id: 'innovator',
    icon: <PlusCircleIcon />,
    title: '도전하는 혁신가',
    description: "'불가능하다'는 말보다 '어떻게 가능하게 할까'를 먼저 고민하는 인재입니다. 안주하지 않고 끊임없이 새로운 시도를 두려워하지 않으며, 성장을 함께 이끌어갈 도전 정신을 가진 사람을 환영합니다.",
  },
];

const coreValuesData: ValueCardData[] = [
  {
    id: 'innovation',
    icon: <StarIcon />,
    title: '책임 있는 혁신',
    description: '최고의 품질을 위해 새로운 소재와 효율적인 제조 기술을 끊임없이 탐구합니다. 이와 동시에, 제품의 안전과 지속 가능한 성장을 위한 윤리적 기준을 최우선으로 지키며, 책임 있는 혁신을 추구합니다.',
  },
  {
    id: 'partnership',
    icon: <ShareIcon />,
    title: '창의적 동반자 정신',
    description: '고객을 단순한 거래처가 아닌, 하나의 프로젝트를 함께 만들어가는 동반자로 생각합니다. 아이디어를 이해하고 함께 고민하며, 깊은 소통을 통해 아이디어에 생명력을 불어넣는 것이 우리의 역할입니다.',
  },
  {
    id: 'perfectionism',
    icon: <InfoIconValue />,
    title: '완벽주의',
    description: '제품 하나에 담기는 우리의 정성은 완벽을 향한 집념입니다. 고객의 상상이 현실이 되는 순간, 흠잡을 곳 없는 최고의 품질로 그 감동을 온전히 전달하는 것. 작은 디테일 하나까지도 타협하지 않습니다.',
  },
];

// ============================================================
// 가치 카드 컴포넌트 | Value Card Component
// ============================================================

interface ValueCardProps {
  data: ValueCardData;
  index: number;
  isVisible: boolean;
}

const ValueCard: React.FC<ValueCardProps> = ({ data, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={isHovered ? 'value-card-hover' : ''}
      style={{
        position: 'relative',
        padding: '28px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #f0f0f0',
        marginBottom: '20px',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? (isHovered ? 'translateY(-8px)' : 'translateY(0)')
          : 'translateY(30px)',
        transition: `
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s,
          transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)
        `,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(26, 40, 103, 0.12), 0 0 0 2px rgba(255, 217, 61, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
      }}
    >
      {/* 호버 시 상단 라인 효과 | Top line effect on hover */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #ffd93d, #1a2867)',
        transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }} />

      {/* 타이틀 영역 | Title Area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '16px',
      }}>
        {/* 아이콘 | Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: isHovered ? '#ffd93d' : '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isHovered ? '#1a2867' : '#868e96',
          transition: 'all 0.3s ease',
          flexShrink: 0,
        }}>
          {data.icon}
        </div>

        {/* 타이틀 | Title */}
        <h4 style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#1a1a1a',
          fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
          lineHeight: 1.3,
        }}>
          {data.title}
        </h4>
      </div>

      {/* 설명 | Description */}
      <p style={{
        fontSize: '14px',
        fontWeight: 400,
        color: '#666666',
        lineHeight: 1.8,
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        wordBreak: 'keep-all',
      }}>
        {data.description}
      </p>
    </div>
  );
};

// ============================================================
// 컬럼 헤더 컴포넌트 | Column Header Component
// ============================================================

interface ColumnHeaderProps {
  label: string;
  isVisible: boolean;
  delay?: number;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ label, isVisible, delay = 0 }) => {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '32px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    }}>
      <span style={{
        display: 'inline-block',
        padding: '10px 24px',
        borderRadius: '100px',
        background: '#1a2867',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 700,
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
        letterSpacing: '0.05em',
      }}>
        {label}
      </span>
    </div>
  );
};

// ============================================================
// 인재상 & 핵심 가치 섹션 컴포넌트 | Values Section Component
// ============================================================

const ValuesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 섹션 진입 감지 | Detect section entry
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 24px',
        background: 'linear-gradient(180deg, #fafbfc 0%, #ffffff 50%, #fafbfc 100%)',
        fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* -------------------------------------------------------- */}
        {/* 헤더 섹션 | Header Section */}
        {/* -------------------------------------------------------- */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* 라벨 뱃지 | Label Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '100px',
            background: '#fff8e0',
            marginBottom: '24px',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd93d' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1a2867', letterSpacing: '-0.02em' }}>
              Culture & Values
            </span>
          </div>

          {/* 메인 타이틀 | Main Title */}
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            color: '#1a1a1a',
            marginBottom: '16px',
            lineHeight: 1.4,
            letterSpacing: '-0.03em',
          }}>
            쿠디솜의 구성원과<br />집중하는 핵심 철학
          </h2>

          {/* 서브 타이틀 | Subtitle */}
          <p style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            fontWeight: 400,
            color: '#000000',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            함께 성장하고, 함께 만들어가는 가치
          </p>
        </div>

        {/* -------------------------------------------------------- */}
        {/* 2컬럼 그리드 | Two Column Grid */}
        {/* -------------------------------------------------------- */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: '48px',
        }}>
          {/* 인재상 컬럼 | Talent Column */}
          <div>
            <ColumnHeader label="인재상" isVisible={isVisible} delay={0.2} />
            {talentData.map((item, index) => (
              <ValueCard
                key={item.id}
                data={item}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>

          {/* 핵심 가치 컬럼 | Core Values Column */}
          <div>
            <ColumnHeader label="핵심 가치" isVisible={isVisible} delay={0.3} />
            {coreValuesData.map((item, index) => (
              <ValueCard
                key={item.id}
                data={item}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// 최종 통합 컴포넌트 | Final Combined Component
// ============================================================

const QudisomFullLandingPage: React.FC = () => {
  return (
    <>
      {/* Pretendard 폰트 로드 | Load Pretendard Font */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
      />

      {/* 섹션 1: 쿠디솜을 선택하는 이유 | Section 1: Why Choose Qudisom */}
      <WhyChooseSection />

      {/* 섹션 2: 실적 현황 | Section 2: Performance Statistics */}
      <PerformanceSection />

      {/* 섹션 3: 인프라 현황 | Section 3: Infrastructure Status */}
      <InfrastructureSection />

      {/* 섹션 4: About Us | Section 4: About Us */}
      <AboutSection />

      {/* 섹션 5: Made in China | Section 5: Made in China */}
      <MadeInChinaSection />

      {/* 섹션 6: 경쟁사 비교 | Section 6: Competitor Comparison */}
      <ComparisonSection />

      {/* 섹션 7: 인재상 & 핵심 가치 | Section 7: Talent & Core Values */}
      <ValuesSection />

      {/* 글로벌 스타일 | Global Styles */}
      <style>{`
        @keyframes orbitPoint {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(15px, -10px); }
          50% { transform: translate(-10px, -15px); }
          75% { transform: translate(-15px, 10px); }
        }
        
        /* 태그 떠다니는 애니메이션 | Tag floating animation */
        @keyframes tagFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0) rotate(0deg); 
          }
          20% { 
            transform: translateY(-6px) translateX(4px) rotate(1deg); 
          }
          40% { 
            transform: translateY(3px) translateX(-2px) rotate(-0.5deg); 
          }
          60% { 
            transform: translateY(-4px) translateX(-3px) rotate(0.5deg); 
          }
          80% { 
            transform: translateY(2px) translateX(5px) rotate(-1deg); 
          }
        }
        
        /* 게이지바 애니메이션 | Gauge bar animation */
        @keyframes gaugeLoad {
          0% { 
            width: 0%; 
            opacity: 0.6;
          }
          50% { 
            width: 100%; 
            opacity: 1;
          }
          100% { 
            width: 100%; 
            opacity: 0.7;
          }
        }
        
        .gauge-animated {
          animation: gaugeLoad 5s ease-in-out forwards;
          will-change: width, opacity;
        }
        
        /* 태그 호버 효과 | Tag hover effect */
        .floating-tag {
          will-change: transform;
        }
        
        .floating-tag:hover {
          animation-play-state: paused !important;
          transform: scale(1.05) rotate(2deg) !important;
          box-shadow: 0 6px 16px rgba(26, 40, 103, 0.12) !important;
          z-index: 10;
        }
        
        /* 물결 효과 애니메이션 | Ripple wave animation */
        @keyframes rippleExpand {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
        
        .ripple-wave {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid #ffd93d;
          border-radius: 50%;
          animation: rippleExpand 2s ease-out forwards;
          box-shadow: 0 0 8px rgba(255, 217, 61, 0.4);
        }
        
        .ripple-1 {
          animation-delay: 0s;
        }
        
        .ripple-2 {
          animation-delay: 0.4s;
        }
        
        .ripple-3 {
          animation-delay: 0.8s;
        }
        
        /* Qudisom 셀 빛나는 효과 | Qudisom cell glow effect */
        @keyframes qudisomCellGlow {
          0%, 100% {
            box-shadow: inset 0 0 0 2px #ffd93d, 0 0 12px rgba(255, 217, 61, 0.3);
          }
          50% {
            box-shadow: inset 0 0 0 2px #ffd93d, 0 0 20px rgba(255, 217, 61, 0.5), 0 0 30px rgba(255, 217, 61, 0.2);
          }
        }
        
        .qudisom-cell-glow {
          animation: qudisomCellGlow 1.5s ease-in-out infinite;
        }
        
        /* 가치 카드 호버 효과 | Value card hover effect */
        .value-card-hover {
          animation: valueCardGlow 2s ease-in-out infinite;
        }
        
        @keyframes valueCardGlow {
          0%, 100% {
            box-shadow: 0 20px 40px rgba(26, 40, 103, 0.12), 0 0 0 2px rgba(255, 217, 61, 0.3);
          }
          50% {
            box-shadow: 0 20px 40px rgba(26, 40, 103, 0.15), 0 0 0 2px rgba(255, 217, 61, 0.5);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

// ============================================================
// ============================================================
// 
// 📌 사용 방법:
//    1. 기존 TSX 파일 맨 아래의 "export default ..." 줄을 삭제
//    2. 이 코드 전체를 그 아래에 붙여넣기
//
// ============================================================
// ============================================================

// ============================================================
// 파트너 섹션 타입 정의 | Partners Section Type Definitions
// ============================================================

interface PartnerLogoData {
  id: string;
  src: string;
  alt: string;
}

// ============================================================
// 파트너 섹션 데이터 | Partners Section Data
// ============================================================

const partnerLogos: PartnerLogoData[] = [
  { id: 'samyang', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/714134476979b.png', alt: 'Samyang' },
  { id: 'mirae', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/078cb28923f24.png', alt: 'Mirae Asset' },
  { id: 'hyundai', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/7184d33f920de.png', alt: 'Hyundai' },
  { id: 'hankook', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/f595dcf4b9b28.png', alt: 'Hankook' },
  { id: 'daelim', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/e06c6c341f230.png', alt: 'Daelim' },
  { id: 'hanjin', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/f23c1c3917c0e.png', alt: 'Hanjin' },
  { id: 'daou', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/4cb087cd70dc0.png', alt: 'Daou Kiwoom' },
  { id: 'kumho', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/f6bc403ab7bce.png', alt: '금호석유화학' },
  { id: 'kyobo', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/99b9dd3a527a7.png', alt: 'Kyobo 교보생명' },
  { id: 'taekwang', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/3d45fd92e461c.png', alt: '태광산업' },
];

// ============================================================
// 파트너 로고 컴포넌트 | Partner Logo Component
// ============================================================

interface PartnerLogoProps {
  data: PartnerLogoData;
  index: number;
  isVisible: boolean;
}

const PartnerLogo: React.FC<PartnerLogoProps> = ({ data, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        borderRadius: '12px',
        background: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? (isHovered ? 'scale(1.05)' : 'scale(1)')
          : 'translateY(20px) scale(0.9)',
        transition: `
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s,
          transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
          background 0.3s ease
        `,
      }}
    >
      <img
        src={data.src}
        alt={data.alt}
        style={{
          height: '48px',
          maxWidth: '140px',
          objectFit: 'contain',
          filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
          transition: 'filter 0.3s ease',
        }}
      />
    </div>
  );
};

// ============================================================
// 파트너 섹션 컴포넌트 | Partners Section Component
// ============================================================

const PartnersSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  // 섹션 진입 감지 | Detect section entry
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
  ref={sectionRef}
  style={{
    padding: '120px 0',
    background: '#000000',
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  }}
>
  {/* 배경 글로우 효과 | Background glow effect */}
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '600px',
    background: 'radial-gradient(ellipse, rgba(255, 217, 61, 0.03) 0%, transparent 70%)',
    pointerEvents: 'none',
  }} />

  <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 24px' }}>
    {/* -------------------------------------------------------- */}
    {/* 헤더 섹션 | Header Section */}
    {/* -------------------------------------------------------- */}
    <div style={{
      textAlign: 'center',
      marginBottom: '60px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {/* 라벨 뱃지 | Label Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '100px',
        background: 'rgba(255, 217, 61, 0.1)',
        border: '1px solid rgba(255, 217, 61, 0.2)',
        marginBottom: '24px',
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd93d' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffd93d', letterSpacing: '-0.02em' }}>
          Partners
        </span>
      </div>

      {/* 메인 타이틀 | Main Title */}
      <h2 style={{
        fontSize: 'clamp(28px, 4vw, 40px)',
        fontWeight: 800,
        color: '#ffffff',
        marginBottom: '16px',
        lineHeight: 1.4,
        letterSpacing: '-0.03em',
      }}>
        쿠디솜과 함께하는 파트너
      </h2>

      {/* 서브 타이틀 | Subtitle */}
      <p style={{
        fontSize: 'clamp(15px, 2vw, 17px)',
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.6)',
        maxWidth: '500px',
        margin: '0 auto',
        lineHeight: 1.7,
      }}>
        기업들과 함께 성장합니다
      </p>
    </div>
  </div>

  {/* -------------------------------------------------------- */}
  {/* 로고 슬라이드 영역 (전체 너비) | Logo Slide Area (full width) */}
  {/* -------------------------------------------------------- */}
  <div style={{ 
    marginBottom: '60px',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.8s ease 0.3s',
  }}>
    {/* 첫 번째 줄 - 좌측으로 슬라이드 | First Row - Slide Left */}
    <div style={{ overflow: 'hidden', marginBottom: '16px' }}>
      <div 
        className="slide-left"
        style={{
          display: 'flex',
          gap: '16px',
          width: 'fit-content',
          animation: 'slideLeft 30s linear infinite',
        }}
      >
        {[...Array(4)].map((_, repeatIndex) => (
          <React.Fragment key={`top-${repeatIndex}`}>
            {[
              { id: 'samyang', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/714134476979b.png', alt: 'Samyang' },
              { id: 'mirae', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/078cb28923f24.png', alt: 'Mirae Asset' },
              { id: 'hyundai', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/7184d33f920de.png', alt: 'Hyundai' },
              { id: 'hankook', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/f595dcf4b9b28.png', alt: 'Hankook' },
              { id: 'daelim', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/e06c6c341f230.png', alt: 'Daelim' },
            ].map((logo) => (
              <div
                key={`${logo.id}-top-${repeatIndex}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px 32px',
                  minWidth: '180px',
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  style={{
                    height: '40px',
                    maxWidth: '120px',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>

    {/* 두 번째 줄 - 우측으로 슬라이드 | Second Row - Slide Right */}
    <div style={{ overflow: 'hidden', marginBottom: '16px' }}>
      <div 
        className="slide-right"
        style={{
          display: 'flex',
          gap: '16px',
          width: 'fit-content',
          animation: 'slideRight 30s linear infinite',
        }}
      >
        {[...Array(4)].map((_, repeatIndex) => (
          <React.Fragment key={`middle-${repeatIndex}`}>
            {[
              { id: 'hanjin', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/f23c1c3917c0e.png', alt: 'Hanjin' },
              { id: 'daou', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/4cb087cd70dc0.png', alt: 'Daou Kiwoom' },
              { id: 'kumho', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/f6bc403ab7bce.png', alt: '금호석유화학' },
              { id: 'kyobo', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/99b9dd3a527a7.png', alt: 'Kyobo' },
              { id: 'taekwang', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/3d45fd92e461c.png', alt: '태광산업' },
            ].map((logo) => (
              <div
                key={`${logo.id}-middle-${repeatIndex}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px 32px',
                  minWidth: '180px',
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  style={{
                    height: '40px',
                    maxWidth: '120px',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>

    {/* 세 번째 줄 - 좌측으로 슬라이드 | Third Row - Slide Left */}
    <div style={{ overflow: 'hidden' }}>
      <div 
        className="slide-left"
        style={{
          display: 'flex',
          gap: '16px',
          width: 'fit-content',
          animation: 'slideLeft 30s linear infinite',
        }}
      >
        {[...Array(4)].map((_, repeatIndex) => (
          <React.Fragment key={`bottom-${repeatIndex}`}>
            {[
              { id: 'samyang', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/714134476979b.png', alt: 'Samyang' },
              { id: 'mirae', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/078cb28923f24.png', alt: 'Mirae Asset' },
              { id: 'hyundai', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/7184d33f920de.png', alt: 'Hyundai' },
              { id: 'hankook', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/f595dcf4b9b28.png', alt: 'Hankook' },
              { id: 'daelim', src: 'https://cdn.imweb.me/upload/S202312147f3235c86a141/e06c6c341f230.png', alt: 'Daelim' },
            ].map((logo) => (
              <div
                key={`${logo.id}-bottom-${repeatIndex}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px 32px',
                  minWidth: '180px',
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  style={{
                    height: '40px',
                    maxWidth: '120px',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>

  <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1, padding: '0 24px' }}>
    {/* -------------------------------------------------------- */}
    {/* 장식 점선 | Decorative dots */}
    {/* -------------------------------------------------------- */}
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '48px',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
    }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
          }}
        />
      ))}
    </div>

    {/* -------------------------------------------------------- */}
    {/* CTA 버튼 | CTA Button */}
    {/* -------------------------------------------------------- */}
    <div style={{
      textAlign: 'center',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
    }}>
      <button
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '16px 32px',
          borderRadius: '100px',
          background: '#ffd93d',
          color: '#000000',
          fontSize: '16px',
          fontWeight: 700,
          fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
          border: 'none',
          cursor: 'pointer',
          transform: isButtonHovered ? 'translateY(-3px)' : 'translateY(0)',
          boxShadow: isButtonHovered 
            ? '0 12px 30px rgba(255, 217, 61, 0.4)'
            : '0 4px 15px rgba(255, 217, 61, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span style={{ fontSize: '18px' }}>🤝</span>
        쿠디솜과 함께하기
      </button>
    </div>

    {/* -------------------------------------------------------- */}
    {/* 하단 저작권 | Footer copyright */}
    {/* -------------------------------------------------------- */}
    <div style={{
      textAlign: 'center',
      marginTop: '80px',
      paddingTop: '40px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      opacity: isVisible ? 1 : 0,
      transition: 'opacity 0.8s ease 0.8s',
    }}>
      <p style={{
        fontSize: '13px',
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.4)',
      }}>
        © 2024 Qudisom Plush Toy Co., Ltd. All rights reserved.
      </p>
    </div>
  </div>
</section>
  );
};

// ============================================================
// 최종 통합 컴포넌트 | Final Combined Component
// ============================================================

const QudisomCompleteLandingPage: React.FC = () => {
  return (
    <>
      {/* Pretendard 폰트 로드 | Load Pretendard Font */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
      />

      {/* 섹션 1: 쿠디솜을 선택하는 이유 | Section 1: Why Choose Qudisom */}
      <WhyChooseSection />

      {/* 섹션 2: 실적 현황 | Section 2: Performance Statistics */}
      <PerformanceSection />

      {/* 섹션 3: 인프라 현황 | Section 3: Infrastructure Status */}
      <InfrastructureSection />

      {/* 섹션 4: About Us | Section 4: About Us */}
      <AboutSection />

      {/* 섹션 5: Made in China | Section 5: Made in China */}
      <MadeInChinaSection />

      {/* 섹션 6: 경쟁사 비교 | Section 6: Competitor Comparison */}
      <ComparisonSection />

      {/* 섹션 7: 인재상 & 핵심 가치 | Section 7: Talent & Core Values */}
      <ValuesSection />

      {/* 섹션 8: 파트너 | Section 8: Partners */}
      <PartnersSection />

      {/* 글로벌 스타일 | Global Styles */}
      <style>{`
        @keyframes orbitPoint {
          0%, 100% { transform: translate(0px, 0px); }
          25% { transform: translate(15px, -10px); }
          50% { transform: translate(-10px, -15px); }
          75% { transform: translate(-15px, 10px); }
        }
        
        /* 파트너 로고 슬라이드 애니메이션 | Partner logo slide animations */
        @keyframes slideRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        @keyframes slideLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        /* 태그 떠다니는 애니메이션 | Tag floating animation */
        @keyframes tagFloat {
          0%, 100% { 
            transform: translateY(0) translateX(0) rotate(0deg); 
          }
          20% { 
            transform: translateY(-6px) translateX(4px) rotate(1deg); 
          }
          40% { 
            transform: translateY(3px) translateX(-2px) rotate(-0.5deg); 
          }
          60% { 
            transform: translateY(-4px) translateX(-3px) rotate(0.5deg); 
          }
          80% { 
            transform: translateY(2px) translateX(5px) rotate(-1deg); 
          }
        }
        
        /* 게이지바 애니메이션 | Gauge bar animation */
        @keyframes gaugeLoad {
          0% { 
            width: 0%; 
            opacity: 0.6;
          }
          50% { 
            width: 100%; 
            opacity: 1;
          }
          100% { 
            width: 100%; 
            opacity: 0.7;
          }
        }
        
        .gauge-animated {
          animation: gaugeLoad 3s ease-in-out forwards;
          will-change: width, opacity;
        }
        
        /* 태그 호버 효과 | Tag hover effect */
        .floating-tag {
          will-change: transform;
        }
        
        .floating-tag:hover {
          animation-play-state: paused !important;
          transform: scale(1.05) rotate(2deg) !important;
          box-shadow: 0 6px 16px rgba(26, 40, 103, 0.12) !important;
          z-index: 10;
        }
        
        /* 물결 효과 애니메이션 | Ripple wave animation */
        @keyframes rippleExpand {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
        
        .ripple-wave {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid #ffd93d;
          border-radius: 50%;
          animation: rippleExpand 2s ease-out forwards;
          box-shadow: 0 0 8px rgba(255, 217, 61, 0.4);
        }
        
        .ripple-1 {
          animation-delay: 0s;
        }
        
        .ripple-2 {
          animation-delay: 0.4s;
        }
        
        .ripple-3 {
          animation-delay: 0.8s;
        }
        
        /* Qudisom 셀 빛나는 효과 | Qudisom cell glow effect */
        @keyframes qudisomCellGlow {
          0%, 100% {
            box-shadow: inset 0 0 0 2px #ffd93d, 0 0 12px rgba(255, 217, 61, 0.3);
          }
          50% {
            box-shadow: inset 0 0 0 2px #ffd93d, 0 0 20px rgba(255, 217, 61, 0.5), 0 0 30px rgba(255, 217, 61, 0.2);
          }
        }
        
        .qudisom-cell-glow {
          animation: qudisomCellGlow 1.5s ease-in-out infinite;
        }
        
        /* 가치 카드 호버 효과 | Value card hover effect */
        .value-card-hover {
          animation: valueCardGlow 2s ease-in-out infinite;
        }
        
        @keyframes valueCardGlow {
          0%, 100% {
            box-shadow: 0 20px 40px rgba(26, 40, 103, 0.12), 0 0 0 2px rgba(255, 217, 61, 0.3);
          }
          50% {
            box-shadow: 0 20px 40px rgba(26, 40, 103, 0.15), 0 0 0 2px rgba(255, 217, 61, 0.5);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* 파트너 로고 그리드 반응형 | Partner logo grid responsive */
        @media (max-width: 900px) {
          .partners-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        @media (max-width: 600px) {
          .partners-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* 타임라인 모바일 반응형 | Timeline mobile responsive */
        @media (max-width: 768px) {
          .timeline-container {
            padding-left: 60px !important;
          }

          .timeline-item-wrapper {
            justify-content: flex-start !important;
            padding-left: 0 !important;
            padding-bottom: 40px !important;
          }

          .timeline-year-label {
            left: -40px !important;
            transform: translateX(0) !important;
          }

          .timeline-card-content {
            width: 100% !important;
            margin-top: 48px !important;
          }

          .timeline-vertical-line {
            left: 0 !important;
            transform: translateX(0) !important;
          }

          .timeline-gauge-bar {
            left: 0 !important;
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
};

export default QudisomCompleteLandingPage;