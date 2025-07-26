import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  constructor() { }

  ngOnInit() {
    // Future: Load users from /api/users with agency_id NULL for superuser
  }

}