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
          className="border-2 border-dashed p-3 cursor-pointer transition-colors text-center"
          style={{
            borderColor: isDragActive ? '#1565C0' : '#B0BEC5',
            background: isDragActive ? '#E3F2FD' : '#FFFFFF',
          }}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#546E7A' }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#546E7A' }}>
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
                className="flex items-center gap-2 text-xs p-1.5"
                style={{ background: '#F0F4F8', border: '1px solid #B0BEC5' }}
              >
                <FileText className="w-3 h-3 shrink-0" style={{ color: '#1565C0' }} />
                <span className="truncate flex-1" style={{ color: '#37474F' }}>{file.name}</span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="transition-colors"
                  style={{ color: '#546E7A' }}
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
        className="border-2 border-dashed p-8 cursor-pointer transition-colors text-center"
        style={{
          borderColor: isDragActive ? '#1565C0' : '#B0BEC5',
          background: isDragActive ? '#E3F2FD' : '#FFFFFF',
        }}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#1565C0' }} />
              <p style={{ color: '#546E7A' }}>Processing your file...</p>
            </>
          ) : (
            <>
              <div
                className="w-12 h-12 flex items-center justify-center"
                style={{ border: '1px solid #B0BEC5', background: '#E3F2FD' }}
              >
                <Upload className="w-6 h-6" style={{ color: '#1565C0' }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: '#37474F' }}>
                  {isDragActive ? 'Drop it here' : 'Drag & drop your study materials'}
                </p>
                <p className="text-sm mt-1" style={{ color: '#546E7A' }}>PDF or TXT files, up to 10MB</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                style={{ borderColor: '#B0BEC5', color: '#1565C0' }}
              >
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
            <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#546E7A' }}>
              Uploaded Files ({uploadedFiles.length})
            </h3>
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-3 p-3"
                style={{ background: '#F0F4F8', border: '1px solid #B0BEC5' }}
              >
                <div
                  className="w-8 h-8 flex items-center justify-center shrink-0"
                  style={{ border: '1px solid #B0BEC5', background: '#E3F2FD' }}
                >
                  <FileText className="w-4 h-4" style={{ color: '#1565C0' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#37474F' }}>{file.name}</p>
                  <p className="text-xs" style={{ color: '#546E7A' }}>
                    {file.text.split(' ').length.toLocaleString()} words extracted
                  </p>
                </div>
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#1565C0' }} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="h-8 w-8 p-0"
                  style={{ color: '#546E7A' }}
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
