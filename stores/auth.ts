// stores/authStore.js
import { defineStore } from "pinia";
import type { ApiResponse } from "~/types/api";
import type { UserProfile } from "~/types/auth";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const client = useSupabaseClient();
    const { showToast } = useToast();

    // Global user state
    const user = ref<UserProfile>();

    const fetchUser = async () => {
      const { data, error } = await $fetch<ApiResponse>("/api/auth/validate", {
        method: "GET",
        credentials: "include",
      });

      if (error) {
        console.error("fetchUser:", error);
        showToast(error.message, "danger");
      }

      user.value = data?.profile;
    };

    const logout = async () => {
      await client.auth.signOut();
      user.value = undefined;
      await $fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
    };

    const isAuthenticated = computed(() => !!user.value);

    return { user, logout, isAuthenticated, fetchUser };
  },
  {
    persist: {
      storage: import.meta.client ? sessionStorage : undefined,
    },
  },
);
