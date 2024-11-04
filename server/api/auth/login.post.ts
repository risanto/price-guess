import { serverSupabaseServiceRole } from "#supabase/server";
import { ApiResponse } from "~/types/api";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  const body = await readBody(event); // To get the email and password from the request body

  const { email, password } = body;
  const client = serverSupabaseServiceRole<Database>(event);

  const { data: userProfileFound, error: errorUserProfile } = await client
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!userProfileFound) {
    return {
      statusCode: 404,
      error: { message: "User not found" },
    };
  }
  if (errorUserProfile) {
    // If user not found, return a 404
    if (errorUserProfile.code === "PGRST116") {
      return {
        statusCode: 404,
        error: { message: "User not found" },
      };
    }
    return {
      statusCode: 500,
      error: errorUserProfile,
    };
  }

  const {
    data: { session },
    error: errorSignIn,
  } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (errorSignIn) {
    return {
      statusCode: 401,
      error: { message: errorSignIn.message },
    };
  }

  // Set the HTTP-only cookie
  if (session) {
    setCookie(event, "sb:token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: session.expires_in,
    });
    setCookie(event, "sb:refresh_token", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return {
      statusCode: 200,
    };
  }

  return {
    statusCode: 400,
    error: { message: "Login failed" },
  };
});
