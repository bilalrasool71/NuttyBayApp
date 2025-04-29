import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { CookieService } from 'ngx-cookie-service';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { callInterceptor } from './core/interceptors/call.interceptor';
import { LoadingService } from './core/services/loading-service/loading.service';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';


export function playerFactory () {
  return import(/* webpackChunkName: 'lottie-web' */ "lottie-web");
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'none'
        }
      },
      ripple: true
    }),
    importProvidersFrom([BrowserAnimationsModule]),
    CookieService,
    LoadingService,
    MessageService,
    ConfirmationService,
    provideLottieOptions({
      player: () => player,
    }),
    provideHttpClient(withInterceptors([callInterceptor, tokenInterceptor])),  
  ]
};
