import React, { useState } from "react";
import { getCSRFToken } from "../../src/utils/csrf";
import { useTranslation } from "react-i18next";

export default function TransactionForm({ account, enums, onSuccess }) {
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/transactions", {
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
      setForm({ ...form, amount: "", notes: "" });
    } catch (err) {
      setError(err.errors ? err.errors.join(", ") : err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4">
      <h4 className="mb-3">{t("transactions.new")}</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="col-sm-4">
        <label className="form-label">{t("transactions.amount")}</label>
        <input
          type="number"
          step="0.01"
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

      <div className="col-sm-4">
        <label className="form-label">{t("transactions.owner")}</label>
        <input
          type="text"
          name="owner"
          className="form-control"
          value={form.owner}
          onChange={handleChange}
        />
      </div>

      <div className="col-sm-4">
        <label className="form-label">{t("transactions.installments")}</label>
        <input
          type="number"
          name="installments"
          className="form-control"
          value={form.installments}
          onChange={handleChange}
        />
      </div>

      <div className="row g-3">
        <div className="col-sm-4">
          <label className="form-label">{t("transactions.category")}</label>
          <select
            name="category"
            className="form-select"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value=""></option>
            {Object.keys(enums.categories).map((key) => (
              <option key={key} value={key}>
                {t(`categories.${key}`)}
              </option>
            ))}
          </select>
        </div>

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
            {Object.keys(enums.bank_names).map((key) => (
              <option key={key} value={key}>
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

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
            {Object.keys(enums.kinds).map((key) => (
              <option key={key} value={key}>
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary mt-3"
        disabled={submitting}
      >
        {submitting ? t("form.global.saving") : t("form.global.save")}
      </button>
    </form>
  );
}
