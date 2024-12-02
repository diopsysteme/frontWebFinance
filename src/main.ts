import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()), // Utilise l'API Fetch pour de meilleures performances
    provideRouter(routes)
  ]
}).catch(err => console.error('Error bootstrapping app:', err));
