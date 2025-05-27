import { api } from "../utils/apiPath";

export async function fetchEnums() {
  const r = await fetch(api("/meta/enums"), { credentials: "include" });
  return r.json();
}
