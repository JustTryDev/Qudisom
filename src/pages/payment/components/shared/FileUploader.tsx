// 파일 업로드 컴포넌트 (File Uploader Component)

import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, FileText, Image, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UploadedFile } from '../../types';

interface FileUploaderProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // bytes
  label?: string;
  description?: string;
  disabled?: boolean;
  error?: string;
  showInstructions?: boolean; // 파일별 코멘트 표시 여부 (Show per-file comment input)
  instructionsPlaceholder?: string; // 코멘트 플레이스홀더 (Comment placeholder)
  className?: string;
}

export function FileUploader({
  files,
  onFilesChange,
  accept = '*',
  multiple = true,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  label,
  description,
  disabled = false,
  error,
  showInstructions = false,
  instructionsPlaceholder,
  className,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    (fileList: FileList) => {
      setUploadError(null);
      const newFiles: UploadedFile[] = [];

      const remainingSlots = maxFiles - files.length;
      const filesToProcess = Array.from(fileList).slice(0, remainingSlots);

      for (const file of filesToProcess) {
        // 파일 크기 검증 (File size validation)
        if (file.size > maxSize) {
          setUploadError(
            `파일 크기가 너무 큽니다. 최대 ${formatFileSize(maxSize)}까지 업로드 가능합니다.`
          );
          continue;
        }

        newFiles.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          instructions: '',
          uploadedAt: new Date(),
        });
      }

      if (newFiles.length > 0) {
        onFilesChange([...files, ...newFiles]);
      }
    },
    [files, maxFiles, maxSize, onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const { files: droppedFiles } = e.dataTransfer;
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [disabled, processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files: selectedFiles } = e.target;
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles);
      }
      // 같은 파일 재선택 허용 (Allow reselecting same file)
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [processFiles]
  );

  const handleRemove = useCallback(
    (id: string) => {
      onFilesChange(files.filter((f) => f.id !== id));
    },
    [files, onFilesChange]
  );

  // 파일별 코멘트 변경 핸들러 (Per-file comment change handler)
  const handleInstructionsChange = useCallback(
    (id: string, instructions: string) => {
      onFilesChange(
        files.map((f) => (f.id === id ? { ...f, instructions } : f))
      );
    },
    [files, onFilesChange]
  );

  const handleClick = useCallback(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }, [disabled]);

  const canAddMore = files.length < maxFiles;

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* 드롭존 (Dropzone) */}
      {canAddMore && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer',
            isDragging && 'border-[#fab803] bg-[#fab803]/5',
            !isDragging && 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-300'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-gray-100 p-3">
              <Upload className="h-6 w-6 text-gray-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {description || `최대 ${formatFileSize(maxSize)}, ${maxFiles}개까지`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 에러 메시지 (Error Message) */}
      {(error || uploadError) && (
        <p className="text-sm text-red-500">{error || uploadError}</p>
      )}

      {/* 파일 목록 (File List) */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              onRemove={() => handleRemove(file.id)}
              onInstructionsChange={(instructions) =>
                handleInstructionsChange(file.id, instructions)
              }
              showInstructions={showInstructions}
              instructionsPlaceholder={instructionsPlaceholder}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== 파일 아이템 (File Item) ====================

interface FileItemProps {
  file: UploadedFile;
  onRemove: () => void;
  onInstructionsChange?: (instructions: string) => void; // 코멘트 변경 핸들러 (Comment change handler)
  showInstructions?: boolean; // 코멘트 입력 표시 여부 (Show comment input)
  instructionsPlaceholder?: string; // 코멘트 플레이스홀더 (Comment placeholder)
  disabled?: boolean;
  className?: string;
}

export function FileItem({
  file,
  onRemove,
  onInstructionsChange,
  showInstructions = false,
  instructionsPlaceholder = '작성 가이드나 수정 요청 사항을 입력해주세요',
  disabled,
  className,
}: FileItemProps) {
  const Icon = getFileIcon(file.type);
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-gray-50 overflow-hidden',
        className
      )}
    >
      {/* 파일 정보 헤더 (File Info Header) */}
      <div className="flex items-center gap-3 p-3">
        <div className="rounded-lg bg-white p-2 border border-gray-100">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        </div>

        <div className="flex items-center gap-1">
          {/* 코멘트 토글 버튼 (Comment Toggle Button) */}
          {showInstructions && onInstructionsChange && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'shrink-0 rounded-lg px-2 py-1 text-xs font-medium transition-colors',
                isExpanded || file.instructions
                  ? 'bg-[#fab803]/10 text-[#fab803]'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {file.instructions ? '코멘트 수정' : '코멘트 추가'}
            </button>
          )}

          {!disabled && (
            <button
              onClick={onRemove}
              className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* 코멘트 입력 영역 (Comment Input Area) */}
      {showInstructions && onInstructionsChange && isExpanded && (
        <div className="px-3 pb-3 pt-0">
          <textarea
            value={file.instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            placeholder={instructionsPlaceholder}
            disabled={disabled}
            rows={2}
            className={cn(
              'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 resize-none transition-colors',
              'focus:border-[#fab803] focus:outline-none focus:ring-2 focus:ring-[#fab803]/20',
              'disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed'
            )}
          />
          <p className="text-xs text-gray-400 mt-1">
            예: &quot;표지 이미지를 더 선명하게 해주세요&quot;
          </p>
        </div>
      )}

      {/* 저장된 코멘트 표시 (Saved Comment Display) - 축소 상태일 때 */}
      {showInstructions && file.instructions && !isExpanded && (
        <div className="px-3 pb-3 pt-0">
          <p className="text-xs text-gray-600 bg-white rounded-lg border border-gray-100 p-2">
            💬 {file.instructions}
          </p>
        </div>
      )}
    </div>
  );
}

// ==================== 파일 업로드 진행 (File Upload Progress) ====================

interface FileUploadProgressProps {
  file: UploadedFile;
  progress: number; // 0-100
  className?: string;
}

export function FileUploadProgress({
  file,
  progress,
  className,
}: FileUploadProgressProps) {
  const Icon = getFileIcon(file.type);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3',
        className
      )}
    >
      <div className="rounded-lg bg-white p-2 border border-gray-100">
        {progress < 100 ? (
          <Loader2 className="h-5 w-5 text-[#fab803] animate-spin" />
        ) : (
          <Icon className="h-5 w-5 text-green-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <div className="mt-1.5">
          <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#fab803] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <span className="text-xs text-gray-500 shrink-0">{progress}%</span>
    </div>
  );
}

// ==================== 유틸리티 함수 (Utility Functions) ====================

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.includes('pdf') || mimeType.includes('document')) return FileText;
  return File;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default FileUploader;
