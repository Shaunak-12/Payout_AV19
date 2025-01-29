import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment.prod';
import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

(window as any).PF = {
  config: {
      mode: 'bs4'
  }
};

// Gatekeeper.initialize('9966bf1b-5da5-4b55-9301-86f9f0c77aaf');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
