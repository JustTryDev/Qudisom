import { useState } from 'react';
import { Truck, MapPin, Package, CreditCard, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

// ============================================
// 퀵 배송 예약 및 결제 컴포넌트 (Quick Delivery Booking & Payment Component)
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

// ========== 퀵 배송 Props ==========
interface QuickDeliveryBookingProps {
  onNavigate?: (page: string) => void;
}

// ========== 메인 컴포넌트 (Main Component) ==========
export default function QuickDeliveryBooking({ onNavigate }: QuickDeliveryBookingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // 픽업 정보 (Pickup Information)
    pickupAddress: '서울시 강남구 테헤란로 123',
    pickupDetailAddress: 'Qudisom 본사 1층',
    pickupContact: '02-1234-5678',
    pickupName: '김현서',
    
    // 배송 정보 (Delivery Information)
    deliveryAddress: '',
    deliveryDetailAddress: '',
    deliveryContact: '',
    deliveryName: '',
    
    // 화물 정보 (Package Information)
    packageType: 'box',
    packageCount: 1,
    packageWeight: 5,
    deliveryTime: 'immediate',
    
    // 결제 정보 (Payment Information)
    paymentMethod: 'card',
  });

  const [estimatedPrice, setEstimatedPrice] = useState(35000);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 간단한 가격 계산 로직 (Simple price calculation)
    if (field === 'packageWeight' || field === 'deliveryTime') {
      let basePrice = 25000;
      const weight = field === 'packageWeight' ? Number(value) : formData.packageWeight;
      const time = field === 'deliveryTime' ? value : formData.deliveryTime;
      
      if (weight > 10) basePrice += (weight - 10) * 1000;
      if (time === 'immediate') basePrice += 10000;
      if (time === 'scheduled') basePrice += 5000;
      
      setEstimatedPrice(basePrice);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    alert('퀵 배송 예약이 완료되었습니다! (서버 연동 후 실제 예약이 진행됩니다)');
  };

  return (
    <div style={{ backgroundColor: BRAND_COLORS.background.secondary, minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* 헤더 (Header) */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              backgroundColor: BRAND_COLORS.primary,
              borderRadius: '16px',
              marginBottom: '16px',
            }}
          >
            <Truck style={{ width: '32px', height: '32px', color: BRAND_COLORS.text.primary }} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '8px' }}>
            퀵 배송 예약 및 결제
          </h1>
          <p style={{ fontSize: '15px', color: BRAND_COLORS.text.tertiary, margin: 0 }}>
            빠르고 안전한 당일 배송 서비스
          </p>
        </div>

        {/* 진행 단계 표시 (Progress Steps) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            padding: '24px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          {[
            { num: 1, label: '픽업 정보', icon: MapPin },
            { num: 2, label: '배송 정보', icon: Truck },
            { num: 3, label: '화물 정보', icon: Package },
            { num: 4, label: '결제', icon: CreditCard },
          ].map((step, index) => (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: currentStep >= step.num ? BRAND_COLORS.secondary : BRAND_COLORS.background.tertiary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <step.icon
                    style={{
                      width: '20px',
                      height: '20px',
                      color: currentStep >= step.num ? 'white' : BRAND_COLORS.text.tertiary,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: currentStep === step.num ? 600 : 400,
                    color: currentStep >= step.num ? BRAND_COLORS.text.primary : BRAND_COLORS.text.tertiary,
                  }}
                >
                  {step.label}
                </span>
              </div>
              {index < 3 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: currentStep > step.num ? BRAND_COLORS.secondary : BRAND_COLORS.border,
                    marginBottom: '32px',
                    transition: 'all 0.3s ease',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* 메인 컨텐츠 (Main Content) */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            marginBottom: '24px',
          }}
        >
          {/* Step 1: 픽업 정보 (Pickup Information) */}
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '24px' }}>
                픽업 정보 입력
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '8px' }}>
                    픽업 주소 *
                  </label>
                  <input
                    type="text"
                    value={formData.pickupAddress}
                    onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${BRAND_COLORS.border}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '8px' }}>
                    상세 주소
                  </label>
                  <input
                    type="text"
                    value={formData.pickupDetailAddress}
                    onChange={(e) => handleInputChange('pickupDetailAddress', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${BRAND_COLORS.border}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '8px' }}>
                      보내는 분 *
                    </label>
                    <input
                      type="text"
                      value={formData.pickupName}
                      onChange={(e) => handleInputChange('pickupName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${BRAND_COLORS.border}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '8px' }}>
                      연락처 *
                    </label>
                    <input
                      type="text"
                      value={formData.pickupContact}
                      onChange={(e) => handleInputChange('pickupContact', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${BRAND_COLORS.border}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 배송 정보 (Delivery Information) */}
          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '24px' }}>
                배송 정보 입력
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '8px' }}>
                    배송 주소 *
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    placeholder="예: 서울시 서초구 강남대로 456"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${BRAND_COLORS.border}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '8px' }}>
                    상세 주소
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryDetailAddress}
                    onChange={(e) => handleInputChange('deliveryDetailAddress', e.target.value)}
                    placeholder="예: 101동 202호"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `2px solid ${BRAND_COLORS.border}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '8px' }}>
                      받는 분 *
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryName}
                      onChange={(e) => handleInputChange('deliveryName', e.target.value)}
                      placeholder="이름 입력"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${BRAND_COLORS.border}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '8px' }}>
                      연락처 *
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryContact}
                      onChange={(e) => handleInputChange('deliveryContact', e.target.value)}
                      placeholder="010-0000-0000"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${BRAND_COLORS.border}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 화물 정보 (Package Information) */}
          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '24px' }}>
                화물 정보 입력
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '12px' }}>
                    화물 종류 *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    {[
                      { value: 'box', label: '박스' },
                      { value: 'envelope', label: '서류봉투' },
                      { value: 'other', label: '기타' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleInputChange('packageType', type.value)}
                        style={{
                          padding: '16px',
                          border: `2px solid ${formData.packageType === type.value ? BRAND_COLORS.secondary : BRAND_COLORS.border}`,
                          borderRadius: '10px',
                          backgroundColor: formData.packageType === type.value ? `${BRAND_COLORS.secondary}10` : 'white',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: formData.packageType === type.value ? BRAND_COLORS.secondary : BRAND_COLORS.text.secondary,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '8px' }}>
                      화물 개수 *
                    </label>
                    <input
                      type="number"
                      value={formData.packageCount}
                      onChange={(e) => handleInputChange('packageCount', Number(e.target.value))}
                      min="1"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${BRAND_COLORS.border}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '8px' }}>
                      예상 무게 (kg) *
                    </label>
                    <input
                      type="number"
                      value={formData.packageWeight}
                      onChange={(e) => handleInputChange('packageWeight', Number(e.target.value))}
                      min="1"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: `2px solid ${BRAND_COLORS.border}`,
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '12px' }}>
                    배송 시간 *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    {[
                      { value: 'immediate', label: '즉시 배송', extra: '+10,000원' },
                      { value: 'scheduled', label: '시간 지정', extra: '+5,000원' },
                      { value: 'regular', label: '일반 배송', extra: '' },
                    ].map((time) => (
                      <button
                        key={time.value}
                        onClick={() => handleInputChange('deliveryTime', time.value)}
                        style={{
                          padding: '16px',
                          border: `2px solid ${formData.deliveryTime === time.value ? BRAND_COLORS.secondary : BRAND_COLORS.border}`,
                          borderRadius: '10px',
                          backgroundColor: formData.deliveryTime === time.value ? `${BRAND_COLORS.secondary}10` : 'white',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: formData.deliveryTime === time.value ? BRAND_COLORS.secondary : BRAND_COLORS.text.secondary,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                        }}
                      >
                        <span>{time.label}</span>
                        {time.extra && (
                          <span style={{ fontSize: '11px', color: BRAND_COLORS.text.tertiary }}>{time.extra}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: 결제 (Payment) */}
          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: '24px' }}>
                결제 정보
              </h2>
              
              {/* 예상 금액 (Estimated Price) */}
              <div
                style={{
                  padding: '24px',
                  backgroundColor: BRAND_COLORS.background.secondary,
                  borderRadius: '12px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary }}>기본 요금</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary }}>25,000원</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', color: BRAND_COLORS.text.secondary }}>추가 요금</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: BRAND_COLORS.text.primary }}>
                    {(estimatedPrice - 25000).toLocaleString()}원
                  </span>
                </div>
                <div
                  style={{
                    borderTop: `2px solid ${BRAND_COLORS.border}`,
                    paddingTop: '12px',
                    marginTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 700, color: BRAND_COLORS.text.primary }}>총 결제 금액</span>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: BRAND_COLORS.secondary }}>
                    {estimatedPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 결제 방법 선택 (Payment Method) */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: BRAND_COLORS.text.secondary, marginBottom: '12px' }}>
                  결제 방법 선택 *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[
                    { value: 'card', label: '신용/체크카드' },
                    { value: 'transfer', label: '계좌이체' },
                    { value: 'cash', label: '현금결제' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => handleInputChange('paymentMethod', method.value)}
                      style={{
                        padding: '16px',
                        border: `2px solid ${formData.paymentMethod === method.value ? BRAND_COLORS.secondary : BRAND_COLORS.border}`,
                        borderRadius: '10px',
                        backgroundColor: formData.paymentMethod === method.value ? `${BRAND_COLORS.secondary}10` : 'white',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: formData.paymentMethod === method.value ? BRAND_COLORS.secondary : BRAND_COLORS.text.secondary,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 (Bottom Buttons) */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              style={{
                flex: 1,
                padding: '16px',
                backgroundColor: 'white',
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                color: BRAND_COLORS.text.primary,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              이전
            </button>
          )}
          <button
            onClick={currentStep === 4 ? handleSubmit : handleNextStep}
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: BRAND_COLORS.secondary,
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(26, 40, 103, 0.3)',
            }}
          >
            {currentStep === 4 ? '결제하기' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}
