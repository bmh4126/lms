// Layout primitives shared between the real curriculum tree and its skeleton.
// Keeping the box model in one place guarantees the placeholder and the loaded
// content are pixel-identical, so swapping them causes no layout shift (CLS).

// Outer wrapper around the whole tree (top margin + bottom breathing room + the
// font-size context that drives every row's line-height).
export const treeWrapper =
  "text-xl md:text-2xl flex flex-col w-full mt-8 pb-[60vh]";

// The <ul> that stacks chapter rows, including the inter-row gap.
export const treeList = "flex flex-col gap-3 w-full";

// The chapter box (<li>): border + rounding + clipping. No background/hover here
// so the skeleton and the real row can layer their own colors on top.
export const chapterRow =
  "w-full overflow-hidden rounded-md border-b-2 border-r-2 transition-all";

// The chapter header: only the sizing-relevant classes (padding + weight) live
// here. Background/hover styling is added per-use.
export const chapterHead = "w-full text-left p-4 font-semibold";

// --- Topic level (one step down, rendered inside an expanded chapter) ---
// The <ul> that stacks topic rows, including its own padding + gap.
export const topicList = "flex flex-col gap-2 p-3";
// The topic box (<li>): same border/clip pattern as a chapter, no background.
export const topicRow =
  "overflow-hidden rounded-md border-b-2 border-r-2 transition-all";
// The topic header: padding only (smaller than a chapter's).
export const topicHead = "w-full text-left p-3";

// --- Lesson level (rendered inside an expanded topic) ---
// The <ul> that stacks lesson rows, with its indent (pl-4) + gap.
export const lessonList = "flex flex-col gap-1 p-2 pl-4";
// A lesson row: a single padded, bordered block (the real one is a <Link>).
export const lessonRow = "border-r-2 border-b-2 rounded-md block p-2";
