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

/**
 * "Выстрелил и забыл": отправляет заявку в фоне, НЕ дожидаясь ответа сервера.
 * Используется в форме заказа, чтобы сайт мог мгновенно показать
 * "Заявка отправлена", не дожидаясь ответа Apps Script (запись в таблицу
 * и отправка в Telegram при этом всё равно происходят — просто уже после
 * того, как пользователь увидел подтверждение).
 *
 * Приоритет — navigator.sendBeacon: браузер гарантированно попытается
 * отправить запрос, даже если пользователь тут же закроет вкладку или
 * перейдёт на другую страницу (обычный fetch без ожидания в этот момент
 * может быть прерван). Если sendBeacon недоступен или не принял запрос —
 * используется fetch с keepalive: true как запасной вариант.
 *
 * Возвращает true, если удалось хотя бы поставить запрос в очередь на
 * отправку (это НЕ подтверждение, что заявка дошла и записалась —
 * такой гарантии при fire-and-forget не бывает в принципе).
 */
export function submitOrderInBackground(order: OrderPayload): boolean {
  if (!ENDPOINT) return false;

  const payload = JSON.stringify({
    type: "order",
    ...order,
    page: order.page ?? (typeof window !== "undefined" ? window.location.href : ""),
    createdAt: new Date().toISOString(),
  });

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    try {
      const blob = new Blob([payload], { type: "text/plain;charset=utf-8" });
      const queued = navigator.sendBeacon(ENDPOINT, blob);
      if (queued) return true;
    } catch {
      // падаем ниже на fetch-фолбэк
    }
  }

  try {
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
    return true;
  } catch {
    return false;
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

/**
 * Только проверка логина/пароля — mode=auth в Apps Script не читает
 * таблицу с заявками, поэтому отвечает быстро. Используется для входа
 * в админку: пускаем внутрь сразу после проверки пароля, а список
 * заявок (может быть медленнее, особенно на холодном старте Apps Script)
 * подгружаем уже отдельным вызовом fetchLeads после того, как экран
 * логина сменился на панель.
 */
export async function verifyAdminLogin(
  login: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  if (!ENDPOINT) {
    return { ok: false, error: "NEXT_PUBLIC_LEADS_ENDPOINT не настроен." };
  }
  try {
    const url = new URL(ENDPOINT);
    url.searchParams.set("login", login);
    url.searchParams.set("password", password);
    url.searchParams.set("mode", "auth");
    const res = await fetch(url.toString(), { method: "GET" });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) {
      return { ok: false, error: data?.error || "Неверный логин или пароль." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Не удалось проверить логин. Проверьте соединение." };
  }
}

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
