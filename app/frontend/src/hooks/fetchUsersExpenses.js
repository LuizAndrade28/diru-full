export async function fetchUsersExpenses() {
  const response = await fetch("/transactions/users_expenses", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return response.json();
}
