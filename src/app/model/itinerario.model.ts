import { ItinerarioUbicacion } from "./Iitinerario-ubicacion.model";

export interface Itinerario {
    id: number;
    nombre: string;
    duracion: string;
    itinerariosUbicaciones: ItinerarioUbicacion[];
  }