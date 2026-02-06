'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Server-side error caught:', error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <p className="text-gray-600">
        {error.message || 'An unexpected error occurred.'}
      </p>
      {error.digest && (
        <p className="font-mono text-sm text-gray-500">Digest: {error.digest}</p>
      )}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
