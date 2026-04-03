import mongoose from "mongoose";
import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

let cached = {
  conn: null as typeof mongoose | null,
  promise: null as Promise<mongoose.Mongoose> | null,
};

function getEnv(): Env {
  return envSchema.parse(process.env);
}

export async function connectToDb() {
  if (!cached.promise) {
    const { MONGODB_URI } = getEnv();
    cached.promise = mongoose.connect(MONGODB_URI);
  }
  return cached.promise;
}

