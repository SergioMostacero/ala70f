import { Vuelo } from "./vuelo.model";

export interface Avion {
    id: number;
    nombre: string;
    vuelos: Vuelo[];
  }