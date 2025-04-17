import { Component } from '@angular/core';
import { UtilsModule } from '../../core/utilities/utils.module';

@Component({
  selector: 'app-after-login-page',
  imports: [UtilsModule],
  templateUrl: './after-login-page.component.html',
  styleUrl: './after-login-page.component.scss'
})
export class AfterLoginPageComponent {

  products: any[] = [{ productName: 'This is Product ABC 1', completed: false, date: '12-03-2025', checklists: [{name: 'Pre-Making Checklist', url: '', isDone: true}, {name: 'Making Checklist', url: '', isDone: false}, {name: 'Pre-Packing Checklist', url: '', isDone: false}, {name: 'Packing Checklist', url: '', isDone: false}] }, { productName: 'This is Product ABC 3', completed: false, date: '12-06-2025', checklists: [{name: 'Pre-Making Checklist', url: '', isDone: true}, {name: 'Making Checklist', url: '', isDone: false}, {name: 'Pre-Packing Checklist', url: '', isDone: false}, {name: 'Packing Checklist', url: '', isDone: false}] }]

}
