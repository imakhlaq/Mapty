'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

//changing cadence base on cycling or running
class App {
  //to make map varible global
  map;
  mapEvent;

  constructor() {
    this._getposition();
    inputType.addEventListener('change', this._toggleElivationField);
    form.addEventListener('submit', this._showMarker.bind(this));
  }
  _getposition() {
    //getting user location thorugh browser API
    if (navigator.geolocation) {
      //this take 2 call back 1sucess 2nd failer
      navigator.geolocation?.getCurrentPosition(this._loadMap.bind(this), () =>
        prompt('Please Allow location acces')
      );
    }
  }

  _loadMap(positon) {
    //taking latitude and longitude out of p
    const { latitude, longitude } = positon.coords;

    // url based on longitude and latitude `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    //from leaflet API
    //map is declared above to make this global varible
    this.map = L.map('map').setView([latitude, longitude], 20);

    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(this.map);
    //marker on click on map
    //this map object contain a on method which is like a addeventlistner and when you click on it also passed and event object to the function

    this.map.on('click', this._showform.bind(this));
  }
  _showform(event) {
    //we have to make this event also global
    this.mapEvent = event;
    //showing form
    form.classList.remove('hidden');
    //focusing distance feild
    inputDistance.focus();
  }
  _toggleElivationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  //and showing maker on clikced
  _showMarker(e) {
    e.preventDefault();
    //clearing input feilds
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';

    //taking out lat and lang from event
    const { lat, lng } = this.mapEvent.latlng;
    //distance from input
    //adding marker on clicked location
    L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('jio')
      .openPopup();
  }
}
const app = new App();
