import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,

  // 🔥 INI YANG PENTING
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class AppComponent {

  showSplash = true;

  constructor() {
    setTimeout(() => {
      this.showSplash = false;
    }, 2500);
  }
}
