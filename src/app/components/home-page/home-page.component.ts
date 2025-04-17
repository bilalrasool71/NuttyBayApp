import { Component, OnInit } from '@angular/core';
import { UtilsModule } from '../../core/utilities/utils.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'home-page',
  imports: [UtilsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  products: any[] = [{ productName: 'This is Product ABC 1', completed: false, date: '12-03-2025', checklists: [{name: 'Pre-Making Checklist', url: '', isDone: true}, {name: 'Making Checklist', url: '', isDone: false}, {name: 'Pre-Packing Checklist', url: '', isDone: false}, {name: 'Packing Checklist', url: '', isDone: false}] }, { productName: 'This is Product ABC 3', completed: false, date: '12-06-2025', checklists: [{name: 'Pre-Making Checklist', url: '', isDone: true}, {name: 'Making Checklist', url: '', isDone: false}, {name: 'Pre-Packing Checklist', url: '', isDone: false}, {name: 'Packing Checklist', url: '', isDone: false}] }]

  paramForm !: FormGroup;
  users: any;

  apiUrl: string ='https://reqres.in/api';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.paramForm = this.fb.group({
      date: [new Date(), Validators.required],
      product: ['', Validators.required],
      userid: [2, Validators.required],
    })
  }

  ngOnInit(): void {
    this.getUsers2()
  }

  onParamSave() {
    console.log(this.paramForm.value);
    this.router.navigate(['making-checklist'])
  }

  productsforRun= [
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

  getUsers() {
    return this.http.get(`${this.apiUrl}/users?delay=9000`);
  }

  getUsers2() {
    this.getUsers()
    .subscribe((res: any) => {
      const newRes = res.data.concat(res.data);
      this.users = newRes;
      console.log(this.users);
    });
  }
}
