import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePackingChecklistComponent } from './pre-packing-checklist.component';

describe('PrePackingChecklistComponent', () => {
  let component: PrePackingChecklistComponent;
  let fixture: ComponentFixture<PrePackingChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrePackingChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrePackingChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
