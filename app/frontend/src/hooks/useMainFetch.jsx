import { useCallback, useEffect, useState } from "react";

import { fetchTransactions } from "./fetchTransactions";
import { fetchHigherCategory } from "./fetchHigherCategory";
import { fetchUsersExpenses } from "./fetchUsersExpenses";
import { fetchEnums } from "./fetchEnums";
import { fetchCurrentUser } from "./fetchCurrentUser";
import { fetchUserAccount } from "./fetchUserAccount";
import { fetchInvitesPending } from "./fetchInvitesPending";

export function useMainFetch(startDate, endDate) {
  const [summary, setSummary] = useState(null);

  const loadData = useCallback(async () => {
    const [
      { transactions, my_transactions },
      higherCategory,
      usersExpenses,
      enums,
      user,
      userAccount,
      invites,
    ] = await Promise.all([
      fetchTransactions(startDate, endDate), // Retorna { transactions, my_transactions }
      fetchHigherCategory(startDate, endDate), // agregação no backend
      fetchUsersExpenses(startDate, endDate), // agregação no backend
      fetchEnums(), // meta-dados
      fetchCurrentUser(), // { id, first_name, … }
      fetchUserAccount(), // { id, … }
      fetchInvitesPending(), // [{id,…}]
    ]);

    /* ---- cálculos no front ---- */
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

    setSummary({
      my_transactions,
      enums,
      user,
      userAccount,
      last: transactions.filter((t) => t.notes !== "Salário mensal"),
      totalMonth: total,
      higherBank,
      higherCategory,
      usersExpenses,
      invites,
    });
  }, [startDate, endDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { summary, refetch: loadData };
}
