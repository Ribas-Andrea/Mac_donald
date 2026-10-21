import { createSelector } from "@ngrx/store";
import { RechercheState } from "./recherche.state";


interface AppState {
  recherche: RechercheState;
}

export const selectRechercheState = (state: AppState) => state.recherche;

export const afficheVilles = createSelector(
  selectRechercheState,
  (state) => state.villes
);

export const selectVille = createSelector(
  selectRechercheState,
  (state) => state.villeSelectionne
);

export const afficheRestaurants = createSelector(
  selectRechercheState,
  (state) => state.restaurants
);

export const selectRestaurant = createSelector(
  selectRechercheState,
  (state) => state.restaurantSelectionne
);
