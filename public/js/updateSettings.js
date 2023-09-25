'use strict';

import { showAlert } from './alerts.js';
import { STATUSES } from '../../utils/constants.js';
import axios from 'axios';

// type is either 'password' || 'data'
export const updateSettings = async (data, type) => {
  const currentUrl = type === 'password'
    ? 'http://localhost:8080/api/v1/users/updateMyPassword'
    : 'http://localhost:8080/api/v1/users/updateMe';
  try {
    const res = await axios({
      method: 'PATCH',
      url: currentUrl,
      data
    });

    if (res.data.status === STATUSES.SUCCESS) {
      showAlert(
        STATUSES.SUCCESS,
        `${type === 'password'
          ? 'Password updated successfully!'
          : 'Data updated successfully!'
        }`);

      if (type === 'photo') {
        return res.data.data.user.photo;
      }
    }
  } catch (err) {
    showAlert(STATUSES.ERROR, err.response.data.message);
  }
};
