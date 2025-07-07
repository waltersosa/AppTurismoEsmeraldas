import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';
import { provideHttpClient } from '@angular/common/http';

const bootstrap = () => bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
  ]
});

export default bootstrap;
