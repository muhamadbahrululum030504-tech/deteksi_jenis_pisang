import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterModule, Router } from '@angular/router';

import {
  IonicModule,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})

export class HistoryPage implements OnInit {

  history: any[] = [];

  loading = false;

  constructor(

    private api: ApiService,

    private router: Router,

    private alertController: AlertController,

    private toastController: ToastController,

    private loadingController: LoadingController

  ) {}

  // =========================================
  // INIT
  // =========================================

  async ngOnInit() {

    await this.loadHistory();

  }

  // =========================================
  // REFRESH PAGE
  // =========================================

  async ionViewWillEnter() {

    await this.loadHistory();

  }

  // =========================================
  // LOAD HISTORY
  // =========================================

  async loadHistory() {

    try {

      this.loading = true;

      const res: any = await this.api.getHistory();

      console.log('HISTORY:', res);

      this.history = (res.data || []).map((item: any) => {

        console.log('IMAGE URL:', item.image_url);

        return {

          id: item.id,

          nama: item.result,

          confidence: Number(item.confidence),

          image: item.image_url,

          date: item.created_at

        };

      });

      console.log('DATA HISTORY:', this.history);

    } catch (error) {

      console.log('ERROR HISTORY:', error);

    } finally {

      this.loading = false;

    }
  }

  // =========================================
  // DETAIL
  // =========================================

  lihatDetail(item: any) {

    this.router.navigate(['/detail'], {

      queryParams: {

        id: item.id,

        nama: item.nama,

        confidence: item.confidence,

        image: item.image

      }

    });

  }

  // =========================================
  // DELETE HISTORY MODERN
  // =========================================

  async hapusHistory(id: number) {

    const alert = await this.alertController.create({

      header: '🗑️ Hapus Riwayat',

      message: 'Yakin ingin menghapus history ini?',

      cssClass: 'custom-delete-alert',

      buttons: [

        {
          text: 'BATAL',
          role: 'cancel'
        },

        {
          text: 'HAPUS',

          cssClass: 'danger-btn',

          handler: async () => {

            try {

              // =========================================
              // LOADING
              // =========================================

              const loading =
                await this.loadingController.create({

                message: 'Menghapus data...',

                spinner: 'crescent'

              });

              await loading.present();

              // =========================================
              // DELETE API
              // =========================================

              const response: any =
                await this.api.delete(id);

              console.log('DELETE RESPONSE:', response);

              // =========================================
              // TUTUP LOADING
              // =========================================

              await loading.dismiss();

              // =========================================
              // TOAST SUCCESS
              // =========================================

              const toast =
                await this.toastController.create({

                message:
                  '✅ History berhasil dihapus',

                duration: 2000,

                position: 'top',

                color: 'success'

              });

              await toast.present();

              // =========================================
              // REFRESH HISTORY
              // =========================================

              await this.loadHistory();

            } catch (error) {

              console.log('DELETE ERROR:', error);

              // =========================================
              // TOAST ERROR
              // =========================================

              const toast =
                await this.toastController.create({

                message:
                  '❌ Gagal menghapus history',

                duration: 2000,

                position: 'top',

                color: 'danger'

              });

              await toast.present();

            }

          }

        }

      ]

    });

    await alert.present();

  }

}
