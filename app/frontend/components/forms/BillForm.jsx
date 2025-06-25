import React, { useState } from "react";
import { getCSRFToken } from "../../src/utils/csrf";
import { useTranslation } from "react-i18next";
import { api } from "../../src/utils/apiPath";

export default function BillForm({ account, enums, onSuccess }) {
  const { t } = useTranslation();

  if (!enums) return <p>Carregando opções…</p>;

  const [form, setForm] = useState({
    amount: "",
    description: "",
    frequency: "monthly", // Default para mensal
    next_due_date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
    account_id: account,
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
      const res = await fetch(api("/bills"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCSRFToken(),
          Accept: "application/json",
        },
        body: JSON.stringify({ bill: form }),
        credentials: "include",
      });

      if (!res.ok) throw await res.json();

      const created = await res.json();
      onSuccess?.(created);
      setForm({
        amount: "",
        description: "",
        frequency: "monthly",
        next_due_date: new Date().toISOString().slice(0, 10),
        account_id: account,
      });
    } catch (err) {
      setError(err.errors ? err.errors.join(", ") : err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4">
      <h4 className="mb-3">{t("form.bills.new")}</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="col-sm-4">
        <label className="form-label">{t("form.bills.amount")}</label>
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
        <label className="form-label">{t("form.bills.description")}</label>
        <input
          type="text"
          name="description"
          className="form-control"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="col-sm-4">
        <label className="form-label">{t("form.bills.frequency")}</label>
        <select
          name="frequency"
          className="form-select"
          value={form.frequency}
          onChange={handleChange}
          required
        >
          <option value="single">{t("form.bills.frequency_options.single")}</option>
          <option value="weekly">{t("form.bills.frequency_options.weekly")}</option>
          <option value="monthly">{t("form.bills.frequency_options.monthly")}</option>
          <option value="yearly">{t("form.bills.frequency_options.yearly")}</option>
        </select>
      </div>

      <div className="col-sm-4">
        <label className="form-label">{t("form.bills.next_due_date")}</label>
        <input
          type="date"
          name="next_due_date"
          className="form-control"
          value={form.next_due_date}
          onChange={handleChange}
          required
        />
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
