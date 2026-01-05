import { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronDown, ChevronUp, ArrowRight, Info, Sparkles, Trash2, Plus, Check, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DeliveryScenarioSectionProps {
  targetDeliveryDate: string;
  actualDeliveryDate: string;
  initialSampleDeliveryMethod: 'photo' | 'physical';
  mainProductionType: 'standard' | 'express' | 'normal';
  onTargetDateChange: (date: string) => void;
  onActualDateChange: (date: string) => void;
  onInitialMethodChange: (method: 'photo' | 'physical') => void;
  onMainTypeChange: (type: 'standard' | 'express' | 'normal') => void;
}

// Alert Box Component
const AlertBox = ({ type, children }: { type: 'info' | 'warning' | 'error'; children: React.ReactNode }) => {
  const colors = {
    info: 'bg-blue-50 border-blue-100 text-blue-800',
    warning: 'bg-amber-50 border-amber-100 text-amber-800',
    error: 'bg-red-50 border-red-300 text-red-800'
  };
  
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${colors[type]}`}>
      <div className="text-sm">{children}</div>
    </div>
  );
};

// Timeline Item Component
const TimelineItem = ({ label, weeks, color, cumulativeWeeks }: { label: string; weeks: number; color: string; cumulativeWeeks?: number }) => {
  const getEstimatedDate = () => {
    if (cumulativeWeeks === undefined) return '';
    const today = new Date();
    const estimatedDate = new Date(today.getTime() + cumulativeWeeks * 7 * 24 * 60 * 60 * 1000);
    const year = String(estimatedDate.getFullYear()).slice(2);
    const month = String(estimatedDate.getMonth() + 1).padStart(2, '0');
    const day = String(estimatedDate.getDate()).padStart(2, '0');
    return ` (~${year}/${month}/${day})`;
  };
  
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-sm text-gray-900">
        +약 {weeks}주{getEstimatedDate()}
      </span>
    </div>
  );
};

export function DeliveryScenarioSection({
  targetDeliveryDate,
  actualDeliveryDate,
  initialSampleDeliveryMethod,
  mainProductionType,
  onTargetDateChange,
  onActualDateChange,
  onInitialMethodChange,
  onMainTypeChange
}: DeliveryScenarioSectionProps) {
  const [deliverySimOpen, setDeliverySimOpen] = useState(false);
  const [sampleRevisions, setSampleRevisions] = useState<Array<{id: number, deliveryMethod: 'photo' | 'physical'}>>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [isManuallyModified, setIsManuallyModified] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [scenarioTab, setScenarioTab] = useState<'normal' | 'express'>('normal');
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [initialSampleCollapsed, setInitialSampleCollapsed] = useState(true);
  const [mainProductionCollapsed, setMainProductionCollapsed] = useState(true);
  const [revisionCollapsed, setRevisionCollapsed] = useState<{[key: number]: boolean}>({});

  // 배송 일정 계산
  const productionWeeks = mainProductionType === 'express' ? 2 : 5;
  
  const deliverySchedule = {
    totalWeeks: (() => {
      let total = 2;
      if (initialSampleDeliveryMethod === 'physical') total += 1;
      sampleRevisions.forEach(rev => {
        total += 1;
        if (rev.deliveryMethod === 'physical') total += 1;
      });
      total += productionWeeks;
      return total;
    })(),
    finalDate: targetDeliveryDate ? (() => {
      const startDate = new Date(targetDeliveryDate);
      let totalWeeks = 2;
      if (initialSampleDeliveryMethod === 'physical') totalWeeks += 1;
      sampleRevisions.forEach(rev => {
        totalWeeks += 1;
        if (rev.deliveryMethod === 'physical') totalWeeks += 1;
      });
      totalWeeks += productionWeeks;
      const finalDate = new Date(startDate);
      finalDate.setDate(finalDate.getDate() + totalWeeks * 7);
      return finalDate.toISOString().split('T')[0];
    })() : ''
  };

  // 시나리오 생성
  const generateScenarios = useCallback((orderDate: string) => {
    if (!orderDate) {
      setScenarios([]);
      setShowScenarios(false);
      return;
    }
    
    const startDate = new Date(orderDate);
    startDate.setHours(0, 0, 0, 0);
    
    const allScenarios: any[] = [];
    
    const initialSampleOptions = [
      { method: 'photo', weeks: 2 },
      { method: 'physical', weeks: 3 }
    ];
    
    const revisionCounts = [0, 1, 2];
    const revisionOptions = ['photo', 'physical'];
    
    const productionOptions = [
      { type: 'normal', weeks: 5 },
      { type: 'express', weeks: 2 }
    ];
    
    initialSampleOptions.forEach(initialSample => {
      revisionCounts.forEach(revisionCount => {
        if (revisionCount === 0) {
          productionOptions.forEach(production => {
            const totalWeeks = initialSample.weeks + production.weeks;
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + totalWeeks * 7);
            
            const scenario = {
              id: `${initialSample.method}-0-${production.type}`,
              initialSampleMethod: initialSample.method,
              revisions: [],
              productionType: production.type,
              totalWeeks,
              endDate,
              endDateKR: `${endDate.getMonth() + 1}월 ${endDate.getDate()}일`,
              isExpress: production.type === 'express'
            };
            
            allScenarios.push(scenario);
          });
        } else {
          const generateRevisionCombinations = (count: number): string[][] => {
            if (count === 0) return [[]];
            if (count === 1) return [['photo'], ['physical']];
            
            const subCombinations = generateRevisionCombinations(count - 1);
            const result: string[][] = [];
            
            subCombinations.forEach(subCombo => {
              revisionOptions.forEach(option => {
                result.push([...subCombo, option]);
              });
            });
            
            return result;
          };
          
          const revisionCombinations = generateRevisionCombinations(revisionCount);
          
          revisionCombinations.forEach(revisionCombo => {
            productionOptions.forEach(production => {
              const revisionWeeks = revisionCombo.reduce((sum, method) => {
                return sum + 1 + (method === 'physical' ? 1 : 0);
              }, 0);
              
              const totalWeeks = initialSample.weeks + revisionWeeks + production.weeks;
              const endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + totalWeeks * 7);
              
              const scenario = {
                id: `${initialSample.method}-${revisionCount}-${revisionCombo.join('')}-${production.type}`,
                initialSampleMethod: initialSample.method,
                revisions: revisionCombo.map((method, idx) => ({
                  id: Date.now() + idx,
                  deliveryMethod: method
                })),
                productionType: production.type,
                totalWeeks,
                endDate,
                endDateKR: `${endDate.getMonth() + 1}월 ${endDate.getDate()}일`,
                isExpress: production.type === 'express'
              };
              
              allScenarios.push(scenario);
            });
          });
        }
      });
    });
    
    const BEST_SCENARIO_ID = 'photo-1-physical-normal';
    
    allScenarios.sort((a, b) => {
      if (a.id === BEST_SCENARIO_ID) return -1;
      if (b.id === BEST_SCENARIO_ID) return 1;
      return a.totalWeeks - b.totalWeeks;
    });
    
    setScenarios(allScenarios);
    setShowScenarios(allScenarios.length > 0);
    
    if (!hasAutoSelected) {
      const bestScenario = allScenarios.find(s => s.id === BEST_SCENARIO_ID);
      if (bestScenario) {
        setSelectedScenario(bestScenario);
        setIsManuallyModified(false);
        setHasAutoSelected(true);
        onInitialMethodChange(bestScenario.initialSampleMethod);
        onMainTypeChange(bestScenario.productionType);
        setSampleRevisions(bestScenario.revisions);
      }
    }
  }, [hasAutoSelected, onInitialMethodChange, onMainTypeChange]);
  
  useEffect(() => {
    if (targetDeliveryDate) {
      generateScenarios(targetDeliveryDate);
    }
  }, [targetDeliveryDate, generateScenarios]);

  const handleSelectScenario = (scenario: any) => {
    setSelectedScenario(scenario);
    if (scenario) {
      onInitialMethodChange(scenario.initialSampleMethod);
      onMainTypeChange(scenario.productionType);
      setSampleRevisions(scenario.revisions);
      setIsManuallyModified(false);
    } else {
      setIsManuallyModified(true);
    }
  };

  return (
    <div className="space-y-3">
      {/* 말풍선 안내 */}
      <AnimatePresence>
        {targetDeliveryDate && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                y: {
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }
              }
            }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#1a2867] text-white px-4 py-3 rounded-xl text-sm flex items-center gap-2 shadow-lg"
          >
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>더 빠른 납기 일정을 원하실 경우, 다른 시나리오를 선택해 주세요.</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setDeliverySimOpen(!deliverySimOpen)}
          className={`w-full flex flex-col md:flex-row md:items-center md:justify-between px-5 py-4 transition-colors gap-3 bg-white hover:bg-gray-50`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
            {/* 주문 예상 시점 (Left side) */}
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1a2867]" />
                <span className="text-sm text-gray-700 font-bold">주문 예상 시점</span>
              </div>
              <div className="relative flex-1 md:flex-initial md:w-auto">
                <input 
                  type="date" 
                  value={targetDeliveryDate} 
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e: any) => {
                    e.stopPropagation();
                    onTargetDateChange(e.target.value);
                    setHasAutoSelected(false);
                    if (e.target.value && !deliverySimOpen) {
                      setDeliverySimOpen(true);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="주문 예상 시점"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fab803]/20 focus:border-[#fab803]" 
                />
              </div>
            </div>
          
            {/* 화살표 게이지바 애니메이션 (Arrow-shaped progress bar animation) */}
            <div className="hidden md:flex items-center mx-4 flex-shrink-0">
              <div className="relative" style={{ width: '140px', height: '20px' }}>
                <svg width="140" height="20" viewBox="0 0 140 20" fill="none" className="absolute inset-0">
                  <path 
                    d="M0 7 L120 7 L120 0 L140 10 L120 20 L120 13 L0 13 Z" 
                    fill="#e5e7eb"
                  />
                </svg>
                
                <svg width="140" height="20" viewBox="0 0 140 20" fill="none" className="absolute inset-0">
                  <defs>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffd93d" />
                      <stop offset="100%" stopColor="#fab803" />
                    </linearGradient>
                    <clipPath id="arrowClip">
                      <motion.rect
                        x="0"
                        y="0"
                        height="20"
                        initial={{ width: 0 }}
                        animate={{
                          width: 140,
                        }}
                        transition={{
                          duration: 1.5,
                          ease: "easeOut"
                        }}
                      />
                    </clipPath>
                  </defs>
                  <path 
                    d="M0 7 L120 7 L120 0 L140 10 L120 20 L120 13 L0 13 Z" 
                    fill="url(#arrowGradient)"
                    clipPath="url(#arrowClip)"
                  />
                </svg>
                
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                    clipPath: 'polygon(0 35%, 85.7% 35%, 85.7% 0, 100% 50%, 85.7% 100%, 85.7% 65%, 0 65%)'
                  }}
                  initial={{ x: -140 }}
                  animate={{
                    x: 280,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 0.5
                  }}
                />
              </div>
            </div>
          
            {/* 납기 일자 (Right side - right aligned) */}
            <div className="flex items-center gap-3 flex-1 md:justify-end">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#fab803]" />
                <span className="text-sm text-gray-700 font-bold">납기 일자</span>
              </div>
              <div className="relative flex-1 md:flex-initial md:w-auto">
                <input 
                  type="date" 
                  value={actualDeliveryDate}
                  min={deliverySchedule.finalDate || (targetDeliveryDate || new Date().toISOString().split('T')[0])}
                  disabled={!targetDeliveryDate}
                  onChange={(e: any) => {
                    e.stopPropagation();
                    onActualDateChange(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="납기 일자"
                  className="w-full px-3 py-2 text-sm text-right rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fab803]/20 focus:border-[#fab803] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50" 
                />
              </div>
            </div>
          </div>
          
          {/* 펼치기/접기 아이콘 */}
          <div className="flex items-center gap-2 justify-between md:justify-end md:ml-3">
            {deliverySimOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </button>
        
        <AnimatePresence>
          {deliverySimOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 space-y-5 bg-gray-50">
                {/* 안내 문구 */}
                <div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-[rgb(0,0,0)]">제작 일정 안내</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">KC 인증이 필요하신 경우 배송 기간 예측이 어렵습니다, 별도로 문의해 주세요.</p>
                  </div>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-[rgb(0,0,0)] font-medium text-[14px]">항목</th>
                        <th className="text-right py-2 px-3 text-[rgb(0,0,0)] font-medium text-[14px]">소요 기간</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 px-3 text-gray-700 text-[13px]">초기 샘플 제작</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900 text-[13px]">약 2주</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 px-3 text-gray-700 text-[13px]">샘플 수정(1회 당)</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900 text-[13px]">약 1주</td>
                      </tr>
                      
                      <tr className="bg-blue-50/50">
                        <td colSpan={2} className="py-1.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-[#1a2867] bg-[#1a2867]/10 px-2 py-0.5 rounded">샘플 컨펌 방식 (택1)</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="bg-blue-50/30 border-b border-blue-100">
                        <td className="py-2.5 px-3 pl-6 text-gray-700 text-[13px]">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">①</span>
                            <span>샘플 사진 • 영상 컨펌</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900 text-[13px]">0일</td>
                      </tr>
                      <tr className="bg-blue-50/30 border-b border-gray-100">
                        <td className="py-2.5 px-3 pl-6 text-gray-700 text-[13px]">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">②</span>
                            <span>실제 샘플 수령 (중국 → 한국)</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900 text-[13px]">약 1주</td>
                      </tr>
                      
                      <tr className="bg-amber-50/50">
                        <td colSpan={2} className="py-1.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-[#1a2867] bg-[#fab803]/20 px-2 py-0.5 rounded">본 주문 생산 방식 (택1)</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="bg-amber-50/30 border-b border-amber-100">
                        <td className="py-2.5 px-3 pl-6 text-gray-700 text-[13px]">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">①</span>
                            <span>본 주문 제작 (일반)</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900 text-[13px]">약 4주 ~ 5주</td>
                      </tr>
                      <tr className="bg-amber-50/30">
                        <td className="py-2.5 px-3 pl-6 text-gray-700 text-[13px]">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">②</span>
                            <span>본 주문 제작 (익스프레스)</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900 text-[13px]">약 1주 ~ 2주</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* AI 추천 시나리오 */}
                {showScenarios && scenarios.length > 0 && (
                  <div className="space-y-3" data-scenarios-section>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#fab803]" />
                        <span className="text-sm font-semibold text-gray-900">AI 추천 시나리오</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setScenarioTab('normal')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          scenarioTab === 'normal'
                            ? 'bg-[#1a2867] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        📦 기본
                      </button>
                      <button
                        type="button"
                        onClick={() => setScenarioTab('express')}
                        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          scenarioTab === 'express'
                            ? 'bg-[#1a2867] text-white shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        ⚡ 급행
                      </button>
                    </div>
                    
                    {scenarioTab === 'express' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 p-3 bg-red-50 border-2 border-red-300 rounded-lg"
                      >
                        <span className="text-xl flex-shrink-0">⚠️</span>
                        <p className="text-sm text-red-800">
                          급행 생산 선택 시 제작 비용이 기본 단가 대비 <span className="font-bold underline">최대 2배까지 증가</span>할 수 있습니다.
                        </p>
                      </motion.div>
                    )}
                    
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {scenarios.filter(scenario => scenario.productionType === scenarioTab).map((scenario, idx) => {
                        const isSelected = selectedScenario?.id === scenario.id;
                        const isBestScenario = scenario.id === 'photo-1-physical-normal';
                        
                        return (
                          <motion.button
                            key={scenario.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                handleSelectScenario(null);
                              } else {
                                handleSelectScenario(scenario);
                              }
                            }}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-[#fab803] bg-[#fab803]/5 shadow-md'
                                : 'border-gray-200 hover:border-[#fab803]/50 bg-white'
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-500">
                                  시나리오 {idx + 1}
                                </span>
                                {isBestScenario && (
                                  <span className="text-xs px-2 py-0.5 bg-[#fab803] text-[#1a2867] rounded font-bold">
                                    ⭐ BEST
                                  </span>
                                )}
                                {isSelected && (
                                  <span className="text-xs px-2 py-0.5 bg-[#1a2867] text-white rounded">
                                    ✓ 선택됨
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">예상 소요</div>
                                <div className="text-lg font-bold text-[#1a2867]">
                                  {scenario.totalWeeks}주
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="relative h-16 bg-gray-200 rounded-lg overflow-hidden">
                                <div 
                                  className="absolute h-full bg-blue-500 flex flex-col items-center justify-center text-white px-2"
                                  style={{ 
                                    left: '0%',
                                    width: `${((scenario.initialSampleMethod === 'photo' ? 2 : 3) / scenario.totalWeeks) * 100}%`
                                  }}
                                >
                                  <div className="text-xs font-semibold">초기 샘플</div>
                                  <div className="text-[10px] opacity-90">{scenario.initialSampleMethod === 'photo' ? '사진 (2주)' : '실물 (3주)'}</div>
                                </div>
                                
                                {scenario.revisions.map((rev: any, revIdx: number) => {
                                  let startWeek = scenario.initialSampleMethod === 'photo' ? 2 : 3;
                                  for (let i = 0; i < revIdx; i++) {
                                    startWeek += 1 + (scenario.revisions[i].deliveryMethod === 'physical' ? 1 : 0);
                                  }
                                  const revWeeks = 1 + (rev.deliveryMethod === 'physical' ? 1 : 0);
                                  
                                  return (
                                    <div
                                      key={revIdx}
                                      className="absolute h-full bg-amber-500 flex flex-col items-center justify-center text-white px-2"
                                      style={{ 
                                        left: `${(startWeek / scenario.totalWeeks) * 100}%`,
                                        width: `${(revWeeks / scenario.totalWeeks) * 100}%`
                                      }}
                                    >
                                      <div className="text-xs font-semibold">{revIdx + 1}차 수정</div>
                                      <div className="text-[10px] opacity-90">{rev.deliveryMethod === 'photo' ? '사진 (1주)' : '실물 (2주)'}</div>
                                    </div>
                                  );
                                })}
                                
                                <div 
                                  className={`absolute h-full ${scenario.productionType === 'express' ? 'bg-red-500' : 'bg-emerald-500'} flex flex-col items-center justify-center text-white px-2`}
                                  style={{ 
                                    left: `${((scenario.totalWeeks - (scenario.productionType === 'express' ? 2 : 5)) / scenario.totalWeeks) * 100}%`,
                                    width: `${((scenario.productionType === 'express' ? 2 : 5) / scenario.totalWeeks) * 100}%`
                                  }}
                                >
                                  <div className="text-xs font-semibold">본 주문</div>
                                  <div className="text-[10px] opacity-90">{scenario.productionType === 'express' ? '급행 (2주)' : '일반 (5주)'}</div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between mt-1.5 text-xs text-gray-500">
                                <span>시작</span>
                                <span className="font-medium text-[#1a2867]">
                                  {new Date(scenario.endDate).getMonth() + 1}/{new Date(scenario.endDate).getDate()} 납품
                                </span>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {targetDeliveryDate && scenarios.length === 0 && (
                  <AlertBox type="warning">
                    가능한 시나리오가 없어, 제작 진행이 어려울 수 있습니다. 수동으로 시나리오 선택 후 견적 요청을 제출해 주시면 담당 매니저 확인 후 상담을 도와드리겠습니다.
                  </AlertBox>
                )}
                
                {/* 초기 샘플 수령 방식 */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setInitialSampleCollapsed(!initialSampleCollapsed)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">초기 샘플 컨펌 방식</span>
                      {(!initialSampleDeliveryMethod || initialSampleDeliveryMethod === 'photo') && (
                        <span className="text-xs px-2 py-1 bg-[#1a2867]/10 text-[#1a2867] rounded-md">
                          📸 사진 • 영상 컨펌
                        </span>
                      )}
                      {initialSampleDeliveryMethod === 'physical' && (
                        <span className="text-xs px-2 py-1 bg-[#1a2867]/10 text-[#1a2867] rounded-md">
                          📦 실물 수령
                        </span>
                      )}
                    </div>
                    {initialSampleCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {!initialSampleCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                onInitialMethodChange('photo');
                                setInitialSampleCollapsed(true);
                                if (selectedScenario) {
                                  setSelectedScenario(null);
                                  setIsManuallyModified(true);
                                }
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                (!initialSampleDeliveryMethod || initialSampleDeliveryMethod === 'photo')
                                  ? 'border-[#1a2867] bg-[#1a2867]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">📸</span>
                                <span className="text-sm font-semibold text-gray-900">사진 • 영상 컨펌</span>
                              </div>
                              <p className="text-xs text-gray-600">0일 (즉시 확인)</p>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => {
                                onInitialMethodChange('physical');
                                setInitialSampleCollapsed(true);
                                if (selectedScenario) {
                                  setSelectedScenario(null);
                                  setIsManuallyModified(true);
                                }
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                initialSampleDeliveryMethod === 'physical'
                                  ? 'border-[#1a2867] bg-[#1a2867]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">📦</span>
                                <span className="text-sm font-semibold text-gray-900">실물 수령</span>
                              </div>
                              <p className="text-xs text-gray-600">+1주 소요</p>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* 본주문 생산 방식 */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMainProductionCollapsed(!mainProductionCollapsed)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">본 주문 생산 방식</span>
                      {(!mainProductionType || mainProductionType === 'normal' || mainProductionType === 'standard') && (
                        <span className="text-xs px-2 py-1 bg-[#1a2867]/10 text-[#1a2867] rounded-md">
                          📦 일반 생산
                        </span>
                      )}
                      {mainProductionType === 'express' && (
                        <span className="text-xs px-2 py-1 bg-[#fab803]/20 text-[#1a2867] rounded-md">
                          ⚡ 급행 생산
                        </span>
                      )}
                    </div>
                    {mainProductionCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {!mainProductionCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                onMainTypeChange('normal');
                                setMainProductionCollapsed(true);
                                if (selectedScenario) {
                                  setSelectedScenario(null);
                                  setIsManuallyModified(true);
                                }
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                (!mainProductionType || mainProductionType === 'normal' || mainProductionType === 'standard')
                                  ? 'border-[#1a2867] bg-[#1a2867]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base">📦</span>
                                <span className="text-sm font-semibold text-gray-900">일반 생산</span>
                              </div>
                              <p className="text-xs text-gray-600">4~5주 소요</p>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => {
                                onMainTypeChange('express');
                                setMainProductionCollapsed(true);
                                if (selectedScenario) {
                                  setSelectedScenario(null);
                                  setIsManuallyModified(true);
                                }
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                mainProductionType === 'express'
                                  ? 'border-[#fab803] bg-[#fab803]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-base">⚡</span>
                                <span className="text-sm font-semibold text-gray-900">급행 생산</span>
                              </div>
                              <p className="text-xs text-gray-600">1~2주 소요</p>
                            </button>
                          </div>
                          
                          {mainProductionType === 'express' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <AlertBox type="error">
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">⚠️</span>
                                  <p className="text-sm">급행 생산 선택 시 제작 비용이 기본 단가 대비 <span className="font-bold underline">최대 2배까지 증가</span>할 수 있습니다.</p>
                                </div>
                              </AlertBox>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* 샘플 수정 카드 */}
                {sampleRevisions.length > 0 && (
                  <div className="space-y-3">
                    {sampleRevisions.map((revision, index) => (
                      <div key={revision.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setRevisionCollapsed({
                              ...revisionCollapsed,
                              [revision.id]: !revisionCollapsed[revision.id]
                            });
                          }}
                          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-[#1a2867]">
                              {index + 1}차 샘플 컨펌 방식
                            </span>
                            {revision.deliveryMethod === 'photo' && (
                              <span className="text-xs px-2 py-1 bg-[#fab803]/20 text-[#1a2867] rounded-md">
                                📸 사진 • 영상 컨펌
                              </span>
                            )}
                            {revision.deliveryMethod === 'physical' && (
                              <span className="text-xs px-2 py-1 bg-[#fab803]/20 text-[#1a2867] rounded-md">
                                📦 실물 수령
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSampleRevisions(sampleRevisions.filter(r => r.id !== revision.id));
                                if (selectedScenario) {
                                  setSelectedScenario(null);
                                  setIsManuallyModified(true);
                                }
                              }}
                              className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {revisionCollapsed[revision.id] ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {!revisionCollapsed[revision.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-0">
                                <div className="grid grid-cols-2 gap-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSampleRevisions(sampleRevisions.map(r => 
                                        r.id === revision.id ? { ...r, deliveryMethod: 'photo' } : r
                                      ));
                                      setRevisionCollapsed({
                                        ...revisionCollapsed,
                                        [revision.id]: true
                                      });
                                      if (selectedScenario) {
                                        setSelectedScenario(null);
                                        setIsManuallyModified(true);
                                      }
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                                      revision.deliveryMethod === 'photo'
                                        ? 'border-[#1a2867] bg-[#1a2867]/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-lg">📸</span>
                                      <span className="text-sm font-semibold text-gray-900">사진 • 영상 컨펌</span>
                                    </div>
                                    <p className="text-xs text-gray-600">+1주 소요</p>
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSampleRevisions(sampleRevisions.map(r => 
                                        r.id === revision.id ? { ...r, deliveryMethod: 'physical' } : r
                                      ));
                                      setRevisionCollapsed({
                                        ...revisionCollapsed,
                                        [revision.id]: true
                                      });
                                      if (selectedScenario) {
                                        setSelectedScenario(null);
                                        setIsManuallyModified(true);
                                      }
                                    }}
                                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                                      revision.deliveryMethod === 'physical'
                                        ? 'border-[#fab803] bg-[#fab803]/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-lg">📦</span>
                                      <span className="text-sm font-semibold text-gray-900">실물 수령</span>
                                    </div>
                                    <p className="text-xs text-gray-600">+2주 소요</p>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* 샘플 수정 추가 버튼 */}
                {sampleRevisions.length < 2 && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const newId = Date.now() + Math.random();
                        setSampleRevisions([...sampleRevisions, { id: newId, deliveryMethod: 'photo' }]);
                        if (selectedScenario) {
                          setSelectedScenario(null);
                          setIsManuallyModified(true);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white text-sm font-medium rounded-xl transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      {sampleRevisions.length + 1}차 수정
                    </button>
                  </div>
                )}
                
                {sampleRevisions.length >= 2 && (
                  <div className="flex justify-center">
                    <div className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                      ⚠️ 샘플 수정은 최대 2회까지 가능합니다.
                    </div>
                  </div>
                )}
                
                {/* 타임라인 시각화 */}
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <TimelineItem 
                      label="초기 샘플 제작" 
                      weeks={2} 
                      color="blue"
                      cumulativeWeeks={2}
                    />
                    {initialSampleDeliveryMethod === 'physical' && (
                      <TimelineItem 
                        label="초기 샘플 실물 수령" 
                        weeks={1} 
                        color="purple"
                        cumulativeWeeks={3}
                      />
                    )}
                    {sampleRevisions.map((revision, index) => {
                      let cumulativeWeeks = 2;
                      if (initialSampleDeliveryMethod === 'physical') cumulativeWeeks += 1;
                      
                      for (let i = 0; i < index; i++) {
                        cumulativeWeeks += 1;
                        if (sampleRevisions[i].deliveryMethod === 'physical') cumulativeWeeks += 1;
                      }
                      
                      const modificationWeeks = cumulativeWeeks + 1;
                      const deliveryWeeks = modificationWeeks + 1;
                      
                      return (
                        <div key={revision.id}>
                          <TimelineItem 
                            label={`${index + 1}차 샘플 수정`}
                            weeks={1} 
                            color="orange"
                            cumulativeWeeks={modificationWeeks}
                          />
                          {revision.deliveryMethod === 'physical' && (
                            <TimelineItem 
                              label={`${index + 1}차 샘플 실물 수령`}
                              weeks={1} 
                              color="purple"
                              cumulativeWeeks={deliveryWeeks}
                            />
                          )}
                        </div>
                      );
                    })}
                    <TimelineItem 
                      label="본 주문 제작" 
                      weeks={productionWeeks} 
                      color="green"
                      cumulativeWeeks={(() => {
                        let total = 2;
                        if (initialSampleDeliveryMethod === 'physical') total += 1;
                        sampleRevisions.forEach(rev => {
                          total += 1;
                          if (rev.deliveryMethod === 'physical') total += 1;
                        });
                        return total + productionWeeks;
                      })()}
                    />
                  </div>
                </div>
                
                {/* 최종 결과 */}
                <div className={`rounded-xl p-5 text-white ${
                  actualDeliveryDate && deliverySchedule.finalDate && new Date(actualDeliveryDate) < new Date(deliverySchedule.finalDate)
                    ? 'bg-gradient-to-br from-red-500 to-red-700/90'
                    : 'bg-gradient-to-br from-[#1a2867] to-[#1a2867]/80'
                }`}>
                  {selectedScenario && !isManuallyModified && (
                    <div className="mb-3 flex items-center gap-2 text-xs bg-white/20 rounded-lg p-2 text-white">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-white">시나리오 {scenarios.findIndex(s => s.id === selectedScenario.id) + 1} 적용 중</span>
                    </div>
                  )}
                  
                  {isManuallyModified && (
                    <div className="mb-3 flex items-center gap-2 text-xs bg-white/20 rounded-lg p-2 text-white">
                      <Edit3 className="w-4 h-4 text-white" />
                      <span className="text-white">수동 설정됨</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm opacity-90 text-white">총 예상 소요 기간</span>
                    <span className="text-2xl font-bold text-white">{deliverySchedule.totalWeeks}주</span>
                  </div>
                  
                  <div className="pt-3 border-t border-white/20">
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                      <div className="text-center">
                        <div className="text-xs opacity-75 mb-1 text-white">주문 예상 시점</div>
                        <div className="text-base font-semibold text-white">
                          {targetDeliveryDate 
                            ? `${new Date(targetDeliveryDate).getFullYear()}/${String(new Date(targetDeliveryDate).getMonth() + 1).padStart(2, '0')}/${String(new Date(targetDeliveryDate).getDate()).padStart(2, '0')}`
                            : '미설정'}
                        </div>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 opacity-75 flex-shrink-0 text-white" />
                      
                      <div className="text-center">
                        <div className="text-xs opacity-75 mb-1 text-white">예상 완료 시점</div>
                        <div className="text-base font-semibold text-white">
                          {deliverySchedule.finalDate
                            ? `${new Date(deliverySchedule.finalDate).getFullYear()}/${String(new Date(deliverySchedule.finalDate).getMonth() + 1).padStart(2, '0')}/${String(new Date(deliverySchedule.finalDate).getDate()).padStart(2, '0')}`
                            : '미설정'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <label className="block">
                      <div className="text-xs opacity-75 mb-2 text-white">납기 일자 (행사 일자)</div>
                      <input
                        type="date"
                        value={actualDeliveryDate}
                        min={deliverySchedule.finalDate || (targetDeliveryDate || new Date().toISOString().split('T')[0])}
                        disabled={!targetDeliveryDate}
                        onChange={(e) => {
                          onActualDateChange(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </label>
                  </div>
                  
                  <div className="mt-3 text-xs bg-white/10 rounded-lg p-2 bg-[rgba(255,255,255,0.15)] text-white text-[13px]">
                    ⚠️ 해당 시나리오는 시뮬레이션이며, 실제 상황에 따라 일정은 변동될 수 있습니다.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}