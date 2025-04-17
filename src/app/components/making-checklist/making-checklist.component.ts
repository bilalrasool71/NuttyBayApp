import { Component } from '@angular/core';
import { UtilsModule } from '../../core/utilities/utils.module';

@Component({
  selector: 'app-making-checklist',
  imports: [UtilsModule],
  templateUrl: './making-checklist.component.html',
  styleUrl: './making-checklist.component.scss'
})
export class MakingChecklistComponent {
  checklistDate = new Date(); // or receive as @Input()
  productName = 'Product ABC'; // or receive as @Input()
  performedBy = 'John Doe'; // or receive as @Input()
  checklist = [
    { step: 'Put on work clothes and shoes (Incl. Hair/Beard Nets) and Follow the hand washing procedure as entering the kitchen.', completed: false },
    { step: 'All work surfaces must be cleaned and sanitised adhering to Food Health and safety Standards before each use.', completed: false },
    { step: 'Check ALL glass jars for imperfections and contaminants before entering the kitchen ensuring that no glass in brought into the kitchen.', remarks: '', completed: false },
    { step: 'Inspect machinery before each use ensuring the maintenance schedule is up to date and is fit for use.', remarks: '', completed: false },
    { step: 'Sanitise and dry any equipment that will be used before each use.', remarks: '', completed: false },
    { step: 'Sanitise ALL glass jars and check its integrity before any product is deposited.', remarks: '', completed: false },
    { step: 'Inspect any fresh ingredients used for contaminants before use.', remarks: '', completed: false },
    { step: 'Seal products and store them in their designated areas. ( Ferment room / Cool room )', remarks: '', completed: false },
    { step: 'If FERMENTING is required ensure that the room temperature is set to the appropriate settings.', remarks: '', completed: false },
    { step: 'After use clean all work surfaces and equipment with disinfectant and a sanitiser.', remarks: '', completed: false },
  ];

  saveChecklist() {

  }
}
