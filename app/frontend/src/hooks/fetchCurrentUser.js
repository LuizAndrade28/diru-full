import { api } from "../utils/apiPath";

export async function fetchCurrentUser() {
  const response = await fetch(api("/me"), {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return response.json();
}
