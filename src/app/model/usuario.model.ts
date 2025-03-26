import { Destino } from "./destino.model";
import { Rango } from "./rango.model";

export interface Usuario {
    id?: number;
    email:string;
    password:string;
    nombre: string;
    apellido1: string;
    apellido2: string;
    destino: Destino;
    rango: Rango;
    grupo_sanguineo: string;
    antiguedad: string;
    horas_vuelo: number;
  }