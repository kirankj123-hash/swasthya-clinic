'use client';

import { RouteErrorState } from '@/components/feedback/RouteErrorState';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorState
      title="CPIMS could not load this view"
      description="The page hit a runtime issue while loading live request data. You can retry immediately or return to the home screen."
      reset={reset}
      backHref="/"
    />
  );
}
