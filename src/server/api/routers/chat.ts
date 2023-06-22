import { nanoid } from "nanoid";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { messageArrayValidator, messageValidator } from "~/utils/utils";

export const ChatRouter = createTRPCRouter({
  ChatMessages: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input, ctx }) => {
      const chat = (
        await ctx.db.zrange(`chat:${input.chatId}:messages`, 0, -1)
      ).reverse();
      messageArrayValidator.parse(chat);

      return chat as Message[];
    }),

  chatPartner: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input, ctx }) => {
      const [userId1, userId2] = input.chatId.toString().split("--");
      const chatPartnerId = ctx.session.user.id === userId1 ? userId2 : userId1;
      return await ctx.db.get(`user:${chatPartnerId as string}`);
    }),

  sendMessage: protectedProcedure
    .input(z.object({ text: z.string(), chatId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [userId1, userId2] = input.chatId?.toString().split("--");
      if (ctx.session.user.id !== userId1 && ctx.session.user.id !== userId2) {
        return "UNAUTHORIZED!!!";
      }

      const chatPartnerId = ctx.session.user.id === userId1 ? userId2 : userId1;
      const friendID = await ctx.db.smembers(
        `user:${ctx.session.user.id}:friends`
      );
      const isFriend = friendID.includes(chatPartnerId as string);
      if (!isFriend) return "UNAUTHORIZED!!!";

      const sender = await ctx.db.get(`user:${ctx.session.user.id}`);
      const timestamp = Date.now();
      const text = input.text;
      const messageData: Message = {
        id: nanoid(),
        senderId: ctx.session.user.id,
        text,
        timestamp,
      };
      const message = messageValidator.parse(messageData);
      await ctx.db.zadd(`chat:${input.chatId}:messages`, {
        score: timestamp,
        member: JSON.stringify(message),
      });
      return "OK";
    }),
});
