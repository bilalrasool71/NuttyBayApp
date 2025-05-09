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
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepperModule } from 'primeng/stepper';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { SliderModule } from 'primeng/slider';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Menubar,
    ConfirmDialog,
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
    ProgressBarModule,
    InputNumberModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    StepperModule,
    ToastModule,
    AvatarModule,
    MenuModule,
    ChipModule,
    DividerModule,
    SliderModule,
    AccordionModule,
    ConfirmDialog,
    MessageModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ]
})
export class UtilsModule { }
