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
    maxSize: 10 * 1024 * 1024,
  });

  if (compact) {
    return (
      <div className="space-y-2">
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed p-3 cursor-pointer transition-colors text-center',
            isDragActive
              ? 'border-[#2D5A3D] bg-[#E4E2DA]'
              : 'border-[#D0CEC6] hover:border-[#2D5A3D]'
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-sm text-[#6B6B5A]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-[#6B6B5A]">
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
                className="flex items-center gap-2 text-xs p-1.5 bg-[#E4E2DA] border border-[#D0CEC6]"
              >
                <FileText className="w-3 h-3 text-[#2D5A3D] shrink-0" />
                <span className="truncate text-[#1C3A2A] flex-1">{file.name}</span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-[#6B6B5A] hover:text-[#1C3A2A] transition-colors"
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
          'border-2 border-dashed p-8 cursor-pointer transition-colors text-center',
          isDragActive
            ? 'border-[#2D5A3D] bg-[#E4E2DA]'
            : 'border-[#D0CEC6] hover:border-[#2D5A3D]'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-[#2D5A3D] animate-spin" />
              <p className="text-[#6B6B5A]">Processing your file...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 border border-[#D0CEC6] bg-[#E4E2DA] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#2D5A3D]" />
              </div>
              <div>
                <p className="text-[#1C3A2A] font-medium">
                  {isDragActive ? 'Drop it here' : 'Drag & drop your study materials'}
                </p>
                <p className="text-[#6B6B5A] text-sm mt-1">PDF or TXT files, up to 10MB</p>
              </div>
              <Button variant="outline" size="sm" className="border-[#D0CEC6] text-[#2D5A3D] hover:border-[#2D5A3D]">
                Browse Files
              </Button>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <p className="text-red-600 text-sm text-center">{uploadError}</p>
      )}

      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h3 className="text-xs font-semibold text-[#6B6B5A] uppercase tracking-widest">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-3 p-3 bg-[#E4E2DA] border border-[#D0CEC6]"
              >
                <div className="w-8 h-8 border border-[#D0CEC6] bg-[#ECEAE3] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-[#2D5A3D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C3A2A] truncate">{file.name}</p>
                  <p className="text-xs text-[#6B6B5A]">
                    {file.text.split(' ').length.toLocaleString()} words extracted
                  </p>
                </div>
                <CheckCircle className="w-4 h-4 text-[#2D5A3D] shrink-0" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-[#6B6B5A] hover:text-[#1C3A2A] h-8 w-8 p-0"
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
