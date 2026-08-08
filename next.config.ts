import type { NextConfig } from "next";

// ВАЖНО: следующие 4 старых параметра были нужны только для GitHub Pages
// (там нельзя было включить серверный рендеринг Next.js, поэтому сайт
// собирался статически и жил в подпапке /parfume):
//   output: "export"
//   basePath: BASE_PATH
//   assetPrefix: BASE_PATH
// На Vercel это всё не нужно — сайт живёт в корне своего домена и
// собирается штатно. Если понадобится вернуться на GitHub Pages —
// эти 3 строки можно вернуть обратно.
//
// trailingSlash: true оставлен как есть — так формируются все
// внутренние ссылки в проекте (canonical, sitemap и т.д.), менять не
// нужно, иначе появятся дубли адресов со слэшем и без.

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,

  // 301-редиректы со старого сайта (Tilda, juparfume.kz) на новую
  // структуру адресов. Список собран из выгрузки Google Search Console
  // (Индексирование → Страницы → Проиндексировано, 08.08.2026) —
  // это все адреса, которые реально были в индексе Google на момент
  // переезда. Каждый обязательно "permanent: true" (301), чтобы Google
  // передал вес и историю со старого адреса на новый, а не просто узнал
  // о переезде.
  //
  // Несколько замечаний по конкретным строкам:
  //  - Один и тот же товар на старом сайте был доступен сразу по
  //    нескольким адресам (Tilda дублировала товар под /catalog/,
  //    /brands/<бренд>/, и без префикса) — все варианты редиректим на
  //    один и тот же новый /product/<slug>/, это нормально.
  //  - Адреса из /nabory/... — это наборы (бандлы из 2 ароматов).
  //    Прямого аналога пока нет (раздел "Наборы" на новом сайте —
  //    заглушка "скоро"), поэтому редиректим на /catalog/sets/.
  //    Когда наберётся контент под наборы — эти строки стоит
  //    пересмотреть и, по возможности, развести по конкретным товарам.
  //  - /tpost/... — старые статьи блога. Прямых аналогов на новом
  //    сайте нет (кроме статьи про бренд Bvlgari — она ведёт на
  //    /brand/bvlgari/), остальные — на общий /articles/.
  //  - /o-nas, /podbor-aromata, /parfumy-na-rabotu,
  //    /parfumy-na-meropriyatiye, /parfumy-na-kajdiy-den — старые
  //    информационные лендинги без точных аналогов, ведут на ближайшую
  //    по смыслу страницу (главную/каталог/подбор).
  redirects: async () => [
  { source: "/catalog/tproduct/431692774574-maison-crivelli-hibiscus-mahajat", destination: "/product/maison-crivelli-hibiscus-mahajat/", permanent: true },
  { source: "/nabory/tproduct/537744714884-blue-talisman-creed-aventus-absolu-", destination: "/catalog/sets/", permanent: true },
  { source: "/catalog/tproduct/360204787284-roja-burlington", destination: "/product/roja-burlington/", permanent: true },
  { source: "/catalog/tproduct/369048410314-louis-vuitton-imagination", destination: "/product/louis-vuitton-imagination/", permanent: true },
  { source: "/nabory/tproduct/833676386114-hfc-devils-intrigue-pdm-valaya-", destination: "/catalog/sets/", permanent: true },
  { source: "/catalog/tproduct/638713991064-amouage-portrayal-man", destination: "/product/amouage-portrayal-man/", permanent: true },
  { source: "/catalog/tproduct/520152275814-creed-aventus", destination: "/product/creed-aventus/", permanent: true },
  { source: "/tpost/xnavg72cr1-nishevaya-parfyumeriya-vs-mass-lyuks", destination: "/articles/", permanent: true },
  { source: "/catalog/tproduct/434129751544-clive-christian-hedonistic", destination: "/product/clive-christian-hedonistic/", permanent: true },
  { source: "/catalog/tproduct/516372784354-xerjoff-naxos", destination: "/product/xerjoff-naxos/", permanent: true },
  { source: "/catalog/tproduct/587676384074-nishane-hacivat", destination: "/product/nishane-hacivat/", permanent: true },
  { source: "/nabory/tproduct/892619617704-amouage-guidance-46-hfc-devils-intrigue-", destination: "/catalog/sets/", permanent: true },
  { source: "/catalog/tproduct/415260929424-marc-antoine-barrois-aldebaran", destination: "/product/marc-antoine-barrois-aldebaran/", permanent: true },
  { source: "/catalog/tproduct/961784625344-clive-christian-matsukita", destination: "/product/clive-christian-matsukita/", permanent: true },
  { source: "/nabory/tproduct/660872036524-clive-red-tea-vetiver-clive-christian-to", destination: "/catalog/sets/", permanent: true },
  { source: "/nabory/tproduct/952021282554-creed-aventus-absolu-roja-bulington-1819", destination: "/catalog/sets/", permanent: true },
  { source: "/catalog/tproduct/618868412784-louis-vuitton-limmensit", destination: "/product/louis-vuitton-l-immensit/", permanent: true },
  { source: "/catalog/tproduct/587565845524-louis-vuitton-symphony", destination: "/product/louis-vuitton-symphony/", permanent: true },
  { source: "/catalog/tproduct/611459994914-hormone-paris-testosterone", destination: "/product/hormone-paris-testosterone/", permanent: true },
  { source: "/catalog/tproduct/437596614144-essential-parfums-bois-imperial", destination: "/product/essential-parfums-bois-imperial/", permanent: true },
  { source: "/catalog/tproduct/549939269974-initio-narcotic-delight", destination: "/product/initio-narcotic-delight/", permanent: true },
  { source: "/catalog/tproduct/673515461334-kilian-angels-share", destination: "/product/kilian-angels-share/", permanent: true },
  { source: "/catalog/tproduct/780957397274-hormone-paris-gaba", destination: "/product/hormone-paris-gaba/", permanent: true },
  { source: "/catalog/tproduct/603395714834-roja-oceania", destination: "/product/roja-oceania/", permanent: true },
  { source: "/catalog/tproduct/191663326874-miss-dior-blooming-bouquet", destination: "/product/miss-dior-blooming-bouquet/", permanent: true },
  { source: "/catalog/tproduct/881348093684-parfums-de-marly-valaya", destination: "/product/parfums-de-marly-valaya/", permanent: true },
  { source: "/catalog/tproduct/586699636054-kilian-good-girl-gone-bad", destination: "/product/kilian-good-girl-gone-bad/", permanent: true },
  { source: "/catalog/tproduct/604102639154-initio-side-effect", destination: "/product/initio-side-effect/", permanent: true },
  { source: "/catalog/tproduct/716330314284-creed-aventus-absolu", destination: "/product/creed-aventus-absolu/", permanent: true },
  { source: "/catalog/tproduct/533834725294-roja-elysium", destination: "/product/roja-elysium/", permanent: true },
  { source: "/catalog/tproduct/597207605904-ex-nihilo-the-hedonist", destination: "/product/ex-nihilo-the-hedonist/", permanent: true },
  { source: "/catalog/tproduct/978740396554-initio-oud-for-greatness", destination: "/product/initio-oud-for-greatness/", permanent: true },
  { source: "/nabory/tproduct/929887968554-bvlgary-tygar-louis-vuitton-imagination-", destination: "/catalog/sets/", permanent: true },
  { source: "/nabory", destination: "/catalog/sets/", permanent: true },
  { source: "/catalog/tproduct/274462730144-herms-terre-dherms", destination: "/product/herm-s-terre-d-herm-s/", permanent: true },
  { source: "/catalog/tproduct/879822560784-boadicea-the-victorious-hanuman", destination: "/product/boadicea-the-victorious-hanuman/", permanent: true },
  { source: "/catalog/tproduct/169759724344-kilian-smoking-hot", destination: "/product/kilian-smoking-hot/", permanent: true },
  { source: "/catalog/tproduct/588082298834-ex-nihilo-blue-talisman-extrait", destination: "/product/ex-nihilo-blue-talisman-extrait/", permanent: true },
  { source: "/catalog/tproduct/537371642924-louis-vuitton-afternoon-swim", destination: "/product/louis-vuitton-afternoon-swim/", permanent: true },
  { source: "/catalog/tproduct/199828392574-tom-ford-ombre-leather", destination: "/product/tom-ford-ombre-leather/", permanent: true },
  { source: "/catalog/tproduct/332248744274-parfums-de-marly-althar", destination: "/product/parfums-de-marly-altha-r/", permanent: true },
  { source: "/nabory/tproduct/313704355484-sospiro-vibrato-creed-aventus-absolu-", destination: "/catalog/sets/", permanent: true },
  { source: "/tpost/dt7rplbp71-kak-podobrat-aromat", destination: "/articles/", permanent: true },
  { source: "/brands/parfums-de-marly", destination: "/brand/parfums-de-marly/", permanent: true },
  { source: "/catalog/tproduct/771998020484-initio-psychodelic-love", destination: "/product/initio-psychodelic-love/", permanent: true },
  { source: "/catalog/tproduct/558921124884-clive-christian-red-tea-vetiver", destination: "/product/clive-christian-red-tea-vetiver/", permanent: true },
  { source: "/catalog/tproduct/320066053474-parfums-de-marly-sedley", destination: "/product/parfums-de-marly-sedley/", permanent: true },
  { source: "/catalog/tproduct/875199448844-creed-silver-mountain-water", destination: "/product/creed-silver-mountain-water/", permanent: true },
  { source: "/catalog/tproduct/284954109754-chopard-vetiver", destination: "/product/chopard-vetiver/", permanent: true },
  { source: "/catalog/tproduct/372762574994-marc-antoine-barrois-ganymede", destination: "/product/marc-antoine-barrois-ganymede/", permanent: true },
  { source: "/catalog/tproduct/491784349674-clive-christian-crab-apple-blossom", destination: "/product/clive-christian-crab-apple-blossom/", permanent: true },
  { source: "/catalog/tproduct/781007631854-clive-christian-1872", destination: "/product/clive-christian-1872/", permanent: true },
  { source: "/catalog", destination: "/catalog/", permanent: true },
  { source: "/brands/bvlgari", destination: "/brand/bvlgari/", permanent: true },
  { source: "/brands/maison-crivelli", destination: "/brand/maison-crivelli/", permanent: true },
  { source: "/catalog/tproduct/919780913334-louis-vuitton-meteore", destination: "/product/louis-vuitton-meteore/", permanent: true },
  { source: "/zhenskaya-parfyumeriya", destination: "/catalog/women/", permanent: true },
  { source: "/brands/kilian", destination: "/brand/kilian/", permanent: true },
  { source: "/brands/creed", destination: "/brand/creed/", permanent: true },
  { source: "/parfumy-na-meropriyatiye", destination: "/catalog/", permanent: true },
  { source: "/tpost/u4kctffo61-bvlgari", destination: "/brand/bvlgari/", permanent: true },
  { source: "/catalog/tproduct/492224489374-parfums-de-marly-haltane", destination: "/product/parfums-de-marly-haltane/", permanent: true },
  { source: "/catalog/tproduct/127474165304-clive-christian-blonde-amber", destination: "/product/clive-christian-blonde-amber/", permanent: true },
  { source: "/parfumy-na-rabotu", destination: "/catalog/", permanent: true },
  { source: "/muzhskaya-parfyumeriya", destination: "/catalog/men/", permanent: true },
  { source: "/catalog/tproduct/344301570204-al-fareed-arabian-oud", destination: "/product/al-fareed-arabian-oud/", permanent: true },
  { source: "/nabory/tproduct/490855066224-kilian-good-girl-gone-bad-pdm-valaya-", destination: "/catalog/sets/", permanent: true },
  { source: "/brands/initio", destination: "/brand/initio/", permanent: true },
  { source: "/catalog/tproduct/676259766554-hfc-devils-intrigue", destination: "/product/hfc-devil-s-intrigue/", permanent: true },
  { source: "/catalog/tproduct/904806134794-xerjoff-torino-21", destination: "/product/xerjoff-torino-21/", permanent: true },
  { source: "/catalog/tproduct/480323684104-initio-musk-therapy", destination: "/product/initio-musk-therapy/", permanent: true },
  { source: "/catalog/tproduct/253905857194-marc-antoine-barrois-tilia", destination: "/product/marc-antoine-barrois-tilia/", permanent: true },
  { source: "/catalog/tproduct/984071947194-maison-crivelli-oud-maracuja", destination: "/product/maison-crivelli-oud-maracuja/", permanent: true },
  { source: "/catalog/tproduct/465783125814-sultani-arabian-oud", destination: "/product/sultani-arabian-oud/", permanent: true },
  { source: "/catalog/tproduct/115198176594-roja-apex", destination: "/product/roja-apex/", permanent: true },
  { source: "/brands/clive-christian", destination: "/brand/clive-christian/", permanent: true },
  { source: "/catalog/tproduct/388236761214-bvlgari-tygar", destination: "/product/bvlgari-tygar/", permanent: true },
  { source: "/catalog/tproduct/924239201194-creed-oud-zarian", destination: "/product/creed-oud-zarian/", permanent: true },
  { source: "/catalog/tproduct/939494545264-clive-christian-town-and-country", destination: "/product/clive-christian-town-and-country/", permanent: true },
  { source: "/catalog/tproduct/559782600364-amouage-guidance", destination: "/product/amouage-guidance/", permanent: true },
  { source: "/catalog/tproduct/436341876644-louis-vuitton-pacific-chill", destination: "/product/louis-vuitton-pacific-chill/", permanent: true },
  { source: "/catalog/tproduct/264238076634-amouage-outlands", destination: "/product/amouage-outlands/", permanent: true },
  { source: "/catalog/tproduct/307819332354-roja-isola-blue", destination: "/product/roja-isola-blue/", permanent: true },
  { source: "/catalog/tproduct/909323570144-maison-crivelli-shafran-secret", destination: "/product/maison-crivelli-shafran-secret/", permanent: true },
  { source: "/catalog/tproduct/231522936884-sospiro-vibrato", destination: "/product/sospiro-vibrato/", permanent: true },
  { source: "/brands", destination: "/brand/", permanent: true },
  { source: "/podbor-aromata", destination: "/catalog/pick/", permanent: true },
  { source: "/brands/louis-vuitton", destination: "/brand/louis-vuitton/", permanent: true },
  { source: "/nabory/tproduct/959355382414-clive-christian-blonde-amber-clive-chris", destination: "/catalog/sets/", permanent: true },
  { source: "/nabory/tproduct/700847690274-blue-talisman-extrait-hfc-devils-intrigu", destination: "/catalog/sets/", permanent: true },
  { source: "/nabory/tproduct/389409109204-amouage-guidance-hfc-devils-intrigue-", destination: "/catalog/sets/", permanent: true },
  { source: "/brands/parfums-de-marly/tproduct/186170992504-parfums-de-marly-greenley", destination: "/product/parfums-de-marly-greenley/", permanent: true },
  { source: "/o-nas", destination: "/", permanent: true },
  { source: "/nabory/tproduct/758843971574-louis-vuitton-imagination-louis-vuitton", destination: "/catalog/sets/", permanent: true },
  { source: "/brands/roja-dove", destination: "/brand/roja/", permanent: true },
  { source: "/catalog/tproduct/682053710004-amouage-epic-man", destination: "/product/amouage-epic-man/", permanent: true },
  { source: "/catalog/tproduct/142165557194-kilian-black-phantom", destination: "/product/kilian-black-phantom/", permanent: true },
  { source: "/catalog/tproduct/605757118574-amouage-guidance-46", destination: "/product/amouage-guidance-46/", permanent: true },
  { source: "/catalog/tproduct/678992304724-nishane-ani-x-extrait", destination: "/product/nishane-ani-x-extrait/", permanent: true },
  { source: "/nabory/tproduct/806561702274-clive-christian-hedonistic-clive-christi", destination: "/catalog/sets/", permanent: true },
  { source: "/catalog/tproduct/634131487464-acqua-di-parma-colonia-club", destination: "/product/acqua-di-parma-colonia-c-l-u-b/", permanent: true },
  { source: "/tproduct/875199448844-creed-silver-mountain-water", destination: "/product/creed-silver-mountain-water/", permanent: true },
  { source: "/parfumy-na-kajdiy-den/tproduct/431692774574-maison-crivelli-hibiscus-mahajat", destination: "/product/maison-crivelli-hibiscus-mahajat/", permanent: true },
  { source: "/brands/creed/tproduct/924239201194-creed-oud-zarian", destination: "/product/creed-oud-zarian/", permanent: true },
  { source: "/tproduct/307819332354-roja-isola-blue", destination: "/product/roja-isola-blue/", permanent: true },
  { source: "/brands/initio/tproduct/549939269974-initio-narcotic-delight", destination: "/product/initio-narcotic-delight/", permanent: true },
  { source: "/tproduct/516372784354-xerjoff-naxos", destination: "/product/xerjoff-naxos/", permanent: true },
  { source: "/tproduct/611459994914-hormone-paris-testosterone", destination: "/product/hormone-paris-testosterone/", permanent: true },
  { source: "/tproduct/437596614144-essential-parfums-bois-imperial", destination: "/product/essential-parfums-bois-imperial/", permanent: true },
  { source: "/brands/initio/tproduct/604102639154-initio-side-effect", destination: "/product/initio-side-effect/", permanent: true },
  { source: "/brands/louis-vuitton/tproduct/618868412784-louis-vuitton-limmensit", destination: "/product/louis-vuitton-l-immensit/", permanent: true },
  { source: "/tproduct/415260929424-marc-antoine-barrois-aldebaran", destination: "/product/marc-antoine-barrois-aldebaran/", permanent: true },
  ],
};

export default nextConfig;
