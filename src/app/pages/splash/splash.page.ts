import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class SplashPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {

    setTimeout(() => {

      this.router.navigateByUrl('/dashboard', {
        replaceUrl: true
      });

    }, 2500);

  }

}
