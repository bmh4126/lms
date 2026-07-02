import { getCurriculumPreview } from "@/app/lib/data/student/lessons";

// GET /api/preview — quick sanity check that seeded data is reachable.
export async function GET() {
  try {
    return Response.json(await getCurriculumPreview());
  } catch (error) {
    // String(error) gives a readable message; a raw Error serializes to "{}".
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
