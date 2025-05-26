export async function fetchEnums() {
  const r = await fetch("/meta/enums", { credentials: "include" });
  return r.json();
}
