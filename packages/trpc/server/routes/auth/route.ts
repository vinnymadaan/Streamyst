import { TRPCError } from "@trpc/server";
import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  getSupportedAuthenticationProviders: publicProcedure
    .input(zodUndefinedModel)
    .output(z.readonly(z.array(getAuthenticationMethodOutputSchema)))
    .query(async () => {
      const supportedMethods =
        await userService.getAuthenticationMethods();

      return supportedMethods;
    }),

  googleCallback: publicProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }: any) => {
      try {
        const result =
          await userService.authenticateWithGoogle(
            input.code,
          );

        if (!result.session) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Session creation failed",
          });
        }

        ctx.res.cookie(
          "session_token",
          result.session.sessionToken,
          {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 30,
          },
        );

        return {
          success: true,
          user: result.user,
        };
      } catch (error) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Google authentication failed",
        });
      }
    }),
});
