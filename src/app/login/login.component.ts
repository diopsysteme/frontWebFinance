// phone-verification.component.ts
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';
import {CommonModule} from '@angular/common';
import {AuthService} from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  styleUrls: ['./login.component.css'],
  providers: [ApiService]
})
export class PhoneVerificationComponent {
  phoneVerificationForm: FormGroup;
  showVerificationField = false;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService // Inject ApiService
  ) {
    this.phoneVerificationForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8,}$')]],
      verificationCode: ['']
    });
  }

  // Envoi du numéro de téléphone
  onSubmitPhone() {
    if (this.phoneVerificationForm.get('phoneNumber')?.invalid) return;

    this.loading = true;
    const phoneNumber = this.phoneVerificationForm.get('phoneNumber')?.value;

    // Call API to send the verification code
    this.apiService.sendRequest('user/request-otp', { phoneNumber }).subscribe({
      next: () => {
        this.showVerificationField = true;
        this.loading = false;

        // Set validators for verification code field once the code is sent
        this.phoneVerificationForm.get('verificationCode')?.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]{4,6}$')
        ]);
        this.phoneVerificationForm.get('verificationCode')?.updateValueAndValidity();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to send verification code. Please try again.';
        console.error('Error sending code:', err);
      }
    });
  }

  // Vérification du code reçu
  onSubmitVerification() {
    if (this.phoneVerificationForm.invalid) return;

    this.loading = true;
    const phoneNumber = this.phoneVerificationForm.get('phoneNumber')?.value;
    const otp = this.phoneVerificationForm.get('verificationCode')?.value;

    this.apiService.sendRequest('user/verify-otp', { phoneNumber, otp }).subscribe({
      next: (response: any) => {
        this.loading = false;
        const otpToken = response.token;
        this.authService.setOtpToken(otpToken); // Sauvegarde le token OTP
        this.router.navigate(['/enter-pin']); // Redirige vers la page pour entrer le code PIN
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Verification failed. Please try again.';
        console.error('Error verifying code:', err);
      }
    });
  }

}
