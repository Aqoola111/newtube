import {inferRouterOutputs} from "@trpc/server";

import {AppRouter} from "@/trpc/routers/_app";

export type videoGetOneOutput = inferRouterOutputs<AppRouter>["videos"]["getOne"];