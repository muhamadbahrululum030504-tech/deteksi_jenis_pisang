import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

import {
  IonicModule,
  ActionSheetController
} from '@ionic/angular';

import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  image: any;
  result = '';
  confidence = 0;
  loading = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private alertCtrl: AlertController
  ) {

    this.handleBackButton();
  }

  // =========================
  // PILIH GAMBAR
  // =========================
  async pilihGambar() {

    const sheet = await this.actionSheetCtrl.create({
      header: 'Pilih Gambar',
      buttons: [

        {
          text: '📸 Kamera',
          handler: () => {
            this.ambilKamera();
          }
        },

        {
          text: '🖼️ Galeri',
          handler: () => {
            this.ambilGaleri();
          }
        },

        {
          text: 'Batal',
          role: 'cancel'
        }

      ]
    });

    await sheet.present();
  }

  // =========================
  // KAMERA
  // =========================
  async ambilKamera() {

    try {

      const photo = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      await this.proses(photo);

    } catch (err) {

      console.log(err);
      alert('Kamera gagal');
    }
  }

  // =========================
  // GALERI
  // =========================
  async ambilGaleri() {

    try {

      const photo = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      await this.proses(photo);

    } catch (err) {

      console.log(err);
      alert('Galeri gagal');
    }
  }

  // =========================
  // PROSES GAMBAR
  // =========================
  async proses(photo: any) {

    try {

      if (!photo.base64String) {

        alert('Gambar tidak ditemukan');
        return;
      }

      this.loading = true;

      // tampilkan gambar
      this.image =
        'data:image/jpeg;base64,' + photo.base64String;

      // convert base64 ke blob
      const byteCharacters =
        atob(photo.base64String);

      const byteNumbers =
        new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {

        byteNumbers[i] =
          byteCharacters.charCodeAt(i);
      }

      const byteArray =
        new Uint8Array(byteNumbers);

      const blob = new Blob(
        [byteArray],
        { type: 'image/jpeg' }
      );

      const file = new File(
        [blob],
        'scan.jpg',
        { type: 'image/jpeg' }
      );

      // kirim API
      (await this.api.scan(file)).subscribe({

        next: async (res: any) => {

          console.log(res);

          this.result =
            res?.data?.result || '-';

          this.confidence =
            Number(res?.data?.confidence || 0);

          this.loading = false;

          await this.speakResult();
        },

        error: (err: any) => {

          console.log(err);

          alert('Gagal scan API');

          this.loading = false;
        }
      });

    } catch (err) {

      console.log(err);

      alert('Error proses gambar');

      this.loading = false;
    }
  }

  // =========================
  // DETAIL
  // =========================
  goToDetail() {

    this.router.navigate(['/detail'], {

      state: {

        data: {

          result: this.result,
          confidence: this.confidence,
          image_url: this.image
        }
      }
    });
  }

  // =========================
  // NAMA PISANG
  // =========================
  getNamaPisang(res: string) {

    return {

      ambon: 'Pisang Ambon',
      raja: 'Pisang Raja',
      muli: 'Pisang Muli',
      tanduk: 'Pisang Tanduk'

    }[res] || res;
  }

  async speakResult() {

    try {

      await TextToSpeech.speak({
        text: `Hasil scan adalah ${this.getNamaPisang(this.result)}`,
        lang: 'id-ID',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0
      });

    } catch (err) {

      console.log(err);
    }
  }
  // =========================
  // HANDLE BACK BUTTON
  // =========================
  handleBackButton() {

    this.platform.backButton.subscribeWithPriority(
      10,
      async () => {

        const alert = await this.alertCtrl.create({

          header: '🍌 Keluar Aplikasi',

          message: 'Yakin ingin keluar dari Banana Scanner?',

          cssClass: 'exit-alert',

          buttons: [

            {
              text: 'Batal',
              role: 'cancel',
              cssClass: 'cancel-btn'
            },

            {
              text: 'Keluar',
              cssClass: 'exit-btn',

              handler: () => {
                App.exitApp();
              }
            }

          ]
        });

        await alert.present();
      }
    );
  }
  getDeviceId() {

    let id =
      localStorage.getItem('device_id');

    if (!id) {

      id = uuidv4();

      localStorage.setItem(
        'device_id',
        id
      );
    }

    return id;
  }
}
