import Email from "next-auth/providers/email";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const FriendRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ Email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const idToAdd = await ctx.db.get(`user:email:${input.Email}`);
      if (!idToAdd) return "This user does not exist";

      if (ctx.session.user.id === idToAdd) return "You can't add yourself";

      const isAlreadyAdded = await ctx.db.sismember(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `user:${idToAdd}:incoming_friend_requests`,
        ctx.session.user.id
      );
      if (isAlreadyAdded) return "Already sent a friend request";

      const isAlreadyFriend = await ctx.db.sismember(
        `user:${ctx.session.user.id}:friends`,
        idToAdd
      );
      if (isAlreadyFriend) return "This user is already a friend";

      await ctx.db.sadd(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `user:${idToAdd}:incoming_friend_requests`,
        ctx.session.user.id
      );
      return "Friend Request sent";
    }),

  friendRequestID: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.smembers(
      `user:${ctx.session.user.id}:incoming_friend_requests`
    );
  }),
  incomingFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    const ID = await ctx.db.smembers(
      `user:${ctx.session.user.id}:incoming_friend_requests`
    );
    const incomingFriendRequests = await Promise.all(
      ID.map(async (senderId) => {
        const sender = (await ctx.db.get(`user:${senderId}`)) as User;
        return {
          senderId,
          senderEmail: sender.email,
        };
      })
    );
    return incomingFriendRequests;
  }),
  acceptFriend: protectedProcedure
    .input(z.object({ idToAdd: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const isAlreadyFriends = await ctx.db.sismember(
        `user:${ctx.session.user.id}:friends`,
        input.idToAdd
      );
      if (isAlreadyFriends) return "Already friends";

      const hasFriendRequest = await ctx.db.sismember(
        `user:${ctx.session.user.id}:incoming_friend_requests`,
        input.idToAdd
      );
      if (!hasFriendRequest) return "No friend request";

      await ctx.db.sadd(`user:${ctx.session.user.id}:friends`, input.idToAdd);
      await ctx.db.sadd(`user:${input.idToAdd}:friends`, ctx.session.user.id);
      await ctx.db.srem(
        `user:${ctx.session.user.id}:incoming_friend_requests`,
        input.idToAdd
      );

      return "OK";
    }),

  denyFriend: protectedProcedure
    .input(z.object({ idToDeny: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.srem(
        `user:${ctx.session.user.id}:incoming_friend_requests`,
        input.idToDeny
      );
      return "OK";
    }),
  allFriends: protectedProcedure.query(async ({ ctx }) => {
    const friendIDs = await ctx.db.smembers(
      `user:${ctx.session.user.id}:friends`
    );
    return (await Promise.all(
      friendIDs.map(async (friendId) => {
        return await ctx.db.get(`user:${friendId}`);
      })
    )) as User[];
  }),
  // userAuth: protectedProcedure
  //   .input(z.object({ token: z.object({ id: z.string() }) }))
  //   .mutation(async ({ ctx, input }) => {
  //     return (await ctx.db.get(`user:${input.token.id}`)) as User;
  //   }),
});
