import { serverSupabaseServiceRole } from "#supabase/server";
import { ApiResponse } from "~/types/api";
import { Content } from "~/types/content";
import { Database } from "~/types/supabase"; // Adjust the import path as needed

export default eventHandler(async (event): Promise<ApiResponse<Content[]>> => {
  const client = serverSupabaseServiceRole<Database>(event);

  const { data, error } = await client
    .from("content")
    .select("*")
    .order("created_at", { ascending: false });

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
