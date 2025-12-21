'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getAccommodation, Accommodation } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BedDouble } from 'lucide-react';

export default function RoomsPage() {
  const { user } = useAuth();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const res = await getAccommodation(user.venue_id);
      if (res.return_code === 'SUCCESS' && res.accommodation) {
        setAccommodation(res.accommodation as unknown as Accommodation);
      }
      setIsLoading(false);
    }
    load();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rooms</h1>
        <p className="text-muted-foreground">
          Manage your accommodation listings
        </p>
      </div>

      {!accommodation || accommodation.rooms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BedDouble className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No rooms yet</h3>
            <p className="text-muted-foreground">
              Room management coming soon
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accommodation.rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{room.name}</CardTitle>
                  <Badge variant={room.isAvailable ? 'default' : 'secondary'}>
                    {room.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <CardDescription>{room.type} - Sleeps {room.sleeps}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {room.description}
                </p>
                {room.price && (
                  <p className="mt-2 font-medium">
                    From £{room.price.from}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
