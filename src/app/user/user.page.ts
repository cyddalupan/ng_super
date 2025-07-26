import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { AlertService } from '../services/alert.service'; // Add for error/success toast

interface User {
  id?: number;
  username: string;
  password?: string; // Optional for update
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
  isSaving = false; // For loading indicator and button disable

  @ViewChild('modal') modal: any;

  constructor(private apiService: ApiService, private alertController: AlertController, private modalController: ModalController, private alertService: AlertService) {} // Add AlertService

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (res: User[]) => {
        this.users = res; // Array from /api/users with agency_id filtering from JWT
      },
      error: (err: any) => {
        console.error('Error loading users', err);
      }
    });
  }

  openModal(edit = false, user: User | null = null) {
    this.isEdit = edit;
    this.selectedUser = edit && user ? { ...user } : { username: '', password: '', email: '', user_type: 'applicant', agency_id: null };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async saveUser() {
    this.isSaving = true; // Start loading, disable button
    if (this.isEdit && this.selectedUser.id) {
      this.apiService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: async (res: any) => {
          await this.alertService.showSuccess('User updated');
          this.loadUsers();
          this.closeModal();
          this.isSaving = false; // End loading
        },
        error: async (err: any) => {
          await this.alertService.showError('Error updating user', err);
          this.isSaving = false; // End loading
        }
      });
    } else {
      this.apiService.createUser(this.selectedUser).subscribe({
        next: async (res: any) => {
          await this.alertService.showSuccess('User created');
          this.loadUsers();
          this.closeModal();
          this.isSaving = false; // End loading
        },
        error: async (err: any) => {
          await this.alertService.showError('Error creating user', err);
          this.isSaving = false; // End loading
        }
      });
    }
  }

  async deleteUser(id: number | undefined) {
    if (id === undefined) return; // Guard for undefined id

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
              next: (res: any) => {
                this.loadUsers();
              },
              error: (err: any) => {
                console.error('Error deleting user', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}