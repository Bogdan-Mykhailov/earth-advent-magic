'use strict';

const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    console.log(res);
  } catch (err) {
    console.log(err);
  }

};

document.querySelector('.form').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
