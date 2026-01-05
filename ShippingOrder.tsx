import { useState, useRef } from 'react';
import { Download, Printer, Calendar, Truck, MapPin, Package, Phone, Building2 } from 'lucide-react';

// ============================================
// 출고 지시서 컴포넌트 (Shipping Order Component)
// 브랜드: Qudisom - 인형 제작 OEM 스타트업
// 스타일: 토스 스타일 미니멀 & 트렌디 디자인
// ============================================

// ========== 브랜드 컬러 정의 (Brand Color Definition) ==========
const BRAND_COLORS = {
  primary: "#ffd93d",
  secondary: "#1a2867",
  text: {
    primary: "#191F28",
    secondary: "#4E5968",
    tertiary: "#8B95A1",
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    tertiary: "#F2F4F6",
  },
  border: "#E5E8EB",
};

// ========== 출고 항목 타입 정의 (Shipping Item Type Definition) ==========
interface ShippingItem {
  id: string;
  productCode: string;
  productName: string;
  specification: string;
  quantity: number;
  weight: number;
  packageCount: number;
  notes: string;
}

// ========== 출고 지시서 Props ==========
interface ShippingOrderProps {
  onNavigate?: (page: string) => void;
}

// ========== 출고 데이터 (Shipping Data) ==========
const mockShippingItems: ShippingItem[] = [
  {
    id: '1',
    productCode: 'DOLL-001',
    productName: '커스텀 봉제 인형',
    specification: '30cm / 면 100% / 베이지',
    quantity: 500,
    weight: 75.0,
    packageCount: 10,
    notes: '포장 완료'
  },
  {
    id: '2',
    productCode: 'KEYRING-002',
    productName: '미니 인형 키링',
    specification: '8cm / 폴리에스터 / 다색',
    quantity: 1000,
    weight: 50.0,
    packageCount: 20,
    notes: ''
  },
  {
    id: '3',
    productCode: 'PKG-001',
    productName: '커스텀 포장 박스',
    specification: '15x15x10cm / 골판지',
    quantity: 500,
    weight: 40.0,
    packageCount: 5,
    notes: ''
  }
];

