import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  // getOne: publicProcedure.query(({ctx}) => {
  //   return ctx.db.post.findUnique({
  //     where: { id }
  //   })
  // }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query((opts) => {
      const { id } = opts.input;
      const { ctx } = opts;
      return ctx.db.post.findUnique({
        where: { id }
      });
  }),

  

  // authorPostDelete: protectedProcedure,

  create: protectedProcedure
    .input(z.object({ 
      Title: z.string().min(1),
      content:  z.string().min(1),
      coverPictureURL: z.string().min(0),
    }))

    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          Title: input.Title,
          content: input.content,
          coverPictureURL: input.coverPictureURL,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),


  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  updatePost: protectedProcedure.query(() => {

  }),


  postDelete: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Get the post
    const post = await ctx.db.post.findUnique({
      where: { id: input.id },
    });

    // Check if the post exists and if the user is the author
    if (!post || post.createdById !== ctx.session.user.id) {
      throw new Error('Post not found or you are not the author');
    }

    // Delete the post
    return ctx.db.post.delete({
      where: { id: input.id },
    });
  }),


});
