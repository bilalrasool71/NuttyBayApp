import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchSalesOrderComponent } from './dispatch-sales-order.component';

describe('DispatchSalesOrderComponent', () => {
  let component: DispatchSalesOrderComponent;
  let fixture: ComponentFixture<DispatchSalesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchSalesOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
