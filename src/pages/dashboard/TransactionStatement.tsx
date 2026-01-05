import { useState, useRef } from 'react';
import { Download, Printer, Calendar, Building2, Mail, Phone, Package, FileText } from 'lucide-react';

// ============================================
// 거래명세서 컴포넌트 (Transaction Statement Component)
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
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    tertiary: "#F2F4F6",
  },
  border: "#E5E8EB",
};

// ========== 거래 항목 타입 정의 (Transaction Item Type Definition) ==========
interface TransactionItem {
  id: string;
  productCode: string;
  productName: string;
  specification: string;
  quantity: number;
  unitPrice: number;
  supplyAmount: number;
  vat: number;
  totalAmount: number;
  note: string;
}

// ========== 거래명세서 Props ==========
interface TransactionStatementProps {
  onNavigate?: (page: string) => void;
}

// ========== 거래 데이터 (Transaction Data) ==========
const mockTransactionItems: TransactionItem[] = [
  {
    id: '1',
    productCode: 'DOLL-001',
    productName: '커스텀 봉제 인형',
    specification: '30cm / 면 100% / 베이지',
    quantity: 500,
    unitPrice: 15000,
    supplyAmount: 7500000,
    vat: 750000,
    totalAmount: 8250000,
    note: '샘플 확인 완료'
  },
  {
    id: '2',
    productCode: 'KEYRING-002',
    productName: '미니 인형 키링',
    specification: '8cm / 폴리에스터 / 다색',
    quantity: 1000,
    unitPrice: 5000,
    supplyAmount: 5000000,
    vat: 500000,
    totalAmount: 5500000,
    note: ''
  },
  {
    id: '3',
    productCode: 'PKG-001',
    productName: '커스텀 포장 박스',
    specification: '15x15x10cm / 골판지',
    quantity: 500,
    unitPrice: 2000,
    supplyAmount: 1000000,
    vat: 100000,
    totalAmount: 1100000,
    note: ''
  }
];

