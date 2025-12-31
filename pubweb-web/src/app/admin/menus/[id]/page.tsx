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
  Menu,
  MenuSection,
  MenuItem,
  MenuItemVariant,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Pencil,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/admin/image-upload';

export default function MenuEditPage() {
  const params = useParams();
  const router = useRouter();
  useAuth(); // Ensures user is authenticated
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
    variants: [] as MenuItemVariant[],
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

  const handleCreateSection = async () => {
    if (!sectionForm.name) {
      toast.error('Section name is required');
      return;
    }

    const res = await createSection(menuId, sectionForm);
    if (res.return_code === 'SUCCESS') {
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

    // Build the item data - use either single price or variants, not both
    const hasVariants = itemForm.variants.length > 0;
    const res = await createItem(parseInt(itemDialog.sectionId), {
      name: itemForm.name,
      description: itemForm.description || undefined,
      price: hasVariants ? undefined : (itemForm.price ? parseFloat(itemForm.price) : undefined),
      priceNote: itemForm.priceNote || undefined,
      dietaryTags: itemForm.dietaryTags.length > 0 ? itemForm.dietaryTags as MenuItem['dietaryTags'] : undefined,
      variants: hasVariants ? itemForm.variants : undefined,
    });

    if (res.return_code === 'SUCCESS') {
      setItemDialog({ open: false, mode: 'create' });
      setItemForm({ name: '', description: '', price: '', priceNote: '', dietaryTags: [], variants: [] });
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to create item');
    }
  };

  const handleUpdateItem = async () => {
    if (!itemDialog.item) return;

    // Build the item data - use either single price or variants, not both
    const hasVariants = itemForm.variants.length > 0;
    const res = await updateItem(parseInt(itemDialog.item.id), {
      name: itemForm.name,
      description: itemForm.description || undefined,
      price: hasVariants ? undefined : (itemForm.price ? parseFloat(itemForm.price) : undefined),
      priceNote: itemForm.priceNote || undefined,
      dietaryTags: itemForm.dietaryTags.length > 0 ? itemForm.dietaryTags as MenuItem['dietaryTags'] : undefined,
      variants: itemForm.variants, // Always pass variants (empty array clears them)
    });

    if (res.return_code === 'SUCCESS') {
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
      loadMenu();
    } else {
      toast.error(res.message || 'Failed to delete item');
    }
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

  const handleMoveSection = async (sectionId: string, direction: 'up' | 'down') => {
    if (!menu) return;
    const sortedSections = [...menu.sections].sort((a, b) => a.sortOrder - b.sortOrder);
    const currentIndex = sortedSections.findIndex(s => s.id === sectionId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= sortedSections.length) return;

    const currentSection = sortedSections[currentIndex];
    const targetSection = sortedSections[targetIndex];

    await updateSection(parseInt(currentSection.id), { sortOrder: targetSection.sortOrder });
    await updateSection(parseInt(targetSection.id), { sortOrder: currentSection.sortOrder });
    loadMenu();
  };

  const handleMoveItem = async (sectionId: string, itemId: string, direction: 'up' | 'down') => {
    if (!menu) return;
    const section = menu.sections.find(s => s.id === sectionId);
    if (!section) return;

    const sortedItems = [...section.items].sort((a, b) => a.sortOrder - b.sortOrder);
    const currentIndex = sortedItems.findIndex(i => i.id === itemId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= sortedItems.length) return;

    const currentItem = sortedItems[currentIndex];
    const targetItem = sortedItems[targetIndex];

    await updateItem(parseInt(currentItem.id), { sortOrder: targetItem.sortOrder });
    await updateItem(parseInt(targetItem.id), { sortOrder: currentItem.sortOrder });
    loadMenu();
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
          {[...menu.sections].sort((a, b) => a.sortOrder - b.sortOrder).map((section, sectionIndex, sortedSections) => (
            <Card key={section.id}>
              <CardHeader className="pb-2 px-3 md:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex flex-col shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleMoveSection(section.id, 'up')}
                        disabled={sectionIndex === 0}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleMoveSection(section.id, 'down')}
                        disabled={sectionIndex === sortedSections.length - 1}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    <CardTitle className="text-base md:text-lg truncate">{section.name}</CardTitle>
                    {section.description && (
                      <span className="text-sm text-muted-foreground truncate hidden md:inline">
                        - {section.description}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 sm:gap-2">
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
                          variants: [],
                        });
                        setItemDialog({
                          open: true,
                          mode: 'create',
                          sectionId: section.id,
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Item</span>
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
                      <Pencil className="h-4 w-4" />
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
              <CardContent className="px-3 md:px-6">
                {section.items.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-2">
                    No items in this section
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...section.items].sort((a, b) => a.sortOrder - b.sortOrder).map((item, itemIndex, sortedItems) => (
                      <div
                        key={item.id}
                        className={`p-2 md:p-3 rounded-lg border ${
                          !item.isAvailable ? 'bg-muted opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <div className="flex flex-col shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => handleMoveItem(section.id, item.id, 'up')}
                                disabled={itemIndex === 0}
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => handleMoveItem(section.id, item.id, 'down')}
                                disabled={itemIndex === sortedItems.length - 1}
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium flex flex-wrap items-center gap-2">
                                <span className="truncate">{item.name}</span>
                                {/* Sold out badge - hidden for now, uncomment if needed
                                {!item.isAvailable && (
                                  <Badge variant="destructive" className="text-xs">Sold out</Badge>
                                )}
                                */}
                                {item.variants && item.variants.length > 0 ? (
                                <span className="font-medium text-sm md:hidden">
                                  {item.variants.map(v => `£${v.price.toFixed(2)}`).join(' / ')}
                                </span>
                              ) : item.price ? (
                                <span className="font-medium text-sm md:hidden">
                                  £{item.price.toFixed(2)}
                                </span>
                              ) : null}
                              </div>
                              {item.description && (
                                <div className="text-sm text-muted-foreground line-clamp-2">
                                  {item.description}
                                </div>
                              )}
                              {item.dietaryTags && item.dietaryTags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.dietaryTags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 md:gap-4 shrink-0">
                            {item.variants && item.variants.length > 0 ? (
                              <div className="font-medium hidden md:block text-sm">
                                {item.variants.map(v => `${v.label}: £${v.price.toFixed(2)}`).join(' / ')}
                              </div>
                            ) : item.price ? (
                              <div className="font-medium hidden md:block">
                                £{item.price.toFixed(2)}
                              </div>
                            ) : null}
                            <div className="flex gap-0.5 md:gap-1">
                              {/* Sold out toggle - hidden for now, uncomment if needed
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleToggleAvailability(item.id)}
                                title={item.isAvailable ? 'Mark as sold out' : 'Mark as available'}
                              >
                                {item.isAvailable ? (
                                  <Ban className="h-4 w-4" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </Button>
                              */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setItemForm({
                                    name: item.name,
                                    description: item.description || '',
                                    price: item.price?.toString() || '',
                                    priceNote: item.priceNote || '',
                                    dietaryTags: item.dietaryTags || [],
                                    variants: item.variants || [],
                                  });
                                  setItemDialog({
                                    open: true,
                                    mode: 'edit',
                                    sectionId: section.id,
                                    item,
                                  });
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
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
            {/* Price section - show either single price or variants */}
            {itemForm.variants.length === 0 ? (
              <div className="space-y-4">
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setItemForm({
                      ...itemForm,
                      price: '',
                      variants: [{ label: '', price: 0, isDefault: true }],
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add size variants (e.g. Small/Large)
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Price Variants</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setItemForm({ ...itemForm, variants: [] });
                    }}
                  >
                    Use single price instead
                  </Button>
                </div>
                {itemForm.variants.map((variant, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={variant.label}
                      onChange={(e) => {
                        const newVariants = [...itemForm.variants];
                        newVariants[index] = { ...variant, label: e.target.value };
                        setItemForm({ ...itemForm, variants: newVariants });
                      }}
                      placeholder="Label (e.g. Small)"
                      className="flex-1"
                    />
                    <div className="relative w-24">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price || ''}
                        onChange={(e) => {
                          const newVariants = [...itemForm.variants];
                          newVariants[index] = { ...variant, price: parseFloat(e.target.value) || 0 };
                          setItemForm({ ...itemForm, variants: newVariants });
                        }}
                        placeholder="0.00"
                        className="pl-6"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => {
                        const newVariants = itemForm.variants.filter((_, i) => i !== index);
                        setItemForm({ ...itemForm, variants: newVariants });
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setItemForm({
                      ...itemForm,
                      variants: [...itemForm.variants, { label: '', price: 0 }],
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add variant
                </Button>
              </div>
            )}
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
