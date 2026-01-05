import { useState, useRef, useEffect } from 'react';
import { Paintbrush, Eraser, RotateCcw, Wand2, Sparkles } from 'lucide-react';

interface AIImageEditorProps {
  imageUrl: string;
  onGenerate: (mask: string, prompt: string) => void;
}

export function AIImageEditor({ imageUrl, onGenerate }: AIImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [prompt, setPrompt] = useState('');
  const [hasDrawing, setHasDrawing] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Load the image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = 800;
        canvas.height = 600;
        
        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = imageUrl;
    }
  }, [imageUrl]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.beginPath();
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (tool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(250, 184, 3, 0.5)';
      ctx.fillStyle = 'rgba(250, 184, 3, 0.3)';
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (e.type === 'mousedown') {
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    setHasDrawing(true);
  };

  const clearDrawing = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reload image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imageUrl;
    setHasDrawing(false);
  };

  const handleGenerate = () => {
    if (!canvasRef.current) return;
    const maskData = canvasRef.current.toDataURL();
    onGenerate(maskData, prompt);
  };

  return (
    <div className="flex overflow-hidden h-full">
      {/* Left Panel - Canvas */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center bg-muted/30">
        <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="cursor-crosshair"
            style={{ maxWidth: '100%', maxHeight: '60vh' }}
          />
          
          {/* Instruction Overlay */}
          {!hasDrawing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
              <div className="bg-white/95 px-6 py-4 rounded-lg text-center">
                <Paintbrush className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm mb-1">개선하고 싶은 영역을 마우스로 드래그하세요</p>
                <p className="text-xs text-muted-foreground">브러시로 표시된 영역만 AI가 재생성합니다</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Tools */}
      <div className="w-80 border-l border-border p-6 space-y-6 overflow-y-auto">
        {/* Tool Selection */}
        <div>
          <label className="block text-sm mb-3">도구 선택</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTool('brush')}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                tool === 'brush'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Paintbrush className="w-5 h-5" />
              <span className="text-xs">브러시</span>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                tool === 'eraser'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Eraser className="w-5 h-5" />
              <span className="text-xs">지우개</span>
            </button>
          </div>
        </div>

        {/* Brush Size */}
        <div>
          <label className="block text-sm mb-3">브러시 크기</label>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">작게</span>
            <span className="text-sm">{brushSize}px</span>
            <span className="text-xs text-muted-foreground">크게</span>
          </div>
        </div>

        {/* Preview Circle */}
        <div>
          <label className="block text-sm mb-3">브러시 미리보기</label>
          <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg border border-border">
            <div
              style={{
                width: `${brushSize}px`,
                height: `${brushSize}px`,
                backgroundColor: tool === 'brush' ? 'rgba(250, 184, 3, 0.5)' : '#666',
                borderRadius: '50%'
              }}
            />
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-sm mb-3 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" />
            개선 요청사항
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-input-background border border-transparent focus:border-primary focus:outline-none transition-colors resize-none"
            placeholder="예: 더 귀엽게 만들어주세요&#10;색상을 파란색으로 바꿔주세요&#10;디테일을 추가해주세요"
          />
          <p className="text-xs text-muted-foreground mt-2">
            표시한 영역을 어떻게 개선할지 설명해주세요
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t border-border">
          <button
            onClick={clearDrawing}
            disabled={!hasDrawing}
            className="w-full px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            다시 그리기
          </button>
          <button
            onClick={handleGenerate}
            disabled={!hasDrawing || !prompt.trim()}
            className="w-full px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5" />
            AI로 개선하기
          </button>
        </div>

        {/* Info */}
        <div className="p-3 bg-muted/50 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            💡 <strong>팁:</strong> 브러시로 영역을 칠한 후 개선 요청사항을 작성하면, AI가 해당 부분만 재생성합니다.
          </p>
        </div>
      </div>
    </div>
  );
}