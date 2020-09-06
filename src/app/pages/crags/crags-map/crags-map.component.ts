import { Component, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';

@Component({
  selector: 'app-crags-map',
  templateUrl: './crags-map.component.html',
  styleUrls: ['./crags-map.component.scss']
})
export class CragsMapComponent implements OnInit {

  map: any;

  constructor() { }

  ngOnInit(): void {
    this.map = new Map({
      target: 'crag-map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: olProj.fromLonLat([14.9912767, 46.1369805]),
        zoom: 8
      })
    });
  }

}
