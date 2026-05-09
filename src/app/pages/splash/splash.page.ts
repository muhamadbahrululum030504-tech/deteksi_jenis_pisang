import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',

  standalone: true,

  imports: [
    IonicModule,
    CommonModule
  ],

  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})

export class SplashPage implements OnInit {

  constructor(
    private router: Router
  ) {}

  ngOnInit() {

    setTimeout(() => {

      this.router.navigate(
        ['/home'],
        {
          replaceUrl: true
        }
      );

    }, 2500);
  }
}
