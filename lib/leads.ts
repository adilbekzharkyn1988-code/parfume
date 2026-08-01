/**
 * Отправка заявок (заказов) и чтение списка заявок для админки.
 *
 * Всё общение идёт с одним Google Apps Script Web App:
 * см. docs/google-apps-script.js — код, который нужно вставить
 * в script.google.com и опубликовать как Web App.
 *
 * URL этого Web App задаётся через переменную окружения
 * NEXT_PUBLIC_LEADS_ENDPOINT (см. .env.example). Пока переменная
 * не задана, форма заказа просто не будет ничего отправлять и
 * покажет понятную ошибку — сайт при этом не падает.
 */

export type OrderPayload = {
  name: string;
  phone: string;
  comment?: string;
  items: { name: string; brand: string; volume: string; qty: number; price: number }[];
  total: number;
  page?: string;
};

const ENDPOINT = process.env.NEXT_PUBLIC_LEADS_ENDPOINT || "";

export function leadsEndpointConfigured(): boolean {
  return ENDPOINT.length > 0;
}

export async function submitOrder(order: OrderPayload): Promise<{ ok: boolean; error?: string }> {
  if (!ENDPOINT) {
    return { ok: false, error: "Приём заявок ещё не настроен (нет NEXT_PUBLIC_LEADS_ENDPOINT)." };
  }
  try {
    // Content-Type: text/plain намеренно — так Apps Script Web App
    // принимает запрос без CORS preflight (OPTIONS), который он не поддерживает.
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        type: "order",
        ...order,
        page: order.page ?? (typeof window !== "undefined" ? window.location.href : ""),
        createdAt: new Date().toISOString(),
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      return { ok: false, error: data?.error || "Не удалось отправить заявку. Попробуйте ещё раз." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Не удалось отправить заявку. Проверьте соединение." };
  }
}

export type LeadRecord = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  comment?: string;
  items: string;
  total: number;
  page?: string;
  status?: string;
};

export async function fetchLeads(
  login: string,
  password: string
): Promise<{ ok: boolean; leads?: LeadRecord[]; error?: string }> {
  if (!ENDPOINT) {
    return { ok: false, error: "NEXT_PUBLIC_LEADS_ENDPOINT не настроен." };
  }
  try {
    const url = new URL(ENDPOINT);
    url.searchParams.set("login", login);
    url.searchParams.set("password", password);
    const res = await fetch(url.toString(), { method: "GET" });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      return { ok: false, error: data?.error || "Не удалось получить заявки." };
    }
    return { ok: true, leads: data.leads as LeadRecord[] };
  } catch {
    return { ok: false, error: "Не удалось получить заявки. Проверьте соединение." };
  }
}
