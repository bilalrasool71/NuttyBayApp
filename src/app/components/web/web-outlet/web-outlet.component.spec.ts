import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebOutletComponent } from './web-outlet.component';

describe('WebOutletComponent', () => {
  let component: WebOutletComponent;
  let fixture: ComponentFixture<WebOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebOutletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
