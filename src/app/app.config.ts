import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // HttpClient con el interceptor que envía la cookie de sesión
    provideHttpClient(withInterceptors([credentialsInterceptor])),

    // i18n (ngx-translate): idioma por defecto español, carga desde /assets/i18n
    ...provideTranslateService({ lang: 'es', fallbackLang: 'es' }),
    ...provideTranslateHttpLoader({
      prefix: '/assets/i18n/',
      suffix: '.json',
    }),
  ],
};
