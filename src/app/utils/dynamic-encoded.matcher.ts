import { UrlSegment, UrlMatchResult } from '@angular/router';
import { inject } from '@angular/core';
import { RouteEncoderService } from '../Services/route-encoder.service';

/** Diccionario clave → ruta real */
const routeMap: Record<string, string> = {
  login: 'login',
  register: 'register',
  homePermisos: 'home-permisos',
  'logros-medallas': 'logros-medallas',
  management: 'management',
  'create-user': 'create-user',
  'edit-user': 'edit-user',
  flights: 'flights',
  'register-flights': 'register-flights',
  historial: 'historial',
  vuelo: 'vuelo',                     // el :id se deja para el router
  'controller-medallas': 'controller-medallas',
  'create-job': 'create-job',
  'edit-job': 'edit-job',
  'create-itinerary': 'create-itinerary',
  destinos: 'destinos'
};

export function dynamicEncodedMatcher(
  segments: UrlSegment[]
): UrlMatchResult | null {
  if (!segments.length) return null;

  const encoder = inject(RouteEncoderService);
  const decoded = encoder.decode(segments[0].path);

  // Si no se reconoce, dejamos al router seguir probando
  if (!decoded || !(decoded in routeMap)) return null;

  // ⚠️ NO ponemos redirectTo aquí
  return {
    consumed: [segments[0]],                 // solo el primer segmento
    posParams: {                             // lo exponemos como parámetro
      real: new UrlSegment(routeMap[decoded], {})
    }
  };
}
