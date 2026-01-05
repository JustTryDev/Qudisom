import { useState } from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Search, Filter } from 'lucide-react';

// ============================================
// 입고 현황 컴포넌트 (Inventory Status Component)
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

// ========== 입고 항목 타입 정의 (Inventory Item Type Definition) ==========
interface InventoryItem {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  receivedDate: string;
  quantity: number;
  previousStock: number;
  currentStock: number;
  supplier: string;
  status: 'completed' | 'inspecting' | 'defective';
  location: string;
}

// ========== 입고 현황 Props ==========
interface InventoryStatusProps {
  onNavigate?: (page: string) => void;
}

// ========== 입고 데이터 (Inventory Data) ==========
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    productCode: 'DOLL-001',
    productName: '커스텀 봉제 인형',
    category: '봉제 인형',
    receivedDate: '2024-12-18',
    quantity: 500,
    previousStock: 200,
    currentStock: 700,
    supplier: 'A 제조사',
    status: 'completed',
    location: '창고 A-01'
  },
  {
    id: '2',
    productCode: 'KEYRING-002',
    productName: '미니 인형 키링',
    category: '키링',
    receivedDate: '2024-12-18',
    quantity: 1000,
    previousStock: 300,
    currentStock: 1300,
    supplier: 'B 제조사',
    status: 'inspecting',
    location: '창고 A-02'
  },
  {
    id: '3',
    productCode: 'FABRIC-001',
    productName: '면 원단',
    category: '원자재',
    receivedDate: '2024-12-17',
    quantity: 100,
    previousStock: 50,
    currentStock: 145,
    supplier: 'C 원자재',
    status: 'defective',
    location: '창고 B-01'
  },
  {
    id: '4',
    productCode: 'PKG-001',
    productName: '커스텀 포장 박스',
    category: '포장재',
    receivedDate: '2024-12-17',
    quantity: 500,
    previousStock: 100,
    currentStock: 600,
    supplier: 'D 포장재',
    status: 'completed',
    location: '창고 C-01'
  }
];

// ========== 메인 컴포넌트 (Main Component) ==========
export default function InventoryStatus({ onNavigate }: InventoryStatusProps) {
  const [items] = useState<InventoryItem[]>(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'inspecting': return '#f59e0b';
      case 'defective': return '#ef4444';
      default: return BRAND_COLORS.text.tertiary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '입고 완료';
      case 'inspecting': return '검수 중';
      case 'defective': return '불량';
      default: return '-';
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.productCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalReceived = items.reduce((sum, item) => sum + item.quantity, 0);
  const completedCount = items.filter(item => item.status === 'completed').length;
  const inspectingCount = items.filter(item => item.status === 'inspecting').length;
  const defectiveCount = items.filter(item => item.status === 'defective').length;

  return (
    <div style={{ backgroundColor: BRAND_COLORS.background.secondary, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* 헤더 (Header) */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '8px' }}>
            입고 현황
          </h1>
          <p style={{ fontSize: '15px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
            실시간 재고 입고 현황을 확인하세요
          </p>
        </div>

        {/* 요약 카드 (Summary Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div
            style={{
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary }}>총 입고 수량</span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: `${BRAND_COLORS.secondary}20`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Package style={{ width: '20px', height: '20px', color: BRAND_COLORS.secondary }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: BRAND_COLORS.text.primary, margin: 0 }}>
              {totalReceived.toLocaleString()}
            </p>
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary }}>입고 완료</span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#d1fae520',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10b981' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#10b981', margin: 0 }}>
              {completedCount}건
            </p>
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary }}>검수 중</span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#fef3c720',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUp style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b', margin: 0 }}>
              {inspectingCount}건
            </p>
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary }}>불량</span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#fee2e220',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertTriangle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444', margin: 0 }}>
              {defectiveCount}건
            </p>
          </div>
        </div>

        {/* 검색 및 필터 (Search & Filter) */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ flex: 1, position: 'relative' }}>
            <Search
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: BRAND_COLORS.text.tertiary,
              }}
            />
            <input
              type="text"
              placeholder="품목명 또는 품목코드로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 44px',
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { value: 'all', label: '전체' },
              { value: 'completed', label: '완료' },
              { value: 'inspecting', label: '검수 중' },
              { value: 'defective', label: '불량' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                style={{
                  padding: '12px 20px',
                  border: `2px solid ${filterStatus === filter.value ? BRAND_COLORS.secondary : BRAND_COLORS.border}`,
                  borderRadius: '10px',
                  backgroundColor: filterStatus === filter.value ? `${BRAND_COLORS.secondary}10` : 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: filterStatus === filter.value ? BRAND_COLORS.secondary : BRAND_COLORS.text.secondary,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* 입고 현황 테이블 (Inventory Status Table) */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            overflow: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: BRAND_COLORS.background.secondary }}>
                <th style={tableHeaderStyle}>품목코드</th>
                <th style={tableHeaderStyle}>품목명</th>
                <th style={tableHeaderStyle}>카테고리</th>
                <th style={tableHeaderStyle}>입고일자</th>
                <th style={tableHeaderStyle}>입고수량</th>
                <th style={tableHeaderStyle}>이전재고</th>
                <th style={tableHeaderStyle}>현재재고</th>
                <th style={tableHeaderStyle}>공급업체</th>
                <th style={tableHeaderStyle}>보관위치</th>
                <th style={tableHeaderStyle}>상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const stockChange = item.currentStock - item.previousStock;
                const isIncrease = stockChange > 0;
                
                return (
                  <tr key={item.id} style={{ borderBottom: `1px solid ${BRAND_COLORS.border}` }}>
                    <td style={tableCellStyle}>{item.productCode}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600 }}>{item.productName}</td>
                    <td style={tableCellStyle}>{item.category}</td>
                    <td style={tableCellStyle}>{new Date(item.receivedDate).toLocaleDateString('ko-KR')}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 600, color: BRAND_COLORS.secondary }}>
                      {item.quantity.toLocaleString()}
                    </td>
                    <td style={tableCellStyle}>{item.previousStock.toLocaleString()}</td>
                    <td style={tableCellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600 }}>{item.currentStock.toLocaleString()}</span>
                        {isIncrease ? (
                          <TrendingUp style={{ width: '16px', height: '16px', color: '#10b981' }} />
                        ) : (
                          <TrendingDown style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                        )}
                      </div>
                    </td>
                    <td style={tableCellStyle}>{item.supplier}</td>
                    <td style={tableCellStyle}>{item.location}</td>
                    <td style={tableCellStyle}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: `${getStatusColor(item.status)}20`,
                          color: getStatusColor(item.status),
                        }}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Package style={{ width: '48px', height: '48px', color: BRAND_COLORS.text.tertiary, margin: '0 auto 16px' }} />
              <p style={{ fontSize: '15px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
                검색 결과가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========== 테이블 스타일 (Table Styles) ==========
const tableHeaderStyle: React.CSSProperties = {
  padding: '16px 12px',
  textAlign: 'center',
  fontSize: '13px',
  fontWeight: 700,
  color: BRAND_COLORS.text.primary,
  borderBottom: `2px solid ${BRAND_COLORS.border}`,
};

const tableCellStyle: React.CSSProperties = {
  padding: '16px 12px',
  textAlign: 'center',
  fontSize: '14px',
  color: BRAND_COLORS.text.secondary,
};
