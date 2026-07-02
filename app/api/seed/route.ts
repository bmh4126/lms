import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    await sql`TRUNCATE chapters, topics, lessons CASCADE`;

    const [chapter] = await sql`
      INSERT INTO chapters (title, grade, position)
      VALUES ('Các số đến 10', 1, 10)
      RETURNING id
    `;

    const topics = await sql`
      INSERT INTO topics (title, chapter_id, position) VALUES
        ('Đếm và so sánh trong phạm vi 10', ${chapter.id}, 10),
        ('Phép cộng trong phạm vi 10',      ${chapter.id}, 20)
      RETURNING id, title
    `;
    const topicId = (title: string) =>
      topics.find((t) => t.title === title)!.id;

    await sql`
      INSERT INTO lessons (title, topic_id, position, video_url) VALUES
        ('Đếm đến 10',                     ${topicId("Đếm và so sánh trong phạm vi 10")}, 10, NULL),
        ('So sánh các số trong phạm vi 10', ${topicId("Đếm và so sánh trong phạm vi 10")}, 20, NULL),
        ('Phép cộng bằng cách đếm thêm',    ${topicId("Phép cộng trong phạm vi 10")},     10, NULL),
        ('Bảng cộng trong phạm vi 10',      ${topicId("Phép cộng trong phạm vi 10")},     20, NULL)
    `;
    return Response.json({ ok: true, message: "Curriculum seeded." });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