// ========== 메인 컴포넌트 (Main Component) ==========
export default function TransactionStatement({ onNavigate }: TransactionStatementProps) {
  const [transactionDate] = useState(new Date());
  const [items] = useState<TransactionItem[]>(mockTransactionItems);
  const printRef = useRef<HTMLDivElement>(null);

  // 합계 계산 (Calculate Totals)
  const totalSupplyAmount = items.reduce((sum, item) => sum + item.supplyAmount, 0);
  const totalVat = items.reduce((sum, item) => sum + item.vat, 0);
  const grandTotal = totalSupplyAmount + totalVat;

  // 인쇄 함수 (Print Function)
  const handlePrint = () => {
    window.print();
  };

  // PDF 다운로드 함수 (PDF Download Function)
  const handleDownloadPDF = () => {
    alert('PDF 다운로드 기능은 서버 연동 후 사용 가능합니다.');
  };

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
              거래명세서
            </h1>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
              Transaction Statement
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
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                e.currentTarget.style.backgroundColor = BRAND_COLORS.background.tertiary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BRAND_COLORS.border;
                e.currentTarget.style.backgroundColor = 'white';
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
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 40, 103, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 40, 103, 0.3)';
              }}
            >
              <Download style={{ width: '18px', height: '18px' }} />
              PDF 다운로드
            </button>
          </div>
        </div>

        {/* 거래명세서 본문 (Transaction Statement Body) */}
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
                  fontSize: '24px',
                }}
              >
                🧸
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: BRAND_COLORS.text.primary, margin: 0 }}>
                Qudisom Project
              </h2>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: BRAND_COLORS.secondary, margin: 0 }}>
              거래명세서
            </h1>
          </div>

          {/* 거래 정보 (Transaction Information) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
            {/* 공급자 정보 (Supplier Information) */}
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
                <Building2 style={{ width: '20px', height: '20px' }} />
                공급자 정보
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>상호명</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary, margin: 0 }}>
                    Qudisom Project
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>사업자번호</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    123-45-67890
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>주소</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    서울시 강남구 테헤란로 123
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>
                      <Mail style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                      이메일
                    </p>
                    <p style={{ fontSize: '13px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                      info@qudisom.com
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>
                      <Phone style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                      전화
                    </p>
                    <p style={{ fontSize: '13px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                      02-1234-5678
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 공급받는자 정보 (Recipient Information) */}
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
                <Building2 style={{ width: '20px', height: '20px' }} />
                공급받는자 정보
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>상호명</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary, margin: 0 }}>
                    (주)고객사
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>사업자번호</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    987-65-43210
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>주소</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    서울시 서초구 강남대로 456
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>
                      <Mail style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                      이메일
                    </p>
                    <p style={{ fontSize: '13px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                      client@company.com
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>
                      <Phone style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                      전화
                    </p>
                    <p style={{ fontSize: '13px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                      02-9876-5432
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 거래 일자 및 문서번호 (Transaction Date & Document Number) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              backgroundColor: '#fff8e0',
              borderRadius: '12px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar style={{ width: '18px', height: '18px', color: BRAND_COLORS.secondary }} />
              <span style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary }}>거래일자:</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary }}>
                {transactionDate.toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText style={{ width: '18px', height: '18px', color: BRAND_COLORS.secondary }} />
              <span style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary }}>문서번호:</span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary }}>
                TRS-2024-12-001
              </span>
            </div>
          </div>

          {/* 거래 항목 테이블 (Transaction Items Table) */}
          <div style={{ marginBottom: '32px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: BRAND_COLORS.secondary }}>
                  <th style={{ ...tableHeaderStyle, width: '8%' }}>No.</th>
                  <th style={{ ...tableHeaderStyle, width: '12%' }}>품목코드</th>
                  <th style={{ ...tableHeaderStyle, width: '18%' }}>품목명</th>
                  <th style={{ ...tableHeaderStyle, width: '18%' }}>규격</th>
                  <th style={{ ...tableHeaderStyle, width: '8%' }}>수량</th>
                  <th style={{ ...tableHeaderStyle, width: '12%' }}>단가</th>
                  <th style={{ ...tableHeaderStyle, width: '12%' }}>공급가액</th>
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
                    <td style={tableCellStyle}>{item.quantity.toLocaleString()}</td>
                    <td style={tableCellStyle}>{item.unitPrice.toLocaleString()}원</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{item.supplyAmount.toLocaleString()}원</td>
                    <td style={{ ...tableCellStyle, fontSize: '12px', color: BRAND_COLORS.text.tertiary }}>
                      {item.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 합계 섹션 (Total Section) */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
            <div
              style={{
                width: '400px',
                padding: '24px',
                backgroundColor: BRAND_COLORS.background.secondary,
                borderRadius: '12px',
                border: `2px solid ${BRAND_COLORS.border}`,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary }}>공급가액</span>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: BRAND_COLORS.text.primary }}>
                    {totalSupplyAmount.toLocaleString()}원
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '12px',
                    borderBottom: `1px solid ${BRAND_COLORS.border}`,
                  }}
                >
                  <span style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary }}>부가세 (10%)</span>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: BRAND_COLORS.text.primary }}>
                    {totalVat.toLocaleString()}원
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: BRAND_COLORS.secondary }}>합계금액</span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.secondary }}>
                    {grandTotal.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 안내사항 (Footer Notes) */}
          <div
            style={{
              padding: '20px',
              backgroundColor: BRAND_COLORS.background.tertiary,
              borderRadius: '12px',
              borderLeft: `4px solid ${BRAND_COLORS.primary}`,
            }}
          >
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '12px' }}>
              안내사항
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: BRAND_COLORS.text.secondary, lineHeight: 1.8 }}>
              <li>본 거래명세서는 세금계산서를 대신할 수 없습니다.</li>
              <li>거래 내용에 이의가 있으신 경우 7일 이내에 연락 주시기 바랍니다.</li>
              <li>제품 인수 시 수량 및 품질을 확인해 주시기 바랍니다.</li>
              <li>문의사항: 02-1234-5678 / info@qudisom.com</li>
            </ul>
          </div>

          {/* 서명란 (Signature Section) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '48px' }}>
            <div
              style={{
                padding: '24px',
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '40px' }}>
                공급자
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
                공급받는자
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
