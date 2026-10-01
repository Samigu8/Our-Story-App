import dotenv from 'dotenv';
import { defineConfig, env } from 'prisma/config';

dotenv.config({ path: 'prisma/.env' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('postgresql://neondb_owner:npg_8zlSaYCD9kxW@ep-royal-base-b4i5o3u5-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'),
    shadowDatabaseUrl: env('postgresql://neondb_owner:npg_8zlSaYCD9kxW@ep-royal-base-b4i5o3u5.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'),
  },
});
