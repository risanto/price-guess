import { serverSupabaseServiceRole } from "#supabase/server";
import { ApiResponse } from "~/types/api";
import { Database } from "~/types/supabase"; // Adjust the import path as needed

export default eventHandler(async (event): Promise<ApiResponse> => {
  const body = await readBody(event);
  const client = serverSupabaseServiceRole<Database>(event);

  const { id } = event.context.params as { id: string };

  // Check if ID is provided
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID is required" });
  }

  const { error } = await client.from("config").update(body).eq("id", id);

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
