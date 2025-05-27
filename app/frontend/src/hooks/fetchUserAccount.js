import { api } from "../utils/apiPath";

export async function fetchUserAccount() {
  const response = await fetch(api("/account"), {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return response.json();
}
