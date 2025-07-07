import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWiseProductionReportComponent } from './product-wise-production-report.component';

describe('ProductWiseProductionReportComponent', () => {
  let component: ProductWiseProductionReportComponent;
  let fixture: ComponentFixture<ProductWiseProductionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductWiseProductionReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductWiseProductionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
