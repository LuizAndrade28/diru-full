import { useEffect, useState } from "react";
import { api } from "../utils/apiPath";

/**
 * Retornos possíveis
 *   undefined  → ainda carregando
 *   false      → requisição devolveu 401 (não logado)
 *   objeto     → usuário autenticado { id, first_name, … }
 */

export function useCurrentUser() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    fetch(api("/me"), {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(async (r) => {
        if (r.ok) return setUser(await r.json()); // logado
        if (r.status === 401) return setUser(false); // não logado
        throw new Error(`Erro ${r.status}`);
      })
      .catch((err) => {
        console.error(err);
        setUser(false); //  erro ⇒ trate como não logado
      });
  }, []);

  return user; // undefined | false | {…}
}

export function useUserFamily() {
  const [userFamily, setUserFamily] = useState([]);

  useEffect(() => {
    fetch(api("/family_members"), {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Request failed");

        const data = await response.json();
        setUserFamily(data);
      })
      .catch((error) => {
        // console.error(error);
        setUserFamily(false);
      });
  }, []);

  return userFamily;
}
