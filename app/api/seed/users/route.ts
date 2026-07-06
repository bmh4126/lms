import postgres from "postgres";
import bcrypt from "bcrypt";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const seedUsers = [
  {
    name: "Student 2",
    email: "student2@test.com",
    password: "password123",
    role: "student",
  },
  {
    name: "Teacher 2",
    email: "teacher2@test.com",
    password: "password123",
    role: "teacher",
  },
];

export async function GET() {
  try {
    for (const u of seedUsers) {
      const hash = await bcrypt.hash(u.password, 10);
      await sql`
        INSERT INTO users (name, email, password, role)
        VALUES (${u.name}, ${u.email}, ${hash}, ${u.role})
        ON CONFLICT (email) DO UPDATE
          SET password = EXCLUDED.password,
              role = EXCLUDED.role,
              name = EXCLUDED.name
      `;
    }
    return Response.json({ ok: true, seeded: seedUsers.map((u) => u.email) });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
