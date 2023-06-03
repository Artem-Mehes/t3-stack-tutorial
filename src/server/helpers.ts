import superjson from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { prisma } from "~/server/db";
import { appRouter } from "~/server/api/root";

export const generateSSGHelper = () =>
  createProxySSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: {
      prisma,
      userId: null,
    },
  });
