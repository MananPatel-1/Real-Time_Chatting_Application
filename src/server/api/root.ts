import { createTRPCRouter } from "~/server/api/trpc";
import { FriendRouter as FriendRouter } from "./routers/friends";
import { ChatRouter } from "./routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  Friend: FriendRouter,
  Chat: ChatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
