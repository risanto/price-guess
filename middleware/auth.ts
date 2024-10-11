export default defineNuxtRouteMiddleware((to, _) => {
  const { isAuthenticated } = useAuth(); // Replace with your auth logic

  // If user is not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated.value && to.meta.requiresAuth) {
    return navigateTo("/login");
  }

  // If user is authenticated and trying to access non-auth pages like login or signup, redirect to home
  if (
    isAuthenticated.value &&
    (to.path === "/login" || to.path === "/signup")
  ) {
    return navigateTo("/");
  }
});
