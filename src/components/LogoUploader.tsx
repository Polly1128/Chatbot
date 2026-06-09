import { useState, useCallback } from 'react';
import { Upload, X, RefreshCw } from 'lucide-react';

interface LogoUploaderProps {
  currentLogo: string | null;
  onLogoChange: (logo: string | null) => void;
}

export default function LogoUploader({ currentLogo, onLogoChange }: LogoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onLogoChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/svg+xml';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLogoChange(null);
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`relative border border-dashed rounded-lg cursor-pointer transition-all flex items-center justify-center ${
          isDragging
            ? 'border-brand-petrol bg-primary-soft'
            : 'border-deep-blue-20 hover:border-deep-blue-20 hover:bg-light-sand'
        } ${currentLogo ? 'p-3 h-24' : 'h-24'}`}
      >
        {!currentLogo ? (
          <div className="flex flex-col items-center justify-center text-deep-blue-40">
            <Upload size={18} />
            <span className="text-xs mt-1.5">点击或拖拽上传 Logo</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <div className="h-16 w-24 bg-white border border-deep-blue-10 rounded flex items-center justify-center shrink-0">
              <img
                src={currentLogo}
                alt="Logo"
                className="max-w-full max-h-full object-contain p-1"
              />
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <button
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-light-sand text-deep-blue-60 rounded hover:bg-deep-blue-10 transition-colors"
              >
                <RefreshCw size={12} />
                更换
              </button>
              <button
                onClick={handleRemove}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-red hover:bg-red-light rounded transition-colors"
              >
                <X size={12} />
                移除
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-deep-blue-40">支持 PNG、JPG、SVG（建议尺寸 200×60px）</p>
    </div>
  );
}
