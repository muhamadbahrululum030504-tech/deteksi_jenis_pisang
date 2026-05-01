import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-history',
  standalone: true,
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  imports: [IonicModule, CommonModule, RouterModule, NgFor, NgIf, FormsModule]
})
export class HistoryPage implements OnInit {

  history: any[] = [];
  filtered: any[] = [];
  loading = true;

  // 🔎 search + filter
  keyword = '';
  filter: 'all' | 'high' | 'medium' | 'low' = 'all';

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getHistory().subscribe({
      next: (res: any) => {
        this.history = res.data || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        alert('Gagal ambil data');
        this.loading = false;
      }
    });
  }

  // 🔎 FILTER + SEARCH
  applyFilter() {
    const kw = this.keyword.toLowerCase();

    this.filtered = this.history.filter(item => {
      const matchText =
        (item.result || '').toLowerCase().includes(kw);

      let matchConf = true;
      if (this.filter === 'high') matchConf = item.confidence > 80;
      if (this.filter === 'medium') matchConf = item.confidence <= 80 && item.confidence > 50;
      if (this.filter === 'low') matchConf = item.confidence <= 50;

      return matchText && matchConf;
    });
  }

  onSearch(ev: any) {
    this.keyword = ev.detail.value || '';
    this.applyFilter();
  }

  setFilter(f: 'all' | 'high' | 'medium' | 'low') {
    this.filter = f;
    this.applyFilter();
  }

  // 🧭 NAVIGATE DETAIL
  goDetail(item: any) {
    this.router.navigate(['/detail'], {
      state: { data: item }
    });
  }

  // 🗑️ DELETE
  delete(id: number) {
    this.api.delete(id).subscribe(() => this.loadData());
  }

  clearAll() {
    if (confirm('Hapus semua riwayat?')) {
      this.history.forEach(i => this.api.delete(i.id).subscribe());
      this.loadData();
    }
  }

  // 🎯 UTIL
  getConfidenceClass(conf: number) {
    if (conf > 80) return 'high';
    if (conf > 50) return 'medium';
    return 'low';
  }

  getConfidenceIcon(conf: number) {
    if (conf > 80) return 'checkmark-circle';
    if (conf > 50) return 'alert-circle';
    return 'close-circle';
  }

  getNamaPisang(result: string) {
    const map: any = {
      ambon: '🍌 Pisang Ambon',
      raja: '🍌 Pisang Raja',
      muli: '🍌 Pisang Muli',
      tanduk: '🍌 Pisang Tanduk'
    };
    return map[result] || result;
  }

  getBananaInfo(result: string) {
    const info: any = {
      ambon: 'Manis dan lembut.',
      raja: 'Cocok digoreng.',
      muli: 'Kecil dan manis.',
      tanduk: 'Besar untuk olahan.'
    };
    return info[result] || '-';
  }
}