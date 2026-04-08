import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const DEFAULT_ACCESS_SECRET = "odop-access-secret-dev-only";
const DEFAULT_REFRESH_SECRET = "odop-refresh-secret-dev-only";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1).default("file:./dev.db"),
  REDIS_URL: z.string().url().optional(),
  JWT_ACCESS_SECRET: z.string().min(16).default(DEFAULT_ACCESS_SECRET),
  JWT_REFRESH_SECRET: z.string().min(16).default(DEFAULT_REFRESH_SECRET),
  JWT_ACCESS_EXPIRY: z.string().min(2).default("15m"),
  JWT_REFRESH_EXPIRY: z.string().min(2).default("7d"),
  UPLOAD_DIR: z.string().min(1).default("./uploads"),
  MAX_FILE_SIZE: z.coerce.number().int().positive().default(10 * 1024 * 1024),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  ELASTICSEARCH_URL: z.string().optional(),
  AI_SERVICE_URL: z.string().url().default("http://localhost:8000"),
  OLLAMA_URL: z.string().url().default("http://localhost:11434"),
  OLLAMA_MODEL: z.string().default("phi"),
});

const parsed = envSchema.parse(process.env);
const corsOrigins = parsed.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (parsed.NODE_ENV === "production") {
  if (
    parsed.JWT_ACCESS_SECRET === DEFAULT_ACCESS_SECRET ||
    parsed.JWT_REFRESH_SECRET === DEFAULT_REFRESH_SECRET
  ) {
    throw new Error("JWT secrets must be explicitly configured in production");
  }
} else if (
  parsed.JWT_ACCESS_SECRET === DEFAULT_ACCESS_SECRET ||
  parsed.JWT_REFRESH_SECRET === DEFAULT_REFRESH_SECRET
) {
  console.warn(
    "[ENV] Using development fallback JWT secrets. Configure explicit secrets before deployment.",
  );
}

export const env = {
  ...parsed,
  IS_DEV: parsed.NODE_ENV === "development",
  CORS_ORIGINS: corsOrigins,
} as const;
