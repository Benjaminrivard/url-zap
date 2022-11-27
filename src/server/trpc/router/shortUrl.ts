import { z } from "zod";

import cuid from 'cuid';

import { router, publicProcedure } from "../trpc";

export const shortUrlRouter = router({
  create: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    try {
      const exists = await ctx.prisma.shortUrl.findFirst({
        where: {
          sourceUrl: input
        }
      });
      if (!exists) {
        return ctx.prisma.shortUrl.create({
          data: {
            sourceUrl: input,
            targetUrl: cuid.slug()
          }

        })
      }
      return exists;
    } catch (error) {
      console.error('Error while trying to add the url %s, error was :%o,', input, error)
    }
  }),
  getOne: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.shortUrl.findUnique({
      where: {
        id: input
      }
    })
  }),
  getByUrl: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.shortUrl.findFirst({
      where: {
        targetUrl: input
      }
    })
  }),
  visit: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.shortUrl.update({
      where: {
        id: input
      },
      data: {
        visited: { increment: 1 }
      }
    });
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.shortUrl.findMany();
  })

});
