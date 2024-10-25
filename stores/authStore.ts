import type { ApiResponse } from "~/types/api";
const { showToast } = useToast();

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async fetchUser() {
      const { data, error } = await useFetch<ApiResponse>(
        "/api/auth/validate",
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (error.value) {
        console.error("fetchUser:", error.value);
        showToast(error.value.message, "danger");
      }

      if (data.value) {
        const userData = data.value.data;
        this.user = userData;
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    },
  },
});
