import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, ArrowLeft, ArrowRight, User, Building2, Phone, Mail, MessageCircle, Trash2, FileText, Ruler, Calendar, Upload, ChevronDown, ChevronUp, Copy, Check, Info, Search, AlertCircle, Shirt, Tag, Receipt, Box, Cloud, Key, BookOpen, Sparkles, RefreshCw, Download, Edit3, Wand2, Circle, Square, Pencil, Undo2, ZoomIn, Hash, Package, ListChecks, Minus, Shield, Camera } from 'lucide-react';
import { Slider } from './components/ui/slider';
import { Label } from './components/ui/label';
import KCCertificationGuide from './components/KCCertificationGuide';
import OriginLabelGuide from './components/OriginLabelGuide';
import LabelingMethodGuide from './components/LabelingMethodGuide';
import { LabelLocationEditor } from './components/LabelLocationEditor';

// ========== SVG 아이콘 컴포넌트 (SVG Icon Components) ==========
const CheckIconSVG = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XIconSVG = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12M4 4L12 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InfoIconSVG = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7.5" stroke="#94a3b8" strokeWidth="1.5"/>
    <path d="M9 8V12M9 6V6.01" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const WarningIconSVG = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6V9.5M9 12V12.01" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M2.5 14.5L9 3L15.5 14.5H2.5Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ========== 타입 정의 ==========
interface FilePreview {
  file: File;
  preview: string;
}

interface AIPreview {
  id: string;
  imageUrl: string;
  style: string;
  timestamp: number;
  fileIndex: number;
  prompt: string;
  originalFileName: string;
  version: number;
}

// ========== 상수 ==========
const INITIAL_PRODUCT = { productName: '', productType: '', customProductType: '', quantities: [{ id: Date.now(), value: 300 }], width: '', depth: '', files: [], sampleDeliveryMethod: 'file', sampleDeliveryDate: '', mainDeliveryDate: '', targetDeliveryDate: '', actualDeliveryDate: '', initialSampleDeliveryMethod: 'photo', mainProductionType: 'standard', selectedScenario: null, additionalRequest: '', fabric: '크리스탈 벨벳', fabricFiles: [], fabricRequest: '', originLabelMaterial: '나일론 페이퍼', originLabelCustom: '아니오', originLabelFiles: [], customLabelFiles: [], originLabelMaterialRequest: '', originLabelDesignRequest: '', labelLocationRequest: '', originLabelRequest: '', labelLocationImage: '', stickerCustom: '아니오', stickerBase: '화이트', stickerFiles: [], stickerRequest: '', keyring: '', keyringFiles: [], keyringRequest: '', filling: 'PP 솜', labelingMethod: '스티커', packaging: 'OPP 봉투', packagingFiles: [], packagingRequest: '', kcCertification: '불필요(14세 이상)', tagString: '', tagStringColor: '', tagStringCustom: '', hangTagDesignFiles: [], hangTagRequest: '', hangTagStringFiles: [], packagingPrintFiles: [], packagingPrintRequest: '' }; // 초기 제품 데이터 with BEST 기본값 (Initial product data with BEST default values - sampleDeliveryMethod: 파일 업로드 or 실물 샘플, filling: PP 솜, KC: 불필요, stickerBase: 화이트, quantities: 수량별 견적 배열, 각종 Request: 기타 요청 사항, targetDeliveryDate: 주문 예상 시점, actualDeliveryDate: 납기 일자, initialSampleDeliveryMethod: 초기 샘플 전달 방식, mainProductionType: 본 제작 방식, selectedScenario: AI 추천 시나리오 저장, labelLocationImage: 라벨 위치 편집 이미지, keyringRequest: 키링 기타 요청, originLabelMaterialRequest: 라벨 소재 레퍼런스 기타 요청, originLabelDesignRequest: 라벨 디자인 파일 기타 요청, labelLocationRequest: 라벨 위치 편집기 기타 요청)
const INITIAL_SECTION = { fabric: false, originLabel: true, labelingMethod: true, packaging: true, filling: true, keyring: true, kcCertification: true }; // 원단만 펼쳐진 상태 (Only fabric section is open initially)

