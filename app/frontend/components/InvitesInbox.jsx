import React, { useState } from "react";
import { getCSRFToken } from "../src/utils/csrf";
import { useTranslation } from "react-i18next";
import { api } from "../src/utils/apiPath"

export default function InvitesInbox({ invites, onRespond }) {
  const { t } = useTranslation();
  const [email, setEmail]   = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr]         = useState(null);

  /* ---- envia novo convite ---------------------------------------- */
  async function sendInvite(e) {
    e.preventDefault();
    if (!email) return;

    setSending(true); setErr(null);
    try {
      const r = await fetch(api("/invites"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCSRFToken(),
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ invite: { email } }),
      });
      if (!r.ok) throw await r.json();
      setEmail("");
      onRespond();            // recarrega convites  resumo
    } catch (e) {
      setErr(e.errors?.join(", ") || e.message);
    } finally {
      setSending(false);
    }
  }

  async function post(path) {
    await fetch(path, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
          .content,
      },
    });
    onRespond();
  }

  return (
    <>
      <form className="row g-2 mb-4" onSubmit={sendInvite}>
        <div className="col-auto flex-grow-1">
          <input
            type="email"
            className="form-control"
            placeholder={t("invites.email_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" disabled={sending}>
            {sending ? t("global.saving") : t("invites.send")}
          </button>
        </div>
      </form>

      {err && <div className="alert alert-danger">{err}</div>}

      {invites.length === 0 ? (
        <p className="text-muted">{t("invites.none")}</p>
      ) : (
        <ul className="list-group">
          {invites.map((inv) => (
            <li
              key={inv.id}
              className="list-group-item d-flex justify-content-between"
            >
              {inv.email} {" — "}{" "}
              <small className="text-muted">
                {t("invites.from")} {inv.invited_by.first_name}{" "}
                {" (" + inv.invited_by.email + ")"}{" "}
              </small>
              <span>
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => post(api(`/invites/${inv.id}/accept`))}
                >
                  Aceitar
                  {t("invites.accept")}
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => post(api(`/invites/${inv.id}/decline`))}
                >
                  Recusar
                  {t("invites.decline")}
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
