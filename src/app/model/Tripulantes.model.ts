import { GrupoSanguineo } from "./grupo-sanguineo.model";
import { Medalla } from "./medalla.model";
import { Oficio } from "./oficio.model";
import { Rango } from "./rango.model";
import { Vuelo } from "./vuelo.model";

export interface Tripulantes {
  id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  contrasena: string;
  antiguedad: string;
  permisos: boolean;
  horas_totales: string;
  rango: Rango;          // Objeto completo
  grupoSanguineo: GrupoSanguineo;  // Objeto completo
  oficio: Oficio;
  medallas: any[];
  vuelos: any[];
}