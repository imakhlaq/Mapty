'use strict';

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
  _tittleCreator() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNo = this.date.getMonth();
    this.tittle = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[monthNo]
    }`;
  }
}

class Running extends workout {
  type = 'running';
  constructor(coords, distance, duration, cadance) {
    super(coords, distance, duration);
    this.cadance = cadance;
    this.calcPace();
    this._tittleCreator();
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
    this._tittleCreator();
  }
  calcSpeed() {
    this.speed = this.duration / (this.distance / 60);
    return this.speed;
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
    this._getDatafromLocal();
    inputType.addEventListener('change', this._toggleElivationField);
    form.addEventListener('submit', this._workout.bind(this));
    containerWorkouts.addEventListener('click', this._moveToWorkOut.bind(this));
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

    //loading previous makers
    if (this.workoutArr.length != 0) {
      this.workoutArr.forEach(work => {
        this._showMarker(work);
      });
    }
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
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    const type = inputType.value;
    console.log(type);

    //helper function for checking
    //if all the values are positive
    const allPos = (...input) => input.every(inp => inp > 0);
    const allNum = (...value) => value.every(e => Number.isFinite(e));

    //checking for valid inputs for each type
    //running
    if (type === 'running') {
      const cadance = +inputCadence.value;
      if (
        !allNum(distance, duration, cadance) ||
        !allPos(distance, duration, cadance)
      ) {
        return alert('Invalid Inputs');
      }

      workout = new Running([lat, lng], distance, duration, cadance);
    }
    //cyclig
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      if (!allPos(distance, duration) || !allNum(distance, duration, elevation))
        return alert('Invalid Inputs');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    //pushing workout in wokout array
    console.log(workout);
    this.workoutArr.push(workout);
    //showing marker
    this._showMarker(workout);

    this._renderWorkout(workout);
    //putting data in local strage
    this._putDataInLocal();
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
      .setPopupContent(
        `${workout.type == 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.tittle}`
      )
      .openPopup();
  }
  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--running" data-id=${workout.id}>
    <h2 class="workout__title">${workout.tittle}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type == 'running' ? '🏃‍♂️' : '🚴‍♀️'
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
        </div>
      <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
        </div>`;

    if (workout.type === 'running') {
      html += `
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadance}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
    }

    if (workout.type === 'cycling') {
      html += `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;
    }

    form.insertAdjacentHTML('afterend', html);
  }
  _moveToWorkOut(e) {
    const clickedEl = e.target.closest('.workout');
    //guard claus
    if (!clickedEl) return; //

    const clickedElid = clickedEl.getAttribute('data-id');
    const findworkout = this.workoutArr.find(work => work.id === +clickedElid);

    this.map.setView(findworkout.coords, 18, {
      animation: true,
      pan: {
        duration: 1,
      },
    });
  }

  _putDataInLocal() {
    localStorage.setItem('workouts', JSON.stringify(this.workoutArr));
  }
  _getDatafromLocal() {
    const data = JSON.parse(localStorage.getItem('workout'));
    //setting data back
    this.workoutArr = data;
    if (this.workoutArr.length != 0) {
      this.workoutArr.forEach(workout => {
        this._renderWorkout(workout);
      });
    }
  }

  //for clearing local api
  localRest() {
    localStorage.clear();
  }
}
const app = new App();
