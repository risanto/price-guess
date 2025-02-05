import { serverSupabaseServiceRole } from "#supabase/server";
import { ApiResponse } from "~/types/api";
import { Content } from "~/types/content";
import { Database } from "~/types/supabase"; // Adjust the import path as needed

export default eventHandler(async (event): Promise<ApiResponse<Content>> => {
  const client = serverSupabaseServiceRole<Database>(event);

  const { id } = event.context.params as { id: string };

  // Check if ID is provided
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID is required" });
  }

  const { data, error } = await client
    .from("content")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return {
      statusCode: 500,
      error,
    };
  }

  return {
    statusCode: 200,
    data,
  };
});
