import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  imports: [IonicModule, CommonModule]
})
export class DetailPage implements OnInit {

  data: any;
  confidenceWidth = '0%';

  constructor(
    private router: Router,
    private location: Location // 🔥 BACK ASLI
  ) {}

  ngOnInit() {
    this.data = history.state?.data;

    // 🔥 kalau tidak ada data → balik ke home
    if (!this.data) {
      this.router.navigate(['/']);
      return;
    }

    // 🔥 animasi progress bar
    setTimeout(() => {
      this.confidenceWidth = this.data.confidence + '%';
    }, 400);
  }

  // 🔙 BACK FUNCTION (BEST PRACTICE)
  goBack() {
    this.location.back();
  }

  // 🍌 NAMA PISANG
  getNamaPisang(nama: string) {
    const map: any = {
      ambon: '🍌 Pisang Ambon',
      raja: '🍌 Pisang Raja',
      muli: '🍌 Pisang Muli',
      tanduk: '🍌 Pisang Tanduk'
    };
    return map[nama] || nama;
  }

  // 📚 INFO
  getBananaInfo(nama: string) {
    const info: any = {
      ambon: 'Manis dan lembut, cocok dimakan langsung.',
      raja: 'Legit dan cocok digoreng.',
      muli: 'Kecil dan manis.',
      tanduk: 'Besar dan cocok olahan.'
    };
    return info[nama] || '-';
  }

  // 🤖 INSIGHT AI
  getInsight() {
    const c = this.data?.confidence;

    if (c > 80) return '🤖 AI sangat yakin dengan hasil ini.';
    if (c > 50) return '🤖 Kemungkinan benar, tapi masih bisa meleset.';
    return '⚠️ Confidence rendah, coba scan ulang.';
  }

  // 🎯 WARNA CONFIDENCE
  getConfidenceClass(conf: number) {
    if (conf > 80) return 'high';
    if (conf > 50) return 'medium';
    return 'low';
  }
}