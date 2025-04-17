import { Component } from '@angular/core';
import { UtilsModule } from '../../core/utilities/utils.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-param-form',
  imports: [UtilsModule],
  templateUrl: './param-form.component.html',
  styleUrl: './param-form.component.scss'
})
export class ParamFormComponent {
  paramForm !: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.paramForm = this.fb.group({
      date: [new Date(), Validators.required],
      product: ['', Validators.required],
      userid: [2, Validators.required],
    })
  }

  onParamSave() {
    console.log(this.paramForm.value);
    this.router.navigate(['making-checklist'])
  }

  products= [
    { name: 'Product 1', code: 1 },
    { name: 'Product 2', code: 2 },
    { name: 'Product 3', code: 3 },
    { name: 'Product 4', code: 4 },
    { name: 'Product 5', code: 5 }

  ]

  options: any[] = [
    {
      label: 'Create Production Run',
      value: 1
    },
    {
      label: 'List Production Run',
      value: 2
    }
  ]
}
