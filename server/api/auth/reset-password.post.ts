import { serverSupabaseServiceRole } from "#supabase/server";
import { ApiResponse } from "~/types/api";
import { Database } from "~/types/supabase";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
  const { email, redirectTo } = await readBody(event);

  const client = serverSupabaseServiceRole<Database>(event);

  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return {
      statusCode: 500,
      error,
    };
  }

  return {
    statusCode: 200,
  };
});
