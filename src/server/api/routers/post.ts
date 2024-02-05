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
      include: {
        createdBy: true, // Include the createdBy relation
      },
    });
  }),

  getSearch: publicProcedure.input(z.object({ 
    query: z.string().min(1),
  }))
  .query(async ({ ctx, input }) => {
    return await ctx.db.post.findMany({
      where: {
        OR: [
          {
            Title: {
              contains: input.query,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: input.query,
              mode: "insensitive",
            },
          },
          {
            createdBy: {
                name: {
                  contains: input.query,
                  mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        createdBy: true, // Include the createdBy relation
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
        where: { id },
        include: {
          createdBy: true, // Include the createdBy relation
        },
      });
  }),

  getAuthor: publicProcedure
    .input(z.object({ id: z.string() }))
    .query((opts) => {
      const { id } = opts.input;
      const { ctx } = opts;
      return ctx.db.user.findUnique({
        where: { id },
        select: {
          name: true,
          image: true
        }
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

  // updatePost: protectedProcedure.query(() => {

  // }),

  postUpdate: protectedProcedure
  .input(z.object({
    id: z.string(),
    Title: z.string().min(1),
    content: z.string().min(1),
    coverPictureURL: z.string().min(0),
  }))
  .mutation(async ({ ctx, input }) => {
    // simulate a slow db call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return ctx.db.post.update({
      where: { id: input.id },
      data: {
        Title: input.Title,
        content: input.content,
        coverPictureURL: input.coverPictureURL,
      },
    });
  }),


  postToggleArchive: protectedProcedure
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

    // Toggle the archived status
    const newStatus = post.archived === true ? false : true;

    // Update the post
    return ctx.db.post.update({
      where: { id: input.id },
      data: { archived: newStatus },
    });
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
