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

//getting user location thorugh browser API

navigator.geolocation?.getCurrentPosition(
  function (p) {
    //taking latitude and longitude out of p
    const { latitude, longitude } = p.coords;

    //making a url based on longitude and latitude
    // const locationURL = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    //from leaflet API

    const map = L.map('map').setView([latitude, longitude], 14);

    L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
  },
  function () {
    prompt('Please Allow location acces');
  }
);


