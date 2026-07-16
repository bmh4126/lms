import { ReviewSkeleton } from "@/app/ui/skeletons";

// Route-level fallback shown while the review page's server work resolves
// (questions + answers + score + assessment name). Mirrors the page layout.
export default function Loading() {
  return <ReviewSkeleton />;
}
