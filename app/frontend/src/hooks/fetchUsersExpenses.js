import { api } from "../utils/apiPath";

export async function fetchUsersExpenses(startDate, endDate) {
  let path = "/transactions/users_expenses.json";
  if (startDate && endDate) {
    const qs = `start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(
      endDate
    )}`;
    path += `?${qs}`;
  }

  const response = await fetch(api(path), {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Erro ao buscar despesas por usuário: ${response.status}`);
  }
  return response.json();
}
