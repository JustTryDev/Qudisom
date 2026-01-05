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
  disabled?: boolean;
  className?: string;
}

export function FileItem({ file, onRemove, disabled, className }: FileItemProps) {
  const Icon = getFileIcon(file.type);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3',
        className
      )}
    >
      <div className="rounded-lg bg-white p-2 border border-gray-100">
        <Icon className="h-5 w-5 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
      </div>

      {!disabled && (
        <button
          onClick={onRemove}
          className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
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
