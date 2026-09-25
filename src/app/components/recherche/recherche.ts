import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { debounceTime, of, switchMap } from 'rxjs';
import { Nominatim } from '../../services/nominatim';
import { Carte } from '../carte/carte';


interface ResultatNominatim {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    postcode?: string;
    country?: string;
  }
};

// Validateur : refuse un champ vide ou rempli uniquement d'espaces
function nonVide(control: AbstractControl): ValidationErrors | null {
  return control.value?.trim() ? null : { vide: true };
}

@Component({
  imports: [Carte, ReactiveFormsModule ],
  selector: 'app-recherche',
  styleUrl: './recherche.css',
  templateUrl: './recherche.html',
})


export class Recherche {

// On remplace villeSelectionnee = ''; par : 
  form = new FormGroup({
    villeSelectionnee: new FormControl('', {nonNullable: true, validators: [nonVide]}),
  });

  get _getVilleSelectionnee(){
    // console.log(this.form);
    // console.log(this.form.controls.villeSelectionnee);
    return this.form.controls.villeSelectionnee;
  };

  propositionsVilles = signal<ResultatNominatim[]>([]);

  libellePropositionsVilles(ville: ResultatNominatim): string {
    const adresse = ville.address;

    // const name = adresse.name || '';
    const nom = adresse.city || adresse.town || adresse.village || adresse.municipality || '';
    const codePostale = adresse.postcode ? ', ' + adresse.postcode: '';
    const pays = adresse.country ? ', ' + adresse.country: '';

    return nom + codePostale + pays;
    // return name;
  }
  

// Localisation Saintes si localisation refusée : 
  latitude = signal(45.750000);
  longitude = signal(-0.633330);

  restaurantLatitude = signal<number | undefined>(undefined);
  restaurantLongitude = signal<number | undefined>(undefined);

  restaurants = signal<any[]>([]);
  restaurantSelectionne= signal<any>(null);
  isSubmited = signal<boolean>(false);
  private nominatim = inject(Nominatim);

  @Output() villeRecherchee = new EventEmitter<string>();


  constructor() {
    // Pour afficher notre localisation sur la carte au début : 
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude.set(position.coords.latitude);
      this.longitude.set(position.coords.longitude);
    });

    console.log(this._getVilleSelectionnee);
    this._getVilleSelectionnee.valueChanges
    .pipe(
      debounceTime(300),
      switchMap((valeur) => 
      valeur.length <2? of <ResultatNominatim[]>([]): this.nominatim.rechercherVille(valeur)
      )
    )
    .subscribe((resultat) => {
      this.propositionsVilles.set(resultat);
      // console.log(this.propositionsVilles());
    });
  }

  chercherVilles() {
    this.isSubmited.set(true);
    if (this._getVilleSelectionnee.invalid){
      console.warn("Veuillez saisir une ville avant de lancer la recherche");
      return;
    }

    // Mise en place de la recherche : 
    this.nominatim
    .rechercherVille(this._getVilleSelectionnee.value).subscribe(
      (resultat: ResultatNominatim[]) => {

        // console.log(resultat);
        // console.log(resultat[0]);
      
        this.latitude.set(Number(resultat[0].lat));
        this.longitude.set(Number(resultat[0].lon));
        this.propositionsVilles.set([]);

      // On efface le restaurant précédemment sélectionné
      this.restaurantSelectionne.set(null);

        // Les nouvelles coordonnées sont en place, on cherche les restaurants
        this.chercherRestaurants();

        // console.log(this.latitude());
        // console.log(this.longitude());

      }
    );
 };

  autocompletionVille() {

  if (this._getVilleSelectionnee.value.length < 2) {
    this.propositionsVilles.set([]);
    return;
  }

  this.nominatim
    .rechercherVille(this._getVilleSelectionnee.value)
    .subscribe((resultat: ResultatNominatim[]) => {
        this.propositionsVilles.set(resultat);
      }
    );
  };

  selectionnerVille(ville: ResultatNominatim) {
    // console.log("test");
    this._getVilleSelectionnee.setValue(ville.display_name, { emitEvent: false });

    this.propositionsVilles.set([]);
  }


  chercherRestaurants(){
    
    this.nominatim
    .rechercherRestaurants(this._getVilleSelectionnee.value, this.latitude(), this.longitude())
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


  selectionnerRestaurant(restaurant: any) {
    // console.log('1 - $event reçu :', restaurant);
    this.restaurantSelectionne.set(restaurant);
    // console.log('Restaurant sélectionné :', restaurant);
    // console.log('2 - signal :', this.restaurantSelectionne());
  }
}