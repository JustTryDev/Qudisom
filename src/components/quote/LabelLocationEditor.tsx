import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, Square, Circle, Undo2, Save, Sparkles, ArrowUpRight, AlertCircle, X } from 'lucide-react';
import { cn } from '../ui/utils';

// ========== Button 컴포넌트 (Button Component) ==========
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  leftIcon,
  onClick,
  disabled = false,
  className = ''
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-[#1a2867] text-white hover:bg-[#1a2867]/90',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    accent: 'bg-[#fab803] text-[#1a2867] hover:bg-[#fab803]/90'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
    >
      {leftIcon && leftIcon}
      {children}
    </button>
  );
};

// ========== 타입 정의 (Type definitions) ==========
type DrawTool = 'brush' | 'rectangle' | 'circle' | 'arrow';

interface Marker {
  number: number;
  x: number;
  y: number;
}

// ========== 모달 편집기 컴포넌트 (Modal Editor Component) ==========
const EditorModal = ({
  file,
  fileIndex,
  availableFiles,
  onClose,
  onSave,
  onChangeFile
}: {
  file: { name: string; url: string };
  fileIndex: number;
  availableFiles: { name: string; url: string }[];
  onClose: () => void;
  onSave: (imageData: string) => void;
  onChangeFile: (index: number) => void;
}) => {
  const [brushSize, setBrushSize] = useState(3);
  const [drawTool, setDrawTool] = useState<DrawTool>('arrow'); // 기본 도구를 화살표로 설정 (Default tool is arrow)
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
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [editedImages, setEditedImages] = useState<Map<number, { maskData: ImageData, markers: Marker[] }>>(new Map());
  const [additionalNotes, setAdditionalNotes] = useState(''); // 기타 요청 사항 (Additional notes)

  const MAX_MARKERS = 5;

  // 히스토리에 현재 상태 저장 (Save current state to history)
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

  // 되돌리기 (Undo)
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
      setMarkers(prev => prev.slice(0, -1));
    } else {
      ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      setHistoryIndex(-1);
      setMarkers([]);
    }
  }, [historyIndex, history]);

  // 이미지 로드 및 캔버스 초기화 (Load image and initialize canvas)
  useEffect(() => {
    if (!file) return;
    
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      
      const container = containerRef.current;
      if (container) {
        const maxWidth = Math.min(window.innerWidth - 100, 800);
        const maxHeight = Math.min(window.innerHeight - 400, 500);
        
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
    img.src = file.url;
  }, [file]);

  // 캔버스에 이미지 그리기 (Draw image on canvas)
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
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasSize.width;
        tempCanvas.height = canvasSize.height;
        tempCanvasRef.current = tempCanvas;
        
        setHistory([]);
        setHistoryIndex(-1);
        setMarkers([]);
      }
    }
  }, [imageLoaded, canvasSize]);

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

  const addMarker = useCallback((x: number, y: number) => {
    if (markers.length >= MAX_MARKERS) return;
    
    setMarkers(prev => [...prev, {
      number: prev.length + 1,
      x,
      y
    }]);
  }, [markers.length]);

  const drawMarker = useCallback((ctx: CanvasRenderingContext2D, marker: Marker) => {
    const radius = 18;
    
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(marker.x, marker.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(marker.x, marker.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(marker.number.toString(), marker.x, marker.y);
  }, []);

  const redrawMarkers = useCallback(() => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    
    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;
    
    // 마커를 순서대로 재넘버링하여 그리기 (Redraw markers with sequential numbering)
    markers.forEach((marker, index) => {
      const updatedMarker = { ...marker, number: index + 1 };
      drawMarker(ctx, updatedMarker);
    });
  }, [markers, drawMarker]);

  const drawBrushLine = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const steps = Math.max(Math.ceil(dist / 2), 1);
    
    ctx.fillStyle = '#dc2626';
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [brushSize]);

  const drawDot = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [brushSize]);

  const drawRectangle = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.rect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    ctx.stroke();
  }, []);

  const drawCircle = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const radiusX = Math.abs(x2 - x1) / 2;
    const radiusY = Math.abs(y2 - y1) / 2;
    
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.stroke();
  }, []);

  const drawArrow = useCallback((ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
    const headLength = 10;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (markers.length >= MAX_MARKERS) return;
    
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
      if (tempCanvasRef.current) {
        const tempCtx = tempCanvasRef.current.getContext('2d');
        if (tempCtx) {
          tempCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
          tempCtx.drawImage(maskCanvas, 0, 0);
        }
      }
    }
  }, [drawTool, getCoordinates, drawDot, canvasSize, markers.length]);

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
      if (tempCanvasRef.current) {
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.drawImage(tempCanvasRef.current, 0, 0);
        redrawMarkers();
      }
      
      if (drawTool === 'rectangle') {
        drawRectangle(ctx, shapeStartRef.current.x, shapeStartRef.current.y, x, y);
      } else if (drawTool === 'circle') {
        drawCircle(ctx, shapeStartRef.current.x, shapeStartRef.current.y, x, y);
      } else if (drawTool === 'arrow') {
        drawArrow(ctx, shapeStartRef.current.x, shapeStartRef.current.y, x, y);
      }
    }
  }, [isDrawing, drawTool, getCoordinates, drawBrushLine, canvasSize, drawRectangle, drawCircle, drawArrow, redrawMarkers]);

  const stopDrawing = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext('2d');
    if (!ctx) return;

    let centerX = 0;
    let centerY = 0;

    if (drawTool !== 'brush' && shapeStartRef.current && e) {
      const { x, y } = getCoordinates(e);
      
      if (tempCanvasRef.current) {
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.drawImage(tempCanvasRef.current, 0, 0);
        redrawMarkers();
      }
      
      if (drawTool === 'rectangle') {
        drawRectangle(ctx, shapeStartRef.current.x, shapeStartRef.current.y, x, y);
        centerX = (shapeStartRef.current.x + x) / 2;
        centerY = (shapeStartRef.current.y + y) / 2;
      } else if (drawTool === 'circle') {
        drawCircle(ctx, shapeStartRef.current.x, shapeStartRef.current.y, x, y);
        centerX = (shapeStartRef.current.x + x) / 2;
        centerY = (shapeStartRef.current.y + y) / 2;
      } else if (drawTool === 'arrow') {
        drawArrow(ctx, shapeStartRef.current.x, shapeStartRef.current.y, x, y);
        centerX = (shapeStartRef.current.x + x) / 2;
        centerY = (shapeStartRef.current.y + y) / 2;
      }
    } else if (drawTool === 'brush' && lastPosRef.current) {
      centerX = lastPosRef.current.x;
      centerY = lastPosRef.current.y;
    }

    // 마커 추가 및 즉시 그리기 (Add marker and draw immediately)
    if (centerX !== 0 || centerY !== 0) {
      const newMarkerNumber = markers.length + 1;
      const newMarker: Marker = {
        number: newMarkerNumber,
        x: centerX,
        y: centerY
      };
      
      // 즉시 마커 그리기 (Draw marker immediately)
      drawMarker(ctx, newMarker);
      
      // State 업데이트 (Update state)
      setMarkers(prev => [...prev, newMarker]);
    }

    saveToHistory();

    setIsDrawing(false);
    lastPosRef.current = null;
    shapeStartRef.current = null;
  }, [isDrawing, drawTool, getCoordinates, canvasSize, drawRectangle, drawCircle, drawArrow, saveToHistory, markers.length, drawMarker, redrawMarkers]);

  const handleReset = useCallback(() => {
    if (maskCanvasRef.current) {
      const maskCanvas = maskCanvasRef.current;
      const ctx = maskCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        setHistory([]);
        setHistoryIndex(-1);
        setMarkers([]);
      }
    }
  }, []);

  const handleSave = useCallback(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    
    if (canvas && maskCanvas) {
      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.width = canvas.width;
      combinedCanvas.height = canvas.height;
      const combinedCtx = combinedCanvas.getContext('2d');
      
      if (combinedCtx) {
        combinedCtx.drawImage(canvas, 0, 0);
        combinedCtx.drawImage(maskCanvas, 0, 0);
        
        const imageData = combinedCanvas.toDataURL('image/png');
        onSave(imageData);
        onClose();
      }
    }
  }, [onSave, onClose]);

  const toolButtons: { tool: DrawTool; icon: React.ReactNode; label: string }[] = [
    { tool: 'arrow', icon: <ArrowUpRight className="w-4 h-4" />, label: '화살표' },
    { tool: 'brush', icon: <Pencil className="w-4 h-4" />, label: '브러시' },
    { tool: 'rectangle', icon: <Square className="w-4 h-4" />, label: '사각형' },
    { tool: 'circle', icon: <Circle className="w-4 h-4" />, label: '원형' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 (Header) */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h3 className="text-lg font-semibold text-gray-900">라벨 위치 편집기</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 내용 (Content) */}
        <div className="p-6 space-y-4">
          {/* 파일 갤러리 (File gallery) */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">편집할 이미지 선택</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {availableFiles.map((f, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onChangeFile(index)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                    fileIndex === index
                      ? "border-[#fab803] ring-2 ring-[#fab803]/30"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <img 
                    src={f.url} 
                    alt={f.name} 
                    className="w-full h-full object-cover"
                  />
                  {fileIndex === index && (
                    <div className="absolute inset-0 bg-[#fab803]/20 flex items-center justify-center">
                      <div className="bg-[#fab803] text-[#1a2867] text-xs font-semibold px-2 py-1 rounded">
                        선택됨
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">{file.name}</p>
          </div>

          {/* 안내 문구 (Guide message) */}
          <div className="bg-[#1a2867] border-2 border-[#1a2867] rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white">
                <span className="font-medium">라벨을 부착하고 싶은 위치를 (최대 {MAX_MARKERS}곳) 표시해 주세요.</span> 낮은 숫자 순으로 우선적으로 작업을 시도합니다. 이미지 상으로 표시가 어려운 경우 기타 사항을 통해 작성해 주세요.
              </p>
            </div>
          </div>
          
          {/* 툴바 (Toolbar) */}
          <div className="flex items-center justify-between flex-wrap gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-white rounded-lg p-1">
                {toolButtons.map(({ tool, icon, label }) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => setDrawTool(tool)}
                    disabled={markers.length >= MAX_MARKERS}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                      drawTool === tool
                        ? 'bg-[#1a2867] text-white'
                        : 'text-gray-600 hover:bg-gray-100',
                      markers.length >= MAX_MARKERS && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {icon}
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleUndo}
                disabled={historyIndex < 0}
                leftIcon={<Undo2 className="w-3 h-3" />}
              >
                <span className="text-xs">되돌리기</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <span className="text-xs">초기화</span>
              </Button>
              <Button variant="accent" size="sm" onClick={handleSave} leftIcon={<Save className="w-3 h-3" />}>
                <span className="text-xs">저장</span>
              </Button>
            </div>
          </div>
          
          {/* 이미지 영역 (Image area) */}
          <div ref={containerRef} className="flex items-center justify-center min-h-[400px]">
            {imageLoaded ? (
              <div className="relative shadow-lg rounded-lg overflow-hidden" style={{ width: canvasSize.width, height: canvasSize.height }}>
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="absolute top-0 left-0 rounded-lg"
                />
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
                    cursor: markers.length >= MAX_MARKERS ? 'not-allowed' : 'crosshair',
                    touchAction: 'none'
                  }}
                  className="absolute top-0 left-0 rounded-lg"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-[#fab803]" />
                </motion.div>
              </div>
            )}
          </div>

          {/* 기타 요청 사항 (Additional notes) */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-[rgb(0,0,0)] text-[14px] font-normal font-bold">기타 요청 사항</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="이미지에 표기하기 어려운 라벨 위치가 있거나 원하시는 특정 라벨 사이즈가 있으시다면 알려주세요."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fab803] focus:border-transparent resize-none"
            />
          </div>

          {/* 안내 사항 (Instructions) */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-3">
            <div className="space-y-2 text-sm text-gray-700">
              <ul className="space-y-2 list-disc list-inside">
                <li className="text-[13px]">
                  샘플 제작 전에는 봉제선의 위치를 정확히 파악하기 어렵기 때문에, 샘플 제작 과정에서 요청하신 위치에 모두 라벨 부착이 불가능한 경우, 부착 가능한 위치로 임의 변경될 수 있습니다.
                </li>
                <li className="text-[13px]">
                  일반적으로 샘플 제작 시에는 라벨의 위치, 크기 확인 용도로 아무것도 기재되어 있지 않은 무지 라벨이 부착됩니다.
                </li>
                <li className="text-[13px]">
                  사이즈는 인형 크기 대비 적합한 크기(최소 사이즈)로 제작되며, 별도로 원하시는 사이즈가 있으신 경우 알려주세요.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ========== 라벨 위치 편집기 컴포넌트 (Label Location Editor Component) ==========
export const LabelLocationEditor = ({ 
  availableFiles, 
  onSave 
}: {
  availableFiles: { name: string; url: string }[];
  onSave: (imageData: string) => void;
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

  if (availableFiles.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p className="text-[14px]">편집 가능한 디자인이 없습니다.</p>
        <p className="text-sm mt-2 text-[13px]">"디자인 파일 업로드 & 샘플 전달" 섹션에서 디자인을 먼저 업로드해주세요.</p>
      </div>
    );
  }

  return (
    <>
      {/* 갤러리 (Gallery) */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-[rgb(0,0,0)] text-[14px] font-normal font-bold">✅ 하단 이미지를 클릭하여, 원하시는 라벨 부착 위치를 표시해 주세요.</label>
        <p className="text-xs text-gray-500 -mt-1 text-[11px]">라벨 위치를 표시해 주시지 않으실 경우, 임의로 위치를 지정하여 라벨이 부착됩니다.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {availableFiles.map((file, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedFileIndex(index)}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#fab803] transition-all group"
            >
              <img 
                src={file.url} 
                alt={file.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <div className="bg-[#fab803] text-[#1a2867] text-xs font-semibold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  편집하기
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 모달 (Modal) */}
      <AnimatePresence>
        {selectedFileIndex !== null && (
          <EditorModal
            file={availableFiles[selectedFileIndex]}
            fileIndex={selectedFileIndex}
            availableFiles={availableFiles}
            onClose={() => setSelectedFileIndex(null)}
            onSave={onSave}
            onChangeFile={setSelectedFileIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
};