import { Component, EventEmitter, inject, Input, OnChanges, Output, signal } from '@angular/core';
import { Nominatim } from '../../services/nominatim';




@Component({
  imports: [],
  selector: 'app-rechercheRestaurants',
  styleUrl: './rechercheRestaurants.css',
  templateUrl: './rechercheRestaurants.html',
})


export class RechercheRestaurants implements OnChanges{

  // Ville reçue du composant parent App
  @Input() ville = '';

  // Latitude reçue du composant parent App
  @Input() latitude = 45.750000;

  // Longitude reçue du composant parent App
  @Input() longitude = -0.633330;

  // Restaurant sélectionné sur la carte
  @Input() restaurantSelectionneRecu: string | null = null;

  // Envoie la liste des restaurants au composant parent App
  @Output() restaurantsTrouves = new EventEmitter<any[]>();

  // Liste des restaurants trouvés : 
  restaurants = signal<any[]>([]);

  // Restaurant Selectionné : 
  restaurantSelectionne= signal<any>(null);

  // Coordonnées du restaurant selectionné : 
  restaurantLatitude = signal<number | undefined>(undefined);
  restaurantLongitude = signal<number | undefined>(undefined);
  
  // Service Nominatim : 
    private nominatim = inject(Nominatim);

  // Détecte les changements des données reçues par @Input
  ngOnChanges() {
    // console.log('Ville reçue :', this.ville);
    // console.log('Latitude reçue :', this.latitude);
    // console.log('Longitude reçue :', this.longitude);
    if (this.ville) {
      this.chercherRestaurants();
    }
    if (this.restaurantSelectionneRecu) {
      this.restaurantSelectionne.set(this.restaurantSelectionneRecu);
    }
  }

  // Recherche des restaurants dans la ville : 
  chercherRestaurants(){
    
    this.nominatim
    .rechercherRestaurants(this.ville, this.latitude, this.longitude)
    .subscribe((restaurants) => {
      // console.log('Réponse Nominatim :', restaurants);
      // Enregistre la liste des retaurants : 
      this.restaurants.set(restaurants);
      // console.log('Restaurants :', restaurants.elements);

      // Envoie la liste des restaurants à App
      this.restaurantsTrouves.emit(restaurants);

      // Récupère le premier restaurant : 
      const restaurant = restaurants[0];

      if (restaurant) {
        this.restaurantLatitude.set(restaurant.lat);
        this.restaurantLongitude.set(restaurant.lon);
      }
      

      // console.log('Latitude restaurant :', restaurant.lat);
      // console.log('Longitude restaurant :', restaurant.lon);
    });
  }

// Selectionne le restaurant : 
  selectionnerRestaurant(restaurant: any) {
    // console.log('1 - $event reçu :', restaurant);
    this.restaurantSelectionne.set(restaurant);
    // console.log('Restaurant sélectionné :', restaurant);
    // console.log('2 - signal :', this.restaurantSelectionne());
  }
}