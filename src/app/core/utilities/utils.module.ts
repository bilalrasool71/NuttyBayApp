import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { Menubar } from 'primeng/menubar';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Menubar
  ],
  exports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule,
    DatePickerModule,
    SelectModule,
    SelectButtonModule,
    TableModule,
    TabsModule,
    Menubar,
    CheckboxModule,
    TagModule,
    CardModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UtilsModule { }
