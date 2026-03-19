'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void;
  onWidgetOpenChange?: (isOpen: boolean) => void;
  currentImage?: string;
  error?: string;
  label?: string;
}

interface CloudinaryUploadWidgetOptions {
  cloudName: string;
  uploadPreset: string;
  sources?: string[];
  multiple?: boolean;
  maxFileSize?: number;
  clientAllowedFormats?: string[];
  maxImageWidth?: number;
  maxImageHeight?: number;
  folder?: string;
  tags?: string[];
}

interface CloudinaryUploadResult {
  event: string;
  info?: {
    secure_url: string;
    [key: string]: unknown;
  };
}

interface CloudinaryWidget {
  open: () => void;
  close: () => void;
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: CloudinaryUploadWidgetOptions,
        callback: (error: Error | null, result: CloudinaryUploadResult) => void
      ) => CloudinaryWidget;
    };
  }
}

export default function CloudinaryUploadWidget({
  onUpload,
  onWidgetOpenChange,
  currentImage,
  error,
  label = 'Service Image',
}: CloudinaryUploadWidgetProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(currentImage || '');
  const widgetRef = useRef<CloudinaryWidget | null>(null);

  useEffect(() => {
    // Load Cloudinary widget script
    if (!document.getElementById('cloudinary-upload-widget')) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.id = 'cloudinary-upload-widget';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openUploadWidget = () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary configuration is missing. Please check your .env file.');
      return;
    }

    if (!window.cloudinary) {
      alert('Cloudinary widget is still loading. Please try again in a moment.');
      return;
    }

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName,
          uploadPreset: uploadPreset,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          maxFileSize: 10000000, // 10MB
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          maxImageWidth: 2000,
          maxImageHeight: 2000,
          folder: 'ritual/services',
          tags: ['service'],
        },
        (error, result) => {
          if (error) {
            const errorMessage = error.message || 'Unknown error';
            alert(`Upload failed: ${errorMessage}\n\nPlease check:\n1. Your upload preset exists\n2. Upload preset is set to "Unsigned"\n3. Your cloud name is correct`);
            setIsUploading(false);
            return;
          }

          if (result.event === 'success') {
            const imageUrl = result.info?.secure_url;
            if (imageUrl) {
              setUploadedUrl(imageUrl);
              onUpload(imageUrl);
            }
            setIsUploading(false);
          }

          if (result.event === 'close') {
            setIsUploading(false);
            onWidgetOpenChange?.(false);
          }
        }
      );
    }

    setIsUploading(true);
    onWidgetOpenChange?.(true);
    widgetRef.current.open();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="space-y-3">
        {/* Upload Button */}
        <button
          type="button"
          onClick={openUploadWidget}
          disabled={isUploading}
          className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground 
                   rounded-lg transition-all duration-200 font-medium
                   focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {isUploading ? 'Uploading...' : uploadedUrl ? 'Change Image' : 'Upload Image'}
        </button>

        {/* Image Preview */}
        {uploadedUrl && (
          <div className="relative w-full h-48 bg-background border border-border rounded-lg overflow-hidden">
            <Image
              width={200}
              height={200}
              src={uploadedUrl}
              alt="Service preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={() => {
                  setUploadedUrl('');
                  onUpload('');
                }}
                className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full
                         transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Image URL Display */}
        {uploadedUrl && (
          <div className="p-3 bg-background border border-border rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Image URL:</p>
            <p className="text-sm text-foreground break-all font-mono">{uploadedUrl}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* Instructions */}
      <p className="mt-2 text-xs text-muted-foreground">
        Supported formats: JPG, PNG, GIF, WebP • Max size: 10MB • Max dimensions: 2000x2000px
      </p>
    </div>
  );
}
