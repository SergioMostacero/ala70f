import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePermisosComponent } from './homePermisos.component';

describe('HomeComponent', () => {
  let component: HomePermisosComponent;
  let fixture: ComponentFixture<HomePermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePermisosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
