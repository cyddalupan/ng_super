import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AlertController, ModalController } from '@ionic/angular';

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

  @ViewChild('modal') modal: any;

  constructor(private apiService: ApiService, private alertController: AlertController, private modalController: ModalController) {}

  ngOnInit() {
    this.loadUsers();
    this.loadAgencies(); // For create/update form
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (res) => {
        this.users = res; // Array from /api/users with agency_id filtering from JWT
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  loadAgencies() {
    this.apiService.getAgencies().subscribe({
      next: (res) => {
        this.agencies = res; // Array from /api/agencies for agency_id select (superuser sees all with agency_id NULL)
      },
      error: (err) => {
        console.error('Error loading agencies', err);
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

  saveUser() {
    if (this.isEdit) {
      this.apiService.updateUser(this.selectedUser.id!, this.selectedUser).subscribe({
        next: (res) => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error updating user', err);
        }
      });
    } else {
      this.apiService.createUser(this.selectedUser).subscribe({
        next: (res) => {
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating user', err);
        }
      });
    }
  }

  async deleteUser(id: number) {
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
              error: (err) => {
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