import { X } from 'lucide-react';

interface QuoteRequestPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteRequestPopup({ isOpen, onClose }: QuoteRequestPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-[#1a2867]">견적 요청</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제작 아이템 <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab803] text-[#1a2867]">
                <option value="">선택하세요</option>
                <option value="봉제 인형">봉제 인형</option>
                <option value="인형 키링">인형 키링</option>
                <option value="마스코트 인형">마스코트 인형</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수량 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="300"
                defaultValue="300"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab803] text-[#1a2867]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                납기일자
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab803] text-[#1a2867]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이즈 (가로 x 세로 x 깊이)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="가로"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab803] text-center text-[#1a2867]"
                />
                <input
                  type="text"
                  placeholder="세로"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab803] text-center text-[#1a2867]"
                />
                <input
                  type="text"
                  placeholder="깊이"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab803] text-center text-[#1a2867]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                기타 요청 사항
              </label>
              <textarea
                rows={4}
                placeholder="추가로 전달하실 내용이 있으시면 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab803] resize-none text-[#1a2867]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                파일 업로드
              </label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab803] text-[#1a2867]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
              <button
                onClick={() => {
                  alert('견적 요청이 접수되었습니다!');
                  onClose();
                }}
                className="flex-1 px-6 py-3 bg-[#fab803] hover:bg-[#fab803]/90 text-white rounded-lg transition-colors font-bold"
              >
                견적 요청하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
