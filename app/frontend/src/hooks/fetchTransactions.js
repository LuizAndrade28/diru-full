export async function fetchTransactions() {
  const response = await fetch("/transactions.json?start=&end=", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return response.json();
}
