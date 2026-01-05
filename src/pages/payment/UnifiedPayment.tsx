// 통합 결제 페이지 메인 컨테이너 (Unified Payment Main Container)
// 토스 스타일의 미니멀하고 깔끔한 디자인 적용

import React, { useCallback, useMemo } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
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

  // 테스트 모드 감지: URL 파라미터 ?test=true (Detect test mode)
  // 개발 중 검증을 스킵하고 빠르게 화면 전환을 테스트할 수 있음
  const isTestMode = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('test') === 'true';
  }, [location.search]);

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
    // 분할 결제자 관련 (Split payor related)
    addSplitPayor,
    updateSplitPayor,
    removeSplitPayor,
    // 🆕 일정별 결제자 배분 관련 (Schedule payor allocation related)
    addAllocation,
    updateAllocation,
    removeAllocation,
    // 분할 결제자 결제 수단 관련 (Split payor method related)
    addSplitPayorMethod,
    updateSplitPayorMethod,
    removeSplitPayorMethod,
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
    <div className={cn('min-h-screen bg-[#f7f8fa]', className)}>
      {/* 헤더 (Header) - 토스 스타일 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={handleBack}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-xl hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">
                {currentStep > 1 ? '이전' : ''}
              </span>
            </motion.button>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#1a2867]/5">
                <CreditCard className="h-5 w-5 text-[#1a2867]" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">결제하기</h1>
            </div>

            <div className="w-16" /> {/* Spacer for centering */}
          </div>

          {/* 스텝 진행 표시 (Step Progress) */}
          <div className="mt-4 pb-1">
            <StepProgress
              steps={stepStatuses}
              currentStep={currentStep}
            />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 (Main Content) */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* 테스트 모드 안내 배너 (Test Mode Banner) - 토스 스타일 */}
        {isTestMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-amber-50 border border-amber-100 p-4 flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-sm text-amber-700">
              <span className="font-semibold">테스트 모드</span> — 검증 없이 스킵할 수 있습니다
            </p>
          </motion.div>
        )}

        {/* Step 1: 결제 일정 (Payment Schedule) */}
        <ScheduleStep
          schedules={payment.schedules}
          totalOrderAmount={orderAmount}
          onSchedulesChange={setSchedules}
          onComplete={handleScheduleComplete}
          onEdit={() => handleEditStep(1)}
          isActive={currentStep === 1}
          isCompleted={stepStatuses[0].isCompleted}
          testMode={isTestMode}
        />

        {/* Step 2: 결제 주체 (Payor Info) */}
        <PayorStep
          payorMode={payment.payorMode}
          singlePayor={payment.singlePayor}
          splitPayors={payment.splitPayors}
          schedules={payment.schedules}
          totalOrderAmount={orderAmount}
          savedPayors={savedPayors}
          allocations={payment.schedulePayorAllocations}
          onAddAllocation={addAllocation}
          onUpdateAllocation={updateAllocation}
          onRemoveAllocation={removeAllocation}
          onPayorModeChange={setPayorMode}
          onSinglePayorChange={setSinglePayor}
          onSchedulePayorChange={setSchedulePayor}
          onAddSplitPayor={addSplitPayor}
          onUpdateSplitPayor={updateSplitPayor}
          onRemoveSplitPayor={removeSplitPayor}
          savePayor={savePayor}
          onSavePayorChange={setSavePayor}
          onComplete={handlePayorComplete}
          onPrev={() => handlePrevStep(2)}
          onEdit={() => handleEditStep(2)}
          isActive={currentStep === 2}
          isCompleted={stepStatuses[1].isCompleted}
          testMode={isTestMode}
        />

        {/* Step 3: 결제 수단 + 증빙 (Payment Method + Proof) */}
        <MethodStep
          schedules={payment.schedules}
          payorMode={payment.payorMode}
          splitPayors={payment.splitPayors}
          onAddMethod={addPaymentMethod}
          onUpdateMethod={updatePaymentMethod}
          onRemoveMethod={removePaymentMethod}
          onAddSplitPayorMethod={addSplitPayorMethod}
          onUpdateSplitPayorMethod={updateSplitPayorMethod}
          onRemoveSplitPayorMethod={removeSplitPayorMethod}
          onSetProof={setProof}
          onComplete={handleMethodComplete}
          onPrev={() => handlePrevStep(3)}
          onEdit={() => handleEditStep(3)}
          isActive={currentStep === 3}
          isCompleted={stepStatuses[2].isCompleted}
          testMode={isTestMode}
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

      {/* 하단 안내 (Footer Notice) - 토스 스타일 */}
      <footer className="max-w-3xl mx-auto px-4 py-12 text-center space-y-2">
        <p className="text-xs text-gray-400">
          결제 관련 문의
        </p>
        <p className="text-sm font-medium text-gray-500">
          contact@qudisom.com
        </p>
      </footer>
    </div>
  );
}

export default UnifiedPayment;
