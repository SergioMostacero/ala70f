import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Ala70';
  router: any;
  
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
  
  goBack() {
    const tienePermisos = localStorage.getItem('permisos') === 'true';
  
    if (tienePermisos) {
      this.router.navigate(['/homePermisos']);
    } else {
      this.router.navigate(['/home']);
    }
  }
  
}
