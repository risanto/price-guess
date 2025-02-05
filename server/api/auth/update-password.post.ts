import { serverSupabaseServiceRole } from "#supabase/server";
import { ApiResponse } from "~/types/api";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  const { newPassword, accessToken } = await readBody(event);

  if (!accessToken || !newPassword) {
    return {
      statusCode: 400,
      error: {
        message: "Harus ada token dan password baru",
      },
    };
  }

  const client = serverSupabaseServiceRole<Database>(event);

  // Validate the access token (this checks if the token is valid for resetting password)
  const {
    data: { user },
    error: errorGetUser,
  } = await client.auth.getUser(accessToken);

  if (!user || errorGetUser) {
    return {
      statusCode: 401,
      error: errorGetUser ?? { message: "User tidak ditemukan" },
    };
  }

  const { error } = await client.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });

  if (error) {
    return {
      statusCode: 500,
      error: { message: error.message },
    };
  }

  return {
    statusCode: 200,
  };
});
