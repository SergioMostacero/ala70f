import { ItinerarioUbicacion } from "./Iitinerario-ubicacion.model";

export interface Ubicacion {
    id: number;
    paisCodigo: string;
    pais: string;
    ciudad: string;
    zonaHoraria: string;
    latitud: string;
    longitud: string;
    itinerarioUbicaciones: ItinerarioUbicacion[];

}