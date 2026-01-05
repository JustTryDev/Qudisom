import { Trash2 } from 'lucide-react';

interface ShippingAddress {
  id: string;
  deliveryMethod: 'quick' | 'courier';
  quantity: number;
  option: string;
  recipientName: string;
  recipientPhone: string;
  address: string;
  zipCode: string;
  memo: string;
  courierCompany: string;
  trackingNumber: string;
}

interface BulkShippingTableProps {
  addresses: ShippingAddress[];
  onUpdate: (id: string, field: keyof ShippingAddress, value: any) => void;
  onRemove: (id: string) => void;
}

export function BulkShippingTable({ addresses, onUpdate, onRemove }: BulkShippingTableProps) {
  // 수량 합계 계산
  const totalQuantity = addresses.reduce((sum, addr) => sum + (addr.quantity || 0), 0);

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full">
        <thead className="bg-secondary text-secondary-foreground sticky top-0 z-10">
          <tr>
            <th className="px-4 py-4 text-left min-w-[50px]">#</th>
            <th className="px-4 py-4 text-left min-w-[100px]">수량</th>
            <th className="px-4 py-4 text-left min-w-[100px]">이름</th>
            <th className="px-4 py-4 text-left min-w-[140px]">연락처</th>
            <th className="px-4 py-4 text-left min-w-[280px]">주소</th>
            <th className="px-4 py-4 text-left min-w-[110px]">우편번호</th>
            <th className="px-4 py-4 text-left min-w-[180px]">배송 메모</th>
            <th className="px-4 py-4 text-left min-w-[130px]">
              택배사
              <div className="text-sm text-secondary-foreground/60 mt-1">(관리자 입력)</div>
            </th>
            <th className="px-4 py-4 text-left min-w-[140px]">
              운송장 번호
              <div className="text-sm text-secondary-foreground/60 mt-1">(관리자 입력)</div>
            </th>
            <th className="px-4 py-4 text-center min-w-[70px]">삭제</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address, index) => (
            <tr
              key={address.id}
              className="border-t border-border hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  min="0"
                  value={address.quantity}
                  onChange={(e) => onUpdate(address.id, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  placeholder="0"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={address.recipientName}
                  onChange={(e) => onUpdate(address.id, 'recipientName', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  placeholder="이름"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="tel"
                  value={address.recipientPhone}
                  onChange={(e) => onUpdate(address.id, 'recipientPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  placeholder="010-0000-0000"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={address.address}
                  onChange={(e) => onUpdate(address.id, 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  placeholder="주소"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => onUpdate(address.id, 'zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  placeholder="00000"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={address.memo}
                  onChange={(e) => onUpdate(address.id, 'memo', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  placeholder="배송 메모"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={address.courierCompany}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  placeholder="택배사"
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={address.trackingNumber}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  placeholder="운송장 번호"
                />
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onRemove(address.id)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
          {addresses.length === 0 && (
            <tr>
              <td colSpan={10} className="px-6 py-16 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-3">
                  <p>배송지 정보가 없습니다</p>
                  <p className="text-sm">우측 상단의 "배송지 추가" 버튼을 클릭하세요</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
        {/* 합계 행 (Total row) */}
        {addresses.length > 0 && (
          <tfoot className="bg-muted/50 border-t border-border">
            <tr>
              <td colSpan={1} className="px-4 py-4 text-foreground text-right">
                총 합계
              </td>
              <td className="px-4 py-4">
                <div className="w-full px-3 py-2 bg-secondary/10 border border-secondary rounded-lg text-center text-secondary">
                  {totalQuantity.toLocaleString()}
                </div>
              </td>
              <td colSpan={8}></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}