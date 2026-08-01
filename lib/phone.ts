/**
 * Маска телефона для формата +7 (XXX) XXX-XX-XX.
 * +7 всегда зафиксирован в начале, дальше можно ввести только цифры,
 * ровно 10 штук (код города/оператора + номер).
 */

export function formatPhoneInput(raw: string): string {
  // Оставляем только цифры, убираем всё остальное (буквы, лишние +, скобки и т.д.)
  let digits = raw.replace(/\D/g, "");

  // Если человек начал вводить с 8 или 7 — считаем это тем же кодом страны,
  // просто отбрасываем первую цифру, дальше работаем с "локальными" 10 цифрами.
  if (digits.startsWith("8") || digits.startsWith("7")) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10); // максимум 10 цифр после +7

  let result = "+7";
  if (digits.length > 0) result += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) result += `)`;
  if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;

  return result;
}

export function isPhoneComplete(formatted: string): boolean {
  const digits = formatted.replace(/\D/g, "");
  // "7" + 10 цифр номера = 11 цифр итого
  return digits.length === 11;
}
