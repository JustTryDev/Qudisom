// 견적 관리 - 기존 유지
export const mockQuotes = [
  {
    id: 'QT-2024-001',
    productType: '봉제 인형',
    quantity: 500,
    size: '30x25x15cm',
    status: 'pending',
    requestDate: '2024-12-15',
    estimatedPrice: '₩2,500,000'
  },
  {
    id: 'QT-2024-002',
    productType: '인형 키링',
    quantity: 1000,
    size: '10x8x5cm',
    status: 'reviewing',
    requestDate: '2024-12-14',
    estimatedPrice: '₩1,800,000'
  },
  {
    id: 'QT-2024-003',
    productType: '마스코트 인형',
    quantity: 300,
    size: '40x30x20cm',
    status: 'completed',
    requestDate: '2024-12-10',
    estimatedPrice: '₩3,200,000'
  },
  {
    id: 'QT-2024-004',
    productType: '인형 키링',
    quantity: 800,
    size: '12x10x6cm',
    status: 'pending',
    requestDate: '2024-12-08',
    estimatedPrice: '₩1,600,000'
  },
  {
    id: 'QT-2024-005',
    productType: '봉제 인형',
    quantity: 200,
    size: '25x20x10cm',
    status: 'reviewing',
    requestDate: '2024-12-05',
    estimatedPrice: '₩1,200,000'
  },
  {
    id: 'QT-2024-006',
    productType: '마스코트 인형',
    quantity: 150,
    size: '35x28x18cm',
    status: 'completed',
    requestDate: '2024-11-28',
    estimatedPrice: '₩2,000,000'
  },
  {
    id: 'QT-2024-007',
    productType: '봉제 인형',
    quantity: 600,
    size: '28x22x12cm',
    status: 'confirmed',
    requestDate: '2024-12-12',
    estimatedPrice: '₩3,800,000'
  },
  {
    id: 'QT-2024-008',
    productType: '인형 키링',
    quantity: 1500,
    size: '15x12x8cm',
    status: 'confirmed',
    requestDate: '2024-12-08',
    estimatedPrice: '₩2,400,000'
  }
];

export const mockInquiries = [
  {
    id: 'INQ-2024-001',
    title: '봉제 인형 대량 제작 문의',
    content: '기업 홍보용 봉제 인형 5000개 제작 가능한지 문의드립니다.',
    date: '2024-12-14',
    status: 'answered',
    response: '대량 주문 가능합니다. 상세 견적을 발송드렸습니다.'
  },
  {
    id: 'INQ-2024-002',
    title: '키링 제작 견적 요청',
    content: '행사용 키링 2000개 제작 견적 부탁드립니다.',
    date: '2024-12-13',
    status: 'waiting',
    response: null
  },
  {
    id: 'INQ-2024-003',
    title: '샘플 제작 기간 문의',
    content: '샘플 제작에 소요되는 기간이 궁금합니다.',
    date: '2024-12-12',
    status: 'answered',
    response: '일반적으로 7-10일 소요됩니다.'
  }
];

export const mockOneOnOne = [
  {
    id: 'CS-2024-001',
    title: '배송 일정 변경 요청',
    content: '12월 20일로 예정된 배송을 12월 18일로 앞당길 수 있을까요?',
    date: '2024-12-15',
    status: 'waiting',
    unread: true
  },
  {
    id: 'CS-2024-002',
    title: '샘플 제작 관련 문의',
    content: '샘플 디자인 수정 요청드립니다.',
    date: '2024-12-12',
    status: 'answered',
    unread: false
  },
  {
    id: 'CS-2024-003',
    title: '추가 주문 문의',
    content: '이전 주문 건과 동일한 제품으로 추가 주문 가능한가요?',
    date: '2024-12-10',
    status: 'answered',
    unread: false
  }
];

