// File: server/api/users.ts
import { serverSupabaseServiceRole } from "#supabase/server";
import { Database } from "~/types/supabase"; // Adjust the import path as needed

export default eventHandler(async (event) => {
  // Get the request body
  const body = await readBody(event);

  // Assuming you have the email in the request body
  const email = body.email;

  if (!email) {
    return {
      statusCode: 400,
      body: { message: "Email is required" },
    };
  }

  // Initialize the Supabase service role client
  const client = serverSupabaseServiceRole<Database>(event);

  // Insert the new user into the "users" table
  const { data, error } = await client.from("users").insert([{ email }]);

  // Check for errors
  if (error) {
    console.error("Error inserting user:", error);
    return {
      statusCode: 500,
      body: { message: "Error inserting user", error },
    };
  }

  // Return the inserted user data
  return {
    statusCode: 201,
    body: { data },
  };
});
