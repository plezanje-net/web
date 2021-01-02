import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  @Input() crags: BehaviorSubject<any[]>;
  @Input() crag: any;
  @Input() height: number = 360;

  lon: number = 14.9912767;
  lat: number = 46.1369805;
  zoom: number = 8;

  map: any;

  constructor() { }

  ngOnInit(): void {
    if (this.crag != null && this.crag.lon != null && this.crag.lat != null) {
      this.lon = this.crag.lon;
      this.lat = this.crag.lat;
      this.zoom = 10;
    }
  }

  ngAfterViewInit(){
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0, 0],
        src: 'assets/marker.webp'
      }),
    });

    this.map = new Map({
      target: 'crag-map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: olProj.fromLonLat([this.lon, this.lat]),
        zoom: this.zoom
      })
    });

    this.crags.subscribe((crags) => {

      this.map.removeLayer(this.map.getLayers().item(1));

  
      const markers = [];

      crags.forEach((crag) => {
        if (crag.lat != null && crag.lon != null) {
          const marker = new Feature({
            geometry: new Point(olProj.fromLonLat([crag.lon, crag.lat]))
          });

          marker.setStyle(iconStyle);

          markers.push(marker);
        }
      })

      const vectorSource = new VectorSource({
        features: markers
      });
  
      const vectorLayer = new VectorLayer({
        source: vectorSource
      });

      this.map.addLayer(vectorLayer);

    })
  }

}
