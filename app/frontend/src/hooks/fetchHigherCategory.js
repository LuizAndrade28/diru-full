import { api } from "../utils/apiPath";

export async function fetchHigherCategory() {
  const response = await fetch(api("/transactions/higher_category"), {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return response.json();
}
