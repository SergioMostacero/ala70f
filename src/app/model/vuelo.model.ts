import { Avion } from "./avion.model";
import { Itinerario } from "./itinerario.model";
import { Mision } from "./mision.model";
import { Tripulantes } from "./Tripulantes.model";

export interface Vuelo {
    id: number;
    fecha: string;        
    hora_salida: string;   
    hora_llegada: string;   
    anticipo: string;
    gasolina: string;
    avionDTO: { id: number };  
    misionDTO: { id: number };  
    itinerarioDTO: { id: number };  
    tripulantesDTO?: any[];  
}