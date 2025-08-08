import { Component, OnInit, ViewChild } from '@angular/core';
import { AgencyService } from '../services/agency.service';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

interface Agency {
  id?: number;
  name: string;
  address: string;
  contact_email: string;
  contact_phone: string;
}

@Component({
  selector: 'app-agency',
  templateUrl: './agency.page.html',
  styleUrls: ['./agency.page.scss'],
})
export class AgencyPage implements OnInit {
  agencies: Agency[] = [];
  selectedAgency: Agency = { name: '', address: '', contact_email: '', contact_phone: '' };
  isModalOpen = false;
  isEdit = false;
  isSaving = false;
  isTableLoading = false; // For table load
  isButtonLoading = false; // For create button

  @ViewChild('modal') modal: any;

  constructor(
    private agencyService: AgencyService,
    private alertController: AlertController,
    private modalController: ModalController,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAgencies();
  }

  loadAgencies() {
    this.isTableLoading = true; // Start table loading
    this.agencyService.getAgencies().subscribe({
      next: (res) => {
        this.agencies = res;
        this.isTableLoading = false; // End table loading
      },
      error: async (err) => {
        if (err.status === 401) {
          await this.authService.logout();
        } else {
          await this.alertService.showError('Error loading agencies', err);
        }
        this.isTableLoading = false; // End table loading
      }
    });
  }

  openModal(edit = false, agency: Agency | null = null) {
    this.isEdit = edit;
    this.selectedAgency = edit && agency ? { ...agency } : { name: '', address: '', contact_email: '', contact_phone: '' };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async saveAgency() {
    this.isSaving = true; // Start saving
    if (this.isEdit && this.selectedAgency.id) {
      this.agencyService.updateAgency(this.selectedAgency.id, this.selectedAgency).subscribe({
        next: async (res) => {
          await this.alertService.showSuccess('Agency updated');
          this.loadAgencies();
          this.closeModal();
          this.isSaving = false; // End saving
        },
        error: async (err) => {
          if (err.status === 401) {
            await this.authService.logout();
          } else {
            await this.alertService.showError('Error updating agency', err);
          }
          this.isSaving = false; // End saving
        }
      });
    } else {
      this.isButtonLoading = true; // Start button loading for create
      this.agencyService.createAgency(this.selectedAgency).subscribe({
        next: async (res) => {
          await this.alertService.showSuccess('Agency created');
          this.loadAgencies();
          this.closeModal();
          this.isSaving = false;
          this.isButtonLoading = false; // End button loading
        },
        error: async (err) => {
          if (err.status === 401) {
            await this.authService.logout();
          } else {
            await this.alertService.showError('Error creating agency', err);
          }
          this.isSaving = false;
          this.isButtonLoading = false; // End button loading
        }
      });
    }
  }

  async deleteAgency(id: number | undefined) {
    if (id === undefined) return;

    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this agency?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.agencyService.deleteAgency(id).subscribe({
              next: (res) => {
                this.loadAgencies();
              },
              error: async (err) => {
                if (err.status === 401) {
                  await this.authService.logout();
                } else {
                  await this.alertService.showError('Error deleting agency', err);
                }
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}