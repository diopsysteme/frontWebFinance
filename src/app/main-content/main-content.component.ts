import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {QrcodeComponent} from '../qrcode/qrcode.component';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    RouterOutlet,
    QrcodeComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

}
