'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  getMenu,
  updateMenu,
  uploadMenuImage,
  deleteMenuImage,
  reorderMenuImages,
  signCloudinaryUpload,
  Menu,
  MenuImage,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, Loader2, X, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cloudinaryLoader } from '@/lib/cloudinary';

const MAX_MENU_IMAGES = 10;

export default function MenuEditPage() {
  const params = useParams();
  const router = useRouter();
  useAuth();
  const menuId = parseInt(params.id as string);

  const [menu, setMenu] = useState<Menu | null>(null);
  const [images, setImages] = useState<MenuImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const loadMenu = useCallback(async () => {
    const res = await getMenu(menuId);
    if (res.return_code === 'SUCCESS' && res.menu) {
      const menuData = res.menu as unknown as Menu;
      setMenu(menuData);
      const sorted = [...(menuData.images || [])].sort((a, b) => a.sortOrder - b.sortOrder);
      setImages(sorted);
    } else if (res.return_code !== 'SUCCESS') {
      toast.error('Failed to load menu');
      router.push('/admin/menus');
    }
    setIsLoading(false);
  }, [menuId, router]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const handleSaveMenu = async () => {
    if (!menu) return;
    setIsSaving(true);

    const res = await updateMenu(menuId, {
      name: menu.name,
      description: menu.description,
      isActive: menu.isActive,
    });

    if (res.return_code === 'SUCCESS') {
      toast.success('Saved! Changes will appear on your website within 60 seconds.');
    } else {
      toast.error(res.message || 'Failed to save menu');
    }
    setIsSaving(false);
  };

  const uploadToCloudinary = async (file: File) => {
    const sig = await signCloudinaryUpload('pubweb/menus');
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
    return await response.json();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

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
    const remaining = MAX_MENU_IMAGES - images.length;
    if (validFiles.length > remaining) {
      toast.error(`Can only add ${remaining} more image${remaining === 1 ? '' : 's'} (max ${MAX_MENU_IMAGES})`);
      if (remaining === 0) return;
      validFiles.splice(remaining);
    }

    setIsUploading(true);

    try {
      let uploaded = 0;
      for (const file of validFiles) {
        const data = await uploadToCloudinary(file);
        const res = await uploadMenuImage(menuId, data.secure_url, data.public_id);
        if (res.return_code === 'SUCCESS') {
          uploaded++;
        } else if (res.return_code === 'SLOT_LIMIT_REACHED') {
          toast.error(`Maximum of ${MAX_MENU_IMAGES} menu images reached`);
          break;
        } else {
          toast.error(res.message || `Failed to upload ${file.name}`);
        }
      }
      if (uploaded > 0) {
        toast.success(`${uploaded} image${uploaded === 1 ? '' : 's'} uploaded! Changes will appear on your website within 60 seconds.`);
        await loadMenu();
      }
    } catch {
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };

  const handleDelete = async (imageId: string) => {
    const res = await deleteMenuImage(parseInt(imageId));
    if (res.return_code === 'SUCCESS') {
      toast.success('Saved! Changes will appear on your website within 60 seconds.');
      await loadMenu();
    } else {
      toast.error(res.message || 'Failed to delete image');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    const reordered = newImages.map((img, i) => ({ ...img, sortOrder: i }));
    setImages(reordered);

    const order = reordered.map((img, i) => ({ id: img.id, sortOrder: i }));
    const res = await reorderMenuImages(menuId, order);
    if (res.return_code === 'SUCCESS') {
      toast.success('Saved! Changes will appear on your website within 60 seconds.');
    } else {
      toast.error('Failed to reorder images');
      await loadMenu();
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    const reordered = newImages.map((img, i) => ({ ...img, sortOrder: i }));
    setImages(reordered);

    const order = reordered.map((img, i) => ({ id: img.id, sortOrder: i }));
    const res = await reorderMenuImages(menuId, order);
    if (res.return_code === 'SUCCESS') {
      toast.success('Saved! Changes will appear on your website within 60 seconds.');
    } else {
      toast.error('Failed to reorder images');
      await loadMenu();
    }
  };

  if (isLoading || !menu) {
    return (
      <div className="space-y-6">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Hidden file inputs */}
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Link href="/admin/menus">
            <Button variant="ghost" size="icon" className="shrink-0 mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-3xl font-bold truncate">{menu.name}</h1>
            <p className="text-sm md:text-base text-muted-foreground line-clamp-2">{menu.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={menu.isActive}
              onCheckedChange={(checked) =>
                setMenu({ ...menu, isActive: checked })
              }
            />
            <Label>Active</Label>
          </div>
          <Button onClick={handleSaveMenu} disabled={isSaving} size="sm" className="md:size-default">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Menu Details */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={menu.name}
                onChange={(e) => setMenu({ ...menu, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={menu.description || ''}
                onChange={(e) =>
                  setMenu({ ...menu, description: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Images */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Menu Images</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {images.length} of {MAX_MENU_IMAGES} images
              </p>
            </div>
            {images.length < MAX_MENU_IMAGES && (
              <Button
                onClick={() => uploadInputRef.current?.click()}
                disabled={isUploading}
                size="sm"
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
          </div>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => !isUploading && uploadInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
              ) : (
                <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              )}
              <p className="text-muted-foreground text-center">
                Upload menu page images (PNG, JPG, or WebP)
              </p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((image, index) => (
                <div key={image.id} className="relative group border rounded-lg overflow-hidden">
                  <div className="relative aspect-[3/4] bg-muted">
                    <Image
                      src={image.imageUrl}
                      alt={`Menu page ${index + 1}`}
                      fill
                      loader={image.imageUrl.includes('cloudinary') ? cloudinaryLoader : undefined}
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>

                  {/* Page number label */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Page {index + 1}
                  </div>

                  {/* Action buttons overlay */}
                  <div className="absolute top-2 right-2 flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleDelete(image.id)}
                      className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Bottom action bar */}
                  <div className="flex items-center justify-center px-2 py-1.5 bg-muted/80">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move left"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === images.length - 1}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move right"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-3">
            Upload menu pages as images. Customers will view them in a swipeable carousel on your website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
