import { Component } from '@angular/core';
import { UtilsModule } from '../../core/utilities/utils.module';

@Component({
  selector: 'app-pre-packing-checklist',
  imports: [UtilsModule],
  templateUrl: './pre-packing-checklist.component.html',
  styleUrl: './pre-packing-checklist.component.scss'
})
export class PrePackingChecklistComponent {
    phLevel: number = 0;
    temperature: number = 0;
    time: number = 0;
}
