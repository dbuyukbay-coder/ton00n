import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { buildDirection, nextQuestion } from "./noon";

const interviewTurn = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const interviewInput = z.object({
  brandName: z.string().min(1).max(120),
  idea: z.string().min(1).max(12000),
  founderDifference: z.string().min(1).max(8000),
  turns: z.array(interviewTurn).max(12),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  noon: router({
    nextQuestion: publicProcedure.input(interviewInput).mutation(({ input }) => nextQuestion(input)),
    buildDirection: publicProcedure.input(interviewInput).mutation(({ input }) => buildDirection(input)),
  }),
});

export type AppRouter = typeof appRouter;
