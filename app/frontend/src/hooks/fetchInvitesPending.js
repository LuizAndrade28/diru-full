export async function fetchInvitesPending() {
  const r = await fetch("/invites/pending", { credentials: "include" });
  if (!r.ok) throw await r.json();
  return r.json();
}
