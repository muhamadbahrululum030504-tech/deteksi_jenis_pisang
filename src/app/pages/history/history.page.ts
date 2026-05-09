import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TextToSpeech } from '@capacitor-community/text-to-speech';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-history',
  standalone: true,
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    NgFor,
    NgIf,
    FormsModule
  ]
})

export class HistoryPage implements OnInit {

  history: any[] = [];
  filtered: any[] = [];

  loading = true;

  keyword = '';

  filter:
    'all' |
    'high' |
    'medium' |
    'low' = 'all';

  constructor(
    private api: ApiService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  // =========================
  // INIT
  // =========================
  ngOnInit() {
    this.loadData();
  }

  // =========================
  // LOAD DATA
  // =========================
  async loadData() {

    this.loading = true;

    (await this.api.getHistory()).subscribe({

      next: (res: any) => {

        console.log(res);

        this.history = res.data || [];

        this.applyFilter();

        this.loading = false;
      },

      error: (err: any) => {

        console.log(err);

        window.alert('Gagal ambil data');

        this.loading = false;
      }
    });
  }

  // =========================
  // FILTER DATA
  // =========================
  applyFilter() {

    const kw =
      this.keyword.toLowerCase();

    this.filtered =
      this.history.filter(item => {

        const matchText =
          (item.result || '')
            .toLowerCase()
            .includes(kw);

        let matchConf = true;

        if (this.filter === 'high') {
          matchConf = item.confidence > 80;
        }

        if (this.filter === 'medium') {
          matchConf =
            item.confidence <= 80 &&
            item.confidence > 50;
        }

        if (this.filter === 'low') {
          matchConf = item.confidence <= 50;
        }

        return matchText && matchConf;
      });
  }

  // =========================
  // SEARCH
  // =========================
  onSearch(ev: any) {

    this.keyword =
      ev.detail.value || '';

    this.applyFilter();
  }

  // =========================
  // SET FILTER
  // =========================
  setFilter(
    f: 'all' | 'high' | 'medium' | 'low'
  ) {

    this.filter = f;

    this.applyFilter();
  }

  // =========================
  // DETAIL
  // =========================
  goDetail(item: any) {

    this.router.navigate(['/detail'], {

      state: {
        data: item
      }
    });
  }

  // =========================
  // HAPUS
  // =========================
  async delete(id: number) {

    const alert =
      await this.alertCtrl.create({

        header: 'Hapus Riwayat',

        message:
          'Yakin ingin menghapus data ini?',

        buttons: [

          {
            text: 'Batal',
            role: 'cancel'
          },

          {
            text: 'Hapus',

            handler: () => {

              this.api.delete(id).subscribe({

                next: () => {

                  window.alert(
                    'Berhasil dihapus'
                  );

                  this.loadData();
                },

                error: (err: any) => {

                  console.log(err);

                  window.alert(
                    'Gagal menghapus'
                  );
                }
              });
            }
          }
        ]
      });

    await alert.present();
  }

  // =========================
  // SPEAK
  // =========================
  async speakResult(result: string) {

    try {

      await TextToSpeech.speak({

        text:
          `Hasil scan ${this.getNamaPisang(result)}`,

        lang: 'id-ID',

        rate: 1.0
      });

    } catch (err) {

      console.log(err);
    }
  }

  // =========================
  // CONFIDENCE COLOR
  // =========================
  getConfidenceClass(conf: number) {

    if (conf > 80) {
      return 'high';
    }

    if (conf > 50) {
      return 'medium';
    }

    return 'low';
  }

  // =========================
  // NAMA PISANG
  // =========================
  getNamaPisang(result: string) {

    const map: any = {

      ambon:
        '🍌 Pisang Ambon',

      raja:
        '🍌 Pisang Raja',

      muli:
        '🍌 Pisang Muli',

      tanduk:
        '🍌 Pisang Tanduk'
    };

    return map[result] || result;
  }

  // =========================
  // INFO PISANG
  // =========================
  getBananaInfo(result: string) {

    const info: any = {

      ambon:
        'Manis dan lembut.',

      raja:
        'Cocok digoreng.',

      muli:
        'Kecil dan manis.',

      tanduk:
        'Besar untuk olahan.'
    };

    return info[result] || '-';
  }
}
