import { RouteLoadingState } from '@/components/feedback/RouteLoadingState';

export default function Loading() {
  return (
    <RouteLoadingState
      title="Loading Commissioner View"
      description="Pulling the latest operational metrics, queue pressure, and command activity."
    />
  );
}
