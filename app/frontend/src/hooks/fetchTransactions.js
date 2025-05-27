import { api } from "../utils/apiPath";

export async function fetchTransactions() {
  const response = await fetch(api("/transactions.json?start=&end="), {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return response.json();
}
