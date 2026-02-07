'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  getGallery,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  replaceGalleryImage,
  reorderGallery,
  signCloudinaryUpload,
  GalleryImage,
} from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GallerySlot } from '@/components/admin/gallery-slot';
import { Images, Loader2, Save, Plus } from 'lucide-react';
import { toast } from 'sonner';

const MAX_IMAGES = 30;

export default function GalleryPage() {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [originalImages, setOriginalImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const loadGallery = useCallback(async () => {
    if (!user) return;
    const res = await getGallery(user.venue_id);
    if (res.return_code === 'SUCCESS' && res.images) {
      const imagesArray = res.images as unknown as GalleryImage[];
      const sortedImages = [...imagesArray].sort(
        (a, b) => a.sortOrder - b.sortOrder
      );
      setImages(sortedImages);
      setOriginalImages(JSON.parse(JSON.stringify(sortedImages)));
      setHasUnsavedChanges(false);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  // Warn user about unsaved changes when leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(images.map((img) => ({ id: img.id, caption: img.caption, sortOrder: img.sortOrder }))) !==
      JSON.stringify(originalImages.map((img) => ({ id: img.id, caption: img.caption, sortOrder: img.sortOrder })));
    setHasUnsavedChanges(hasChanges);
  }, [images, originalImages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    // Validate all files first
    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast.error(`${file.name}: must be JPG, PNG, or WebP`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: must be less than 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Check we won't exceed the limit
    const remaining = MAX_IMAGES - images.length;
    if (validFiles.length > remaining) {
      toast.error(`Can only add ${remaining} more image${remaining === 1 ? '' : 's'} (max ${MAX_IMAGES})`);
      if (remaining === 0) return;
      validFiles.splice(remaining);
    }

    setIsUploading(true);

    try {
      let uploaded = 0;
      for (const file of validFiles) {
        const sig = await signCloudinaryUpload('pubweb/gallery');
        if (sig.return_code !== 'SUCCESS') {
          throw new Error(sig.message || 'Failed to get upload signature');
        }

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
          { method: 'POST', body: formData }
        );

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();

        const res = await uploadGalleryImage(user.venue_id, data.secure_url, data.public_id);
        if (res.return_code === 'SUCCESS') {
          uploaded++;
        } else if (res.return_code === 'SLOT_LIMIT_REACHED') {
          toast.error(`Maximum of ${MAX_IMAGES} images reached`);
          break;
        } else {
          toast.error(res.message || `Failed to upload ${file.name}`);
        }
      }
      if (uploaded > 0) {
        toast.success(`${uploaded} image${uploaded === 1 ? '' : 's'} uploaded! Changes will appear on your website within 60 seconds.`);
        await loadGallery();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };

  const handleReplace = async (imageId: string, imageUrl: string, cloudinaryPublicId: string) => {
    const res = await replaceGalleryImage(parseInt(imageId), imageUrl, cloudinaryPublicId);
    if (res.return_code === 'SUCCESS') {
      toast.success('Saved! Changes will appear on your website within 60 seconds.');
      await loadGallery();
    } else {
      toast.error(res.message || 'Failed to replace image');
    }
  };

  const handleDelete = async (imageId: string) => {
    const res = await deleteGalleryImage(parseInt(imageId));
    if (res.return_code === 'SUCCESS') {
      toast.success('Saved! Changes will appear on your website within 60 seconds.');
      await loadGallery();
    } else {
      toast.error(res.message || 'Failed to delete image');
    }
  };

  const handleCaptionChange = (imageId: string, caption: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, caption } : img))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const newImages = [...prev];
      // Swap the items
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      // Update sortOrder for both
      return newImages.map((img, i) => ({ ...img, sortOrder: i }));
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const newImages = [...prev];
      // Swap the items
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      // Update sortOrder for both
      return newImages.map((img, i) => ({ ...img, sortOrder: i }));
    });
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      // Update captions for images that changed
      for (const image of images) {
        const original = originalImages.find((o) => o.id === image.id);
        if (original && original.caption !== image.caption) {
          const res = await updateGalleryImage(parseInt(image.id), image.caption);
          if (res.return_code !== 'SUCCESS') {
            throw new Error(res.message || 'Failed to update caption');
          }
        }
      }

      // Check if order changed
      const orderChanged = images.some((img, i) => {
        const original = originalImages.find((o) => o.id === img.id);
        return original && original.sortOrder !== i;
      });

      if (orderChanged) {
        const order = images.map((img, i) => ({ id: img.id, sortOrder: i }));
        const res = await reorderGallery(user.venue_id, order);
        if (res.return_code !== 'SUCCESS') {
          throw new Error(res.message || 'Failed to reorder gallery');
        }
      }

      toast.success('Saved! Changes will appear on your website within 60 seconds.');
      await loadGallery();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isSaving || isUploading}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gallery</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {images.length} of {MAX_IMAGES} images
          </p>
        </div>

        <div className="flex gap-2">
          {images.length < MAX_IMAGES && (
            <Button
              onClick={() => uploadInputRef.current?.click()}
              disabled={isSaving || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </>
              )}
            </Button>
          )}

          {hasUnsavedChanges && (
            <Button onClick={handleSaveChanges} disabled={isSaving} variant="outline">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200">
          You have unsaved changes to captions or image order.
        </div>
      )}

      {images.length === 0 ? (
        <Card
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => !isUploading && uploadInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            {isUploading ? (
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
            ) : (
              <Images className="h-12 w-12 text-muted-foreground mb-4" />
            )}
            <h3 className="text-lg font-medium">No gallery images</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Click here or the button above to add your first image
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <GallerySlot
            key={image.id}
            image={image}
            index={index}
            totalImages={images.length}
            onReplace={handleReplace}
            onDelete={handleDelete}
            onCaptionChange={handleCaptionChange}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            disabled={isSaving}
          />
        ))}
      </div>
    </div>
  );
}
