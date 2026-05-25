import { eq } from "drizzle-orm";

import { db, users } from "@repo/database";

import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";

import { createSession } from "../src/auth/create-session";

import { GetAuthenticationMethodOutputSchema } from "./model";

class UserService {
  public async getAuthenticationMethods(): Promise<
    ReadonlyArray<GetAuthenticationMethodOutputSchema>
  > {
    const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchema[] =
      [];

    const isGoogleConfigured = !!(
      env.GOOGLE_OAUTH_CLIENT_ID &&
      env.GOOGLE_OAUTH_CLIENT_SECRET
    );

    if (isGoogleConfigured) {
      const url = googleOAuth2Client.generateAuthUrl({
        scope: ["openid", "email", "profile"],
      });

      supportedAuthenticationProviders.push({
        provider: "GOOGLE_OAUTH",
        displayName: "Google",
        displayText: "Signin with Google",
        authUrl: url,
      });
    }

    return supportedAuthenticationProviders;
    return []
  }

  public async authenticateWithGoogle(code: string) {
    const { tokens } = await googleOAuth2Client.getToken(code);

    googleOAuth2Client.setCredentials(tokens);

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    const googleUser = await response.json();

    let user = await db.query.users.findFirst({
      where: eq(users.email, googleUser.email),
    });

    if (!user) {
      const [createdUser] = await db
        .insert(users)
        .values({
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
        })
        .returning();

      user = createdUser;
    }

    if (!user) {
      throw new Error("User creation failed");
    }

    const session = await createSession(user.id);

    return {
      user,
      session,
    };
  }
}

export default UserService;