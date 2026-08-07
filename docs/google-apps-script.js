/**
 * ================================================================
 * ЭТОТ ФАЙЛ НЕ ЗАПУСКАЕТСЯ НА САЙТЕ. Его нужно вставить отдельно
 * в Google Apps Script (script.google.com) — это бесплатный сервер
 * от Google, который будет принимать заявки с сайта.
 * ================================================================
 *
 * НАСТРОЙКА (один раз, займёт ~10 минут):
 *
 * 1. Создайте новую Google Таблицу (sheets.google.com → пустая таблица).
 *    Назовите как удобно, например "JUPARFUME — заявки".
 *    В первой строке (заголовки) впишите:
 *    A1: id  B1: createdAt  C1: name  D1: phone  E1: comment
 *    F1: items  G1: total  H1: page  I1: status  J1: telegramSent
 *
 * 2. В этой таблице: Расширения → Apps Script.
 *    Откроется редактор кода — удалите всё, что там есть по умолчанию,
 *    и вставьте целиком код ниже (весь файл, кроме этой шапки-комментария
 *    можно оставить, он не мешает).
 *
 * 3. Создайте Telegram-бота (если ещё нет):
 *    - В Telegram напишите @BotFather → /newbot → следуйте инструкциям
 *    - Получите TELEGRAM_BOT_TOKEN (выглядит как 123456789:AAаа...)
 *    - Напишите вашему новому боту любое сообщение (просто "привет")
 *    - Откройте в браузере:
 *      https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
 *      Найдите там "chat":{"id": ЧИСЛО, ...} — это TELEGRAM_CHAT_ID
 *
 * 4. В редакторе Apps Script слева — значок шестерёнки "Project Settings" →
 *    внизу "Script Properties" → "Add script property" и добавьте:
 *      TELEGRAM_BOT_TOKEN = ваш токен бота
 *      TELEGRAM_CHAT_ID   = id чата/канала, куда слать заявки
 *      ADMIN_LOGIN        = придумайте логин для админки (например admin)
 *      ADMIN_PASSWORD     = придумайте надёжный пароль для админки
 *
 * 5. Наверху редактора: Deploy → New deployment → тип "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Нажмите Deploy, разрешите доступ (потребуется подтвердить, что это
 *    ваш собственный скрипт — Google покажет предупреждение "непроверено",
 *    это нормально, нажмите Advanced → перейти на сайт (unsafe)).
 *    Скопируйте выданный "Web app URL" — он выглядит как:
 *    https://script.google.com/macros/s/XXXXXXX/exec
 *
 * 6. Этот URL вставьте на сайте в .env.local (и в GitHub Secrets для
 *    билда) как:
 *      NEXT_PUBLIC_LEADS_ENDPOINT=https://script.google.com/macros/s/XXXXXXX/exec
 *
 * 7. TELEGRAM ТЕПЕРЬ ОТПРАВЛЯЕТСЯ МГНОВЕННО, прямо внутри запроса с сайта —
 *    отдельный триггер для этого больше не обязателен для скорости. Но
 *    полезно подстраховаться на случай, если в момент заявки Telegram
 *    будет недоступен (сеть/лимиты) — тогда уведомление "зависнет"
 *    непосланным (telegramSent = FALSE), и его нужно кому-то отправить
 *    позже. Настройте один раз резервный триггер:
 *      - Слева в редакторе Apps Script — значок часов "Triggers"
 *      - "+ Add Trigger"
 *      - Function to run: sendPendingTelegramNotifications
 *      - Event source: Time-driven
 *      - Type of time based trigger: Minutes timer
 *      - Every 5 minutes (чаще уже не нужно — это только страховка)
 *      - Save
 *    Если раньше у вас уже стоял триггер "каждую минуту" — можно оставить
 *    как есть, он не помешает, просто уже не критичен для скорости.
 *
 * Готово — заявки с сайта теперь прилетают в Telegram практически сразу
 * (за секунду-две — это время самого запроса к Telegram API), сохраняются
 * в таблице, а страница /admin на сайте сможет их читать (с кэшем на
 * 30 секунд для более быстрой загрузки).
 *
 * Если позже поменяете что-то в коде ниже — нужно снова:
 * Deploy → Manage deployments → редактировать (карандаш) → New version → Deploy.
 */

const SHEET_HEADERS = [
  "id",
  "createdAt",
  "name",
  "phone",
  "comment",
  "items",
  "total",
  "page",
  "status",
  "telegramSent",
];

