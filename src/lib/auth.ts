import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

function detectBaseURL() {
  // Detect ngrok or localhost dynamically
  if (process.env.NGROK_URL) return process.env.NGROK_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;

  // Fallback for local dev
  return process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com"
    : "http://localhost:3000";
}

const baseURL = detectBaseURL();

const allowedOrigins = [
  baseURL,
  "http://localhost:3000",
  "https://localhost:3000",
];

export const auth = betterAuth({
  baseURL,
  allowedOrigins,

  socialProviders: {
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    }, 
  },

  emailAndPassword: {
    enabled: true,
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { ...schema },
  }),
});
