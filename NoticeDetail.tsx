import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Tag, Bell, ChevronLeft, ChevronRight } from 'lucide-react';

// ========== 브랜드 컬러 정의 (Brand Color Definition) ==========
const BRAND_COLORS = {
  primary: "#ffd93d", // 메인 컬러 (Main Color - Yellow)
  secondary: "#1a2867", // 서브 컬러 (Sub Color - Navy)
  text: {
    primary: "#191F28", // 기본 텍스트 (Primary Text)
    secondary: "#4E5968", // 보조 텍스트 (Secondary Text)
    tertiary: "#8B95A1", // 삼차 텍스트 (Tertiary Text)
  },
  background: {
    primary: "#FFFFFF",
    secondary: "#F9FAFB",
    tertiary: "#F2F4F6",
  },
  border: "#E5E8EB",
};

// ========== 공지사항 상세 페이지 (Notice Detail Page) ==========
export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 공지사항 데이터 (Notice Data) - 실제로는 API에서 가져와야 함
  const notices = [
    {
      id: 1,
      title: "2025년 설 연휴 휴무 안내",
      category: "공지",
      date: "2024-12-15",
      isPinned: true,
      isNew: true,
      content: "2025년 1월 28일(화)부터 1월 30일(목)까지 설 연휴로 휴무입니다. 휴무 기간 동안의 문의는 1월 31일(금)부터 순차적으로 답변드리겠습니다. 제작 일정에 참고 부탁드립니다.",
      detailedContent: `
        <h2>설 연휴 휴무 안내</h2>
        <p>안녕하세요, Qudisom입니다.</p>
        <p>2025년 설 연휴 휴무 일정을 안내드립니다.</p>
        
        <h3>휴무 기간</h3>
        <ul>
          <li>휴무 시작: 2025년 1월 28일(화)</li>
          <li>휴무 종료: 2025년 1월 30일(목)</li>
          <li>정상 운영: 2025년 1월 31일(금)부터</li>
        </ul>

        <h3>유의 사항</h3>
        <ul>
          <li>휴무 기간 중 접수된 문의는 1월 31일(금)부터 순차적으로 답변드립니다.</li>
          <li>긴급한 사항은 카카오톡 채널로 메시지를 남겨주시면 확인 즉시 연락드리겠습니다.</li>
          <li>제작 진행 중인 주문 건은 일정에 차질이 없도록 사전에 조율하겠습니다.</li>
          <li>샘플 및 본 제작 일정은 휴무 기간을 고려하여 조정될 수 있습니다.</li>
        </ul>

        <h3>설 연휴 전후 제작 일정</h3>
        <p>설 연휴를 앞두고 제작 공장도 함께 휴무에 들어가므로, 긴급 제작이 필요하신 경우 1월 20일(월) 이전에 주문을 확정해주셔야 연휴 전 출고가 가능합니다.</p>
        
        <p>새해 복 많이 받으시고, 항상 건강하시길 바랍니다.</p>
        <p>감사합니다.</p>
      `
    },
    {
      id: 2,
      title: "KC 인증 대행 서비스 시작 안내",
      category: "서비스",
      date: "2024-12-10",
      isPinned: true,
      isNew: true,
      content: "고객님들의 편의를 위해 KC 인증 대행 서비스를 시작합니다. 별도 비용 없이 인증 절차를 도와드리며, 필요 서류와 샘플만 준비해주시면 됩니다. 자세한 사항은 견적 문의 시 안내드립니다.",
      detailedContent: `
        <h2>KC 인증 대행 서비스 시작</h2>
        <p>안녕하세요, Qudisom입니다.</p>
        <p>고객님들께서 자주 문의주시던 KC 인증 대행 서비스를 정식으로 시작하게 되었습니다.</p>
        
        <h3>서비스 개요</h3>
        <p>KC 인증은 어린이 제품의 안전성을 보증하는 필수 인증으로, 복잡한 절차와 시간이 소요됩니다. 저희가 인증 절차 전체를 대행해드리므로 고객님께서는 제품 제작에만 집중하실 수 있습니다.</p>

        <h3>대행 서비스 내용</h3>
        <ul>
          <li>KC 인증 신청 서류 작성 및 제출</li>
          <li>시험 기관 샘플 제출 및 커뮤니케이션</li>
          <li>인증 진행 상황 실시간 공유</li>
          <li>인증서 발급 및 전달</li>
          <li>사후 관리 및 갱신 안내</li>
        </ul>

        <h3>필요 서류</h3>
        <ul>
          <li>사업자등록증 사본</li>
          <li>제품 상세 사양서</li>
          <li>제품 사진 (다각도)</li>
          <li>원단 및 부자재 성분표</li>
        </ul>

        <h3>소요 기간 및 비용</h3>
        <ul>
          <li>인증 기간: 약 4~6주 (제품 복잡도에 따라 상이)</li>
          <li>대행 수수료: 본 제작 진행 시 무료 (인증 시험 비용은 실비 청구)</li>
          <li>인증서 발급 후 5년간 유효</li>
        </ul>

        <p>자세한 사항은 견적 문의 시 담당자가 안내해드립니다.</p>
        <p>감사합니다.</p>
      `
    },
    {
      id: 3,
      title: "신규 원단 라인업 추가",
      category: "제품",
      date: "2024-12-05",
      isPinned: false,
      isNew: true,
      content: "고급 밍크 원단과 프리미엄 벨벳 원단이 새롭게 추가되었습니다. 더욱 다양한 질감과 컬러 옵션으로 고급스러운 인형 제작이 가능합니다. 원단 샘플은 자료실에서 확인하실 수 있습니다.",
      detailedContent: `
        <h2>신규 원단 라인업 추가</h2>
        <p>안녕하세요, Qudisom입니다.</p>
        <p>고객님들의 요청으로 프리미엄 원단 라인업을 새롭게 추가했습니다.</p>

        <h3>추가된 원단</h3>
        
        <h4>1. 고급 밍크 원단</h4>
        <ul>
          <li>부드럽고 고급스러운 촉감</li>
          <li>보온성이 우수하여 겨울 시즌 제품에 최적</li>
          <li>20가지 컬러 옵션 제공</li>
          <li>가격: 기본 원단 대비 +15%</li>
        </ul>

        <h4>2. 프리미엄 벨벳 원단</h4>
        <ul>
          <li>실키한 광택과 부드러운 질감</li>
          <li>고급스러운 비주얼 효과</li>
          <li>15가지 컬러 옵션 제공 (메탈릭 컬러 포함)</li>
          <li>가격: 기본 원단 대비 +20%</li>
        </ul>

        <h3>샘플 신청</h3>
        <p>원단 샘플은 자료실에서 신청하실 수 있으며, 최대 5종까지 무료로 발송해드립니다.</p>
        
        <h3>적용 가능 제품</h3>
        <ul>
          <li>봉제 인형 (모든 사이즈)</li>
          <li>쿠션/베개</li>
          <li>키링 (일부 사이즈 제한 있음)</li>
        </ul>

        <p>신규 원단을 적용한 샘플 제작도 가능하니 부담 없이 문의해주세요.</p>
        <p>감사합니다.</p>
      `
    },
    {
      id: 4,
      title: "제작 기간 단축 서비스 안내",
      category: "서비스",
      date: "2024-11-28",
      isPinned: false,
      isNew: false,
      content: "긴급 제작이 필요하신 고객님을 위해 특급 제작 서비스를 운영하고 있습니다. 일반 제작 기간 대비 30% 단축 가능하며, 추가 비용은 견적서에 별도 표기됩니다. 상담 시 문의해주세요.",
      detailedContent: `
        <h2>특급 제작 서비스 안내</h2>
        <p>안녕하세요, Qudisom입니다.</p>
        <p>긴급하게 제품이 필요하신 고객님들을 위해 특급 제작 서비스를 운영하고 있습니다.</p>

        <h3>서비스 개요</h3>
        <p>일반 제작 일정보다 최대 30% 단축된 일정으로 제품을 제작해드립니다.</p>

        <h3>단축 가능 기간</h3>
        <ul>
          <li>샘플 제작: 2~3주 → 1~2주</li>
          <li>본 제작 (300~500개): 3~4주 → 2~3주</li>
          <li>본 제작 (500~1000개): 4~5주 → 3~4주</li>
          <li>본 제작 (1000개 이상): 별도 협의</li>
        </ul>

        <h3>추가 비용</h3>
        <ul>
          <li>샘플 제작: +20%</li>
          <li>본 제작 (300~500개): +15%</li>
          <li>본 제작 (500개 이상): +10%</li>
        </ul>

        <h3>유의 사항</h3>
        <ul>
          <li>공장 생산 일정에 따라 특급 제작이 불가할 수 있습니다.</li>
          <li>디자인 복잡도에 따라 단축 기간이 달라질 수 있습니다.</li>
          <li>KC 인증 등 별도 인증이 필요한 경우 인증 기간은 단축되지 않습니다.</li>
          <li>명절 연휴 전후에는 특급 제작 신청이 불가할 수 있습니다.</li>
        </ul>

        <p>긴급 제작이 필요하신 경우 견적 문의 시 반드시 말씀해주시기 바랍니다.</p>
        <p>감사합니다.</p>
      `
    },
    {
      id: 5,
      title: "친환경 소재 제작 옵션 추가",
      category: "제품",
      date: "2024-11-20",
      isPinned: false,
      isNew: false,
      content: "재활용 원단 및 유기농 소재를 사용한 친환경 인형 제작이 가능합니다. 지속가능한 제품 생산에 관심 있는 고객님들의 많은 문의 바랍니다. 친환경 인증서 발급도 가능합니다.",
      detailedContent: `
        <h2>친환경 소재 제작 옵션</h2>
        <p>안녕하세요, Qudisom입니다.</p>
        <p>환경을 생각하는 제품 제작을 위해 친환경 소재 옵션을 추가했습니다.</p>

        <h3>제공 소재</h3>
        
        <h4>1. 재활용 원단</h4>
        <ul>
          <li>재활용 PET 섬유로 제작된 원단</li>
          <li>일반 원단과 동일한 품질 보장</li>
          <li>GRS(Global Recycle Standard) 인증</li>
          <li>가격: 기본 원단 대비 +10%</li>
        </ul>

        <h4>2. 유기농 면 소재</h4>
        <ul>
          <li>GOTS(Global Organic Textile Standard) 인증 면</li>
          <li>화학 물질 무첨가</li>
          <li>민감성 피부에도 안전</li>
          <li>가격: 기본 원단 대비 +25%</li>
        </ul>

        <h4>3. 친환경 충전재</h4>
        <ul>
          <li>재활용 폴리에스터 충전재</li>
          <li>항균 처리 가능</li>
          <li>가격: 일반 충전재와 동일</li>
        </ul>

        <h3>친환경 인증서</h3>
        <p>친환경 소재 사용 제품에 대해 다음 인증서를 발급해드립니다:</p>
        <ul>
          <li>친환경 제품 인증서</li>
          <li>원단 성분 분석표</li>
          <li>GRS/GOTS 인증 원본 사본</li>
        </ul>

        <h3>적용 사례</h3>
        <ul>
          <li>기업 친환경 캠페인 굿즈</li>
          <li>유아용 완구 및 인형</li>
          <li>호텔/리조트 어메니티</li>
          <li>친환경 브랜드 제품</li>
        </ul>

        <p>지속가능한 제품 생산에 관심 있는 고객님들의 많은 문의 부탁드립니다.</p>
        <p>감사합니다.</p>
      `
    },
    {
      id: 6,
      title: "홈페이지 리뉴얼 완료",
      category: "공지",
      date: "2024-11-15",
      isPinned: false,
      isNew: false,
      content: "더 편리한 서비스 이용을 위해 홈페이지를 전면 리뉴얼했습니다. 자동 견적 산출기, 실시간 제작 현황 확인 등 새로운 기능들을 이용해보세요. 사용 중 불편한 점이 있으시면 언제든 문의해주세요.",
      detailedContent: `
        <h2>홈페이지 리뉴얼 완료</h2>
        <p>안녕하세요, Qudisom입니다.</p>
        <p>고객님들께 더 나은 서비스를 제공하기 위해 홈페이지를 전면 리뉴얼했습니다.</p>

        <h3>새로운 기능</h3>
        
        <h4>1. 자동 견적 산출기</h4>
        <ul>
          <li>제품 사양 입력만으로 즉시 견적 확인</li>
          <li>다양한 옵션별 가격 비교 가능</li>
          <li>견적서 PDF 다운로드 기능</li>
        </ul>

        <h4>2. 실시간 제작 현황 확인</h4>
        <ul>
          <li>주문 단계별 진행 상황 실시간 업데이트</li>
          <li>샘플 제작 사진 및 본 제작 현황 확인</li>
          <li>예상 완료 일정 안내</li>
        </ul>

        <h4>3. 자료실</h4>
        <ul>
          <li>제작 가이드 문서 다운로드</li>
          <li>디자인 템플릿 제공</li>
          <li>원단 샘플 카탈로그</li>
          <li>인증 관련 자료</li>
        </ul>

        <h4>4. 제작 사례 갤러리</h4>
        <ul>
          <li>카테고리별 제작 사례 확인</li>
          <li>고화질 이미지 및 상세 설명</li>
          <li>유사 제품 견적 문의 가능</li>
        </ul>

        <h3>개선된 사용자 경험</h3>
        <ul>
          <li>모바일 최적화 디자인</li>
          <li>직관적인 네비게이션</li>
          <li>빠른 페이지 로딩 속도</li>
          <li>다크 모드 지원 (예정)</li>
        </ul>

        <h3>향후 계획</h3>
        <p>고객님들의 피드백을 바탕으로 지속적으로 기능을 개선해나가겠습니다. 불편한 점이나 추가 기능 제안이 있으시면 언제든 말씀해주세요.</p>

        <p>감사합니다.</p>
      `
    },
    {
      id: 7,
      title: "대량 주문 할인 이벤트",
      category: "이벤트",
      date: "2024-11-01",
      isPinned: false,
      isNew: false,
      content: "1000개 이상 주문 시 최대 15% 할인 혜택을 드립니다. 11월 한 달간 진행되는 이벤트이니 대량 주문을 계획 중이신 고객님들은 이 기회를 놓치지 마세요!",
      detailedContent: `
        <h2>대량 주문 특별 할인 이벤트</h2>
        <p>안녕하세요, Qudisom입니다.</p>
        <p>11월 한 달간 대량 주문 고객님들께 특별 할인 혜택을 드립니다.</p>

        <h3>할인 혜택</h3>
        <ul>
          <li>1,000~2,000개: 5% 할인</li>
          <li>2,000~5,000개: 10% 할인</li>
          <li>5,000개 이상: 15% 할인</li>
        </ul>

        <h3>이벤트 기간</h3>
        <ul>
          <li>시작: 2024년 11월 1일</li>
          <li>종료: 2024년 11월 30일</li>
          <li>이벤트 기간 내 견적 문의 및 계약 완료 건에 한함</li>
        </ul>

        <h3>적용 제품</h3>
        <ul>
          <li>봉제 인형 (모든 사이즈)</li>
          <li>인형 키링</li>
          <li>쿠션 및 베개</li>
          <li>마스코트 인형</li>
        </ul>

        <h3>유의 사항</h3>
        <ul>
          <li>샘플 제작 비용은 할인 대상이 아닙니다.</li>
          <li>본 제작 수량에 따라 할인율이 적용됩니다.</li>
          <li>KC 인증 등 별도 비용은 할인 대상이 아닙니다.</li>
          <li>다른 프로모션과 중복 적용 불가합니다.</li>
        </ul>

        <h3>신청 방법</h3>
        <p>견적 문의 시 "11월 대량 주문 이벤트"를 말씀해주시면 자동으로 할인이 적용됩니다.</p>

        <p>이번 기회에 합리적인 가격으로 고품질 제품을 제작해보세요!</p>
        <p>감사합니다.</p>
      `
    },
    {
      id: 8,
      title: "샘플 제작 비용 환급 정책 변경",
      category: "정책",
      date: "2024-10-25",
      isPinned: false,
      isNew: false,
      content: "본 제작 진행 시 샘플 비용의 50%를 환급해드리던 정책이 70%로 상향 조정되었습니다. 고객님들의 부담을 줄이고자 정책을 개선했으니 많은 이용 부탁드립니다.",
      detailedContent: `
        <h2>샘플 제작 비용 환급 정책 변경</h2>
        <p>안녕하세요, Qudisom입니다.</p>
        <p>고객님들의 부담을 줄이고자 샘플 제작 비용 환급 정책을 개선했습니다.</p>

        <h3>변경 내용</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f2f4f6;">
              <th style="padding: 12px; border: 1px solid #e5e8eb;">구분</th>
              <th style="padding: 12px; border: 1px solid #e5e8eb;">기존 정책</th>
              <th style="padding: 12px; border: 1px solid #e5e8eb;">변경 정책</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid #e5e8eb;">환급률</td>
              <td style="padding: 12px; border: 1px solid #e5e8eb;">50%</td>
              <td style="padding: 12px; border: 1px solid #e5e8eb; color: #FF6B6B; font-weight: 700;">70%</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e5e8eb;">환급 시점</td>
              <td style="padding: 12px; border: 1px solid #e5e8eb;">본 제작 완료 후</td>
              <td style="padding: 12px; border: 1px solid #e5e8eb;">본 제작 계약 시</td>
            </tr>
          </tbody>
        </table>

        <h3>적용 대상</h3>
        <ul>
          <li>2024년 10월 25일 이후 샘플 제작 건부터 적용</li>
          <li>모든 제품 카테고리 적용</li>
          <li>본 제작 최소 수량 이상 주문 시 (봉제 인형 300개, 키링 500개)</li>
        </ul>

        <h3>예시</h3>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>샘플 제작 비용: 200,000원</strong></p>
          <p style="margin: 0 0 10px 0;">기존 환급액: 100,000원 (50%)</p>
          <p style="margin: 0; color: #FF6B6B; font-weight: 700;">변경 환급액: 140,000원 (70%)</p>
        </div>

        <h3>환급 방법</h3>
        <ul>
          <li>본 제작 계약 시 계약금에서 차감</li>
          <li>또는 별도 계좌로 환급 (선택 가능)</li>
        </ul>

        <h3>유의 사항</h3>
        <ul>
          <li>샘플 승인 후 6개월 이내 본 제작 진행 시 적용</li>
          <li>샘플 제작 후 본 제작 미진행 시 환급 불가</li>
          <li>디자인 변경 없이 동일 제품으로 본 제작 시 적용</li>
        </ul>

        <p>더 나은 서비스로 보답하겠습니다. 감사합니다.</p>
      `
    }
  ];

  // 현재 공지사항 찾기 (Find current notice)
  const notice = notices.find(n => n.id === Number(id));

  // 이전/다음 게시물 찾기 (Find previous/next notices)
  const currentIndex = notices.findIndex(n => n.id === Number(id));
  const previousNotice = currentIndex < notices.length - 1 ? notices[currentIndex + 1] : null;
  const nextNotice = currentIndex > 0 ? notices[currentIndex - 1] : null;

  if (!notice) {
    return (
      <div style={{ backgroundColor: BRAND_COLORS.background.secondary, minHeight: "100vh", paddingTop: "80px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: "24px", color: BRAND_COLORS.text.primary, marginBottom: "16px" }}>
            공지사항을 찾을 수 없습니다
          </h1>
          <button
            onClick={() => navigate('/notice')}
            style={{
              padding: "12px 24px",
              backgroundColor: BRAND_COLORS.secondary,
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: BRAND_COLORS.background.secondary, minHeight: "100vh", paddingTop: "80px", paddingBottom: "80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 16px" }} className="md:px-5">
        {/* 뒤로가기 버튼 (Back Button) */}
        <button
          onClick={() => navigate('/notice')}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            backgroundColor: "white",
            border: `2px solid ${BRAND_COLORS.border}`,
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 600,
            color: BRAND_COLORS.text.secondary,
            cursor: "pointer",
            marginBottom: "24px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
            e.currentTarget.style.color = BRAND_COLORS.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = BRAND_COLORS.border;
            e.currentTarget.style.color = BRAND_COLORS.text.secondary;
          }}
          className="md:flex hidden"
        >
          <ArrowLeft style={{ width: "18px", height: "18px" }} />
          목록으로
        </button>

        {/* 공지사항 상세 내용 (Notice Detail Content) */}
        <div
          style={{
            backgroundColor: "white",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
          className="rounded-xl md:rounded-[20px] p-5 md:p-10"
        >
          {/* 헤더 (Header) */}
          <div style={{ marginBottom: "32px", paddingBottom: "24px", borderBottom: `2px solid ${BRAND_COLORS.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              {notice.isPinned && (
                <div
                  style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    backgroundColor: `${BRAND_COLORS.primary}30`,
                    color: BRAND_COLORS.secondary,
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Bell style={{ width: "14px", height: "14px" }} />
                  공지
                </div>
              )}
              {notice.isNew && (
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    backgroundColor: "#FF6B6B",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  NEW
                </span>
              )}
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "6px",
                  backgroundColor: BRAND_COLORS.background.tertiary,
                  color: BRAND_COLORS.text.secondary,
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Tag style={{ width: "14px", height: "14px" }} />
                {notice.category}
              </span>
            </div>
            
            <h1 style={{ fontSize: "32px", fontWeight: 700, color: BRAND_COLORS.text.primary, marginBottom: "16px", lineHeight: 1.4 }}>
              {notice.title}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: BRAND_COLORS.text.tertiary }}>
              <Clock style={{ width: "16px", height: "16px" }} />
              {notice.date}
            </div>
          </div>

          {/* 본문 (Content) */}
          <div
            style={{
              fontSize: "16px",
              lineHeight: 1.8,
              color: BRAND_COLORS.text.secondary,
            }}
            dangerouslySetInnerHTML={{ __html: notice.detailedContent }}
          />
        </div>

        {/* 이전/다음 게시물 네비게이션 (Previous/Next Notice Navigation) */}
        <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* 이전 게시물 (Previous Notice) */}
          {previousNotice ? (
            <button
              onClick={() => navigate(`/notice/${previousNotice.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                backgroundColor: "white",
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: "12px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                e.currentTarget.style.backgroundColor = BRAND_COLORS.background.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BRAND_COLORS.border;
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              <ChevronLeft style={{ width: "20px", height: "20px", color: BRAND_COLORS.text.tertiary, flexShrink: 0 }} />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: "12px", color: BRAND_COLORS.text.tertiary, marginBottom: "4px" }}>이전 게시물</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.text.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {previousNotice.title}
                </div>
              </div>
            </button>
          ) : (
            <div style={{ padding: "16px 20px", backgroundColor: BRAND_COLORS.background.tertiary, border: `2px solid ${BRAND_COLORS.border}`, borderRadius: "12px", opacity: 0.5 }}>
              <div style={{ fontSize: "12px", color: BRAND_COLORS.text.tertiary, marginBottom: "4px" }}>이전 게시물</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.text.secondary }}>이전 게시물이 없습니다</div>
            </div>
          )}

          {/* 다음 게시물 (Next Notice) */}
          {nextNotice ? (
            <button
              onClick={() => navigate(`/notice/${nextNotice.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                backgroundColor: "white",
                border: `2px solid ${BRAND_COLORS.border}`,
                borderRadius: "12px",
                textAlign: "right",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = BRAND_COLORS.secondary;
                e.currentTarget.style.backgroundColor = BRAND_COLORS.background.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BRAND_COLORS.border;
                e.currentTarget.style.backgroundColor = "white";
              }}
            >
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: "12px", color: BRAND_COLORS.text.tertiary, marginBottom: "4px" }}>다음 게시물</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.text.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {nextNotice.title}
                </div>
              </div>
              <ChevronRight style={{ width: "20px", height: "20px", color: BRAND_COLORS.text.tertiary, flexShrink: 0 }} />
            </button>
          ) : (
            <div style={{ padding: "16px 20px", backgroundColor: BRAND_COLORS.background.tertiary, border: `2px solid ${BRAND_COLORS.border}`, borderRadius: "12px", opacity: 0.5 }}>
              <div style={{ fontSize: "12px", color: BRAND_COLORS.text.tertiary, marginBottom: "4px" }}>다음 게시물</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: BRAND_COLORS.text.secondary }}>다음 게시물이 없습니다</div>
            </div>
          )}
        </div>

        {/* 목록으로 돌아가기 버튼 (Back to List Button) */}
        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <button
            onClick={() => navigate('/notice')}
            style={{
              padding: "14px 32px",
              backgroundColor: BRAND_COLORS.secondary,
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(26, 40, 103, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>

      {/* CSS 스타일 (CSS Styles) */}
      <style>{`
        h2 {
          font-size: 24px;
          font-weight: 700;
          color: ${BRAND_COLORS.text.primary};
          margin: 32px 0 16px 0;
          padding-bottom: 12px;
          border-bottom: 2px solid ${BRAND_COLORS.border};
        }

        h3 {
          font-size: 20px;
          font-weight: 700;
          color: ${BRAND_COLORS.text.primary};
          margin: 24px 0 12px 0;
        }

        h4 {
          font-size: 17px;
          font-weight: 600;
          color: ${BRAND_COLORS.text.primary};
          margin: 20px 0 10px 0;
        }

        p {
          margin: 12px 0;
          line-height: 1.8;
        }

        ul {
          margin: 12px 0;
          padding-left: 24px;
        }

        li {
          margin: 8px 0;
          line-height: 1.6;
        }

        strong {
          font-weight: 700;
          color: ${BRAND_COLORS.text.primary};
        }

        table {
          margin: 20px 0;
        }

        th {
          font-weight: 700;
          color: ${BRAND_COLORS.text.primary};
          text-align: left;
        }

        td {
          color: ${BRAND_COLORS.text.secondary};
        }
      `}</style>
    </div>
  );
}