import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  scan(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post('http://127.0.0.1:8000/api/scan', formData);
  }

  getHistory() {
    return this.http.get('http://127.0.0.1:8000/api/history');
  }

  delete(id: number) {
    return this.http.delete(`http://127.0.0.1:8000/api/history/${id}`);
  }
}
