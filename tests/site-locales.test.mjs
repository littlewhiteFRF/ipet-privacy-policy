import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const siteDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localeDataPath = path.join(siteDirectory, 'locales.json');
const localeUtilsPath = path.join(siteDirectory, 'locale-utils.mjs');
const appLanguageCodes = [
  'zh-Hans', 'zh-Hant', 'zh-Hant-TW', 'zh-Hant-HK', 'ja', 'ko', 'en', 'es', 'pt-BR',
  'fr', 'hi', 'ar', 'ru', 'id', 'de', 'vi', 'tr', 'bn', 'ms', 'th', 'it', 'pl',
  'ur', 'nl', 'ro', 'uk', 'ca', 'hr', 'sl', 'gu', 'kn', 'ml', 'fa', 'sw', 'fil', 'mr', 'ta', 'te'
];
const appStoreLanguageCodes = ['es-ES', 'en-GB'];

test('privacy and support content covers every app language and unresolved App Store language', () => {
  assert.ok(existsSync(localeDataPath), 'localized privacy and support content must be available');

  const locales = JSON.parse(readFileSync(localeDataPath, 'utf8'));
  assert.deepEqual(Object.keys(locales).sort(), [...appLanguageCodes, ...appStoreLanguageCodes].sort());

  for (const code of [...appLanguageCodes, ...appStoreLanguageCodes]) {
    const locale = locales[code];
    assert.ok(locale.name, `${code} must have a language name`);
    assert.ok(['ltr', 'rtl'].includes(locale.direction), `${code} must declare text direction`);
    assert.equal(locale.direction, ['ar', 'fa', 'ur'].includes(code) ? 'rtl' : 'ltr', `${code} must use its correct text direction`);
    assert.ok(locale.privacy.title && locale.privacy.intro, `${code} must have localized privacy headings`);
    assert.equal(locale.privacy.paragraphs.length, 5, `${code} must explain the five privacy topics`);
    assert.ok(locale.privacy.paragraphs.every(paragraph => paragraph.length > 50), `${code} privacy topics must be complete`);
    assert.ok(locale.support.title && locale.support.intro, `${code} must have localized support content`);
    assert.equal(locale.support.details.length, 3, `${code} support page must ask for useful report details`);
    assert.ok(locale.support.emailLabel && locale.support.privacyLink, `${code} support contacts must be localized`);
  }
});

test('browser and store locale tags resolve to an app language and support email subject', async () => {
  assert.ok(existsSync(localeUtilsPath), 'locale resolution and support mail helpers must be available');
  const { resolveLanguage, supportMailto } = await import(pathToFileURL(localeUtilsPath));

  assert.equal(resolveLanguage('es-ES'), 'es-ES');
  assert.equal(resolveLanguage('en-GB'), 'en-GB');
  assert.equal(resolveLanguage('ca-ES'), 'ca');
  assert.equal(resolveLanguage('hr-HR'), 'hr');
  assert.equal(resolveLanguage('sl-SI'), 'sl');
  assert.equal(resolveLanguage('gu-IN'), 'gu');
  assert.equal(resolveLanguage('kn-IN'), 'kn');
  assert.equal(resolveLanguage('ml-IN'), 'ml');
  assert.equal(resolveLanguage('ta-IN'), 'ta');
  assert.equal(resolveLanguage('mr-IN'), 'mr');
  assert.equal(resolveLanguage('te-IN'), 'te');
  assert.equal(resolveLanguage('pt-PT'), 'pt-BR');
  assert.equal(resolveLanguage('zh-HK'), 'zh-Hant-HK');
  assert.equal(resolveLanguage('zh-TW'), 'zh-Hant-TW');
  assert.equal(resolveLanguage('zh'), 'zh-Hans');
  assert.equal(resolveLanguage('xx-XX'), 'zh-Hans');
  assert.equal(
    supportMailto('Hilfe und Support'),
    'mailto:rolf1120802408@gmail.com?subject=Hilfe%20und%20Support'
  );
});
