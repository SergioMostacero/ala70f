
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RouteEncoderService {
  private readonly prefix = 'app_';

  encode(route: string): string {
    const encoded = btoa(this.prefix + route);
    return encoded.replace(/=/g, '');
  }

  decode(encodedRoute: string): string {
    try {
      const decoded = atob(encodedRoute);
      return decoded.replace(this.prefix, '');
    } catch (e) {
      return ''; // Ruta no válida
    }
  }

  encodeWithParam(route: string, param: string | number): string[] {
    return [this.encode(route), param.toString()]; // Mantener parámetro sin cifrar
  }

    decodeToNumber(encodedValue: string): number | null {
        try {
            const decoded = atob(encodedValue).replace(this.prefix, '');
            const number = parseInt(decoded, 10);
            return isNaN(number) ? null : number;
        } catch (e) {
            return null;
        }
    }
}