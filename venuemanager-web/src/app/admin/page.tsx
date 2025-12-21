'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getVenue, getMenus, Venue, Menu } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { UtensilsCrossed, Clock, Building2, BedDouble, MapPin, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      const [venueRes, menusRes] = await Promise.all([
        getVenue(user.venue_id),
        getMenus(user.venue_id),
      ]);

      if (venueRes.return_code === 'SUCCESS' && venueRes.venue) {
        setVenue(venueRes.venue as unknown as Venue);
      }
      if (menusRes.return_code === 'SUCCESS' && menusRes.menus) {
        setMenus(menusRes.menus as unknown as Menu[]);
      }
      setIsLoading(false);
    }

    loadData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const activeMenus = menus.filter((m) => m.isActive).length;
  const totalItems = menus.reduce(
    (acc, menu) => acc + menu.sections.reduce((a, s) => a + s.items.length, 0),
    0
  );

  const quickLinks = [
    {
      title: 'Menus',
      description: `${activeMenus} active menus, ${totalItems} items`,
      icon: UtensilsCrossed,
      href: '/admin/menus',
      color: 'bg-orange-500',
    },
    {
      title: 'Opening Hours',
      description: 'Manage your regular and special hours',
      icon: Clock,
      href: '/admin/hours',
      color: 'bg-blue-500',
    },
    {
      title: 'Venue Info',
      description: 'Update contact and social links',
      icon: Building2,
      href: '/admin/venue',
      color: 'bg-green-500',
    },
    {
      title: 'Rooms',
      description: 'Manage accommodation listings',
      icon: BedDouble,
      href: '/admin/rooms',
      color: 'bg-purple-500',
    },
    {
      title: 'Attractions',
      description: 'Local attractions for visitors',
      icon: MapPin,
      href: '/admin/attractions',
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{venue?.name || 'Dashboard'}</h1>
        {venue?.tagline && (
          <p className="text-muted-foreground mt-1">{venue.tagline}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link key={link.title} href={link.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`p-2 rounded-lg ${link.color}`}>
                  <link.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {menus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Menus</CardTitle>
            <CardDescription>Quick access to your menus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {menus.slice(0, 5).map((menu) => (
                <Link
                  key={menu.id}
                  href={`/admin/menus/${menu.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <div className="font-medium">{menu.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {menu.sections.length} sections,{' '}
                      {menu.sections.reduce((a, s) => a + s.items.length, 0)} items
                    </div>
                  </div>
                  <Badge variant={menu.isActive ? 'default' : 'secondary'}>
                    {menu.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
