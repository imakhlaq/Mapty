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

//to make map varible global
let map;
let mapEvent;

//getting user location thorugh browser API
if (navigator.geolocation) {
  navigator.geolocation?.getCurrentPosition(
    function (p) {
      //taking latitude and longitude out of p
      const { latitude, longitude } = p.coords;

      //making a url based on longitude and latitude
      // const locationURL = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

      //from leaflet API
      //map is declared above to make this global varible
      map = L.map('map').setView([latitude, longitude], 20);

      L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 18,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(map);
      //marker on click on map
      //this map object contain a on method which is like a addeventlistner and when you click on it also passed and event object to the function
      map.on('click', function (event) {
        //console.log(event);
        //we have to make this event also global
        mapEvent = event;
        //showing form
        form.classList.remove('hidden');
        inputDistance.focus();
      });
    },
    function () {
      prompt('Please Allow location acces');
    }
  );
}
const showMarker = function (e) {
  e.preventDefault();

  //taking out lat and lang from event
  const { lat, lng } = mapEvent.latlng;
  //distance from input

  const distance = inputDistance.value;
  console.log(+distance);
  console.log(lat, lng);
  //adding marker on clicked location
  L.marker([lat, lng])
    .addTo(map)
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
};
//and showing maker on clikced
form.addEventListener('submit', showMarker);
