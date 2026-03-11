'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileProcessed?: (text: string, fileName: string) => void;
  compact?: boolean;
}

export function FileUploader({ onFileProcessed, compact = false }: FileUploaderProps) {
  const { uploadedFiles, addFile, removeFile } = useStore();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadError(null);
      setUploading(true);

      for (const file of acceptedFiles) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Upload failed');
          }

          const data = await response.json();
          const newFile = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: data.name,
            text: data.text,
            type: data.type,
            uploadedAt: Date.now(),
          };
          addFile(newFile);
          onFileProcessed?.(data.text, data.name);
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : 'Upload failed');
        }
      }

      setUploading(false);
    },
    [addFile, onFileProcessed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  if (compact) {
    return (
      <div className="space-y-2">
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-3 cursor-pointer transition-all text-center',
            isDragActive
              ? 'border-[#81B29A] bg-[#81B29A]/10'
              : 'border-[#3A5253] hover:border-[#81B29A] hover:bg-[#81B29A]/5'
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-[rgba(255,245,245,0.5)]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-[rgba(255,245,245,0.5)]">
              <Upload className="w-4 h-4" />
              <span>{isDragActive ? 'Drop here' : 'Upload PDF/TXT'}</span>
            </div>
          )}
        </div>
        {uploadedFiles.length > 0 && (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 text-xs p-1.5 bg-[#3A5253]/40 rounded"
              >
                <FileText className="w-3 h-3 text-[#81B29A] shrink-0" />
                <span className="truncate text-[rgba(255,245,245,0.7)] flex-1">{file.name}</span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-[rgba(255,245,245,0.3)] hover:text-[#E07A5F] transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all text-center',
          isDragActive
            ? 'border-[#81B29A] bg-[#81B29A]/10 orbit-glow'
            : 'border-[#3A5253] hover:border-[#81B29A] hover:bg-[#81B29A]/5'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-[#81B29A] animate-spin" />
              <p className="text-[rgba(255,245,245,0.7)]">Processing your file...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#81B29A]/20 border border-[#81B29A]/50 flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#81B29A]" />
              </div>
              <div>
                <p className="text-[rgba(255,245,245,0.8)] font-medium">
                  {isDragActive ? 'Drop it here!' : 'Drag & drop your study materials'}
                </p>
                <p className="text-[rgba(255,245,245,0.4)] text-sm mt-1">PDF or TXT files, up to 10MB</p>
              </div>
              <Button variant="outline" size="sm" className="border-[#81B29A]/50 text-[#81B29A]">
                Browse Files
              </Button>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <p className="text-[#E07A5F] text-sm text-center">{uploadError}</p>
      )}

      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h3 className="text-sm font-semibold text-[rgba(255,245,245,0.5)] uppercase tracking-wide">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-3 bg-[#3A5253]/40 rounded-lg border border-[#3A5253]/50"
              >
                <div className="w-8 h-8 rounded bg-[#81B29A]/20 border border-[#81B29A]/30 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#81B29A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#FFF5F5] truncate">{file.name}</p>
                  <p className="text-xs text-[rgba(255,245,245,0.4)]">
                    {file.text.split(' ').length.toLocaleString()} words extracted
                  </p>
                </div>
                <CheckCircle className="w-4 h-4 text-[#81B29A] shrink-0" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-[rgba(255,245,245,0.3)] hover:text-[#E07A5F] h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
