import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AgencyService } from '../services/agency.service';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

interface User {
  id?: number;
  username: string;
  password?: string;
  email: string;
  user_type: string;
  agency_id: number | null;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  users: User[] = [];
  agencies: any[] = [];
  selectedUser: User = { username: '', password: '', email: '', user_type: 'applicant', agency_id: null };
  isModalOpen = false;
  isEdit = false;
  isSaving = false;
  isTableLoading = false;
  isButtonLoading = false;

  @ViewChild('modal') modal: any;

  constructor(
    private apiService: ApiService,
    private agencyService: AgencyService,
    private alertController: AlertController,
    private modalController: ModalController,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadAgencies();
  }

  loadUsers() {
    this.isTableLoading = true;
    this.apiService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.isTableLoading = false;
      },
      error: async (err) => {
        if (err.status === 401) {
          await this.authService.logout();
        } else {
          await this.alertService.showError('Error loading users', err);
        }
        this.isTableLoading = false;
      }
    });
  }

  loadAgencies() {
    this.agencyService.getAgencies().subscribe({
      next: (res) => {
        console.log('Agencies loaded:', res);
        this.agencies = res || [];
      },
      error: async (err) => {
        console.error('Error loading agencies:', err);
        if (err.status === 401) {
          await this.authService.logout();
        } else {
          await this.alertService.showError('Error loading agencies', err);
        }
        this.agencies = [];
      }
    });
  }

  getAgencyName(agencyId: number | null): string {
    if (!agencyId) return 'None';
    const agency = this.agencies.find(a => a.id === agencyId);
    return agency ? agency.name : 'None';
  }

  openModal(edit = false, user: User | null = null) {
    if (this.agencies.length === 0) {
      console.log('No agencies, retrying loadAgencies');
      this.loadAgencies();
    }
    this.isEdit = edit;
    this.selectedUser = edit && user ? { ...user } : { username: '', password: '', email: '', user_type: 'applicant', agency_id: null };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async saveUser() {
    this.isSaving = true;
    if (this.isEdit && this.selectedUser.id) {
      this.apiService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: async (res) => {
          await this.alertService.showSuccess('User updated');
          this.loadUsers();
          this.closeModal();
          this.isSaving = false;
        },
        error: async (err) => {
          if (err.status === 401) {
            await this.authService.logout();
          } else {
            await this.alertService.showError('Error updating user', err);
          }
          this.isSaving = false;
        }
      });
    } else {
      this.isButtonLoading = true;
      this.apiService.createUser(this.selectedUser).subscribe({
        next: async (res) => {
          await this.alertService.showSuccess('User created');
          this.loadUsers();
          this.closeModal();
          this.isSaving = false;
          this.isButtonLoading = false;
        },
        error: async (err) => {
          if (err.status === 401) {
            await this.authService.logout();
          } else {
            await this.alertService.showError('Error creating user', err);
          }
          this.isSaving = false;
          this.isButtonLoading = false;
        }
      });
    }
  }

  async deleteUser(id: number | undefined) {
    if (id === undefined) return;

    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.apiService.deleteUser(id).subscribe({
              next: (res) => {
                this.loadUsers();
              },
              error: async (err) => {
                if (err.status === 401) {
                  await this.authService.logout();
                } else {
                  await this.alertService.showError('Error deleting user', err);
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