import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingToDispatchOrdersComponent } from './pending-to-dispatch-orders.component';

describe('PendingToDispatchOrdersComponent', () => {
  let component: PendingToDispatchOrdersComponent;
  let fixture: ComponentFixture<PendingToDispatchOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingToDispatchOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingToDispatchOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
