import { Rango } from "./rango.model";

export interface Tripulantes {
    id?: number;
    email:string;
    contrasena:string;
    nombre: string;
    apellidos:string;
    rango: Rango;
    grupo_sanguineo: string;
    antiguedad: string;
    horas_vuelo: number;
  }