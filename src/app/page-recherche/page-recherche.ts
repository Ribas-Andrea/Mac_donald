import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Carte } from '../MapModule/carte/carte';
import { selectVille } from '../NgRx Store/recherche.selectors';
import { RechercheRestaurants } from '../SearchModule/rechercheRestaurants/rechercheRestaurants';
import { RechercheVilles } from '../SearchModule/rechercheVilles/rechercheVilles';


@Component({
  imports: [RechercheVilles, RechercheRestaurants, Carte, AsyncPipe],
  selector: 'app-page-recherche',
  styleUrl: './page-recherche.css',
  templateUrl: './page-recherche.html',
})

export class PageRecherche {

  // villeRecue = '';
  private store = inject(Store);

  villeRecue$ = this.store.select(selectVille);

  latitude = 45.750000;
  longitude = -0.633330;



  // Liste des restaurants reçus de RechercheRestaurants
  restaurants: any[] = [];

  // Restaurant sélectionné sur la carte
  restaurantSelectionne: string | null = null;
}
