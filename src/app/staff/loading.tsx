import { RouteLoadingState } from '@/components/feedback/RouteLoadingState';

export default function Loading() {
  return (
    <RouteLoadingState
      title="Loading Staff Queue"
      description="Refreshing the triage queue, AI priority summaries, and latest hearing actions."
    />
  );
}
