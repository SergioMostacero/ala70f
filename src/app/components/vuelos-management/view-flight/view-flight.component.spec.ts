import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFlightComponent } from './view-flight.component';

describe('ViewFlightComponent', () => {
  let component: ViewFlightComponent;
  let fixture: ComponentFixture<ViewFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFlightComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
