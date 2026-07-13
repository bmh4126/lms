import { DefaultSession } from "next-auth";
import { Role } from "@/app/lib/definition";

declare module "next-auth" {
  interface User {
    role: Role;
    grade?: number;
  }
  interface Session {
    user: { role: Role; grade?: number } & DefaultSession["user"];
  }
}

// NOTE: We don't augment JWT here. `JWT` is declared in @auth/core/jwt, but
// pnpm doesn't hoist that transitive dep to the project root, so the module
// isn't resolvable and the augmentation would be silently ignored. Instead we
// cast `token.role` in the session callback (see auth.ts).
