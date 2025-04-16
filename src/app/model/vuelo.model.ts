import { Avion } from "./avion.model";
import { Itinerario } from "./itinerario.model";
import { Mision } from "./mision.model";
import { Tripulantes } from "./Tripulantes.model";

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
    tripulantes: Tripulantes[];
}