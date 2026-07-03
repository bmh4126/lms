import postgres from "postgres";
import bcrypt from "bcrypt";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const seedUsers = [
  {
    name: "Admin",
    email: "admin@test.com",
    role: "admin",
    password: "password123",
  },
  {
    name: "Teacher",
    email: "teacher@test.com",
    role: "teacher",
    password: "password123",
  },
  {
    name: "Student",
    email: "student@test.com",
    role: "student",
    password: "password123",
  },
  {
    name: "Parent",
    email: "parent@test.com",
    role: "parent",
    password: "password123",
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