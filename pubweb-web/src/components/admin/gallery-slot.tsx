'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { cloudinaryLoader } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  X,
  ChevronUp,
  ChevronDown,
  Loader2,
  Camera,
} from 'lucide-react';
import { GalleryImage, signCloudinaryUpload } from '@/lib/api';

interface GallerySlotProps {
  image?: GalleryImage;
  index: number;
  totalImages: number;
  onUpload?: (imageUrl: string, cloudinaryPublicId: string) => Promise<void>;
  onReplace: (imageId: string, imageUrl: string, cloudinaryPublicId: string) => Promise<void>;
  onDelete: (imageId: string) => Promise<void>;
  onCaptionChange: (imageId: string, caption: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  disabled?: boolean;
}

export function GallerySlot({
  image,
  index,
  totalImages,
  onUpload,
  onReplace,
  onDelete,
  onCaptionChange,
  onMoveUp,
  onMoveDown,
  disabled,
}: GallerySlotProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Please select a JPG, PNG, or WebP image');
      return;
    }

    // Validate file size (max 5MB — web images don't need to be larger)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Get a signed upload signature from our server
      const sig = await signCloudinaryUpload('pubweb/gallery');
      if (sig.return_code !== 'SUCCESS') {
        throw new Error(sig.message || 'Failed to get upload signature');
      }

      // Upload to Cloudinary using signed parameters
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sig.api_key);
      formData.append('timestamp', sig.timestamp.toString());
      formData.append('signature', sig.signature);
      formData.append('folder', sig.folder);
      if (sig.transformation) {
        formData.append('transformation', sig.transformation);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      if (image) {
        // Replace existing image
        await onReplace(image.id, data.secure_url, data.public_id);
      } else if (onUpload) {
        // Upload new image
        await onUpload(data.secure_url, data.public_id);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Clear the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!image) return;

    setIsDeleting(true);
    try {
      await onDelete(image.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Empty slot
  if (!image) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />
        <div
          className={`
            flex flex-col items-center justify-center aspect-square
            border-2 border-dashed rounded-lg bg-muted/50
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted transition-colors'}
          `}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Add Image</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Camera className="h-3 w-3" />
                <span>or take photo</span>
              </div>
            </>
          )}
        </div>
      </>
    );
  }

  // Filled slot
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      <div className="space-y-2">
        <div
          className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image
            src={image.imageUrl}
            alt={image.caption || 'Gallery image'}
            fill
            loader={image.imageUrl.includes('cloudinary') ? cloudinaryLoader : undefined}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMoveUp(index)}
            disabled={disabled || index === 0}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMoveDown(index)}
            disabled={disabled || index === totalImages - 1}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Caption input */}
        <Input
          value={image.caption}
          onChange={(e) => onCaptionChange(image.id, e.target.value)}
          placeholder="Add caption (optional)"
          maxLength={150}
          disabled={disabled}
          className="text-sm"
        />
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
