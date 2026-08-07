"use client";

import { useState } from "react";
import { useCart, getUnitPrice } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { submitOrderInBackground, leadsEndpointConfigured } from "@/lib/leads";
import { formatPhoneInput, isPhoneComplete } from "@/lib/phone";
import { X, Trash2, Check, Heart } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, clearCart, total, setItemVolume, pendingCount } = useCart();
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7");
  const [phoneError, setPhoneError] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  // Позиции без выбранного объёма, на которые указали после неудачной
  // попытки оформить заказ — подсвечиваем их в списке.
  const [invalidSlugs, setInvalidSlugs] = useState<Set<string>>(new Set());

  const resetAndClose = () => {
    closeCart();
    setTimeout(() => {
      setStep("cart");
      setStatus("idle");
      setName("");
      setPhone("+7");
      setPhoneError("");
      setComment("");
      setInvalidSlugs(new Set());
    }, 300);
  };

  const handleProceedToForm = () => {
    const missing = items.filter((i) => i.volume === null);
    if (missing.length > 0) {
      setInvalidSlugs(new Set(missing.map((i) => i.slug)));
      return;
    }
    setInvalidSlugs(new Set());
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPhoneComplete(phone)) {
      setPhoneError("Введите номер полностью");
      return;
    }
    setPhoneError("");

    if (!leadsEndpointConfigured()) {
      setStatus("error");
      setErrorMsg("Приём заявок ещё не настроен.");
      return;
    }

    // Заявка уходит в фоне (см. submitOrderInBackground) — не ждём ответа
    // сервера, поэтому "Заявка отправлена" показывается сразу же.
    submitOrderInBackground({
      name,
      phone,
      comment: comment || undefined,
      items: items.map((i) => ({
        name: i.name,
        brand: i.brand,
        // К этому моменту оформление уже прошло проверку в handleProceedToForm,
        // так что позиций без объёма в корзине быть не может.
        volume: i.volume ?? "",
        qty: i.qty,
        price: getUnitPrice(i) ?? 0,
      })),
      total,
    });
    setStatus("sent");
    clearCart();
  };

  return (
    <>
      <div
        onClick={resetAndClose}
        className={`fixed inset-0 z-50 bg-ink/50 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-paper shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-ink/10">
          <h2 className="font-display text-xl">
            {step === "form" && status !== "sent" ? "Оформление заказа" : "Корзина"}
          </h2>
          <button onClick={resetAndClose} aria-label="Закрыть корзину">
            <X size={22} />
          </button>
        </div>

        {status === "sent" ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-6">
            <div className="w-14 h-14 rounded-full bg-wine/10 flex items-center justify-center text-wine">
              <Check size={26} />
            </div>
            <p className="font-display text-xl">Заявка отправлена</p>
            <p className="text-sm text-stone max-w-xs">
              Мы свяжемся с вами по телефону {phone} в ближайшее время, чтобы подтвердить заказ.
            </p>
            <button
              onClick={resetAndClose}
              className="mt-2 eyebrow rounded-full px-5 py-2.5 bg-ink text-ivory"
            >
              Готово
            </button>
          </div>
        ) : step === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-stone">
                  <p className="font-display text-lg text-ink">Пока пусто</p>
                  <p className="text-sm">Загляните в каталог — соберём аромат для настроения.</p>
                  <Link
                    href="/catalog"
                    onClick={closeCart}
                    className="mt-3 eyebrow rounded-full px-4 py-2.5 bg-ink text-ivory"
                  >
                    В каталог
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => {
                    const key = item.slug + (item.volume ?? "pending");
                    const isPending = item.volume === null;
                    const isInvalid = isPending && invalidSlugs.has(item.slug);

                    if (isPending) {
                      return (
                        <li
                          key={key}
                          className={`flex flex-col gap-2.5 pb-4 border-b border-ink/10 transition-colors ${
                            isInvalid ? "ring-1 ring-wine rounded-lg p-2.5 -m-2.5 bg-wine/[0.03]" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="eyebrow text-stone">{item.brand}</p>
                              <p className="font-display text-lg leading-tight">{item.name}</p>
                              <p className="text-xs flex items-center gap-1 mt-0.5 text-wine">
                                <Heart size={11} className="fill-wine" />
                                Из избранного · выберите объём
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.slug, item.volume)}
                              className="text-stone hover:text-wine transition-colors shrink-0"
                              aria-label={`Убрать ${item.name} из корзины`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            {(["5", "10"] as const).map((v) => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setItemVolume(item.slug, v)}
                                className="flex-1 rounded-full border border-ink/15 px-3 py-2 text-xs text-center hover:border-wine hover:text-wine transition-colors"
                              >
                                {v} мл · {formatPrice(v === "5" ? item.price5 : item.price10)}
                              </button>
                            ))}
                          </div>
                          {isInvalid && (
                            <p className="text-xs text-wine">Выберите объём, чтобы продолжить</p>
                          )}
                        </li>
                      );
                    }

                    const unitPrice = getUnitPrice(item) ?? 0;
                    return (
                      <li
                        key={key}
                        className="flex items-center justify-between gap-3 pb-4 border-b border-ink/10"
                      >
                        <div>
                          <p className="eyebrow text-stone">{item.brand}</p>
                          <p className="font-display text-lg leading-tight">{item.name}</p>
                          <p className="text-xs text-ink/60 mt-0.5">
                            {item.volume} мл · × {item.qty}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-mono text-sm">{formatPrice(unitPrice * item.qty)}</p>
                          <button
                            onClick={() => removeItem(item.slug, item.volume)}
                            className="text-stone hover:text-wine transition-colors"
                            aria-label={`Убрать ${item.name} из корзины`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-ink/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-stone">Итого</span>
                  <span className="font-display text-2xl">{formatPrice(total)}</span>
                </div>
                {pendingCount > 0 && (
                  <p className="text-xs text-wine text-center">
                    Выберите объём для позиций из избранного ({pendingCount}), чтобы оформить заказ
                  </p>
                )}
                <button
                  onClick={handleProceedToForm}
                  className="eyebrow w-full rounded-full py-3.5 bg-wine text-ivory hover:bg-wine-dark transition-colors"
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 py-5 gap-4 overflow-y-auto">
            <div>
              <label className="text-xs text-stone mb-1.5 block">Имя</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как к вам обращаться"
                className="w-full rounded-full px-5 py-3 bg-ivory-dim outline-none border border-ink/15 focus:border-wine transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-stone mb-1.5 block">Телефон</label>
              <input
                required
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhoneInput(e.target.value));
                  if (phoneError) setPhoneError("");
                }}
                onKeyDown={(e) => {
                  // Не даём стереть "+7" в начале
                  if (
                    (e.key === "Backspace" || e.key === "Delete") &&
                    phone.length <= 2
                  ) {
                    e.preventDefault();
                  }
                }}
                onBlur={() => {
                  if (phone !== "+7" && !isPhoneComplete(phone)) {
                    setPhoneError("Введите номер полностью");
                  }
                }}
                placeholder="+7 (___) ___-__-__"
                className={`w-full rounded-full px-5 py-3 bg-ivory-dim outline-none border transition-colors ${
                  phoneError ? "border-wine" : "border-ink/15 focus:border-wine"
                }`}
              />
              {phoneError && <p className="text-xs text-wine mt-1.5 ml-5">{phoneError}</p>}
            </div>
            <div>
              <label className="text-xs text-stone mb-1.5 block">Комментарий (необязательно)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Удобное время для связи, пожелания к доставке"
                rows={3}
                className="w-full rounded-md px-5 py-3 bg-ivory-dim outline-none border border-ink/15 focus:border-wine transition-colors resize-none"
              />
            </div>

            <div className="mt-auto pt-4 border-t border-ink/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-stone">Итого</span>
                <span className="font-display text-2xl">{formatPrice(total)}</span>
              </div>

              {status === "error" && (
                <p className="text-sm text-wine text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="eyebrow w-full rounded-full py-3.5 bg-wine text-ivory hover:bg-wine-dark transition-colors disabled:opacity-60"
              >
                {status === "sending" ? "Отправляем…" : "Подтвердить заказ"}
              </button>
              <button
                type="button"
                onClick={() => setStep("cart")}
                className="text-sm text-stone hover:text-ink transition-colors text-center"
              >
                Назад в корзину
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
}
