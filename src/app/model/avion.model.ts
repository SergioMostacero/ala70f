import { Vuelo } from "./vuelo.model";

export interface Avion {
    id: number;
    nombre: string;
    max_combustible: number;
    vuelos: Vuelo[];
  }