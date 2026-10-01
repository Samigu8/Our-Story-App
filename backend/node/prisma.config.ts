import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    db: {
      // REQUIRED for prisma migrate deploy
      url: process.env.DIRECT_DATABASE_URL,      

      // Optional but recommended for Prisma 7
      adapter: process.env.DIRECT_DATABASE_URL,
    },
  },
  client: {
    // Pooled connection for Prisma Client at runtime
    accelerateUrl: process.env.DATABASE_URL,
  },
});