/**
 * Google Таблицы автоматически превращают введённый текст "TRUE"/"FALSE"
 * в настоящее логическое значение (boolean), а не оставляют как текст.
 * Эта функция корректно понимает оба варианта — и boolean true,
 * и текстовые "TRUE"/"true" — чтобы сравнение не ломалось.
 */
function isTrueValue(v) {
  return v === true || String(v).toUpperCase() === "TRUE";
}

/**
 * ГЛАВНАЯ функция обработки POST-запросов.
 * ✅ ИСПРАВЛЕНО: сначала проверяем mode, потом type
 */
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ ok: false, error: "Некорректные данные" });
  }

  // ✅ Сначала проверяем mode (для auth и leads)
  if (data.mode === "auth") {
    return handleAuthPost(data);
  }
  if (data.mode === "leads") {
    return handleLeadsPost(data);
  }

  // ✅ Потом проверяем type (для обычных заявок товара)
  if (data.type === "order") {
    return handleOrderPost(data);
  }

  return jsonResponse({ ok: false, error: "Неизвестный тип запроса" });
}

/**
 * Обработка POST-запроса с новой заявкой товара
 */
function handleOrderPost(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  const id = Utilities.getUuid();
  const createdAt = data.createdAt || new Date().toISOString();
  const name = String(data.name || "").slice(0, 200);
  const phone = String(data.phone || "").slice(0, 50);
  const comment = String(data.comment || "").slice(0, 1000);
  const itemsText = Array.isArray(data.items)
    ? data.items
        .map((i) => `${i.name} (${i.brand}), ${i.volume} мл × ${i.qty} — ${i.price * i.qty} ₸`)
        .join("; ")
    : "";
  const total = Number(data.total || 0);
  const page = String(data.page || "").slice(0, 300);

  sheet.appendRow([id, createdAt, name, "'" + phone, comment, itemsText, total, page, "new", false]);

  CacheService.getScriptCache().remove("leads_json");

  // Отправляем именно эту заявку в Telegram сразу же, не дожидаясь
  // фонового триггера — так уведомление приходит за секунду-две,
  // а не за минуту (или больше, если триггер стоял реже).
  const sent = sendTelegramMessage({ name, phone, comment, itemsText, total });
  if (sent) {
    // Строка, которую мы только что дописали, — последняя в таблице.
    sheet.getRange(sheet.getLastRow(), 10).setValue(true);
  }
  // Если sent === false (Telegram недоступен/ошибка) — telegramSent
  // остаётся false, и запасной триггер sendPendingTelegramNotifications
  // подхватит и отправит эту заявку при следующем запуске.

  return jsonResponse({ ok: true, id: id });
}

/**
 * Обработка POST-запроса для проверки логина/пароля (mode: auth)
 */
function handleAuthPost(data) {
  const props = PropertiesService.getScriptProperties();
  const login = data.login || "";
  const password = data.password || "";

  const adminLogin = props.getProperty("ADMIN_LOGIN");
  const adminPassword = props.getProperty("ADMIN_PASSWORD");

  // ✅ Rate limit: максимум 3 попыток в минуту
  const cache = CacheService.getScriptCache();
  const rateLimitKey = "auth_attempts_" + login;
  const attempts = Number(cache.get(rateLimitKey) || 0);

  if (attempts >= 3) {
    return jsonResponse({ 
      ok: false, 
      error: "Слишком много попыток. Попробуйте через минуту." 
    });
  }

  if (!adminLogin || !adminPassword || login !== adminLogin || password !== adminPassword) {
    // Увеличиваем счётчик неудачных попыток
    cache.put(rateLimitKey, String(attempts + 1), 60);
    return jsonResponse({ ok: false, error: "Неверный логин или пароль" });
  }

  // Если пароль правильный — очищаем счётчик
  cache.remove(rateLimitKey);
  return jsonResponse({ ok: true });
}

/**
 * Обработка POST-запроса для получения списка заявок (mode: leads)
 */
