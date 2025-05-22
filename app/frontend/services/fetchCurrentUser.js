export async function fetchCurrentUser() {
  const response = await fetch("/me", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return response.json();
}
