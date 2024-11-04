export default defineEventHandler((event) => {
  // Clear the HTTP-only cookie by setting it with an expired date
  setCookie(event, "sb:token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Set the expiration date to the past
  });

  setCookie(event, "sb:refresh_token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Set the expiration date to the past
  });

  return {
    message: "Logged out successfully",
  };
});
