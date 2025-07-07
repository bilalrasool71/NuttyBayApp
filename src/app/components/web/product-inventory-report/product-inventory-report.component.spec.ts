import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInventoryReportComponent } from './product-inventory-report.component';

describe('ProductInventoryReportComponent', () => {
  let component: ProductInventoryReportComponent;
  let fixture: ComponentFixture<ProductInventoryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInventoryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductInventoryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
