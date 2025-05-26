import { useEffect, useState, useCallback } from "react";
import { fetchTransactions } from "./fetchTransactions";
import { fetchCurrentUser } from "./fetchCurrentUser";
import { fetchUserAccount } from "./fetchUserAccount";
import { fetchHigherCategory } from "./fetchHigherCategory"
import { fetchUsersExpenses } from "./fetchUsersExpenses"
import { fetchEnums } from "./fetchEnums";

export function useMainFetch() {
  const [summary, setSummary] = useState(null);

  const loadData = useCallback(async () => {
    const [
      transactions, higherCategory, usersExpenses, enums, user, userAccount
    ] = await Promise.all([
      fetchTransactions(),
      fetchHigherCategory(),
      fetchUsersExpenses(),
      fetchEnums(),
      fetchCurrentUser(),
      fetchUserAccount()
    ]);

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
      enums,
      last: transactions.filter((t) => t.notes !== "Salário mensal"),
      totalMonth: total,
      user,
      higherBank,
      higherCategory,
      usersExpenses,
      userAccount,
    });
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  return {summary, refetch: loadData};
}
