import { api } from "../utils/apiPath";

export async function fetchTransactions(startDate, endDate) {
  // Se start e end existirem (e não forem strings vazias), adiciona query string.
  let path = "/transactions.json";
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
    throw new Error(`Erro ao buscar transações: ${response.status}`);
  }
  return response.json();
}
