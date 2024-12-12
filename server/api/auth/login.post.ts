import { serverSupabaseServiceRole } from "#supabase/server";
import { ApiResponse } from "~/types/api";
import { UserProfile } from "~/types/auth";
import { Database } from "~/types/supabase";
import { UserProfileGet, UserProfileUpdate } from "~/types/userProfile";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  try {
    const body = await readBody(event); // To get the email and password from the request body

    const { email, password, addPoints } = body;
    const client = serverSupabaseServiceRole<Database>(event);

    const {
      data: userProfileFound,
      error: errorUserProfile,
    }: { data: UserProfileGet | null; error?: any } = await client
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!userProfileFound) {
      return {
        statusCode: 404,
        error: { message: "User tidak terdaftar" },
      };
    }
    if (errorUserProfile) {
      // If user not found, return a 404
      if (errorUserProfile.code === "PGRST116") {
        return {
          statusCode: 404,
          error: { message: "User tidak terdaftar" },
        };
      }
      return {
        statusCode: 500,
        error: errorUserProfile,
      };
    }

    if (addPoints) {
      await $fetch("/api/users/" + userProfileFound.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          points: userProfileFound.points + 5000,
          points_last_added: new Date().toISOString(),
        } as UserProfileUpdate),
      });
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
  } catch (error: any) {
    return {
      statusCode: 400,
      error,
    };
  }

  return {
    statusCode: 400,
    error: { message: "Login failed" },
  };
});
