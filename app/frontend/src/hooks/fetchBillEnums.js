import { api } from "../utils/apiPath";

export async function fetchBillEnums() {
  const r = await fetch(api("/meta/bill_enums"), { credentials: "include" });
  return r.json();
}
