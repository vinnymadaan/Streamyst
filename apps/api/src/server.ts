
import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userService } from "@repo/trpc/server/services";
import * as trpcExpress from "@trpc/server/adapters/express";



import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

export const app = express();


if (env.NODE_ENV !== "prod") {
  app.use(
    cors({
      origin: "*",
    }),
  );
}

app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => {
  return res.json({ message: "Streamyst is up and running..." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "Streamyst server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);


app.get("/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        message: "Missing Google OAuth code",
      });
    }

    const result =
      await userService.authenticateWithGoogle(code);

    if (!result.session) {
      return res.status(500).json({
        message: "Session creation failed",
      });
    }

    res.cookie(
      "session_token",
      result.session.sessionToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      },
    );

    return res.redirect("http://localhost:3000");
  } catch (error) {
  console.error("GOOGLE CALLBACK ERROR:");
  console.error(error);

  return res.status(500).json({
    message: "Google authentication failed",
    error,
  });
}
})


app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app
