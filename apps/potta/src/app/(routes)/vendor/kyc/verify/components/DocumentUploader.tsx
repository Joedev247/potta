'use client';
import React, { useRef, useState } from 'react';
import { Upload, FileText, Camera, X } from 'lucide-react';

interface DocumentType {
  id: string;
  type: string;
  label: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  maxSize: number; // in MB
}

interface DocumentUploaderProps {
  documentType: DocumentType;
  onUpload: (file: File) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  documentType,
  onUpload,
  onError,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > documentType.maxSize * 1024 * 1024) {
      return `File size must be less than ${documentType.maxSize}MB`;
    }

    // Check file type
    if (!documentType.acceptedFormats.includes(file.type)) {
      return `File type not supported. Accepted formats: ${documentType.acceptedFormats.join(
        ', '
      )}`;
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onError(validationError);
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onUpload(file);
    } catch (error) {
      onError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={documentType.acceptedFormats.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragOver
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            <p className="text-green-600 font-medium">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {documentType.acceptedFormats.includes('image/') && (
                  <>
                    <Camera className="w-4 h-4 inline mr-1" />
                    Photos or
                  </>
                )}
                <FileText className="w-4 h-4 inline mx-1" />
                PDF files up to {documentType.maxSize}MB
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        <p>
          Accepted formats:{' '}
          {documentType.acceptedFormats
            .map((format) => {
              if (format.startsWith('image/')) return 'Images';
              if (format === 'application/pdf') return 'PDF';
              return format;
            })
            .join(', ')}
        </p>
        <p>Maximum file size: {documentType.maxSize}MB</p>
      </div>
    </div>
  );
};

export default DocumentUploader;

