import Link from "next/link";
import { AtSign, Send, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-ink mt-24 border-t border-line">
      <div className="container-x py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <p className="font-display text-2xl mb-3">JUPARFUME</p>
          <p className="text-sm text-ink/65 max-w-xs leading-relaxed">
            Оригинальная нишевая парфюмерия в объёмах 5 и 10 мл. Тестируйте
            ароматы без переплаты за полный флакон — доставка по всему Казахстану.
          </p>
          <div className="flex gap-4 mt-5 text-ink/60">
            <AtSign size={18} />
            <Send size={18} />
            <Mail size={18} />
          </div>
        </div>

        <div>
          <p className="eyebrow text-ink/60 mb-4">Каталог</p>
          <ul className="flex flex-col gap-2.5 text-sm text-ink/75">
            <li><Link href="/catalog">Все ароматы</Link></li>
            <li><Link href="/catalog/women">Женские</Link></li>
            <li><Link href="/catalog/men">Мужские</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink/60 mb-4">Компания</p>
          <ul className="flex flex-col gap-2.5 text-sm text-ink/75">
            <li><Link href="/articles">Журнал</Link></li>
            <li><Link href="/#story">О нас</Link></li>
            <li><Link href="/#faq">Доставка и оплата</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink/60 mb-4">Контакты</p>
          <ul className="flex flex-col gap-2.5 text-sm text-ink/75">
            <li>+7 (705) 686-86-94</li>
            <li>Алматы, Досмухамедова 52</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink/60">
          <p>© 2026 JUPARFUME.</p>
        </div>
      </div>
    </footer>
  );
}
