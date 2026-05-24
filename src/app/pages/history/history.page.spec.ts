import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { IonContent } from '@ionic/angular/standalone';

import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent
  ]
})

export class HistoryPage {

  history: any[] = [];

  constructor(
    private router: Router
  ) {}

  ionViewWillEnter() {

    const data =
      localStorage.getItem('history');

    this.history =
      data ? JSON.parse(data) : [];
  }

  // =========================
  // DETAIL
  // =========================
  lihatDetail(item: any) {

    this.router.navigate(['/detail'], {

      queryParams: {

        nama: item.nama,

        confidence: item.confidence,

        image: item.image
      }
    });
  }

  // =========================
  // HAPUS
  // =========================
  hapus(id: number) {

    this.history =
      this.history.filter(
        x => x.id !== id
      );

    localStorage.setItem(
      'history',
      JSON.stringify(this.history)
    );
  }
}
