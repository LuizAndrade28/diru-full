export async function fetchUserAccount() {
  const response = await fetch("/account", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return response.json();
}
