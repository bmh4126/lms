import { ReviewSkeleton } from "@/app/ui/skeletons";

// Fallback while the page decides the mode and fetches. The review layout is the
// heaviest of the modes, so its skeleton is the best generic placeholder.
export default function Loading() {
  return <ReviewSkeleton />;
}
