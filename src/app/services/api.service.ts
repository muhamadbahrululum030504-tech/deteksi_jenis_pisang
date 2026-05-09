import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'https://threekey.fun/api';

  constructor(private http: HttpClient) {}

  // =========================
  // GET DEVICE ID
  // =========================
  async getDeviceId() {

    let { value } = await Preferences.get({
      key: 'device_id'
    });

    if (!value) {

      value =
        'device_' +
        Math.random().toString(36).substring(2) +
        Date.now();

      await Preferences.set({
        key: 'device_id',
        value
      });
    }

    return value;
  }

  // =========================
  // SCAN
  // =========================
  async scan(file: File) {

    const deviceId = await this.getDeviceId();

    const formData = new FormData();

    formData.append('image', file);

    formData.append('device_id', deviceId);

    return this.http.post(
      `${this.baseUrl}/scan`,
      formData
    );
  }

  // =========================
  // HISTORY
  // =========================
  async getHistory() {

    const deviceId = await this.getDeviceId();

    return this.http.get(
      `${this.baseUrl}/history?device_id=${deviceId}`
    );
  }

  // =========================
  // DELETE
  // =========================
  delete(id: number) {

    return this.http.delete(
      `${this.baseUrl}/history/${id}`
    );
  }
}
