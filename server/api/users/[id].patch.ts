import { serverSupabaseServiceRole } from "#supabase/server";
import { ApiResponse } from "~/types/api";
import { UserProfile } from "~/types/auth";
import { Database } from "~/types/supabase"; // Adjust the import path as needed
import { isToday } from "~/utils";

export default eventHandler(async (event): Promise<ApiResponse> => {
  const body = await readBody(event);
  const client = serverSupabaseServiceRole<Database>(event);
  const { id } = event.context.params as { id: string };

  // Check if ID is provided
  if (!id) {
    return {
      statusCode: 400,
      error: {
        message: "ID is required",
      },
    };
  }

  const { data: userProfile, error: errorUserProfile } = await client
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  const pointsLastAdded = (userProfile as UserProfile).points_last_added;

  if (isToday(pointsLastAdded)) {
    return {
      statusCode: 400,
      error: {
        message: "Poin untuk hari ini sudah ditambahkan",
      },
    };
  }

  // Check if the request body is empty
  if (!body || Object.keys(body).length === 0) {
    return {
      statusCode: 400,
      error: {
        message: "Request body cannot be empty",
      },
    };
  }

  // Perform the update
  const { error } = await client.from("users").update(body).eq("id", id);

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
