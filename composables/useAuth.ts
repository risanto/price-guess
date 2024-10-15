import type { UserData } from "~/types/auth";

export function useAuth() {
  // Global state for user
  const user: Ref<UserData | null> = useState("user", () => {
    if (import.meta.client) {
      const storedUser = localStorage.getItem("user") as string;
      return JSON.parse(storedUser);
    }

    return null;
  });

  const saveUser = (userData: UserData) => {
    user.value = userData;

    if (import.meta.client) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    user.value = null;

    if (import.meta.client) {
      localStorage.removeItem("user");
    }
  };

  const isAuthenticated = computed(() => !!user.value);

  return { user, logout, isAuthenticated, saveUser };
}
