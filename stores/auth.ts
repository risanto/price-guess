// stores/authStore.js
import { defineStore } from "pinia";
import type { ApiResponse } from "~/types/api";
import type { UserProfile } from "~/types/auth";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const client = useSupabaseClient();

    // Global states
    const user = ref<UserProfile>();
    const userPoints = ref(0);

    const fetchUser = async () => {
      const { data, error }: { data?: { profile: UserProfile }; error?: any } =
        await $fetch<ApiResponse>("/api/auth/validate", {
          method: "GET",
          credentials: "include",
        });

      if (error) {
        console.error("fetchUser:", error);
      }

      user.value = data?.profile;
      userPoints.value = data?.profile?.points ?? 0;

      console.log("userPoints.value ===>", userPoints.value);
    };

    const logout = async () => {
      await client.auth.signOut();
      user.value = undefined;
      await $fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    };

    const userPointsFn = {
      save: (points: number) => {
        const expiryDate = new Date();
        expiryDate.setHours(23, 59, 59, 999); // Set to midnight of today
        expiryDate.setDate(expiryDate.getDate() + 1); // Move to next day

        const encryptedData = encryptUserPoints(points, expiryDate);

        if (import.meta.client) {
          localStorage.setItem("userPoints", encryptedData);
        }
        userPoints.value = points;
      },

      load: () => {
        // Detect if the user is authenticated and set points
        if (isAuthenticated) {
          userPoints.value = user?.value?.points ?? 0;
        } else {
          const encrypted = localStorage.getItem("nonUserPoints");
          const decrypted = encrypted ? decryptUserPoints(encrypted) : null;

          if (decrypted) {
            userPoints.value = decrypted;
          }
        }
      },
    };

    const isAuthenticated = computed(() => !!user.value);

    return {
      user,
      logout,
      isAuthenticated,
      fetchUser,
      userPoints,
      userPointsFn,
    };
  },
  {
    persist: {
      storage: import.meta.client ? sessionStorage : undefined,
    },
  },
);
