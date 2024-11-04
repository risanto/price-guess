import { serverSupabaseServiceRole } from "#supabase/server";
import { useFetch } from "nuxt/app";
import {
  ApiResponse,
  Config,
  // Config
} from "~/types/api";
import { Database } from "~/types/supabase"; // Adjust the import path as needed

function getTodayMidnight() {
  const todayUTC = new Date();
  todayUTC.setUTCDate(todayUTC.getUTCDate() + 1); // Move to the next day
  todayUTC.setUTCHours(0, 0, 0, 0);

  return todayUTC.toISOString();
}

export default eventHandler(
  async (event): Promise<ApiResponse<{ id: number }>> => {
    // Set headers to prevent caching
    event.node.res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    event.node.res.setHeader("Pragma", "no-cache");
    event.node.res.setHeader("Expires", "0");

    const client = serverSupabaseServiceRole<Database>(event);
    const config = useRuntimeConfig();

    const { data: configData, error: errorConfigData } = await client
      .from("config")
      .select("*")
      .single();

    if (errorConfigData) {
      return {
        statusCode: 500,
        error: errorConfigData,
      };
    }

    const currentContent = (configData as Config).items.current_content;

    // check if content hasn't expired
    if (new Date(currentContent.expires_at) > new Date()) {
      return {
        statusCode: 200,
        data: { id: currentContent.id },
      };
    }

    // When the content has expired get the next id
    const { data: dataNextId, error: errorNextId } = await client
      .from("content")
      .select("id")
      .gt("id", currentContent.id)
      .order("id", { ascending: true })
      .limit(1);

    if (errorNextId) {
      return {
        statusCode: 500,
        error: errorNextId,
      };
    }

    if (dataNextId.length) {
      const body = {
        items: {
          current_content: {
            id: dataNextId[0].id,
            expires_at: getTodayMidnight(),
          },
        },
      } as Config;

      const res = await fetch(`${config.public.apiBase}/api/config/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const { error: errorUpdateConfig } = await res.json();

      if (errorUpdateConfig) {
        return { statusCode: 500, error: errorUpdateConfig };
      }

      return {
        statusCode: 200,
        data: { id: dataNextId[0].id },
      };
    }

    // If there's no ID greater than current_id, get the first ID
    if (dataNextId.length === 0) {
      const { data: dataFirstId, error: errorFirstId } = await client
        .from("content")
        .select("id")
        .order("id", { ascending: true })
        .limit(1);

      if (errorFirstId) {
        return {
          statusCode: 500,
          error: errorFirstId,
        };
      }

      const body = {
        items: {
          current_content: {
            id: dataFirstId[0].id,
            expires_at: getTodayMidnight(),
          },
        },
      } as Config;

      const res = await fetch(`${config.public.apiBase}/api/config/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const { error: errorUpdateConfig } = await res.json();

      if (errorUpdateConfig) {
        return { statusCode: 500, error: errorUpdateConfig };
      }

      return {
        statusCode: 200,
        data: { id: dataFirstId[0].id },
      };
    }

    return {
      statusCode: 500,
    };
  },
);
