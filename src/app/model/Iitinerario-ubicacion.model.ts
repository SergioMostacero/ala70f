import { Itinerario } from "./itinerario.model";

export interface ItinerarioUbicacion {
    id: number;
    orden: number;
    itinerario: Itinerario;
    itinerarioUbicacion: ItinerarioUbicacion;
    
  }