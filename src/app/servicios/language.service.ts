import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'es' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly storageKey = 'app-lang';

  readonly currentLang = signal<AppLanguage>('es');

  constructor() {
    const saved = localStorage.getItem(this.storageKey) as AppLanguage | null;
    this.setLanguage(saved === 'en' ? 'en' : 'es');
  }

  setLanguage(lang: AppLanguage): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem(this.storageKey, lang);
  }

  toggle(): void {
    this.setLanguage(this.currentLang() === 'es' ? 'en' : 'es');
  }
}
