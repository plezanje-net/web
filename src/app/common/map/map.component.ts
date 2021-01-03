import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';

import Map from 'ol/Map';
import { MapBrowserEvent, Overlay as OverlayPopup } from 'ol';
import { defaults as defaultInteractions } from 'ol/interaction';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import Feature, { FeatureLike } from 'ol/Feature';
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
  @ViewChild('popup') popup;
  popupOverlay: OverlayPopup;
  selectedCrag: any;

  lon: number = 14.9912767;
  lat: number = 46.1369805;
  zoom: number = 8;

  map: Map;

  constructor() { }

  ngOnInit(): void {
    if (this.crag != null && this.crag.lon != null && this.crag.lat != null) {
      this.lon = this.crag.lon;
      this.lat = this.crag.lat;
      this.zoom = 10;
    }
  }

  ngAfterViewInit() {
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0, 0],
        src: 'assets/marker.webp'
      }),
    });
    this.popupOverlay = new OverlayPopup({
      element: this.popup.nativeElement,
    });

    this.map = new Map({
      target: 'crag-map',
      interactions: defaultInteractions({ doubleClickZoom: false, pinchRotate: false }),
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

    this.map.addOverlay(this.popupOverlay);
    this.crags.subscribe((crags) => {

      this.map.removeLayer(this.map.getLayers().item(1));


      const markers = [];

      crags.forEach((crag) => {
        if (crag.lat != null && crag.lon != null) {
          const marker = new AdvancedFeature({
            geometry: new Point(olProj.fromLonLat([crag.lon, crag.lat]))
          });
          marker.crag = crag;

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
      if (markers.length > 0) {
        this.map.getView().fit(vectorLayer.getSource().getExtent(), {
          size: this.map.getSize(),
          maxZoom: 15,
        });
      }
    })

    this.map.on('click', this.mapClickEvent);
  }
  mapClickEvent = async (evt) => {
    this.popup.nativeElement.hidden = true;
    const featuresClick: FeatureLike[] = this.map.getFeaturesAtPixel(evt.pixel);
    if (featuresClick.length > 0) {
      this.selectedCrag = (<AdvancedFeature> featuresClick[0]).crag;
      this.popupOverlay.setPosition(evt.coordinate);
      this.popup.nativeElement.hidden = false;
      this.map.getView().setCenter(evt.coordinate)
    }
  }
}

class AdvancedFeature extends Feature {
  public crag: any
}