// ========== 메인 컴포넌트 (Main Component) ==========
export default function ShippingOrder({ onNavigate }: ShippingOrderProps) {
  const [shippingDate] = useState(new Date());
  const [items] = useState<ShippingItem[]>(mockShippingItems);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF 다운로드 기능은 서버 연동 후 사용 가능합니다.');
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const totalPackages = items.reduce((sum, item) => sum + item.packageCount, 0);

  return (
    <div style={{ backgroundColor: BRAND_COLORS.background.secondary, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 상단 액션 바 (Top Action Bar) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '4px' }}>
              출고 지시서
            </h1>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
              Shipping Order
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: 'white',
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: BRAND_COLORS.text.primary,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <Printer style={{ width: '18px', height: '18px' }} />
              인쇄
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: BRAND_COLORS.secondary,
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(26, 40, 103, 0.3)',
              }}
            >
              <Download style={{ width: '18px', height: '18px' }} />
              PDF 다운로드
            </button>
          </div>
        </div>

        {/* 출고 지시서 본문 (Shipping Order Body) */}
        <div
          ref={printRef}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '48px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          {/* 헤더 (Header) */}
          <div style={{ textAlign: 'center', marginBottom: '48px', borderBottom: `3px solid ${BRAND_COLORS.secondary}`, paddingBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: BRAND_COLORS.primary,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck style={{ width: '28px', height: '28px', color: BRAND_COLORS.text.primary }} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: BRAND_COLORS.text.primary, margin: 0 }}>
                Qudisom Project
              </h2>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: BRAND_COLORS.secondary, margin: 0 }}>
              출고 지시서
            </h1>
          </div>

          {/* 출고 정보 (Shipping Information) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
            {/* 출고 기본 정보 */}
            <div
              style={{
                padding: '24px',
                backgroundColor: BRAND_COLORS.background.secondary,
                borderRadius: '12px',
                border: `2px solid ${BRAND_COLORS.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: BRAND_COLORS.secondary,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Package style={{ width: '20px', height: '20px' }} />
                출고 정보
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>출고 번호</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary, margin: 0 }}>
                    SO-2024-12-001
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>출고일자</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    {shippingDate.toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>담당자</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    물류팀 김현서
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>연락처</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    010-1234-5678
                  </p>
                </div>
              </div>
            </div>

            {/* 배송지 정보 */}
            <div
              style={{
                padding: '24px',
                backgroundColor: BRAND_COLORS.background.secondary,
                borderRadius: '12px',
                border: `2px solid ${BRAND_COLORS.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: BRAND_COLORS.secondary,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <MapPin style={{ width: '20px', height: '20px' }} />
                배송지 정보
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>수령인</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary, margin: 0 }}>
                    (주)고객사
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>주소</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    서울시 서초구 강남대로 456
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>연락처</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    02-9876-5432
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>배송 방법</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    일반 택배
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 출고 요약 (Shipping Summary) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '32px',
              padding: '20px',
              backgroundColor: '#fff8e0',
              borderRadius: '12px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 8px 0' }}>총 수량</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: BRAND_COLORS.text.primary, margin: 0 }}>
                {totalQuantity.toLocaleString()}개
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 8px 0' }}>총 중량</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: BRAND_COLORS.text.primary, margin: 0 }}>
                {totalWeight.toFixed(1)}kg
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 8px 0' }}>총 박스 수</p>
              <p style={{ fontSize: '24px', fontWeight: 700, color: BRAND_COLORS.text.primary, margin: 0 }}>
                {totalPackages}박스
              </p>
            </div>
          </div>

          {/* 출고 항목 테이블 (Shipping Items Table) */}
          <div style={{ marginBottom: '32px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: BRAND_COLORS.secondary }}>
                  <th style={{ ...tableHeaderStyle, width: '8%' }}>No.</th>
                  <th style={{ ...tableHeaderStyle, width: '12%' }}>품목코드</th>
                  <th style={{ ...tableHeaderStyle, width: '18%' }}>품목명</th>
                  <th style={{ ...tableHeaderStyle, width: '20%' }}>규격</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>수량</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>중량(kg)</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>박스 수</th>
                  <th style={{ ...tableHeaderStyle, width: '12%' }}>비고</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${BRAND_COLORS.border}` }}>
                    <td style={tableCellStyle}>{index + 1}</td>
                    <td style={tableCellStyle}>{item.productCode}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{item.productName}</td>
                    <td style={{ ...tableCellStyle, fontSize: '13px' }}>{item.specification}</td>
                    <td style={tableCellStyle}>{item.quantity.toLocaleString()}개</td>
                    <td style={tableCellStyle}>{item.weight.toFixed(1)}kg</td>
                    <td style={tableCellStyle}>{item.packageCount}박스</td>
                    <td style={{ ...tableCellStyle, fontSize: '12px', color: BRAND_COLORS.text.tertiary }}>
                      {item.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 출고 유의사항 (Shipping Notes) */}
          <div
            style={{
              padding: '20px',
              backgroundColor: BRAND_COLORS.background.tertiary,
              borderRadius: '12px',
              borderLeft: `4px solid ${BRAND_COLORS.primary}`,
              marginBottom: '32px',
            }}
          >
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '12px' }}>
              출고 유의사항
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: BRAND_COLORS.text.secondary, lineHeight: 1.8 }}>
              <li>출고 전 제품 상태 및 수량을 확인해 주세요.</li>
              <li>포장 상태를 점검하고 파손 여부를 확인해 주세요.</li>
              <li>배송지 정보가 정확한지 재확인해 주세요.</li>
              <li>배송 시 운송장 번호를 고객에게 안내해 주세요.</li>
              <li>특이사항 발생 시 즉시 담당자에게 연락해 주세요.</li>
            </ul>
          </div>

          {/* 서명란 (Signature Section) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            <div
              style={{
                padding: '24px',
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '40px' }}>
                출고 담당자
              </p>
              <div
                style={{
                  height: '60px',
                  borderBottom: `1px solid ${BRAND_COLORS.border}`,
                  marginBottom: '8px',
                }}
              />
              <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
                (서명 또는 인)
              </p>
            </div>
            <div
              style={{
                padding: '24px',
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '40px' }}>
                물류팀장 확인
              </p>
              <div
                style={{
                  height: '60px',
                  borderBottom: `1px solid ${BRAND_COLORS.border}`,
                  marginBottom: '8px',
                }}
              />
              <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
                (서명 또는 인)
              </p>
            </div>
            <div
              style={{
                padding: '24px',
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '40px' }}>
                수령인 확인
              </p>
              <div
                style={{
                  height: '60px',
                  borderBottom: `1px solid ${BRAND_COLORS.border}`,
                  marginBottom: '8px',
                }}
              />
              <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
                (서명 또는 인)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 인쇄 스타일 (Print Styles) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-content, #print-content * {
            visibility: visible;
          }
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

// ========== 테이블 스타일 (Table Styles) ==========
const tableHeaderStyle: React.CSSProperties = {
  padding: '16px 12px',
  textAlign: 'center',
  fontSize: '13px',
  fontWeight: 700,
  color: 'white',
  borderRight: '1px solid rgba(255,255,255,0.2)',
};

const tableCellStyle: React.CSSProperties = {
  padding: '16px 12px',
  textAlign: 'center',
  fontSize: '14px',
  color: BRAND_COLORS.text.secondary,
};
