import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { salvarSimulacao, obterSimulacoes, obterSimulacao } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  simulador: router({
    salvar: protectedProcedure
      .input(z.object({
        cursoId: z.string(),
        dadosJson: z.string(),
        mediaFinal: z.string().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await salvarSimulacao(ctx.user.id, input.cursoId, input.dadosJson, input.mediaFinal);
      }),
    
    listar: protectedProcedure
      .query(async ({ ctx }) => {
        return await obterSimulacoes(ctx.user.id);
      }),
    
    obter: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await obterSimulacao(input.id, ctx.user.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
