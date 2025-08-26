import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchHoldingComponent } from './batch-holding.component';

describe('BatchHoldingComponent', () => {
  let component: BatchHoldingComponent;
  let fixture: ComponentFixture<BatchHoldingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchHoldingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchHoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
