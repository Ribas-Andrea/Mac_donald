import { createReducer, on } from "@ngrx/store";
import { chargerRestaurants, chargerVilles, selectionnerRestaurant, selectionnerVille } from "./recherche.action";
import { RechercheState } from "./recherche.state";

export const initialState: RechercheState = {
  villes:[],
  villeSelectionne: null,
  restaurants: [],
  restaurantSelectionne: null
};

export const rechercheReducer = createReducer(
  initialState,

  on(chargerVilles, (state, {villes}) => ({
    ...state,
    villes
  })),

  on(selectionnerVille, (state, {villeSelectionne}) => ({
    ...state,
    villeSelectionne
  })),

  on(chargerRestaurants, (state, {restaurants}) => ({
    ...state,
    restaurants
  })),

  on(selectionnerRestaurant, (state, {restaurantSelectionne})=> ({
    ...state,
    restaurantSelectionne
  }))
);