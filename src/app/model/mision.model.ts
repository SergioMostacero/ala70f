import { Vuelo } from "./vuelo.model";

export interface Mision {
    id: number;
    nombre: string;
    vuelos: Vuelo[];
  }