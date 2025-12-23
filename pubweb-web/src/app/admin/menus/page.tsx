'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getMenus, createMenu, updateMenu, deleteMenu, Menu } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Link from 'next/link';
import { Plus, Trash2, Edit, UtensilsCrossed, ChevronUp, ChevronDown } from 'lucide-react';

export default function MenusPage() {
  const { user } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'regular' as 'regular' | 'event' | 'drinks',
  });

  const loadMenus = async () => {
    if (!user) return;
    const res = await getMenus(user.venue_id);
    if (res.return_code === 'SUCCESS' && res.menus) {
      setMenus(res.menus as unknown as Menu[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCreateMenu = async () => {
    if (!user || !newMenu.name || !newMenu.slug) {
      toast.error('Name and slug are required');
      return;
    }

    const res = await createMenu(user.venue_id, newMenu);
    if (res.return_code === 'SUCCESS') {
      toast.success('Menu created');
      setIsCreateOpen(false);
      setNewMenu({ name: '', slug: '', description: '', type: 'regular' });
      loadMenus();
    } else {
      toast.error(res.message || 'Failed to create menu');
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;

    const res = await deleteMenu(parseInt(menuId));
    if (res.return_code === 'SUCCESS') {
      toast.success('Menu deleted');
      loadMenus();
    } else {
      toast.error(res.message || 'Failed to delete menu');
    }
  };

  const handleMoveMenu = async (menuId: string, direction: 'up' | 'down') => {
    const sortedMenus = [...menus].sort((a, b) => a.sortOrder - b.sortOrder);
    const currentIndex = sortedMenus.findIndex(m => m.id === menuId);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= sortedMenus.length) return;

    const currentMenu = sortedMenus[currentIndex];
    const targetMenu = sortedMenus[targetIndex];

    // Swap sort orders
    await updateMenu(parseInt(currentMenu.id), { sortOrder: targetMenu.sortOrder });
    await updateMenu(parseInt(targetMenu.id), { sortOrder: currentMenu.sortOrder });
    loadMenus();
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Menus</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Menus</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your food and drink menus
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Menu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Menu</DialogTitle>
              <DialogDescription>
                Add a new menu to your venue
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Lunch Menu"
                  value={newMenu.name}
                  onChange={(e) => {
                    setNewMenu({
                      ...newMenu,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="e.g. lunch-menu"
                  value={newMenu.slug}
                  onChange={(e) =>
                    setNewMenu({ ...newMenu, slug: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newMenu.type}
                  onValueChange={(v) =>
                    setNewMenu({ ...newMenu, type: v as 'regular' | 'event' | 'drinks' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="drinks">Drinks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="e.g. Available 12pm - 3pm"
                  value={newMenu.description}
                  onChange={(e) =>
                    setNewMenu({ ...newMenu, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateMenu}>Create Menu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {menus.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No menus yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first menu to get started
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Menu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...menus].sort((a, b) => a.sortOrder - b.sortOrder).map((menu, index, arr) => (
            <Card key={menu.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {menu.name}
                      <Badge variant={menu.isActive ? 'default' : 'secondary'}>
                        {menu.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{menu.description}</CardDescription>
                  </div>
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveMenu(menu.id, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleMoveMenu(menu.id, 'down')}
                      disabled={index === arr.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  {menu.sections.length} sections,{' '}
                  {menu.sections.reduce((a, s) => a + s.items.length, 0)} items
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/menus/${menu.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteMenu(menu.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