// 주문 관리 - 샘플 및 본주문
export const mockOrders = [
  // 샘플 주문
  {
    id: 'ORD-SAMPLE-001',
    orderNo: 'SAMPLE-2024-1215',
    productType: '봉제 인형',
    quantity: 1,
    category: 'sample',
    status: 'payment-pending',
    orderDate: '2024-12-15',
    expectedDelivery: '2024-12-25',
    progress: 10,
    images: ['https://images.unsplash.com/photo-1612544408897-36d451f03d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVzaCUyMHRveSUyMHByb2R1Y3R8ZW58MXx8fHwxNzY1NzIwMTA0fDA&ixlib=rb-4.1.0&q=80&w=1080']
  },
  {
    id: 'ORD-SAMPLE-002',
    orderNo: 'SAMPLE-2024-1214',
    productType: '인형 키링',
    quantity: 1,
    category: 'sample',
    status: 'payment-completed',
    orderDate: '2024-12-14',
    expectedDelivery: '2024-12-24',
    progress: 20,
    images: ['https://images.unsplash.com/photo-1758094651730-e971e38f0fa5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwa2V5Y2hhaW4lMjBwcm9kdWN0fGVufDF8fHx8MTc2NTgwMTExN3ww&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1612544408897-36d451f03d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVzaCUyMHRveSUyMHByb2R1Y3R8ZW58MXx8fHwxNzY1NzIwMTA0fDA&ixlib=rb-4.1.0&q=80&w=1080']
  },
  {
    id: 'ORD-SAMPLE-003',
    orderNo: 'SAMPLE-2024-1213',
    productType: '마스코트 인형',
    quantity: 1,
    category: 'sample',
    status: 'manufacturing',
    orderDate: '2024-12-13',
    expectedDelivery: '2024-12-23',
    progress: 50,
    currentLocation: '중국 공장',
    images: ['https://images.unsplash.com/photo-1708392834916-15c7c9445d62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVmZmVkJTIwYW5pbWFsJTIwdG95fGVufDF8fHx8MTc2NTc2MTY2Nnww&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1612544408897-36d451f03d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVzaCUyMHRveSUyMHByb2R1Y3R8ZW58MXx8fHwxNzY1NzIwMTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1758094651730-e971e38f0fa5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwa2V5Y2hhaW4lMjBwcm9kdWN0fGVufDF8fHx8MTc2NTgwMTExN3ww&ixlib=rb-4.1.0&q=80&w=1080']
  },
  {
    id: 'ORD-SAMPLE-004',
    orderNo: 'SAMPLE-2024-1212',
    productType: '봉제 인형',
    quantity: 1,
    category: 'sample',
    status: 'feedback-pending',
    orderDate: '2024-12-12',
    expectedDelivery: '2024-12-22',
    progress: 75,
    currentLocation: '고객 검토 중',
    images: ['https://images.unsplash.com/photo-1612544408897-36d451f03d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVzaCUyMHRveSUyMHByb2R1Y3R8ZW58MXx8fHwxNzY1NzIwMTA0fDA&ixlib=rb-4.1.0&q=80&w=1080']
  },
  {
    id: 'ORD-SAMPLE-005',
    orderNo: 'SAMPLE-2024-1211',
    productType: '인형 키링',
    quantity: 1,
    category: 'sample',
    status: 'revising',
    revisionCount: 1,
    orderDate: '2024-12-11',
    expectedDelivery: '2024-12-21',
    progress: 60,
    currentLocation: '수정 작업 중',
    images: ['https://images.unsplash.com/photo-1758094651730-e971e38f0fa5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwa2V5Y2hhaW4lMjBwcm9kdWN0fGVufDF8fHx8MTc2NTgwMTExN3ww&ixlib=rb-4.1.0&q=80&w=1080', 'https://images.unsplash.com/photo-1708392834916-15c7c9445d62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVmZmVkJTIwYW5pbWFsJTIwdG95fGVufDF8fHx8MTc2NTc2MTY2Nnww&ixlib=rb-4.1.0&q=80&w=1080']
  },
  {
    id: 'ORD-SAMPLE-006',
    orderNo: 'SAMPLE-2024-1210',
    productType: '마스코트 인형',
    quantity: 1,
    category: 'sample',
    status: 'revision-completed',
    revisionCount: 2,
    orderDate: '2024-12-10',
    expectedDelivery: '2024-12-20',
    progress: 85,
    currentLocation: '수정 완료',
    images: ['https://images.unsplash.com/photo-1612544408897-36d451f03d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVzaCUyMHRveSUyMHByb2R1Y3R8ZW58MXx8fHwxNzY1NzIwMTA0fDA&ixlib=rb-4.1.0&q=80&w=1080']
  },
  {
    id: 'ORD-SAMPLE-007',
    orderNo: 'SAMPLE-2024-1209',
    productType: '봉제 인형',
    quantity: 1,
    category: 'sample',
    status: 'final-confirmed',
    revisionCount: 0,
    orderDate: '2024-12-09',
    expectedDelivery: '2024-12-19',
    progress: 100,
    deliveredDate: '2024-12-18',
    currentLocation: '최종 승인 완료',
    images: []
  },
  // 본주문
  {
    id: 'ORD-BULK-001',
    orderNo: 'BULK-2024-1215',
    productType: '봉제 인형',
    quantity: 5000,
    category: 'bulk',
    status: 'payment-pending',
    orderDate: '2024-12-15',
    expectedDelivery: '2025-01-30',
    progress: 5
  },
  {
    id: 'ORD-BULK-002',
    orderNo: 'BULK-2024-1210',
    productType: '인형 키링',
    quantity: 10000,
    category: 'bulk',
    status: 'contract-completed',
    orderDate: '2024-12-10',
    expectedDelivery: '2025-01-25',
    progress: 15
  },
  {
    id: 'ORD-BULK-003',
    orderNo: 'BULK-2024-1208',
    productType: '마스코트 인형',
    quantity: 3000,
    category: 'bulk',
    status: 'bulk-manufacturing',
    orderDate: '2024-12-08',
    expectedDelivery: '2025-01-20',
    progress: 30,
    currentLocation: '중국 공장'
  },
  {
    id: 'ORD-BULK-004',
    orderNo: 'BULK-2024-1205',
    productType: '봉제 인형',
    quantity: 8000,
    category: 'bulk',
    status: 'china-inland-shipping',
    orderDate: '2024-12-01',
    expectedDelivery: '2024-12-28',
    progress: 40,
    currentLocation: '중국 광저우'
  },
  {
    id: 'ORD-BULK-005',
    orderNo: 'BULK-2024-1203',
    productType: '인형 키링',
    quantity: 12000,
    category: 'bulk',
    status: 'china-warehouse',
    orderDate: '2024-11-28',
    expectedDelivery: '2024-12-25',
    progress: 50,
    currentLocation: '중국 물류센터'
  },
  {
    id: 'ORD-BULK-006',
    orderNo: 'BULK-2024-1201',
    productType: '마스코트 인형',
    quantity: 5000,
    category: 'bulk',
    status: 'china-korea-shipping',
    orderDate: '2024-11-25',
    expectedDelivery: '2024-12-22',
    progress: 60,
    currentLocation: '해상 운송 중'
  },
  {
    id: 'ORD-BULK-007',
    orderNo: 'BULK-2024-1128',
    productType: '봉제 인형',
    quantity: 7000,
    category: 'bulk',
    status: 'customs-arrived',
    orderDate: '2024-11-20',
    expectedDelivery: '2024-12-20',
    progress: 70,
    currentLocation: '인천항 세관'
  },
  {
    id: 'ORD-BULK-008',
    orderNo: 'BULK-2024-1125',
    productType: '인형 키링',
    quantity: 15000,
    category: 'bulk',
    status: 'customs-clearing',
    orderDate: '2024-11-18',
    expectedDelivery: '2024-12-18',
    progress: 75,
    currentLocation: '통관 진행 중'
  },
  {
    id: 'ORD-BULK-009',
    orderNo: 'BULK-2024-1120',
    productType: '마스코트 인형',
    quantity: 4000,
    category: 'bulk',
    status: 'customs-completed',
    orderDate: '2024-11-15',
    expectedDelivery: '2024-12-17',
    progress: 85,
    currentLocation: '통관 완료'
  },
  {
    id: 'ORD-BULK-010',
    orderNo: 'BULK-2024-1115',
    productType: '봉제 인형',
    quantity: 9000,
    category: 'bulk',
    status: 'domestic-shipping',
    orderDate: '2024-11-10',
    expectedDelivery: '2024-12-16',
    trackingNo: 'TRK987654321',
    progress: 92,
    currentLocation: '서울 물류센터'
  },
  {
    id: 'ORD-BULK-011',
    orderNo: 'BULK-2024-1110',
    productType: '인형 키링',
    quantity: 20000,
    category: 'bulk',
    status: 'delivered',
    orderDate: '2024-11-05',
    deliveredDate: '2024-12-10',
    progress: 100,
    currentLocation: '배송 완료'
  }
];

