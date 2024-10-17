export function useSupabase() {
  const { logout } = useAuth();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return { handleLogout };
}
