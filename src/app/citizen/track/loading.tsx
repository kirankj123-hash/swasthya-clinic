import { RouteLoadingState } from '@/components/feedback/RouteLoadingState';

export default function Loading() {
  return (
    <RouteLoadingState
      title="Loading Tracking Status"
      description="Retrieving the latest BDA CPIMS status, acknowledgement details, and communication history."
    />
  );
}
