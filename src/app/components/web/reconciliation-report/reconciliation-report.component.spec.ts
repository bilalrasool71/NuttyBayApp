import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationReportComponent } from './reconciliation-report.component';

describe('ReconciliationReportComponent', () => {
  let component: ReconciliationReportComponent;
  let fixture: ComponentFixture<ReconciliationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReconciliationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReconciliationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
