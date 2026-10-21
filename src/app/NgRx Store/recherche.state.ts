import { ResultatNominatim } from '../models/resultat-nominatim';

export interface RechercheState {
  villes: ResultatNominatim[];
  villeSelectionne: string | null ;
  restaurants: string[];
  restaurantSelectionne: string | null ;
}