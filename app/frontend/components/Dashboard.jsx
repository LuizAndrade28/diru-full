import React from "react";
import "../styles/dashboard.scss";
import { useMainFetch } from "../hooks/useMainFetch";

export default function Dashboard() {
  const summary = useMainFetch();

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

      <h2>Últimos gastos</h2>
      <ul>
        {summary.last.map((t) => (
          <li key={t.id}>
            {t.notes} – {converterAmount(t.amount)} - {t.bank_name} - {t.category_id}
          </li>
        ))}
      </ul>
    </div>
  );
}
