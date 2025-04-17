import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingChecklistComponent } from './packing-checklist.component';

describe('PackingChecklistComponent', () => {
  let component: PackingChecklistComponent;
  let fixture: ComponentFixture<PackingChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackingChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackingChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
