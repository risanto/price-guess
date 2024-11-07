// server/api/auth/validate.ts
import { Database } from "#supabase/database";
import { serverSupabaseServiceRole } from "#supabase/server";
import { parseCookies, setCookie } from "h3"; // Use Nuxt's h3 library to parse and set cookies
import { ApiResponse } from "~/types/api";
import { UserProfile } from "~/types/auth";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  // Extract cookies from the request
  const cookies = parseCookies(event);
  const token = cookies["sb:token"];
  const refreshToken = cookies["sb:refresh_token"];

  const client = serverSupabaseServiceRole<Database>(event);

  // No refresh token case
  if (!refreshToken) {
    if (token) {
      // Fetch auth user data
      const { data: authUserResponse, error: authError } =
        await client.auth.getUser(token);

      if (authError || !authUserResponse.user) {
        throw createError({
          statusCode: 500,
          message: authError?.message || "User authentication failed.",
        });
      }

      const authUser = authUserResponse.user;

      // Fetch additional user data from `public.users` table
      const { data: userProfile, error: userProfileError } = await client
        .from("users")
        .select("*")
        .eq("email", authUser.email!)
        .single();

      if (userProfileError) {
        throw createError({
          statusCode: 500,
          message: userProfileError.message,
        });
      }

      return {
        data: { ...authUser, profile: { ...(userProfile as UserProfile) } },
      };
    }

    return {}; // Return empty if no token
  }

  // When refresh token is provided
  const { data: refreshResponse, error: refreshError } =
    await client.auth.refreshSession({ refresh_token: refreshToken });

  console.log("refreshResponse ===>", refreshResponse);

  if (refreshError || !refreshResponse.session) {
    return {
      statusCode: 401,
      error: refreshError ?? { message: "Tidak bisa refresh access token" },
    };
    throw createError({
      statusCode: 401,
      statusMessage: "Unable to refresh access token.",
    });
  }

  // Update cookies with the new access token and refresh token
  setCookie(event, "sb:token", refreshResponse.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
    throw createError({
      statusCode: 500,
      message: userProfileError.message,
    });
  }

  // Return the merged user data with additional profile information
  return {
    data: { ...refreshedUser, profile: { ...(userProfile as UserProfile) } },
  };
});
