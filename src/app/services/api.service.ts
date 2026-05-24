import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  // =========================================
  // URL BACKEND LARAVEL HOSTINGER
  // =========================================

  // GANTI DENGAN DOMAIN BACKEND LARAVEL
  // CONTOH:
  // https://api-terbenturid.site/api

  baseUrl = 'https://terbentur.id/api';

  constructor(
    private http: HttpClient
  ) {}

  // =========================================
  // AMBIL DEVICE ID
  // =========================================

  async getDeviceId(): Promise<string> {

    try {

      const info = await Device.getId();

      return info.identifier;

    } catch (e) {

      console.log('Device Error:', e);

      return 'unknown-device';
    }
  }

  // =========================================
  // SCAN AI
  // =========================================

  async scan(file: Blob) {

    try {

      // ambil device id
      const deviceId = await this.getDeviceId();

      // form data
      const formData = new FormData();

      formData.append(
        'image',
        file,
        'image.jpg'
      );

      formData.append(
        'device_id',
        deviceId
      );

      // request ke laravel
      const response = await firstValueFrom(

        this.http.post(

          `${this.baseUrl}/scan`,

          formData

        )
      );

      return response;

    } catch (error) {

      console.log('SCAN ERROR:', error);

      throw error;
    }
  }

  // =========================================
  // HISTORY DEVICE
  // =========================================

  async getHistory() {

    try {

      const deviceId = await this.getDeviceId();

      const response = await firstValueFrom(

        this.http.get(

          `${this.baseUrl}/history/${deviceId}`

        )
      );

      return response;

    } catch (error) {

      console.log('HISTORY ERROR:', error);

      throw error;
    }
  }

  // =========================================
  // DETAIL HISTORY
  // =========================================

  async getDetail(id: number) {

    try {

      const response = await firstValueFrom(

        this.http.get(

          `${this.baseUrl}/detail/${id}`

        )
      );

      return response;

    } catch (error) {

      console.log('DETAIL ERROR:', error);

      throw error;
    }
  }

  // =========================================
  // DELETE HISTORY
  // =========================================

  async delete(id: number) {

    try {

      const response = await firstValueFrom(

        this.http.delete(

          `${this.baseUrl}/history/${id}`

        )
      );

      return response;

    } catch (error) {

      console.log('DELETE ERROR:', error);

      throw error;
    }
  }
}
