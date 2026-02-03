'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  getMenu,
  updateMenu,
  Menu,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/admin/image-upload';
import { PdfUpload } from '@/components/admin/pdf-upload';

export default function MenuEditPage() {
  const params = useParams();
  const router = useRouter();
  useAuth(); // Ensures user is authenticated
  const menuId = parseInt(params.id as string);

  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadMenu = async () => {
    const res = await getMenu(menuId);
    if (res.return_code === 'SUCCESS' && res.menu) {
      setMenu(res.menu as unknown as Menu);
    } else if (res.return_code !== 'SUCCESS') {
      toast.error('Failed to load menu');
      router.push('/admin/menus');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuId]);

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

  const handleImageUpload = async (imageUrl: string) => {
    const res = await updateMenu(menuId, { imageUrl });
    if (res.return_code === 'SUCCESS') {
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to save image');
    }
  };

  const handleImageRemove = async () => {
    const res = await updateMenu(menuId, { imageUrl: '' });
    if (res.return_code === 'SUCCESS') {
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to remove image');
    }
  };

  const handlePdfUpload = async (pdfUrl: string) => {
    const res = await updateMenu(menuId, { pdfUrl });
    if (res.return_code === 'SUCCESS') {
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to save PDF');
    }
  };

  const handlePdfRemove = async () => {
    const res = await updateMenu(menuId, { pdfUrl: '' });
    if (res.return_code === 'SUCCESS') {
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to remove PDF');
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

      {/* Menu Image */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            currentImageUrl={menu.imageUrl}
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
          />
          <p className="text-sm text-muted-foreground mt-2">
            This image is displayed on the website as a preview of your menu.
          </p>
        </CardContent>
      </Card>

      {/* Menu PDF */}
      <Card>
        <CardHeader>
          <CardTitle>Menu PDF</CardTitle>
        </CardHeader>
        <CardContent>
          <PdfUpload
            currentPdfUrl={menu.pdfUrl}
            onUpload={handlePdfUpload}
            onRemove={handlePdfRemove}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Optional: Upload a PDF for customers to download the full menu.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
