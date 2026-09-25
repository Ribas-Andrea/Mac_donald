import { Component, effect, EventEmitter, input, Input, Output } from '@angular/core';
import { LeafletDirective, LeafletLayersDirective } from '@bluehalo/ngx-leaflet';
import { latLng, Map, marker, tileLayer } from 'leaflet';

@Component({
  imports: [
    LeafletDirective, 
    LeafletLayersDirective
  ],
  selector: 'app-carte',
  styleUrl: './carte.css',
  templateUrl: './carte.html',
})
export class Carte {

  @Input() ville = '';
  @Output() restaurantSelectionne = new EventEmitter<string>();
  private map?: Map;

  // Position de Saintes :
  latitude = input<number>(45.750000);
  longitude = input<number>(-0.633330);

  restaurantLatitude = input<number>();
  restaurantLongitude = input<number>();

  restaurants = input<any[]>([]);
  
  constructor(){
    effect(() => {
      const lat: number = this.latitude();
      const lon: number = this.longitude();

      // const restaurantLat = this.restaurantLatitude();
      // const restaurantLon = this.restaurantLongitude();


      const restaurants = this.restaurants();
      // console.log('Restaurants reçus dans Carte :', restaurants);

      // ici on a un tableau en dur, mais si on veut récupérer une API, on va pouvoir mettre une boucle for ou forEach
      // exemple : 
      // array.forEach(element => {
      //   this.marker.push(et ici on met les données gps, le marqueur, etc..)
      // });

      // Supprime les anciens marqueurs de la carte
        this.marqueurs.forEach((marqueur) => {
          marqueur.remove();
        });

        // Vide le tableau des marqueurs
        this.marqueurs.length = 0;



      restaurants.forEach((restaurant) => {
        // console.log('Restaurant :', restaurant);
        const adresse = restaurant.address;
        // console.log('Détail adresse :',adresse.road,adresse.city,adresse.postcode)
        const numero = adresse.house_number ? adresse.house_number + ' ' : '';
        // console.log('Numero :', numero);
        const rue = numero + (adresse.road || '');
        // console.log('Adresse complète :', rue);
        const quartier = adresse.neighbourhood || adresse.suburb || adresse.quarter || '';
        // console.log('Complément adresse facultative :', quartier);
        const ville = adresse.city || adresse.town || adresse.municipality ||'';
        // console.log('Complément adresse facultative :', ville);
        const marqueur = marker([
          restaurant.lat,
          restaurant.lon
        ]).bindPopup(`
            <strong>${restaurant.name}</strong><br>
            ${rue} <br>
            ${quartier} <br>
            ${ville} <br>
            ${adresse.postcode} <br> <br>
            <button id="choisirRestaurant">Choisir</button>
          `);

          marqueur.on('popupopen', (e) => {
            console.log('POPUP OUVERTE :', e.popup.getElement()?.textContent);
            // const bouton = document.getElementById('choisirRestaurant');
            const bouton = e.popup.getElement()?.querySelector('#choisirRestaurant');

            bouton?.addEventListener('click', () => {
              // console.log('Restaurant sélectionné :', restaurant);
              console.log('Clic sur :', e.popup.getElement()?.textContent);
              console.log(this.restaurantSelectionne.emit);
              this.restaurantSelectionne.emit(e.popup.getElement()?.textContent);
            });
            //faire des console.log pour voir a quel endroit on s'arrête
          });

        // bindPopup("Mcdo : " + maVariable)
        // bindPopup(`Mcdo : ${maVariable}`)

        this.marqueurs.push(marqueur);
      });


      // console.log('lat :', lat);
      // console.log('lon :', lon);
      // console.log('map :', this.map);
      // console.log('latRest :', restaurantLat);
      // console.log('lonRest :', restaurantLon);
      // console.log('Marqueurs créés :', this.marqueurs);

      if (this.map) {
        this.map.setView([lat, lon], 13);
      }

      // this.marqueur.setLatLng([lat, lon]);

      // if (restaurantLat !== undefined && restaurantLon !== undefined) {
      //   this.marqueur.setLatLng([restaurantLat, restaurantLon]);
      // }

    
    });
  }

  onMapReady(map: Map) {
    this.map = map;

    // console.log('onMapReady lat :', this.latitude());
    // console.log('onMapReady lon :', this.longitude());

    this.map.setView([
      this.latitude(),
      this.longitude()
    ], 13);
  }

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18, // le zoom maximum autorisé
        attribution: '...' // Il s'agit du copyright qui est écrit en bas à droite
      })
    ],
    zoom: 5, // Il s'agit du zoom par défault de la carte globale
    center: latLng(45.750000, -0.633330) // on précise sur quel longitude et latitude par défault on veut être (Saintes), pour trouver les coordonnées, taper coordonnées gps + la ville dans google
  };
  
    // marqueur = marker([
    //   this.latitude(),
    //   this.longitude()
    // ]).bindPopup('Test');

    marqueurs: any[] = [];

    layers = this.marqueurs;

    


}