import { Component, OnInit, ViewChild } from '@angular/core';
import { AgencyService } from '../services/agency.service';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertService } from '../services/alert.service';

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
  isLoading = false; // Add for loading agencies

  @ViewChild('modal') modal: any;

  constructor(
    private agencyService: AgencyService,
    private alertController: AlertController,
    private modalController: ModalController,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadAgencies();
  }

  loadAgencies() {
    this.isLoading = true; // Start loading
    this.agencyService.getAgencies().subscribe({
      next: (res) => {
        this.agencies = res; // Array from /api/agencies with agency_id NULL for superuser
        this.isLoading = false; // End loading
      },
      error: async (err) => {
        await this.alertService.showError('Error loading agencies', err);
        this.isLoading = false; // End loading
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
    this.isSaving = true; // Start loading, disable button
    if (this.isEdit && this.selectedAgency.id) {
      this.agencyService.updateAgency(this.selectedAgency.id, this.selectedAgency).subscribe({
        next: async (res) => {
          await this.alertService.showSuccess('Agency updated');
          this.loadAgencies();
          this.closeModal();
          this.isSaving = false; // End loading
        },
        error: async (err) => {
          await this.alertService.showError('Error updating agency', err);
          this.isSaving = false; // End loading
        }
      });
    } else {
      this.agencyService.createAgency(this.selectedAgency).subscribe({
        next: async (res) => {
          await this.alertService.showSuccess('Agency created');
          this.loadAgencies();
          this.closeModal();
          this.isSaving = false; // End loading
        },
        error: async (err) => {
          await this.alertService.showError('Error creating agency', err);
          this.isSaving = false; // End loading
        }
      });
    }
  }

  async deleteAgency(id: number | undefined) {
    if (id === undefined) return; // Guard for undefined id

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
                await this.alertService.showError('Error deleting agency', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}