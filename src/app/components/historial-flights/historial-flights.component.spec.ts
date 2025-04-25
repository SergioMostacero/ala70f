import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialFlightsComponent } from './historial-flights.component';

describe('HistorialFlightsComponent', () => {
  let component: HistorialFlightsComponent;
  let fixture: ComponentFixture<HistorialFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistorialFlightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
