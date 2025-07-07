import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionSummaryReportComponent } from './production-summary-report.component';

describe('ProductionSummaryReportComponent', () => {
  let component: ProductionSummaryReportComponent;
  let fixture: ComponentFixture<ProductionSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionSummaryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
