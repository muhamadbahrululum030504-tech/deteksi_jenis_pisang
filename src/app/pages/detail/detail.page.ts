import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class DetailPage implements OnInit {

  id: any;
  nama: string = '';
  confidence: number = 0;
  image: string = '';

  informasi: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      console.log('DETAIL PARAMS:', params);

      this.id = params['id'];

      this.nama = (params['nama'] || '')
        .replace('Pisang ', '')
        .toLowerCase()
        .trim();

      this.confidence = Number(params['confidence']) || 0;

      this.image = params['image'] || '';

      console.log('DETAIL IMAGE:', this.image);

      this.setInformasi();
    });
  }

  // =========================
  // INFORMASI PISANG
  // =========================

  setInformasi() {

    const data: any = {

      muli:
        'Pisang Muli cocok dikonsumsi langsung dan rasanya manis.',

      raja:
        'Pisang Raja memiliki tekstur lembut dan sangat cocok untuk digoreng.',

      kepok:
        'Pisang Kepok sering digunakan untuk pisang goreng.',

      ambon:
        'Pisang Ambon memiliki aroma harum dan rasa manis.',

      susu:
        'Pisang Susu berukuran kecil dengan rasa yang legit.',
    };

    this.informasi =
      data[this.nama?.toLowerCase()] ||
      'Informasi pisang tidak tersedia.';
  }

  // =========================
  // KEMBALI
  // =========================

  kembali() {
    this.router.navigate(['/history']);
  }
}
