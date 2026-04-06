import { RouteLoadingState } from '@/components/feedback/RouteLoadingState';

export default function Loading() {
  return (
    <RouteLoadingState
      title="Loading Decision Packet"
      description="Fetching the file summary, audit timeline, and staff action controls for this request."
    />
  );
}
