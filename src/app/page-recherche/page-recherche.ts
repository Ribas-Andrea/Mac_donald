import { Component } from '@angular/core';
import { Carte } from '../MapModule/carte/carte';
import { RechercheRestaurants } from '../SearchModule/rechercheRestaurants/rechercheRestaurants';
import { RechercheVilles } from '../SearchModule/rechercheVilles/rechercheVilles';


@Component({
  imports: [RechercheVilles, RechercheRestaurants, Carte],
  selector: 'app-page-recherche',
  styleUrl: './page-recherche.css',
  templateUrl: './page-recherche.html',
})

export class PageRecherche {

  villeRecue = '';
  latitude = 45.750000;
  longitude = -0.633330;



  // Liste des restaurants reçus de RechercheRestaurants
  restaurants: any[] = [];

  // Restaurant sélectionné sur la carte
  restaurantSelectionne: string | null = null;
}
