'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getPublishStatus, deployVenue } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Loader2 } from 'lucide-react';

export function PublishBanner() {
  const { user } = useAuth();
  const [hasUnpublished, setHasUnpublished] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!user) return;
    const res = await getPublishStatus(user.venue_id);
    if (res.return_code === 'SUCCESS') {
      setHasUnpublished(
        (res as unknown as { has_unpublished_changes: boolean }).has_unpublished_changes
      );
    }
    setLoaded(true);
  }, [user]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Listen for custom event so admin pages can trigger a re-fetch after saving
  useEffect(() => {
    const handler = () => {
      setHasUnpublished(true);
    };
    window.addEventListener('content-saved', handler);
    return () => window.removeEventListener('content-saved', handler);
  }, []);

  async function handleDeploy() {
    if (!user) return;
    setIsDeploying(true);
    const res = await deployVenue(user.venue_id);
    setIsDeploying(false);

    if (res.return_code === 'SUCCESS') {
      setHasUnpublished(false);
      toast.success('Publishing! Your changes will be live shortly.');
    } else {
      toast.error(res.message || 'Failed to publish');
    }
  }

  if (!loaded || !hasUnpublished) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-950">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          You have unpublished changes
        </p>
        <Button
          size="sm"
          onClick={handleDeploy}
          disabled={isDeploying}
          className="bg-amber-600 text-white hover:bg-amber-700"
        >
          {isDeploying ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Publish to Website
        </Button>
      </div>
    </div>
  );
}
