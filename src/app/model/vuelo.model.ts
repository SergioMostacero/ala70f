import { Avion } from "./avion.model";
import { Itinerario } from "./itinerario.model";
import { Mision } from "./mision.model";
import { Tripulantes } from "./Tripulantes.model";

export interface Vuelo {
    id: number;
    fecha_salida: string;        // formato: 'YYYY-MM-DD', como '2025-05-01'
    hora_salida: string;         // formato: 'HH:mm', como '08:30'
    fecha_llegada: string;       // formato: 'YYYY-MM-DD'
    hora_llegada: string;        // formato: 'HH:mm'
    anticipo: string;
    combustible: number;
    avionDTO: { id: number };
    misionDTO: { id: number };
    itinerarioDTO: { id: number };
    tripulantesDTO?: { id: number }[];
  }
  