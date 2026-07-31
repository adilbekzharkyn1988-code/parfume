import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, FlaskConical, BadgeCheck, Gift, CreditCard } from "lucide-react";
import BestsellersGallery from "@/components/BestsellersGallery";
import TestimonialsGallery from "@/components/TestimonialsGallery";
import HeroDragGallery from "@/components/HeroDragGalleryClient";
import NotePyramid from "@/components/NotePyramid";
import BottleArt from "@/components/BottleArt";
import Image from "next/image";
import womenPhoto from "@/public/women.avif";
import menPhoto from "@/public/men.avif";
import NewsletterForm from "@/components/NewsletterForm";
import { fetchProducts, fetchArticles } from "@/contentful/data";

export default async function Home() {
  const allProducts = await fetchProducts();
  const best = allProducts.filter((p) => p.badge === "Хит продаж").slice(0, 8);
  const fresh = allProducts.filter((p) => p.badge === "Новинка").slice(0, 8);
  const featuredArticles = (await fetchArticles()).slice(0, 3);

  return (
    <main>
      {/* HERO — полноэкранный слайдер (3 фото), 100vh, без границ.
          Плавное растворение между слайдами + лёгкий Ken Burns —
          см. components/HeroBackgroundSlider.tsx.
          При загрузке контент появляется по очереди: фон -> заголовок -> описание -> кнопка. */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "80vh" }}
      >
        <div className="hero-bg-fade-in absolute inset-0">
          <HeroDragGallery />
        </div>

        {/* белый градиент снизу вверх, высота 150px */}
        <div
          className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-white to-transparent z-[5] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, #fff 0%, #fff 55%, rgba(255,255,255,.95) 70%, rgba(255,255,255,.6) 85%, transparent 100%)",
            }}
        />

        <div className="container-x relative z-10 h-full flex flex-col justify-end items-start py-8 gap-7">
          <div className="max-w-xl text-left">
            {/*<span
              style={{ fontSize: "0.52rem", animationDelay: "150ms" }}
              className="hero-fade-in inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 eyebrow text-ink/85 mb-7 bg-ink/5 backdrop-blur-sm"
            >
              <span className="text-gold">⚡</span> Доставка по Алматы день в день
            </span>*/}
            <h1
              style={{ animationDelay: "850ms" }}
              className="hero-fade-in font-display text-[2.5rem] leading-[1.08] sm:text-5xl md:text-[3.1rem] md:leading-[1.15] text-ink"
            >
              НИШЕВАЯ<br />И ЛЮКСОВАЯ<br />ПАРФЮМЕРИЯ
            </h1><br />
            <p
              style={{ animationDelay: "1700ms" }}
              className="hero-fade-in font-body text-[1rem] leading-[1.4] sm:text-[1.6rem] md:text-[2rem] text-gold"
            >
              БОЛЕЕ 100 ОРИГИНАЛЬНЫХ АРОМАТОВ
            </p>
          </div>

          <div
            style={{ animationDelay: "2550ms" }}
            className="hero-fade-in flex justify-start"
          >
            <Link
              href="/catalog"
              className="eyebrow rounded-[10px] px-6 py-4 bg-gold text-ink hover:bg-gold-soft transition-colors inline-flex items-center gap-2"
            >
              Перейти в каталог <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* FLOATING TRUST CARD 
        <div className="bg-white container-x relative z-10 pb-0 -mt-[50px] md:-mt-10">
  <div className="bg-white rounded-2xl border border-ink/10 shadow-[0_0_40px_rgba(28,23,18,0.08)] px-4 py-5 md:px-10 md:py-8 grid grid-cols-4 gap-3 md:gap-6">
    <div className="flex flex-col items-center gap-2 text-center">
      <BadgeCheck size={22} className="text-gold shrink-0" />
      <span className="text-[10px] sm:text-xs md:text-sm text-ink/75 leading-snug">Только оригиналы</span>
    </div>
    <div className="flex flex-col items-center gap-2 text-center">
      <FlaskConical size={22} className="text-gold shrink-0" />
      <span className="text-[10px] sm:text-xs md:text-sm text-ink/75 leading-snug">Распив от 5 мл</span>
    </div>
    <div className="flex flex-col items-center gap-2 text-center">
      <ShieldCheck size={22} className="text-gold shrink-0" />
      <span className="text-[10px] sm:text-xs md:text-sm text-ink/75 leading-snug">Более 100 ароматов</span>
    </div>
    <div className="flex flex-col items-center gap-2 text-center">
      <Truck size={22} className="text-gold shrink-0" />
      <span className="text-[10px] sm:text-xs md:text-sm text-ink/75 leading-snug">Доставка по РК</span>
    </div>
  </div>
