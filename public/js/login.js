'use strict';

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      alert('Logged in successfully!')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (err) {
    alert(err.response.data.message);
  }

};

document.querySelector('.form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
