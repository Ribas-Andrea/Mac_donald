import { Component } from '@angular/core';

import { LeafletDirective, LeafletLayersControlDirective, LeafletLayersDirective } from '@bluehalo/ngx-leaflet';

import { circle, latLng, marker, polygon, tileLayer } from 'leaflet';

@Component({
  imports: [
    LeafletDirective, 
    LeafletLayersControlDirective,
    LeafletLayersDirective
  ],
  selector: 'app-carte',
  styleUrl: './carte.css',
  templateUrl: './carte.html',
})
export class Carte {

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...'
      })
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  };
  layers = [
    marker([
      46.879966,
      -121.726909
    ])
  ];

   protected readonly layersControl = {
        baseLayers: {
            'Open Street Map': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
            'Open Cycle Map': tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        },
        overlays: {
            'Big Circle': circle([ 46.95, -122 ], { radius: 5000 }),
            'Big Square': polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]])
        }
    };

}