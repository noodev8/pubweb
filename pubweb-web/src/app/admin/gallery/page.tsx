'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  getGallery,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  replaceGalleryImage,
  reorderGallery,
  GalleryImage,
} from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GallerySlot } from '@/components/admin/gallery-slot';
import { Images, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const MAX_IMAGES = 9;

export default function GalleryPage() {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [originalImages, setOriginalImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const handleUpload = async (imageUrl: string, cloudinaryPublicId: string) => {
    if (!user) return;

    const res = await uploadGalleryImage(user.venue_id, imageUrl, cloudinaryPublicId);
    if (res.return_code === 'SUCCESS') {
      toast.success('Saved! Changes will appear on your website within 60 seconds.');
      await loadGallery();
    } else if (res.return_code === 'SLOT_LIMIT_REACHED') {
      toast.error('Maximum of 9 images allowed');
    } else {
      toast.error(res.message || 'Failed to upload image');
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

  const emptySlots = MAX_IMAGES - images.length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gallery</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {images.length} of {MAX_IMAGES} slots used
          </p>
        </div>

        {hasUnsavedChanges && (
          <Button onClick={handleSaveChanges} disabled={isSaving}>
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

      {hasUnsavedChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3 text-sm text-yellow-800 dark:text-yellow-200">
          You have unsaved changes to captions or image order.
        </div>
      )}

      {images.length === 0 && emptySlots === MAX_IMAGES ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Images className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No gallery images</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Add up to {MAX_IMAGES} images to showcase your venue
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Existing images */}
        {images.map((image, index) => (
          <GallerySlot
            key={image.id}
            image={image}
            index={index}
            totalImages={images.length}
            onUpload={handleUpload}
            onReplace={handleReplace}
            onDelete={handleDelete}
            onCaptionChange={handleCaptionChange}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            disabled={isSaving}
          />
        ))}

        {/* Empty slots for adding new images */}
        {emptySlots > 0 && (
          <GallerySlot
            index={images.length}
            totalImages={images.length}
            onUpload={handleUpload}
            onReplace={handleReplace}
            onDelete={handleDelete}
            onCaptionChange={handleCaptionChange}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            disabled={isSaving}
          />
        )}
      </div>
    </div>
  );
}
