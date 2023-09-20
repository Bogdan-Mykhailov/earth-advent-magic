'use strict';
import axios from 'axios';
import { showAlert } from './alerts.js';
import { STATUSES } from '../../utils/constants.js';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === STATUSES.SUCCESS) {
      showAlert(STATUSES.SUCCESS, 'Logged in successfully!')
      window.setTimeout(() => {
        location.assign('/')
      }, 1000)
    }
  } catch (err) {
    showAlert(STATUSES.ERROR, err.response.data.message);
  }
};