function handleLeadsPost(data) {
  const props = PropertiesService.getScriptProperties();
  const login = data.login || "";
  const password = data.password || "";

  const adminLogin = props.getProperty("ADMIN_LOGIN");
  const adminPassword = props.getProperty("ADMIN_PASSWORD");

  if (!adminLogin || !adminPassword || login !== adminLogin || password !== adminPassword) {
    return jsonResponse({ ok: false, error: "Неверный логин или пароль" });
  }

  const cache = CacheService.getScriptCache();
  const cached = cache.get("leads_json");
  if (cached) {
    return jsonResponse({ ok: true, leads: JSON.parse(cached) });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const rows = sheet.getDataRange().getValues();
  const [, ...body] = rows;

  const leads = body
    .filter((r) => r[0])
    .map((r) => ({
      id: r[0],
      createdAt: r[1],
      name: r[2],
      phone: r[3],
      comment: r[4],
      items: r[5],
      total: r[6],
      page: r[7],
      status: r[8],
    }))
    .reverse();

  cache.put("leads_json", JSON.stringify(leads), 30);

  return jsonResponse({ ok: true, leads: leads });
}

/**
 * Отправляет одно уведомление в Telegram. Возвращает true, если Telegram
 * подтвердил доставку (ok:true в ответе API), иначе false.
 */
function sendTelegramMessage(lead) {
  const props = PropertiesService.getScriptProperties();
  const botToken = props.getProperty("TELEGRAM_BOT_TOKEN");
  const chatId = props.getProperty("TELEGRAM_CHAT_ID");
  if (!botToken || !chatId) return false;

  const text =
    `🛍 Новая заявка с сайта\n\n` +
    `Имя: ${lead.name}\n` +
    `Телефон: ${lead.phone}\n` +
    (lead.comment ? `Комментарий: ${lead.comment}\n` : "") +
    `\nТовары:\n${lead.itemsText || "—"}\n\n` +
    `Итого: ${lead.total} ₸`;

  try {
    const resp = UrlFetchApp.fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ chat_id: chatId, text: text }),
      muteHttpExceptions: true,
    });
    const json = JSON.parse(resp.getContentText());
    return json && json.ok === true;
  } catch (err) {
    return false;
  }
}

/**
 * РАЗОВАЯ функция — запустите её ОДИН РАЗ вручную (кнопка ▷ Run в редакторе,
 * выбрав в списке функций "markExistingAsSent"), если после добавления
 * колонки telegramSent бот вдруг разослал в Telegram старые заявки разом.
 */
function markExistingAsSent() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const range = sheet.getRange(2, 10, lastRow - 1, 1);
  const values = range.getValues().map(() => [true]);
  range.setValues(values);
}

/**
 * ЗАПАСНОЙ механизм — запускается по резервному триггеру (см. пункт 7
 * инструкции выше). Нужен только для заявок, которые не удалось отправить
 * в Telegram синхронно внутри handleOrderPost (например, была временная ошибка сети).
 * В обычной ситуации эта функция почти всегда не находит ничего для отправки.
 */
function sendPendingTelegramNotifications() {
  const props = PropertiesService.getScriptProperties();
  const botToken = props.getProperty("TELEGRAM_BOT_TOKEN");
  const chatId = props.getProperty("TELEGRAM_CHAT_ID");
  if (!botToken || !chatId) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const telegramSent = row[9];
    if (isTrueValue(telegramSent)) continue;
    if (!row[0]) continue;

    const [, , name, phone, comment, itemsText, total] = row;
    const sent = sendTelegramMessage({ name, phone, comment, itemsText, total });
    if (sent) {
      sheet.getRange(i + 1, 10).setValue(true);
    }
  }
}

/**
 * УСТАРЕВШИЙ: для обратной совместимости, если код ещё использует GET.
 * Рекомендуется переходить на POST (см. lib/leads.ts).
 */
function doGet(e) {
  const login = e.parameter.login || "";
  const password = e.parameter.password || "";
  const mode = e.parameter.mode || "list";

  const props = PropertiesService.getScriptProperties();
  const adminLogin = props.getProperty("ADMIN_LOGIN");
  const adminPassword = props.getProperty("ADMIN_PASSWORD");

  if (!adminLogin || !adminPassword || login !== adminLogin || password !== adminPassword) {
    return jsonResponse({ ok: false, error: "Неверный логин или пароль" });
  }

  if (mode === "auth") {
    return jsonResponse({ ok: true });
  }

  const cache = CacheService.getScriptCache();
  const cached = cache.get("leads_json");
  if (cached) {
    return jsonResponse({ ok: true, leads: JSON.parse(cached) });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const rows = sheet.getDataRange().getValues();
  const [, ...body] = rows;

  const leads = body
    .filter((r) => r[0])
    .map((r) => ({
      id: r[0],
      createdAt: r[1],
      name: r[2],
      phone: r[3],
      comment: r[4],
      items: r[5],
      total: r[6],
      page: r[7],
      status: r[8],
    }))
    .reverse();

  cache.put("leads_json", JSON.stringify(leads), 30);

  return jsonResponse({ ok: true, leads: leads });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
