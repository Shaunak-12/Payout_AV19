import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { FeatherModule } from 'angular-feather';

import { allIcons } from 'angular-feather/icons';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { ActionReducer, provideStore } from '@ngrx/store';
import { uiReducer } from '@/store/ui/reducer';
import { authReducer } from '@/store/auth/reducer';
import { Action } from '@ngrx/store';

import {provideToastr} from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideHttpClient(withFetch()),
     importProvidersFrom(FeatherModule.pick(allIcons)),

     provideAnimations(),
     provideStore(),
     provideStore({ ui: uiReducer }),
     provideStore({ auth: authReducer as ActionReducer<any, Action> }),

     provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
  }),
     { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } } // Disable ripples globally


    ]
};
