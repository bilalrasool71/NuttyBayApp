import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalesReportComponent } from './monthly-sales-report.component';

describe('MonthlySalesReportComponent', () => {
  let component: MonthlySalesReportComponent;
  let fixture: ComponentFixture<MonthlySalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlySalesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlySalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
