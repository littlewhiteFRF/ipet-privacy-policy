export const localeMap = {
  ar: ['ar', 'ar'],
  hi: ['hi', 'hi'],
  pl: ['pl', 'pl'],
  de: ['de', 'de'],
  ru: ['ru', 'ru'],
  fr: ['fr', 'fr'],
  'fr-CA': ['fr', 'fr'],
  'zh-Hant': ['zh-Hant-TW', 'zh-Hant'],
  gu: ['gu', 'en'],
  ko: ['ko', 'ko'],
  nl: ['nl', 'nl'],
  ca: ['ca', 'en'],
  'zh-Hans': ['zh-Hans', 'zh-Hans'],
  kn: ['kn', 'en'],
  hr: ['hr', 'en'],
  ro: ['ro', 'ro'],
  mr: ['mr', 'mr'],
  ml: ['ml', 'en'],
  ms: ['ms', 'ms'],
  bn: ['bn', 'bn'],
  'pt-BR': ['pt-BR', 'pt-BR'],
  ja: ['ja', 'ja'],
  sl: ['sl', 'en'],
  te: ['te', 'te'],
  ta: ['ta', 'en'],
  th: ['th', 'th'],
  tr: ['tr', 'tr'],
  ur: ['ur', 'ur'],
  uk: ['uk', 'uk'],
  'es-MX': ['es', 'es'],
  es: ['es', 'es-ES'],
  it: ['it', 'it'],
  id: ['id', 'id'],
  'en-AU': ['en', 'en'],
  'en-CA': ['en', 'en'],
  'en-US': ['en', 'en'],
  'en-GB': ['en', 'en-GB'],
  vi: ['vi', 'vi']
};

export function resolveInternationalLocale(requestedLocale) {
  const storeLanguage = localeMap[requestedLocale] ? requestedLocale : 'en-US';
  const [copyGroup, siteLocale] = localeMap[storeLanguage];
  return { storeLanguage, copyGroup, siteLocale };
}
