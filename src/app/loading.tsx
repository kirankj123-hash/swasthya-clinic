import { RouteLoadingState } from '@/components/feedback/RouteLoadingState';

export default function Loading() {
  return (
    <RouteLoadingState
      title="Loading BDA CPIMS"
      description="Preparing the command view, citizen services, and latest request data."
    />
  );
}
