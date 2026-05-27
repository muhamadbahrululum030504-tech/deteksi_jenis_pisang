import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { RouterModule } from '@angular/router';

import {
  IonContent,
  IonSpinner,
  IonButton
} from '@ionic/angular/standalone';

import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';

import { TextToSpeech } from '@capacitor-community/text-to-speech';

import { App } from '@capacitor/app';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonSpinner,
    IonButton
  ]
})

export class DashboardPage {

  image: any = null;

  result: string = '';

  confidence: number = 0;

  imageUrl: string = '';

  loading: boolean = false;

  nama: string = '';

  informasi: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {

    // tombol back keluar aplikasi
    App.addListener('backButton', () => {

      if (
        window.location.pathname === '/dashboard'
      ) {

        App.exitApp();
      }
    });
  }

  // =====================================
  // KAMERA
  // =====================================

  async ambilKamera() {

    try {

      const photo = await Camera.getPhoto({

        quality: 90,

        allowEditing: false,

        resultType: CameraResultType.DataUrl,

        source: CameraSource.Camera
      });

      if (photo.dataUrl) {

        this.image = photo.dataUrl;

        this.uploadImage(photo.dataUrl);
      }

    } catch (error) {

      console.log(error);
    }
  }

  // =====================================
  // GALERI
  // =====================================

  async ambilGaleri() {

    try {

      const photo = await Camera.getPhoto({

        quality: 90,

        allowEditing: false,

        resultType: CameraResultType.DataUrl,

        source: CameraSource.Photos
      });

      if (photo.dataUrl) {

        this.image = photo.dataUrl;

        this.uploadImage(photo.dataUrl);
      }

    } catch (error) {

      console.log(error);
    }
  }

  // =====================================
  // BASE64 TO FILE
  // =====================================

  base64ToFile(
    dataUrl: string,
    filename: string
  ): File {

    const arr = dataUrl.split(',');

    const mime =
      arr[0].match(/:(.*?);/)?.[1];

    const bstr = atob(arr[1]);

    let n = bstr.length;

    const u8arr = new Uint8Array(n);

    while (n--) {

      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File(
      [u8arr],
      filename,
      {
        type: mime
      }
    );
  }

  // =====================================
  // UPLOAD IMAGE
  // =====================================

  async uploadImage(base64Image: string) {

    try {

      this.loading = true;

      const file = this.base64ToFile(
        base64Image,
        'banana.jpg'
      );

      const response: any =
        await this.apiService.scan(file);

      console.log(
        'RESPONSE API:',
        response
      );

      if (response.success) {

        // hasil
        this.result =
          response.data.result;

        this.confidence =
          Number(
            response.data.confidence
          );

        // nama pisang
        this.nama =
          this.getNamaPisang(
            this.result
          );

        // informasi
        this.informasi =
          this.getInformasiPisang(
            this.result
          );

        // loading selesai dulu
        this.loading = false;

        // tunggu UI tampil
        setTimeout(async () => {

          await this.speakResult();

        }, 50);

      } else {

        this.loading = false;

        alert('Scan gagal');
      }

    } catch (error) {

      console.log('ERROR:', error);

      this.loading = false;
    }
  }

  // =====================================
  // NAMA PISANG
  // =====================================

  getNamaPisang(
    nama: string
  ): string {

    switch (
    nama?.toLowerCase()
    ) {

      case 'ambon':
        return 'Pisang Ambon';

      case 'raja':
        return 'Pisang Raja';

      case 'muli':
        return 'Pisang Muli';

      case 'tanduk':
        return 'Pisang Tanduk';

      default:
        return nama;
    }
  }

  // =====================================
  // INFORMASI PISANG
  // =====================================

  getInformasiPisang(
    nama: string
  ): string {

    switch (
    nama?.toLowerCase()
    ) {

      case 'ambon':
        return 'Pisang Ambon memiliki aroma harum dan rasa manis.';

      case 'raja':
        return 'Pisang Raja memiliki tekstur lembut dan cocok digoreng.';

      case 'muli':
        return 'Pisang Muli cocok dimakan langsung dan rasanya manis.';

      case 'tanduk':
        return 'Pisang Tanduk sering digunakan untuk pisang goreng.';

      default:
        return 'Informasi pisang tidak tersedia.';
    }
  }

  // =====================================
  // DETAIL
  // =====================================

  goToDetail() {

    this.router.navigate(
      ['/detail'],
      {

        queryParams: {

          nama: this.nama,

          confidence:
            this.confidence,

          image: this.image,

          informasi:
            this.informasi
        }
      }
    );
  }

  // =====================================
  // SUARA
  // =====================================

  async speakResult() {

    try {

      const text =

        `Hasil deteksi adalah ${this.nama}.
        Dengan tingkat keyakinan
        ${this.confidence} persen.
        ${this.informasi}`;

      await TextToSpeech.speak({

        text: text,

        lang: 'id-ID',

        rate: 1.0,

        pitch: 1.0,

        volume: 1.0
      });

      console.log(
        'SUARA BERHASIL'
      );

    } catch (error) {

      console.log(
        'ERROR SUARA:',
        error
      );
    }
  }
}
