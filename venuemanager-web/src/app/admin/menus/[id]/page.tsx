'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  getMenu,
  updateMenu,
  createSection,
  updateSection,
  deleteSection,
  createItem,
  updateItem,
  deleteItem,
  toggleItemAvailability,
  Menu,
  MenuSection,
  MenuItem,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  GripVertical,
  Ban,
  Check,
} from 'lucide-react';
import Link from 'next/link';

export default function MenuEditPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const menuId = parseInt(params.id as string);

  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Dialog states
  const [sectionDialog, setSectionDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    section?: MenuSection;
  }>({ open: false, mode: 'create' });
  const [itemDialog, setItemDialog] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    sectionId?: string;
    item?: MenuItem;
  }>({ open: false, mode: 'create' });

  // Form states
  const [sectionForm, setSectionForm] = useState({ name: '', description: '' });
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    priceNote: '',
    dietaryTags: [] as string[],
  });

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
      toast.success('Menu saved');
    } else {
      toast.error(res.message || 'Failed to save menu');
    }
    setIsSaving(false);
  };

  const handleCreateSection = async () => {
    if (!sectionForm.name) {
      toast.error('Section name is required');
      return;
    }

    const res = await createSection(menuId, sectionForm);
    if (res.return_code === 'SUCCESS') {
      toast.success('Section created');
      setSectionDialog({ open: false, mode: 'create' });
      setSectionForm({ name: '', description: '' });
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to create section');
    }
  };

  const handleUpdateSection = async () => {
    if (!sectionDialog.section) return;

    const res = await updateSection(parseInt(sectionDialog.section.id), sectionForm);
    if (res.return_code === 'SUCCESS') {
      toast.success('Section updated');
      setSectionDialog({ open: false, mode: 'create' });
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to update section');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Delete this section and all its items?')) return;

    const res = await deleteSection(parseInt(sectionId));
    if (res.return_code === 'SUCCESS') {
      toast.success('Section deleted');
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to delete section');
    }
  };

  const handleCreateItem = async () => {
    if (!itemForm.name || !itemDialog.sectionId) {
      toast.error('Item name is required');
      return;
    }

    const res = await createItem(parseInt(itemDialog.sectionId), {
      name: itemForm.name,
      description: itemForm.description || undefined,
      price: itemForm.price ? parseFloat(itemForm.price) : undefined,
      priceNote: itemForm.priceNote || undefined,
      dietaryTags: itemForm.dietaryTags.length > 0 ? itemForm.dietaryTags as MenuItem['dietaryTags'] : undefined,
    });

    if (res.return_code === 'SUCCESS') {
      toast.success('Item created');
      setItemDialog({ open: false, mode: 'create' });
      setItemForm({ name: '', description: '', price: '', priceNote: '', dietaryTags: [] });
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to create item');
    }
  };

  const handleUpdateItem = async () => {
    if (!itemDialog.item) return;

    const res = await updateItem(parseInt(itemDialog.item.id), {
      name: itemForm.name,
      description: itemForm.description || undefined,
      price: itemForm.price ? parseFloat(itemForm.price) : undefined,
      priceNote: itemForm.priceNote || undefined,
      dietaryTags: itemForm.dietaryTags.length > 0 ? itemForm.dietaryTags as MenuItem['dietaryTags'] : undefined,
    });

    if (res.return_code === 'SUCCESS') {
      toast.success('Item updated');
      setItemDialog({ open: false, mode: 'create' });
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Delete this item?')) return;

    const res = await deleteItem(parseInt(itemId));
    if (res.return_code === 'SUCCESS') {
      toast.success('Item deleted');
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to delete item');
    }
  };

  const handleToggleAvailability = async (itemId: string) => {
    const res = await toggleItemAvailability(parseInt(itemId));
    if (res.return_code === 'SUCCESS') {
      const isAvailable = res.isAvailable as unknown as boolean;
      toast.success(isAvailable ? 'Item is now available' : 'Item 86\'d');
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to toggle availability');
    }
  };

  const dietaryOptions = [
    'vegetarian',
    'vegan',
    'gluten-free',
    'dairy-free',
    'nut-free',
    'contains-nuts',
    'spicy',
  ];

  if (isLoading || !menu) {
    return (
      <div className="space-y-6">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/menus">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{menu.name}</h1>
            <p className="text-muted-foreground">{menu.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={menu.isActive}
              onCheckedChange={(checked) =>
                setMenu({ ...menu, isActive: checked })
              }
            />
            <Label>Active</Label>
          </div>
          <Button onClick={handleSaveMenu} disabled={isSaving}>
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

      {/* Sections */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sections</h2>
        <Button
          onClick={() => {
            setSectionForm({ name: '', description: '' });
            setSectionDialog({ open: true, mode: 'create' });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {menu.sections.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No sections yet. Add a section to start adding items.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {menu.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <CardTitle className="text-lg">{section.name}</CardTitle>
                    {section.description && (
                      <span className="text-sm text-muted-foreground">
                        - {section.description}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setItemForm({
                          name: '',
                          description: '',
                          price: '',
                          priceNote: '',
                          dietaryTags: [],
                        });
                        setItemDialog({
                          open: true,
                          mode: 'create',
                          sectionId: section.id,
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Item
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSectionForm({
                          name: section.name,
                          description: section.description || '',
                        });
                        setSectionDialog({
                          open: true,
                          mode: 'edit',
                          section,
                        });
                      }}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {section.items.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-2">
                    No items in this section
                  </div>
                ) : (
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          !item.isAvailable ? 'bg-muted opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {item.name}
                              {!item.isAvailable && (
                                <Badge variant="destructive">86&apos;d</Badge>
                              )}
                            </div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground">
                                {item.description}
                              </div>
                            )}
                            {item.dietaryTags && item.dietaryTags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {item.dietaryTags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {item.price && (
                            <div className="font-medium">
                              £{item.price.toFixed(2)}
                            </div>
                          )}
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleAvailability(item.id)}
                              title={item.isAvailable ? '86 this item' : 'Make available'}
                            >
                              {item.isAvailable ? (
                                <Ban className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setItemForm({
                                  name: item.name,
                                  description: item.description || '',
                                  price: item.price?.toString() || '',
                                  priceNote: item.priceNote || '',
                                  dietaryTags: item.dietaryTags || [],
                                });
                                setItemDialog({
                                  open: true,
                                  mode: 'edit',
                                  sectionId: section.id,
                                  item,
                                });
                              }}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Section Dialog */}
      <Dialog
        open={sectionDialog.open}
        onOpenChange={(open) => setSectionDialog({ ...sectionDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {sectionDialog.mode === 'create' ? 'Add Section' : 'Edit Section'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={sectionForm.name}
                onChange={(e) =>
                  setSectionForm({ ...sectionForm, name: e.target.value })
                }
                placeholder="e.g. Starters"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={sectionForm.description}
                onChange={(e) =>
                  setSectionForm({ ...sectionForm, description: e.target.value })
                }
                placeholder="e.g. To share or enjoy solo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSectionDialog({ open: false, mode: 'create' })}
            >
              Cancel
            </Button>
            <Button
              onClick={
                sectionDialog.mode === 'create'
                  ? handleCreateSection
                  : handleUpdateSection
              }
            >
              {sectionDialog.mode === 'create' ? 'Add Section' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Dialog */}
      <Dialog
        open={itemDialog.open}
        onOpenChange={(open) => setItemDialog({ ...itemDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {itemDialog.mode === 'create' ? 'Add Item' : 'Edit Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={itemForm.name}
                onChange={(e) =>
                  setItemForm({ ...itemForm, name: e.target.value })
                }
                placeholder="e.g. Soup of the Day"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={itemForm.description}
                onChange={(e) =>
                  setItemForm({ ...itemForm, description: e.target.value })
                }
                placeholder="e.g. Served with crusty bread"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (£)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={itemForm.price}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, price: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Price Note</Label>
                <Input
                  value={itemForm.priceNote}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, priceNote: e.target.value })
                  }
                  placeholder="e.g. per person"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Dietary Tags</Label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((tag) => (
                  <Badge
                    key={tag}
                    variant={
                      itemForm.dietaryTags.includes(tag)
                        ? 'default'
                        : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => {
                      if (itemForm.dietaryTags.includes(tag)) {
                        setItemForm({
                          ...itemForm,
                          dietaryTags: itemForm.dietaryTags.filter(
                            (t) => t !== tag
                          ),
                        });
                      } else {
                        setItemForm({
                          ...itemForm,
                          dietaryTags: [...itemForm.dietaryTags, tag],
                        });
                      }
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setItemDialog({ open: false, mode: 'create' })}
            >
              Cancel
            </Button>
            <Button
              onClick={
                itemDialog.mode === 'create' ? handleCreateItem : handleUpdateItem
              }
            >
              {itemDialog.mode === 'create' ? 'Add Item' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
