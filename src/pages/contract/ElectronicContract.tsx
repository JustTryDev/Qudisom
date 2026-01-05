import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Printer, FileSignature, Calendar, Building2, Check, AlertCircle } from 'lucide-react';

// ============================================
// 전자 계약서 컴포넌트 (Electronic Contract Component)
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

// ========== 전자 계약서 Props ==========
interface ElectronicContractProps {
  onNavigate?: (page: string) => void;
}

// ========== 메인 컴포넌트 (Main Component) ==========
export default function ElectronicContract({ onNavigate }: ElectronicContractProps) {
  const navigate = useNavigate();
  
  const [contractDate] = useState(new Date());
  const [isSigned, setIsSigned] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState({
    term1: false,
    term2: false,
    term3: false,
  });
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF 다운로드 기능은 서버 연동 후 사용 가능합니다.');
  };

  const handleSign = () => {
    if (!agreedTerms.term1 || !agreedTerms.term2 || !agreedTerms.term3) {
      alert('모든 약관에 동의해주세요.');
      return;
    }
    setIsSigned(true);
    alert('전자 서명이 완료되었습니다!');
    
    // 전자 계약 완료 후 → 배송 정보 입력 페이지로 이동
    // After electronic contract is signed → Navigate to Shipping Info page
    navigate('/shipping-design');
  };

  const allTermsAgreed = agreedTerms.term1 && agreedTerms.term2 && agreedTerms.term3;

  return (
    <div style={{ backgroundColor: BRAND_COLORS.background.secondary, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
              전자 계약서
            </h1>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
              Electronic Contract
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

        {/* 전자 계약서 본문 (Electronic Contract Body) */}
        <div
          ref={printRef}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '48px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            marginBottom: '24px',
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
              제작 계약서
            </h1>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary, marginTop: '8px', margin: 0 }}>
              (Manufacturing Contract)
            </p>
          </div>

          {/* 계약 당사자 정보 (Contract Parties Information) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
            {/* 공급자 (갑) */}
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
                공급자 (갑)
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
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>대표자</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    김현서
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>주소</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    서울시 강남구 테헤란로 123
                  </p>
                </div>
              </div>
            </div>

            {/* 발주자 (을) */}
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
                발주자 (을)
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
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>대표자</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    이영희
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: BRAND_COLORS.text.tertiary, margin: '0 0 4px 0' }}>주소</p>
                  <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, margin: 0 }}>
                    서울시 서초구 강남대로 456
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 계약 내용 (Contract Details) */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '20px' }}>
              제1조 (계약 목적)
            </h3>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, lineHeight: 1.8, marginBottom: '24px' }}>
              본 계약은 갑이 을에게 주문한 제품의 제작 및 납품에 관한 조건을 명확히 하고, 상호간의 권리와 의무를 규정함을 목적으로 한다.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '20px' }}>
              제2조 (계약 금액 및 지급 방법)
            </h3>
            <div
              style={{
                padding: '20px',
                backgroundColor: BRAND_COLORS.background.tertiary,
                borderRadius: '12px',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary }}>계약 금액</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: BRAND_COLORS.text.primary }}>
                  14,850,000원
                </span>
              </div>
              <div style={{ fontSize: '13px', color: BRAND_COLORS.text.tertiary, lineHeight: 1.6 }}>
                <p style={{ margin: '0 0 8px 0' }}>• 선급금: 계약 금액의 30% (계약 체결 시)</p>
                <p style={{ margin: '0 0 8px 0' }}>• 중도금: 계약 금액의 40% (샘플 승인 시)</p>
                <p style={{ margin: 0 }}>• 잔금: 계약 금액의 30% (납품 완료 시)</p>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '20px' }}>
              제3조 (제작 기간 및 납품)
            </h3>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, lineHeight: 1.8, marginBottom: '24px' }}>
              1. 제작 기간: 계약 체결일로부터 45일<br />
              2. 납품 장소: 을이 지정한 장소<br />
              3. 납품 방법: 갑의 책임 하에 배송
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '20px' }}>
              제4조 (품질 보증)
            </h3>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, lineHeight: 1.8, marginBottom: '24px' }}>
              갑은 제품의 품질을 보증하며, 불량품 발견 시 무상으로 교체 또는 수리한다. 품질 보증 기간은 납품일로부터 6개월로 한다.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '20px' }}>
              제5조 (계약 해지)
            </h3>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, lineHeight: 1.8, marginBottom: '24px' }}>
              쌍방은 상대방이 계약 내용을 위반하고 이를 시정하지 않을 경우, 서면 통보 후 본 계약을 해지할 수 있다.
            </p>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '20px' }}>
              제6조 (기타 사항)
            </h3>
            <p style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary, lineHeight: 1.8, marginBottom: '24px' }}>
              본 계약서에 명시되지 않은 사항은 상호 협의하에 결정하며, 분쟁 발생 시에는 대한민국 법률에 따른다.
            </p>
          </div>

          {/* 계약 일자 (Contract Date) */}
          <div
            style={{
              padding: '20px',
              backgroundColor: '#fff8e0',
              borderRadius: '12px',
              marginBottom: '32px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Calendar style={{ width: '18px', height: '18px', color: BRAND_COLORS.secondary }} />
              <span style={{ fontSize: '14px', color: BRAND_COLORS.text.tertiary }}>계약 체결일:</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: BRAND_COLORS.text.primary }}>
                {contractDate.toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>

          {/* 서명란 (Signature Section) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div
              style={{
                padding: '32px',
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '16px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '48px' }}>
                공급자 (갑)
              </p>
              <div
                style={{
                  height: '80px',
                  borderBottom: `2px solid ${BRAND_COLORS.border}`,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isSigned && (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#d1fae5',
                        borderRadius: '50%',
                        marginBottom: '8px',
                      }}
                    >
                      <Check style={{ width: '32px', height: '32px', color: '#10b981' }} />
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#10b981', margin: 0 }}>
                      서명 완료
                    </p>
                  </div>
                )}
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '4px' }}>
                Qudisom Project
              </p>
              <p style={{ fontSize: '13px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
                대표이사 김현서 (인)
              </p>
            </div>

            <div
              style={{
                padding: '32px',
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '16px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '48px' }}>
                발주자 (을)
              </p>
              <div
                style={{
                  height: '80px',
                  borderBottom: `2px solid ${BRAND_COLORS.border}`,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isSigned && (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#d1fae5',
                        borderRadius: '50%',
                        marginBottom: '8px',
                      }}
                    >
                      <Check style={{ width: '32px', height: '32px', color: '#10b981' }} />
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#10b981', margin: 0 }}>
                      서명 완료
                    </p>
                  </div>
                )}
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '4px' }}>
                (주)고객사
              </p>
              <p style={{ fontSize: '13px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
                대표이사 이영희 (인)
              </p>
            </div>
          </div>
        </div>

        {/* 전자 서명 섹션 (Electronic Signature Section) */}
        {!isSigned && (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '24px' }}>
              전자 서명
            </h3>

            {/* 약관 동의 (Terms Agreement) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: BRAND_COLORS.background.secondary,
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={agreedTerms.term1}
                  onChange={(e) => setAgreedTerms(prev => ({ ...prev, term1: e.target.checked }))}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary }}>
                  계약 내용을 모두 확인하였으며 이에 동의합니다.
                </span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: BRAND_COLORS.background.secondary,
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={agreedTerms.term2}
                  onChange={(e) => setAgreedTerms(prev => ({ ...prev, term2: e.target.checked }))}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary }}>
                  전자 서명의 법적 효력에 대해 이해하고 동의합니다.
                </span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: BRAND_COLORS.background.secondary,
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={agreedTerms.term3}
                  onChange={(e) => setAgreedTerms(prev => ({ ...prev, term3: e.target.checked }))}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary }}>
                  개인정보 처리방침 및 이용약관에 동의합니다.
                </span>
              </label>
            </div>

            {/* 서명 버튼 (Sign Button) */}
            <button
              onClick={handleSign}
              disabled={!allTermsAgreed}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: allTermsAgreed ? BRAND_COLORS.secondary : BRAND_COLORS.border,
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 600,
                color: 'white',
                cursor: allTermsAgreed ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: allTermsAgreed ? '0 4px 12px rgba(26, 40, 103, 0.3)' : 'none',
              }}
            >
              <FileSignature style={{ width: '20px', height: '20px' }} />
              전자 서명하기
            </button>

            {!allTermsAgreed && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#fff3cd',
                  borderRadius: '8px',
                }}
              >
                <AlertCircle style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
                <span style={{ fontSize: '13px', color: '#92400e' }}>
                  모든 약관에 동의해야 서명할 수 있습니다.
                </span>
              </div>
            )}
          </div>
        )}

        {/* 서명 완료 메시지 (Signature Completed Message) */}
        {isSigned && (
          <div
            style={{
              backgroundColor: '#d1fae5',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                marginBottom: '16px',
              }}
            >
              <Check style={{ width: '32px', height: '32px', color: 'white' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#065f46', marginBottom: '8px' }}>
              전자 서명이 완료되었습니다!
            </h3>
            <p style={{ fontSize: '14px', color: '#047857', margin: 0 }}>
              계약서가 성공적으로 체결되었습니다. 이메일로 계약서 사본이 발송됩니다.
            </p>
          </div>
        )}
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
