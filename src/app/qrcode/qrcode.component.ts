import {Component, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.css'
})
export class QrcodeComponent {
  @Input() amount = '$21K';

  private qrImage = signal<string | null>(null);
  private amountVisible = signal(true);

  qrCodeImage = this.qrImage.asReadonly();
  isAmountVisible = this.amountVisible.asReadonly();

  @Input() set base64Image(value: string) {
    this.qrImage.set(value);
  }

  toggleAmount() {
    this.amountVisible.set(!this.amountVisible());
  }
}
