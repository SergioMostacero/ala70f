import { ItinerarioUbicacion } from "./Iitinerario-ubicacion.model";
import { Vuelo } from "./vuelo.model";

export interface Itinerario {
    id: number;
    nombre: string;
    duracion: string;
    itinerariosUbicaciones: ItinerarioUbicacion[];
    vuelos: Vuelo[];
  }