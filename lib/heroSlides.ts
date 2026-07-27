// Слайды для слайдера на главной странице (компонент components/HeroSlider.tsx).
//
// КАК ДОБАВИТЬ СВОИ ФАЙЛЫ:
// 1. Положите фото/короткие видео в папку /public/slider/
//    (например: public/slider/slide-1.jpg, public/slider/slide-2.mp4)
// 2. Пропишите путь в поле "src" ниже — путь указывается от /public,
//    то есть файл public/slider/slide-1.jpg -> src: "/slider/slide-1.jpg"
// 3. Для видео используйте короткие ролики (mp4, до нескольких секунд,
//    без звука — они проигрываются в закольцованном режиме автоматически).
//    Можно также указать "poster" — кадр-заглушку, которая показывается
//    пока видео грузится.
// 4. buttonHref — куда ведёт кнопка на слайде (можно вести на /catalog,
//    /catalog/women, /catalog/men, /product/[slug], /articles/[slug] и т.д.)
//
// Пока реальных файлов нет — слайды используют цветную заглушку вместо
// фото/видео, чтобы слайдер оставался рабочим и его можно было увидеть.
// Как только положите файл по нужному пути, заглушка автоматически
// заменится на реальное изображение/видео.

export type HeroSlide = {
  id: string;
  type: "image" | "video";
  /** Путь к файлу в /public. Например: "/slider/slide-1.jpg" или "/slider/slide-2.mp4" */
  src: string;
  /** Кадр-заглушка для видео, пока оно грузится (необязательно). Путь в /public. */
  poster?: string;
  alt: string;
  eyebrow?: string;
  title: string;
  buttonText: string;
  buttonHref: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    type: "image",
    src: "/slider/slide-1.jpg", // TODO: заменить на реальное фото
    alt: "Нишевая парфюмерия — слайд 1",
    eyebrow: "Новая коллекция",
    title: "Ароматы, которые запоминаются",
    buttonText: "Смотреть каталог",
    buttonHref: "/catalog",
  },
  {
    id: "slide-2",
    type: "image",
    src: "/slider/slide-2.jpg", // TODO: заменить на реальное фото
    alt: "Нишевая парфюмерия — слайд 2",
    eyebrow: "Для неё",
    title: "Женская парфюмерия",
    buttonText: "Женские ароматы",
    buttonHref: "/catalog/women",
  },
  {
    id: "slide-3",
    type: "video",
    src: "/slider/slide-3.mp4", // TODO: заменить на короткое видео
    poster: "/slider/slide-3-poster.jpg", // TODO: заменить на кадр-заглушку
    alt: "Нишевая парфюмерия — слайд 3 (видео)",
    eyebrow: "Для него",
    title: "Мужская парфюмерия",
    buttonText: "Мужские ароматы",
    buttonHref: "/catalog/men",
  },
  {
    id: "slide-4",
    type: "image",
    src: "/slider/slide-4.jpg", // TODO: заменить на реальное фото
    alt: "Нишевая парфюмерия — слайд 4",
    eyebrow: "Хиты продаж",
    title: "Самые популярные ароматы",
    buttonText: "Хиты продаж",
    buttonHref: "/catalog",
  },
  {
    id: "slide-5",
    type: "video",
    src: "/slider/slide-5.mp4", // TODO: заменить на короткое видео
    poster: "/slider/slide-5-poster.jpg", // TODO: заменить на кадр-заглушку
    alt: "Нишевая парфюмерия — слайд 5 (видео)",
    eyebrow: "Журнал",
    title: "Гид по ароматам",
    buttonText: "Читать журнал",
    buttonHref: "/articles",
  },
];
