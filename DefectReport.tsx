import { useState, useRef } from 'react';
import { Download, Printer, Calendar, AlertTriangle, Camera, FileText, User } from 'lucide-react';

// ============================================
// 불량 보고서 컴포넌트 (Defect Report Component)
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

// ========== 불량 항목 타입 정의 (Defect Item Type Definition) ==========
interface DefectItem {
  id: string;
  productCode: string;
  productName: string;
  defectType: string;
  defectQuantity: number;
  totalQuantity: number;
  defectRate: number;
  location: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
}

// ========== 불량 보고서 Props ==========
interface DefectReportProps {
  onNavigate?: (page: string) => void;
}

// ========== 불량 데이터 (Defect Data) ==========
const mockDefectItems: DefectItem[] = [
  {
    id: '1',
    productCode: 'DOLL-001',
    productName: '커스텀 봉제 인형',
    defectType: '봉제 불량',
    defectQuantity: 15,
    totalQuantity: 500,
    defectRate: 3.0,
    location: '제작 1공정',
    description: '솔기 벌어짐 현상',
    severity: 'major'
  },
  {
    id: '2',
    productCode: 'KEYRING-002',
    productName: '미니 인형 키링',
    defectType: '색상 불량',
    defectQuantity: 8,
    totalQuantity: 1000,
    defectRate: 0.8,
    location: '제작 2공정',
    description: '색상 번짐',
    severity: 'minor'
  },
  {
    id: '3',
    productCode: 'DOLL-001',
    productName: '커스텀 봉제 인형',
    defectType: '충전재 불량',
    defectQuantity: 3,
    totalQuantity: 500,
    defectRate: 0.6,
    location: '제작 1공정',
    description: '충전재 부족',
    severity: 'critical'
  }
];

// ========== 메인 컴포넌트 (Main Component) ==========
export default function DefectReport({ onNavigate }: DefectReportProps) {
  const [reportDate] = useState(new Date());
  const [items] = useState<DefectItem[]>(mockDefectItems);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF 다운로드 기능은 서버 연동 후 사용 가능합니다.');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'major': return '#f59e0b';
      case 'minor': return '#10b981';
      default: return BRAND_COLORS.text.tertiary;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical': return '치명적';
      case 'major': return '주요';
      case 'minor': return '경미';
      default: return '-';
    }
  };

  const totalDefects = items.reduce((sum, item) => sum + item.defectQuantity, 0);
  const totalProducts = items.reduce((sum, item) => sum + item.totalQuantity, 0);
  const averageDefectRate = totalProducts > 0 ? ((totalDefects / totalProducts) * 100).toFixed(2) : 0;

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
              불량 보고서
            </h1>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
              Defect Report
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

        {/* 불량 보고서 본문 (Defect Report Body) */}
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
          <div style={{ textAlign: 'center', marginBottom: '48px', borderBottom: `3px solid #dc2626`, paddingBottom: '24px' }}>
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
                  backgroundColor: '#fee2e2',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle style={{ width: '28px', height: '28px', color: '#dc2626' }} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: BRAND_COLORS.text.primary, margin: 0 }}>
                Qudisom Project
              </h2>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#dc2626', margin: 0 }}>
              불량 보고서
            </h1>
          </div>

          {/* 보고 정보 (Report Information) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
            {/* 보고서 정보 */}
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
                <FileText style={{ width: '20px', height: '20px' }} />
                보고서 정보
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>보고서 번호</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary, margin: 0 }}>
                    DR-2024-12-001
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>보고일자</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    {reportDate.toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            </div>

            {/* 보고자 정보 */}
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
                보고자
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>부서</p>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary, margin: 0 }}>
                    품질관리팀
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>담당자</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    박지민
                  </p>
                </div>
              </div>
            </div>

            {/* 불량률 요약 */}
            <div
              style={{
                padding: '24px',
                backgroundColor: '#fee2e2',
                borderRadius: '12px',
                border: `2px solid #fca5a5`,
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#dc2626',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertTriangle style={{ width: '20px', height: '20px' }} />
                불량률 요약
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#991b1b', margin: '0 0 4px 0' }}>총 불량 수량</p>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#dc2626', margin: 0 }}>
                    {totalDefects}개
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#991b1b', margin: '0 0 4px 0' }}>평균 불량률</p>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626', margin: 0 }}>
                    {averageDefectRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 불량 항목 테이블 (Defect Items Table) */}
          <div style={{ marginBottom: '32px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#dc2626' }}>
                  <th style={{ ...tableHeaderStyle, width: '6%' }}>No.</th>
                  <th style={{ ...tableHeaderStyle, width: '12%' }}>품목코드</th>
                  <th style={{ ...tableHeaderStyle, width: '15%' }}>품목명</th>
                  <th style={{ ...tableHeaderStyle, width: '12%' }}>불량 유형</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>불량 수량</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>총 수량</th>
                  <th style={{ ...tableHeaderStyle, width: '8%' }}>불량률</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>발생 위치</th>
                  <th style={{ ...tableHeaderStyle, width: '10%' }}>심각도</th>
                  <th style={{ ...tableHeaderStyle, width: '17%' }}>상세 설명</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${BRAND_COLORS.border}` }}>
                    <td style={tableCellStyle}>{index + 1}</td>
                    <td style={tableCellStyle}>{item.productCode}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{item.productName}</td>
                    <td style={tableCellStyle}>{item.defectType}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600, color: '#dc2626' }}>{item.defectQuantity}개</td>
                    <td style={tableCellStyle}>{item.totalQuantity}개</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{item.defectRate}%</td>
                    <td style={tableCellStyle}>{item.location}</td>
                    <td style={tableCellStyle}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: `${getSeverityColor(item.severity)}20`,
                          color: getSeverityColor(item.severity),
                        }}
                      >
                        {getSeverityText(item.severity)}
                      </span>
                    </td>
                    <td style={{ ...tableCellStyle, fontSize: '12px' }}>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 원인 분석 및 조치 사항 (Cause Analysis & Actions) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div
              style={{
                padding: '24px',
                backgroundColor: BRAND_COLORS.background.tertiary,
                borderRadius: '12px',
                borderLeft: `4px solid ${BRAND_COLORS.secondary}`,
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '12px' }}>
                원인 분석
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: BRAND_COLORS.text.secondary, lineHeight: 1.8 }}>
                <li>작업자 숙련도 부족</li>
                <li>자재 품질 기준 미달</li>
                <li>생산 라인 설비 노후화</li>
              </ul>
            </div>

            <div
              style={{
                padding: '24px',
                backgroundColor: BRAND_COLORS.background.tertiary,
                borderRadius: '12px',
                borderLeft: `4px solid ${BRAND_COLORS.primary}`,
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '12px' }}>
                조치 사항
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: BRAND_COLORS.text.secondary, lineHeight: 1.8 }}>
                <li>작업자 재교육 실시</li>
                <li>자재 공급업체 변경 검토</li>
                <li>설비 점검 및 교체 계획 수립</li>
              </ul>
            </div>
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
                보고자
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
                팀장 확인
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
                관리자 승인
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
