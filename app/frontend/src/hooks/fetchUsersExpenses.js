import { api } from "../utils/apiPath";

export async function fetchUsersExpenses() {
  const response = await fetch(api("/transactions/users_expenses"), {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return response.json();
}
