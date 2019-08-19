import Mapbox from 'mapbox-gl';

const INITIAL_ZOOM = 15;
const DEFAULT_CENTER = [84.51, 39.10];

Mapbox.accessToken = 'pk.eyJ1IjoicmhldWJhY2giLCJhIjoiY2p6Y3AzY2I3MDJxZTNubWp5eG1kaGdkMCJ9.46xDflykdiyFyFHWa7j1IA';

class GRMap extends HTMLElement {
  constructor() {
    super();
  }

  attributeChangedCallback() {
    if (!(this.latitude && this.longitude)) {
      return;
    }
    this.renderMap();
    this.renderPosition();
  }

  get latitude() {
    return parseFloat(this.getAttribute('latitude'));
  }

  get longitude() {
    return parseFloat(this.getAttribute('longitude'));
  }

  get height() {
    return this.getAttribute('height');
  }

  static get observedAttributes() {
    return ['latitude', 'longitude'];
  }

  renderMapContainer() {
    let shadow = this.attachShadow({ mode: 'open' });
    let div = document.createElement('div');
    div.setAttribute('id', 'raceMap');
    div.setAttribute('class', 'map');
    div.setAttribute('style', `height: ${this.height || '67vh'}; width: 80vw; margin: 0 auto; display: flex; align-items: center; justify-content: center; border-radius: $border-radius; z-index: 25;`);
    shadow.innerHTML = '<link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.2.1/mapbox-gl.css" rel="stylesheet" />'
    shadow.appendChild(div);
  }

  renderMap() {
    const shadowDom = this.shadowRoot;
    if (!shadowDom) {
      this.renderMapContainer();
    }

    if (!this.map) {
      const container = this.shadowRoot.querySelector('#raceMap');
      console.log('Here is your container: ', container);
      this.map = new Mapbox.Map({
        container: container,
        style: 'mapbox://styles/rheubach/cjzcqemj42em61cp9p9cbqllw',
        zoom: INITIAL_ZOOM,
        antialias: true
      });
      const canvas = shadowDom.querySelector('.mapboxgl-canvas');
      canvas.style.left = '10px';
      canvas.style.top = '10px';
    }

    if (!(this.latitude && this.longitude)) {
      this.map.setCenter(DEFAULT_CENTER);
      this.map.setZoom(INITIAL_ZOOM);
    } else {
      this.map.setCenter([this.longitude, this.latitude]);
      this.map.setZoom(INITIAL_ZOOM);
    }
  }

  renderPosition() {
    if (!this.shadowRoot) {
      return;
    }
    if (this.positionMarker) {
      this.positionMarker.setLngLat([this.longitude, this.latitude]);
    }
    if (!this.icon) {
      let el = document.createElement('div');
      el.className = 'position-marker';
      el.style.backgroundImage = 'url(../images/location-marker.svg)';
      el.style.width = '26px';
      el.style.height = '40px';
      this.icon = el;
      this.positionMarker = new Mapbox.Marker(this.icon).setLngLat([this.longitude, this.latitude])
      this.positionMarker.addTo(this.map);
    }
  }

  connectedCallback() {
    this.renderMapContainer();
    this.renderMap();
  }
}

export default GRMap;
