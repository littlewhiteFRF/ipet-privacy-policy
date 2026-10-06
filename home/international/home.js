import { resolveInternationalLocale } from './locale-map.mjs';

const appStoreUrl = 'https://apps.apple.com/app/apple-store/id6795150955';

function localizedPath(path, languageCode) {
  const url = new URL(path, document.baseURI);
  url.searchParams.set('lang', languageCode);
  return `${url.pathname}${url.search}`;
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

async function render() {
  const { storeLanguage, copyGroup: contentLanguage, siteLocale: siteLanguage } =
    resolveInternationalLocale(new URLSearchParams(location.search).get('lang'));
  const [copyResponse, localesResponse] = await Promise.all([
    fetch('./home-copy.json'),
    fetch('../../locales.json')
  ]);
  if (!copyResponse.ok || !localesResponse.ok) throw new Error('Unable to load the localized page.');

  const [copyByLocale, locales] = await Promise.all([copyResponse.json(), localesResponse.json()]);
  const copy = copyByLocale[contentLanguage];
  const locale = locales[siteLanguage] ?? locales.en;
  if (!copy || !locale) throw new Error('This language is not available yet.');

  document.documentElement.lang = storeLanguage;
  document.documentElement.dir = locale.direction;
  document.title = `${copy.heroTitle} · MomentCat`;
  document.querySelector('meta[name="description"]').content = copy.heroDescription;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = copy.heroDescription;

  const pageUrl = new URL(location.href);
  pageUrl.searchParams.set('lang', storeLanguage);
  document.querySelector('link[rel="canonical"]').href = pageUrl.href;
  document.querySelector('meta[property="og:url"]').content = pageUrl.href;

  setText('brand-tagline', copy.heroTitle);
  setText('features-link', copy.heroTitle);
  setText('home-title', copy.heroTitle);
  setText('home-description', copy.heroDescription);
  setText('feature-health-title', copy.healthTitle);
  setText('feature-health-description', copy.healthDescription);
  setText('feature-profile-title', copy.profileTitle);
  setText('feature-profile-description', copy.profileDescription);
  setText('feature-timeline-title', copy.timelineTitle);
  setText('feature-timeline-description', copy.timelineDescription);
  setText('cta-title', copy.heroTitle);

  document.getElementById('features').setAttribute('aria-label', copy.heroTitle);
  document.getElementById('privacy-link').href = localizedPath('../../', siteLanguage);
  document.getElementById('footer-privacy-link').href = localizedPath('../../', siteLanguage);
  document.getElementById('privacy-link').textContent = locale.privacy.title;
  document.getElementById('footer-privacy-link').textContent = locale.privacy.title;
  document.getElementById('support-link').href = localizedPath('../../support/', siteLanguage);
  document.getElementById('footer-support-link').href = localizedPath('../../support/', siteLanguage);
  document.getElementById('support-link').textContent = locale.support.title;
  document.getElementById('footer-support-link').textContent = locale.support.title;
  document.getElementById('contact-link').textContent = locale.support.emailLabel;

  const subject = encodeURIComponent(`MomentCat ${locale.support.title}`);
  document.getElementById('contact-link').href = `mailto:rolf1120802408@gmail.com?subject=${subject}`;
  for (const link of document.querySelectorAll('[data-app-store]')) link.href = appStoreUrl;
}

render().catch(error => {
  document.getElementById('home-description').textContent = error.message;
});
