import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, FlaskConical, BadgeCheck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import NotePyramid from "@/components/NotePyramid";
import BottleArt from "@/components/BottleArt";
import Image from "next/image";
import womenPhoto from "@/public/women.avif";
import menPhoto from "@/public/men.avif";
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
      <section className="bg-ivory relative overflow-hidden">
        {/*
          ФОНОВОЕ ФОТО HERO — отдельно для мобильных и десктопа
          1. Положи два файла в /public:
             - public/hero-bg-mobile.jpg  (вертикальное/квадратное фото, тесный кроп)
             - public/hero-bg-desktop.jpg (широкое фото, панорамный кроп)
          2. object-position подбери под композицию каждого фото
        */}
        <Image
          src="public/hero-bg-mobile.jpg"
          alt=""
          fill
          priority
          className="block md:hidden object-cover object-top"
        />
        <Image
          src="public/hero-bg-desktop.jpg"
          alt=""
          fill
          priority
          className="hidden md:block object-cover object-right"
        />
        {/* градиент — снизу вверх на мобильном (текст внизу читаемее), слева направо на десктопе */}
        <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/80 to-ivory/20 md:bg-gradient-to-r md:from-ivory md:via-ivory/85 md:to-ivory/10" />

        <div className="container-x pt-14 pb-24 md:pt-20 md:pb-32 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 eyebrow text-ink/70 mb-7 bg-ivory/70 backdrop-blur-sm">
              <span className="text-gold">⚡</span> Доставка по Алматы день в день
            </span>
            <h1 className="font-display text-[2.5rem] leading-[1.08] sm:text-5xl md:text-[3.1rem] text-ink">
              Нишевая и люксовая
              <br />
              парфюмерия
              <br />
              <span className="text-gold">более 300 оригинальных</span>
              <br />
              <span className="text-gold">ароматов</span>
            </h1>
            <p className="mt-6 text-ink/65 text-base md:text-lg max-w-md leading-relaxed">
              Распив от 5 мл и полные флаконы. Доставка по Алматы день в день
              и по всему Казахстану.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/catalog"
                className="eyebrow rounded-full px-7 py-3.5 bg-ink text-ivory hover:bg-wine transition-colors inline-flex items-center gap-2"
              >
                Перейти в каталог <ArrowRight size={15} />
              </Link>
              <Link
                href="/catalog/men"
                className="eyebrow rounded-full px-7 py-3.5 border border-ink/20 text-ink/80 hover:border-gold hover:text-wine transition-colors bg-ivory/70 backdrop-blur-sm"
              >
                Мужская парфюмерия
              </Link>
            </div>
          </div>

          {/*
            Правая колонка пустая (фото уже видно через фон секции).
            Если захочешь вернуть SVG-флакон вместо/поверх фото — раскомментируй:
          */}
          {/* <div className="relative flex justify-center">
            <div className="absolute inset-0 rounded-full blur-3xl bg-gold/20 scale-90" aria-hidden />
            <BottleArt family="oriental" className="relative w-48 md:w-64 h-auto drop-shadow-xl" />
          </div> */}
        </div>

        {/* FLOATING TRUST CARD */}
        <div className="container-x relative z-10 md:-mt-10 pb-2">
          <div className="bg-paper rounded-2xl border border-ink/10 shadow-lg shadow-ink/5 px-6 py-7 md:px-10 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: BadgeCheck, text: "Только оригиналы" },
              { icon: FlaskConical, text: "Распив от 5 мл" },
              { icon: ShieldCheck, text: "Более 300 ароматов" },
              { icon: Truck, text: "Доставка по всему Казахстану" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col md:items-center gap-2 md:text-center">
                <Icon size={22} className="text-gold shrink-0" />
                <span className="text-xs md:text-sm text-ink/75 leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR BRANDS */}
      <section className="bg-ivory pb-14 md:pb-20">
        <div className="container-x">
          <p className="eyebrow text-center text-ink/50 mb-7">Популярные бренды</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:gap-x-14">
            {["Tom Ford", "Creed", "Xerjoff", "Byredo", "Kilian", "Amouage", "Nishane"].map((b) => (
              <span key={b} className="font-display text-lg md:text-xl text-ink/70 tracking-wide">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY SPLIT */}
      <section className="container-x py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/catalog/women"
            className="group relative rounded-md overflow-hidden bg-[#F5E3E8] h-72 md:h-96 flex items-end p-8"
          >
            <Image
              src={womenPhoto}
              alt="Женская парфюмерия"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="relative z-10">
              <p className="eyebrow text-ivory/85 mb-2">53 аромата</p>
              <h2 className="font-display text-3xl md:text-4xl text-ivory">Женская парфюмерия</h2>
              <span className="inline-flex items-center gap-2 mt-4 eyebrow text-ivory group-hover:gap-3 transition-all">
                Смотреть каталог <ArrowRight size={16} />
              </span>
            </div>
          </Link>

          <Link
            href="/catalog/men"
            className="group relative rounded-md overflow-hidden bg-[#EFE6D6] h-72 md:h-96 flex items-end p-8"
          >
            <Image
              src={menPhoto}
              alt="Мужская парфюмерия"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="relative z-10">
              <p className="eyebrow text-ivory/85 mb-2">62 аромата</p>
              <h2 className="font-display text-3xl md:text-4xl text-ivory">Мужская парфюмерия</h2>
              <span className="inline-flex items-center gap-2 mt-4 eyebrow text-ivory group-hover:gap-3 transition-all">
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
              JUPARFUME — витрина независимых парфюмерных домов, которые редко
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
            <p className="eyebrow text-wine mb-2">Журнал JUPARFUME</p>
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
                a: "По Алматы день в день, в Астану и другие крупные города — 1–2 дня в зависимости от службы доставки.",
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
