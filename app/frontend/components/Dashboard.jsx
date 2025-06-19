import React, { useState, useEffect } from "react";
import "../src/styles/dashboard.scss";

import { useMainFetch } from "../src/hooks/useMainFetch";
import { useUserFamily } from "../src/hooks/auth";

import TransactionForm from "./forms/TransactionForm";
import BillForm from "./forms/BillForm";
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

  let family;

  if (user && user.family_id != null) {
    family = useUserFamily();
  }

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
            {t("dashboard.family_and_invites")}
            {summary.invites.length > 0 && (
              <span className="badge bg-danger ms-1">
                {summary.invites.length}
              </span>
            )}
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "form" ? "active" : ""}`}
            onClick={() => setTab("form")}
          >
            {t("dashboard.add_transaction")}
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "bills" ? "active" : ""}`}
            onClick={() => setTab("bills")}
          >
            Adicionar conta
          </button>
        </li>
      </ul>

      {/* --------- PÁGINAS ---------- */}
      {tab === "invites" && (
        <InvitesInbox
          invites={summary.invites}
          user={user}
          onRespond={refetch}
          family={family}
        />
      )}

      {tab === "form" && (
        <TransactionForm
          account={summary.userAccount.id}
          enums={summary.enums}
          onSuccess={refetch}
          family={family}
        />
      )}

      {tab === "bills" && (
        <BillForm
          account={summary.userAccount.id}
          enums={summary.billEnums}
          onSuccess={refetch}
        />
      )}

      {tab === "resume" && (
        <>
          {/* Inputs para escolher as datas */}
          <div className="d-flex justify-content-end">
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
          </div>

          {/*
            Caso queira forçar manualmente a busca (por exemplo, um botão "Filtrar"),
            você pode chamar `refetch()` aqui. Exemplo:
          */}
          {/* <button onClick={() => refetch()}>Filtrar</button> */}
          <h1>Resumo do mês</h1>
          <h2>Olá, {summary.user.first_name}</h2>
          <p>Total de despesas: {money(summary.totalMonth)}</p>
          <p>
            Banco com mais gastos: {t(`banks.${summary.higherBank.bank_name}`)}{" "}
            -{money(summary.higherBank.total)}
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
          <div className="d-flex gap-2 mt-3">
            <div className="w-50 border p-3">
              <h2 className="mt-4">Minhas Transações</h2>
              <ul>
                {summary.my_transactions.map((my_transaction) => (
                  <li key={my_transaction.id}>
                    {my_transaction.notes} – {money(my_transaction.amount)} -{" "}
                    {t(`banks.${my_transaction.bank_name}`)} -{" "}
                    {t(`categories.${my_transaction.category}`)} -{" "}
                    {formatDatePtBR(my_transaction.happened_at)} -{" "}
                    {my_transaction.owner} -{" "}
                    {my_transaction.installment_number &&
                      my_transaction.installment_total && (
                        <>
                          {" "}
                          - Parcela {my_transaction.installment_number}/
                          {my_transaction.installment_total}
                        </>
                      )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-50 border p-3">
              <h2 className="mt-4">Transações da Família</h2>
              <ul>
                {summary.last.map((transaction) => (
                  <li key={transaction.id}>
                    {transaction.notes} – {money(transaction.amount)} -{" "}
                    {t(`banks.${transaction.bank_name}`)} -{" "}
                    {t(`categories.${transaction.category}`)} -{" "}
                    {formatDatePtBR(transaction.happened_at)} -{" "}
                    {transaction.owner} -{" "}
                    {transaction.installment_number &&
                      transaction.installment_total && (
                        <>
                          {" "}
                          - Parcela {transaction.installment_number}/
                          {transaction.installment_total}
                        </>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
