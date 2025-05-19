import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [summary, setSummary] = useState(); // começa undefined, não null

  useEffect(() => {
    fetch("/transactions.json?start=&end=", {
      credentials: "include",
      headers: { Accept: "application/json" }, // força JSON
    })
      .then((r) => r.json())
      .then((data) => {
        // 👉 substitua 1234 por uma soma real quando tiver o campo certo
        const total = data
          .filter((t) => t.notes !== "Salário mensal")
          .reduce((sum, t) => sum + Number(t.amount), 0);
        setSummary({ last: data.slice(0, 5), totalMonth: total });
      })
      .catch(console.error);
  }, []);

  /* enquanto não chegou → mostre loading  */
  if (!summary) return <p>Carregando…</p>;

  return (
    <div className="container mt-4">
      <h1>Resumo do mês</h1>
      <p>Total de despesas: R$ {summary.totalMonth}</p>

      <h2>Últimos gastos</h2>
      <ul>
        {summary.last
          .filter((t) => t.notes !== "Salário mensal")
          .map((t) => (
            <li key={t.id}>
              {t.notes} – R$ {t.amount}
            </li>
          ))}
      </ul>
    </div>
  );
}
