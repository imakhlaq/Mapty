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

class workout {
  //these are instance feilds ( they are simmiler for every instance and properties might differ in each object )
  id = Date.now();
  date = new Date();
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends workout {
  type = 'running';
  constructor(coords, distance, duration, cadance) {
    super(coords, distance, duration);
    this.cadance = cadance;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.distance / this.duration;
    return this.pace;
  }
}

class Cycling extends workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
  }
  calcSpeed() {
    this.pace = this.duration / (this.distance / 60);
    return this.pace;
  }
}

class App {
  //to make map varible global
  map;
  mapEvent;
  //to store workouts
  workoutArr = [];

  constructor() {
    this._getposition();
    inputType.addEventListener('change', this._toggleElivationField);
    form.addEventListener('submit', this._workout.bind(this));
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
  //changing cadence base on cycling or running
  _toggleElivationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  //and showing maker on clikced
  _workout(e) {
    e.preventDefault();
    //clearing input feilds
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';

    //taking out lat and lang from event
    const { lat, lng } = this.mapEvent.latlng;
    //////////////////////////////////////////////////////
    //to store workout object
    let workout;
    // take all data inpult from feilds
    const distance = inputDistance.value;
    const duration = inputDuration.value;
    const type = inputType.value;
    //helper function for checking
    //if all the values are positive
    const allPos = (...value) => value.every(e => e >= 0);
    const allNum = (...value) => value.every(e => e === Number);
    //checking for valid inputs for each type
    //running
    if (type === 'running') {
      if (!allPos(distance, duration) || !allNum(distance, duration))
        return alert('Invalid Inputs');
      const cadance = inputCadence.value;
      workout = new Running([lat, lng], distance, duration, cadance);
    }
    //cyclig
    if (type === 'cycling') {
      if (!allPos(distance, duration) || !allNum(distance, duration))
        return alert('Invalid Inputs');
      const elevation = inputElevation.value;
      workout = new Running([lat, lng], distance, duration, elevation);
    }
    //pushing workout in wokout array
    this.workoutArr.push(workout);
    //showing marker
    this._showMarker(workout);
  }
  _showMarker(workout) {
    //adding marker on clicked location
    L.marker(workout.coords)
      .addTo(this.map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('jio')
      .openPopup();
  }
}
const app = new App();
