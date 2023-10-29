'use strict';
import '@babel/polyfill';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { updateSettings } from './updateSettings.js';
import { bookTour } from './stripe.js';

// dom elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOut = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const fileInput = document.querySelector('.form__upload');
const bookBtn = document.getElementById('book-tour');

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

if (logOut) {
  logOut.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit',  (event) => {
    event.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);

    updateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({
      passwordCurrent,
      password,
      passwordConfirm
    }, 'password');

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (fileInput) {
  fileInput.addEventListener('change', async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append('photo', document.getElementById('photo').files[0]);

    const newImage = await updateSettings(form, 'photo');

    if (newImage) {
      document
        .querySelector('.nav__user-img')
        .setAttribute('src', `/img/users/${newImage}`);
      document
        .querySelector('.form__user-photo')
        .setAttribute('src', `/img/users/${newImage}`);
    }
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', (event) => {
    event.target.textContent = 'Processing...'
    const { tourId } = event.target.dataset;
    bookTour(tourId)
  })
}
