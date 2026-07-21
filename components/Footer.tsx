import Link from "next/link";
import { AtSign, Send, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory mt-24">
      <div className="container-x py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <p className="font-display text-2xl mb-3">ORIGINE</p>
          <p className="text-sm text-ivory/65 max-w-xs leading-relaxed">
            Оригинальная нишевая парфюмерия в объёмах 5 и 10 мл. Тестируйте
            ароматы без переплаты за полный флакон — доставка по всей России.
          </p>
          <div className="flex gap-4 mt-5 text-ivory/70">
            <AtSign size={18} />
            <Send size={18} />
            <Mail size={18} />
          </div>
        </div>

        <div>
          <p className="eyebrow text-ivory/50 mb-4">Каталог</p>
          <ul className="flex flex-col gap-2.5 text-sm text-ivory/80">
            <li><Link href="/catalog">Все ароматы</Link></li>
            <li><Link href="/catalog/women">Женские</Link></li>
            <li><Link href="/catalog/men">Мужские</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ivory/50 mb-4">Компания</p>
          <ul className="flex flex-col gap-2.5 text-sm text-ivory/80">
            <li><Link href="/articles">Журнал</Link></li>
            <li><Link href="/#story">О нас</Link></li>
            <li><Link href="/#faq">Доставка и оплата</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ivory/50 mb-4">Контакты</p>
          <ul className="flex flex-col gap-2.5 text-sm text-ivory/80">
            <li>+7 (999) 123-45-67</li>
            <li>hello@origine.example</li>
            <li>Москва, Малая Ордынка 12</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line-light">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ivory/45">
          <p>© 2026 ORIGINE. Сайт-прототип, наполнен тестовыми данными.</p>
          <p>Оригинальная парфюмерия · 100% проверенные партии</p>
        </div>
      </div>
    </footer>
  );
}
