import {initTRPC, TRPCError} from '@trpc/server';
import {cache} from 'react';
import superjson from 'superjson';
import {auth} from '@clerk/nextjs/server'
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {users} from "@/db/schema";
import {ratelimit} from "@/lib/ratelimit";

export const createTRPCContext = cache(async () => {
    const {userId} = await auth()

    return {ClerkUserId: userId};
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
    const {ctx} = opts
    if (!ctx.ClerkUserId) {
        throw new TRPCError(({code: "UNAUTHORIZED"}))
    }

    const [user] = await db.select().from(users).where(eq(users.clerkId, ctx.ClerkUserId))

    if (!user) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
        })
    }

    const {success} = await ratelimit.limit(user.id)

    if (!success) {
        throw new TRPCError({code: "TOO_MANY_REQUESTS"})
    }

    return opts.next({
        ctx: {
            ...ctx,
            user
        },
    })
})