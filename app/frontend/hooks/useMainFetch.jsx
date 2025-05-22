import { useEffect, useState } from "react";
import { fetchTransactions } from "./fetchTransactions";
import { fetchCurrentUser } from "./fetchCurrentUser";

export function useMainFetch() {
  const [summary, setSummary] = useState();

  useEffect(() => {
    async function loadData() {
      try {
        const transactions = await fetchTransactions();

        const total = transactions
          .filter((t) => t.notes !== "Salário mensal")
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const agrupado = transactions
          .filter((t) => t.kind === "expense")
          .reduce((acc, item) => {
            const banco = item.bank_name;
            const valor = parseFloat(item.amount);
            if (!acc[banco]) acc[banco] = 0;
            acc[banco] += valor;
            return acc;
          }, {});

        const higherBank = Object.keys(agrupado)
          .map((key) => ({ bank_name: key, total: agrupado[key] }))
          .reduce(
            (higher, value) => (value.total > higher.total ? value : higher),
            { bank_name: null, total: 0 }
          );

        // Busca o usuário logado
        const user = await fetchCurrentUser();
        const userName =
          user.first_name || user.name || user.email || "Usuário";

        setSummary({
          last: transactions.filter((t) => t.notes !== "Salário mensal"),
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

  return summary;
}
