import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import axios from 'axios';
import watchedObject from './view';
import state from './state';
import parseRss from './parseRss';

yup.setLocale({
  string: {
    default: 'notUrl',
  },
});
const schema = yup.string().url();

const form = document.createElement('form');
const formGroup = document.createElement('div');
formGroup.classList.add('form-group');
const feedbackMessageContainer = document.createElement('div');
feedbackMessageContainer.classList.add('container');
const feedbackMessageRow = document.createElement('div');
feedbackMessageRow.classList.add('row');
const feedbackMessageCol = document.createElement('div');
feedbackMessageCol.classList.add('col-12');
feedbackMessageCol.dataset.id = 'feedback';
feedbackMessageRow.appendChild(feedbackMessageCol);
feedbackMessageContainer.appendChild(feedbackMessageRow);
const channelsList = document.createElement('dl');
channelsList.classList.add('row');
channelsList.dataset.id = 'channels';
const postsList = document.createElement('div');
postsList.classList.add('list-group');
postsList.dataset.id = 'posts';
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
submit.setAttribute('id', 'submit');
submit.textContent = 'ADD';
formGroup.append(label, input);
form.append(formGroup, submit);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = e.target.elements.input.value;
  if (state.urlList.includes(url)) {
    watchedObject.state = 'same url';
  }
  schema.isValid(url)
    .catch(() => {
      watchedObject.state = 'not url';
    })
    .then((validUrl) => {
      watchedObject.state = 'sending';
      return axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(validUrl)}`);
    })
    .then((response) => {
      if (response.ok) return response;
      throw new Error();
    })
    .catch(() => {
      watchedObject.state = 'network error';
    })
    .then(parseRss)
    .catch(() => {
      watchedObject.state = 'parsing error';
    })
    .then((parsedRss) => {
      const { channel, posts } = parsedRss;
      state.channels.push(channel);
      state.posts.concat(posts);
      watchedObject.state = 'success';
    });
});

document.body.appendChild(form);
