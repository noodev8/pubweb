'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getVenue, getMenus, Venue, Menu } from '@/lib/api';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{venue?.name || 'Dashboard'}</h1>
        {venue?.tagline && (
          <p className="text-sm md:text-base text-muted-foreground mt-1">{venue.tagline}</p>
        )}
      </div>

      <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

    </div>
  );
}
