import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'Ala70';
  router: any;
  
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
  
  goBack(): void {
    const tienePermisos = localStorage.getItem('permisos') === 'true';
    this.router.navigate([tienePermisos ? '/homePermisos' : '/home']);
  }
  
}
