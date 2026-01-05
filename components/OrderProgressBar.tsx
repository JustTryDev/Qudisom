import { Check } from 'lucide-react';

interface OrderProgressBarProps {
  currentStep: 1 | 2 | 3;
}

export function OrderProgressBar({ currentStep }: OrderProgressBarProps) {
  // 단계별 라벨 동적 설정
  const getStepLabel = (stepNumber: number) => {
    if (stepNumber === 1) {
      // 1단계: currentStep이 2 이상이면 "견적 승인"
      return currentStep >= 2 ? '견적 승인' : '견적 확인';
    } else if (stepNumber === 2) {
      // 2단계: currentStep이 3이면 "결제 정보 입력 완료"
      return currentStep >= 3 ? '결제 정보 입력 완료' : '결제 정보 입력';
    } else {
      // 3단계
      return '배송 정보 입력';
    }
  };

  const steps = [
    { number: 1, label: getStepLabel(1) },
    { number: 2, label: getStepLabel(2) },
    { number: 3, label: getStepLabel(3) }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 md:mb-12">
      <div className="flex items-center justify-between relative">
        {/* 연결선 배경 */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" style={{ marginLeft: '2.5rem', marginRight: '2.5rem' }} />
        
        {/* 진행된 부분 연결선 */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-[#fab803] transition-all duration-500 ease-in-out"
          style={{ 
            marginLeft: '2.5rem',
            width: currentStep === 1 ? '0%' : currentStep === 2 ? 'calc(50% - 2.5rem)' : 'calc(100% - 5rem)'
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isPending = currentStep < step.number;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10" style={{ flex: 1 }}>
              {/* 원형 스텝 인디케이터 */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-[#fab803] text-white shadow-lg shadow-[#fab803]/30' : ''}
                  ${isCurrent ? 'bg-[#fab803] text-white shadow-xl shadow-[#fab803]/40 scale-110' : ''}
                  ${isPending ? 'bg-white border-2 border-border text-muted-foreground' : ''}
                `}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className={isCurrent ? 'font-semibold' : ''}>{step.number}</span>
                )}
              </div>

              {/* 스텝 라벨 */}
              <div className="mt-2 md:mt-3 text-center">
                <p
                  className={`
                    text-xs md:text-sm transition-all duration-300
                    ${isCurrent ? 'text-[#fab803] font-medium' : ''}
                    ${isCompleted ? 'text-foreground' : ''}
                    ${isPending ? 'text-muted-foreground' : ''}
                  `}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
