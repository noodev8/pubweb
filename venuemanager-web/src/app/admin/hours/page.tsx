'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getHours, updateHours, OpeningHours, DayHours } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, Plus, Trash2 } from 'lucide-react';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

export default function HoursPage() {
  const { user } = useAuth();
  const [hours, setHours] = useState<OpeningHours | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadHours = async () => {
    if (!user) return;
    const res = await getHours(user.venue_id);
    if (res.return_code === 'SUCCESS' && res.hours) {
      setHours(res.hours as unknown as OpeningHours);
    } else if (res.return_code !== 'SUCCESS') {
      // Initialize with empty hours if none exist
      setHours({
        regular: DAYS.map((day) => ({
          day,
          isClosed: false,
          periods: [{ open: '12:00', close: '23:00' }],
        })),
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadHours();
  }, [user]);

  const handleSave = async () => {
    if (!user || !hours) return;
    setIsSaving(true);

    const res = await updateHours(user.venue_id, hours);
    if (res.return_code === 'SUCCESS') {
      toast.success('Hours saved');
    } else {
      toast.error(res.message || 'Failed to save hours');
    }
    setIsSaving(false);
  };

  const updateDay = (dayIndex: number, updates: Partial<DayHours>) => {
    if (!hours) return;
    const newRegular = [...hours.regular];
    newRegular[dayIndex] = { ...newRegular[dayIndex], ...updates };
    setHours({ ...hours, regular: newRegular });
  };

  const addPeriod = (dayIndex: number) => {
    if (!hours) return;
    const day = hours.regular[dayIndex];
    const periods = day.periods || [];
    updateDay(dayIndex, {
      periods: [...periods, { open: '18:00', close: '23:00' }],
    });
  };

  const updatePeriod = (
    dayIndex: number,
    periodIndex: number,
    field: 'open' | 'close',
    value: string
  ) => {
    if (!hours) return;
    const day = hours.regular[dayIndex];
    const periods = [...(day.periods || [])];
    periods[periodIndex] = { ...periods[periodIndex], [field]: value };
    updateDay(dayIndex, { periods });
  };

  const removePeriod = (dayIndex: number, periodIndex: number) => {
    if (!hours) return;
    const day = hours.regular[dayIndex];
    const periods = (day.periods || []).filter((_, i) => i !== periodIndex);
    updateDay(dayIndex, { periods: periods.length > 0 ? periods : undefined });
  };

  const copyToAllDays = (fromIndex: number) => {
    if (!hours) return;
    const sourceDay = hours.regular[fromIndex];
    const newRegular = hours.regular.map((day, i) =>
      i === fromIndex
        ? day
        : {
            ...day,
            isClosed: sourceDay.isClosed,
            periods: sourceDay.periods ? [...sourceDay.periods] : undefined,
          }
    );
    setHours({ ...hours, regular: newRegular });
    toast.success('Copied to all days');
  };

  if (isLoading || !hours) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Opening Hours</h1>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Opening Hours</h1>
          <p className="text-muted-foreground">
            Set your regular opening hours
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regular Hours</CardTitle>
          <CardDescription>
            Set the hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hours.regular.map((day, dayIndex) => (
            <div key={day.day} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-24 font-medium">{DAY_LABELS[day.day]}</div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!day.isClosed}
                      onCheckedChange={(open) =>
                        updateDay(dayIndex, { isClosed: !open })
                      }
                    />
                    <Label className="text-sm">
                      {day.isClosed ? 'Closed' : 'Open'}
                    </Label>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToAllDays(dayIndex)}
                >
                  Copy to all
                </Button>
              </div>

              {!day.isClosed && (
                <div className="ml-28 space-y-2">
                  {(day.periods || []).map((period, periodIndex) => (
                    <div key={periodIndex} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={period.open}
                        onChange={(e) =>
                          updatePeriod(dayIndex, periodIndex, 'open', e.target.value)
                        }
                        className="w-32"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={period.close}
                        onChange={(e) =>
                          updatePeriod(dayIndex, periodIndex, 'close', e.target.value)
                        }
                        className="w-32"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePeriod(dayIndex, periodIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addPeriod(dayIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add period
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
