import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Add CUSTOM_ELEMENTS_SCHEMA
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UserPage } from './user.page';
import { UserPageRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPageRoutingModule
  ],
  declarations: [UserPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add this to suppress Web Component binding errors
})
export class UserPageModule {}