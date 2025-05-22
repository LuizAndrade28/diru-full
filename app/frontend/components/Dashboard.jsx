import React, { useEffect, useState } from "react";
import "../styles/Dashboard.scss";
import { fetchTransactions } from "../services/fetchTransactions";
import { fetchCurrentUser } from "../services/fetchCurrentUser";

export default function Dashboard() {
  const [summary, setSummary] = useState();
  const converterAmount = (amount) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);

  useEffect(() => {
    async function loadData() {
      try {
        const transactions = await fetchTransactions();

        const total = transactions
          .filter((t) => t.notes !== "Salário mensal")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const agrupado = transactions
          .filter((t) => t.kind == "expense")
          .reduce((acc, item) => {
            const banco = item.bank_name;
            const valor = parseFloat(item.amount); // garantir que é número

            if (!acc[banco]) {
              acc[banco] = 0;
            }

            acc[banco] += valor;
            return acc;
          }, {})

        const higherBank = Object.keys(agrupado)
          .map((key) => ({ bank_name: key, total: agrupado[key] }))
          .reduce(
            (higher, value) => {
              return value.total > higher.total ? value : higher;
            },
              { bank_name: null, total: 0 }
          );

        // Pegue o userId da primeira transação (ajuste se necessário)
        const userId = transactions[0]?.user_id;
        let userName;
        if (userId) {
          const user = await fetchCurrentUser(userId);
          userName = user.first_name || "Usuário";
        }

        setSummary({
          last: transactions
                .filter((t) => t.notes !== "Salário mensal"),
          totalMonth: total,
          userName,
          higherBank,
        });
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

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
            {t.notes} – {converterAmount(t.amount)} - {t.bank_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
