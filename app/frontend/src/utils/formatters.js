import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Converte ISO "YYYY-MM-DD" ou qualquer string Date-fns-parseable
 * para "DD/MM/YYYY" no locale pt-BR.
 */
export function formatDatePtBR(dateString) {
  // parseISO garante que strings "YYYY-MM-DD" virem Date corretamente
  const date =
    typeof dateString === "string" ? parseISO(dateString) : dateString;
  return format(date, "dd/MM/yyyy", { locale: ptBR });
}
