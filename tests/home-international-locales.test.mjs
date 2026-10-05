import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const siteDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routeMapUrl = pathToFileURL(path.join(siteDirectory, 'home/international/locale-map.mjs'));
const copyByLocale = JSON.parse(readFileSync(path.join(siteDirectory, 'home/international/home-copy.json'), 'utf8'));
const siteLocales = JSON.parse(readFileSync(path.join(siteDirectory, 'locales.json'), 'utf8'));
const expectedStoreLocales = [
  'ar', 'hi', 'pl', 'de', 'ru', 'fr', 'fr-CA', 'zh-Hant', 'gu', 'ko', 'nl', 'ca', 'zh-Hans',
  'kn', 'hr', 'ro', 'mr', 'ml', 'ms', 'bn', 'pt-BR', 'ja', 'sl', 'te', 'ta', 'th', 'tr',
  'ur', 'uk', 'es-MX', 'es', 'it', 'id', 'en-AU', 'en-CA', 'en-US', 'en-GB', 'vi'
];

test('international landing page maps every configured App Store locale to existing copy and trust resources', async () => {
  const { localeMap } = await import(routeMapUrl);
  const actualLocales = Object.keys(localeMap);

  assert.equal(actualLocales.length, 38);
  assert.deepEqual(actualLocales.sort(), [...expectedStoreLocales].sort());

  for (const [storeLocale, [copyGroup, siteLocale]] of Object.entries(localeMap)) {
    assert.ok(copyByLocale[copyGroup], `${storeLocale} must have marketing copy`);
    assert.ok(siteLocales[siteLocale], `${storeLocale} must have privacy and support resources`);
  }
});

test('unknown or missing locale values resolve consistently to English', async () => {
  const { resolveInternationalLocale } = await import(routeMapUrl);

  assert.deepEqual(resolveInternationalLocale('xx-XX'), {
    storeLanguage: 'en-US',
    copyGroup: 'en',
    siteLocale: 'en'
  });
  assert.deepEqual(resolveInternationalLocale(null), {
    storeLanguage: 'en-US',
    copyGroup: 'en',
    siteLocale: 'en'
  });
});

test('Croatian profile is cat-specific and Japanese and Korean timeline copy has no stray wave mark', () => {
  assert.equal(copyByLocale.hr.profileTitle, 'Profil mačke');
  assert.match(copyByLocale.hr.timelineDescription, /kronološki/);
  assert.ok(!/[~～]$/.test(copyByLocale.hr.timelineDescription));
  assert.ok(!/[~～]$/.test(copyByLocale.ja.timelineDescription));
  assert.ok(!/[~～]$/.test(copyByLocale.ko.timelineDescription));
});
