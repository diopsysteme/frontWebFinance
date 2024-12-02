import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly OTP_TOKEN_KEY = 'otpToken';
  private readonly PIN_TOKEN_KEY = 'pinToken';

  constructor(private router: Router) {}

  setOtpToken(token: string): void {
    localStorage.setItem(this.OTP_TOKEN_KEY, token);
  }

  setPinToken(token: string): void {
    localStorage.setItem(this.PIN_TOKEN_KEY, token);
  }

  getOtpToken(): string | null {
    return localStorage.getItem(this.OTP_TOKEN_KEY);
  }

  getPinToken(): string | null {
    return localStorage.getItem(this.PIN_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.OTP_TOKEN_KEY);
    localStorage.removeItem(this.PIN_TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isTokenValid(token: string | null): boolean {
    if (!token) return false;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp! * 1000 > Date.now();
    } catch (error) {
      console.error('Token validation error', error);
      return false;
    }
  }

  isAuthenticated(): boolean {
    // this.clearTokens();
    console.log(this.getOtpToken())
    const isOtpValid = this.isTokenValid(this.getOtpToken());

    const isPinValid = this.isTokenValid(this.getPinToken());

    if (isOtpValid && isPinValid) {
      // Fully authenticated
      return true;
    } else if (isOtpValid && !isPinValid) {
      // OTP token is valid, but PIN token is invalid
      this.router.navigate(['/enter-pin']);
      return true;
    } else {
      // Neither token is valid
      this.clearTokens();
      return false;
    }
  }
}
