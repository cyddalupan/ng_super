import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Add this import
import { FormsModule } from '@angular/forms';
import { AgencyPage } from './agency.page';
import { AgencyPageRoutingModule } from './agency-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,  // Enables ion-loading and bindings for loading during backend calls
    AgencyPageRoutingModule
  ],
  declarations: [AgencyPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AgencyPageModule {}