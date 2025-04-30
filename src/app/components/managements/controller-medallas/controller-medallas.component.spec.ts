import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerMedallasComponent } from './controller-medallas.component';

describe('ControllerMedallasComponent', () => {
  let component: ControllerMedallasComponent;
  let fixture: ComponentFixture<ControllerMedallasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControllerMedallasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllerMedallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
