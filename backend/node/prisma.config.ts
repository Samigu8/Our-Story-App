import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    db: {
      adapter: process.env.DIRECT_DATABASE_URL,   // direct Neon connection (no -pooler)
    },
  },
  client: {
    accelerateUrl: process.env.DATABASE_URL,      // pooled Neon connection (-pooler)
  },
});