</div>*/}
      </section>

      {/* POPULAR BRANDS 
      <section className="bg-ivory pt-10 pb-14 md:pt-14 md:pb-20">
        <div className="container-x">
          <p className="eyebrow text-center text-ink/60 mb-7">Популярные бренды</p>
        </div>
        <div className="brands-marquee">
          <div className="brands-marquee__track">
            {[0, 1].map((groupIndex) => (
              <div key={groupIndex} className="brands-marquee__group" aria-hidden={groupIndex === 1}>
                {[
                  "Tom Ford",
                  "Creed",
                  "Xerjoff",
                  "Kilian",
                  "Amouage",
                  "Nishane",
                  "Initio",
                  "Maison Crivelli",
                  "Marc-Antoine Barrois",
                  "Clive Christian",
                  "Louis Vuitton",
                  "Sospiro",
                  "Arabian Oud",
                  "Le Labo",
                  "Ex-Nihilo",
                  "Essential Parfums",
                  "Hormone Paris",
                  "Acqua Di Parma",
                  "Bvlgari",
                  "Roja",
                ].map((b, i) => (
                  <span
                    key={`${groupIndex}-${b}-${i}`}
                    className="font-display text-lg md:text-xl text-ink/70 tracking-wide shrink-0"
                    style={{ marginRight: "20px" }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* CATEGORY SPLIT 
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
      </section>*/}

      {/* BESTSELLERS */}
      <section className="bg-white container-x py-8 md:py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow text-wine mb-2">Выбор покупателей</p>
            <h2 className="font-display text-2xl md:text-3xl">Хиты <span className="font-display-accent">продаж</span></h2>
          </div>
          <Link href="/catalog" className="inline-flex items-center gap-2 eyebrow text-ink/70 hover:text-wine">
            Смотреть все <ArrowRight size={15} />
          </Link>
        </div>
        <BestsellersGallery products={best} />
      </section>

      {/* NEW ARRIVALS */}
      <section className="bg-white container-x py-8 md:py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow text-sage mb-2">Только что появились</p>
            <h2 className="font-display text-2xl md:text-3xl">Новинки</h2>
          </div>
          <Link href="/catalog" className="inline-flex items-center gap-2 eyebrow text-ink/70 hover:text-wine">
            Смотреть все <ArrowRight size={15} />
          </Link>
        </div>
        <BestsellersGallery products={fresh} />
      </section>

      {/* CATEGORIES */}
      <section className="bg-white container-x py-8 md:py-12">
        <div className="mb-8">
          <p className="eyebrow text-wine mb-2">Выбор по категориям</p>
          <h2 className="font-display text-2xl md:text-3xl">Категории</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-1 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-3 sm:gap-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/catalog/women"
            className="group relative shrink-0 snap-start w-[78%] sm:w-auto rounded-lg overflow-hidden bg-[#F5E3E8] h-56 sm:h-64 md:h-80 flex items-end p-5 md:p-7 shadow-[0_2px_14px_-6px_rgba(28,23,18,0.18)]"
          >
            <Image
              src={womenPhoto}
              alt="Женская парфюмерия"
              fill
              sizes="(min-width: 768px) 33vw, 78vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="relative z-10">
              <h3 className="font-display text-xl md:text-2xl text-ivory leading-tight">Женская парфюмерия</h3>
              <span className="inline-flex items-center gap-2 mt-3 eyebrow text-ivory group-hover:gap-3 transition-all">
                Смотреть каталог <ArrowRight size={15} />
              </span>
            </div>
          </Link>

          <Link
            href="/catalog/men"
            className="group relative shrink-0 snap-start w-[78%] sm:w-auto rounded-lg overflow-hidden bg-[#EFE6D6] h-56 sm:h-64 md:h-80 flex items-end p-5 md:p-7 shadow-[0_2px_14px_-6px_rgba(28,23,18,0.18)]"
          >
            <Image
              src={menPhoto}
              alt="Мужская парфюмерия"
              fill
              sizes="(min-width: 768px) 33vw, 78vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="relative z-10">
              <h3 className="font-display text-xl md:text-2xl text-ivory leading-tight">Мужская парфюмерия</h3>
              <span className="inline-flex items-center gap-2 mt-3 eyebrow text-ivory group-hover:gap-3 transition-all">
                Смотреть каталог <ArrowRight size={15} />
              </span>
            </div>
          </Link>

          <Link
            href="/catalog/sets"
            className="group relative shrink-0 snap-start w-[78%] sm:w-auto rounded-lg overflow-hidden bg-wine h-56 sm:h-64 md:h-80 flex items-end p-5 md:p-7 shadow-[0_2px_14px_-6px_rgba(28,23,18,0.18)]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <Gift
              size={64}
              strokeWidth={1}
              className="absolute top-5 right-5 text-ivory/25 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10">
              <h3 className="font-display text-xl md:text-2xl text-ivory leading-tight">Наборы</h3>
              <span className="inline-flex items-center gap-2 mt-3 eyebrow text-ivory group-hover:gap-3 transition-all">
                Смотреть каталог <ArrowRight size={15} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-ivory-dim py-8 md:py-12">
        <div className="container-x">
          <div className="mb-6 md:mb-8">
            <p className="eyebrow text-wine mb-2">Наши преимущества</p>
            <h2 className="font-display text-2xl md:text-3xl">Почему выбирают нас</h2>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-6 md:gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
              <BadgeCheck size={20} className="text-gold shrink-0 sm:size-6" />
              <span className="text-[10px] sm:text-sm md:text-base text-ink/80 leading-snug">Только оригинальные ароматы</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
              <FlaskConical size={20} className="text-gold shrink-0 sm:size-6" />
              <span className="text-[10px] sm:text-sm md:text-base text-ink/80 leading-snug">Распив от 5 мл</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
              <CreditCard size={20} className="text-gold shrink-0 sm:size-6" />
              <span className="text-[10px] sm:text-sm md:text-base text-ink/80 leading-snug">Удобная оплата</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
              <Truck size={20} className="text-gold shrink-0 sm:size-6" />
              <span className="text-[10px] sm:text-sm md:text-base text-ink/80 leading-snug">Доставка по РК</span>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white container-x py-8 md:py-12">
        <div className="mb-8">
          <p className="eyebrow text-wine mb-2">Нам доверяют</p>
          <h2 className="font-display text-2xl md:text-3xl">Отзывы <span className="font-display-accent">покупателей</span></h2>
        </div>
        <TestimonialsGallery />
      </section>

      {/* PYRAMID EXPLAINER */}
      <section className="bg-ivory-dim py-16 md:py-20">
        <div className="container-x grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow text-wine mb-2">Гид новичка</p>
            <h2 className="font-display text-2xl md:text-3xl mb-5">
              Как устроен <span className="font-display-accent">аромат</span>
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

      {/* STORY */}
      <section id="story" className="bg-white text-ink py-16 md:py-20 border-t border-line">
        <div className="container-x grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow text-wine mb-2">О нас</p>
            <h2 className="font-display text-2xl md:text-3xl mb-5">
              Парфюмерия без компромиссов и переплат
            </h2>
            <p className="text-ink/70 leading-relaxed mb-4">
              JUPARFUME — витрина независимых парфюмерных домов, которые редко
              попадают на полки крупных магазинов. Мы разливаем ароматы из
              проверенных оригинальных партий в объёмы 5 и 10 мл, чтобы
              находить свой аромат можно было без риска и без переплаты за
              флакон на всю жизнь.
            </p>
            <p className="text-ink/70 leading-relaxed">
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
      <section className="bg-white container-x py-16 md:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="eyebrow text-wine mb-2">Журнал JUPARFUME</p>
            <h2 className="font-display text-2xl md:text-3xl">Читать и разбираться</h2>
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
          <h2 className="font-display text-2xl md:text-3xl mb-10 text-center">
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
      <section className="bg-white container-x py-16 md:py-24">
        <div className="rounded-md bg-wine text-ivory px-8 py-14 md:py-16 text-center flex flex-col items-center">
          <p className="eyebrow text-gold-soft mb-3">Подписка</p>
          <h2 className="font-display text-2xl md:text-3xl max-w-lg">
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
