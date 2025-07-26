import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment'; // Add for dev mode

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private toastController: ToastController) {}

  async showError(message: string, debugInfo: any = null, duration: number = 5000) {
    let fullMessage = message;
    if (debugInfo && !environment.production) { // Show debug only in dev
      fullMessage += '\n\nDebug Info (copy this):\n' + JSON.stringify(debugInfo, null, 2);
    }
    const toast = await this.toastController.create({
      message: fullMessage,
      duration: duration,
      position: 'bottom',
      buttons: [
        {
          text: 'Copy',
          handler: () => {
            navigator.clipboard.writeText(fullMessage);
            return false; // Keep toast open
          }
        },
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  async showSuccess(message: string, duration: number = 3000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}