import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './servicios/auth.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
  ],
};
