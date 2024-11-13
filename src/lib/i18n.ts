import fs from 'fs';
import path from 'path';
import deepmerge from 'deepmerge';

class TranslationService {
  private dictionaries: Record<string, any> = {};
  private defaultLocale = 'en-US';

  constructor() {
    this.loadDictionaries();
  }

  private loadDictionaries() {
    const messagesDir = path.join(__dirname, '../messages');
    const files = fs.readdirSync(messagesDir);
    let defaultDict: Record<string, any> | null = null;

    files.forEach((file) => {
      const locale = path.basename(file, '.json');

      const filePath = path.join(messagesDir, file);
      const localeDict = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      if (locale === this.defaultLocale) {
        defaultDict = localeDict;
        this.dictionaries[locale] = localeDict;
      } else {
        this.dictionaries[locale] = deepmerge(defaultDict || {}, localeDict);
      }
    });

    if (!defaultDict) {
	throw new Error(`Default language (${this.defaultLocale}) not found in messages folder.`);
    }
  }

  public translate(key: string, locale?: string, variables: Record<string, string> = {}): string {
    const keys = key.split('.');
	let translation = this.dictionaries[this.defaultLocale];
	if (locale) {
		translation = this.dictionaries[locale] || translation;
	}
    for (const keyPart of keys) {
      if (!translation[keyPart]) return key;
      translation = translation[keyPart];
    }

    Object.keys(variables).forEach((varKey) => {
      translation = translation.replace(`{{${varKey}}}`, variables[varKey]);
    });

    return translation;
  }
}

export const translationService = new TranslationService();
