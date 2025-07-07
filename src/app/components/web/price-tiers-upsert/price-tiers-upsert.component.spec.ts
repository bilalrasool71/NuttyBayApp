import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTiersUpsertComponent } from './price-tiers-upsert.component';

describe('PriceTiersUpsertComponent', () => {
  let component: PriceTiersUpsertComponent;
  let fixture: ComponentFixture<PriceTiersUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceTiersUpsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceTiersUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
