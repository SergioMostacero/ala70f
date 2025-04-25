import { GrupoSanguineo } from "./grupo-sanguineo.model";
import { Medalla } from "./medalla.model";
import { Oficio } from "./oficio.model";
import { Rango } from "./rango.model";
import { Vuelo } from "./vuelo.model";

export interface GrupoSanguineoDTO { id: number; tipo: string; }
export interface RangoDTO           { id: number; nombre: string; }
export interface OficioDTO { id: number; nombre: string; }

export interface Tripulantes {
  id?: number;               
  nombre: string;
  apellidos: string;
  email: string;
  contrasena: string;
  antiguedad: string;         
  permisos: boolean;
  horas_totales: number;

  grupoSanguineoDTO: GrupoSanguineoDTO;
  rangoDTO: RangoDTO;
  oficioDTO: OficioDTO;

  medallasDTO?: any[];
  vuelosDTO?:   any[];
}