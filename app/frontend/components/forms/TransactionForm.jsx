import React, { useState } from "react";
import { getCSRFToken } from "../../src/utils/csrf";
import { useTranslation } from "react-i18next";
import { api } from "../../src/utils/apiPath"

export default function TransactionForm({ family, account, enums, onSuccess }) {
  const { t } = useTranslation();

  if (!enums) return <p>Carregando opções…</p>;

  const [form, setForm] = useState({
    amount: "",
    notes: "",
    owner: "",
    happened_at: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
    category: "",
    bank_name: "",
    kind: "",
    account_id: account
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (family) {
    var sortedFamily = [...family].sort((a, b) =>
      a.first_name.localeCompare(b.first_name, "pt-BR")
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(api("/transactions"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCSRFToken(),
          Accept: "application/json",
        },
        body: JSON.stringify({ transaction: form }),
        credentials: "include",
      });

      if (!res.ok) throw await res.json();

      const created = await res.json();
      onSuccess?.(created);
      setForm({ ...form, amount: "", notes: "", category: "", bank_name: "", kind: "", owner: "", happened_at: "" });
    } catch (err) {
      setError(err.errors ? err.errors.join(", ") : err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const isExpense = form.kind === "expense";
  // const isIncome = form.kind === "income";
  const isReversal = form.kind === "reversal";
  const isKind = !!form.kind;

  // Helper to sort object keys alphabetically
  const sortKeys = (obj) => Object.keys(obj).sort();

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4">
      <h4 className="mb-3">{t("transactions.new")}</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="col-sm-4">
        <label className="form-label">{t("transactions.kind")}</label>
        <select
          name="kind"
          className="form-select"
          value={form.kind}
          onChange={handleChange}
          required
        >
          <option value=""></option>
          {sortKeys(enums.kinds).map((key) => (
            <option key={key} value={key}>
              {t(`transactions.type.${key}`)}
            </option>
          ))}
        </select>
      </div>

      {isKind && (
        <>
          <div className="col-sm-4">
            <label className="form-label">{t("transactions.amount")}</label>
            <input
              type="number"
              step="0.01"
              min="0.00"
              name="amount"
              className="form-control"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-sm-8">
            <label className="form-label">{t("transactions.notes")}</label>
            <input
              type="text"
              name="notes"
              className="form-control"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-4">
            <label className="form-label">{t("transactions.date")}</label>
            <input
              type="date"
              name="happened_at"
              className="form-control"
              value={form.happened_at}
              onChange={handleChange}
              required
            />
          </div>
          {console.log(family)}
          {isExpense && (
            <div className="col-sm-4">
              <label className="form-label">{t("transactions.owner")}</label>
              <select
                name="owner"
                className="form-select"
                value={form.owner}
                onChange={handleChange}
                required
              >
              <option value=""></option>
              {sortedFamily &&
                sortedFamily.map((member) => (
                  <option key={member.id} value={member.name}>
                    {`${member.first_name}`}
                  </option>
              ))}
              </select>
            </div>
          )}

          {isExpense && (
            <div className="col-sm-4">
              <label className="form-label">
                {t("transactions.installments")}
              </label>
              <input
                type="number"
                name="installments"
                min="0"
                className="form-control"
                value={form.installments}
                onChange={handleChange}
              />
            </div>
          )}

          {(isExpense || isReversal) && (
            <div className="row g-3">
              <div className="col-sm-4">
                <label className="form-label">
                  {t("transactions.category")}
                </label>
                <select
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value=""></option>
                  {sortKeys(enums.categories).map((key) => (
                    <option key={key} value={key}>
                      {t(`categories.${key}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="col-sm-4">
            <label className="form-label">{t("transactions.bank")}</label>
            <select
              name="bank_name"
              className="form-select"
              value={form.bank_name}
              onChange={handleChange}
              required
            >
              <option value=""></option>
              {sortKeys(enums.bank_names).map((key) => (
                <option key={key} value={key}>
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={submitting}
          >
            {submitting ? t("form.global.saving") : t("form.global.save")}
          </button>
        </>
      )}
    </form>
  );
}
