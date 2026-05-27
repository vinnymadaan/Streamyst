
import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userService } from "@repo/trpc/server/services";
import * as trpcExpress from "@trpc/server/adapters/express";



import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";
import { tr } from "zod/v4/locales";

export const app = express();


if (env.NODE_ENV !== "prod") {
  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://streamyst-web.vercel.app'],

      credentials: true,
    })
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

app.get('/auth/google', async (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI,

    client_id: env.GOOGLE_OAUTH_CLIENT_ID,

    access_type: 'offline',

    response_type: 'code',

    prompt: 'consent',

    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);

  return res.redirect(`${rootUrl}?${qs.toString()}`);
});

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
        path: "/"
      },
    );

    return res.redirect('https://streamyst-web.vercel.app/dashboard');
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
