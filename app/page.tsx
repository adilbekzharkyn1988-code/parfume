import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, FlaskConical, BadgeCheck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import NotePyramid from "@/components/NotePyramid";
import BottleArt from "@/components/BottleArt";
import NewsletterForm from "@/components/NewsletterForm";
import { fetchProducts, fetchArticles } from "@/contentful/data";

export default async function Home() {
  const allProducts = await fetchProducts();
  const best = allProducts.filter((p) => p.badge === "Хит продаж").slice(0, 4);
  const fresh = allProducts.filter((p) => p.badge === "Новинка").slice(0, 3);
  const featuredArticles = (await fetchArticles()).slice(0, 3);

  return (
    <main>
      {/* HERO */}
      <section className="bg-ink text-ivory relative overflow-hidden">
        <div className="container-x py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <p className="eyebrow text-gold-soft mb-5">Оригинальная парфюмерия · 5 и 10 мл</p>
            <h1 className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl md:text-[3.6rem]">
              Найдите свой
              <br />
              <span className="italic text-gold-soft">аромат-подпись</span>
            </h1>
            <p className="mt-6 text-ivory/70 text-base md:text-lg max-w-md leading-relaxed">
              Нишевая парфюмерия в удобных объёмах: попробуйте за 5 мл или
              берите сразу 10 — без переплаты за полноразмерный флакон и без
              риска ошибиться с выбором.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/catalog/women"
                className="eyebrow rounded-full px-6 py-3.5 bg-ivory text-ink hover:bg-gold-soft transition-colors"
              >
                Женская парфюмерия
              </Link>
              <Link
                href="/catalog/men"
                className="eyebrow rounded-full px-6 py-3.5 border border-ivory/30 hover:border-gold-soft hover:text-gold-soft transition-colors"
              >
                Мужская парфюмерия
              </Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <dt className="font-display text-2xl">100%</dt>
                <dd className="text-xs text-ivory/55 mt-1">оригинал, батч-код на флаконе</dd>
              </div>
              <div>
                <dt className="font-display text-2xl">12</dt>
                <dd className="text-xs text-ivory/55 mt-1">ароматов в каталоге</dd>
              </div>
              <div>
                <dt className="font-display text-2xl">1–2 дня</dt>
                <dd className="text-xs text-ivory/55 mt-1">доставка по крупным городам</dd>
              </div>
            </dl>
          </div>

          <div className="relative hidden md:flex justify-center">
            <div className="absolute inset-0 rounded-full blur-3xl bg-wine/25 scale-90" aria-hidden />
            <div className="relative w-64 rounded-md border border-ivory/15 bg-ink-soft/60 backdrop-blur p-5">
              <p className="eyebrow text-ivory/50 mb-4 text-center">Ароматическая пирамида</p>
              <div className="flex flex-col items-center gap-3">
                <div className="w-[92%] rounded-sm bg-gold/15 border border-gold/30 py-3 text-center">
                  <p className="eyebrow text-gold-soft">верх</p>
                </div>
                <div className="w-[70%] rounded-sm bg-wine/25 border border-wine/40 py-3 text-center">
                  <p className="eyebrow text-ivory/80">сердце</p>
                </div>
                <div className="w-[48%] rounded-sm bg-sage/30 border border-sage/50 py-3 text-center">
                  <p className="eyebrow text-ivory/80">база</p>
                </div>
              </div>
              <p className="text-[11px] text-ivory/45 mt-4 text-center leading-relaxed">
                Каждый аромат раскрывается в три этапа — и живёт на коже до 24 часов
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-ivory-dim border-b border-ink/10">
        <div className="container-x py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: BadgeCheck, text: "Проверенные партии и батч-коды" },
            { icon: FlaskConical, text: "Объёмы 5 и 10 мл на выбор" },
            { icon: Truck, text: "Доставка СДЭК и Почтой России" },
            { icon: ShieldCheck, text: "Возврат в течение 14 дней" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon size={20} className="text-wine shrink-0" />
              <span className="text-xs md:text-sm text-ink/75 leading-snug">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY SPLIT */}
      <section className="container-x py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/catalog/women"
            className="group relative rounded-md overflow-hidden bg-[#F5E3E8] h-72 md:h-96 flex items-end p-8"
          >
            <BottleArt family="floral" className="absolute right-4 top-4 w-32 md:w-40 opacity-90 group-hover:scale-105 transition-transform" />
            <div className="relative z-10">
              <p className="eyebrow text-[#7A3C4C] mb-2">5 ароматов</p>
              <h2 className="font-display text-3xl md:text-4xl text-ink">Женская парфюмерия</h2>
              <span className="inline-flex items-center gap-2 mt-4 eyebrow text-ink group-hover:gap-3 transition-all">
                Смотреть каталог <ArrowRight size={16} />
              </span>
            </div>
          </Link>

          <Link
            href="/catalog/men"
            className="group relative rounded-md overflow-hidden bg-[#EFE6D6] h-72 md:h-96 flex items-end p-8"
          >
            <BottleArt family="woody" className="absolute right-4 top-4 w-32 md:w-40 opacity-90 group-hover:scale-105 transition-transform" />
            <div className="relative z-10">
              <p className="eyebrow text-[#5C4726] mb-2">5 ароматов</p>
              <h2 className="font-display text-3xl md:text-4xl text-ink">Мужская парфюмерия</h2>
              <span className="inline-flex items-center gap-2 mt-4 eyebrow text-ink group-hover:gap-3 transition-all">
                Смотреть каталог <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="container-x py-8 md:py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow text-wine mb-2">Выбор покупателей</p>
            <h2 className="font-display text-3xl md:text-4xl">Хиты продаж</h2>
          </div>
          <Link href="/catalog" className="hidden sm:inline-flex items-center gap-2 eyebrow text-ink/70 hover:text-wine">
            Весь каталог <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {best.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* PYRAMID EXPLAINER */}
      <section className="bg-ivory-dim py-16 md:py-20 mt-8">
        <div className="container-x grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow text-wine mb-2">Гид новичка</p>
            <h2 className="font-display text-3xl md:text-4xl mb-5">
              Как устроен аромат
            </h2>
            <p className="text-ink/70 leading-relaxed mb-4">
              Любой сложный парфюм раскрывается поэтапно: верхние ноты вы
              чувствуете в первые минуты, сердце — определяет характер
              аромата, а база остаётся на коже дольше всего. Поэтому мы
              подробно указываем все три уровня для каждого аромата в
              каталоге.
            </p>
            <Link
              href="/articles/aromaticheskaya-piramida"
              className="inline-flex items-center gap-2 eyebrow text-wine hover:gap-3 transition-all"
            >
              Читать гид по нотам <ArrowRight size={15} />
            </Link>
          </div>
          <div className="bg-paper rounded-md border border-ink/10 p-6 md:p-8">
            <NotePyramid
              notes={{
                top: ["бергамот", "розовый перец"],
                heart: ["роза", "жасмин"],
                base: ["амбра", "мускус", "кедр"],
              }}
            />
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-x py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow text-sage mb-2">Только что появились</p>
            <h2 className="font-display text-3xl md:text-4xl">Новинки</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {fresh.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="bg-ink text-ivory py-16 md:py-20">
        <div className="container-x grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow text-gold-soft mb-2">О нас</p>
            <h2 className="font-display text-3xl md:text-4xl mb-5">
              Парфюмерия без компромиссов и переплат
            </h2>
            <p className="text-ivory/70 leading-relaxed mb-4">
              ORIGINE — витрина независимых парфюмерных домов, которые редко
              попадают на полки крупных магазинов. Мы разливаем ароматы из
              проверенных оригинальных партий в объёмы 5 и 10 мл, чтобы
              находить свой аромат можно было без риска и без переплаты за
              флакон на всю жизнь.
            </p>
            <p className="text-ivory/70 leading-relaxed">
              Каждая партия сопровождается батч-кодом, а на странице аромата
              мы честно показываем полную пирамиду нот — без маркетинговых
              обещаний, которые не подтверждаются на коже.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(["oriental", "citrus", "gourmand", "musky"] as const).map((f) => (
              <div key={f} className="rounded-md overflow-hidden aspect-square">
                <BottleArt family={f} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNAL PREVIEW */}
      <section className="container-x py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow text-wine mb-2">Журнал ORIGINE</p>
            <h2 className="font-display text-3xl md:text-4xl">Читать и разбираться</h2>
          </div>
          <Link href="/articles" className="hidden sm:inline-flex items-center gap-2 eyebrow text-ink/70 hover:text-wine">
            Все статьи <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className="group flex flex-col rounded-md border border-ink/10 overflow-hidden bg-paper"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <BottleArt family={a.cover} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <p className="eyebrow text-stone mb-2">{a.category} · {a.readTime}</p>
                <h3 className="font-display text-xl leading-snug group-hover:text-wine transition-colors">
                  {a.title}
                </h3>
                <p className="text-sm text-ink/65 mt-2 line-clamp-2">{a.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-ivory-dim py-16 md:py-20">
        <div className="container-x max-w-3xl">
          <p className="eyebrow text-wine mb-2 text-center">Вопросы и ответы</p>
          <h2 className="font-display text-3xl md:text-4xl mb-10 text-center">
            Доставка, оплата, оригинальность
          </h2>
          <div className="flex flex-col gap-3">
            {[
              {
                q: "Это точно оригинал, а не переливка неизвестного качества?",
                a: "Мы разливаем ароматы напрямую из оригинальных флаконов проверенных партий с действующим батч-кодом. Информацию о партии можно запросить у поддержки перед покупкой.",
              },
              {
                q: "В чём разница между 5 мл и 10 мл кроме цены?",
                a: "Разницы в составе нет — это один и тот же аромат из одной партии. 10 мл выгоднее в пересчёте на миллилитр и подходит тем, кто уже определился с выбором.",
              },
              {
                q: "Как быстро приходит заказ?",
                a: "В Москву и Санкт-Петербург — 1–2 дня, в другие города России — 3–7 дней в зависимости от службы доставки.",
              },
              {
                q: "Можно вернуть аромат, если не подошёл?",
                a: "Да, в течение 14 дней при сохранении оригинальной упаковки и не более 2–3 пробных нанесений — это стандартные условия для парфюмерии.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-md border border-ink/10 bg-paper px-5 py-4 open:pb-4"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-display text-lg">
                  {item.q}
                  <span className="shrink-0 text-stone transition-transform group-open:rotate-45 font-mono text-xl">+</span>
                </summary>
                <p className="text-sm text-ink/70 mt-3 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-x py-16 md:py-24">
        <div className="rounded-md bg-wine text-ivory px-8 py-14 md:py-16 text-center flex flex-col items-center">
          <p className="eyebrow text-gold-soft mb-3">Подписка</p>
          <h2 className="font-display text-3xl md:text-4xl max-w-lg">
            Получайте гид по ароматам и доступ к новинкам первыми
          </h2>
          <NewsletterForm />
          <p className="text-[11px] text-ivory/55 mt-4">
            Прототип: форма ничего не отправляет
          </p>
        </div>
      </section>
    </main>
  );
}
