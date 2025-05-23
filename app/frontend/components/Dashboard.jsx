import React from "react";
import "../src/styles/dashboard.scss";
import { useMainFetch } from "../src/hooks/useMainFetch";
import { formatDatePtBR } from "../src/utils/formatters";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const summary = useMainFetch();
  const { t } = useTranslation();

  const converterAmount = (amount) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);

  /* enquanto não chegou → mostre loading  */
  if (!summary) return <p>Carregando…</p>;

  return (
    <div className="container mt-4">
      <h1>Resumo do mês</h1>
      <h2>Olá, {summary.userName}</h2>
      <p>Total de despesas: R$ {summary.totalMonth}</p>
      <p>
        Banco com mais gastos: {summary.higherBank.bank_name} -
        {converterAmount(summary.higherBank.total)}
      </p>
      <p>
        Categoria com mais gastos:{" "}
        {t(`categories.${summary.higherCategory.category}`)} -
        {converterAmount(summary.higherCategory.total)}
      </p>

      <h2 className="mt-4">Últimos gastos</h2>
      <ul>
        {summary.last.map((transaction) => (
          <li key={transaction.id}>
            {transaction.notes} – {converterAmount(transaction.amount)} -{" "}
            {transaction.bank_name} - {t(`categories.${transaction.category}`)}{" "}
            - {formatDatePtBR(transaction.happened_at)} - {transaction.owner}
          </li>
        ))}
      </ul>
    </div>
  );
}
