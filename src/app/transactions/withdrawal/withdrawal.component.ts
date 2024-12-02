import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-withdrawal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  withdrawalForm: FormGroup;
  currentStep = 1;
  loading = false;
  errorMessage = '';

  constructor() {
    this.withdrawalForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,}$/)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      otp: ['']
    });
  }

  getButtonText(): string {
    if (this.loading) return 'Traitement en cours...';
    switch (this.currentStep) {
      case 1:
        return 'Continuer';
      case 2:
        return 'Valider le retrait';
      default:
        return 'Terminer';
    }
  }

  onSubmit() {
    if (this.withdrawalForm.invalid) return;

    switch (this.currentStep) {
      case 1:
        this.onSubmitPhoneAndAmount();
        break;
      case 2:
        this.onSubmitOtp();
        break;
    }
  }

  // Initial verification for phone and amount
  private onSubmitPhoneAndAmount() {
    if (this.withdrawalForm.get('phone')?.invalid ||
      this.withdrawalForm.get('amount')?.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.apiService.sendRequest('trans/retrait-code', {
      telephone: this.withdrawalForm.get('phone')?.value,
      montant: this.withdrawalForm.get('amount')?.value
    }).subscribe({
      next: (response: any) => {
        if (response.message) {
          this.currentStep = 2;
          this.withdrawalForm.get('otp')?.setValidators([Validators.required]);
          this.withdrawalForm.get('otp')?.updateValueAndValidity();
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message ||
          'Une erreur est survenue lors de la vérification. Veuillez réessayer.';
        this.loading = false;
        console.error('Erreur de vérification:', error);
      }
    });
  }

  private onSubmitOtp() {
    if (this.withdrawalForm.get('otp')?.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.apiService.sendRequest('trans/retrait', {
      phone: this.withdrawalForm.get('phone')?.value,
      amount: this.withdrawalForm.get('amount')?.value,
      code: this.withdrawalForm.get('otp')?.value
    }).subscribe({
      next: (response: any) => {
        if (response.transaction) {
          this.currentStep = 3;
          setTimeout(() => this.resetForm(), 3000);
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message ||
          'Une erreur est survenue lors du retrait. Veuillez réessayer.';
        this.loading = false;
        console.error('Erreur de retrait:', error);
      }
    });
  }

  private resetForm() {
    this.withdrawalForm.reset();
    this.currentStep = 1;
    this.withdrawalForm.get('otp')?.clearValidators();
    this.withdrawalForm.get('otp')?.updateValueAndValidity();
    this.errorMessage = '';
  }
}
