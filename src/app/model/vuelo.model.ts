import { Avion } from "./avion.model";
import { Itinerario } from "./itinerario.model";
import { Mision } from "./mision.model";

export interface Vuelo {
    id: number;
    localDate: Date;
    horaSalida: string;
    horaLlegada: string;
    anticipo: string;
    gasolina: string;
    avion: Avion;
    mision: Mision;
    itinerario: Itinerario;
}