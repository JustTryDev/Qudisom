import { useState } from 'react';
import { Wand2, RefreshCw, Trash2 } from 'lucide-react';

interface AIFilePreviewProps {
  filePreview: { file: File; preview: string };
  fileIndex: number;
  productIndex: number;
  onGenerate: (productIndex: number, fileIndex: number, prompt: string) => void;
  onRemove: (productIndex: number, fileIndex: number) => void;
  isGenerating: boolean;
}

export function AIFilePreview({
  filePreview,
  fileIndex,
  productIndex,
  onGenerate,
  onRemove,
  isGenerating
}: AIFilePreviewProps) {
  const [prompt, setPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(productIndex, fileIndex, prompt);
      setShowPromptInput(false);
    }
  };

  return (
    <div className="relative border-2 border-primary/20 rounded-lg overflow-hidden bg-background">
      {/* Image Preview */}
      {filePreview.preview ? (
        <div className="relative group">
          <img
            src={filePreview.preview}
            alt={filePreview.file.name}
            className="w-full h-32 object-cover"
          />
          {/* Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(productIndex, fileIndex)}
            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="w-full h-32 flex items-center justify-center bg-muted">
          <p className="text-xs text-muted-foreground truncate px-2">
            {filePreview.file.name}
          </p>
        </div>
      )}

      {/* Filename */}
      <div className="p-2 bg-muted/50 border-t border-border">
        <p className="text-xs text-muted-foreground truncate">
          {filePreview.file.name}
        </p>
      </div>

      {/* AI Generation Section */}
      <div className="p-3 bg-gradient-to-br from-primary/5 to-secondary/5 border-t border-primary/20">
        {!showPromptInput ? (
          <button
            type="button"
            onClick={() => setShowPromptInput(true)}
            disabled={isGenerating}
            className={`w-full px-3 py-2 rounded-lg transition-opacity flex items-center justify-center gap-2 text-sm ${
              isGenerating
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                AI 생성
              </>
            )}
          </button>
        ) : (
          <div className="space-y-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="AI에게 요청할 내용을 입력하세요&#10;예: 귀여운 곰 인형으로 만들어줘"
              className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:border-primary focus:outline-none resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPromptInput(false);
                  setPrompt('');
                }}
                className="flex-1 px-3 py-1.5 bg-muted text-foreground rounded text-xs hover:bg-muted/80 transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className={`flex-1 px-3 py-1.5 rounded text-xs transition-all flex items-center justify-center gap-1.5 ${
                  !prompt.trim() || isGenerating
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3 h-3" />
                    생성
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}