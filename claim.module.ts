import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicDetailsComponent } from './basic-details/basic-details.component';
import { MedicineDetailsComponent } from './medicine-details/medicine-details.component';
import { LabDetailsComponent } from './lab-details/lab-details.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReportComponent } from './report/report.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';




@NgModule({
  declarations: [
    BasicDetailsComponent,
    MedicineDetailsComponent,
    LabDetailsComponent,
    ReportComponent
    
  ],
  imports: [
    CommonModule,RouterModule,ReactiveFormsModule,FormsModule, FontAwesomeModule
  ],
  exports:[
    BasicDetailsComponent,
    MedicineDetailsComponent,
    LabDetailsComponent
  ]
})
export class ClaimModule { }
