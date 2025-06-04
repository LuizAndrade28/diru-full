import React, { useState, useEffect } from "react";
import "../src/styles/dashboard.scss";

import { useMainFetch } from "../src/hooks/useMainFetch";

import TransactionForm from "./forms/TransactionForm";
import InvitesInbox from "../components/InvitesInbox";
import Spinner from "../components/Spinner";

import { formatDatePtBR } from "../src/utils/formatters";
import { useTranslation } from "react-i18next";

export default function Dashboard({ user }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { summary, refetch } = useMainFetch(startDate, endDate);
  const { t } = useTranslation();
  const [tab, setTab] = useState("resume");

  /* enquanto não chegou → mostre loading  */
  if (!summary) return <Spinner />;

  const money = (amount) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);

  const { last: transactions } = summary;

  return (
    <div className="container mt-4">
      {/* Inputs para escolher as datas */}
      <label>
        Data de início:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>

      <label style={{ marginLeft: "1rem" }}>
        Data de fim:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>

      {/*
        Caso queira forçar manualmente a busca (por exemplo, um botão "Filtrar"),
        você pode chamar `refetch()` aqui. Exemplo:
      */}
      {/* <button onClick={() => refetch()}>Filtrar</button> */}

      {/* --------- NAV TABS ---------- */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "resume" ? "active" : ""}`}
            onClick={() => setTab("resume")}
          >
            {t("dashboard.resume")}
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "invites" ? "active" : ""}`}
            onClick={() => setTab("invites")}
          >
            {t("dashboard.invites")}
            {summary.invites.length > 0 && (
              <span className="badge bg-danger ms-1">
                {summary.invites.length}
              </span>
            )}
          </button>
        </li>
      </ul>

      {/* --------- PÁGINAS ---------- */}
      {tab === "resume" && (
        <>
          <TransactionForm
            account={summary.userAccount.id}
            enums={summary.enums}
            onSuccess={refetch}
          />

          <h1>Resumo do mês</h1>
          <h2>Olá, {summary.user.first_name}</h2>
          <p>Total de despesas: R$ {summary.totalMonth}</p>
          <p>
            Banco com mais gastos: {summary.higherBank.bank_name} -
            {money(summary.higherBank.total)}
          </p>
          <p>
            Categoria com mais gastos:{" "}
            {t(`categories.${summary.higherCategory.category}`)} -
            {money(summary.higherCategory.total)}
          </p>
          {summary.usersExpenses.map((expense) => (
            <p key={expense.user_id || expense.owner}>
              {expense.owner}: {money(expense.total)}
            </p>
          ))}
          <h2 className="mt-4">{t("dashboard.last_transactions")}</h2>
          <ul>
            {summary.last.map((transaction) => (
              <li key={transaction.id}>
                {transaction.notes} – {money(transaction.amount)} -{" "}
                {transaction.bank_name} -{" "}
                {t(`categories.${transaction.category}`)} -{" "}
                {formatDatePtBR(transaction.happened_at)} - {transaction.owner}
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "invites" && (
        <InvitesInbox
          invites={summary.invites}
          user={user}
          onRespond={refetch}
        />
      )}
    </div>
  );
}
