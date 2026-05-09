import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,

        // 🔥 LANGSUNG KAMERA
        source: CameraSource.Camera,

        // 📱 UX lebih enak
        saveToGallery: false,
        correctOrientation: true,
        width: 1024
      });

      return image.webPath;

    } catch (error) {
      console.error('Camera error:', error);
      return null;
    }
  }
}