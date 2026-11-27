// lib/blog-links.ts
//
// SEO (2026-11-23): перелинковка карточек компонентов и страниц аналогов
// с релевантными статьями блога. По данным Google Search Console статьи
// сравнения ОУ (LM358/TL072/NE5532) и аналогов МК (STM32/GD32/CH32)
// дают максимальный CTR 4–18% и приводят целевой B2B-трафик.
//
// getRelatedBlogPosts() подбирает до 3 статей по артикулу, названию
// и категории компонента: сначала узкие тематические совпадения,
// затем универсальные B2B-материалы (проверка оригинальности, BOM).

import { blogPosts } from './blog-data';

export type RelatedBlogPost = {
  slug: string;
  title: string;
  description: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Правила подбора: тест на «артикул + название + категория» → список slug'ов
// статей в порядке приоритета. Проверяются по порядку, дубликаты убираются.
// ─────────────────────────────────────────────────────────────────────────────

type BlogRule = {
  test: RegExp;
  slugs: string[];
};

const SKU_RULES: BlogRule[] = [
  // Операционные усилители — статья с максимальным CTR
  {
    test: /^(LM358|LM324|LM393|LM339|LM2904|LM224|TL07[0-9]|TL08[0-9]|NE553[0-9]|LM833|LM1458|RC4558|MC1458|NJM4558|MCP60[0-9]|MCP62[0-9]|AD86[0-9]|OPA1[67][0-9]|OPA2[12][0-9]|OPA2277|TLV90[0-9]|LM741|TLC27[0-9]|TS92[0-9])/i,
    slugs: ['sravnenie-lm358-tl072-ne5532'],
  },
  // 24-битные АЦП для тензометрии
  {
    test: /^(AD719[0-9]|ADS125[0-9]|ADS126[0-9]|HX711|CS123[0-9]|AD779[0-9])/i,
    slugs: ['analogi-i-zamena-24-bitnogo-atsp-ad7190'],
  },
  // Микроконтроллеры STM32 и их аналоги
  {
    test: /F103/i,
    slugs: ['analogi-mikrokontrollera-stm32f103c8t6', 'analogi-stm32-gd32-hk32-ch32'],
  },
  {
    test: /^(STM32|STM8|GD32|CH32|HK32|AT32|Air001)/i,
    slugs: ['analogi-stm32-gd32-hk32-ch32'],
  },
  // ESP32
  {
    test: /^(ESP32|ESP8266)/i,
    slugs: ['esp32-vs-stm32-sravnenie'],
  },
  // FPGA: Spartan-6 → Gowin, GW2A vs Artix-7, общий выбор ПЛИС
  {
    test: /XC6S/i,
    slugs: ['migraciya-xilinx-spartan-6-na-gowin-arora', 'vybor-fpga-dlya-promyshlennosti'],
  },
  {
    test: /^(GW1N|GW2A|GW5A|GWA)/i,
    slugs: ['sravnenie-gowein-gw2a-i-xilinx-artix-7', 'vybor-fpga-dlya-promyshlennosti'],
  },
  {
    test: /^(XC|EP[0-9C]|EPC|10CL|5CE|LFE|ICE4?0|ECP5|AGLF|LC4K|M10|M2S)/i,
    slugs: ['vybor-fpga-dlya-promyshlennosti'],
  },
  // MOSFET
  {
    test: /^(IRF[0-9]|IRL[0-9]|IRFB|IRFP|IRLR|IRLZ|STP[0-9]|FQP|AOD|AON|AO3|AO4|SI[3-9][0-9]{3}|IPB|IPD|IPP|PSMN|SUM|NT[0-9])/i,
    slugs: ['mosfet-dlya-silovoj-elektroniki', 'proektirovanie-sistemy-ohlazhdeniya-elektroniki'],
  },
  // IGBT
  {
    test: /^(IRG|IKW|IKP|GT[0-9]|G[BT][0-9]|FGA|IGW|SKM|CM[0-9]{2}|MB[0-9]{2}|IX[GTD])/i,
    slugs: ['vybor-igbt-dlya-silovoy-elektroniki', 'proektirovanie-sistemy-ohlazhdeniya-elektroniki'],
  },
  // Импульсные DC-DC преобразователи
  {
    test: /^(LM259[0-9]|LM257[0-9]|LM267[0-9]|LM273[0-9]|LMZ[0-9]|MP15[0-9]|MP23[0-9]|MP24[0-9]|MP44[0-9]|MP45[0-9]|TPS54[0-9]|TPS56[0-9]|TPS62[0-9]|TPS63[0-9]|MC33|MC34|NCV33|NCV88|RT[0-9]{4}|SY8[0-9]{3}|AX[0-9]{3}|XL1[0-9]|PL5[0-9]|MT[0-9]{4}|BD[0-9]{2}|AP63|AP64)/i,
    slugs: ['kak-vybrat-dc-dc-preobrazovatel'],
  },
  // Линейные стабилизаторы и LDO
  {
    test: /^(LM78|LM79|LM317|LM337|LM1117|AMS1117|78M|79M|78L|79L|L78|L79|SPX11|AP21|RT90|RT91|ME62|LD11|LD29|AZ11|HT71|HT75|XC62|MCP17|MCP18|TLV7|LP29|NCP7|ZLDO|BA03)/i,
    slugs: ['vybor-stabilizatora-napryazheniya'],
  },
  // Оптопары
  {
    test: /^(TLP[0-9]|TLP[1-9]|PC8[0-9]|PC9[0-9]|EL3[0-9]|H11[0-9]|6N1[0-9]|6N3[0-9]|HCPL|ACPL|LTV[0-9]|VO3[0-9]|PS25|TCD|TNR)/i,
    slugs: ['vybor-optopary-dlya-galvanicheskoy-razvyazki'],
  },
  // EEPROM / Flash
  {
    test: /^(24C|24L|24AA|24LC|AT24|AT25|M24|M95|25C|25L|25Q|W25|GD25|SST25|SST26|MX25|EN25|FM25|93C|93AA|BR25)/i,
    slugs: ['eeprom-vs-flash-pamyat'],
  },
  // Акселерометры/датчики вибрации
  {
    test: /^(ADXL|MPU[0-9]|LIS2|LIS3|IIM|SCA[0-9]|ADIS|H3L|KX[0-9]|BMI[0-9]|BMA[0-9])/i,
    slugs: ['akkustika-i-vibraciya-v-promyshlennosti'],
  },
  // Интерфейсные микросхемы
  {
    test: /^(MAX32[0-9]|MAX48[0-9]|MAX13[0-9]|SP3[0-9]{3}|SI86|ADM2|ADM3|ADM4|ADM2[0-9]|SN65|SN75|ISL3|THVD|LTC28|LTC29)/i,
    slugs: ['i2c-spi-uart-sravnenie'],
  },
];

// Правила по категории компонента (запасной вариант, если артикул не совпал)
const CATEGORY_RULES: BlogRule[] = [
  { test: /операцион/i, slugs: ['sravnenie-lm358-tl072-ne5532'] },
  { test: /микроконтроллер/i, slugs: ['analogi-stm32-gd32-hk32-ch32'] },
  { test: /ПЛИС|FPGA/i, slugs: ['vybor-fpga-dlya-promyshlennosti'] },
  { test: /DC-DC|импульсн/i, slugs: ['kak-vybrat-dc-dc-preobrazovatel'] },
  { test: /стабилизатор/i, slugs: ['vybor-stabilizatora-napryazheniya'] },
  { test: /тантал/i, slugs: ['ceramic-vs-tantalum-capacitors'] },
  { test: /конденса/i, slugs: ['ceramic-vs-tantalum-capacitors'] },
  { test: /разъ[её]м/i, slugs: ['vybor-razema-dlya-promyshlennoy-elektroniki'] },
  { test: /интерфей/i, slugs: ['i2c-spi-uart-sravnenie'] },
  { test: /транзистор/i, slugs: ['mosfet-dlya-silovoj-elektroniki'] },
  { test: /оптоэлектрон/i, slugs: ['vybor-optopary-dlya-galvanicheskoy-razvyazki'] },
  { test: /память/i, slugs: ['eeprom-vs-flash-pamyat'] },
  { test: /фильтр/i, slugs: ['sinusnyy-filtr-dlya-invertora'] },
  { test: /датчик/i, slugs: ['akkustika-i-vibraciya-v-promyshlennosti'] },
  { test: /АЦП|ЦАП/i, slugs: ['analogi-i-zamena-24-bitnogo-atsp-ad7190'] },
];

// Универсальные B2B-материалы — показываются, если тематических не хватило
const FALLBACK_SLUGS = [
  'kak-proverit-originalnost-mikroshemy',
  'bom-komplektaciya-kak-sekonomit-15-30',
];

const MAX_POSTS = 3;

function lookupPost(slug: string): RelatedBlogPost | null {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;
  return { slug: post.slug, title: post.title, description: post.description };
}

/**
 * Подобрать до 3 релевантных статей блога для компонента.
 * @param sku      артикул (например, LM358DR, STM32F103C8T6)
 * @param name     название компонента
 * @param category категория (например, «Операционные усилители»)
 */
export function getRelatedBlogPosts(
  sku: string,
  name?: string | null,
  category?: string | null,
): RelatedBlogPost[] {
  const haystack = `${sku || ''} ${name || ''}`.trim();
  const result: RelatedBlogPost[] = [];
  const seen = new Set<string>();

  const push = (slug: string) => {
    if (seen.has(slug)) return;
    const post = lookupPost(slug);
    if (post) {
      seen.add(slug);
      result.push(post);
    }
  };

  // 1. Узкие совпадения по артикулу/названию
  for (const rule of SKU_RULES) {
    if (result.length >= MAX_POSTS) break;
    if (rule.test.test(haystack)) {
      for (const slug of rule.slugs) push(slug);
    }
  }

  // 2. Совпадение по категории
  if (result.length < MAX_POSTS && category) {
    for (const rule of CATEGORY_RULES) {
      if (result.length >= MAX_POSTS) break;
      if (rule.test.test(category)) {
        for (const slug of rule.slugs) push(slug);
      }
    }
  }

  // 3. Универсальные B2B-материалы
  for (const slug of FALLBACK_SLUGS) {
    if (result.length >= MAX_POSTS) break;
    push(slug);
  }

  return result.slice(0, MAX_POSTS);
}
