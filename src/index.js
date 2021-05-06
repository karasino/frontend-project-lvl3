import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import axios from 'axios';

const state = {
  form: {
    state: 'sent',
    urlList: [],
  },
  channels: [],
  posts: [],
};

const form = document.createElement('form');
const formGroup = document.createElement('div');
formGroup.classList.add('form-group');
const label = document.createElement('label');
label.setAttribute('for', 'inputUrl');
label.textContent = 'URL to add';
const input = document.createElement('input');
input.setAttribute('name', 'input');
input.classList.add('form-control');
input.setAttribute('id', 'inputUrl');
const submit = document.createElement('button');
submit.setAttribute('type', 'submit');
submit.classList.add('btn', 'btn-primary');
submit.textContent = 'ADD';
formGroup.append(label, input);
form.append(formGroup, submit);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const schema = yup.string().url();
  const url = e.target.elements.input.value;
  if (state.form.urlList.includes(url)) {
    state.form.state = 'invalid';
  }
  schema.isValid(url)
    .catch(() => {
      state.form.state = 'invalid';
    })
    .then((validUrl) => {
      state.form.state = 'sending';
      axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(validUrl)}`);
    })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .catch(() => {
      state.form.state = 'network problem';
    })
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'application/xml');
    });
});

document.body.appendChild(form);
