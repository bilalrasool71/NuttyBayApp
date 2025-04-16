import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakingChecklistComponent } from './making-checklist.component';

describe('MakingChecklistComponent', () => {
  let component: MakingChecklistComponent;
  let fixture: ComponentFixture<MakingChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakingChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakingChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
