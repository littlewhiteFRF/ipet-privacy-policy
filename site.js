import { findLanguage, resolveLanguage, supportMailto } from './locale-utils.mjs';

const emailAddress = 'rolf1120802408@gmail.com';
const pageKind = document.body.dataset.page;
const localesUrl = document.body.dataset.localesUrl;
const languagePicker = document.querySelector('#language-picker');
const relatedLink = document.querySelector('#related-link');
const content = document.querySelector('#page-content');

function selectedLanguage(locales) {
  const supported = value => value && locales[value];
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  if (supported(queryLanguage)) return queryLanguage;

  const savedLanguage = localStorage.getItem('momentcat-site-language');
  if (supported(savedLanguage)) return savedLanguage;

  for (const candidate of navigator.languages ?? [navigator.language]) {
    const match = findLanguage(candidate);
    if (supported(match)) return match;
  }
  return resolveLanguage('zh-Hans');
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function localizedHref(basePath, languageCode) {
  const url = new URL(basePath, document.baseURI);
  url.searchParams.set('lang', languageCode);
  return `${url.pathname}${url.search}`;
}

function buildPrivacyContent(locale) {
  const section = element('section', 'content-card privacy-copy');
  section.setAttribute('aria-label', locale.privacy.title);
  for (const paragraph of locale.privacy.paragraphs) {
    section.append(element('p', '', paragraph));
  }

  const contact = element('section', 'contact-card');
  const contactCopy = element('div');
  contactCopy.append(element('p', 'contact-label', locale.support.emailLabel));
  const email = element('a', 'contact-email', emailAddress);
  email.href = supportMailto(locale.support.title);
  contactCopy.append(email);
  contact.append(contactCopy);

  content.replaceChildren(section, contact);
}

function buildSupportContent(locale) {
  const section = element('section', 'content-card support-copy');
  const details = element('ul', 'support-details');
  for (const detail of locale.support.details) details.append(element('li', '', detail));

  section.append(details);
  const contact = element('div', 'support-contact');
  const email = element('a', 'support-button', locale.support.emailLabel);
  email.href = supportMailto(locale.support.title);
  contact.append(email);
  const address = element('a', 'contact-email support-address', emailAddress);
  address.href = supportMailto(locale.support.title);
  contact.append(address);
  section.append(contact);

  const privacy = element('a', 'text-link', locale.support.privacyLink);
  privacy.href = localizedHref('../', locale.code);
  privacy.className = 'privacy-link';
  content.replaceChildren(section, privacy);
}

function render(locales, languageCode) {
  const locale = { ...locales[languageCode], code: languageCode };
  const pageCopy = pageKind === 'support' ? locale.support : locale.privacy;
  document.documentElement.lang = languageCode;
  document.documentElement.dir = locale.direction;
  document.title = `${pageCopy.title} · MomentCat iPet`;
  document.querySelector('meta[name="description"]').content = pageCopy.intro;

  document.querySelector('#page-title').textContent = pageCopy.title;
  document.querySelector('#page-intro').textContent = pageCopy.intro;

  const now = new Date('2026-10-03T00:00:00Z');
  const dateLocale = languageCode === 'zh-Hans' ? 'zh-CN' : languageCode;
  document.querySelector('#updated-date').textContent = new Intl.DateTimeFormat(dateLocale, {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  }).format(now);

  const options = Object.entries(locales).map(([code, item]) => {
    const option = element('option', '', item.name);
    option.value = code;
    return option;
  });
  languagePicker.replaceChildren(...options);
  languagePicker.value = languageCode;

  const relatedPath = pageKind === 'support' ? '../' : 'support/';
  relatedLink.href = localizedHref(relatedPath, languageCode);
  relatedLink.textContent = pageKind === 'support' ? locale.support.privacyLink : locale.support.title;

  if (pageKind === 'support') buildSupportContent(locale);
  else buildPrivacyContent(locale);
}

fetch(localesUrl)
  .then(response => {
    if (!response.ok) throw new Error(`Unable to load localized content (${response.status})`);
    return response.json();
  })
  .then(locales => {
    render(locales, selectedLanguage(locales));
    languagePicker.addEventListener('change', () => {
      const nextLanguage = languagePicker.value;
      localStorage.setItem('momentcat-site-language', nextLanguage);
      history.replaceState(null, '', localizedHref(location.pathname, nextLanguage));
      render(locales, nextLanguage);
    });
  })
  .catch(error => {
    content.textContent = error.message;
  });
