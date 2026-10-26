import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { debounceTime, of, switchMap } from 'rxjs';
import { Nominatim } from '../../services/nominatim';


interface ResultatNominatim {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    postcode?: string;
    country?: string;
  }
};

interface RechercheVille {
  ville: string;
  latitude: number;
  longitude: number;
}

// Validateur : refuse un champ vide ou rempli uniquement d'espaces
function nonVide(control: AbstractControl): ValidationErrors | null {
  return control.value?.trim() ? null : { vide: true };
}

@Component({
  imports: [ReactiveFormsModule ],
  selector: 'app-rechercheVilles',
  styleUrl: './rechercheVilles.css',
  templateUrl: './rechercheVilles.html',
})


export class RechercheVilles {

// Formulaire de recherche de la ville  :
  form = new FormGroup({
    villeSelectionnee: new FormControl('', {nonNullable: true, validators: [nonVide]}),
  });

  // Récupération du champ villeSelectionnee : 
  get _getVilleSelectionnee(){
    // console.log(this.form);
    // console.log(this.form.controls.villeSelectionnee);
    return this.form.controls.villeSelectionnee;
  };

  // Liste des propositions de villes :
  propositionsVilles = signal<ResultatNominatim[]>([]);

  // Coordonnées de localisation à Saintes si localisation refusée : 
  latitude = signal(45.750000);
  longitude = signal(-0.633330);

  // Indique si le formulaire a été envoyé  :
  isSubmited = signal<boolean>(false);

  // Service Nominatim : 
  private nominatim = inject(Nominatim);

  // Envoie de la ville recherchée au composant parent : 
  @Output() villeRecherchee = new EventEmitter<RechercheVille>();


// Le constructeur qui affiche la localisation de l'tilisateur : 
  constructor() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude.set(position.coords.latitude);
      this.longitude.set(position.coords.longitude);
    });

    // Autocompletion des villes : 
    // console.log(this._getVilleSelectionnee);
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

  // Recherche la ville lorsque le formulaire est envoyé : 
  chercherVilles() {
    this.isSubmited.set(true);
    // Vérifie que le champ est valide : 
    if (this._getVilleSelectionnee.invalid){
      console.warn("Veuillez saisir une ville avant de lancer la recherche");
      return;
    }

    // Mise en place de la recherche de la ville avec nominatim : 
    this.nominatim
    .rechercherVille(this._getVilleSelectionnee.value).subscribe(
      (resultat: ResultatNominatim[]) => {

      // On vérifie qu'un résultat existe : 
        // console.log(resultat);
          if (resultat.length === 0) {
            return;
          }

      // Récupération des coordonnées : 
        // console.log(resultat[0]);
        this.latitude.set(Number(resultat[0].lat));
        this.longitude.set(Number(resultat[0].lon));

      // On vide les propositions : 
        this.propositionsVilles.set([]);

      // // On transmet la ville et ses coordonnées au composant parent
          this.villeRecherchee.emit({
            ville: this._getVilleSelectionnee.value,
            latitude: this.latitude(),
            longitude: this.longitude()
          });



        // a voir si on garde : 

      // On efface le restaurant précédemment sélectionné
      // this.restaurantSelectionne.set(null);

        // Les nouvelles coordonnées sont en place, on cherche les restaurants
        // this.chercherRestaurants();

        // console.log(this.latitude());
        // console.log(this.longitude());

      }
    );
 };
// Affichage des propositions de villes : 
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

  // Selectionne une ville dans les propositions : 
  selectionnerVille(ville: ResultatNominatim) {
    // console.log("test");
    this._getVilleSelectionnee.setValue(ville.display_name, { emitEvent: false });

    this.propositionsVilles.set([]);
 
 
  }

// Construit le texte affiché dans les propositions : 
    libellePropositionsVilles(ville: ResultatNominatim): string {
    // console.log(ville);
    const adresse = ville.address;

    
    const nom = ville.name || '';
    const codePostale = adresse.postcode ? ', ' + adresse.postcode: '';
    const pays = adresse.country ? ', ' + adresse.country: '';

    return nom + codePostale + pays;

  }
  
}