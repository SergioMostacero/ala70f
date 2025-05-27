import { UrlSegment, UrlMatchResult } from '@angular/router';
import { inject } from '@angular/core';
import { RouteEncoderService } from '../Services/route-encoder.service';

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
  vuelo: 'vuelo',                
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

  if (!decoded || !(decoded in routeMap)) return null;

  return {
    consumed: [segments[0]],                 
    posParams: {                             
      real: new UrlSegment(routeMap[decoded], {})
    }
  };
}
