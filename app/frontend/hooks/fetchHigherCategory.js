export async function fetchHigherCategory() {
  const response = await fetch("/transactions/higher_category", {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return response.json();
}
