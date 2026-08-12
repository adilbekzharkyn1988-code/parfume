"use client";

import dynamic from "next/dynamic";

// CartDrawer подключён во всех страницах через layout.tsx, но реально
// нужен пользователю только после клика на корзину — до этого момента
// его JS незачем грузить вместе с остальным сайтом. ssr: false, т.к.
// компонент завязан на клиентское состояние корзины (localStorage/контекст)
// и на сервере рендерить его нет смысла.
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), {
  ssr: false,
});

export default CartDrawer;
