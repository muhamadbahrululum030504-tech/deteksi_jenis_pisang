import { Component } from '@angular/core';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { CommonModule, NgIf, NgClass } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule, NgIf, NgClass]
})
export class HomePage {

  image: any = null;
  result: any = null;
  confidence: any = null;
  loading = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {}

  // ======================
  // PILIH GAMBAR
  // ======================
  async pilihGambar() {
    const sheet = await this.actionSheetCtrl.create({
      header: 'Pilih Sumber',
      buttons: [
        { text: '📸 Kamera', handler: () => this.ambilKamera() },
        { text: '🖼️ Galeri', handler: () => this.ambilGaleri() },
        { text: 'Batal', role: 'cancel' }
      ]
    });

    await sheet.present();
  }

  async ambilKamera() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 90
    });

    this.proses(photo.dataUrl);
  }

  async ambilGaleri() {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      quality: 90
    });

    this.proses(photo.dataUrl);
  }

  // ======================
  // PROSES SCAN
  // ======================
  proses(dataUrl: any) {
    this.image = dataUrl;
    this.loading = true;

    const file = this.dataURLtoFile(dataUrl, 'image.jpg');

    this.api.scan(file).subscribe({
      next: async (res: any) => {
        this.result = res.data.result;
        this.confidence = res.data.confidence;

        this.loading = false;

        // 🔥 SUARA AI OTOMATIS
        this.speakResult();
      },
      error: () => {
        alert('Gagal scan');
        this.loading = false;
      }
    });
  }

  // ======================
  // TEXT TO SPEECH
  // ======================
  async speakResult() {
    let text = '';

    if (this.confidence > 80) {
      text = `Ini adalah ${this.getNamaPisang(this.result)}. AI sangat yakin dengan hasil ini`;
    } else if (this.confidence > 50) {
      text = `Kemungkinan ini ${this.getNamaPisang(this.result)}, namun masih bisa meleset`;
    } else {
      text = `Hasil kurang akurat, kemungkinan ${this.getNamaPisang(this.result)}`;
    }

    await TextToSpeech.speak({
      text: text,
      lang: 'id-ID',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    });
  }

  // ======================
  // BASE64 → FILE
  // ======================
  dataURLtoFile(dataurl: any, filename: string) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  // ======================
  // NAVIGASI DETAIL
  // ======================
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

  // ======================
  // UTIL
  // ======================
  getConfidenceClass(conf: number) {
    if (conf > 80) return 'high';
    if (conf > 50) return 'medium';
    return 'low';
  }

  getNamaPisang(result: string) {
    const data: any = {
      ambon: 'Pisang Ambon',
      raja: 'Pisang Raja',
      muli: 'Pisang Muli',
      tanduk: 'Pisang Tanduk'
    };
    return data[result] || result;
  }
}