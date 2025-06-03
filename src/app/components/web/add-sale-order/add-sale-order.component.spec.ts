import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSaleOrderComponent } from './add-sale-order.component';

describe('AddSaleOrderComponent', () => {
  let component: AddSaleOrderComponent;
  let fixture: ComponentFixture<AddSaleOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSaleOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSaleOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
