import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import Map from 'ol/Map';
import { Overlay as OverlayPopup } from 'ol';
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
import { circular } from 'ol/geom/Polygon';
import VectorSource from 'ol/source/Vector';
import { BehaviorSubject, Subject } from 'rxjs';
import Control from 'ol/control/Control';

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
  @ViewChild('locate') locate: ElementRef;

  vectorLayer = new VectorLayer();
  vectorSource = new VectorSource();
  
  locationLayer = new VectorLayer();
  locationSource = new VectorSource();

  popupOverlay: OverlayPopup;
  selectedCrag: any;

  lon: number = 14.9912767;
  lat: number = 46.1369805;
  zoom: number = 8;

  locateMeIsSet = false;
  positionWatch: number;
  currentPosition: any; 

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

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });
    this.map.addLayer(this.vectorLayer);

    this.crags.subscribe((crags) => {
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
      this.vectorSource.clear();
      this.vectorSource.addFeatures(markers);

      if (markers.length > 0) {
        this.map.getView().fit(this.vectorLayer.getSource().getExtent(), {
          size: this.map.getSize(),
          maxZoom: 15,
        });
      }
    })

    this.map.on('click', this.mapClickEvent);
    this.map.addControl(new Control({
      element: this.locate.nativeElement,
    }));
    this.locationLayer = new VectorLayer({
      source: this.locationSource
    })
    this.map.addLayer(this.locationLayer);
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
  
  locateMe(event) {
    this.locateMeIsSet = !this.locateMeIsSet

    if (this.locateMeIsSet) {
      this.locationLayer.setVisible(true);
      this.addGeolocationControl();
      this.locate.nativeElement.classList.add('location-active')
    } else {
      window.navigator.geolocation.clearWatch(this.positionWatch);
      this.locationLayer.setVisible(false);
      this.locate.nativeElement.classList.remove('location-active');

      this.currentPosition = undefined;
    }
  }
  addGeolocationControl(): void {
    this.positionWatch = window.navigator.geolocation.watchPosition(async (pos) => {
      const coords = [pos.coords.longitude, pos.coords.latitude];
      const accuracy = circular(coords, pos.coords.accuracy);
      this.locationSource.clear(true);
      this.locationSource.addFeatures([
        new Feature(accuracy.transform('EPSG:4326', this.map.getView().getProjection())),
        new Feature(new Point(olProj.fromLonLat(coords)))
      ]);

      if (!this.locationSource.isEmpty() && this.currentPosition === undefined) {
        this.map.getView().fit(this.locationSource.getExtent(), {
          maxZoom: 17,
          duration: 500
        });
      }
      if (pos.coords.accuracy < 50) {
        this.currentPosition = pos;
      }
    }, (error) => {
      alert(`ERROR: ${error.message}`);
    }, {
      enableHighAccuracy: true,
    });
  }
}

class AdvancedFeature extends Feature {
  public crag: any
}