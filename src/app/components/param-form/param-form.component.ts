import { Component } from '@angular/core';
import { UtilsModule } from '../../core/utilities/utils.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-param-form',
  imports: [UtilsModule],
  templateUrl: './param-form.component.html',
  styleUrl: './param-form.component.scss'
})
export class ParamFormComponent {
  paramForm !: FormGroup;

  constructor(private fb: FormBuilder) {
    this.paramForm = this.fb.group({
      date: [new Date(), Validators.required],
      product: ['', Validators.required],
      userid: [2, Validators.required],
    })
  }

  onParamSave() {
    console.log(this.paramForm.value)
  }

  cities= [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }

  ]
}
