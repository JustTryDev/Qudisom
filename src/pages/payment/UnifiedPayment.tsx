// 통합 결제 페이지 메인 컨테이너 (Unified Payment Main Container)

import React, { useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

import { usePaymentState } from './hooks/usePaymentState';
import { StepProgress } from './components/steps/StepCard';
import { ScheduleStep } from './components/steps/ScheduleStep';
import { PayorStep } from './components/steps/PayorStep';
import { MethodStep } from './components/steps/MethodStep';
import { ConfirmStep } from './components/steps/ConfirmStep';

import type { PaymentSchedule, PayorInfo, PaymentMethod, ProofDocument } from './types';

interface UnifiedPaymentProps {
  // 주문 정보 (Order Info) - 실제 구현 시 props 또는 context로 전달
  orderId?: string;
  orderAmount?: number;
  className?: string;
}

export function UnifiedPayment({
  orderId,
  orderAmount = 1000000, // 기본값 100만원 (테스트용)
  className,
}: UnifiedPaymentProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // 상태 관리 훅 (State management hook)
  const {
    currentStep,
    payment,
    stepStatuses,
    isSubmitting,
    errors,
    goToStep,
    completeStep,
    editStep,
    setSchedules,
    addSchedule,
    updateSchedule,
    removeSchedule,
    setPayorMode,
    setSinglePayor,
    setSchedulePayor,
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setProof,
    setUseDeposit,
    setDepositAmount,
    setSubmitting,
    totalAmount,
    hasDeferred,
  } = usePaymentState();

  // 저장된 결제자 정보 (Saved payor info) - 실제 구현 시 로컬스토리지 또는 API에서 가져오기
  const [savePayor, setSavePayor] = React.useState(false);
  const savedPayors = useMemo(() => {
    // TODO: 로컬스토리지 또는 API에서 가져오기
    return [];
  }, []);

  // 스텝 완료 핸들러 (Step completion handlers)
  const handleScheduleComplete = useCallback(() => {
    completeStep(1);
  }, [completeStep]);

  const handlePayorComplete = useCallback(() => {
    completeStep(2);
  }, [completeStep]);

  const handleMethodComplete = useCallback(() => {
    // Step 4 (증빙)는 Step 3에 통합되어 있으므로 바로 Step 5로
    completeStep(3);
    goToStep(5);
  }, [completeStep, goToStep]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      // TODO: 실제 결제 처리 API 호출
      console.log('Payment submission:', payment);

      // 결제자 정보 저장 (Save payor info)
      if (savePayor && payment.singlePayor) {
        // TODO: 로컬스토리지 또는 API에 저장
        console.log('Saving payor info:', payment.singlePayor);
      }

      // 성공 시 완료 페이지로 이동
      // navigate('/payment/complete', { state: { orderId, payment } });
      alert('결제가 완료되었습니다!'); // 임시 알림
    } catch (error) {
      console.error('Payment error:', error);
      // TODO: 에러 처리
    } finally {
      setSubmitting(false);
    }
  }, [payment, savePayor, setSubmitting]);

  // 이전 스텝으로 이동 (Go to previous step)
  const handlePrevStep = useCallback(
    (step: number) => {
      if (step > 1) {
        goToStep((step - 1) as 1 | 2 | 3 | 4 | 5);
      }
    },
    [goToStep]
  );

  // 스텝 수정 (Edit step)
  const handleEditStep = useCallback(
    (step: number) => {
      editStep(step as 1 | 2 | 3 | 4 | 5);
    },
    [editStep]
  );

  // 뒤로가기 (Go back)
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      handlePrevStep(currentStep);
    } else {
      navigate(-1);
    }
  }, [currentStep, handlePrevStep, navigate]);

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* 헤더 (Header) */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">
                {currentStep > 1 ? '이전' : '돌아가기'}
              </span>
            </button>

            <h1 className="text-lg font-semibold text-gray-900">결제 정보 입력</h1>

            <div className="w-20" /> {/* Spacer for centering */}
          </div>

          {/* 스텝 진행 표시 (Step Progress) */}
          <div className="mt-4">
            <StepProgress
              steps={stepStatuses}
              currentStep={currentStep}
            />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 (Main Content) */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Step 1: 결제 일정 (Payment Schedule) */}
        <ScheduleStep
          schedules={payment.schedules}
          totalOrderAmount={orderAmount}
          onSchedulesChange={setSchedules}
          onComplete={handleScheduleComplete}
          onEdit={() => handleEditStep(1)}
          isActive={currentStep === 1}
          isCompleted={stepStatuses[0].isCompleted}
        />

        {/* Step 2: 결제 주체 (Payor Info) */}
        <PayorStep
          payorMode={payment.payorMode}
          singlePayor={payment.singlePayor}
          schedules={payment.schedules}
          savedPayors={savedPayors}
          onPayorModeChange={setPayorMode}
          onSinglePayorChange={setSinglePayor}
          onSchedulePayorChange={setSchedulePayor}
          savePayor={savePayor}
          onSavePayorChange={setSavePayor}
          onComplete={handlePayorComplete}
          onPrev={() => handlePrevStep(2)}
          onEdit={() => handleEditStep(2)}
          isActive={currentStep === 2}
          isCompleted={stepStatuses[1].isCompleted}
        />

        {/* Step 3: 결제 수단 + 증빙 (Payment Method + Proof) */}
        <MethodStep
          schedules={payment.schedules}
          onAddMethod={addPaymentMethod}
          onUpdateMethod={updatePaymentMethod}
          onRemoveMethod={removePaymentMethod}
          onSetProof={setProof}
          onComplete={handleMethodComplete}
          onPrev={() => handlePrevStep(3)}
          onEdit={() => handleEditStep(3)}
          isActive={currentStep === 3}
          isCompleted={stepStatuses[2].isCompleted}
        />

        {/* Step 5: 최종 확인 (Final Confirmation) */}
        <ConfirmStep
          payment={payment}
          totalOrderAmount={orderAmount}
          useDeposit={payment.useDeposit}
          depositAmount={payment.depositAmount}
          availableDeposit={payment.availableDeposit}
          onUseDepositChange={setUseDeposit}
          onDepositAmountChange={setDepositAmount}
          onSubmit={handleSubmit}
          onPrev={() => handlePrevStep(5)}
          isSubmitting={isSubmitting}
          isActive={currentStep === 5}
          isCompleted={stepStatuses[4].isCompleted}
        />
      </main>

      {/* 하단 안내 (Footer Notice) */}
      <footer className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-xs text-gray-400">
          결제 관련 문의: contact@qudisom.com
        </p>
      </footer>
    </div>
  );
}

export default UnifiedPayment;
