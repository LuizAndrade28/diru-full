import React, { useEffect, useState } from "react";

export default function AccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/accounts.json", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(setAccounts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <ul>
      {accounts.map((acc) => (
        <li key={acc.id}>
          {acc.name} – Saldo: {acc.current_balance}
        </li>
      ))}
    </ul>
  );
}
