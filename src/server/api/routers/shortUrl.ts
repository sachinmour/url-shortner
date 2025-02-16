import { z } from "zod";
import { env } from "~/env";
import { nanoid } from "nanoid";
import { Prisma } from "@prisma/client";
import { isReservedSlug } from "~/utils/reserved-slugs";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { checkRateLimit } from "~/server/ratelimit";

const createUrlSchema = z.object({
  longUrl: z.string().url(),
});

const createCustomUrlSchema = z.object({
  longUrl: z.string().url(),
  slug: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9-_]+$/)
    .refine((slug) => !isReservedSlug(slug), {
      message: "This slug is reserved and cannot be used",
    }),
});

export const shortUrlRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const url = await ctx.db.shortUrl.findUnique({
        where: { slug: input.slug },
        select: { createdById: true },
      });

      if (!url) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "URL not found",
        });
      }

      if (url.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own URLs",
        });
      }

      await ctx.db.shortUrl.delete({
        where: { slug: input.slug },
      });

      return { success: true };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // Rate limit based on IP from headers
      const ip =
        ctx.headers.get("x-forwarded-for")?.split(",")[0] ??
        ctx.headers.get("x-real-ip") ??
        "anonymous";
      const identifier = `redirect_${ip}`;
      await checkRateLimit(identifier);
      try {
        const shortUrl = await ctx.db.shortUrl.update({
          where: { slug: input.slug },
          data: {
            visits: { increment: 1 },
          },
        });

        return shortUrl;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Short URL not found",
          });
        }
        throw error;
      }
    }),

  create: publicProcedure
    .input(createUrlSchema)
    .mutation(async ({ ctx, input }) => {
      // Rate limit based on user ID or IP from headers
      const ip =
        ctx.headers.get("x-forwarded-for")?.split(",")[0] ??
        ctx.headers.get("x-real-ip") ??
        "anonymous";
      const identifier = ctx.session?.user?.id ?? `ip_${ip}`;
      await checkRateLimit(identifier);
      // Generate a unique slug
      const slug = nanoid(6); // 6 characters is a good balance between length and uniqueness

      try {
        const result = await ctx.db.shortUrl.create({
          data: {
            slug,
            longUrl: input.longUrl,
            // If user is authenticated, associate the URL with them,
            ...(ctx.session?.user
              ? { createdBy: { connect: { id: ctx.session.user.id } } }
              : {}),
          },
        });

        if (!result?.slug) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create short URL.",
          });
        }

        const shortUrlString = `${env.NEXT_PUBLIC_APP_URL}/${result.slug}`;
        return {
          shortUrl: shortUrlString,
          slug: result.slug,
        };
      } catch (error) {
        // In the rare case of a slug collision, throw an error
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Failed to create short URL. Please try again.",
          });
        }
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred.",
        });
      }
    }),

  createWithCustomSlug: protectedProcedure
    .input(createCustomUrlSchema)
    .mutation(async ({ ctx, input }) => {
      // Rate limit based on user ID
      await checkRateLimit(ctx.session.user.id);
      try {
        // Check if slug is already taken
        const existing = await ctx.db.shortUrl.findUnique({
          where: { slug: input.slug },
        });

        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This custom URL is already taken.",
          });
        }

        const result = await ctx.db.shortUrl.create({
          data: {
            slug: input.slug,
            longUrl: input.longUrl,
            createdBy: { connect: { id: ctx.session.user.id } },
          },
        });

        if (!result?.slug) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create short URL.",
          });
        }

        const shortUrlString = `${env.NEXT_PUBLIC_APP_URL}/${result.slug}`;
        return {
          shortUrl: shortUrlString,
          slug: result.slug,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Failed to create short URL. Please try again.",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred.",
        });
      }
    }),

  getUserUrls: protectedProcedure.query(async ({ ctx }) => {
    const urls = await ctx.db.shortUrl.findMany({
      where: {
        createdById: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        slug: true,
        longUrl: true,
        createdAt: true,
        visits: true,
      },
    });

    return urls.map((url) => ({
      ...url,
      shortUrl: `${env.NEXT_PUBLIC_APP_URL}/${url.slug}`,
    }));
  }),
});
