'use strict';
import '@babel/polyfill';
import { login } from './login.js';
import { displayMap } from './mapbox.js';

// dom elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

//delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

