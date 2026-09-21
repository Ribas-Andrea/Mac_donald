import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Nominatim } from '../../services/nominatim';
import { Carte } from '../carte/carte';


interface ResultatNominatim {
  lat: string;
  lon: string;
  display_name: string;
};

@Component({
  imports: [Carte, FormsModule],
  selector: 'app-recherche',
  styleUrl: './recherche.css',
  templateUrl: './recherche.html',
})


export class Recherche {

  villeSelectionnee = '';

  latitude = signal(45.750000);
  longitude = signal(-0.633330);

  restaurantLatitude = signal<number | undefined>(undefined);
  restaurantLongitude = signal<number | undefined>(undefined);

  restaurants = signal<any[]>([]);
  restaurantSelectionne: any;
  
  private nominatim = inject(Nominatim);

  @Output() villeRecherchee = new EventEmitter<string>();

  constructor() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude.set(position.coords.latitude);
      this.longitude.set(position.coords.longitude);
    });
  }

  chercher() {
    this.nominatim.rechercherVille(this.villeSelectionnee).subscribe(
      (resultat: ResultatNominatim[]) => {
        // console.log(resultat);
        // console.log(resultat[0]);
      
        this.latitude.set(Number(resultat[0].lat));
        this.longitude.set(Number(resultat[0].lon));

        // console.log(this.latitude());
        // console.log(this.longitude());

        this.nominatim
        .rechercherRestaurants(this.villeSelectionnee, this.latitude(), this.longitude())
        .subscribe((restaurants) => {
          // console.log('Réponse Nominatim :', restaurants);
          this.restaurants.set(restaurants);
          // console.log('Restaurants :', restaurants.elements);
          // console.log('Premier restaurant :', restaurants.elements[0]);
          
          const restaurant = restaurants[0];

          if (restaurant) {
            this.restaurantLatitude.set(restaurant.lat);
            this.restaurantLongitude.set(restaurant.lon);
          }
          

          // console.log('Latitude restaurant :', restaurant.lat);
          // console.log('Longitude restaurant :', restaurant.lon);
        });
      }
    );
  };
  selectionnerRestaurant(restaurant: any) {
    this.restaurantSelectionne = restaurant;
    console.log('Restaurant sélectionné :', restaurant);
  }
}