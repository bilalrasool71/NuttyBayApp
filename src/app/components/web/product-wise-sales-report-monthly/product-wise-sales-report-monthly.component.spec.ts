import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWiseSalesReportMonthlyComponent } from './product-wise-sales-report-monthly.component';

describe('ProductWiseSalesReportMonthlyComponent', () => {
  let component: ProductWiseSalesReportMonthlyComponent;
  let fixture: ComponentFixture<ProductWiseSalesReportMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductWiseSalesReportMonthlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductWiseSalesReportMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
