'use strict';

import { showAlert } from './alerts.js';
import { STATUSES } from '../../utils/constants.js';
import axios from 'axios';

export const updateUserData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:8080/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });

    if (res.data.status === STATUSES.SUCCESS) {
      showAlert(STATUSES.SUCCESS, 'Data updated successfully!');
    }
  } catch (err) {
    showAlert(STATUSES.ERROR, err.response.data.message);
  }
};
