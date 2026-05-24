import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HistoryPage implements OnInit {

  history: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  async ngOnInit() {
    await this.loadHistory();
  }

  async ionViewWillEnter() {
    await this.loadHistory();
  }

  // =========================
  // LOAD HISTORY
  // =========================
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

  // =========================
  // DETAIL
  // =========================
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

  // =========================
  // DELETE
  // =========================
  async hapusRiwayat(id: number) {

    try {

      await this.api.delete(id);

      await this.loadHistory();

    } catch (error) {

      console.log('DELETE ERROR:', error);
    }
  }
}