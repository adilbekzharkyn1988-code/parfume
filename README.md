# ORIGINE — прототип интернет-магазина парфюмерии

Next.js (App Router) + TypeScript + Tailwind CSS v4. Полностью статический
сайт (Next static export) — можно разместить на GitHub Pages, Vercel,
Netlify или любом статическом хостинге.

## Что внутри

- Главная страница-лендинг (`app/page.tsx`)
- Общий каталог `/catalog`, мужской `/catalog/men`, женский `/catalog/women`
- Страница товара `/product/[slug]` с выбором объёма 5/10 мл и пересчётом цены
- Журнал (статьи) `/articles` и `/articles/[slug]`
- Корзина (клиентское состояние, без бэкенда) — `context/CartContext.tsx`
- Все данные тестовые — `lib/data.ts`

## Как посмотреть локально

```bash
npm install
npm run dev
```

Открыть http://localhost:3000 — сайт с полной интерактивностью (горячая
перезагрузка, dev-режим).

Чтобы посмотреть именно ту версию, что будет выгружена на GitHub Pages
(статический экспорт):

```bash
npm run build
npx serve out
```

## Деплой на GitHub Pages

Сайт уже настроен на статический экспорт (`next.config.ts` →
`output: "export"`). Два варианта:

### Вариант А — репозиторий `<username>.github.io`
Ничего менять не нужно. Просто:
1. Создать репозиторий `username.github.io`
2. Запушить туда этот код в ветку `main`
3. В настройках репозитория → Pages → Source → выбрать "GitHub Actions"
   (workflow уже лежит в `.github/workflows/deploy.yml` и соберёт сайт
   автоматически при пуше)

### Вариант Б — обычный репозиторий (`username.github.io/repo-name`)
GitHub Pages в этом случае добавляет путь `/repo-name/` ко всем URL, поэтому
нужно раскомментировать 2 строки в `next.config.ts`:

```ts
const REPO = "/repo-name"; // ваше название репозитория

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: REPO,
  assetPrefix: REPO,
};
```

Без этого шага все ссылки на страницы, картинки и стили будут вести мимо
цели (получите 404 на всех внутренних страницах).

После этого — обычный пуш в `main`, workflow соберёт и выложит сайт
автоматически. Итоговый адрес: `https://username.github.io/repo-name/`.

## Важно перед продакшеном

Это прототип с тестовыми данными и без реального бэкенда:
- Корзина не сохраняется между перезагрузками страницы
- Кнопка "Оформить заказ" и форма подписки ничего никуда не отправляют
- Цены, товары, статьи, отзывы — вымышленные
