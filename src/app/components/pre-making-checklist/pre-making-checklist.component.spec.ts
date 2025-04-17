import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreMakingChecklistComponent } from './pre-making-checklist.component';

describe('PreMakingChecklistComponent', () => {
  let component: PreMakingChecklistComponent;
  let fixture: ComponentFixture<PreMakingChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreMakingChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreMakingChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
