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
 *    и вставьте целиком код ниже (весь файл, кроме этого шапки-комментария
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
 * 7. ВАЖНО ДЛЯ СКОРОСТИ: чтобы заявки на сайте отправлялись быстро,
 *    Telegram-уведомления отправляются не сразу внутри запроса с сайта,
 *    а отдельным фоновым заданием раз в минуту. Настройте это один раз:
 *      - Слева в редакторе Apps Script — значок часов "Triggers"
 *      - "+ Add Trigger"
 *      - Function to run: sendPendingTelegramNotifications
 *      - Event source: Time-driven
 *      - Type of time based trigger: Minutes timer
 *      - Every minute
 *      - Save
 *    Без этого шага заявки будут сохраняться и показываться в /admin,
 *    но в Telegram сообщения приходить не будут.
 *
 * Готово — заявки с сайта начнут прилетать в Telegram (с задержкой до
 * 1 минуты) и сохраняться в таблице, а страница /admin на сайте сможет
 * их читать (с кэшем на 30 секунд для более быстрой загрузки).
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

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ ok: false, error: "Некорректные данные" });
  }

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

  // Только запись в таблицу — без ожидания Telegram, поэтому ответ
  // сайту приходит быстро. Telegram отправится отдельно, по таймеру.
  sheet.appendRow([id, createdAt, name, "'" + phone, comment, itemsText, total, page, "new", "FALSE"]);

  // Кэш списка заявок устарел — очищаем, чтобы админка сразу увидела новую заявку
  CacheService.getScriptCache().remove("leads_json");

  return jsonResponse({ ok: true, id: id });
}

/**
 * Запускается по таймеру раз в минуту (см. пункт 7 инструкции выше).
 * Находит все заявки, по которым ещё не отправлено уведомление
 * в Telegram, и отправляет их одной пачкой.
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
    if (String(telegramSent) === "TRUE") continue;
    if (!row[0]) continue; // пустая строка

    const [, createdAt, name, phone, comment, itemsText, total] = row;
    const text =
      `🛍 Новая заявка с сайта\n\n` +
      `Имя: ${name}\n` +
      `Телефон: ${phone}\n` +
      (comment ? `Комментарий: ${comment}\n` : "") +
      `\nТовары:\n${itemsText || "—"}\n\n` +
      `Итого: ${total} ₸`;

    try {
      UrlFetchApp.fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify({ chat_id: chatId, text: text }),
        muteHttpExceptions: true,
      });
      sheet.getRange(i + 1, 10).setValue("TRUE"); // столбец J = telegramSent
    } catch (err) {
      // Попробуем снова через минуту на следующем запуске триггера
    }
  }
}

function doGet(e) {
  const props = PropertiesService.getScriptProperties();
  const login = e.parameter.login || "";
  const password = e.parameter.password || "";
  const mode = e.parameter.mode || "list";

  const adminLogin = props.getProperty("ADMIN_LOGIN");
  const adminPassword = props.getProperty("ADMIN_PASSWORD");

  if (!adminLogin || !adminPassword || login !== adminLogin || password !== adminPassword) {
    return jsonResponse({ ok: false, error: "Неверный логин или пароль" });
  }

  // Режим "auth" — только проверка логина/пароля, без чтения таблицы.
  // Используется для быстрого входа в админку; список заявок сайт
  // запрашивает отдельным вызовом (mode=list) уже после входа.
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
  const [, ...body] = rows; // первая строка — заголовки, пропускаем

  const leads = body
    .filter((r) => r[0]) // непустые строки
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
    .reverse(); // новые сверху

  // Кэшируем на 30 секунд — повторные заходы/обновления в админке
  // будут отдаваться мгновенно из кэша, а не читать таблицу заново.
  cache.put("leads_json", JSON.stringify(leads), 30);

  return jsonResponse({ ok: true, leads: leads });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
