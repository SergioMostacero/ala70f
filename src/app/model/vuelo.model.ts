import { Avion } from "./avion.model";
import { Itinerario } from "./itinerario.model";
import { Mision } from "./mision.model";
import { Tripulantes } from "./Tripulantes.model";

export interface Vuelo {
  id: number;
  fecha_salida: string;
  hora_salida: string;
  fecha_llegada: string;
  hora_llegada: string;
  anticipo: string;
  combustible: number;

  avionDTO?: { id: number; max_combustible?: number };
  misionDTO?: { id: number };
  itinerarioDTO?: { id: number; duracion?: string };

  tripulantesDTO?: {
    id: number;
    oficioDTO: { nombre: string };
  }[];
}

  