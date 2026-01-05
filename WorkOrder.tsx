import { useState, useRef } from 'react';
import { Download, Printer, Calendar, Building2, User, ClipboardCheck, Package, AlertCircle } from 'lucide-react';

// ============================================
// 작업 지시서 컴포넌트 (Work Order Component)
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

// ========== 작업 항목 타입 정의 (Work Item Type Definition) ==========
interface WorkItem {
  id: string;
  productCode: string;
  productName: string;
  specification: string;
  quantity: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

// ========== 작업 지시서 Props ==========
interface WorkOrderProps {
  onNavigate?: (page: string) => void;
}

// ========== 작업 데이터 (Work Data) ==========
const mockWorkItems: WorkItem[] = [
  {
    id: '1',
    productCode: 'DOLL-001',
    productName: '커스텀 봉제 인형',
    specification: '30cm / 면 100% / 베이지',
    quantity: 500,
    deadline: '2024-12-30',
    priority: 'high',
    notes: '샘플 확인 완료, 급한 작업'
  },
  {
    id: '2',
    productCode: 'KEYRING-002',
    productName: '미니 인형 키링',
    specification: '8cm / 폴리에스터 / 다색',
    quantity: 1000,
    deadline: '2025-01-10',
    priority: 'medium',
    notes: '디자인 승인 완료'
  },
  {
    id: '3',
    productCode: 'PKG-001',
    productName: '커스텀 포장 박스',
    specification: '15x15x10cm / 골판지',
    quantity: 500,
    deadline: '2025-01-05',
    priority: 'low',
    notes: ''
  }
];

// ========== 메인 컴포넌트 (Main Component) ==========
export default function WorkOrder({ onNavigate }: WorkOrderProps) {
  const [orderDate] = useState(new Date());
  const [items] = useState<WorkItem[]>(mockWorkItems);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF 다운로드 기능은 서버 연동 후 사용 가능합니다.');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return BRAND_COLORS.text.tertiary;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '긴급';
      case 'medium': return '보통';
      case 'low': return '낮음';
      default: return '-';
    }
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
              작업 지시서
            </h1>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
              Work Order
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

        {/* 작업 지시서 본문 (Work Order Body) */}
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
              작업 지시서
            </h1>
          </div>

          {/* 기본 정보 (Basic Information) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
            {/* 발행 정보 (Issue Information) */}
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
                <ClipboardCheck style={{ width: '20px', height: '20px' }} />
                발행 정보
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>지시서 번호</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary, margin: 0 }}>
                    WO-2024-12-001
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>발행일자</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    {orderDate.toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>발행자</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    생산관리팀 김현서
                  </p>
                </div>
              </div>
            </div>

            {/* 작업 담당자 정보 (Worker Information) */}
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
                <User style={{ width: '20px', height: '20px' }} />
                작업 담당자
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>담당 부서</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary, margin: 0 }}>
                    제작 1팀
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>팀장</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    이철수
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
          </div>

          {/* 작업 항목 테이블 (Work Items Table) */}
          <div style={{ marginBottom: '32px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: BRAND_COLORS.secondary }}>
                  <th style={{ ...tableHeaderStyle, width: '8%' }}>No.</th>
                  <th style={{ ...tableHeaderStyle, width: '12%' }}>품목코드</th>
                  <th style={{ ...tableHeaderStyle, width: '18%' }}>품목명</th>
                  <th style={{ ...tableHeaderStyle, width: '20%' }}>규격</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>수량</th>
                  <th style={{ ...tableHeaderStyle, width: '12%' }}>납기일</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>우선순위</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>비고</th>
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
                    <td style={tableCellStyle}>{new Date(item.deadline).toLocaleDateString('ko-KR')}</td>
                    <td style={tableCellStyle}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: `${getPriorityColor(item.priority)}20`,
                          color: getPriorityColor(item.priority),
                        }}
                      >
                        {getPriorityText(item.priority)}
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, fontSize: '12px', color: BRAND_COLORS.text.tertiary }}>
                      {item.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 주의사항 (Caution) */}
          <div
            style={{
              padding: '20px',
              backgroundColor: '#fff3cd',
              borderRadius: '12px',
              borderLeft: `4px solid #f59e0b`,
              marginBottom: '32px',
            }}
          >
            <h4
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: BRAND_COLORS.text.primary,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              주의사항
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: BRAND_COLORS.text.secondary, lineHeight: 1.8 }}>
              <li>작업 시작 전 모든 자재 및 도구를 확인해 주세요.</li>
              <li>우선순위가 높은 작업부터 진행해 주시기 바랍니다.</li>
              <li>품질 기준을 반드시 준수하며 작업해 주세요.</li>
              <li>불량 발생 시 즉시 담당자에게 보고해 주세요.</li>
              <li>작업 완료 후 반드시 검수를 받아야 합니다.</li>
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
                지시자
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
                작업 담당자
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
                검수자
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