const FABRIC_OPTIONS = [
  { 
    name: '크리스탈 벨벳', 
    image: 'https://cdn.imweb.me/thumbnail/20250728/d22155166e11b.jpg', 
    desc: '부드러운 벨벳', 
    isBest: true,
    exampleImages: [
      'https://cdn.imweb.me/thumbnail/20251023/19d20aee6e328.jpg',
      'https://cdn.imweb.me/thumbnail/20251023/8dd0d1a4f3208.jpg',
      'https://cdn.imweb.me/thumbnail/20251023/361ed91009a2d.jpg',
      'https://cdn.imweb.me/thumbnail/20251023/d665bcb10da06.jpg',
      'https://cdn.imweb.me/thumbnail/20251023/f7cc6280938c9.jpg'
    ],
    description: '부드럽고 은은한 광택이 도는 원단으로, 포근한 촉감과 세탁 후에도 유지되는 내구성 덕분에 인형 제작에 가장 많이 사용됩니다.'
  },
  { name: '전문가 추천', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300', desc: 'AI 맞춤 추천', isAI: true },
  { name: '커스텀 원단', image: 'https://cdn.imweb.me/thumbnail/20251024/1b524fc23710d.png', desc: '원단 직접 지정' },
  { name: '스판덱스', image: 'https://cdn.imweb.me/thumbnail/20250728/736234d2fb633.jpg', desc: '신축성 우수' },
  { name: '토끼털', image: 'https://cdn.imweb.me/thumbnail/20250728/85c28afbec6eb.jpg', desc: '포근한 촉감' },
  { name: '브러시 플라워', image: 'https://cdn.imweb.me/thumbnail/20250728/76bb20bcfb6ea.jpg', desc: '꽃무늬 질감' },
  { name: '밍크', image: 'https://cdn.imweb.me/thumbnail/20250728/5d42ccddfe0a2.jpg', desc: '고급 밍크' },
  { name: '인조퍼', image: 'https://cdn.imweb.me/thumbnail/20250728/97b02e969ea78.jpg', desc: '폭신한 인조퍼' },
  { name: '양털 플리스', image: 'https://cdn.imweb.me/thumbnail/20250728/43715deca5c2f.jpg', desc: '따뜻한 양털' },
  { name: '피치 스킨', image: 'https://cdn.imweb.me/thumbnail/20250728/241e559fabcdb.jpg', desc: '복숭아 촉감' },
  { name: '타올지', image: 'https://cdn.imweb.me/thumbnail/20250729/76f2c66be8505.jpg', desc: '수건 재질' },
  { name: '나일론', image: 'https://cdn.imweb.me/thumbnail/20250729/4f1ab21aa49ca.jpg', desc: '내구성 강함' }
];
const LABEL_OPTIONS = [
  { 
    name: '나일론 페이퍼', 
    image: 'https://cdn.imweb.me/thumbnail/20250730/4811736ea96c5.jpg', 
    isBest: true,
    description: '얇은 종이와 같은 촉감의 라벨입니다. 주로 세탁 라벨로 사용되며, 가성비가 좋아 가장 많이 사용되는 라벨입니다.'
  },
  { 
    name: '실크', 
    image: 'https://cdn.imweb.me/thumbnail/20250730/72fb485cd6fba.jpg',
    description: '부드럽고 매끄러운 촉감, 약간의 광택이 있는 라벨입니다. 합리적인 가격에 우수한 품질로 2번째로 인기가 많은 소재입니다.'
  },
  { 
    name: '직조', 
    image: 'https://cdn.imweb.me/thumbnail/20250730/609c579468991.jpg',
    description: '고급스러운 질감을 가진 라벨이며, 자수 인쇄가 가능합니다.'
  },
  { 
    name: '폴리', 
    image: 'https://cdn.imweb.me/thumbnail/20250730/8d4dfa0c988d9.jpg',
    description: '약간 코팅된 듯 매끈한 표면을 가지고 있는 라벨입니다. 잘 구겨지지 않고, 빠르게 건조됩니다.'
  },
  { 
    name: '면', 
    image: 'https://cdn.imweb.me/thumbnail/20250730/eed8c6eb8852c.jpg',
    description: '면 소재로 제작되어 자연스러운 질감을 가지며, 세탁 시에도 내구성이 좋지만 가격이 가장 비쌉니다.'
  },
  { 
    name: '커스텀', 
    image: 'https://cdn.imweb.me/thumbnail/20251024/fd5180d318f52.png',
    description: '리스트 외 라벨 소재의 경우, 참고 이미지를 첨부해 주시면 유사하거나 동일한 소재로 제작 가능합니다.'
  }
];
const KEYRING_OPTIONS = [{ name: '실버 키링', image: 'https://images.unsplash.com/photo-1588257192226-c43cc6a981aa?w=300' }, { name: '골드 키링', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300' }, { name: '커스텀 키링', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300' }];
const LABELING_METHOD_OPTIONS = [
  { name: '스티커', image: 'https://images.unsplash.com/photo-1668510468038-3607aae3f03c?w=300', isBest: true },
  { name: '행택', image: 'https://images.unsplash.com/photo-1752606304264-73877124735f?w=300' },
  { name: '패키징 인쇄', image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300' }
]; // 표시 사항 표기 방식 옵션 (Labeling method options)
const PACKAGING_OPTIONS = [
  { name: 'OPP 봉투', min: 0, image: 'https://images.unsplash.com/photo-1637251393438-30eca8828253?w=300', isBest: true },
  { name: '벌크 포장', min: 0, image: 'https://images.unsplash.com/photo-1698376621004-70ce754157d1?w=300' },
  { name: '무지 박스', min: 0, image: 'https://images.unsplash.com/photo-1656543802898-41c8c46683a7?w=300' },
  { name: '풀컬러 박스', min: 2000, image: 'https://images.unsplash.com/photo-1698376621004-70ce754157d1?w=300' },
  { name: '창문형 박스', min: 2000, image: 'https://images.unsplash.com/photo-1656543802898-41c8c46683a7?w=300' },
  { name: '커스텀 패키지', min: 2000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300' }
];
const FILLING_OPTIONS = [{ name: 'PP 솜', image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=300', isBest: true }, { name: '모찌솜', image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300' }];
const KC_OPTIONS = [
  { name: '불필요(14세 이상)', isBest: true },
  { name: '만 3세 이상' },
  { name: '만 8세 이상' }
];
const TAG_OPTIONS = [
  { name: '투명 끈', image: 'https://cdn.imweb.me/thumbnail/20250730/01d2eae19fe52.jpg', isBest: true },
  { name: '화살촉 끈', image: 'https://cdn.imweb.me/thumbnail/20250730/645e51c474a91.jpg' },
  { name: '커스텀 끈', image: 'https://images.unsplash.com/photo-1614500539737-1a70136f4267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBjb3JkJTIwc3RyaW5nfGVufDF8fHx8MTc2NjU1OTM5Nnww&ixlib=rb-4.1.0&q=80&w=1080' }
];
const TAG_STRING_COLOR_OPTIONS = {
  '투명 끈': ['투명', '화이트', '블랙'],
  '화살촉 끈': ['블랙', '화이트', '우드']
};
const STICKER_BASE_OPTIONS = [
  { name: '화이트', image: 'https://images.unsplash.com/photo-1691480208637-6ed63aac6694?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHN0aWNrZXIlMjBsYWJlbHxlbnwxfHx8fDE3NjY1NTk3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080', isBest: true },
  { name: '투명', image: 'https://images.unsplash.com/photo-1709492608990-f56b70b433cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc3BhcmVudCUyMGNsZWFyJTIwc3RpY2tlcnxlbnwxfHx8fDE3NjY1NTk3MTl8MA&ixlib=rb-4.1.0&q=80&w=1080' }
];
const PRODUCT_TYPES = ['봉제 인형', '인형 키링', '기타'];

// ========== 가이드 데이터 ==========
const GUIDE_DATA = {
  fabric: {
    title: '원단',
    subtitle: '눈, 코, 입 등 세부적인 부분은 기본적으로 자수로 표현됩니다.',
    description: '다른 표현을 원하시는 경우 작업 지시서가 필요합니다. 예시 사진을 참고하여 작업 지시서를 디자인과 함께 첨부해주세요.',
    sections: [
      {
        title: '작업 지시서 예시',
        images: [
          { url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600', caption: '작업 지시서 예시' }
        ],
        description: '모자: 나일론, 자수\n몸체: 크리스탈 벨벳\n눈, 코, 볼: 자수\n유니폼: 폴리에스터, 자수 인쇄\n방망이: 타올지'
      },
      {
        title: '디자인 → 실제 제품 예시',
        images: [
          { url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600', caption: '디자인' },
          { url: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600', caption: '실제 제품' }
        ]
      }
    ],
    tips: ['사진을 클릭하면 확대 이미지와 제작 예시를 확인할 수 있습니다.']
  },
  originLabel: {
    title: '원산지 표기 라벨',
    subtitle: '모든 봉제 인형에는 원산지 표기 라벨이 필수입니다.',
    description: '라벨 소재와 디자인을 선택해주세요.',
    sections: [
      {
        title: '라벨 종류',
        images: [
          { url: 'https://images.unsplash.com/photo-1675239514439-1c128b0cffcd?w=600', caption: '나일론 페이퍼 라벨' },
          { url: 'https://images.unsplash.com/photo-1700893417240-b05189a9650c?w=600', caption: '실크 라벨' }
        ],
        description: '나일론 페이퍼: 가장 일반적인 라벨\n실크: 부드러운 촉감\n직조: 고급스러운 느낌'
      }
    ],
    tips: ['커스텀 선택 시 디자인 파일이 필요합니다.', '기본 디자인은 쿠디솜에서 제작해드립니다.']
  },
  labelingMethod: {
    title: '표시 사항 표기 방식',
    subtitle: '제품 정보를 표시하는 방법을 선택해주세요.',
    description: '스티커 또는 행택 중 선택 가능합니다.',
    sections: [
      {
        title: '스티커',
        images: [
          { url: 'https://images.unsplash.com/photo-1593747176945-ef77e62547eb?w=600', caption: '스티커 예시 1' }
        ],
        description: '패키지에 부착되는 스티커입니다.\n스티커 선택 시 패키지도 함께 선택해주세요.'
      },
      {
        title: '행택',
        images: [
          { url: 'https://images.unsplash.com/photo-1583047960442-1e3e6d50ab02?w=600', caption: '행택 예시 1' }
        ],
        description: '인형에 끈으로 연결되는 태그입니다.\n끈 종류도 선택 가능합니다.'
      }
    ],
    tips: ['스티커 선택 시 패키지가 필수입니다.']
  },
  packaging: {
    title: '패키지',
    subtitle: '제품 포장 방식을 선택해주세요.',
    description: '수량에 따라 선택 가능한 옵션이 다릅니다.',
    sections: [
      {
        title: '기본 패키지',
        images: [
          { url: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600', caption: 'OPP 봉투' }
        ],
        description: 'OPP 봉투: 투명 비닐 포장\n벌크 포장: 포장 없이 배송\n무지 박스: 흰색 기본 박스'
      }
    ],
    tips: ['풀컬러, 창문형 박스 및 커스텀 패키지는 2,000개 이상 주문 시 제작 가능합니다.']
  },
  filling: {
    title: '충전솜',
    subtitle: '인형 내부에 들어가는 솜을 선택해주세요.',
    description: '촉감과 탄성이 다릅니다.',
    sections: [
      {
        title: '솜 종류',
        images: [
          { url: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600', caption: 'PP 솜' }
        ],
        description: 'PP 솜 (기본): 가벼우며 복원력이 좋음\n모찌솜: 쫀득한 촉감, 무게감 있음'
      }
    ],
    tips: ['모찌솜은 추가 비용이 발생할 수 있습니다.']
  },
  keyring: {
    title: '키링',
    subtitle: '인형 키링에 부착되는 고리를 선택해주세요.',
    description: '색상과 디자인을 선택할 수 있습니다.',
    sections: [
      {
        title: '키링 종류',
        images: [
          { url: 'https://images.unsplash.com/photo-1588257192226-c43cc6a981aa?w=600', caption: '실버 키링' }
        ],
        description: '실버: 은색 메탈 키링\n골드: 금색 메탈 키링\n커스텀: 원하는 디자인으로 제작'
      }
    ],
    tips: ['커스텀 키링 선택 시 레퍼런스 이미지가 필요합니다.']
  },
  kcCertification: {
    title: 'KC 인증',
    subtitle: 'KC 인증이란?\nKC인증은 우리나라의 통합 국가 안전인증 제도로, 소비자가 사용하는 제품이 안전·보건·환경·품질 기준을 충족했는지를 정부가 확인해주는 제도입니다.',
    description: '',
    sections: [
      {
        title: '인형은 어떤 경우에 KC 인증을 받아야 하나요?',
        description: "'인형'은 KC 인증 여부가 제품의 대상 연령과 용도에 따라서 달라집니다.\n\n✅ 13세 이하의 어린이가 사용하기 위하여 제작된 경우 KC인증을 필수로 받아야 합니다.\n\n⚠️ 단, '14세 이상'으로 제작 및 표기되었다 하더라도, 어린이 제품이라고 판단된 경우 세관에서 KC 인증을 요구할 수 있습니다."
      },
      {
        title: '연령대별 KC 인증 여부 및 인증 비용',
        description: '📌 3세 미만 완구 (36개월 미만)\n- KC 인증: ✅ 필수\n- 인증 비용: 약 200만원~\n- 인증 기간: 3~5주\n\n📌 3세 이상 ~ 8세 미만 완구 (만 3~7세)\n- KC 인증: ✅ 필수\n- 인증 비용: 약 150~200만원\n- 인증 기간: 2~4주\n\n📌 8세 이상 ~ 13세 이하 완구 (만 8~13세)\n- KC 인증: ✅ 필수\n- 인증 비용: 약 80~100만원\n- 인증 기간: 2~4주\n\n📌 14세 이상 완구 (만 14세 이상)\n- KC 인증: ❌ 면제 가능\n- 인증 비용: -\n- 인증 기간: -\n\n※ 인증 비용 및 기간은 제품의 특성 및 인증 기관의 기준에 따라 달라질 수 있으며, 재심사 과정이 여러 번 있을 수 있어 정확한 기간을 예측하기 어렵습니다.'
      },
      {
        title: '필수 표기 사항',
        description: '[어린이제품 안전특별법]에 따른 필수 표기 사항은 아래와 같습니다.\n\n일반적으로 [전기용품 및 생활용품 안전관리법에 의한 표시 사항]이 포함되며, 추가적으로 사용 연령, KC 인증 번호, KC 인증 마크, 어린이 제품 전용 주의 사항(텍스트 또는 아이콘), 3세 미만 사용 금지 안내(만 3세 이상 제품일 경우) 등이 필요합니다.\n\n📋 필수 표기 항목:\n\n• 품명 (예: 완구)\n• 모델명 (예: 피코 인형)\n• 규격 (예: 5cm x 10cm)\n• 사용 연령 (예: 만 8세 이상)\n• 원산지 (예: 중국)\n• 제조년월 (예: 2025.12)\n• 제조원 (예: Qudisom Plusch Toy Co Ltd.)\n• 수입원 (예: 주식회사 인프라이즈)\n• 판매원 (예: 쿠디솜)\n• 주소 (예: 인천광역시 남동구 서창남로 45, 3층)\n• 고객 센터 (예: 1666-0211)\n• 재질 (예: 코튼 100%)\n• 주의 사항 안내 텍스트 및 아이콘 (연령에 따라 다름)\n• KC 인증 번호\n• KC 인증 마크\n• 어린이 제품 주의 사항\n• 3세 미만 사용 금지 안내 (만 3세 이상 제품인 경우)\n\n※ 필수 문구: "본 제품은 공정거래위원회 고시 소비자분쟁 해결 기준에 의거 교환 또는 보상 받을 수 있습니다." 문구도 함께 표기됩니다.'
      },
      {
        title: '표기 사항 예시',
        images: [
          { url: 'https://cdn.imweb.me/thumbnail/20250724/115c0382571ff.jpg', caption: '만 8세 이상 표기 사항 예시' },
          { url: 'https://cdn.imweb.me/thumbnail/20250724/1ba10723c59da.jpg', caption: '만 3세 이상 표기 사항 예시' }
        ],
        description: '위 이미지는 실제 KC 인증을 받은 제품의 표기 사항 예시입니다.\n\n이미지를 클릭하시면 확대하여 자세한 표기 내용을 확인하실 수 있습니다.'
      },
      {
        title: '표기 위치 선택 (3가지 중 택 1)',
        description: '표기 사항은 다음 3가지 방법 중 하나를 선택하여 표기할 수 있습니다:\n\n1️⃣ 행택에 표기\n제품에 달린 태그에 표기하는 방식입니다.\n\n2️⃣ 스티커\n포장 박스나 봉투에 스티커를 부착하는 방식입니다.\n\n3️⃣ 패키징\n포장 박스나 봉투에 직접 인쇄하는 방식입니다.\n\n※ 스티커 또는 패키징 선택 시 별도 패키지가 필요합니다.'
      }
    ],
    tips: ['KC 인증은 추가 비용과 기간이 소요됩니다.', '이미지를 클릭하면 확대하여 자세히 확인할 수 있습니다.', '정확한 인증 비용 및 기간은 제품 특성에 따라 달라질 수 있습니다.']
  },
  productType: {
    title: '봉제 아이템 제작 가이드',
    subtitle: '',
    description: '',
    sections: [
      {
        title: '예시 디자인 → 실제 제품',
        designSlides: [
          {
            designImage: { url: 'https://cdn.imweb.me/thumbnail/20251023/1f2672a6a5c21.png', caption: '예시 디자인 1' },
            productImages: [
              { url: 'https://cdn.imweb.me/thumbnail/20251023/db67c561a02c0.png', caption: '앞' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/ea6f54e37f37e.png', caption: '좌' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/477e3a8c42a88.png', caption: '뒤' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/c2a70cebc5c00.png', caption: '우' }
            ]
          },
          {
            designImage: { url: 'https://cdn.imweb.me/upload/S20250219f0f96de489a65/7ced4bd6fcb90.jpg', caption: '예시 디자인 2' },
            productImages: [
              { url: 'https://cdn.imweb.me/thumbnail/20251023/8e3b544795781.png', caption: '앞' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/607f1bd28dd79.png', caption: '좌' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/efcbfa776befd.png', caption: '뒤' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/b279119f3cc24.png', caption: '우' }
            ]
          },
          {
            designImage: { url: 'https://cdn.imweb.me/upload/S20250219f0f96de489a65/9b222e4d524ec.png', caption: '예시 디자인 3' },
            productImages: [
              { url: 'https://cdn.imweb.me/thumbnail/20251023/2d01feb265507.png', caption: '앞' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/919d5f67fe6d4.png', caption: '좌' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/25d1ed05875f1.png', caption: '뒤' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/2f86ee283b0bc.png', caption: '우' }
            ]
          },
          {
            designImage: { url: 'https://cdn.imweb.me/upload/S20250219f0f96de489a65/4a41d0b59a246.png', caption: '예시 디자인 4' },
            productImages: [
              { url: 'https://cdn.imweb.me/thumbnail/20251023/818fd4647da1a.png', caption: '앞' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/c9f7bd567f73f.png', caption: '좌' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/1980e83c0218f.png', caption: '뒤' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/21969e6a9acf3.png', caption: '우' }
            ]
          },
          {
            designImage: { url: 'https://cdn.imweb.me/thumbnail/20251023/770129eec784f.jpg', caption: '예시 디자인 5' },
            productImages: [
              { url: 'https://cdn.imweb.me/thumbnail/20251023/570a25e1682d1.png', caption: '앞' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/ec7ed68445760.png', caption: '좌' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/7543071702a2a.png', caption: '뒤' },
              { url: 'https://cdn.imweb.me/thumbnail/20251023/ea0fa7a0c3251.png', caption: '우' }
            ]
          }
        ],
        description: 'JPG, PNG 등 이미지 형태의 디자인 파일로도 제작이 가능하지만,일러스트 AI 파일 또는 인쇄용 PDF 파일로 제공해 주시는 것이 가장 좋습니다.\n\n기본적으로 앞면 디자인만 있어도 제작은 가능하지만 턴어라운드(좌, 우, 뒤) 등의 디자인까지 추가 제공해 주시면 더욱더 원하시는 형태로 제작될 가능성이 높습니다.'
      }
    ],
    tips: ['이미지 클릭 시 확대할 수 있습니다 🔍']
  },
  additionalRequest: {
    title: '기타 요청 사항 가이드',
    subtitle: '',
    description: '',
    sections: [
      {
        title: '작업 지시서 예시',
        images: [
          { url: 'https://cdn.imweb.me/upload/S20250219f0f96de489a65/7acb14165061b.png', caption: '작업 지시서 예시 1', layout: 'wide' },
          { url: 'https://cdn.imweb.me/upload/S20250219f0f96de489a65/7acb14165061b.png', caption: '작업 지시서 예시 2', layout: 'wide' },
          { url: 'https://cdn.imweb.me/upload/S20250219f0f96de489a65/7acb14165061b.png', caption: '작업 지시서 예시 3', layout: 'wide' }
        ],
        description: '눈, 코, 입 등 세부적인 부분은 기본적으로 자수로 표현됩니다. 다른 표현을 원하시는 경우 작업 지시서가 필요합니다. 작업 지시서 예시 이미지를 참고하여, 디자인 파일과 함께 첨부해주세요.'
      },
      {
        title: '부분 인쇄',
        gridImages: [
          { url: 'https://cdn.imweb.me/thumbnail/20250812/ab0d2dc691222.png', caption: '자수 인쇄', description: '일반적으로 눈, 코, 입 등에 세부적인 부분은 자수로 구현됩니다. 가장 많이 사용되는 구현 방식입니다.' },
          { url: 'https://cdn.imweb.me/thumbnail/20250812/7e8251c8920f6.png', caption: '디지털 인쇄', description: '디테일한 패턴을 정확하게 구현할 수 있고, 풀컬러 인쇄가 가능합니다. 복잡한 패턴이 있는 경우 디지털 인쇄로 구현됩니다.' },
          { url: 'https://cdn.imweb.me/thumbnail/20250812/149acfd012e6d.png', caption: '실크 인쇄', description: '실크 인쇄의 경우 동판을 제작해야 하기 때문에, 샘플 비용이 비교적 높은 편입니다. 인쇄가 선명하기 때문에 간단한 패턴이나 로고를 인쇄하기 적합합니다.' },
          { url: 'https://cdn.imweb.me/thumbnail/20250812/0fce56e39ac64.png', caption: '와펜 & 패치 & 아플리케', description: '와펜 및 패치 부착은 디자인에 포인트를 주고 싶을 때 주로 사용되며, 원단 위에 다른 재질이나 색상의 천을 먼저 바느질 한 후 와펜 및 패치를 고정합니다.' }
        ],
        topDescription: '인쇄 가능한 원단이 아닌 경우, 인쇄 작업이 불가할 수 있습니다. 사진을 클릭하시면 각 인쇄 방법에 대한 자세한 설명을 확인하실 수 있습니다.'
      },
      {
        title: '기타 부자재',
        gridImages: [
          { url: 'https://cdn.imweb.me/thumbnail/20250731/49b2698536e2c.gif', caption: '풍선껌' },
          { url: 'https://cdn.imweb.me/thumbnail/20250809/13c38a77b1c71.jpg', caption: '턱시도' },
          { url: 'https://cdn.imweb.me/thumbnail/20250810/2faf23c950aca.jpg', caption: '머플러' },
          { url: 'https://cdn.imweb.me/thumbnail/20250809/e60925079409f.jpg', caption: '꽃다발' },
          { url: 'https://cdn.imweb.me/thumbnail/20250809/2b8c6261e0e26.jpg', caption: '인형 옷' },
          { url: 'https://cdn.imweb.me/thumbnail/20250809/5e11ae9be1ea8.jpg', caption: '리본, 모자' },
          { url: 'https://cdn.imweb.me/thumbnail/20250809/9ce44936f470a.jpg', caption: '종' },
          { url: 'https://cdn.imweb.me/thumbnail/20250809/7a655e3c0678a.jpg', caption: '눈, 부리' }
        ],
        topDescription: '기타 부자재는 개별적으로 맞춤 제작됩니다. 정형화된 옵션이 없으며, 별도 요청 사항이 있으실 경우, 참고 이미지 또는 작업 지시서로 첨부해 주세요.',
        showMoreButton: true,
        initialShowCount: 4
      }
    ],
    tips: ['이미지 클릭 시 확대할 수 있습니다 🔍']
  }
};

// ========== KC 인증 가이드 아코디언 컴포넌트 (KC Certification Guide Accordion Component) ==========
interface KCAccordionProps {
  setSelectedImage: (img: any) => void;
}

const KCCertificationAccordion = ({ setSelectedImage }: KCAccordionProps) => {
  // 아코디언 상태 관리 (Accordion state management)
  const [openSection, setOpenSection] = useState<string | null>("intro");
  
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // 연령대별 인증 데이터 (Age-based certification data)
  const certificationData = [
    { category: "3세 미만", ageRange: "36개월 미만", required: true, cost: "약 200만원~", period: "3~5주" },
    { category: "3세 ~ 8세 미만", ageRange: "만 3~7세", required: true, cost: "약 150~200만원", period: "2~4주" },
    { category: "8세 ~ 13세 이하", ageRange: "만 8~13세", required: true, cost: "약 80~100만원", period: "2~4주" },
    { category: "14세 이상", ageRange: "만 14세 이상", required: false, cost: "-", period: "-" }
  ];

  // 기본 표기 사항 데이터 (Basic labeling items)
  const basicLabelingItems = [
    { name: "품명", example: "완구" },
    { name: "모델명", example: "피코 인형" },
    { name: "규격", example: "5cm x 10cm" },
    { name: "사용 연령", example: "만 8세 이상" },
    { name: "원산지", example: "중국" },
    { name: "제조년월", example: "2025.12" },
    { name: "제조원", example: "Qudisom" },
    { name: "수입원", example: "인프라이즈" },
    { name: "판매원", example: "쿠디솜" },
    { name: "주소", example: "인천광역시 남동구" },
    { name: "고객 센터", example: "1666-0211" },
    { name: "재질", example: "코튼 100%" }
  ];

  // KC 인증 추가 항목 (KC certification additional items)
  const kcOnlyLabelingItems = [
    { name: "KC 인증 번호", example: "CB123-4567" },
    { name: "KC 인증 마크", example: "KC 로고 이미지" },
    { name: "어린이 제품 주의 사항", example: "텍스트 또는 아이콘" },
    { name: "3세 미만 사용 금지 안내", example: "만 3세 이상 제품인 경우" }
  ];

  // 예시 이미지 데이터 (Example images)
  const exampleImages = [
    { title: "만 8세 이상", url: "https://cdn.imweb.me/thumbnail/20250724/115c0382571ff.jpg" },
    { title: "만 3세 이상", url: "https://cdn.imweb.me/thumbnail/20250724/1ba10723c59da.jpg" }
  ];

  // 표기 위치 옵션 (Labeling location options)
  const labelingLocations = [
    { icon: <Tag className="w-5 h-5" />, title: "행택", desc: "제품에 달린 태그에 표기" },
    { icon: <Circle className="w-5 h-5" />, title: "스티커", desc: "포장 박스나 봉투에 부착" },
    { icon: <Box className="w-5 h-5" />, title: "패키징", desc: "포장 박스나 봉투에 인쇄" }
  ];

  return (
    <div className="space-y-3">
      {/* KC인증 소개 아코디언 (KC Certification Introduction Accordion) */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection("intro")}
        >
          <span className="text-sm font-semibold text-gray-900">KC인증이란?</span>
          <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${openSection === "intro" ? "rotate-180" : ""}`} />
        </button>
        
        {openSection === "intro" && (
          <div className="px-4 pb-4 space-y-3">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                소비자가 사용하는 제품이 <strong>안전·보건·환경·품질 기준</strong>을 
                충족했는지 정부가 확인해주는 통합 국가 안전인증 제도입니다.
              </p>
            </div>
            <div className="flex items-start gap-2 bg-[#fff7e6] border border-[#ffd93d] rounded-xl p-3">
              <InfoIconSVG />
              <span className="text-xs text-gray-900 leading-relaxed">
                <strong>13세 이하</strong> 어린이용 인형은 KC인증이 <strong>필수</strong>입니다
              </span>
            </div>
            <div className="flex items-start gap-2 bg-[#fffbeb] border border-[#fcd34d] rounded-xl p-3">
              <WarningIconSVG />
              <p className="text-xs text-gray-800 leading-relaxed">
                단, <strong>'14세 이상'</strong>으로 제작 및 표기되었다 하더라도, 
                어린이 제품이라고 판단된 경우 <strong>세관에서 KC 인증을 요구</strong>할 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 연령대별 인증 정보 아코디언 (Age-based certification accordion) */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection("table")}
        >
          <span className="text-sm font-semibold text-gray-900">연령대별 인증 정보</span>
          <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${openSection === "table" ? "rotate-180" : ""}`} />
        </button>
        
        {openSection === "table" && (
          <div className="px-4 pb-4 space-y-3">
            <div className="space-y-0 border border-gray-200 rounded-xl overflow-hidden">
              {certificationData.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex justify-between items-center p-3 ${index < certificationData.length - 1 ? "border-b border-gray-200" : ""} ${item.required ? "bg-white" : "bg-gray-50 opacity-70"}`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="text-sm font-semibold text-gray-900">{item.category}</div>
                    <div className="text-xs text-gray-500">{item.ageRange}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {item.required ? (
                      <>
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckIconSVG /> 필수
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <span>{item.cost}</span>
                          <span className="text-gray-400">·</span>
                          <span>{item.period}</span>
                        </div>
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <XIconSVG /> 면제 가능
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-500 leading-relaxed">
              * 비용 및 기간은 제품 특성과 인증 기관에 따라 달라질 수 있으며, 
              재심사 과정이 여러 번 있을 수 있어 정확한 기간을 예측하기 어렵습니다.
            </p>
          </div>
        )}
      </div>

      {/* 필수 표기 사항 아코디언 (Required labeling accordion) */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection("labeling")}
        >
          <span className="text-sm font-semibold text-gray-900">필수 표기 사항</span>
          <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${openSection === "labeling" ? "rotate-180" : ""}`} />
        </button>
        
        {openSection === "labeling" && (
          <div className="px-4 pb-4 space-y-3">
            <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl leading-relaxed">
              [어린이제품 안전특별법]에 따른 필수 표기 사항입니다. 
              일반적으로 [전기용품 및 생활용품 안전관리법]에 의한 표시 사항이 포함됩니다.
            </p>

            {/* 기본 표기 사항 (Basic labeling items) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">기본 표기 사항</span>
                <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">공통</span>
              </div>
              <div className="space-y-1.5">
                {basicLabelingItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-xs font-medium text-gray-900">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.example}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KC 인증 추가 항목 (KC certification additional items) */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-red-700">KC 인증 시 추가 항목</span>
                <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-1 rounded">KC 필수</span>
              </div>
              <div className="space-y-1.5">
                {kcOnlyLabelingItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                    <span className="text-xs font-semibold text-red-800">{item.name}</span>
                    <span className="text-xs text-red-400">{item.example}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 필수 문구 (Required text) */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-yellow-800 mb-1.5 uppercase tracking-wide">필수 문구</p>
              <p className="text-xs text-yellow-900 leading-relaxed">
                "본 제품은 공정거래위원회 고시 소비자분쟁 해결 기준에 의거 
                교환 또는 보상 받을 수 있습니다."
              </p>
            </div>

            {/* 예시 이미지 갤러리 (Example images) */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">표기 사항 예시</p>
              <div className="grid grid-cols-2 gap-2">
                {exampleImages.map((image, i) => (
                  <div 
                    key={i} 
                    className="cursor-pointer"
                    onClick={() => setSelectedImage({ url: image.url, caption: `${image.title} 표기 예시` })}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                      <img src={image.url} alt={`${image.title} 표기 예시`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100">
                        <Search className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <span className="block text-xs font-medium text-gray-600 text-center mt-1.5">{image.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 표기 위치 아코디언 (Labeling location accordion) */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <button 
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection("location")}
        >
          <span className="text-sm font-semibold text-gray-900">표기 위치 (택 1)</span>
          <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${openSection === "location" ? "rotate-180" : ""}`} />
        </button>
        
        {openSection === "location" && (
          <div className="px-4 pb-4 space-y-2">
            {labelingLocations.map((location, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                  {location.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{location.title}</div>
                  <div className="text-xs text-gray-500">{location.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const cn = (...c: (string | boolean | undefined)[]) => c.filter(Boolean).join(' ');

// ========== UI 컴포넌트 ==========
const Button = ({ variant = 'primary', size = 'md', leftIcon, rightIcon, children, className, type = 'button', ...props }: any) => {
  const v: any = { primary: 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90', outline: 'border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300', accent: 'bg-[#fab803] text-gray-900 hover:bg-[#fab803]/90', ghost: 'bg-transparent text-gray-600 hover:bg-gray-100' };
  const s: any = { sm: 'px-3 py-2 text-sm', md: 'px-4 py-3 text-sm', lg: 'px-6 py-4 text-base' };
  return <motion.button type={type} whileTap={{ scale: props.disabled ? 1 : 0.98 }} className={cn('inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed', v[variant], s[size], className)} {...props}>{leftIcon}{children}{rightIcon}</motion.button>;
};

const Input = ({ label, leftIcon, required, className, ...props }: any) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
    <div className="relative">
      {leftIcon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>}
      <input className={cn('w-full rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 py-3.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 focus:border-[#1a2867] hover:border-gray-300', leftIcon ? 'pl-11 pr-4' : 'px-4', className)} {...props} />
    </div>
  </div>
);

const AlertBox = ({ type = 'info', title, children }: any) => {
  const s: any = { 
    info: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-800' }, 
    warning: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-800' },
    error: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800' }
  }[type];
  return <div className={cn('flex gap-3 p-4 rounded-xl border', s.bg, s.border)}><div className={cn('text-sm', s.text)}>{title && <p className="font-medium mb-1">{title}</p>}{children}</div></div>;
};

// 타임라인 아이템 컴포넌트 (Timeline item component for delivery simulation)
const TimelineItem = ({ label, weeks, color, cumulativeWeeks }: { label: string; weeks: number; color: string; cumulativeWeeks?: number }) => {
  // 예상 완료 날짜 계산 (Calculate estimated completion date)
  const getEstimatedDate = () => {
    if (cumulativeWeeks === undefined) return '';
    const today = new Date();
    const estimatedDate = new Date(today.getTime() + cumulativeWeeks * 7 * 24 * 60 * 60 * 1000);
    const year = String(estimatedDate.getFullYear()).slice(2); // 26
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

// 가이드 패널 컴포넌트
const GuidePanel = ({ isOpen, onClose, guideKey }: any) => {
  const guide = GUIDE_DATA[guideKey as keyof typeof GUIDE_DATA];
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0); // 슬라이드 인덱스 상태 (Slide index state)
  const [showMoreStates, setShowMoreStates] = useState<Record<number, boolean>>({}); // 더보기 상태 관리 (Show more states)
  const [originLabelConfirmed, setOriginLabelConfirmed] = useState<boolean>(false); // 원산지 라벨 가이드 확인 상태 (Origin label guide confirmation state)
  
  if (!guide) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-[60]"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#1a2867]">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-white" />
                <h3 className="font-semibold text-white">{guideKey === 'productType' || guideKey === 'additionalRequest' ? guide.title : guide.title + ' 가이드'}</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {(guide.subtitle || guide.description) && (
                <div className="space-y-2">
                </div>
              )}
              
              {/* KC 인증 가이드 컴포넌트 - KC Certification Guide Component */}
              {guideKey === 'kcCertification' && (
                <KCCertificationGuide />
              )}
              
              {/* 원산지 라벨 가이드 컴포넌트 - Origin Label Guide Component */}
              {guideKey === 'originLabel' && (
                <OriginLabelGuide onConfirmationChange={setOriginLabelConfirmed} />
              )}
              
              {/* 표시 사항 표기 방식 가이드 컴포넌트 - Labeling Method Guide Component */}
              {guideKey === 'labelingMethod' && (
                <LabelingMethodGuide />
              )}
              
              {guide.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  {/* KC 인증 가이드, 원산지 라벨 가이드, 표시 사항 표기 방식 가이드 특별 렌더링 - Special rendering for KC Certification Guide, Origin Label Guide, and Labeling Method Guide */}
                  {(guideKey === 'kcCertification' || guideKey === 'originLabel' || guideKey === 'labelingMethod') ? null : /* designSlides가 있는 경우 (슬라이드 방식의 예시 디자인 → 실제 제품 섹션) */
                  section.designSlides ? (
                    <>
                      {/* 슬라이드 컨트롤러 - Slide controller */}
                      <div className="relative">
                        {/* 예시 디자인 이미지 슬라이드 - Design image slide */}
                        <motion.div
                          key={currentSlideIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedImage(section.designSlides[currentSlideIndex].designImage)}
                          className="relative aspect-[16/9] rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer group"
                        >
                          <img src={section.designSlides[currentSlideIndex].designImage.url} alt={section.designSlides[currentSlideIndex].designImage.caption} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                            <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-white text-xs font-medium">{section.designSlides[currentSlideIndex].designImage.caption}</p>
                          </div>
                        </motion.div>
                        
                        {/* 슬라이드 이전/다음 버튼 - Slide prev/next buttons */}
                        <button
                          onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? section.designSlides.length - 1 : prev - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all z-10"
                        >
                          <ArrowLeft className="w-4 h-4 text-gray-900" />
                        </button>
                        <button
                          onClick={() => setCurrentSlideIndex((prev) => (prev === section.designSlides.length - 1 ? 0 : prev + 1))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all z-10"
                        >
                          <ArrowRight className="w-4 h-4 text-gray-900" />
                        </button>
                      </div>
                      
                      {/* 슬라이드 인디케이터 - Slide indicators */}
                      <div className="flex justify-center gap-2">
                        {section.designSlides.map((_: any, slideIdx: number) => (
                          <button
                            key={slideIdx}
                            onClick={() => setCurrentSlideIndex(slideIdx)}
                            className={cn(
                              'w-2 h-2 rounded-full transition-all',
                              slideIdx === currentSlideIndex ? 'bg-[#fab803] w-6' : 'bg-gray-300'
                            )}
                          />
                        ))}
                      </div>
                      
                      {/* 실제 제품 이미지들 2x2 그리드 - Actual product images in 2x2 grid */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`product-${currentSlideIndex}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="grid grid-cols-2 gap-3"
                        >
                          {section.designSlides[currentSlideIndex].productImages.map((img: any, imgIdx: number) => (
                            <motion.div
                              key={imgIdx}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setSelectedImage(img)}
                              className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer group"
                            >
                              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-white text-xs font-medium">{img.caption}</p>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                      
                      {/* 설명 - Description */}
                      {section.description && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{section.description}</pre>
                        </div>
                      )}
                    </>
                  ) : section.designImage ? (
                    <>
                      {/* 예시 디자인 이미지 - Design image (단일) */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedImage(section.designImage)}
                        className="relative aspect-[16/9] rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer group"
                      >
                        <img src={section.designImage.url} alt={section.designImage.caption} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-white text-xs font-medium">{section.designImage.caption}</p>
                        </div>
                      </motion.div>
                      
                      {/* 실제 제품 이미지들 2x2 그리드 - Actual product images in 2x2 grid */}
                      {section.productImages && (
                        <div className="grid grid-cols-2 gap-3">
                          {section.productImages.map((img, imgIdx) => (
                            <motion.div
                              key={imgIdx}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setSelectedImage(img)}
                              className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer group"
                            >
                              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-white text-xs font-medium">{img.caption}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      
                      {/* 설명 - Description */}
                      {section.description && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{section.description}</pre>
                        </div>
                      )}
                    </>
                  ) : section.gridImages ? (
                    /* gridImages가 있는 경우 (2x2 그리드 섹션) - For 2x2 grid sections with gridImages */
                    <>
                      {/* 섹션 타이틀 - Section title */}
                      {section.title && (
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                      )}
                      
                      {/* 상단 설명 - Top description */}
                      {section.topDescription && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-3">
                          <p className="text-sm text-gray-700">{section.topDescription}</p>
                        </div>
                      )}
                      
                      {/* 2x2 그리드 - 2x2 Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {section.gridImages
                          .slice(0, section.showMoreButton && !showMoreStates[idx] ? section.initialShowCount || section.gridImages.length : section.gridImages.length)
                          .map((img: any, imgIdx: number) => (
                            <motion.div
                              key={imgIdx}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setSelectedImage(img)}
                              className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer group"
                            >
                              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-white text-xs font-medium">{img.caption}</p>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                      
                      {/* 더보기 버튼 - Show more button */}
                      {section.showMoreButton && section.gridImages.length > (section.initialShowCount || 4) && (
                        <button
                          onClick={() => setShowMoreStates(prev => ({ ...prev, [idx]: !prev[idx] }))}
                          className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
                        >
                          {showMoreStates[idx] ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              접기
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              더 보기
                            </>
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    /* images가 있는 경우 (일반 섹션) - For regular sections with images array */
                    <>
                      {/* 섹션 타이틀 - Section title */}
                      {section.title && (
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h3>
                      )}
                      
                      {section.images && (
                        <>
                          {/* 슬라이드 형식 (wide layout이고 여러 이미지가 있는 경우) - Slide format for wide layout with multiple images */}
                          {section.images && section.images.length > 1 && section.images[0]?.layout === 'wide' ? (
                        <div className="relative">
                          {section.images[currentSlideIndex] && (
                            <motion.div
                              key={`slide-${idx}-${currentSlideIndex}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setSelectedImage(section.images[currentSlideIndex])}
                              className="relative aspect-[16/9] rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer group"
                            >
                              <img src={section.images[currentSlideIndex].url} alt={section.images[currentSlideIndex].caption} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-white text-xs font-medium">{section.images[currentSlideIndex].caption}</p>
                              </div>
                            </motion.div>
                          )}
                          
                          {/* 슬라이드 컨트롤 - Slide controls */}
                          <div className="flex items-center justify-between mt-3">
                            <button
                              onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? section.images.length - 1 : prev - 1))}
                              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <ArrowLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            
                            <div className="text-sm text-gray-600">
                              {currentSlideIndex + 1} / {section.images.length}
                            </div>
                            
                            <button
                              onClick={() => setCurrentSlideIndex((prev) => (prev === section.images.length - 1 ? 0 : prev + 1))}
                              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <ArrowRight className="w-5 h-5 text-gray-700" />
                            </button>
                          </div>
                        </div>
                      ) : section.images ? (
                        /* 일반 그리드 형식 - Regular grid format */
                        <div className={cn('grid gap-3', section.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
                          {section.images.map((img, imgIdx) => img && (
                            <motion.div
                              key={imgIdx}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => setSelectedImage(img)}
                              className={cn(
                                'relative rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer group',
                                img.layout === 'wide' ? 'aspect-[16/9]' : 'aspect-square'
                              )}
                            >
                              <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                <p className="text-white text-xs font-medium">{img.caption}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : null}
                        </>
                      )}
                      
                      {section.description && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{section.description}</pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={onClose} 
                className="w-full"
                disabled={guideKey === 'originLabel' && !originLabelConfirmed}
                style={{
                  opacity: guideKey === 'originLabel' && !originLabelConfirmed ? 0.5 : 1,
                  cursor: guideKey === 'originLabel' && !originLabelConfirmed ? 'not-allowed' : 'pointer'
                }}
              >
                확인했어요!
              </Button>
              {guideKey === 'originLabel' && !originLabelConfirmed && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  위의 2가지 항목을 모두 확인해주세요
                </p>
              )}
            </div>
          </motion.div>
          
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 bg-black/90 z-[80] flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="relative max-w-3xl max-h-[90vh]"
                >
                  <img src={selectedImage.url} alt={selectedImage.caption} className="max-w-full max-h-[80vh] object-contain rounded-lg" />
                  <div className="text-white text-center mt-4">
                    <p className="font-medium">{selectedImage.caption}</p>
                    {selectedImage.description && (
                      <>
                        <div className="w-full h-px bg-white/30 my-3"></div>
                        <p className="text-sm text-white/90">{selectedImage.description}</p>
                      </>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-12 right-0 p-2 bg-white/20 hover:bg-white/30 rounded-full"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

const GuideButton = ({ onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:gap-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-900 bg-[#fab803] hover:bg-[#fab803]/95 rounded-lg transition-all shadow-md"
  >
    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    <span>가이드 보기</span>
  </button>
);

const ImageModal = ({ isOpen, onClose, image, title }: any) => {
  const [currentSlide, setCurrentSlide] = useState(0); // 슬라이드 인덱스 (Slide index)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null); // 확대된 이미지 (Zoomed image)
  
  // 원단 정보 찾기 (Find fabric info)
  const fabricInfo = title ? FABRIC_OPTIONS.find(f => f.name === title) : null;
  const hasExamples = fabricInfo?.exampleImages && fabricInfo.exampleImages.length > 0;
  
  // 라벨 정보 찾기 (Find label info)
  const labelInfo = title ? LABEL_OPTIONS.find(l => l.name === title) : null;
  
  // 자동 슬라이드 (Auto slide)
  useEffect(() => {
    if (!isOpen || !hasExamples) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % fabricInfo.exampleImages.length);
    }, 3000); // 3초마다 자동 슬라이드 (Auto slide every 3 seconds)
    
    return () => clearInterval(interval);
  }, [isOpen, hasExamples, fabricInfo]);
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* 확대 이미지 모달 (Zoomed image modal) */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl max-h-[95vh]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(null);
                }}
                className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={zoomedImage}
                alt="확대 이미지"
                className="max-w-full max-h-[95vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 메인 모달 (Main modal) */}
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl overflow-y-auto"
        >
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={onClose}
              className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-900" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {/* 제목 (Title) */}
            {title && (
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            )}
            
            {/* 원본 이미지 (Original image) */}
            {image && !fabricInfo && (
              <div className="flex justify-center">
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 w-1/2">
                  <img
                    src={image}
                    alt="확대 이미지"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            )}
            
            {/* 구분선 (Divider) */}
            {(labelInfo?.description || hasExamples) && (
              <div className="border-t-2 border-gray-100" />
            )}
            
            {/* 라벨 설명 (Label description) */}
            {labelInfo?.description && (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{labelInfo.description}</p>
                </div>
              </div>
            )}
            
            {/* 예시 이미지와 설명 (Example images and description for fabric) */}
            {hasExamples && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">제작 예시</h4>
                
                {/* 2x1 그리드 슬라이드 (2x1 grid slide) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`slide-${currentSlide}`}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group cursor-pointer"
                      onClick={() => setZoomedImage(fabricInfo.exampleImages[currentSlide])}
                    >
                      <img
                        src={fabricInfo.exampleImages[currentSlide]}
                        alt={`예시 ${currentSlide + 1}-1`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    
                    <div
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group cursor-pointer"
                      onClick={() => setZoomedImage(fabricInfo.exampleImages[(currentSlide + 1) % fabricInfo.exampleImages.length])}
                    >
                      <img
                        src={fabricInfo.exampleImages[(currentSlide + 1) % fabricInfo.exampleImages.length]}
                        alt={`예시 ${currentSlide + 1}-2`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* 슬라이드 인디케이터 (Slide indicators) */}
                <div className="flex justify-center gap-2">
                  {fabricInfo.exampleImages.map((_: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        idx === currentSlide ? 'bg-[#fab803] w-6' : 'bg-gray-300'
                      )}
                    />
                  ))}
                </div>
                
                {/* 설명 (Description) */}
                {fabricInfo.description && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700">{fabricInfo.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    </>
  );
};

const SelectCard = ({ name, image, desc, selected, disabled, onSelect, onZoom, isBest, isAI }: any) => {
  if (!image) return (
    <motion.button type="button" onClick={onSelect} disabled={disabled} whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn('relative rounded-xl border-2 px-4 py-2.5 transition-all text-sm font-medium w-full', selected ? 'border-[#fab803] bg-[#fab803]/5 text-gray-900' : disabled ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300')}>
      {name}
      {isBest && <span className="absolute -top-2 left-2 px-2 py-0.5 bg-[#fab803] text-gray-900 text-[10px] font-bold rounded">BEST</span>}
      {selected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#fab803] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-gray-900" /></motion.div>}
    </motion.button>
  );
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }} 
      className={cn('relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all group', selected ? 'border-[#fab803] shadow-md' : 'border-gray-200 hover:border-gray-300')}
    >
      <motion.div 
        className="aspect-square relative overflow-hidden bg-gray-100" 
        onClick={onSelect}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ originY: 0 }}
      >
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        {isBest && <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#fab803] text-gray-900 text-[10px] font-bold rounded shadow-md z-10">BEST</span>}
        <div className={cn('absolute inset-0 transition-all', selected ? 'bg-[#1a2867]/60' : 'bg-black/0 group-hover:bg-black/40')}>
          {selected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><div className="w-10 h-10 bg-[#fab803] rounded-full flex items-center justify-center shadow-lg"><Check className="w-5 h-5 text-gray-900" /></div></motion.div>}
        </div>
        {onZoom && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onZoom();
            }}
            className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <Search className="w-4 h-4 text-gray-900" />
          </button>
        )}
      </motion.div>
      <div className="p-2.5 bg-white border-t border-gray-100"><p className={cn('text-xs font-medium text-center truncate', selected ? 'text-gray-900' : 'text-gray-600')}>{name}</p></div>
    </motion.div>
  );
};

// ========== AI 파일 미리보기 컴포넌트 (인라인 프롬프트 입력) ==========
const AIFilePreview = ({ filePreview, fileIndex, productIndex, onGenerate, onRemove, isGenerating }: {
  filePreview: FilePreview;
  fileIndex: number;
  productIndex: number;
  onGenerate: (productIndex: number, fileIndex: number, prompt: string) => void;
  onRemove: (productIndex: number, fileIndex: number) => void;
  isGenerating: boolean;
}) => {
  const [prompt, setPrompt] = useState('해당 이미지를 실제 봉제 인형으로 만들어줘!');

  const handleGenerate = () => {
    if (isGenerating) return;
    onGenerate(productIndex, fileIndex, prompt || '봉제 인형 스타일로 변환');
    setPrompt('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
    >
      {/* 이미지 미리보기 */}
      <div className="relative aspect-square">
        {filePreview.preview ? (
          <img
            src={filePreview.preview}
            alt={filePreview.file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {/* 로딩 오버레이 */}
        {isGenerating && (
          <div className="absolute inset-0 bg-[#1a2867]/80 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-[#fab803]" />
            </motion.div>
            <p className="text-white text-sm mt-3 font-medium">AI 생성 중...</p>
          </div>
        )}
        
        {/* 삭제 버튼 */}
        <button
          type="button"
          onClick={() => onRemove(productIndex, fileIndex)}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      
      {/* 파일명 */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-600 truncate">{filePreview.file.name}</p>
      </div>
      
      {/* 인라인 프롬프트 입력 */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex flex-col gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="AI 프롬프트 입력..."
            disabled={isGenerating}
            rows={1}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fab803]/20 focus:border-[#fab803] disabled:bg-gray-100 disabled:cursor-not-allowed resize-none min-h-[40px] max-h-[200px] overflow-y-auto"
            style={{ height: 'auto' }}
            onInput={(e: any) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
            }}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-[#fab803] to-[#1a2867] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI 목업 생성하기</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ========== AI 이미지 에디터 컴포넌트 ==========
type DrawTool = 'brush' | 'rectangle' | 'circle';

const AIImageEditor = ({ imageUrl, onGenerate, onClose, isGenerating }: {
  imageUrl: string;
  onGenerate: (maskData: string, prompt: string) => void;
  onClose: () => void;
  isGenerating: boolean;
}) => {
  const [prompt, setPrompt] = useState('');
  const [brushSize, setBrushSize] = useState(5);
  const [drawTool, setDrawTool] = useState<DrawTool>('brush');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const shapeStartRef = useRef<{ x: number; y: number } | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // 히스토리에 현재 상태 저장
  const saveToHistory = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // 되돌리기
  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;
    
    const newIndex = historyIndex - 1;
    if (newIndex >= 0 && history[newIndex]) {
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    } else {
      ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      setHistoryIndex(-1);
    }
  }, [historyIndex, history]);

  // 이미지 로드 및 캔버스 초기화
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      
      const container = containerRef.current;
      if (container) {
        const maxWidth = container.clientWidth - 48;
        const maxHeight = 400;
        
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }
        
        setCanvasSize({ width, height });
        setImageLoaded(true);
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // 캔버스에 이미지 그리기
  useEffect(() => {
    if (imageLoaded && canvasRef.current && maskCanvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const maskCanvas = maskCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const maskCtx = maskCanvas.getContext('2d');
      
      if (ctx && maskCtx) {
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        maskCanvas.width = canvasSize.width;
        maskCanvas.height = canvasSize.height;
        
        ctx.drawImage(imageRef.current, 0, 0, canvasSize.width, canvasSize.height);
        maskCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        
        // 임시 캔버스 생성
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasSize.width;
        tempCanvas.height = canvasSize.height;
        tempCanvasRef.current = tempCanvas;
        
        // 초기 히스토리 설정
        setHistory([]);
        setHistoryIndex(-1);
      }
    }
  }, [imageLoaded, canvasSize]);

  // 마우스/터치 좌표 계산
  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  // 브러시로 선 그리기 (내부 채움, 실선) - 두꺼운 원형으로 채워진 선
  const drawBrushLine = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    // 두 점 사이의 거리 계산
    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const steps = Math.max(Math.ceil(dist / 2), 1);
    
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [brushSize]);

  // 점 그리기 (내부 채움)
  const drawDot = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [brushSize]);

  // 사각형 그리기 (테두리만, 실선)
  const drawRectangle = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, preview: boolean = false) => {
    ctx.strokeStyle = preview ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 3;
    ctx.setLineDash([]); // 실선
    ctx.beginPath();
    ctx.rect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    ctx.stroke();
  }, []);

  // 원 그리기 (테두리만, 실선)
  const drawCircle = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, preview: boolean = false) => {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const radiusX = Math.abs(x2 - x1) / 2;
    const radiusY = Math.abs(y2 - y1) / 2;
    
    ctx.strokeStyle = preview ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 3;
    ctx.setLineDash([]); // 실선
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
  }, []);

  // 그리기 시작
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    
    if (drawTool === 'brush') {
      lastPosRef.current = { x, y };
      drawDot(ctx, x, y);
    } else {
      shapeStartRef.current = { x, y };
      // 임시 캔버스에 현재 상태 저장
      if (tempCanvasRef.current) {
        const tempCtx = tempCanvasRef.current.getContext('2d');
        if (tempCtx) {
          tempCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
          tempCtx.drawImage(maskCanvas, 0, 0);
        }
      }
    }
  }, [drawTool, getCoordinates, drawDot, canvasSize]);

  // 그리기 중
  const handleDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    
    if (drawTool === 'brush') {
      if (lastPosRef.current) {
        drawBrushLine(ctx, lastPosRef.current.x, lastPosRef.current.y, x, y);
      }
      lastPosRef.current = { x, y };
    } else if (shapeStartRef.current) {
      // 임시 캔버스에서 복원 후 미리보기 그리기
      if (tempCanvasRef.current) {
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.drawImage(tempCanvasRef.current, 0, 0);
      }
      
      if (drawTool === 'rectangle') {
        drawRectangle(ctx, shapeStartRef.current.x, shapeStartRef.current.y, x, y, true);
      } else if (drawTool === 'circle') {
        drawCircle(ctx, shapeStartRef.current.x, shapeStartRef.current.y, x, y, true);
      }
    }
  }, [isDrawing, drawTool, getCoordinates, drawBrushLine, canvasSize, drawRectangle, drawCircle]);

  // 그리기 종료
  const stopDrawing = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    if (drawTool !== 'brush' && shapeStartRef.current && e) {
      const { x, y } = getCoordinates(e);
      
      // 임시 캔버스에서 복원
      if (tempCanvasRef.current) {
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.drawImage(tempCanvasRef.current, 0, 0);
      }
      
      // 최종 도형 그리기 (테두리만)
      if (drawTool === 'rectangle') {
        drawRectangle(ctx, shapeStartRef.current.x, shapeStartRef.current.y, x, y, false);
      } else if (drawTool === 'circle') {
        drawCircle(ctx, shapeStartRef.current.x, shapeStartRef.current.y, x, y, false);
      }
    }

    // 히스토리에 저장
    saveToHistory();

    setIsDrawing(false);
    lastPosRef.current = null;
    shapeStartRef.current = null;
  }, [isDrawing, drawTool, getCoordinates, canvasSize, drawRectangle, drawCircle, saveToHistory]);

  // 초기화
  const handleReset = useCallback(() => {
    if (maskCanvasRef.current) {
      const maskCanvas = maskCanvasRef.current;
      const ctx = maskCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        setHistory([]);
        setHistoryIndex(-1);
      }
    }
  }, []);

  // 생성
  const handleGenerate = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      const maskData = maskCanvas.toDataURL('image/png');
      onGenerate(maskData, prompt || '선택한 영역을 수정해주세요');
    }
  }, [onGenerate, prompt]);

  const toolButtons: { tool: DrawTool; icon: React.ReactNode; label: string }[] = [
    { tool: 'brush', icon: <Pencil className="w-4 h-4" />, label: '브러시' },
    { tool: 'rectangle', icon: <Square className="w-4 h-4" />, label: '사각형' },
    { tool: 'circle', icon: <Circle className="w-4 h-4" />, label: '원형' },
  ];

  return (
    <div className="flex flex-col h-full relative">
      {/* 툴바 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          {/* 도구 선택 */}
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
            {toolButtons.map(({ tool, icon, label }) => (
              <button
                key={tool}
                type="button"
                onClick={() => setDrawTool(tool)}
                disabled={isGenerating}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  drawTool === tool
                    ? 'bg-[#1a2867] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
          
          {/* 브러시 크기 (브러시 도구일 때만) */}
          {drawTool === 'brush' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">크기:</span>
              <input
                type="range"
                min={1}
                max={50}
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                disabled={isGenerating}
                className="w-24 accent-[#fab803]"
              />
              <span className="text-sm font-medium text-gray-900 w-12">{brushSize}px</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">색상:</span>
            <div className="w-6 h-6 rounded-full bg-red-500/50 border-2 border-red-500"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleUndo}
            disabled={historyIndex < 0 || isGenerating}
            leftIcon={<Undo2 className="w-4 h-4" />}
          >
            되돌리기
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset} disabled={isGenerating}>
            초기화
          </Button>
        </div>
      </div>
      
      {/* 이미지 영역 */}
      <div ref={containerRef} className="flex-1 flex items-center justify-center p-6 bg-gray-100 overflow-auto">
        {imageLoaded ? (
          <div className="relative shadow-lg rounded-lg overflow-hidden" style={{ width: canvasSize.width, height: canvasSize.height }}>
            {/* 배경 이미지 캔버스 */}
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className="absolute top-0 left-0 rounded-lg"
            />
            {/* 마스크 캔버스 (그리기용) */}
            <canvas
              ref={maskCanvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              onMouseDown={startDrawing}
              onMouseMove={handleDraw}
              onMouseUp={stopDrawing}
              onMouseLeave={() => stopDrawing()}
              onTouchStart={startDrawing}
              onTouchMove={handleDraw}
              onTouchEnd={stopDrawing}
              style={{ 
                cursor: isGenerating ? 'not-allowed' : 'crosshair',
                touchAction: 'none',
                pointerEvents: isGenerating ? 'none' : 'auto'
              }}
              className="absolute top-0 left-0 rounded-lg"
            />
            
            {/* 이미지 영역에만 로딩 오버레이 */}
            {isGenerating && (
              <div className="absolute inset-0 bg-[#1a2867]/90 z-10 flex flex-col items-center justify-center rounded-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-10 h-10 text-[#fab803]" />
                </motion.div>
                <p className="text-white text-lg mt-4 font-medium">AI 목업 생성 중...</p>
                <p className="text-white/70 text-sm mt-2">잠시만 기다려주세요!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-[#fab803]" />
            </motion.div>
          </div>
        )}
      </div>
      
      {/* 프롬프트 입력 */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white">
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="수정하고 싶은 내용을 설명해주세요. (예: 눈을 더 크게, 색상을 파란색으로), 요청 사항을 한 가지씩 적용하실 경우 더 정확한 미리 보기 생성이 가능합니다."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#fab803]/20 focus:border-[#fab803] resize-none"
              rows={2}
              disabled={isGenerating}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="accent"
              onClick={handleGenerate}
              leftIcon={<Wand2 className="w-4 h-4" />}
              disabled={isGenerating}
            >
              수정 적용
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 파일 업로드 컴포넌트
const FileUpload = ({ label, files, onFilesChange }: any) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    onFilesChange([...files, ...newFiles]);
    
    newFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviews(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_: any, i: number) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }} 
      animate={{ opacity: 1, height: 'auto' }} 
      exit={{ opacity: 0, height: 0 }}
      className="space-y-3 mt-4"
    >
      {label && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {/* 특정 3가지 경우에만 템플릿 다운로드 버튼 표시 (Show template download button only for 3 specific cases) */}
          {(label.includes('라벨 디자인 파일') || label.includes('스티커 디자인') || label.includes('행택 커스텀 디자인')) && (
            <button 
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1a2867] bg-white border border-[#1a2867] rounded-lg hover:bg-[#1a2867] hover:text-white transition-colors"
              onClick={() => {
                // UI only - 실제 다운로드는 구현되지 않음 (UI only - actual download not implemented)
              }}
            >
              <Download className="w-3.5 h-3.5" />
              기본 템플릿 다운로드
            </button>
          )}
        </div>
      )}
      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-[#1a2867] transition-all">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-6 h-6 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500"><span className="font-medium text-[#1a2867]">파일 선택</span> 또는 드래그</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (최대 10MB)</p>
        </div>
        <input type="file" multiple accept="image/*,.pdf" onChange={handleChange} className="hidden" />
      </label>
      
      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {files.map((file: File, i: number) => (
            <div key={i} className="relative group aspect-square">
              {previews[i] ? (
                <img src={previews[i]} alt={file.name} className="w-full h-full object-cover rounded-lg border border-gray-200" />
              ) : (
                <div className="w-full h-full rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate rounded-b-lg">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// AI 파일 업로드 컴포넌트 (AI 기능 포함)
const AIFileUploadArea = ({ 
  productIndex, 
  files, 
  filePreviews, 
  aiPreviews,
  fileGeneratingStates,
  aiPreviewGeneratingStates,
  selectedAIPreviews,
  sampleDeliveryMethod,
  onFilesChange, 
  onFilePreviewsChange,
  onGenerateAI,
  onRegenerateAI,
  onRemoveFile,
  onOpenEditor,
  onToggleAIPreviewSelection,
  onAttachSelectedAI,
  onZoomAIPreview,
  onUpdate
}: {
  productIndex: number;
  files: File[];
  filePreviews: FilePreview[];
  aiPreviews: AIPreview[];
  fileGeneratingStates: {[key: string]: boolean};
  aiPreviewGeneratingStates: {[key: string]: boolean};
  selectedAIPreviews: Set<string>;
  sampleDeliveryMethod: string;
  onFilesChange: (files: File[]) => void;
  onFilePreviewsChange: (previews: FilePreview[]) => void;
  onGenerateAI: (productIndex: number, fileIndex: number, prompt: string) => void;
  onRegenerateAI: (productIndex: number, previewId: string, prompt: string, fileIndex: number) => void;
  onRemoveFile: (productIndex: number, fileIndex: number) => void;
  onOpenEditor: (preview: AIPreview) => void;
  onToggleAIPreviewSelection: (previewId: string) => void;
  onAttachSelectedAI: () => void;
  onZoomAIPreview: (imageUrl: string, title: string) => void;
  onUpdate: (field: string, value: any) => void;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    onFilesChange([...files, ...newFiles]);
    
    newFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          onFilePreviewsChange([...filePreviews, { file, preview: reader.result as string }]);
        };
        reader.readAsDataURL(file);
      } else {
        onFilePreviewsChange([...filePreviews, { file, preview: '' }]);
      }
    });
    e.target.value = '';
  };

  const handleDownload = (preview: AIPreview) => {
    const link = document.createElement('a');
    link.href = preview.imageUrl;
    link.download = `ai-preview-${preview.id}.jpg`;
    link.click();
  };

  const handleRegenerate = (preview: AIPreview) => {
    onRegenerateAI(productIndex, preview.id, preview.prompt, preview.fileIndex);
  };

  const selectedCount = Array.from(selectedAIPreviews).filter(id => 
    aiPreviews.some(p => p.id === id)
  ).length;

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Upload className="w-4 h-4" />
        디자인 파일 업로드 & 샘플 전달
      </label>
      
      {/* 견적 요청 안내 (Quote request notice) */}
      <p className="text-sm text-gray-600 text-[13px]">
        하나의 견적 요청에는 한 가지 상품에 대한 견적 요청이 가능합니다. 추가 견적 문의는 하단 버튼을 통해 추가 작성해 주세요.
      </p>
      
      {/* 전달 방법 선택 (Delivery method selection) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onUpdate('sampleDeliveryMethod', 'file')}
          className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
            sampleDeliveryMethod === 'file'
              ? 'border-[#fab803] bg-[#fab803]/10 text-gray-900'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <Upload className="w-4 h-4 mx-auto mb-1" />
          디자인 파일 업로드
        </button>
        <button
          type="button"
          onClick={() => onUpdate('sampleDeliveryMethod', 'physical')}
          className={`px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
            sampleDeliveryMethod === 'physical'
              ? 'border-[#fab803] bg-[#fab803]/10 text-gray-900'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <Package className="w-4 h-4 mx-auto mb-1" />
          실물 샘플 발송
        </button>
      </div>
      
      {/* 디지털 파일 업로드 영역 (Digital file upload area) */}
      {sampleDeliveryMethod === 'file' && (
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-[#1a2867] transition-all">
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500"><span className="font-medium text-[#1a2867]">파일 선택</span> 또는 드래그</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF (최대 10MB)</p>
          </div>
          <input type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
        </label>
      )}
      
      {/* 실물 샘플 발송 주소 안내 (Physical sample delivery address) */}
      {sampleDeliveryMethod === 'physical' && (
        <div className="space-y-4">
          {/* 실물 샘플 사진 업로드 (Physical sample photo upload) */}
          <div className="space-y-3">
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-[#1a2867] transition-all">
              <div className="flex flex-col items-center justify-center">
                <Camera className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500"><span className="font-medium text-[#1a2867]">사진 촬영</span> 또는 이미지 업로드</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG (최대 10MB)</p>
              </div>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
          
          {/* 실물 샘플 파일 미리보기 (Physical sample file preview) */}
          {filePreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {filePreviews.map((item, fileIndex) => (
                <div key={fileIndex} className="relative group rounded-xl overflow-hidden border-2 border-gray-200">
                  <div className="aspect-square relative">
                    {item.preview ? (
                      <img src={item.preview} alt={item.file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveFile(productIndex, fileIndex)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate">{item.file.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="bg-gradient-to-br from-[#1a2867]/5 to-[#fab803]/5 border-2 border-[#fab803]/30 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[rgb(26,40,103)] flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 text-[15px]">배송 주소 안내</h4>
                <p className="text-sm text-gray-600 text-[13px]">
                  실물 샘플 수령 후 견적서를 전달드립니다. (샘플 수령일 기준 약 5일 소요)
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 space-y-2.5">
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-[#1a2867] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">상호명</p>
                  <p className="text-sm font-semibold text-gray-900">쿠디솜</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#1a2867] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">연락처</p>
                  <p className="text-sm font-semibold text-gray-900">1666-0211</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Package className="w-4 h-4 text-[#1a2867] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">주소</p>
                  <p className="text-sm font-semibold text-gray-900">인천광역시 남동구 서창남로 45, 3층</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 파일 미리보기 + AI 기능 (File upload mode only) */}
      {sampleDeliveryMethod === 'file' && filePreviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Sparkles className="w-4 h-4 text-[#fab803]" />
            <p className="text-sm text-gray-600">단순 스케치, 이미지로 AI 목업 이미지를 생성할 수 있습니다.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filePreviews.map((item, fileIndex) => (
              <AIFilePreview
                key={fileIndex}
                filePreview={item}
                fileIndex={fileIndex}
                productIndex={productIndex}
                onGenerate={onGenerateAI}
                onRemove={onRemoveFile}
                isGenerating={fileGeneratingStates[`${productIndex}-${fileIndex}`] || false}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* AI 미리보기 갤러리 - 정사각형, 호버 시 버튼+텍스트, 선택 기능, 확대 기능, 버전 표기 (File upload mode only) */}
      {sampleDeliveryMethod === 'file' && aiPreviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-gradient-to-br from-[#1a2867]/5 via-transparent to-[#fab803]/5 border-2 border-[#fab803]/20 rounded-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#fab803]" />
              생성 된 AI 목업 리스트 ({aiPreviews.length}개)
            </p>
            {selectedCount > 0 && (
              <Button
                variant="accent"
                size="sm"
                onClick={onAttachSelectedAI}
                leftIcon={<Check className="w-4 h-4" />}
              >
                선택한 이미지 사용 ({selectedCount})
              </Button>
            )}
          </div>
          
          {/* AI 이미지 안내 문구 (AI Image Notice) */}
          {selectedCount > 0 && (
            <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                생성형 AI 이미지의 특성 상 실제 샘플과 100% 동일하게 제작이 어려운 부분이 존재할 수 있으며, 차이가 존재할 수 있습니다.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {aiPreviews.map((preview) => {
              const isSelected = selectedAIPreviews.has(preview.id);
              const isRegenerating = aiPreviewGeneratingStates[preview.id] || false;
              return (
                <div 
                  key={preview.id}
                  className={cn(
                    "relative group rounded-xl overflow-hidden border-2 transition-all",
                    isSelected ? "border-[#fab803] ring-2 ring-[#fab803]/30" : "border-gray-200 hover:border-[#fab803]"
                  )}
                >
                  {/* 정사각형 이미지 */}
                  <div className="aspect-square relative">
                    <img
                      src={preview.imageUrl}
                      alt={`AI Preview - ${preview.prompt}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* 재생성 로딩 오버레이 */}
                    {isRegenerating && (
                      <div className="absolute inset-0 bg-[#1a2867]/80 flex flex-col items-center justify-center z-20">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-8 h-8 text-[#fab803]" />
                        </motion.div>
                        <p className="text-white text-sm mt-3 font-medium">AI 생성 중...</p>
                      </div>
                    )}
                    
                    {/* 선택 체크박스 */}
                    <button
                      type="button"
                      onClick={() => onToggleAIPreviewSelection(preview.id)}
                      className={cn(
                        "absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all z-10",
                        isSelected
                          ? "bg-[#fab803] border-[#fab803]"
                          : "bg-white/80 border-gray-300 hover:border-[#fab803]"
                      )}
                    >
                      {isSelected && <Check className="w-4 h-4 text-gray-900" />}
                    </button>
                    
                    {/* 확대 버튼 */}
                    <button
                      type="button"
                      onClick={() => onZoomAIPreview(preview.imageUrl, preview.prompt)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all z-10"
                    >
                      <ZoomIn className="w-4 h-4 text-gray-900" />
                    </button>
                    
                    {/* 버전 표기 */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded z-10">
                      VER.{preview.version}
                    </div>
                    
                    {/* 호버 오버레이 + 버튼들 (텍스트 포함) */}
                    {!isRegenerating && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownload(preview)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          다운로드
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEditor(preview)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#fab803] text-gray-900 rounded-lg hover:bg-[#fab803]/90 transition-colors text-sm font-medium"
                        >
                          <Edit3 className="w-4 h-4" />
                          편집
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRegenerate(preview)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#1a2867] text-white rounded-lg hover:bg-[#1a2867]/90 transition-colors text-sm font-medium"
                        >
                          <RefreshCw className="w-4 h-4" />
                          재생성
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* 프롬프트 표시 */}
                  <div className="p-3 bg-white border-t border-gray-100">
                    <p className="text-xs text-gray-600 truncate" title={preview.prompt}>
                      {preview.prompt}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(preview.timestamp).toLocaleString('ko-KR')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const Collapsible = ({ icon, title, isOpen, isComplete, selectedValue, onToggle, onComplete, onGuide, alertMessage, children }: any) => (
  <div className={cn('rounded-2xl border transition-all', isOpen ? 'border-gray-200 bg-white shadow-sm' : isComplete ? 'border-green-100 bg-green-50/30' : 'border-gray-100 bg-gray-50/50')}>
    <div className="w-full px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50/50 rounded-xl sm:rounded-2xl transition-colors">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 cursor-pointer" onClick={onToggle}>
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', isComplete ? 'bg-green-100 text-green-600' : isOpen ? 'bg-[#1a2867]/10 text-[#1a2867]' : 'bg-gray-100 text-gray-500')}>{isComplete && !isOpen ? <Check className="w-4 h-4" /> : icon}</div>
        <span className={cn('font-medium', isOpen ? 'text-gray-900' : 'text-gray-700')}>{title}</span>
        {!isOpen && selectedValue && <span className="text-sm text-gray-500" style={{ marginLeft: '2px' }}>: {selectedValue}</span>}
      </div>
      <div className="flex items-center gap-2">
        {onGuide && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onGuide();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:gap-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-gray-900 bg-[#fab803] hover:bg-[#fab803]/95 rounded-lg transition-all shadow-md"
          >
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">가이드 보기</span>
          </button>
        )}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} onClick={onToggle} className="cursor-pointer"><ChevronDown className={cn('w-5 h-5', isOpen ? 'text-gray-600' : 'text-gray-400')} /></motion.div>
      </div>
    </div>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
          <div className="px-3 sm:px-5 pb-3 sm:pb-5 pt-1">
            <div className="pt-4 border-t border-gray-100">
              {alertMessage && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">{alertMessage}</p>
                </div>
              )}
              {children}
              {onComplete && isComplete && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex justify-center"><button type="button" onClick={onComplete} className="px-6 py-2.5 bg-[#1a2867] text-white text-sm font-medium rounded-full hover:bg-[#1a2867]/90 transition-all active:scale-[0.98]">선택 완료</button></motion.div>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ========== 커스텀 훅 ==========
function useProductForm() {
  const [products, setProducts] = useState<any[]>([{ ...INITIAL_PRODUCT, id: Date.now() }]);
  const [sections, setSections] = useState<any>({ 0: { ...INITIAL_SECTION } });

  const addProduct = () => { 
    const newId = Date.now() + Math.random();
    setProducts(p => [...p, { ...INITIAL_PRODUCT, id: newId }]); 
    setSections((s: any) => ({ ...s, [products.length]: { ...INITIAL_SECTION } })); 
  };
  const removeProduct = (i: number) => { if (products.length > 1) setProducts(p => p.filter((_, idx) => idx !== i)); };
  const updateProduct = (i: number, field: string, value: any) => { setProducts(p => { const n = [...p]; n[i] = { ...n[i], [field]: value }; return n; }); return true; };
  const toggleSection = (i: number, s: string) => setSections((prev: any) => ({ ...prev, [i]: { ...prev[i], [s]: !prev[i]?.[s] } }));
  
  const isComplete = (i: number, s: string) => {
    const p = products[i];
    if (!p) return false;
    switch (s) {
      case 'fabric': 
        if (!p.fabric) return false;
        if (p.fabric === '커스텀 원단' && (!p.fabricFiles || p.fabricFiles.length === 0)) return false;
        return true;
      case 'originLabel': 
        if (!p.originLabelMaterial) return false;
        // 커스텀인 경우: 소재 레퍼런스 파일이 필수 (Custom requires material reference files)
        if (p.originLabelMaterial === '커스텀') {
          if (!p.customLabelFiles || p.customLabelFiles.length === 0) return false;
        }
        // 커스텀 여부 선택 필수
        if (!p.originLabelCustom) return false;
        // 커스텀 디자인 "예" 선택 시 디자인 파일 업로드 필수 (모든 라벨 소재)
        if (p.originLabelCustom === '예') {
          if (!p.originLabelFiles || p.originLabelFiles.length === 0) return false;
        }
        return true;
      case 'labelingMethod': 
        if (!p.labelingMethod) return false;
        if (p.labelingMethod === '스티커') {
          if (!p.stickerCustom) return false;
          if (p.stickerCustom === '예' && (!p.stickerFiles || p.stickerFiles.length === 0)) return false;
          // 스티커 커스텀 "아니오" 선택 시 기본 디자인(화이트/투명) 선택 필수 (Sticker base design required when selecting "No" for custom)
          if (p.stickerCustom === '아니오' && !p.stickerBase) return false;
        }
        if (p.labelingMethod === '행택') {
          if (!p.tagStringCustom) return false;
          // 행택 커스텀 디자인 '예' 선택 시 디자인 파일 업로드 필수
          if (p.tagStringCustom === '예' && (!p.hangTagDesignFiles || p.hangTagDesignFiles.length === 0)) return false;
          if (!p.tagString) return false;
          // 투명 끈이나 화살촉 끈 선택 시 색상 선택 필수 (Color selection required for transparent or arrowhead strings)
          if ((p.tagString === '투명 끈' || p.tagString === '화살촉 끈') && !p.tagStringColor) return false;
          // 커스텀 끈 선택 시 소재 레퍼런스 파일 업로드 필수
          if (p.tagString === '커스텀 끈' && (!p.hangTagStringFiles || p.hangTagStringFiles.length === 0)) return false;
          // 행택 부착 위치 선택 필수 (Hang tag attachment location required)
          if (!p.tagAttachmentLocation) return false;
        }
        if (p.labelingMethod === '패키징 인쇄') {
          // 패키징 인쇄 선택 시 파일 업로드 필수 (File upload required for packaging print)
          if (!p.packagingPrintFiles || p.packagingPrintFiles.length === 0) return false;
        }
        return true;
      case 'filling': return !!p.filling;
      case 'keyring': 
        if (!p.keyring) return false;
        if (p.keyring === '커스텀 키링' && (!p.keyringFiles || p.keyringFiles.length === 0)) return false;
        return true;
      case 'packaging': 
        if (!p.packaging) return false;
        if (['풀컬러 박스', '창문형 박스', '커스텀 패키지'].includes(p.packaging) && (!p.packagingFiles || p.packagingFiles.length === 0)) return false;
        return true;
      case 'kcCertification': return !!p.kcCertification;
      default: return false;
    }
  };
  
  const completeSection = (i: number, current: string) => {
    const order = ['fabric', 'originLabel', 'labelingMethod', 'packaging', 'filling', 'keyring', 'kcCertification'];
    const currentIndex = order.indexOf(current);
    
    setSections((prev: any) => {
      const newSections = { ...prev, [i]: { ...prev[i], [current]: true } };
      
      // 바로 다음 섹션을 펼치기 (Open the next section immediately)
      if (currentIndex + 1 < order.length) {
        newSections[i][order[currentIndex + 1]] = false;
      }
      
      return newSections;
    });
  };

  const calcProgress = (i: number) => {
    const secs = ['fabric', 'originLabel', 'labelingMethod', 'packaging', 'filling', 'kcCertification'];
    return Math.round(secs.filter(s => isComplete(i, s)).length / secs.length * 100);
  };

  const copyPrevious = (i: number) => {
    if (i === 0) return;
    const prev = products[i - 1];
    setProducts(p => { const n = [...p]; n[i] = { ...n[i], fabric: prev.fabric, originLabelMaterial: prev.originLabelMaterial, originLabelCustom: prev.originLabelCustom, labelingMethod: prev.labelingMethod, packaging: prev.packaging, filling: prev.filling, kcCertification: prev.kcCertification, tagString: prev.tagString, tagStringColor: prev.tagStringColor, tagStringCustom: prev.tagStringCustom, stickerCustom: prev.stickerCustom, stickerBase: prev.stickerBase, quantities: prev.quantities ? prev.quantities.map((q: any) => ({ ...q, id: Date.now() + Math.random() })) : [{ id: Date.now(), value: 300 }] }; return n; });
  };

  return { products, sections, addProduct, removeProduct, updateProduct, toggleSection, completeSection, isComplete, calcProgress, copyPrevious };
}

// ========== AI 커스텀 훅 ==========
function useAIFeatures(products: any[], updateProduct: (i: number, field: string, value: any) => boolean) {
  const [filePreviews, setFilePreviews] = useState<FilePreview[][]>([[]]);
  const [aiPreviews, setAiPreviews] = useState<AIPreview[][]>([[]]);
  const [fileGeneratingStates, setFileGeneratingStates] = useState<{[key: string]: boolean}>({});
  const [aiPreviewGeneratingStates, setAiPreviewGeneratingStates] = useState<{[key: string]: boolean}>({});
  const [selectedAIPreviews, setSelectedAIPreviews] = useState<Set<string>>(new Set());
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [editingPreview, setEditingPreview] = useState<AIPreview | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorGenerating, setEditorGenerating] = useState(false);

  const updateFilePreviews = (productIndex: number, previews: FilePreview[]) => {
    setFilePreviews(prev => {
      const updated = [...prev];
      while (updated.length <= productIndex) {
        updated.push([]);
      }
      updated[productIndex] = previews;
      return updated;
    });
  };

  const removeFile = (productIndex: number, fileIndex: number) => {
    const newFiles = products[productIndex].files.filter((_: any, i: number) => i !== fileIndex);
    updateProduct(productIndex, 'files', newFiles);
    
    setFilePreviews(prev => {
      const updated = [...prev];
      if (updated[productIndex]) {
        updated[productIndex] = updated[productIndex].filter((_, i) => i !== fileIndex);
      }
      return updated;
    });
  };

  // 버전 계산 함수
  const getNextVersion = (productIndex: number, fileIndex: number) => {
    const existingPreviews = aiPreviews[productIndex] || [];
    const sameFileVersions = existingPreviews.filter(p => p.fileIndex === fileIndex);
    return sameFileVersions.length + 1;
  };

  const generateAIPreview = async (productIndex: number, fileIndex: number, prompt: string) => {
    const key = `${productIndex}-${fileIndex}`;
    setFileGeneratingStates(prev => ({ ...prev, [key]: true }));
    setCurrentProductIndex(productIndex);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockImages = [
      'https://images.unsplash.com/photo-1612544408897-36d451f03d71?w=400',
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400'
    ];

    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    const version = getNextVersion(productIndex, fileIndex);

    const newPreview: AIPreview = {
      id: Date.now().toString(),
      imageUrl: randomImage,
      style: '사용자 정의',
      timestamp: Date.now(),
      fileIndex: fileIndex,
      prompt: prompt,
      originalFileName: filePreviews[productIndex]?.[fileIndex]?.file?.name || 'unknown',
      version: version
    };

    setAiPreviews(prev => {
      const updated = [...prev];
      while (updated.length <= productIndex) {
        updated.push([]);
      }
      updated[productIndex] = [newPreview, ...updated[productIndex]];
      return updated;
    });

    setFileGeneratingStates(prev => ({ ...prev, [key]: false }));
  };

  // 재생성 함수 (AI 미리보기 썸네일에서 로딩 표시)
  const regenerateAIPreview = async (productIndex: number, previewId: string, prompt: string, fileIndex: number) => {
    setAiPreviewGeneratingStates(prev => ({ ...prev, [previewId]: true }));
    setCurrentProductIndex(productIndex);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockImages = [
      'https://images.unsplash.com/photo-1612544408897-36d451f03d71?w=400',
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400'
    ];

    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    const version = getNextVersion(productIndex, fileIndex);

    const newPreview: AIPreview = {
      id: Date.now().toString(),
      imageUrl: randomImage,
      style: '사용자 정의',
      timestamp: Date.now(),
      fileIndex: fileIndex,
      prompt: prompt,
      originalFileName: filePreviews[productIndex]?.[fileIndex]?.file?.name || 'unknown',
      version: version
    };

    setAiPreviews(prev => {
      const updated = [...prev];
      if (!updated[productIndex]) {
        updated[productIndex] = [];
      }
      updated[productIndex] = [newPreview, ...updated[productIndex]];
      return updated;
    });

    setAiPreviewGeneratingStates(prev => ({ ...prev, [previewId]: false }));
  };

  const handleAIEditorGenerate = async (maskData: string, prompt: string) => {
    if (!editingPreview) return;
    
    setEditorGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockImproved = 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400';
    const version = getNextVersion(currentProductIndex, editingPreview.fileIndex);

    const newPreview: AIPreview = {
      id: Date.now().toString(),
      imageUrl: mockImproved,
      style: editingPreview.style + ' (개선됨)',
      timestamp: Date.now(),
      fileIndex: editingPreview.fileIndex,
      prompt: prompt,
      originalFileName: editingPreview.originalFileName,
      version: version
    };

    setAiPreviews(prev => {
      const updated = [...prev];
      if (!updated[currentProductIndex]) {
        updated[currentProductIndex] = [];
      }
      updated[currentProductIndex] = [newPreview, ...updated[currentProductIndex]];
      return updated;
    });

    setEditorGenerating(false);
    setShowEditor(false);
    setEditingPreview(null);
  };

  const openEditor = (preview: AIPreview, productIndex: number) => {
    setEditingPreview(preview);
    setCurrentProductIndex(productIndex);
    setShowEditor(true);
    setEditorGenerating(false);
  };

  const toggleAIPreviewSelection = (previewId: string) => {
    setSelectedAIPreviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(previewId)) {
        newSet.delete(previewId);
      } else {
        newSet.add(previewId);
      }
      return newSet;
    });
  };

  // 선택한 AI 이미지 첨부 (검증 없이 바로 첨부)
  const attachSelectedAIImages = async (productIndex: number) => {
    const selectedPreviews = aiPreviews[productIndex]?.filter(p => selectedAIPreviews.has(p.id)) || [];
    
    if (selectedPreviews.length === 0) return;
    
    const newFiles: File[] = [];
    const newPreviews: FilePreview[] = [];
    
    for (const preview of selectedPreviews) {
      try {
        const response = await fetch(preview.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `ai-${preview.id}.jpg`, { type: 'image/jpeg' });
        newFiles.push(file);
        newPreviews.push({ file, preview: preview.imageUrl });
      } catch (error) {
        console.error('Failed to attach AI image:', error);
      }
    }
    
    if (newFiles.length > 0) {
      const currentFiles = products[productIndex].files || [];
      updateProduct(productIndex, 'files', [...currentFiles, ...newFiles]);
      
      setFilePreviews(prev => {
        const updated = [...prev];
        while (updated.length <= productIndex) {
          updated.push([]);
        }
        updated[productIndex] = [...updated[productIndex], ...newPreviews];
        return updated;
      });
    }
    
    // 선택 초기화
    setSelectedAIPreviews(new Set());
  };

  return {
    filePreviews,
    aiPreviews,
    fileGeneratingStates,
    aiPreviewGeneratingStates,
    selectedAIPreviews,
    currentProductIndex,
    editingPreview,
    showEditor,
    editorGenerating,
    setFilePreviews,
    updateFilePreviews,
    removeFile,
    generateAIPreview,
    regenerateAIPreview,
    handleAIEditorGenerate,
    openEditor,
    setShowEditor,
    setEditingPreview,
    toggleAIPreviewSelection,
    attachSelectedAIImages
  };
}

// ========== 이미지 확대 모달 컴포넌트 ==========
function ImageZoomModal({ imageUrl, onClose, title }: { imageUrl: string; onClose: () => void; title?: string }) {
  const [currentSlide, setCurrentSlide] = useState(0); // 슬라이드 인덱스 (Slide index)
  
  // 원단 정보 찾기 (Find fabric info)
  const fabricInfo = title ? FABRIC_OPTIONS.find(f => f.name === title) : null;
  const hasExamples = fabricInfo?.exampleImages && fabricInfo.exampleImages.length > 0;
  
  // 라벨 정보 찾기 (Find label info)
  const labelInfo = title ? LABEL_OPTIONS.find(l => l.name === title) : null;
  
  // 자동 슬라이드 (Auto slide)
  useEffect(() => {
    if (!hasExamples) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % fabricInfo.exampleImages.length);
    }, 3000); // 3초마다 자동 슬라이드 (Auto slide every 3 seconds)
    
    return () => clearInterval(interval);
  }, [hasExamples, fabricInfo]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 print:hidden"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6 space-y-4">
          {/* 제목 (Title) */}
          {title && (
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          )}
          
          {/* 원본 이미지 (Original image) */}
          <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
            <img
              src={imageUrl}
              alt="확대 이미지"
              className="w-full h-auto object-contain"
            />
          </div>
          
          {/* 구분선 (Divider) */}
          {(labelInfo?.description || hasExamples) && (
            <div className="border-t-2 border-gray-100 pt-4" />
          )}
          
          {/* 라벨 설명 (Label description) */}
          {labelInfo?.description && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">설명</h4>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{labelInfo.description}</p>
              </div>
            </div>
          )}
          
          {/* 예시 이미지와 설명 (Example images and description for fabric) */}
          {hasExamples && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">제작 예시</h4>
              
              {/* 2x1 그리드 슬라이드 (2x1 grid slide) */}
              <div className="grid grid-cols-2 gap-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`slide-${currentSlide}-1`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200"
                  >
                    <img
                      src={fabricInfo.exampleImages[currentSlide]}
                      alt={`예시 ${currentSlide + 1}-1`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`slide-${currentSlide}-2`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200"
                  >
                    <img
                      src={fabricInfo.exampleImages[(currentSlide + 1) % fabricInfo.exampleImages.length]}
                      alt={`예시 ${currentSlide + 1}-2`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* 슬라이드 인디케이터 (Slide indicators) */}
              <div className="flex justify-center gap-2">
                {fabricInfo.exampleImages.map((_: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      idx === currentSlide ? 'bg-[#fab803] w-6' : 'bg-gray-300'
                    )}
                  />
                ))}
              </div>
              
              {/* 설명 (Description) */}
              {fabricInfo.description && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700">{fabricInfo.description}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ========== 견적 제출 완료 화면 ==========
function SubmittedView({ basicInfo, products, onClose, onAddMore, onEdit }: any) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  
  const handlePrint = () => {
    window.print();
  };

  const handleAssignManager = () => {
    window.open('https://pf.kakao.com/_bxfxlRn/chat', '_blank');
  };

  // 컴포넌트 마운트 시 스크롤을 상단으로 이동
  useEffect(() => {
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {zoomImage && <ImageZoomModal imageUrl={zoomImage} onClose={() => setZoomImage(null)} />}
      </AnimatePresence>
      
      <div className="max-w-3xl mx-auto">
      {/* 완료 메시지 */}
      <div className="text-center mb-10 print:hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-[#fab803] rounded-full flex items-center justify-center"
          >
            <Check className="w-12 h-12 text-[#1a2867]" strokeWidth={3} />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3 text-[24px]">견적 요청이 완료되었습니다</h1>
          <p className="text-gray-500 text-lg text-[15px]">빠른 시일 내에 담당자가 연락드리겠습니다</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }} 
          className="mt-8 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-sm text-gray-700 border border-blue-100">
            <Mail className="w-4 h-4 text-blue-500" />
            기재해주신 연락처와 이메일로 알림이 전송됩니다
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 mt-6"
        >
          <button 
            onClick={handleAssignManager}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-xl font-medium transition-all shadow-sm text-[14px]"
          >
            <MessageCircle className="w-4 h-4" />
            담당 매니저 배정
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-xl font-medium transition-all shadow-sm text-[14px]"
          >
            <FileText className="w-4 h-4" />
            인쇄하기
          </button>
        </motion.div>
      </div>

      {/* 제출된 정보 요약 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border print:border-gray-300"
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-gray-50 to-white px-8 py-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 print:justify-center text-[20px]">
            <div className="w-10 h-10 rounded-xl bg-[#1a2867] flex items-center justify-center print:hidden">
              <FileText className="w-5 h-5 text-white" />
            </div>
            견적 요청서
          </h3>
        </div>

        <div className="p-8">
          {/* 기본 정보 */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-[#1a2867]" />
              <h4 className="font-bold text-gray-900">신청자 정보</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-gray-50/50 rounded-2xl p-6">
              <InfoRow label="구분" value={basicInfo.userType} />
              <InfoRow label="이름" value={basicInfo.name} />
              {basicInfo.companyName && <InfoRow label="회사명" value={basicInfo.companyName} />}
              <InfoRow label="연락처" value={basicInfo.phone} />
              <InfoRow label="이메일" value={basicInfo.email} />
            </div>
          </div>

          {/* 제품 정보 */}
          {products.map((product: any, index: number) => (
            <div key={product.id} className="mb-8 last:mb-0">
              <div className="flex items-center gap-2 mb-5">
                <Package className="w-5 h-5 text-[#1a2867]" />
                <h4 className="text-gray-900 font-normal font-bold">
                  제품 {index + 1}{product.productName && ` - ${product.productName}`}
                </h4>
              </div>
              
              {/* 첨부 이미지 또는 실물 샘플 발송 안내 (Attached files or physical sample delivery info) */}
              {product.sampleDeliveryMethod === 'physical' && (
                <div className="mb-6">
                  <div className="bg-gradient-to-br from-[#1a2867]/5 to-[#fab803]/5 border-2 border-[#fab803]/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-5 h-5 text-[#1a2867]" />
                      <p className="text-sm font-semibold text-gray-900">실물 샘플 발송 선택</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      고객님께서 실물 샘플을 발송하시기로 선택하셨습니다.
                    </p>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-[#1a2867] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">발송 주소</p>
                          <p className="text-sm font-semibold text-gray-900">인천광역시 남동구 서창남로 45, 3층 (쿠디솜)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-[#1a2867] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500">연락처</p>
                          <p className="text-sm font-semibold text-gray-900">1666-0211</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {product.files && product.files.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">첨부 파일 ({product.files.length}개)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {product.files.slice(0, 6).map((file: File, fileIndex: number) => (
                      <div key={fileIndex} className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group relative">
                        {file.type.startsWith('image/') ? (
                          <>
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={file.name}
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => setZoomImage(URL.createObjectURL(file))}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2">
                            <FileText className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500 text-center truncate w-full">{file.name.split('.').pop()}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {product.files.length > 6 && (
                      <div className="aspect-square rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">+{product.files.length - 6}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50/50 rounded-2xl p-6 space-y-4">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <InfoRow label="제작 아이템" value={product.productType === '기타' ? product.customProductType : product.productType} />
                  <div className="col-span-1 md:col-span-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">수량별 견적</p>
                    <div className="flex flex-wrap gap-2">
                      {(product.quantities || [{ id: Date.now(), value: product.quantity || 300 }]).map((q: any, idx: number) => (
                        <span key={q.id || idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fab803]/10 border border-[#fab803]/30 rounded-lg text-sm font-semibold text-gray-900">
                          <Hash className="w-3.5 h-3.5 text-[#1a2867]" />
                          {q.value?.toLocaleString()}개
                        </span>
                      ))}
                    </div>
                  </div>
                  <InfoRow label="사이즈" value={`${product.width || '-'} × ${product.depth || '-'} cm`} />
                  {product.sampleDeliveryDate && <InfoRow label="샘플 납기" value={product.sampleDeliveryDate} />}
                  {product.mainDeliveryDate && <InfoRow label="본 주문 납기" value={product.mainDeliveryDate} />}
                </div>
                
                {/* 납기 타임라인 시각화 (Delivery Timeline Visualization) */}
                {(product.targetDeliveryDate || product.actualDeliveryDate) && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4"></div>
                    <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-200">
                      <div className="flex items-center gap-2 mb-5">
                        <Calendar className="w-5 h-5 text-[#1a2867]" />
                        <p className="text-sm font-semibold text-gray-900">납기 일정 상세</p>
                      </div>
                      
                      {/* 시나리오 기반 타임라인 (Scenario-based Timeline) */}
                      {product.selectedScenario ? (
                        <div className="space-y-4">
                          {/* 날짜 정보 */}
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <div>
                              <p className="text-xs text-gray-500">주문 예상 시점</p>
                              <p className="font-semibold text-gray-900">
                                {product.targetDeliveryDate && new Date(product.targetDeliveryDate).toLocaleDateString('ko-KR', { 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#1a2867] flex-shrink-0" />
                            <div className="text-right">
                              <p className="text-xs text-gray-500">납기 일자</p>
                              <p className="font-semibold text-[#fab803]">
                                {product.actualDeliveryDate && new Date(product.actualDeliveryDate).toLocaleDateString('ko-KR', { 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          
                          {/* 프로그레스 바 타임라인 */}
                          <div className="space-y-3">
                            {(() => {
                              const scenario = product.selectedScenario;
                              const steps = [];
                              const startDate = product.targetDeliveryDate ? new Date(product.targetDeliveryDate) : new Date();
                              let cumulativeWeeks = 0;
                              
                              console.log('Scenario:', scenario); // Debug log
                              console.log('Revisions:', scenario.revisions); // Debug log
                              
                              // 1. 초기 샘플 단계 (1~2주 → 2주)
                              const initialWeeks = scenario.initialSampleMethod === 'photo' ? 2 : 3;
                              cumulativeWeeks += initialWeeks;
                              const initialEndDate = new Date(startDate);
                              initialEndDate.setDate(initialEndDate.getDate() + (initialWeeks * 7));
                              
                              steps.push({
                                name: '초기 샘플',
                                detail: scenario.initialSampleMethod === 'photo' ? '사진 전달' : '실물 발송',
                                weeks: initialWeeks,
                                color: '#1a2867',
                                endDate: initialEndDate
                              });
                              
                              // 2. 수정 단계들
                              if (scenario.revisions && scenario.revisions.length > 0) {
                                console.log('Processing revisions, count:', scenario.revisions.length); // Debug log
                                scenario.revisions.forEach((revision: any, index: number) => {
                                  console.log(`Revision ${index + 1}:`, revision); // Debug log
                                  const revisionWeeks = revision.method === 'photo' ? 1 : 2;
                                  cumulativeWeeks += revisionWeeks;
                                  const revisionEndDate = new Date(startDate);
                                  revisionEndDate.setDate(revisionEndDate.getDate() + (cumulativeWeeks * 7));
                                  
                                  steps.push({
                                    name: `수정 ${index + 1}차`,
                                    detail: revision.method === 'photo' ? '사진 전달' : '실물 발송',
                                    weeks: revisionWeeks,
                                    color: '#6b7280',
                                    endDate: revisionEndDate
                                  });
                                });
                              }
                              console.log('Total steps created:', steps.length); // Debug log
                              
                              // 3. 본 제작 단계 (4~5주 → 5주, 2~3주 → 3주)
                              const productionWeeks = scenario.productionType === 'express' ? 3 : 5;
                              cumulativeWeeks += productionWeeks;
                              const productionEndDate = new Date(startDate);
                              productionEndDate.setDate(productionEndDate.getDate() + (cumulativeWeeks * 7));
                              
                              steps.push({
                                name: '본 제작',
                                detail: scenario.productionType === 'express' ? '빠른 제작' : '일반 제작',
                                weeks: productionWeeks,
                                color: '#fab803',
                                endDate: productionEndDate
                              });
                              
                              const totalWeeks = cumulativeWeeks;
                              
                              return steps.map((step, index) => {
                                const percentage = (step.weeks / totalWeeks) * 100;
                                const dateStr = step.endDate.toLocaleDateString('ko-KR', { 
                                  year: 'numeric',
                                  month: '2-digit', 
                                  day: '2-digit' 
                                }).replace(/\. /g, '/').replace('.', '');
                                
                                return (
                                  <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="w-3 h-3 rounded-full" 
                                          style={{ backgroundColor: step.color }}
                                        ></div>
                                        <span className="font-medium text-gray-900">{step.name}</span>
                                        <span className="text-gray-500">({step.detail})</span>
                                      </div>
                                      <span className="font-semibold text-gray-700">{step.weeks}주 (~{dateStr})</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                      <div 
                                        className="h-2.5 rounded-full transition-all" 
                                        style={{ 
                                          width: `${percentage}%`,
                                          backgroundColor: step.color
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                          
                          {/* 총 기간 */}
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">총 소요 기간</span>
                              <span className="text-base font-bold text-[#1a2867]">
                                {(() => {
                                  const scenario = product.selectedScenario;
                                  // 초기 샘플: photo=2주, physical=3주
                                  const initialWeeks = scenario.initialSampleMethod === 'photo' ? 2 : 3;
                                  // 수정: 각 수정당 photo=1주, physical=2주
                                  const revisionWeeks = scenario.revisions ? scenario.revisions.reduce((sum: number, rev: any) => {
                                    return sum + (rev.method === 'photo' ? 1 : 2);
                                  }, 0) : 0;
                                  // 본 제작: express=3주, normal=5주
                                  const productionWeeks = scenario.productionType === 'express' ? 3 : 5;
                                  return initialWeeks + revisionWeeks + productionWeeks;
                                })()}주
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* 시나리오 없을 때 간단한 표시 */
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            {product.targetDeliveryDate && (
                              <div>
                                <p className="text-xs text-gray-500">주문 예상 시점</p>
                                <p className="font-semibold text-gray-900">
                                  {new Date(product.targetDeliveryDate).toLocaleDateString('ko-KR', { 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            )}
                            {product.actualDeliveryDate && (
                              <div className="text-right">
                                <p className="text-xs text-gray-500">납기 일자</p>
                                <p className="font-semibold text-[#fab803]">
                                  {new Date(product.actualDeliveryDate).toLocaleDateString('ko-KR', { 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* 제작 방식 정보 (Production method information) */}
                          {(product.initialSampleDeliveryMethod || product.mainProductionType) && (
                            <div className="pt-3 border-t border-gray-200 space-y-2">
                              {product.initialSampleDeliveryMethod && (
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="w-2 h-2 rounded-full bg-[#1a2867]"></div>
                                  <span className="font-medium text-gray-700">초기 샘플:</span>
                                  <span className="text-gray-600">
                                    {product.initialSampleDeliveryMethod === 'photo' ? '사진 전달' : '실물 발송'}
                                  </span>
                                </div>
                              )}
                              {product.mainProductionType && (
                                <div className="flex items-center gap-2 text-xs">
                                  <div className="w-2 h-2 rounded-full bg-[#fab803]"></div>
                                  <span className="font-medium text-gray-700">본 제작:</span>
                                  <span className="text-gray-600">
                                    {product.mainProductionType === 'standard' ? '일반 제작' : '빠른 제작'}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {/* 옵션 정보 */}
                {(product.fabric || product.originLabelMaterial || product.labelingMethod || product.packaging || product.filling || product.keyring || product.kcCertification) && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <ListChecks className="w-5 h-5 text-[#1a2867]" />
                        <h5 className="font-semibold text-gray-900">제작 옵션</h5>
                      </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 [&>*]:pb-6 [&>*]:border-b [&>*]:border-gray-200 md:[&>*:nth-last-child(-n+2)]:border-b-0 [&>*:last-child]:border-b-0">
                      {/* 원단 */}
                      {product.fabric && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Shirt className="w-4 h-4 text-[#1a2867]" />
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">원단</p>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {product.fabric}
                            {product.fabric === '커스텀 원단' && ' (커스텀 필요)'}
                          </p>
                          {product.fabricFiles && product.fabricFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">첨부 파일 ({product.fabricFiles.length}개)</p>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {product.fabricFiles.map((file: File, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group relative">
                                    {file.type.startsWith('image/') ? (
                                      <>
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setZoomImage(URL.createObjectURL(file))} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {product.fabricRequest && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">기타 요청 사항</p>
                              <p className="text-sm text-gray-700">{product.fabricRequest}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* 원산지 표기 라벨 */}
                      {product.originLabelMaterial && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-4 h-4 text-[#1a2867]" />
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">원산지 표기 라벨</p>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {product.originLabelMaterial}
                            {product.originLabelCustom === '예' && ', 커스텀 디자인'}
                            {product.originLabelCustom === '아니오' && ', 기본 디자인'}
                          </p>
                          
                          {/* 1. 라벨 소재 레퍼런스 파일 */}
                          {product.customLabelFiles && product.customLabelFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">라벨 소재 레퍼런스 파일 ({product.customLabelFiles.length}개)</p>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {product.customLabelFiles.map((file: File, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group relative">
                                    {file.type.startsWith('image/') ? (
                                      <>
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setZoomImage(URL.createObjectURL(file))} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 2. 라벨 소재 레퍼런스 기타 요청 */}
                          {product.originLabelMaterialRequest && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">라벨 소재 레퍼런스 기타 요청</p>
                              <p className="text-sm text-gray-700">{product.originLabelMaterialRequest}</p>
                            </div>
                          )}
                          
                          {/* 3. 라벨 디자인 파일 */}
                          {product.originLabelFiles && product.originLabelFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">라벨 디자인 파일 ({product.originLabelFiles.length}개)</p>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {product.originLabelFiles.map((file: File, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group relative">
                                    {file.type.startsWith('image/') ? (
                                      <>
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setZoomImage(URL.createObjectURL(file))} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 4. 라벨 디자인 파일 기타 요청 */}
                          {product.originLabelDesignRequest && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">라벨 디자인 파일 기타 요청</p>
                              <p className="text-sm text-gray-700">{product.originLabelDesignRequest}</p>
                            </div>
                          )}
                          
                          {/* 5. 라벨 위치 편집 이미지 */}
                          {product.labelLocationImage && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">라벨 위치 편집 이미지</p>
                              <div className="aspect-square w-32 rounded-lg overflow-hidden bg-gray-100 border-2 border-[#fab803]/30 group relative">
                                <img src={product.labelLocationImage} alt="라벨 위치 편집" className="w-full h-full object-cover cursor-pointer" onClick={() => setZoomImage(product.labelLocationImage)} />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                                  <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* 6. 라벨 위치 편집 기타 요청 */}
                          {product.labelLocationRequest && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">라벨 위치 편집 기타 요청</p>
                              <p className="text-sm text-gray-700">{product.labelLocationRequest}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* 표시 사항 표기 방식 */}
                      {product.labelingMethod && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Receipt className="w-4 h-4 text-[#1a2867]" />
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">표시 사항 표기 방식</p>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {product.labelingMethod}
                            {product.labelingMethod === '스티커' && product.stickerCustom === '예' && ', 커스텀 디자인'}
                            {product.labelingMethod === '스티커' && product.stickerCustom === '아니오' && product.stickerBase && `, 기본 디자인 (${product.stickerBase})`}
                            {product.labelingMethod === '행택' && product.tagStringCustom === '예' && ', 커스텀 디자인'}
                            {product.labelingMethod === '행택' && product.tagStringCustom === '아니오' && ', 기본 디자인'}
                            {product.labelingMethod === '패키징 인쇄' && product.packagingPrintFiles && product.packagingPrintFiles.length > 0 && `, 파일 ${product.packagingPrintFiles.length}개`}
                          </p>
                          {product.labelingMethod === '행택' && product.tagString && (
                            <p className="text-xs text-gray-600 mt-1">
                              끈 종류: {product.tagString}
                              {product.tagStringColor && ` (${product.tagStringColor})`}
                            </p>
                          )}
                          {product.stickerFiles && product.stickerFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">스티커 파일 ({product.stickerFiles.length}개)</p>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {product.stickerFiles.map((file: File, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group relative">
                                    {file.type.startsWith('image/') ? (
                                      <>
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setZoomImage(URL.createObjectURL(file))} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {product.hangTagDesignFiles && product.hangTagDesignFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">행택 커스텀 디자인 파일 ({product.hangTagDesignFiles.length}개)</p>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {product.hangTagDesignFiles.map((file: File, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group relative">
                                    {file.type.startsWith('image/') ? (
                                      <>
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setZoomImage(URL.createObjectURL(file))} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {product.hangTagStringFiles && product.hangTagStringFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">행택 끈 소재 레퍼런스 파일 ({product.hangTagStringFiles.length}개)</p>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {product.hangTagStringFiles.map((file: File, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group relative">
                                    {file.type.startsWith('image/') ? (
                                      <>
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setZoomImage(URL.createObjectURL(file))} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {product.packagingPrintFiles && product.packagingPrintFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">패키징 인쇄 레퍼런스 파일 ({product.packagingPrintFiles.length}개)</p>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {product.packagingPrintFiles.map((file: File, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group relative">
                                    {file.type.startsWith('image/') ? (
                                      <>
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setZoomImage(URL.createObjectURL(file))} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {product.packagingPrintRequest && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">패키징 인쇄 기타 요청 사항</p>
                              <p className="text-sm text-gray-700">{product.packagingPrintRequest}</p>
                            </div>
                          )}
                          {product.stickerRequest && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">스티커 기타 요청 사항</p>
                              <p className="text-sm text-gray-700">{product.stickerRequest}</p>
                            </div>
                          )}
                          {product.hangTagRequest && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">행택 기타 요청 사항</p>
                              <p className="text-sm text-gray-700">{product.hangTagRequest}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* 패키지 */}
                      {product.packaging && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Box className="w-4 h-4 text-[#1a2867]" />
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">패키지</p>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {product.packaging}
                            {['풀컬러 박스', '창문형 박스'].includes(product.packaging) && ' (커스텀 디자인 필요)'}
                          </p>
                          {product.packagingFiles && product.packagingFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">패키지 파일 ({product.packagingFiles.length}개)</p>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {product.packagingFiles.map((file: File, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group relative">
                                    {file.type.startsWith('image/') ? (
                                      <>
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setZoomImage(URL.createObjectURL(file))} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {product.packagingRequest && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">기타 요청 사항</p>
                              <p className="text-sm text-gray-700">{product.packagingRequest}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* 충전솜 */}
                      {product.filling && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Cloud className="w-4 h-4 text-[#1a2867]" />
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">충전솜</p>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mt-1">{product.filling}</p>
                        </div>
                      )}
                      
                      {/* 키링 */}
                      {product.keyring && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Key className="w-4 h-4 text-[#1a2867]" />
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">키링</p>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mt-1">
                            {product.keyring}
                            {product.keyring === '커스텀 키링' && ' (커스텀 필요)'}
                          </p>
                          {product.keyringFiles && product.keyringFiles.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-2">키링 파일 ({product.keyringFiles.length}개)</p>
                              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {product.keyringFiles.map((file: File, idx: number) => (
                                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group relative">
                                    {file.type.startsWith('image/') ? (
                                      <>
                                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover cursor-pointer" onClick={() => setZoomImage(URL.createObjectURL(file))} />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                                          <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center"><FileText className="w-4 h-4 text-gray-400" /></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {product.keyringRequest && (
                            <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-1">기타 요청 사항</p>
                              <p className="text-sm text-gray-700">{product.keyringRequest}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* KC 인증 */}
                      {product.kcCertification && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-[#1a2867]" />
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">KC 인증</p>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mt-1">{product.kcCertification}</p>
                        </div>
                      )}
                    </div>
                    </div>
                  </>
                )}
                
                {/* 기타 요청 사항 */}
                {product.additionalRequest && (
                  <>
                    <div className="border-t border-gray-200 pt-4 mt-4"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MessageCircle className="w-4 h-4 text-[#1a2867]" />
                        <p className="text-sm font-medium text-gray-700">기타 요청 사항</p>
                      </div>
                      <p className="text-sm text-gray-600 bg-white rounded-xl p-4 border border-gray-200">{product.additionalRequest}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* 푸터 */}
          <div className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
            <p className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              견적 요청 일시: {new Date().toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col items-center gap-4 mt-8 print:hidden"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onAddMore}
            className="flex items-center gap-2 px-6 py-3 bg-[#fab803] hover:bg-[#fab803]/90 text-[#1a2867] rounded-xl font-medium transition-all shadow-sm text-[14px]"
          >
            <Plus className="w-4 h-4" />
            추가 작성
          </button>
          
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-6 py-3 bg-[#fab803] hover:bg-[#fab803]/90 text-[#1a2867] rounded-xl font-medium transition-all shadow-sm text-[14px]"
          >
            <Edit3 className="w-4 h-4" />
            수정하기
          </button>
        </div>
        
        <Button
          onClick={onClose}
          variant="outline"
          size="lg"
          className="shadow-sm"
        >
          닫기
        </Button>
      </motion.div>
      </div>
    </>
  );
}

// 정보 행 컴포넌트
function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value || value === '-') return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  );
}

// ========== Step 1 ==========
function Step1({ basicInfo, onUpdate, onNext }: any) {
  const [consent, setConsent] = useState(false);
  return (
    <div className="sm:max-w-2xl sm:mx-auto">
      <div className="text-center mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 text-[24px]">간편 견적 요청</h1>
          <p className="text-gray-500 text-lg text-[15px]">한 번의 요청으로 샘플 비용과 예상 견적을 받아보세요</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-4 mt-6">
          <a href="tel:1666-0211" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200"><Phone className="w-4 h-4" />1666-0211</a>
          <a href="mailto:support@qudisom.com" className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200"><Mail className="w-4 h-4" />support@qudisom.com</a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-3 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FEE500] hover:bg-[#FDD835] text-gray-900 rounded-full text-sm font-medium"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.707 1.828 5.08 4.547 6.424-.187.697-.615 2.285-.702 2.65-.1.425.157.42.33.306.139-.091 2.15-1.434 3.046-2.031.576.079 1.168.12 1.779.12 5.523 0 10-3.477 10-7.75S17.523 3 12 3z" /></svg>카카오톡</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-full text-sm font-medium"><MessageCircle className="w-4 h-4" />채널톡</button>
        </motion.div>
      </div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onSubmit={e => { e.preventDefault(); consent && onNext(); }} className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">구분 <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-3">
            {[{ v: 'individual', l: '개인', I: User }, { v: 'company', l: '회사', I: Building2 }].map(({ v, l, I }) => (
              <button key={v} type="button" onClick={() => onUpdate('userType', v)} className={cn('relative flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all', basicInfo.userType === v ? 'border-[#fab803] bg-[#fab803]/5' : 'border-gray-200 bg-white hover:border-gray-300')}>
                <I className={cn('w-5 h-5', basicInfo.userType === v ? 'text-[#1a2867]' : 'text-gray-400')} />
                <span className={cn('font-medium', basicInfo.userType === v ? 'text-gray-900' : 'text-gray-600')}>{l}</span>
                {basicInfo.userType === v && <motion.div layoutId="userType" className="absolute -top-1 -right-1 w-5 h-5 bg-[#fab803] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-gray-900" /></motion.div>}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="성함" required value={basicInfo.name} onChange={(e: any) => onUpdate('name', e.target.value)} placeholder="이름을 입력하세요" leftIcon={<User className="w-5 h-5" />} />
          {basicInfo.userType === 'company' && <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}><Input label="회사명" required value={basicInfo.companyName} onChange={(e: any) => onUpdate('companyName', e.target.value)} placeholder="회사명을 입력하세요" leftIcon={<Building2 className="w-5 h-5" />} /></motion.div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="연락처" required type="tel" value={basicInfo.phone} onChange={(e: any) => onUpdate('phone', e.target.value)} placeholder="01012345678" leftIcon={<Phone className="w-5 h-5" />} />
          <Input label="이메일" required type="email" value={basicInfo.email} onChange={(e: any) => onUpdate('email', e.target.value)} placeholder="your@email.com" leftIcon={<Mail className="w-5 h-5" />} />
        </div>
        <div className="pt-4 border-t border-gray-100">
          <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#fab803] focus:ring-[#fab803]" />
            <div><p className="text-sm text-gray-700"><span className="text-red-500">*</span> 개인정보 수집 및 이용에 동의합니다</p><p className="text-xs text-gray-500 mt-1">견적 요청 및 상담을 위해 필요한, 최소 정보만 수집합니다.</p></div>
          </label>
          {!consent && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3"><AlertBox type="warning">다음 단계로 진행하려면 개인정보 수집에 동의해주세요</AlertBox></motion.div>}
        </div>
        <Button type="submit" variant="primary" size="lg" disabled={!consent} rightIcon={<ArrowRight className="w-5 h-5" />} className="w-full">다음 단계로</Button>
      </motion.form>
    </div>
  );
}

// ========== 제품 카드 ==========
function ProductCard({ 
  product, 
  index, 
  total, 
  section, 
  onUpdate, 
  onRemove, 
  onToggle, 
  onComplete, 
  onCopy, 
  isComplete, 
  onOpenGuide,
  filePreviews,
  aiPreviews,
  fileGeneratingStates,
  aiPreviewGeneratingStates,
  selectedAIPreviews,
  onFilePreviewsChange,
  onGenerateAI,
  onRegenerateAI,
  onRemoveFile,
  onOpenEditor,
  onToggleAIPreviewSelection,
  onAttachSelectedAI,
  isPageVersion
}: any) {
  // 기존 quantity 필드를 quantities 배열로 마이그레이션 (Migrate legacy quantity field to quantities array)
  useEffect(() => {
    if (product.quantity !== undefined && !product.quantities) {
      onUpdate('quantities', [{ id: Date.now(), value: product.quantity }]);
    } else if (!product.quantities) {
      onUpdate('quantities', [{ id: Date.now(), value: 300 }]);
    }
  }, []);

  const [optionsOpen, setOptionsOpen] = useState(false);
  
  // 화면 크기에 따른 초기 개수 및 증가량 결정 (Determine initial count and increment based on screen size)
  const [increment] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 3);
  const [showMoreFabric, setShowMoreFabric] = useState(increment); // 원단 표시 개수 (Fabric display count)
  const [showMoreLabel, setShowMoreLabel] = useState(increment); // 원산지 표기 라벨 표시 개수 (Origin label display count)
  const [showMorePackaging, setShowMorePackaging] = useState(increment); // 패키지 표시 개수 (Packaging display count)
  const [copied, setCopied] = useState(false);
  const [zoomImage, setZoomImage] = useState<any>(null);
  
  // 배송 일정 시뮬레이션 상태 (Delivery schedule simulation states)
  const [deliverySimOpen, setDeliverySimOpen] = useState(false);
  const [sampleRevisions, setSampleRevisions] = useState<Array<{id: number, deliveryMethod: 'photo' | 'physical'}>>([]);
  
  // 주문 예상 시점 상태 (Expected order date state)
  const [targetDeliveryDate, setTargetDeliveryDate] = useState(product.targetDeliveryDate || '');
  
  // 납기 일자(행사 일자) 상태 (Actual delivery date state)
  const [actualDeliveryDate, setActualDeliveryDate] = useState(product.actualDeliveryDate || '');
  
  // 시나리오 관련 상태 (Scenario-related states)
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  const [isManuallyModified, setIsManuallyModified] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [scenarioTab, setScenarioTab] = useState<'normal' | 'express'>('normal'); // 시나리오 탭 상태 (Scenario tab state)
  const [hasAutoSelected, setHasAutoSelected] = useState(false); // 자동 선택 완료 여부 추적 (Track if auto-selection has been done)
  
  // 카드 접기/펼치기 상태 (Card collapse/expand states)
  const [initialSampleCollapsed, setInitialSampleCollapsed] = useState(false);
  const [mainProductionCollapsed, setMainProductionCollapsed] = useState(false);
  const [revisionCollapsed, setRevisionCollapsed] = useState<{[key: number]: boolean}>({});
  
  // 가이드가 한 번이라도 자동으로 열렸는지 추적 (Track if guide has been auto-opened once for each section)
  const [guideOpenedOnce, setGuideOpenedOnce] = useState<{[key: string]: boolean}>({
    productType: false, // 봉제 아이템 가이드 (Sewn item guide)
    fabric: false,
    originLabel: false,
    labelingMethod: false,
    kcCertification: false
  });
  
  // 본 주문 제작 기간 (Main production period: depends on production type)
  const productionWeeks = product.mainProductionType === 'express' ? 2 : 5;
  
  // 각 섹션 ref 추가
  const fabricRef = useRef<HTMLDivElement>(null);
  const originLabelRef = useRef<HTMLDivElement>(null);
  const labelingMethodRef = useRef<HTMLDivElement>(null);
  const packagingRef = useRef<HTMLDivElement>(null);
  const fillingRef = useRef<HTMLDivElement>(null);
  const keyringRef = useRef<HTMLDivElement>(null);
  const kcCertificationRef = useRef<HTMLDivElement>(null);
  
  const handleCopy = () => { onCopy(); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  // 상세 옵션 최초 진입 시 원단 가이드 자동으로 열기 (Auto-open fabric guide on first entry to detailed options)
  // 원단 가이드 자동 열기 기능 제거됨 (Fabric guide auto-open feature removed)
  // 상세 옵션이 펼쳐져도 가이드를 자동으로 열지 않음 (Do not auto-open guide when detailed options are expanded)

  // 다음 미완료 섹션으로 스크롤
  const scrollToNextIncompleteSection = (currentSection: string) => {
    const sectionOrder = [
      { key: 'fabric', ref: fabricRef },
      { key: 'originLabel', ref: originLabelRef },
      { key: 'labelingMethod', ref: labelingMethodRef },
      { key: 'packaging', ref: packagingRef },
      { key: 'filling', ref: fillingRef },
      ...(product.productType === '인형 키링' ? [{ key: 'keyring', ref: keyringRef }] : []),
      { key: 'kcCertification', ref: kcCertificationRef }
    ];
    
    const currentIndex = sectionOrder.findIndex(s => s.key === currentSection);
    if (currentIndex === -1) return;
    
    // 바로 다음 섹션으로 이동 (Move to the immediate next section)
    if (currentIndex + 1 < sectionOrder.length) {
      const nextSection = sectionOrder[currentIndex + 1];
      
      // 가이드 자동 열기 기능 제거됨 (Auto-open guide feature removed)
      // 원단, 패키지, 충전솜, 키링 섹션에서는 가이드를 자동으로 열지 않음 (Do not auto-open guide for fabric, packaging, filling, and keyring sections)
      if (nextSection.key === 'fabric') {
        // 원단 섹션은 가이드를 열지 않음 (Do not open guide for fabric section)
      } else if (nextSection.key === 'packaging' || nextSection.key === 'filling' || nextSection.key === 'keyring') {
        // 패키지, 충전솜, 키링 섹션은 가이드를 열지 않음 (Do not open guide for packaging, filling, and keyring sections)
      } else if (!guideOpenedOnce[nextSection.key]) {
        // 다른 섹션은 기존대로 가이드 자동 열기 (Auto-open guide for other sections)
        setTimeout(() => {
          onOpenGuide(nextSection.key);
          setGuideOpenedOnce(prev => ({ ...prev, [nextSection.key]: true }));
        }, 150);
      }
      
      // 다음 섹션으로 스크롤 (Scroll to next section)
      setTimeout(() => {
        nextSection.ref.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300);
    }
  };
  
  const handleComplete = (sectionKey: string) => {
    onComplete(sectionKey);
    scrollToNextIncompleteSection(sectionKey);
  };

  const today = new Date().toISOString().split('T')[0];
  
  // 현재 날짜를 한국어 형식으로 표시 (Format current date in Korean)
  const todayKR = `${new Date().getMonth() + 1}월 ${new Date().getDate()}일`;
  
  // 50일 후 날짜 계산 (Calculate date 50 days from now)
  const fiftyDaysLater = new Date();
  fiftyDaysLater.setDate(fiftyDaysLater.getDate() + 50);
  const minDeliveryDate = fiftyDaysLater.toISOString().split('T')[0];
  
  // 50일 후 날짜를 한국어 형식으로 표시 (Format 50-day date in Korean)
  const minDeliveryDateKR = `${fiftyDaysLater.getMonth() + 1}월 ${fiftyDaysLater.getDate()}일`;
  
  const sampleDate = product.sampleDeliveryDate ? new Date(product.sampleDeliveryDate) : null;
  const mainDate = product.mainDeliveryDate ? new Date(product.mainDeliveryDate) : null;
  const isDateValid = !sampleDate || !mainDate || sampleDate <= mainDate;
  
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  
  const fifteenDaysLater = new Date(todayDate);
  fifteenDaysLater.setDate(fifteenDaysLater.getDate() + 15);
  
  const twentyEightDaysLater = new Date(todayDate);
  twentyEightDaysLater.setDate(twentyEightDaysLater.getDate() + 28);
  
  const isSampleRush = sampleDate && sampleDate < fifteenDaysLater;
  const isMainRush = mainDate && mainDate < twentyEightDaysLater;
  
  // 배송 일정 시뮬레이션 계산 로직 (Delivery schedule simulation calculation - 주문 예상 시점부터 계산)
  const calculateDeliverySchedule = () => {
    // 시나리오가 선택되어 있고 수동 수정되지 않았으면 시나리오의 날짜 사용 (Use scenario dates if selected and not manually modified)
    if (selectedScenario && !isManuallyModified) {
      const scenarioEndDate = new Date(selectedScenario.endDate);
      return {
        totalWeeks: selectedScenario.totalWeeks,
        finalDate: scenarioEndDate,
        finalDateKR: `${scenarioEndDate.getFullYear()}년 ${scenarioEndDate.getMonth() + 1}월 ${scenarioEndDate.getDate()}일`
      };
    }
    
    // 수동 설정된 경우 현재 옵션 기반으로 계산 (Calculate based on current options if manually set)
    // 주문 예상 시점이 있으면 그 날짜부터, 없으면 오늘부터 계산 (Calculate from order date if available, otherwise from today)
    const startDate = targetDeliveryDate ? new Date(targetDeliveryDate) : new Date();
    startDate.setHours(0, 0, 0, 0);
    let totalWeeks = 0;
    
    // 1. 초기 샘플 제작: 2주 (Initial sample production: 2 weeks)
    const initialSampleWeeks = 2;
    totalWeeks += initialSampleWeeks;
    
    // 1-1. 초기 샘플 수령: 실물 수령 시 +1주 (Initial sample delivery: +1 week if physical)
    if (product.initialSampleDeliveryMethod === 'physical') {
      totalWeeks += 1;
    }
    
    // 2. 샘플 수정 작업: 각 차수마다 1주 + 배송 방법에 따라 추가 (Sample revisions: 1 week per revision + delivery method)
    sampleRevisions.forEach(revision => {
      totalWeeks += 1; // 수정 기간 (Revision period)
      if (revision.deliveryMethod === 'physical') {
        totalWeeks += 1; // 샘플 실물 수령 (Physical delivery)
      }
    });
    
    // 3. 본 주문 제작 (Main production: depends on production type)
    totalWeeks += productionWeeks;
    
    // 최종 날짜 계산 (Calculate final date from order date)
    const finalDate = new Date(startDate);
    finalDate.setDate(finalDate.getDate() + (totalWeeks * 7));
    
    return {
      totalWeeks,
      finalDate,
      finalDateKR: `${finalDate.getFullYear()}년 ${finalDate.getMonth() + 1}월 ${finalDate.getDate()}일`
    };
  };
  
  const deliverySchedule = calculateDeliverySchedule();
  
  // 주문 예상 시점 변경 시 납기 일자 검증 (Validate actual delivery date when order date changes)
  useEffect(() => {
    if (!actualDeliveryDate || !deliverySchedule.finalDate) return;
    
    // 예상 완료 시점부터 선택 가능 (Can select from expected completion date)
    const minAllowedDate = new Date(deliverySchedule.finalDate);
    minAllowedDate.setHours(0, 0, 0, 0);
    
    const currentActualDate = new Date(actualDeliveryDate);
    currentActualDate.setHours(0, 0, 0, 0);
    
    // 만약 현재 선택된 납기 일자가 최소 허용 날짜보다 이전이면 리셋 (Reset if current date is before min allowed date)
    if (currentActualDate < minAllowedDate) {
      setActualDeliveryDate('');
    }
  }, [targetDeliveryDate, deliverySchedule.finalDate, selectedScenario, product.initialSampleDeliveryMethod, product.mainProductionType, sampleRevisions, actualDeliveryDate]);
  
  // 시나리오 생성 함수 (Generate all possible scenarios - 주문 예상 시점부터 모든 시나리오 생성)
  const generateScenarios = useCallback((orderDate: string) => {
    if (!orderDate) {
      setScenarios([]);
      setShowScenarios(false);
      return;
    }
    
    const startDate = new Date(orderDate); // 주문 예상 시점이 시작점 (Order date is the start date)
    startDate.setHours(0, 0, 0, 0);
    
    const allScenarios: any[] = []; // 모든 시나리오를 저장 (Store all scenarios)
    
    // 초기 샘플 옵션: photo(2주) or physical(3주)
    const initialSampleOptions = [
      { method: 'photo', weeks: 2 },
      { method: 'physical', weeks: 3 }
    ];
    
    // 샘플 수정 횟수: 0~2회 (최대 2차까지만 가능 - Maximum 2 revisions only)
    const revisionCounts = [0, 1, 2];
    
    // 수정 방식: photo(+1주) or physical(+2주) per revision
    const revisionOptions = ['photo', 'physical'];
    
    // 본주문 생산: normal(5주) or express(2주)
    const productionOptions = [
      { type: 'normal', weeks: 5 },
      { type: 'express', weeks: 2 }
    ];
    
    // 모든 조합 생성 (Generate all combinations)
    initialSampleOptions.forEach(initialSample => {
      revisionCounts.forEach(revisionCount => {
        // 수정 횟수가 0일 때
        if (revisionCount === 0) {
          productionOptions.forEach(production => {
            const totalWeeks = initialSample.weeks + production.weeks;
            const endDate = new Date(startDate); // 주문 예상 시점부터 계산 (Calculate from order date)
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
          // 수정 횟수가 1회 이상일 때 - 각 수정의 방식 조합
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
              // 수정 소요 시간 계산
              const revisionWeeks = revisionCombo.reduce((sum, method) => {
                return sum + 1 + (method === 'physical' ? 1 : 0);
              }, 0);
              
              const totalWeeks = initialSample.weeks + revisionWeeks + production.weeks;
              const endDate = new Date(startDate); // 주문 예상 시점부터 계산 (Calculate from order date)
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
    
    // BEST 조합 정의: 초기 샘플(사진) + 1차 수정(실물) + 본 주문(일반) (BEST combination: photo initial sample + 1 physical revision + normal production)
    const BEST_SCENARIO_ID = 'photo-1-physical-normal';
    
    // BEST 조합을 최상단에, 나머지는 소요 시간 순으로 정렬 (Sort: BEST combination first, then by total weeks)
    allScenarios.sort((a, b) => {
      // BEST 조합은 항상 최상단 (BEST combination always on top)
      if (a.id === BEST_SCENARIO_ID) return -1;
      if (b.id === BEST_SCENARIO_ID) return 1;
      // 나머지는 소요 시간 순 (Others sorted by total weeks)
      return a.totalWeeks - b.totalWeeks;
    });
    
    // 모든 시나리오를 표시 (Show all scenarios)
    setScenarios(allScenarios);
    setShowScenarios(allScenarios.length > 0);
    
    // BEST 조합을 기본으로 자동 선택 (Auto-select BEST combination - only once)
    // 최초 1회만 자동 선택하고, 이후에는 사용자가 수동으로 선택한 것을 유지 (Auto-select only on first time, then preserve user selection)
    if (!hasAutoSelected) {
      const bestScenario = allScenarios.find(s => s.id === BEST_SCENARIO_ID);
      if (bestScenario) {
        setSelectedScenario(bestScenario);
        onUpdate('selectedScenario', bestScenario); // 시나리오를 product에 저장 (Save scenario to product)
        setIsManuallyModified(false);
        setHasAutoSelected(true); // 자동 선택 완료 표시 (Mark auto-selection as done)
        
        // 자동으로 옵션 적용 (Auto-apply options)
        onUpdate('initialSampleDeliveryMethod', bestScenario.initialSampleMethod);
        onUpdate('mainProductionType', bestScenario.productionType);
        setSampleRevisions(bestScenario.revisions);
      }
    }
  }, [onUpdate, hasAutoSelected]);
  
  // 목표 날짜 변경 시 시나리오 생성 (Generate scenarios when target date changes)
  useEffect(() => {
    if (targetDeliveryDate) {
      generateScenarios(targetDeliveryDate);
    }
  }, [targetDeliveryDate, generateScenarios]);
  
  // 시나리오 선택 핸들러 (Handle scenario selection)
  const handleSelectScenario = (scenario: any) => {
    setSelectedScenario(scenario);
    onUpdate('selectedScenario', scenario); // 시나리오를 product에 저장 (Save scenario to product)
    
    // 시나리오가 null인 경우 (선택 해제) 아무 작업도 하지 않음 (If scenario is null (deselected), do nothing)
    if (!scenario) {
      setIsManuallyModified(true);
      return;
    }
    
    // 시나리오 선택 시 즉시 옵션 자동 적용 (Auto-apply options when scenario is selected)
    setIsManuallyModified(false);
    
    // 자동으로 옵션 적용 (Auto-apply options)
    onUpdate('initialSampleDeliveryMethod', scenario.initialSampleMethod);
    onUpdate('mainProductionType', scenario.productionType);
    setSampleRevisions(scenario.revisions);
    
    // 목표 납기일자는 "이 시나리오 시도하기" 버튼 클릭 시에만 변경 (Target delivery date will be set when "Try this scenario" button is clicked)
  };
  
  // 시나리오 적용 핸들러 (Apply selected scenario)
  const applySelectedScenario = () => {
    // 선택된 시나리오가 있으면 자동 적용, 없으면 수동 설정 그대로 유지 (Apply scenario if selected, otherwise keep manual settings)
    if (selectedScenario) {
      setIsManuallyModified(false);
      
      // 자동으로 옵션 적용 (Auto-apply options)
      onUpdate('initialSampleDeliveryMethod', selectedScenario.initialSampleMethod);
      onUpdate('mainProductionType', selectedScenario.productionType);
      setSampleRevisions(selectedScenario.revisions);
      
      // 주문 예상 시점은 사용자가 설정한 값을 유지 (Keep the user's selected target delivery date)
      // 시나리오는 옵션만 적용하고 날짜는 변경하지 않음 (Scenario only applies options, not dates)
      
      // 카드들 접기
      setInitialSampleCollapsed(true);
      setMainProductionCollapsed(true);
    }
    
    // 시나리오 선택 여부와 관계없이 섹션 접기 (Close delivery simulation section regardless)
    setDeliverySimOpen(false);
    
    // 상세 옵션 자동으로 펼치기 (Auto-expand detailed options)
    setOptionsOpen(true);
  };
  
  // 주문 예상 시점 기반이므로 모든 설정이 유효함 (All settings are valid since order date is the start point)
  const validateCurrentSettings = useCallback(() => {
    return { isValid: true, message: '' };
  }, []);
  
  // 옵션 변경 감지 (Detect option changes)
  useEffect(() => {
    if (selectedScenario && !isManuallyModified) {
      // 사용자가 수동으로 옵션을 변경했는지 확인
      const currentInitialMethod = product.initialSampleDeliveryMethod || 'photo';
      const currentProductionType = product.mainProductionType || 'normal';
      
      if (
        currentInitialMethod !== selectedScenario.initialSampleMethod ||
        currentProductionType !== selectedScenario.productionType ||
        sampleRevisions.length !== selectedScenario.revisions.length
      ) {
        setIsManuallyModified(true);
      }
    }
  }, [product.initialSampleDeliveryMethod, product.mainProductionType, sampleRevisions, selectedScenario, isManuallyModified]);
  
  const validation = validateCurrentSettings();
  
  const getFabricValue = () => {
    if (!product.fabric) return '';
    let value = product.fabric;
    if (product.fabric === '커스텀 원단' && product.fabricFiles && product.fabricFiles.length > 0) {
      value += ', 커스텀 디자인';
    }
    return value;
  };
  
  const getOriginLabelValue = () => {
    if (!product.originLabelMaterial) return '';
    let value = product.originLabelMaterial;
    if (product.originLabelMaterial === '커스텀') {
      if (product.customLabelFiles && product.customLabelFiles.length > 0) {
        value += ', 커스텀 디자인';
      }
    } else if (product.originLabelCustom) {
      value += product.originLabelCustom === '예' ? ', 커스텀 디자인' : ', 기본 디자인';
    }
    return value;
  };
  
  const getLabelingMethodValue = () => {
    if (!product.labelingMethod) return '';
    let value = product.labelingMethod;
    if (product.labelingMethod === '스티커' && product.stickerCustom) {
      value += product.stickerCustom === '예' ? ', 커스텀 디자인' : ', 기본 디자인';
    }
    if (product.labelingMethod === '행택') {
      if (product.tagStringCustom) {
        value += product.tagStringCustom === '예' ? ', 커스텀 디자인' : ', 기본 디자인';
      }
      if (product.tagString) {
        value += ', ' + product.tagString;
      }
      if (product.tagAttachmentLocation) {
        value += ', ' + product.tagAttachmentLocation;
      }
    }
    if (product.labelingMethod === '패키징 인쇄') {
      if (product.packagingPrintFiles && product.packagingPrintFiles.length > 0) {
        value += `, 파일 ${product.packagingPrintFiles.length}개`;
      }
    }
    return value;
  };
  
  const getPackagingValue = () => {
    if (!product.packaging) return '';
    let value = product.packaging;
    if ((product.packaging === '풀컬러 박스' || product.packaging === '창문형 박스') && product.packagingFiles && product.packagingFiles.length > 0) {
      value += ', 커스텀 디자인';
    }
    return value;
  };
  
  const getKeyringValue = () => {
    if (!product.keyring) return '';
    let value = product.keyring;
    if (product.keyring === '커스텀 키링' && product.keyringFiles && product.keyringFiles.length > 0) {
      value += ', 커스텀 디자인';
    }
    return value;
  };

  const handleFilesChange = (files: File[]) => {
    onUpdate('files', files);
  };

  const handleZoomAIPreview = (imageUrl: string, title: string) => {
    setZoomImage({ url: imageUrl, title });
  };

  return (
    <>
      <ImageModal 
        isOpen={!!zoomImage} 
        onClose={() => setZoomImage(null)} 
        image={zoomImage?.url} 
        title={zoomImage?.title} 
      />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-xl sm:rounded-2xl border-0 sm:border border-gray-200 shadow-none sm:shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-[#fab803]/10 via-white to-[#1a2867]/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a2867]" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">제품 {index + 1}{product.productName && <span className="font-normal text-gray-500 ml-2">- {product.productName}</span>}</h3>
          </div>
          <div className="flex items-center gap-2">
            <GuideButton onClick={() => onOpenGuide('productType')} />
            {total > 1 && <button type="button" onClick={onRemove} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
          </div>
        </div>
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          <Input label="품명" value={product.productName} onChange={(e: any) => onUpdate('productName', e.target.value)} placeholder="캐릭터 이름을 알려주세요" leftIcon={<FileText className="w-5 h-5" />} />
          
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Tag className="w-4 h-4" />제작 아이템 <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-3">{PRODUCT_TYPES.map(t => <SelectCard key={t} name={t} selected={product.productType === t} onSelect={() => onUpdate('productType', t)} />)}</div>
            {product.productType === '기타' && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}><Input placeholder="제작 아이템을 입력하세요" value={product.customProductType} onChange={(e: any) => onUpdate('customProductType', e.target.value)} /></motion.div>}
          </div>
          
          {/* 수량별 견적 비교 (Multiple Quantity Options for Quote Comparison) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Hash className="w-4 h-4" />수량<span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const newQuantities = [...(product.quantities || [{ id: Date.now(), value: 300 }]), { id: Date.now() + Math.random(), value: 500 }];
                  onUpdate('quantities', newQuantities);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1a2867] bg-[#fab803]/10 border border-[#fab803]/30 rounded-lg hover:bg-[#fab803]/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                수량 별 견적
              </button>
            </div>
            
            <div className="space-y-3">
              {(product.quantities || [{ id: Date.now(), value: 300 }]).map((quantityItem: any, qIndex: number) => (
                <motion.div
                  key={quantityItem.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#1a2867] bg-[#fab803]/20 px-2 py-1 rounded">
                        옵션 {qIndex + 1}
                      </span>
                      <input 
                        type="number" 
                        min={1} 
                        value={quantityItem.value} 
                        onChange={(e: any) => {
                          const newQuantities = [...(product.quantities || [])];
                          newQuantities[qIndex] = { ...newQuantities[qIndex], value: parseInt(e.target.value) || 0 };
                          onUpdate('quantities', newQuantities);
                        }}
                        className="w-24 px-3 py-2 text-right text-lg font-semibold bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#fab803]" 
                      />
                      <span className="text-sm text-gray-500">개</span>
                    </div>
                    {(product.quantities || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newQuantities = (product.quantities || []).filter((_: any, i: number) => i !== qIndex);
                          onUpdate('quantities', newQuantities);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8"
                        aria-label="수량 감소"
                        onClick={() => {
                          const newQuantities = [...(product.quantities || [])];
                          newQuantities[qIndex] = { ...newQuantities[qIndex], value: Math.max(300, quantityItem.value - 10) };
                          onUpdate('quantities', newQuantities);
                        }}
                        disabled={quantityItem.value <= 300}
                      >
                        <Minus size={16} strokeWidth={2} aria-hidden="true" />
                      </Button>
                    </div>
                    <Slider
                      className="grow"
                      value={[Math.min(quantityItem.value, 10000)]}
                      onValueChange={(values) => {
                        const newQuantities = [...(product.quantities || [])];
                        newQuantities[qIndex] = { ...newQuantities[qIndex], value: values[0] };
                        onUpdate('quantities', newQuantities);
                      }}
                      min={300}
                      max={10000}
                      step={10}
                      aria-label="수량 조절 슬라이더"
                    />
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8"
                        aria-label="수량 증가"
                        onClick={() => {
                          const newQuantities = [...(product.quantities || [])];
                          newQuantities[qIndex] = { ...newQuantities[qIndex], value: Math.min(10000, quantityItem.value + 10) };
                          onUpdate('quantities', newQuantities);
                        }}
                        disabled={quantityItem.value >= 10000}
                      >
                        <Plus size={16} strokeWidth={2} aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                    <span>300</span>
                    <span>10,000</span>
                  </div>
                  
                  {quantityItem.value > 0 && quantityItem.value < 300 && (
                    <AlertBox type="warning">최소 주문 수량은 300개입니다.</AlertBox>
                  )}
                  {quantityItem.value >= 10000 && (
                    <AlertBox type="info">10,000개 이상의 견적 요청의 경우 별도 문의 부탁드립니다.</AlertBox>
                  )}
                </motion.div>
              ))}
            </div>
                        
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><Ruler className="w-4 h-4" />사이즈 (cm) <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center"><input type="text" value={product.width} onChange={(e: any) => onUpdate('width', e.target.value)} placeholder="가로" className="w-full px-4 py-3 text-center rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20" /><span className="text-xs text-gray-500 mt-1 block">가로</span></div>
              <div className="text-center"><input type="text" value={product.depth} onChange={(e: any) => onUpdate('depth', e.target.value)} placeholder="높이" className="w-full px-4 py-3 text-center rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20" /><span className="text-xs text-gray-500 mt-1 block">높이</span></div>
            </div>
            {(product.width || product.depth) && <AlertBox type="info">해당 사이즈는 참고용이며, 디자인에 따라 조절이 필요할 수 있습니다. 일반적으로 높이를 기준으로 비율에 따라 가로 길이가 변경됩니다.</AlertBox>}
          </div>
          
          <AIFileUploadArea
            productIndex={index}
            files={product.files}
            filePreviews={filePreviews}
            aiPreviews={aiPreviews}
            fileGeneratingStates={fileGeneratingStates}
            aiPreviewGeneratingStates={aiPreviewGeneratingStates}
            selectedAIPreviews={selectedAIPreviews}
            sampleDeliveryMethod={product.sampleDeliveryMethod || 'file'}
            onFilesChange={handleFilesChange}
            onFilePreviewsChange={onFilePreviewsChange}
            onGenerateAI={onGenerateAI}
            onRegenerateAI={onRegenerateAI}
            onRemoveFile={onRemoveFile}
            onOpenEditor={(preview: AIPreview) => onOpenEditor(preview, index)}
            onToggleAIPreviewSelection={onToggleAIPreviewSelection}
            onAttachSelectedAI={() => onAttachSelectedAI(index)}
            onZoomAIPreview={handleZoomAIPreview}
            onUpdate={onUpdate}
          />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><MessageCircle className="w-4 h-4" />기타 요청 사항</label>
              <button
                type="button"
                onClick={() => onOpenGuide('additionalRequest')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1a2867] bg-white border border-[#1a2867]/20 rounded-lg hover:bg-[#1a2867]/5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                가이드 보기
              </button>
            </div>
            <textarea value={product.additionalRequest} onChange={(e: any) => onUpdate('additionalRequest', e.target.value)} rows={3} placeholder="기본적으로 눈, 코, 입과 같은 요소는 자수로 표현됩니다. 별도로 요청하실 사항이 있으시다면, 우측 상단 [가이드 보기]를 통해 작업 지시서 예시를 확인 후, 파일을 추가로 업로드해주세요!" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1a2867]/20 resize-none text-[13px]" />
          </div>
          
          {/* 배송 일정 시뮬레이션 (Delivery Schedule Simulation) */}
          <div className="space-y-3">
            {/* 말풍선 안내 (Tooltip guidance) */}
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
                <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#1a2867]" />
                    <span className="text-sm text-gray-700 font-bold">주문 예상 시점</span>
                  </div>
                  <div className="relative w-full md:w-auto">
                    <input 
                      type="date" 
                      value={targetDeliveryDate} 
                      min={(() => {
                        const today = new Date();
                        const year = today.getFullYear();
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const day = String(today.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                      })()}
                      onChange={(e: any) => {
                        e.stopPropagation();
                        setTargetDeliveryDate(e.target.value);
                        onUpdate('targetDeliveryDate', e.target.value);
                        setHasAutoSelected(false); // 날짜 변경 시 자동 선택 플래그 리셋 (Reset auto-select flag when date changes)
                        if (e.target.value && !deliverySimOpen) {
                          setDeliverySimOpen(true);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="주문 예상 시점"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fab803]/20 focus:border-[#fab803]" 
                    />
                  </div>
                
                <ArrowRight className="hidden md:block w-5 h-5 text-gray-400" />
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 font-bold">납기 일자</span>
                </div>
                <div className="relative w-full md:w-auto">
                  <input 
                    type="date" 
                    value={actualDeliveryDate}
                    min={deliverySchedule.finalDate ? (() => {
                      const date = new Date(deliverySchedule.finalDate);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    })() : (targetDeliveryDate || new Date().toISOString().split('T')[0])}
                    disabled={!targetDeliveryDate}
                    onChange={(e: any) => {
                      e.stopPropagation();
                      setActualDeliveryDate(e.target.value);
                      onUpdate('actualDeliveryDate', e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="납기 일자"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#fab803]/20 focus:border-[#fab803] disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 justify-between md:justify-end">
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
                    {/* 안내 문구 (Guide text) */}
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
                                <span>샘플 사진 ᛫ 영상 컨펌</span>
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
                    
                    {/* 가능한 시나리오 표시 (Display possible scenarios) */}
                    {showScenarios && scenarios.length > 0 && (
                      <div className="space-y-3" data-scenarios-section>
                        {/* 탭 메뉴 (Tab menu for filtering scenarios by production type) */}
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
                        
                        {/* 급행 탭 선택 시 안내 문구 (Express tab notice) */}
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
                            const isBestScenario = scenario.id === 'photo-1-physical-normal'; // BEST 조합 체크 (Check if BEST combination)
                            
                            return (
                              <motion.button
                                key={scenario.id}
                                type="button"
                                onClick={() => {
                                  // 토글 기능: 이미 선택된 시나리오를 다시 클릭하면 선택 해제 (Toggle: clicking selected scenario again deselects it)
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
                                {/* 시나리오 헤더 (Scenario header) */}
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
                                
                                {/* 심플한 직선 타임라인 (Simple linear timeline) */}
                                <div>
                                  <div className="relative h-16 bg-gray-200 rounded-lg overflow-hidden">
                                    {/* 초기 샘플 (Initial sample) */}
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
                                    
                                    {/* 샘플 수정들 (Sample revisions) */}
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
                                    
                                    {/* 본 주문 제작 (Main production) */}
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
                                  
                                  {/* 타임라인 하단 라벨 (Timeline bottom labels) */}
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
                    
                    {/* 시나리오 없을 때 안내 (No scenarios available notice) */}
                    {targetDeliveryDate && scenarios.length === 0 && (
                      <AlertBox type="warning">
                        가능한 시나리오가 없어, 제작 진행이 어려울 수 있습니다. 수동으로 시나리오 선택 후 견적 요청을 제출해 주시면 담당 매니저 확인 후 상담을 도와드리겠습니다.
                      </AlertBox>
                    )}
                    
                    {/* 초기 샘플 수령 방식 선택 (Initial sample delivery method selection) */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setInitialSampleCollapsed(!initialSampleCollapsed)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">초기 샘플 컨펌 방식</span>
                          {(!product.initialSampleDeliveryMethod || product.initialSampleDeliveryMethod === 'photo') && (
                            <span className="text-xs px-2 py-1 bg-[#1a2867]/10 text-[#1a2867] rounded-md">
                              📸 사진 • 영상 컨펌
                            </span>
                          )}
                          {product.initialSampleDeliveryMethod === 'physical' && (
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
                                    onUpdate('initialSampleDeliveryMethod', 'photo');
                                    setInitialSampleCollapsed(true);
                                    if (selectedScenario) {
                                      setSelectedScenario(null);
                                      onUpdate('selectedScenario', null); // 시나리오 선택 해제 (Clear scenario)
                                      setIsManuallyModified(true);
                                    }
                                  }}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    (!product.initialSampleDeliveryMethod || product.initialSampleDeliveryMethod === 'photo')
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
                                    onUpdate('initialSampleDeliveryMethod', 'physical');
                                    setInitialSampleCollapsed(true);
                                    if (selectedScenario) {
                                      setSelectedScenario(null);
                                      onUpdate('selectedScenario', null); // 시나리오 선택 해제 (Clear scenario)
                                      setIsManuallyModified(true);
                                    }
                                  }}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    product.initialSampleDeliveryMethod === 'physical'
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
                    
                    {/* 본주문 생산 방식 선택 (Main production type selection) */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setMainProductionCollapsed(!mainProductionCollapsed)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700">본 주문 생산 방식</span>
                          {(!product.mainProductionType || product.mainProductionType === 'normal') && (
                            <span className="text-xs px-2 py-1 bg-[#1a2867]/10 text-[#1a2867] rounded-md">
                              📦 일반 생산
                            </span>
                          )}
                          {product.mainProductionType === 'express' && (
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
                                    onUpdate('mainProductionType', 'normal');
                                    setMainProductionCollapsed(true);
                                    if (selectedScenario) {
                                      setSelectedScenario(null);
                                      onUpdate('selectedScenario', null); // 시나리오 선택 해제 (Clear scenario)
                                      setIsManuallyModified(true);
                                    }
                                  }}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    (!product.mainProductionType || product.mainProductionType === 'normal')
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
                                    onUpdate('mainProductionType', 'express');
                                    setMainProductionCollapsed(true);
                                    if (selectedScenario) {
                                      setSelectedScenario(null);
                                      onUpdate('selectedScenario', null); // 시나리오 선택 해제 (Clear scenario)
                                      setIsManuallyModified(true);
                                    }
                                  }}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    product.mainProductionType === 'express'
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
                              
                              {product.mainProductionType === 'express' && (
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
                    
                    {/* 샘플 수정 차수 카드들 (Sample revision cards) */}
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
                                  {index + 1}차 샘플 컨펌 식
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
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSampleRevisions(sampleRevisions.filter(r => r.id !== revision.id));
                                    if (selectedScenario) {
                                      setSelectedScenario(null);
                                      onUpdate('selectedScenario', null); // 시나리오 선택 해제 (Clear scenario)
                                      setIsManuallyModified(true);
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
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
                                            onUpdate('selectedScenario', null); // 시나리오 선택 해제 (Clear scenario)
                                            setIsManuallyModified(true);
                                          }
                                        }}
                                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                                          revision.deliveryMethod === 'photo'
                                            ? 'border-[#fab803] bg-[#fab803]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-lg">📸</span>
                                          <span className="text-xs font-semibold text-gray-900">사진 ᛫ 영상 컨펌</span>
                                        </div>
                                        <p className="text-xs text-gray-600 ml-7">+1주 소요</p>
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
                                            onUpdate('selectedScenario', null); // 시나리오 선택 해제 (Clear scenario)
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
                                          <span className="text-xs font-semibold text-gray-900">실물 수령</span>
                                        </div>
                                        <p className="text-xs text-gray-600 ml-7">+2주 소요</p>
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
                    
                    {/* 샘플 수정 버튼 (Add sample revision button) - 최대 2차까지만 가능 (Maximum 2 revisions) */}
                    {sampleRevisions.length < 2 && (
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            const newId = Date.now() + Math.random();
                            setSampleRevisions([...sampleRevisions, { id: newId, deliveryMethod: 'photo' }]);
                            if (selectedScenario) {
                              setSelectedScenario(null);
                              setIsManuallyModified(true);
                            }
                          }}
                          className="bg-[#1a2867] hover:bg-[#1a2867]/90 text-white"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {sampleRevisions.length + 1}차 수정
                        </Button>
                      </div>
                    )}
                    
                    {/* 최대 수정 횟수 도달 안내 (Maximum revision count reached notice) */}
                    {sampleRevisions.length >= 2 && (
                      <div className="flex justify-center">
                        <div className="text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                          ⚠️ 샘플 수정은 최대 2회까지 가능합니다.
                        </div>
                      </div>
                    )}
                    
                    {/* 목표 납기일 검증 경고 (Target delivery date validation warning) */}
                    {!validation.isValid && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-4"
                      >
                        <div className="text-black mb-3 text-[14px] font-bold">
                          {validation.message}
                        </div>
                        {validation.recommendation && (
                          <button
                            type="button"
                            onClick={() => {
                              handleSelectScenario(validation.recommendation);
                              // 스크롤을 시나리오 목록으로 이동 (Scroll to scenario list)
                              setTimeout(() => {
                                const scenarioSection = document.querySelector('[data-scenarios-section]');
                                if (scenarioSection) {
                                  scenarioSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                }
                              }, 100);
                            }}
                            className="text-sm px-4 py-2 bg-[rgb(26,40,103)] text-[rgb(255,255,255)] rounded-md hover:bg-[#fab803]/90 transition-colors text-[14px]"
                          >
                            AI 추천 시나리오 선택 👆
                          </button>
                        )}
                      </motion.div>
                    )}
                    
                    {/* 타임라인 시각화 (Timeline visualization) */}
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#1a2867]" />
                        예상 제작 일정
                      </h4>
                      <div className="space-y-2">
                        <TimelineItem 
                          label="초기 샘플 제작" 
                          weeks={2} 
                          color="blue"
                          cumulativeWeeks={2}
                        />
                        {product.initialSampleDeliveryMethod === 'physical' && (
                          <TimelineItem 
                            label="초기 샘플 실물 수령" 
                            weeks={1} 
                            color="purple"
                            cumulativeWeeks={3}
                          />
                        )}
                        {sampleRevisions.map((revision, index) => {
                          // 누적 주차 계산 (Calculate cumulative weeks)
                          let cumulativeWeeks = 2; // 초기 샘플 제작
                          if (product.initialSampleDeliveryMethod === 'physical') cumulativeWeeks += 1;
                          
                          // 이전 수정 차수들 추가 (Add previous revisions)
                          for (let i = 0; i < index; i++) {
                            cumulativeWeeks += 1; // 샘플 수정
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
                            // 총 누적 주차 계산 (Calculate total cumulative weeks)
                            let total = 2; // 초기 샘플 제작
                            if (product.initialSampleDeliveryMethod === 'physical') total += 1;
                            sampleRevisions.forEach(rev => {
                              total += 1; // 샘플 수정
                              if (rev.deliveryMethod === 'physical') total += 1;
                            });
                            return total + productionWeeks;
                          })()}
                        />
                      </div>
                    </div>
                    
                    {/* 최종 결과 (Final result) */}
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
                      
                      {/* 주문-완료 시점 플로우 (Order to completion timeline flow) */}
                      <div className="pt-3 border-t border-white/20">
                        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                          {/* 주문 예상 시점 (Expected order date) */}
                          <div className="text-center">
                            <div className="text-xs opacity-75 mb-1 text-white">주문 예상 시점</div>
                            <div className="text-base font-semibold text-white">
                              {targetDeliveryDate 
                                ? `${new Date(targetDeliveryDate).getFullYear()}/${String(new Date(targetDeliveryDate).getMonth() + 1).padStart(2, '0')}/${String(new Date(targetDeliveryDate).getDate()).padStart(2, '0')}`
                                : '미설정'}
                            </div>
                          </div>
                          
                          {/* 화살표 (Arrow) */}
                          <ArrowRight className="w-5 h-5 opacity-75 flex-shrink-0 text-white" />
                          
                          {/* 예상 완료 시점 (Expected completion date) */}
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
                      
                      {/* 납기 일자(행사 일자) 입력 (Actual delivery date input) */}
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <label className="block">
                          <div className="text-xs opacity-75 mb-2 text-white">납기 일자 (행사 일자)</div>
                          <input
                            type="date"
                            value={actualDeliveryDate}
                            min={deliverySchedule.finalDate ? (() => {
                              const date = new Date(deliverySchedule.finalDate);
                              const year = date.getFullYear();
                              const month = String(date.getMonth() + 1).padStart(2, '0');
                              const day = String(date.getDate()).padStart(2, '0');
                              return `${year}-${month}-${day}`;
                            })() : (targetDeliveryDate || new Date().toISOString().split('T')[0])}
                            disabled={!targetDeliveryDate}
                            onChange={(e) => {
                              setActualDeliveryDate(e.target.value);
                              onUpdate('actualDeliveryDate', e.target.value);
                            }}
                            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </label>
                      </div>
                      
                      <div className="mt-3 text-xs bg-white/10 rounded-lg p-2 bg-[rgba(255,255,255,0.15)] text-white text-[13px]">
                        ⚠️ 해당 시나리오는 시뮬레이션이며, 실제 상황에 따라 일정은 변동될 수 있습니다.
                      </div>
                    </div>
                    
                    {/* 시나리오 적용 버튼 (Apply scenario button) */}
                    {targetDeliveryDate && (
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          onClick={applySelectedScenario}
                          className="bg-[#1a2867] text-white hover:bg-[#1a2867]/90 font-semibold px-6 py-3 rounded-full text-sm"
                          size="default"
                        >
                          시나리오 선택 완료 &gt;
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </div>
          
          <div className="pt-6">
            {/* 상세 옵션 전체 카드 (Detailed Options Card) */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* 헤더 (Header) */}
              <button 
                type="button" 
                onClick={() => setOptionsOpen(!optionsOpen)} 
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-[#1a2867]" />
                  <span className="font-medium text-gray-700">상세 옵션(선택)</span>
                </div>
                {optionsOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>
              
              {/* 옵션 내용 (Options Content) */}
              <AnimatePresence>
                {optionsOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    className="overflow-hidden border-t border-gray-200"
                  >
                    <div className="p-5 space-y-4 bg-gray-50/30">
                    {index > 0 && <Button type="button" variant={copied ? 'accent' : 'outline'} onClick={handleCopy} leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} className="w-full">{copied ? '옵션이 복사되었습니다' : '이전 옵션과 동일'}</Button>}
                    
                    <div ref={kcCertificationRef}>
                      <Collapsible 
                        icon={<AlertCircle className="w-4 h-4" />} 
                        title="KC 인증" 
                        isOpen={!section.kcCertification} 
                        isComplete={isComplete('kcCertification')} 
                        selectedValue={product.kcCertification || ''} 
                        onToggle={() => {
                          if (section.kcCertification && !guideOpenedOnce.kcCertification) {
                            onOpenGuide('kcCertification');
                            setGuideOpenedOnce(prev => ({ ...prev, kcCertification: true }));
                          }
                          onToggle('kcCertification');
                        }} 
                        onComplete={() => handleComplete('kcCertification')} 
                        onGuide={() => onOpenGuide('kcCertification')}
                        alertMessage={
                          (product.kcCertification === '만 3세 이상' || product.kcCertification === '만 8세 이상')
                            ? 'KC 인증은 추가 비용이 발생하며, 인증 기간으로 인해 제작 기간이 2~3주 이상 추가로 소요될 수 있습니다.'
                            : undefined
                        }
                      >
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{KC_OPTIONS.map(k => <SelectCard key={k.name} name={k.name} selected={product.kcCertification === k.name} onSelect={() => onUpdate('kcCertification', product.kcCertification === k.name ? '' : k.name)} isBest={k.isBest} />)}</div>
                      </Collapsible>
                    </div>
                    
                    <div ref={fabricRef}>
                      <Collapsible icon={<Shirt className="w-4 h-4" />} title="원단" isOpen={!section.fabric} isComplete={isComplete('fabric')} selectedValue={getFabricValue()} onToggle={() => onToggle('fabric')} onComplete={() => handleComplete('fabric')}>
                      <div className="space-y-4">
                        {/* 전문가 추천 선택 시 안내 문구 (Guide message when expert recommendation is selected) */}
                        {product.fabric === '전문가 추천' && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <p className="text-sm text-gray-800 leading-relaxed pt-1">
                                첨부해주신 디자인 또는 스케치와 가장 어울리는 원단으로 제작해 드립니다.
                              </p>
                            </div>
                          </motion.div>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{FABRIC_OPTIONS.slice(0, showMoreFabric).map(f => <SelectCard key={f.name} name={f.name} image={f.image} desc={f.desc} selected={product.fabric === f.name} onSelect={() => onUpdate('fabric', product.fabric === f.name ? '' : f.name)} onZoom={() => setZoomImage({ url: f.image, title: f.name })} isBest={f.isBest} isAI={f.isAI} />)}</div>
                        {FABRIC_OPTIONS.length > 2 && (
                          <div className="flex justify-center">
                            <Button 
                              type="button" 
                              variant={showMoreFabric >= FABRIC_OPTIONS.length ? 'outline' : 'primary'} 
                              size="sm" 
                              onClick={() => {
                                if (showMoreFabric >= FABRIC_OPTIONS.length) {
                                  setShowMoreFabric(increment); // 접기 - 초기값으로 초기화 (Collapse - reset to initial)
                                } else {
                                  setShowMoreFabric(FABRIC_OPTIONS.length); // 전체 보기 (Show all)
                                }
                              }} 
                              rightIcon={showMoreFabric >= FABRIC_OPTIONS.length ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            >
                              {showMoreFabric >= FABRIC_OPTIONS.length ? '접기' : '더 보기'}
                            </Button>
                          </div>
                        )}
                        <AnimatePresence>
                          {product.fabric === '커스텀 원단' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
                              <FileUpload 
                                label="원단 소재 레퍼런스 이미지를 업로드해주세요." 
                                files={product.fabricFiles} 
                                onFilesChange={(files: File[]) => onUpdate('fabricFiles', files)} 
                              />
                              {product.fabricFiles && product.fabricFiles.length > 0 && (
                                <div className="space-y-3">
                                  <label className="block text-sm font-medium text-gray-700">기타 요청 사항(선택)</label>
                                  <textarea
                                    value={product.fabricRequest || ''}
                                    onChange={(e) => onUpdate('fabricRequest', e.target.value)}
                                    placeholder="커스텀 원단과 관련된 추가 요청 사항이 있다면 입력해주세요."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fab803] focus:border-transparent resize-none"
                                    rows={4}
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Collapsible>
                    </div>
                    
                    <div ref={originLabelRef}>
                      <Collapsible icon={<Tag className="w-4 h-4" />} title="원산지 표기 라벨 소재" isOpen={!section.originLabel} isComplete={isComplete('originLabel')} selectedValue={getOriginLabelValue()} onToggle={() => {
                        if (section.originLabel && !guideOpenedOnce.originLabel) {
                          onOpenGuide('originLabel');
                          setGuideOpenedOnce(prev => ({ ...prev, originLabel: true }));
                        }
                        onToggle('originLabel');
                      }} onComplete={() => handleComplete('originLabel')} onGuide={() => onOpenGuide('originLabel')}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{LABEL_OPTIONS.slice(0, showMoreLabel).map(l => <SelectCard key={l.name} name={l.name} image={l.image} selected={product.originLabelMaterial === l.name} onSelect={() => onUpdate('originLabelMaterial', product.originLabelMaterial === l.name ? '' : l.name)} onZoom={() => setZoomImage({ url: l.image, title: l.name })} isBest={l.isBest} />)}</div>
                        <div className="flex justify-center"><Button type="button" variant={showMoreLabel >= LABEL_OPTIONS.length ? 'outline' : 'primary'} size="sm" onClick={() => {
                          if (showMoreLabel >= LABEL_OPTIONS.length) {
                            setShowMoreLabel(increment); // 접기 - 초기값으로 초기화 (Collapse - reset to initial)
                          } else {
                            setShowMoreLabel(LABEL_OPTIONS.length); // 전체 보기 (Show all)
                          }
                        }} rightIcon={showMoreLabel >= LABEL_OPTIONS.length ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}>{showMoreLabel >= LABEL_OPTIONS.length ? '접기' : '더 보기'}</Button></div>
                        
                        <AnimatePresence>
                          {product.originLabelMaterial === '커스텀' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
                              <FileUpload 
                                label="라벨 소재 레퍼런스 이미지를 업로드해주세요." 
                                files={product.customLabelFiles} 
                                onFilesChange={(files: File[]) => onUpdate('customLabelFiles', files)} 
                              />
                              {product.customLabelFiles && product.customLabelFiles.length > 0 && (
                                <div className="space-y-3">
                                  <label className="block text-sm font-medium text-gray-700">라벨 소재 레퍼런스 기타 요청 사항(선택)</label>
                                  <textarea
                                    value={product.originLabelMaterialRequest || ''}
                                    onChange={(e) => onUpdate('originLabelMaterialRequest', e.target.value)}
                                    placeholder="라벨 소재와 관련된 추가 요청 사항이 있다면 입력해주세요."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fab803] focus:border-transparent resize-none"
                                    rows={4}
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {product.originLabelMaterial && (product.originLabelMaterial !== '커스텀' || (product.customLabelFiles && product.customLabelFiles.length > 0)) && (
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">라벨 디자인 커스텀이 필요하신가요?(로고 추가, 풀 커스텀 등)</label>
                            <div className="grid grid-cols-2 gap-3">{['예', '아니오'].map(o => <SelectCard key={o} name={o} selected={product.originLabelCustom === o} onSelect={() => onUpdate('originLabelCustom', product.originLabelCustom === o ? '' : o)} />)}</div>
                            
                            <AnimatePresence>
                              {product.originLabelCustom === '예' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
                                  <AlertBox type="warning" title="커스텀 디자인 안내">풀 커스텀 디자인이 필요하신 경우, 디자인 파일을 제공해 주셔야 합니다.(기본 디자인 뒷면에 간단한 로고만 추가하는 경우, 쿠디솜이 직접 작업해 드립니다.)</AlertBox>
                                  <FileUpload 
                                    label="라벨 디자인 파일 또는 로고 원본 파일을 업로드해주세요."
                                    files={product.originLabelFiles}
                                    onFilesChange={(files: File[]) => onUpdate('originLabelFiles', files)}
                                  />
                                  {product.originLabelFiles && product.originLabelFiles.length > 0 && (
                                    <div className="space-y-3">
                                      <label className="block text-sm font-medium text-gray-700">라벨 디자인 파일 기타 요청 사항(선택)</label>
                                      <textarea
                                        value={product.originLabelDesignRequest || ''}
                                        onChange={(e) => onUpdate('originLabelDesignRequest', e.target.value)}
                                        placeholder="라벨 디자인과 관련된 추가 요청 사항이 있다면 입력해주세요."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fab803] focus:border-transparent resize-none"
                                        rows={4}
                                      />
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            {product.originLabelCustom === '아니오' && (
                              <div className="space-y-3">
                                <AlertBox type="info">기본 디자인은 쿠디솜에서 작업해 드립니다.</AlertBox>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group cursor-pointer" onClick={() => setZoomImage({ url: 'https://images.unsplash.com/photo-1668686056289-c520e101f6b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJlbCUyMHRhZyUyMGRlc2lnbnxlbnwxfHx8fDE3NjU5OTM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080', title: '라벨 예시 1' })}>
                                    <img 
                                      src="https://images.unsplash.com/photo-1668686056289-c520e101f6b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJlbCUyMHRhZyUyMGRlc2lnbnxlbnwxfHx8fDE3NjU5OTM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                                      alt="기본 라벨 디자인 예시" 
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                      <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                      <p className="text-white text-xs">기본 라벨 디자인 예시</p>
                                    </div>
                                  </div>
                                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group cursor-pointer" onClick={() => setZoomImage({ url: 'https://images.unsplash.com/photo-1693147726994-b1a5480e35f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwdGFnJTIwc3RpY2tlcnxlbnwxfHx8fDE3NjU5OTM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080', title: '라벨 예시 2' })}>
                                    <img 
                                      src="https://images.unsplash.com/photo-1693147726994-b1a5480e35f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwdGFnJTIwc3RpY2tlcnxlbnwxfHx8fDE3NjU5OTM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                                      alt="기본 라벨 디자인 예시" 
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                      <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                      <p className="text-white text-xs">기본 라벨 디자인 예시</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* 라벨 위치 편집기 (Label Location Editor) */}
                            {(product.originLabelCustom === '예' || product.originLabelCustom === '아니오') && (
                              <div className="space-y-4">
                                <LabelLocationEditor
                                  availableFiles={
                                    (filePreviews || [])
                                      .filter((fp: FilePreview) => fp.preview)
                                      .map((fp: FilePreview) => ({
                                        name: fp.file.name,
                                        url: fp.preview
                                      }))
                                  }
                                  onSave={(imageData: string) => {
                                    // 저장된 이미지를 처리 (예: labelLocationImage 필드에 저장)
                                    onUpdate('labelLocationImage', imageData);
                                    alert('라벨 위치가 저장되었습니다!');
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Collapsible>
                    </div>
                    
                    <div ref={labelingMethodRef}>
                      <Collapsible 
                        icon={<Receipt className="w-4 h-4" />} 
                        title="표시 사항 표기 방식" 
                        isOpen={!section.labelingMethod} 
                        isComplete={isComplete('labelingMethod')} 
                        selectedValue={getLabelingMethodValue()} 
                        onToggle={() => {
                          if (section.labelingMethod && !guideOpenedOnce.labelingMethod) {
                            onOpenGuide('labelingMethod');
                            setGuideOpenedOnce(prev => ({ ...prev, labelingMethod: true }));
                          }
                          onToggle('labelingMethod');
                        }} 
                        onComplete={() => handleComplete('labelingMethod')} 
                        onGuide={() => onOpenGuide('labelingMethod')}
                        alertMessage="스티커, 행택 소재의 경우 100% 정확한 소재로는 제작이 불가능하며, 레퍼런스 이미지를 업로드 해주시면 최대한 비슷한 소재로 제작해 드립니다."
                      >
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">{LABELING_METHOD_OPTIONS.map(m => <SelectCard key={m.name} name={m.name} image={m.image} selected={product.labelingMethod === m.name} onSelect={() => { onUpdate('labelingMethod', product.labelingMethod === m.name ? '' : m.name); if (m.name === '스티커' && !product.packaging) onUpdate('packaging', 'OPP 봉투'); }} onZoom={() => setZoomImage({ url: m.image, title: m.name })} isBest={m.isBest} />)}</div>
                        
                        {product.labelingMethod === '스티커' && (
                          <>
                            <AlertBox type="warning">스티커 부착 시, 스티커를 부착할 패키지를 선택해 주셔야 합니다.</AlertBox>
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-700">스티커 디자인 커스텀이 필요하신가요?(로고 추가, 풀 커스텀 등)</label>
                              <div className="grid grid-cols-2 gap-3">{['예', '아니오'].map(o => <SelectCard key={o} name={o} selected={product.stickerCustom === o} onSelect={() => {
                                const newValue = product.stickerCustom === o ? '' : o;
                                onUpdate('stickerCustom', newValue);
                                // 아니오 선택 시 스티커 기본 디자인을 "화이트"로 자동 설정 (Auto-set sticker base to "화이트" when selecting No)
                                if (o === '아니오' && newValue === '아니오') {
                                  onUpdate('stickerBase', '화이트');
                                }
                              }} />)}</div>
                              
                              <AnimatePresence>
                                {product.stickerCustom === '예' && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
                                    <AlertBox type="warning" title="커스텀 디자인 안내">풀 커스텀 디자인이 필요하신 경우, 디자인 파일을 제공해 주셔야 합니다.(기본 디자인 뒷면에 간단한 로고만 추가하는 경우, 쿠디솜이 직접 작업해 드립니다.)</AlertBox>
                                    <FileUpload label="스티커 디자인 또는 로고 원본 파일을 업로드해주세요." files={product.stickerFiles} onFilesChange={(files: File[]) => onUpdate('stickerFiles', files)} />
                                    {product.stickerFiles && product.stickerFiles.length > 0 && (
                                      <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">기타 요청 사항(선택)</label>
                                        <textarea
                                          value={product.stickerRequest || ''}
                                          onChange={(e) => onUpdate('stickerRequest', e.target.value)}
                                          placeholder="스티커 디자인과 관련된 추가 요청 사항이 있다면 입력해주세요."
                                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fab803] focus:border-transparent resize-none"
                                          rows={4}
                                        />
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              {product.stickerCustom === '아니오' && (
                                <div className="space-y-3">
                                  <AlertBox type="info">기본 디자인은 쿠디솜에서 작업해 드립니다.</AlertBox>
                                  <label className="block text-sm font-medium text-gray-700">스티커 기본 디자인</label>
                                  <div className="grid grid-cols-2 gap-3">{STICKER_BASE_OPTIONS.map(s => <SelectCard key={s.name} name={s.name} image={s.image} selected={product.stickerBase === s.name} onSelect={() => onUpdate('stickerBase', product.stickerBase === s.name ? '' : s.name)} onZoom={() => setZoomImage({ url: s.image, title: s.name })} isBest={s.isBest} />)}</div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        
                        {product.labelingMethod === '행택' && (
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <label className="block text-sm font-medium text-gray-700">행택 디자인 커스텀이 필요하신가요?(로고 추가, 풀 커스텀 등)</label>
                              <div className="grid grid-cols-2 gap-3">{['예', '아니오'].map(o => <SelectCard key={o} name={o} selected={product.tagStringCustom === o} onSelect={() => {
                                onUpdate('tagStringCustom', product.tagStringCustom === o ? '' : o);
                                // 예 또는 아니오 선택 시 행택 끈을 기본값인 "투명 끈"으로 자동 설정 (Auto-set tag string to default "투명 끈" when selecting Yes or No)
                                if (product.tagStringCustom !== o && !product.tagString) {
                                  onUpdate('tagString', '투명 끈');
                                }
                              }} />)}</div>
                              
                              <AnimatePresence>
                                {product.tagStringCustom === '예' && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
                                    <AlertBox type="warning" title="커스텀 디자인 안내">풀 커스텀 디자인이 필요하신 경우, 디자인 파일을 제공해 주셔야 합니다.(기본 디자인 뒷면에 간단한 로고만 추가하는 경우, 쿠디솜이 직접 작업해 드립니다.)</AlertBox>
                                    <FileUpload label="행택 커스텀 디자인 파일 또는 로고 원본 파일 을 업로드해주세요." files={product.hangTagDesignFiles} onFilesChange={(files: File[]) => onUpdate('hangTagDesignFiles', files)} />
                                    {product.hangTagDesignFiles && product.hangTagDesignFiles.length > 0 && (
                                      <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">기타 요청 사항(선택)</label>
                                        <textarea
                                          value={product.hangTagRequest || ''}
                                          onChange={(e) => onUpdate('hangTagRequest', e.target.value)}
                                          placeholder="행택 디자인과 관련된 추가 요청 사항이 있다면 입력해주세요."
                                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fab803] focus:border-transparent resize-none"
                                          rows={4}
                                        />
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              
                              {product.tagStringCustom === '아니오' && (
                                <div className="space-y-3">
                                  <AlertBox type="info">기본 디자인은 쿠디솜에서 작업해 드립니다.</AlertBox>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group cursor-pointer" onClick={() => setZoomImage({ url: 'https://images.unsplash.com/photo-1668686056289-c520e101f6b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJlbCUyMHRhZyUyMGRlc2lnbnxlbnwxfHx8fDE3NjU5OTM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080', title: '행택 예시 1' })}>
                                      <img 
                                        src="https://images.unsplash.com/photo-1668686056289-c520e101f6b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJlbCUyMHRhZyUyMGRlc2lnbnxlbnwxfHx8fDE3NjU5OTM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                                        alt="기본 행택 디자인 예시" 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                        <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <p className="text-white text-xs">기본 행택 디자인 예시</p>
                                      </div>
                                    </div>
                                    <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group cursor-pointer" onClick={() => setZoomImage({ url: 'https://images.unsplash.com/photo-1693147726994-b1a5480e35f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwdGFnJTIwc3RpY2tlcnxlbnwxfHx8fDE3NjU5OTM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080', title: '행택 예시 2' })}>
                                      <img 
                                        src="https://images.unsplash.com/photo-1693147726994-b1a5480e35f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwdGFnJTIwc3RpY2tlcnxlbnwxfHx8fDE3NjU5OTM2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                                        alt="기본 행택 디자인 예시" 
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                        <Search className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <p className="text-white text-xs">기본 행택 디자인 예시</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {(product.tagStringCustom === '예' || product.tagStringCustom === '아니오') && (
                              <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">행택 끈 종류</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{TAG_OPTIONS.map(t => <SelectCard key={t.name} name={t.name} image={t.image} selected={product.tagString === t.name} onSelect={() => {
                                  const newValue = product.tagString === t.name ? '' : t.name;
                                  onUpdate('tagString', newValue);
                                  // 끈 종류 변경 시 색상 초기화 (Reset color when string type changes)
                                  if (newValue !== product.tagString) {
                                    onUpdate('tagStringColor', '');
                                  }
                                }} onZoom={() => setZoomImage({ url: t.image, title: t.name })} isBest={t.isBest} />)}</div>
                                
                                <AnimatePresence>
                                  {/* 투명 끈 또는 화살촉 끈 선택 시 색상 선택 (Color selection for transparent or arrowhead strings) */}
                                  {(product.tagString === '투명 끈' || product.tagString === '화살촉 끈') && TAG_STRING_COLOR_OPTIONS[product.tagString as keyof typeof TAG_STRING_COLOR_OPTIONS] && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-2">
                                      <label className="block text-sm font-medium text-gray-700">끈 색상</label>
                                      <div className="flex flex-wrap gap-2">
                                        {TAG_STRING_COLOR_OPTIONS[product.tagString as keyof typeof TAG_STRING_COLOR_OPTIONS].map((color: string) => (
                                          <button
                                            key={color}
                                            type="button"
                                            onClick={() => onUpdate('tagStringColor', product.tagStringColor === color ? '' : color)}
                                            className={cn(
                                              'px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium',
                                              product.tagStringColor === color
                                                ? 'border-[#fab803] bg-[#fab803]/10 text-gray-900'
                                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                            )}
                                          >
                                            {color}
                                          </button>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                  
                                  {product.tagString === '커스텀 끈' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                      <FileUpload label="행택 끈 소재 레퍼런스 이미지를 업로드해주세요." files={product.hangTagStringFiles} onFilesChange={(files: File[]) => onUpdate('hangTagStringFiles', files)} />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                            
                            {/* 행택 부착 위치 섹션 (Hang tag attachment location section) */}
                            {(product.tagStringCustom === '예' || product.tagStringCustom === '아니오') && (
                              <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">행택 부착 위치</label>
                                <div className="grid grid-cols-3 gap-3">
                                  {[
                                    { name: '라벨', image: 'https://images.unsplash.com/photo-1675239514439-1c128b0cffcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGxhYmVsJTIwdGFnfGVufDF8fHx8MTc2NjY3NTU0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
                                    { name: '키링 고리', image: 'https://images.unsplash.com/photo-1595889063460-0f5eb80cd845?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXlyaW5nJTIwYXR0YWNobWVudCUyMGhvb2t8ZW58MXx8fHwxNzY2Njc1NTQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
                                    { name: '기타', image: 'https://images.unsplash.com/photo-1568246387285-527f42cd0833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwdGFnJTIwYXR0YWNobWVudHxlbnwxfHx8fDE3NjY2NzU1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' }
                                  ].map(location => (
                                    <SelectCard 
                                      key={location.name} 
                                      name={location.name} 
                                      image={location.image}
                                      selected={product.tagAttachmentLocation === location.name} 
                                      onSelect={() => onUpdate('tagAttachmentLocation', product.tagAttachmentLocation === location.name ? '' : location.name)} 
                                      onZoom={() => setZoomImage({ url: location.image, title: location.name })}
                                    />
                                  ))}
                                </div>
                                
                                <AnimatePresence>
                                  {product.tagAttachmentLocation === '기타' && (
                                    <motion.div 
                                      initial={{ opacity: 0, height: 0 }} 
                                      animate={{ opacity: 1, height: 'auto' }} 
                                      exit={{ opacity: 0, height: 0 }} 
                                      className="overflow-hidden space-y-3"
                                    >
                                      <label className="block text-sm font-medium text-gray-700">기타 요청 사항</label>
                                      <textarea
                                        value={product.tagAttachmentLocationRequest || ''}
                                        onChange={(e) => onUpdate('tagAttachmentLocationRequest', e.target.value)}
                                        placeholder="행택 부착 위치와 관련된 추가 요청 사항을 입력해주세요."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fab803] focus:border-transparent resize-none"
                                        rows={3}
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {product.labelingMethod === '패키징 인쇄' && (
                          <div className="space-y-4">
                            <FileUpload label="레퍼런스 이미지 또는 파일을 업로드해주세요." files={product.packagingPrintFiles} onFilesChange={(files: File[]) => onUpdate('packagingPrintFiles', files)} />
                            
                            <AnimatePresence>
                              {product.packagingPrintFiles && product.packagingPrintFiles.length > 0 && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
                                  <label className="block text-sm font-medium text-gray-700">기타 요청 사항(선택)</label>
                                  <textarea
                                    value={product.packagingPrintRequest || ''}
                                    onChange={(e) => onUpdate('packagingPrintRequest', e.target.value)}
                                    placeholder="패키징 인쇄와 관련된 추가 요청 사항이 있다면 입력해주세요."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fab803] focus:border-transparent resize-none"
                                    rows={4}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    </Collapsible>
                    </div>
                    
                    <div ref={packagingRef}>
                      <Collapsible icon={<Box className="w-4 h-4" />} title="패키지" isOpen={!section.packaging} isComplete={isComplete('packaging')} selectedValue={getPackagingValue()} onToggle={() => {
                        onToggle('packaging');
                      }} onComplete={() => handleComplete('packaging')}>
                      <div className="space-y-4">
                        {(() => {
                          const maxQuantity = Math.max(...(product.quantities || [{ value: 300 }]).map((q: any) => q.value));
                          return maxQuantity < 2000 && <AlertBox type="info">풀컬러, 창문형 박스 및 커스텀 패키지는 2,000개 이상 주문 시 제작 가능합니다.</AlertBox>;
                        })()}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{PACKAGING_OPTIONS.slice(0, showMorePackaging).map(p => {
                          const maxQuantity = Math.max(...(product.quantities || [{ value: 300 }]).map((q: any) => q.value));
                          return <SelectCard key={p.name} name={p.name} image={p.image} selected={product.packaging === p.name} disabled={(p.min || 0) > 0 && maxQuantity < (p.min || 0)} onSelect={() => onUpdate('packaging', product.packaging === p.name ? '' : p.name)} onZoom={() => setZoomImage({ url: p.image, title: p.name })} isBest={p.isBest} />;
                        })}</div>
                        <div className="flex justify-center"><Button type="button" variant={showMorePackaging >= PACKAGING_OPTIONS.length ? 'outline' : 'primary'} size="sm" onClick={() => {
                          if (showMorePackaging >= PACKAGING_OPTIONS.length) {
                            setShowMorePackaging(increment); // 접기 - 초기값으로 초기화 (Collapse - reset to initial)
                          } else {
                            setShowMorePackaging(PACKAGING_OPTIONS.length); // 전체 보기 (Show all)
                          }
                        }} rightIcon={showMorePackaging >= PACKAGING_OPTIONS.length ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}>{showMorePackaging >= PACKAGING_OPTIONS.length ? '접기' : '더 보기'}</Button></div>
                        
                        <AnimatePresence>
                          {['풀컬러 박스', '창문형 박스', '커스텀 패키지'].includes(product.packaging) && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
                              {['풀컬러 박스', '창문형 박스'].includes(product.packaging) && (
                                <FileUpload label="패키지 디자인 파일을 업로드해주세요." files={product.packagingFiles} onFilesChange={(files: File[]) => onUpdate('packagingFiles', files)} />
                              )}
                              {product.packaging === '커스텀 패키지' && (
                                <FileUpload label="커스텀 패키지의 레퍼런스 이미지를 첨부해주세요." files={product.packagingFiles} onFilesChange={(files: File[]) => onUpdate('packagingFiles', files)} />
                              )}
                              {product.packagingFiles && product.packagingFiles.length > 0 && (
                                <div className="space-y-3">
                                  <label className="block text-sm font-medium text-gray-700">기타 요청 사항(선택)</label>
                                  <textarea
                                    value={product.packagingRequest || ''}
                                    onChange={(e) => onUpdate('packagingRequest', e.target.value)}
                                    placeholder="패키지와 관련된 추가 요청 사항이 있다면 입력해주세요."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fab803] focus:border-transparent resize-none"
                                    rows={4}
                                  />
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Collapsible>
                    </div>
                    
                    <div ref={fillingRef}>
                      <Collapsible icon={<Cloud className="w-4 h-4" />} title="충전솜" isOpen={!section.filling} isComplete={isComplete('filling')} selectedValue={product.filling || ''} onToggle={() => {
                        onToggle('filling');
                      }} onComplete={() => handleComplete('filling')}>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-start">{FILLING_OPTIONS.map(f => <SelectCard key={f.name} name={f.name} image={f.image} selected={product.filling === f.name} onSelect={() => onUpdate('filling', product.filling === f.name ? '' : f.name)} onZoom={() => setZoomImage({ url: f.image, title: f.name })} isBest={f.isBest} />)}</div>
                      </Collapsible>
                    </div>
                    
                    {product.productType === '인형 키링' && (
                      <div ref={keyringRef}>
                        <Collapsible icon={<Key className="w-4 h-4" />} title="키링" isOpen={!section.keyring} isComplete={isComplete('keyring')} selectedValue={getKeyringValue()} onToggle={() => {
                          onToggle('keyring');
                        }} onComplete={() => handleComplete('keyring')}>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{KEYRING_OPTIONS.map(k => <SelectCard key={k.name} name={k.name} image={k.image} selected={product.keyring === k.name} onSelect={() => onUpdate('keyring', product.keyring === k.name ? '' : k.name)} onZoom={() => setZoomImage({ url: k.image, title: k.name })} isBest={k.isBest} />)}</div>
                            
                            <AnimatePresence>
                              {product.keyring === '커스텀 키링' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                                  <FileUpload label="원하시는 키링의 레퍼런스 이미지를 업로드해주세요." files={product.keyringFiles} onFilesChange={(files: File[]) => onUpdate('keyringFiles', files)} />
                                  
                                  <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">기타 요청 사항(선택)</label>
                                    <textarea
                                      value={product.keyringRequest || ''}
                                      onChange={(e) => onUpdate('keyringRequest', e.target.value)}
                                      placeholder="커스텀 키링과 관련된 추가 요청 사항이 있다면 입력해주세요."
                                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#fab803] focus:border-transparent resize-none"
                                      rows={4}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </Collapsible>
                      </div>
                    )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ========== 메인 ==========
export default function QuoteRequestPopupWithAI({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [isOpen, setIsOpen] = useState(true);
  
  const handleClose = () => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate('close');
    }
  };
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [basicInfo, setBasicInfo] = useState({ userType: '', name: '', companyName: '', phone: '', email: '' });
  const { products, sections, addProduct, removeProduct, updateProduct, toggleSection, completeSection, isComplete, calcProgress, copyPrevious } = useProductForm();
  
  const {
    filePreviews,
    aiPreviews,
    fileGeneratingStates,
    aiPreviewGeneratingStates,
    selectedAIPreviews,
    currentProductIndex,
    editingPreview,
    showEditor,
    editorGenerating,
    updateFilePreviews,
    removeFile,
    generateAIPreview,
    regenerateAIPreview,
    handleAIEditorGenerate,
    openEditor,
    setShowEditor,
    toggleAIPreviewSelection,
    attachSelectedAIImages
  } = useAIFeatures(products, updateProduct);
  
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideKey, setGuideKey] = useState<string | null>(null);
  
  // 봉제 아이템 가이드 자동 열기 추적 (Track auto-open of product type guide)
  const [productGuideOpened, setProductGuideOpened] = useState(false);
  
  const openGuide = (key: string) => {
    setGuideKey(key);
    setGuideOpen(true);
  };

  // Step 2로 이동 시 봉제 아이템 가이드 자동으로 열기 (Auto-open product type guide when moving to Step 2)
  useEffect(() => {
    if (step === 2 && !productGuideOpened) {
      setTimeout(() => {
        openGuide('productType');
        setProductGuideOpened(true);
      }, 300); // 페이지 전환 애니메이션 후 가이드 열기 (Open guide after page transition animation)
    }
  }, [step]); // step 상태 변화 감지 (Detect step state changes)

  const progress = products.length > 0 ? Math.round(products.reduce((s, _, i) => s + calcProgress(i), 0) / products.length) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (!isOpen) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><Button onClick={() => { setIsOpen(true); setStep(1); }} variant="primary" size="lg">견적 요청 다시 열기</Button></div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 sm:p-4">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-[95vw] max-w-full sm:max-w-3xl h-full sm:h-auto max-h-full sm:max-h-[90vh] z-50 bg-[#fafafa] rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-white border-b border-gray-100">
                {!submitted && (
                  <div className="flex items-center gap-3">
                    {[1, 2].map(s => (
                      <div key={s} className="flex items-center gap-2">
                        {s > 1 && <div className="w-8 h-[2px] bg-gray-200" />}
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', step === s ? 'bg-[#1a2867] text-white' : step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500')}>{step > s ? '✓' : s}</div>
                        <span className={cn('text-sm font-medium hidden sm:block', step === s ? 'text-gray-900' : 'text-gray-400')}>{s === 1 ? '기본 정보' : '견적 상세'}</span>
                      </div>
                    ))}
                  </div>
                )}
                {submitted && (
                  <div className="flex items-center gap-3">
                    {[1, 2, 3].map(s => (
                      <div key={s} className="flex items-center gap-2">
                        {s > 1 && <div className="w-8 h-[2px] bg-gray-200" />}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-green-500 text-white">✓</div>
                        <span className="text-sm font-medium hidden sm:block text-gray-400">{s === 1 ? '기본 정보' : s === 2 ? '견적 상세' : '제출 완료'}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
              </div>
              
              {step === 2 && !submitted && <div className="h-1 bg-gray-100"><motion.div className="h-full bg-[#fab803]" animate={{ width: `${progress}%` }} /></div>}
              
              <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                {step === 1 ? (
                  <Step1 basicInfo={basicInfo} onUpdate={(f: string, v: any) => setBasicInfo(p => ({ ...p, [f]: v }))} onNext={() => setStep(2)} />
                ) : submitted ? (
                  <SubmittedView 
                    basicInfo={basicInfo} 
                    products={products} 
                    onClose={handleClose}
                    onAddMore={() => {
                      // 추가 작성: 새 제품 추가하고 Step 2로 돌아가기
                      addProduct();
                      setSubmitted(false);
                    }}
                    onEdit={() => {
                      // 수정하기: 제출 상태 해제하고 Step 2로 돌아가기
                      setSubmitted(false);
                    }}
                  />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6 sm:max-w-2xl sm:mx-auto">
                    <AnimatePresence>
                      {products.map((p, i) => (
                        <ProductCard 
                          key={p.id} 
                          product={p} 
                          index={i} 
                          total={products.length} 
                          section={sections[i] || INITIAL_SECTION} 
                          onUpdate={(f: string, v: any) => updateProduct(i, f, v)} 
                          onRemove={() => removeProduct(i)} 
                          onToggle={(s: string) => toggleSection(i, s)} 
                          onComplete={(s: string) => completeSection(i, s)} 
                          onCopy={() => copyPrevious(i)} 
                          isComplete={(s: string) => isComplete(i, s)} 
                          onOpenGuide={openGuide}
                          filePreviews={filePreviews[i] || []}
                          aiPreviews={aiPreviews[i] || []}
                          fileGeneratingStates={fileGeneratingStates}
                          aiPreviewGeneratingStates={aiPreviewGeneratingStates}
                          selectedAIPreviews={selectedAIPreviews}
                          onFilePreviewsChange={(previews: FilePreview[]) => updateFilePreviews(i, previews)}
                          onGenerateAI={generateAIPreview}
                          onRegenerateAI={regenerateAIPreview}
                          onRemoveFile={removeFile}
                          onOpenEditor={(preview: AIPreview) => openEditor(preview, i)}
                          onToggleAIPreviewSelection={toggleAIPreviewSelection}
                          onAttachSelectedAI={attachSelectedAIImages}
                        />
                      ))}
                    </AnimatePresence>
                    
                    <motion.button type="button" onClick={addProduct} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg sm:rounded-xl hover:border-[#1a2867] hover:text-[#1a2867] hover:bg-[#1a2867]/5 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"><Plus className="w-4 h-4 sm:w-5 sm:h-5" />추가 견적 요청</motion.button>
                    
                    <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                      <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-5 h-5" />} className="flex-1">이전</Button>
                      <Button type="submit" variant="primary" size="lg" className="flex-[2]">견적 요청 제출하기</Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
            
            <GuidePanel 
              isOpen={guideOpen} 
              onClose={() => setGuideOpen(false)} 
              guideKey={guideKey} 
            />

            <AnimatePresence>
              {showEditor && editingPreview && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !editorGenerating && setShowEditor(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-5xl max-h-[95vh] z-[90] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200"
                  >
                    <div className="relative h-14 bg-[#1a2867] flex items-center justify-between px-6">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-[#fab803]" />
                        <h3 className="text-white text-lg font-semibold">AI 이미지 에디터</h3>
                      </div>
                      <button
                        onClick={() => !editorGenerating && setShowEditor(false)}
                        disabled={editorGenerating}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <AIImageEditor
                        imageUrl={editingPreview.imageUrl}
                        onGenerate={handleAIEditorGenerate}
                        onClose={() => setShowEditor(false)}
                        isGenerating={editorGenerating}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
            
            {/* 제출 중 로딩 모달 */}
            <AnimatePresence>
              {submitting && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 z-[101] text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="absolute inset-0 border-4 border-[#fab803]/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-transparent border-t-[#fab803] rounded-full animate-spin"></div>
                    </div>
                    <p className="text-lg font-medium text-gray-900">잠시만 기다려주세요!</p>
                    <p className="text-sm text-gray-500 mt-2">곧, 접수가 완료됩니다</p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ========== 페이지 버전 (Page Version) ==========
// Export a page version that is EXACTLY the same but without modal wrapper
export function QuoteRequestPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [basicInfo, setBasicInfo] = useState({ userType: '', name: '', companyName: '', phone: '', email: '' });
  const { products, sections, addProduct, removeProduct, updateProduct, toggleSection, completeSection, isComplete, calcProgress, copyPrevious } = useProductForm();
  
  const {
    filePreviews,
    aiPreviews,
    fileGeneratingStates,
    aiPreviewGeneratingStates,
    selectedAIPreviews,
    currentProductIndex,
    editingPreview,
    showEditor,
    editorGenerating,
    updateFilePreviews,
    removeFile,
    generateAIPreview,
    regenerateAIPreview,
    handleAIEditorGenerate,
    openEditor,
    setShowEditor,
    toggleAIPreviewSelection,
    attachSelectedAIImages
  } = useAIFeatures(products, updateProduct);
  
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideKey, setGuideKey] = useState<string | null>(null);
  const [productGuideOpened, setProductGuideOpened] = useState(false);
  
  const openGuide = (key: string) => {
    setGuideKey(key);
    setGuideOpen(true);
  };

  useEffect(() => {
    if (!productGuideOpened) {
      setTimeout(() => {
        openGuide('productType');
        setProductGuideOpened(true);
      }, 300);
    }
  }, []);

  const progress = products.length > 0 ? Math.round(products.reduce((s, _, i) => s + calcProgress(i), 0) / products.length) : 0;
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <SubmittedView 
          basicInfo={basicInfo} 
          products={products} 
          onClose={() => window.location.href = '/'}
          onAddMore={() => {
            addProduct();
            setSubmitted(false);
          }}
          onEdit={() => {
            setSubmitted(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 quote-request-page-version">
      <style>{`
        .quote-request-page-version .grid.grid-cols-2.md\\:grid-cols-3 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">간편 견적 요청</h1>
            <p className="text-gray-500 text-sm">한 번의 요청으로 샘플 비용과 예상 견적을 받아보세요</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center justify-center gap-3 mt-4">
            <a href="tel:1666-0211" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200"><Phone className="w-3.5 h-3.5" />1666-0211</a>
            <a href="mailto:support@qudisom.com" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200"><Mail className="w-3.5 h-3.5" />support@qudisom.com</a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-2 mt-3">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEE500] hover:bg-[#FDD835] text-gray-900 rounded-full text-xs font-medium"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.477 3 2 6.477 2 10.75c0 2.707 1.828 5.08 4.547 6.424-.187.697-.615 2.285-.702 2.65-.1.425.157.42.33.306.139-.091 2.15-1.434 3.046-2.031.576.079 1.168.12 1.779.12 5.523 0 10-3.477 10-7.75S17.523 3 12 3z" /></svg>카카오톡</button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2867] hover:bg-[#1a2867]/90 text-white rounded-full text-xs font-medium"><MessageCircle className="w-3.5 h-3.5" />채널톡</button>
          </motion.div>
        </div>

        {progress > 0 && (
          <div className="mb-4">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div className="h-full bg-[#fab803]" animate={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-600 text-center mt-1.5">{progress}% 완료</p>
          </div>
        )}

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onSubmit={handleSubmit} className="space-y-4">
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-4">기본 정보</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">구분 <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ v: 'individual', l: '개인', I: User }, { v: 'company', l: '회사', I: Building2 }].map(({ v, l, I }) => (
                    <button key={v} type="button" onClick={() => setBasicInfo(p => ({ ...p, userType: v }))} className={cn('relative flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all', basicInfo.userType === v ? 'border-[#fab803] bg-[#fab803]/5' : 'border-gray-200 bg-white hover:border-gray-300')}>
                      <I className={cn('w-4 h-4', basicInfo.userType === v ? 'text-[#1a2867]' : 'text-gray-400')} />
                      <span className={cn('text-sm font-medium', basicInfo.userType === v ? 'text-gray-900' : 'text-gray-600')}>{l}</span>
                      {basicInfo.userType === v && <motion.div layoutId="userTypePageVersion" className="absolute -top-1 -right-1 w-4 h-4 bg-[#fab803] rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-gray-900" /></motion.div>}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="성함" required value={basicInfo.name} onChange={(e: any) => setBasicInfo(p => ({ ...p, name: e.target.value }))} placeholder="이름을 입력하세요" leftIcon={<User className="w-5 h-5" />} />
                {basicInfo.userType === 'company' && <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}><Input label="회사명" required value={basicInfo.companyName} onChange={(e: any) => setBasicInfo(p => ({ ...p, companyName: e.target.value }))} placeholder="회사명을 입력하세요" leftIcon={<Building2 className="w-5 h-5" />} /></motion.div>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input label="연락처" required type="tel" value={basicInfo.phone} onChange={(e: any) => setBasicInfo(p => ({ ...p, phone: e.target.value }))} placeholder="01012345678" leftIcon={<Phone className="w-5 h-5" />} />
                <Input label="이메일" required type="email" value={basicInfo.email} onChange={(e: any) => setBasicInfo(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" leftIcon={<Mail className="w-5 h-5" />} />
              </div>
              <div className="pt-3 border-t border-gray-100">
                <label className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#fab803] focus:ring-[#fab803]" />
                  <div><p className="text-sm text-gray-700"><span className="text-red-500">*</span> 개인정보 수집 및 이용에 동의합니다</p><p className="text-xs text-gray-500 mt-0.5">견적 요청 및 상담을 위해 필요한 최소 정보만 수집합니다.</p></div>
                </label>
                {!consent && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2"><AlertBox type="warning">견적을 제출하려면 개인정보 수집에 동의해주세요</AlertBox></motion.div>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {products.map((p, i) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  index={i} 
                  total={products.length} 
                  section={sections[i] || INITIAL_SECTION} 
                  onUpdate={(f: string, v: any) => updateProduct(i, f, v)} 
                  onRemove={() => removeProduct(i)} 
                  onToggle={(s: string) => toggleSection(i, s)} 
                  onComplete={(s: string) => completeSection(i, s)} 
                  onCopy={() => copyPrevious(i)} 
                  isComplete={(s: string) => isComplete(i, s)} 
                  onOpenGuide={openGuide}
                  filePreviews={filePreviews[i] || []}
                  aiPreviews={aiPreviews[i] || []}
                  fileGeneratingStates={fileGeneratingStates}
                  aiPreviewGeneratingStates={aiPreviewGeneratingStates}
                  selectedAIPreviews={selectedAIPreviews}
                  onFilePreviewsChange={(previews: FilePreview[]) => updateFilePreviews(i, previews)}
                  onGenerateAI={generateAIPreview}
                  onRegenerateAI={regenerateAIPreview}
                  onRemoveFile={removeFile}
                  onOpenEditor={(preview: AIPreview) => openEditor(preview, i)}
                  onToggleAIPreviewSelection={toggleAIPreviewSelection}
                  onAttachSelectedAI={attachSelectedAIImages}
                  isPageVersion={true}
                />
              ))}
            </AnimatePresence>
            
            <motion.button type="button" onClick={addProduct} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#1a2867] hover:text-[#1a2867] hover:bg-[#1a2867]/5 transition-all flex items-center justify-center gap-2 text-sm"><Plus className="w-4 h-4" />추가 견적 요청</motion.button>
          </div>

          <div className="flex justify-center pt-2">
            <Button type="submit" variant="primary" size="lg" disabled={!consent} className="min-w-[300px]">
              견적 요청 제출하기
            </Button>
          </div>
        </motion.form>

        <GuidePanel 
          isOpen={guideOpen} 
          onClose={() => setGuideOpen(false)} 
          guideKey={guideKey} 
        />

        <AnimatePresence>
          {showEditor && editingPreview && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !editorGenerating && setShowEditor(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-5xl max-h-[95vh] z-[90] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200"
              >
                <div className="relative h-14 bg-[#1a2867] flex items-center justify-between px-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#fab803]" />
                    <h3 className="text-white text-lg font-semibold">AI 이미지 에디터</h3>
                  </div>
                  <button
                    onClick={() => !editorGenerating && setShowEditor(false)}
                    disabled={editorGenerating}
                    className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="flex-1 overflow-hidden">
                  <AIImageEditor
                    imageUrl={editingPreview.imageUrl}
                    onGenerate={handleAIEditorGenerate}
                    onClose={() => setShowEditor(false)}
                    isGenerating={editorGenerating}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {submitting && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 z-[101] text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-[#fab803]/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-[#fab803] rounded-full animate-spin"></div>
                </div>
                <p className="text-lg font-medium text-gray-900">잠시만 기다려주세요!</p>
                <p className="text-sm text-gray-500 mt-2">곧, 접수가 완료됩니다</p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
