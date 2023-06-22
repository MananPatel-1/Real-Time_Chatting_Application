import { Redis } from "@upstash/redis";

export const db = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL, // eslint-disable-line
  token: process.env.UPSTASH_REDIS_REST_TOKEN, // eslint-disable-line
});
