'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, X, Upload, Loader2, ExternalLink } from 'lucide-react';

interface PdfUploadProps {
  currentPdfUrl?: string;
  onUpload: (url: string) => Promise<void>;
  onRemove: () => Promise<void>;
}

export function PdfUpload({ currentPdfUrl, onUpload, onRemove }: PdfUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    // Validate file size (max 20MB for PDFs)
    if (file.size > 20 * 1024 * 1024) {
      alert('PDF must be less than 20MB');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Cloudinary (raw upload for PDFs)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
      formData.append('folder', 'pubweb/menus/pdf');
      formData.append('resource_type', 'raw');

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      await onUpload(data.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!confirm('Remove this PDF?')) return;

    setIsRemoving(true);
    try {
      await onRemove();
    } catch (error) {
      console.error('Remove error:', error);
      alert('Failed to remove PDF. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  // Extract filename from URL for display
  const getFilename = (url: string) => {
    try {
      const parts = url.split('/');
      return decodeURIComponent(parts[parts.length - 1]);
    } catch {
      return 'menu.pdf';
    }
  };

  // Convert Cloudinary URL to force download
  const getDownloadUrl = (url: string) => {
    // Add fl_attachment flag to Cloudinary raw URLs to force download
    // e.g., /raw/upload/v123/ becomes /raw/upload/fl_attachment/v123/
    return url.replace('/raw/upload/', '/raw/upload/fl_attachment/');
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {currentPdfUrl ? (
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg max-w-md">
          <FileText className="h-10 w-10 text-red-600 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate mb-1">{getFilename(currentPdfUrl)}</p>
            <a
              href={getDownloadUrl(currentPdfUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Download PDF
            </a>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center w-full max-w-md h-24 border-2 border-dashed rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileText className="h-6 w-6 text-muted-foreground mb-1" />
          <span className="text-sm text-muted-foreground">Click to upload PDF</span>
          <span className="text-xs text-muted-foreground">Max 20MB</span>
        </div>
      )}

      {currentPdfUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Replace PDF
            </>
          )}
        </Button>
      )}

      {!currentPdfUrl && isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading...
        </div>
      )}
    </div>
  );
}