export const mockOrderHistory = [
  {
    id: 1,
    orderNo: 'ORD-2024-1205',
    product: '봉제 인형',
    quantity: 500,
    totalAmount: '₩2,500,000',
    orderDate: '2024-12-05',
    status: 'delivered'
  },
  {
    id: 2,
    orderNo: 'ORD-2024-1210',
    product: '인형 키링',
    quantity: 300,
    totalAmount: '₩900,000',
    orderDate: '2024-12-10',
    status: 'delivered'
  },
  {
    id: 3,
    orderNo: 'ORD-2024-1205',
    product: '기타 제품',
    quantity: 1000,
    totalAmount: '₩3,200,000',
    orderDate: '2024-12-05',
    status: 'delivered'
  },
  {
    id: 4,
    orderNo: 'ORD-2024-1128',
    product: '마스코트 인형',
    quantity: 200,
    totalAmount: '₩1,800,000',
    orderDate: '2024-11-28',
    status: 'delivered'
  },
  {
    id: 5,
    orderNo: 'ORD-2024-1120',
    product: '인형 키링',
    quantity: 600,
    totalAmount: '₩1,200,000',
    orderDate: '2024-11-20',
    status: 'delivered'
  }
];

export const mockDocuments = [
  {
    id: 1,
    name: '견적서_2024_12.pdf',
    type: '견적서',
    date: '2024-12-15',
    size: '2.4 MB',
    downloadUrl: '#'
  },
  {
    id: 2,
    name: '거래명세서_2024_12.pdf',
    type: '거래명세서',
    date: '2024-12-10',
    size: '1.8 MB',
    downloadUrl: '#'
  },
  {
    id: 3,
    name: '세금계산서_2024_11.pdf',
    type: '세금계산서',
    date: '2024-11-30',
    size: '1.2 MB',
    downloadUrl: '#'
  },
  {
    id: 4,
    name: '계약서_2024_11.pdf',
    type: '계약서',
    date: '2024-11-25',
    size: '3.1 MB',
    downloadUrl: '#'
  },
  {
    id: 5,
    name: '견적서_2024_11.pdf',
    type: '견적서',
    date: '2024-11-20',
    size: '2.2 MB',
    downloadUrl: '#'
  }
];

export const mockDefectReports = [
  {
    id: 1,
    orderNo: 'ORD-2024-1201',
    productType: '봉제 인형',
    issue: '봉제 불량',
    description: '인형 팔 부분의 봉제가 일부 풀어져 있습니다.',
    reportDate: '2024-12-05',
    status: 'done',
    resolution: '교체 제품 발송 완료'
  },
  {
    id: 2,
    orderNo: 'ORD-2024-1115',
    productType: '인형 키링',
    issue: '색상 오류',
    description: '요청한 색상과 다른 제품이 배송되었습니다.',
    reportDate: '2024-11-20',
    status: 'processing',
    resolution: null
  },
  {
    id: 3,
    orderNo: 'ORD-2024-1110',
    productType: '마스코트 인형',
    issue: '사이즈 오차',
    description: '주문 사양보다 약간 작게 제작되었습니다.',
    reportDate: '2024-11-15',
    status: 'done',
    resolution: '부분 환불 처리 완료'
  }
];

export const mockUserStats = {
  totalQuotes: 24,
  activeOrders: 8,
  completedOrders: 16,
  unreadMessages: 3,
  pendingInquiries: 2
};