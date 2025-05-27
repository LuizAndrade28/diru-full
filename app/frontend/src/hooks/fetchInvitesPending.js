import { api } from "../utils/apiPath";

export async function fetchInvitesPending() {
  const r = await fetch(api("/invites/pending"), { credentials: "include" });
  if (!r.ok) throw await r.json();
  return r.json();
}
