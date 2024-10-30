import { serverSupabaseServiceRole } from "#supabase/server";
import { ApiResponse, Config } from "~/types/api";
import { Database } from "~/types/supabase"; // Adjust the import path as needed

export default eventHandler(async (event): Promise<ApiResponse<Config>> => {
  const client = serverSupabaseServiceRole<Database>(event);

  const { data, error } = await client
    .from("config")
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
    data: data[0],
  };
});
