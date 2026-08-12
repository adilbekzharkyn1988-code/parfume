"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

// CartDrawer подключён во всех страницах через layout.tsx, но реально
// нужен пользователю только после клика на корзину — до этого момента
// его JS незачем грузить вместе с остальным сайтом. ssr: false, т.к.
// компонент завязан на клиентское состояние корзины и на сервере
// рендерить его нет смысла.
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: false,
});

// Важно: сам CartDrawer никогда не возвращает null (он всегда в DOM,
// просто скрыт через CSS — так работает анимация выезжания). Поэтому
// одной обёртки dynamic() недостаточно: React смонтирует компонент
// сразу при первом рендере страницы, и его JS-чанк всё равно
// подгрузится в момент гидратации, а не по клику.
//
// Здесь компонент вообще не рендерится, пока корзину не открыли
// хотя бы раз (hasOpened === false) — это и есть настоящий триггер
// подгрузки по клику. После первого открытия он остаётся смонтированным
// навсегда, чтобы анимация закрытия и повторные открытия работали без
// повторного запроса за файлом.
export default function CartDrawerClient() {
  const { isOpen } = useCart();
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  if (!hasOpened) return null;
  return <CartDrawer />;
}
