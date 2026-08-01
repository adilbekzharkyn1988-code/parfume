"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { submitOrder } from "@/lib/leads";
import { X, Trash2, Check } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, clearCart, total } = useCart();
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const resetAndClose = () => {
    closeCart();
    setTimeout(() => {
      setStep("cart");
      setStatus("idle");
      setName("");
      setPhone("");
      setComment("");
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const res = await submitOrder({
      name,
      phone,
      comment: comment || undefined,
      items: items.map((i) => ({
        name: i.name,
        brand: i.brand,
        volume: i.volume,
        qty: i.qty,
        price: i.price,
      })),
      total,
    });
    if (res.ok) {
      setStatus("sent");
      clearCart();
    } else {
      setStatus("error");
      setErrorMsg(res.error || "Не удалось отправить заявку");
    }
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
                  {items.map((item) => (
                    <li
                      key={item.slug + item.volume}
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
                        <p className="font-mono text-sm">{formatPrice(item.price * item.qty)}</p>
                        <button
                          onClick={() => removeItem(item.slug, item.volume)}
                          className="text-stone hover:text-wine transition-colors"
                          aria-label={`Убрать ${item.name} из корзины`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-ink/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-stone">Итого</span>
                  <span className="font-display text-2xl">{formatPrice(total)}</span>
                </div>
                <button
                  onClick={() => setStep("form")}
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
                className="w-full rounded-full px-5 py-3 bg-ivory-dim outline-none border border-transparent focus:border-wine/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-stone mb-1.5 block">Телефон</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                className="w-full rounded-full px-5 py-3 bg-ivory-dim outline-none border border-transparent focus:border-wine/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-stone mb-1.5 block">Комментарий (необязательно)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Удобное время для связи, пожелания к доставке"
                rows={3}
                className="w-full rounded-md px-5 py-3 bg-ivory-dim outline-none border border-transparent focus:border-wine/30 transition-colors resize-none"
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
