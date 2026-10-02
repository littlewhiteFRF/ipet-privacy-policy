const appLanguages = [
  'zh-Hans', 'zh-Hant', 'zh-Hant-TW', 'zh-Hant-HK', 'ja', 'ko', 'en', 'es', 'pt-BR',
  'fr', 'hi', 'ar', 'ru', 'id', 'de', 'vi', 'tr', 'bn', 'ms', 'th', 'it', 'pl',
  'ur', 'nl', 'ro', 'uk', 'fa', 'sw', 'fil', 'es-ES', 'en-GB', 'mr', 'te'
];

const languageByLowercase = new Map(appLanguages.map(code => [code.toLowerCase(), code]));

export function findLanguage(languageTag) {
  const normalized = String(languageTag ?? '').replaceAll('_', '-').trim().toLowerCase();
  if (!normalized) return undefined;

  const exact = languageByLowercase.get(normalized);
  if (exact) return exact;

  if (normalized.startsWith('zh-hant-hk') || normalized === 'zh-hk' || normalized === 'zh-mo') {
    return 'zh-Hant-HK';
  }
  if (normalized.startsWith('zh-hant-tw') || normalized === 'zh-tw') return 'zh-Hant-TW';
  if (normalized.startsWith('zh-hant')) return 'zh-Hant';
  if (normalized.startsWith('zh-hans') || normalized === 'zh-cn' || normalized === 'zh-sg') {
    return 'zh-Hans';
  }
  if (normalized.startsWith('zh')) return 'zh-Hans';
  if (normalized.startsWith('pt')) return 'pt-BR';
  if (normalized === 'tl' || normalized.startsWith('tl-')) return 'fil';

  const baseLanguage = normalized.split('-')[0];
  return languageByLowercase.get(baseLanguage);
}

export function resolveLanguage(languageTag) {
  return findLanguage(languageTag) ?? 'zh-Hans';
}

export function supportMailto(languageCode) {
  const subject = encodeURIComponent('MomentCat iPet Support');
  return `mailto:rolf1120802408@gmail.com?subject=${subject}`;
}
