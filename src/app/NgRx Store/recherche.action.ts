import { createAction, props } from '@ngrx/store';
import { ResultatNominatim } from '../models/resultat-nominatim';


export const chargerVilles = createAction(
  '[Recherche] Charger ville',
  props<{ villes: ResultatNominatim[];}>()
);

export const selectionnerVille = createAction(
  '[Affiche] Selectionner ville',
  props<{ villeSelectionne: string;}>()
);


export const chargerRestaurants = createAction(
  '[Recherche] Charger restaurants',
  props<{ restaurants: string[];}>()
);

export const selectionnerRestaurant = createAction(
  '[Affiche] Selectionner restaurant',
  props<{ restaurantSelectionne: string;}>()
);