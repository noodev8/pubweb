'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getVenue, updateVenue, Venue } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function VenuePage() {
  const { user } = useAuth();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadVenue = async () => {
    if (!user) return;
    const res = await getVenue(user.venue_id);
    if (res.return_code === 'SUCCESS' && res.venue) {
      setVenue(res.venue as unknown as Venue);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadVenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSave = async () => {
    if (!user || !venue) return;
    setIsSaving(true);

    const res = await updateVenue(user.venue_id, {
      name: venue.name,
      tagline: venue.tagline,
      description: venue.description,
      address: venue.address,
      contact: venue.contact,
      social: venue.social,
    });

    if (res.return_code === 'SUCCESS') {
      toast.success('Saved! Changes will appear on your website within 60 seconds.');
    } else {
      toast.error(res.message || 'Failed to save venue info');
    }
    setIsSaving(false);
  };

  if (isLoading || !venue) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Venue Info</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Venue Info</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your venue details and contact information
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your venue name and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Venue Name</Label>
              <Input
                value={venue.name}
                onChange={(e) => setVenue({ ...venue, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={venue.tagline || ''}
                onChange={(e) =>
                  setVenue({ ...venue, tagline: e.target.value })
                }
                placeholder="A short catchy phrase"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={venue.description}
                onChange={(e) =>
                  setVenue({ ...venue, description: e.target.value })
                }
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>Your venue location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Address Line 1</Label>
              <Input
                value={venue.address.line1}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    address: { ...venue.address, line1: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Address Line 2</Label>
              <Input
                value={venue.address.line2 || ''}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    address: { ...venue.address, line2: e.target.value },
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Town</Label>
                <Input
                  value={venue.address.town}
                  onChange={(e) =>
                    setVenue({
                      ...venue,
                      address: { ...venue.address, town: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>County</Label>
                <Input
                  value={venue.address.county || ''}
                  onChange={(e) =>
                    setVenue({
                      ...venue,
                      address: { ...venue.address, county: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Postcode</Label>
              <Input
                value={venue.address.postcode}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    address: { ...venue.address, postcode: e.target.value },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
            <CardDescription>How customers can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={venue.contact.phone}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    contact: { ...venue.contact, phone: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={venue.contact.email}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    contact: { ...venue.contact, email: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Booking Email</Label>
              <Input
                type="email"
                value={venue.contact.bookingEmail || ''}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    contact: { ...venue.contact, bookingEmail: e.target.value },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Social */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input
                value={venue.social.facebook || ''}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    social: { ...venue.social, facebook: e.target.value },
                  })
                }
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                value={venue.social.instagram || ''}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    social: { ...venue.social, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>TripAdvisor</Label>
              <Input
                value={venue.social.tripadvisor || ''}
                onChange={(e) =>
                  setVenue({
                    ...venue,
                    social: { ...venue.social, tripadvisor: e.target.value },
                  })
                }
                placeholder="https://tripadvisor.com/..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
