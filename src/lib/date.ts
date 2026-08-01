import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(iso: string): string {
  return format(new Date(iso), 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

/** monthlyTrend keys come from the backend as "YYYY-MM" (e.g. "2026-03"). */
export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return format(date, 'MMM/yy', { locale: ptBR });
}
