import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTierAddComponent } from './price-tier-add.component';

describe('PriceTierAddComponent', () => {
  let component: PriceTierAddComponent;
  let fixture: ComponentFixture<PriceTierAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceTierAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceTierAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
