import { User } from "@clerk/nextjs/dist/api";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { filterUserForClient } from "./posts";

export const profileRouter = createTRPCRouter({
  getUserByName: publicProcedure
    .input(z.object({ userName: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await clerkClient.users.getUserList({
        username: [input.userName],
      });

      if (!user || !user[0])
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      return filterUserForClient(user[0]);
    }),
});
