// secret-code.component.ts
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { Router } from '@angular/router';
import {AuthService} from '../services/auth/auth.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-secret-code',
  templateUrl: './secret-key.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  styleUrls: ['./secret-key.component.css']
})
export class SecretCodeComponent {
  secretForm: FormGroup;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.secretForm = this.fb.group({
      secretCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
    });
  }

  onSubmitSecret() {
    if (this.secretForm.invalid) return;

    this.loading = true;
    const pin = this.secretForm.get('secretCode')?.value;
    const otpToken = this.authService.getOtpToken();

    this.apiService.sendRequest('user/verify-pin', { pin }).subscribe({
      next: (response: any) => {
        this.loading = false;
        const pinToken = response.sessionToken;
        this.authService.setPinToken(pinToken); // Sauvegarde le token secret
        this.router.navigate(['/dashboard']); // Redirige vers le dashboard
      },
      error: (err) => {
        this.loading = false;
        this.error = 'La vérification a échoué. Veuillez réessayer.';
        console.error('Error verifying secret code:', err);
      }
    });
  }
}
