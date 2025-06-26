import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { provideServiceWorker } from '@angular/service-worker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxGaugeModule } from 'ngx-gauge';
import { LinearGaugeModule } from '@syncfusion/ej2-angular-lineargauge';
import { NgApexchartsModule } from 'ng-apexcharts';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';


import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registrar el locale español
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loaderInterceptor])),
    provideAnimations(),
    provideToastr(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    importProvidersFrom(ModalModule.forRoot()),
    importProvidersFrom(TimepickerModule.forRoot()),
    importProvidersFrom(NgbModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(NgxGaugeModule),
    importProvidersFrom(LinearGaugeModule),
    importProvidersFrom(NgApexchartsModule),
    { provide: LOCALE_ID, useValue: 'es' },

  ],
};
