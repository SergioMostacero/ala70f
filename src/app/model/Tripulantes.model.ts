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
  antiguedad: Date;
  permisos: boolean;
  horas_totales: string;
  rango: Rango;        
  grupoSanguineo: GrupoSanguineo; 
  oficio: Oficio;
  medallas: Medalla[];
  vuelos: Vuelo[];
}