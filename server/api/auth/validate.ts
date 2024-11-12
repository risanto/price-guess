// server/api/auth/validate.ts
import { Database } from "#supabase/database";
import { serverSupabaseServiceRole } from "#supabase/server";
import { EventHandlerRequest, H3Event, parseCookies, setCookie } from "h3"; // Use Nuxt's h3 library to parse and set cookies
import { ApiResponse } from "~/types/api";
import { UserProfile } from "~/types/auth";
import { isTokenExpired } from "~/utils";

function clearCookies(event: H3Event<EventHandlerRequest>) {
  // Clear the HTTP-only cookie by setting it with an expired date
  setCookie(event, "sb:token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Set the expiration date to the past
  });
  setCookie(event, "sb:refresh_token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Set the expiration date to the past
  });
}

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  // Extract cookies from the request
  const cookies = parseCookies(event);
  const token = cookies["sb:token"];
  const refreshToken = cookies["sb:refresh_token"];

  const client = serverSupabaseServiceRole<Database>(event);

  if (token && !isTokenExpired(token)) {
    // Fetch auth user data
    const { data: authUserResponse, error: authError } =
      await client.auth.getUser(token);

    if (authError || !authUserResponse.user) {
      clearCookies(event);
      return {
        statusCode: 500,
        error: {
          message: authError?.message ?? "User authentication failed.",
        },
      };
    }

    const authUser = authUserResponse.user;

    // Fetch additional user data from `public.users` table
    const { data: userProfile, error: userProfileError } = await client
      .from("users")
      .select("*")
      .eq("email", authUser.email!)
      .single();

    if (userProfileError) {
      clearCookies(event);
      return {
        statusCode: 500,
        error: userProfileError,
      };
    }

    return {
      statusCode: 200,
      data: { ...authUser, profile: { ...(userProfile as UserProfile) } },
    };
  }

  // If no token or invalid but refresh token is provided
  const { data: refreshResponse, error: refreshError } =
    await client.auth.refreshSession({ refresh_token: refreshToken });

  if (refreshError || !refreshResponse.session) {
    clearCookies(event);
    return {
      statusCode: 204,
    };
  }

  // Update cookies with the new access token and refresh token
  setCookie(event, "sb:token", refreshResponse.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: refreshResponse.session.expires_in,
  });

  if (refreshResponse.session.refresh_token) {
    setCookie(
      event,
      "sb:refresh_token",
      refreshResponse.session.refresh_token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    );
  }

  // Get the user again using the new access token
  const { data: refreshedUserData, error: newUserError } =
    await client.auth.getUser(refreshResponse.session.access_token);

  if (newUserError || !refreshedUserData.user) {
    clearCookies(event);
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid refreshed token or user not authenticated",
    });
  }

  const refreshedUser = refreshedUserData.user;

  // Fetch user profile from `public.users`
  const { data: userProfile, error: userProfileError } = await client
    .from("users")
    .select("*")
    .eq("email", refreshedUser.email!)
    .single();

  if (userProfileError) {
    clearCookies(event);
    return {
      statusCode: 500,
      error: userProfileError,
    };
  }

  // Return the merged user data with additional profile information
  return {
    statusCode: 200,
    data: { ...refreshedUser, profile: { ...(userProfile as UserProfile) } },
  };
});
