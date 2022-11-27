import { router } from "../trpc";
import { shortUrlRouter } from "./shortUrl";

export const appRouter = router({
  shortUrl: shortUrlRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
