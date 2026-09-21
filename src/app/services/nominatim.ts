import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class Nominatim {
  private http = inject(HttpClient);

  rechercherVille(ville: string) {
    const url = `https://nominatim.openstreetmap.org/search?q=${ville}&format=json`;

    return this.http.get<any[]>(url, {
      headers: {
        'Accept-Language': 'fr'
      }
    });
  }

  rechercherRestaurants(ville: string, latitude: number, longitude: number) {
    // const url = `https://nominatim.openstreetmap.org/search?q=McDonald's,${ville}&format=json&limit=10`;
    const url = `https://nominatim.openstreetmap.org/search?q=McDonald's,${ville}&format=json&limit=20&addressdetails=1`;

    return this.http.get<any[]>(url, {
      headers: {
        'Accept-Language': 'fr'
      }
    });
  }
}
