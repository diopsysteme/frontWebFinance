import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly BASE_URL = 'http://localhost:3001/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Fonction pour les requêtes GET.
   * @param {string} uri - L'URI de l'endpoint (sans la base URL)
   * @param {object} options - Options HTTP additionnelles (optionnelles)
   * @returns {Observable<any>} - La réponse de l'API en tant qu'Observable
   */
  get(uri: string, options: any = {}): Observable<any> {
    const url = this.buildUrl(uri);
    return this.http.get(url, { ...this.getDefaultOptions(), ...options }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Fonction pour les requêtes POST, PUT, PATCH, DELETE.
   * @param {string} uri - L'URI de l'endpoint (sans la base URL)
   * @param {object} data - Les données à envoyer (optionnelles)
   * @param {string} method - La méthode HTTP (par défaut "POST")
   * @param {object} options - Options HTTP additionnelles (optionnelles)
   * @returns {Observable<any>} - La réponse de l'API en tant qu'Observable
   */
  sendRequest(
    uri: string,
    data: any = {},
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
    options: any = {}
  ): Observable<any> {
    const url = this.buildUrl(uri);
    const requestOptions = { ...this.getDefaultOptions(), ...options };

    let httpCall: Observable<any>;
    switch (method.toUpperCase()) {
      case 'POST':
        httpCall = this.http.post(url, data, requestOptions);
        break;
      case 'PUT':
        httpCall = this.http.put(url, data, requestOptions);
        break;
      case 'PATCH':
        httpCall = this.http.patch(url, data, requestOptions);
        break;
      case 'DELETE':
        httpCall = this.http.delete(url, requestOptions);
        break;
      default:
        throw new Error(`Méthode HTTP non supportée: ${method}`);
    }

    return httpCall.pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  /**
   * Construction de l'URL complète
   * @param {string} uri - L'URI à ajouter à l'URL de base
   * @returns {string} - L'URL complète
   */
  private buildUrl(uri: string): string {
    const cleanUri = uri.startsWith('/') ? uri.slice(1) : uri;
    const cleanBaseUrl = this.BASE_URL.endsWith('/')
      ? this.BASE_URL.slice(0, -1)
      : this.BASE_URL;
    return `${cleanBaseUrl}/${cleanUri}`;
  }

  /**
   * Options par défaut pour les requêtes HTTP avec ajout des tokens dans les headers
   * @returns {object} - Les options par défaut
   */
  private getDefaultOptions(): any {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const otpToken = this.authService.getOtpToken();
    const pinToken = this.authService.getPinToken();

    if (otpToken) {
      headers = headers.set('Authorization', `Bearer ${otpToken}`);
    }

    if (pinToken) {
      headers = headers.set('x-session-token', pinToken);
    }

    return {
      headers,
      withCredentials: true // Enable if you need to send cookies
    };
  }

  /**
   * Gestion des erreurs HTTP améliorée
   * @param {HttpErrorResponse} error - L'erreur HTTP retournée
   * @returns {Observable<never>} - Un Observable avec l'erreur
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide';
          break;
        case 401:
          errorMessage = 'Non autorisé';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 500:
          errorMessage = 'Erreur serveur interne';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    console.error('ApiService Error:', {
      message: errorMessage,
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error
    });

    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      originalError: error
    }));
  }
}
