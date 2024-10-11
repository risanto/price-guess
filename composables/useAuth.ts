import type { UserData } from "~/types/auth";

export function useAuth() {
  // Global state for user
  const user: Ref<UserData | null> = useState("user", () => null); // This creates a global state for 'user'

  // Method to log in user (dummy function, replace with your logic)
  const login = (userData: UserData) => {
    user.value = userData;
  };

  // Method to log out
  const logout = () => {
    user.value = null;
  };

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!user.value);

  return { user, login, logout, isAuthenticated };
}
