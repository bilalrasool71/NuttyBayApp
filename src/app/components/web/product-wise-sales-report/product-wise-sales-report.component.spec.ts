import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWiseSalesReportComponent } from './product-wise-sales-report.component';

describe('ProductWiseSalesReportComponent', () => {
  let component: ProductWiseSalesReportComponent;
  let fixture: ComponentFixture<ProductWiseSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductWiseSalesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductWiseSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
