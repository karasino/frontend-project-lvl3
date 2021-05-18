import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import watchedObject from './view';

const parseRss = (data) => {
  const parsedRss = {
    channel: {},
    posts: [],
  };
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(data, 'application/xml');
  if (xmlDocument.documentElement.tagName === 'parsererror') return { error: xmlDocument.documentElement.textContent };
  const channelTitle = xmlDocument.querySelector('channel > title');
  const channelDescription = xmlDocument.querySelector('channel > description');
  const channelId = _.uniqueId('channel_');
  const items = xmlDocument.querySelectorAll('item');
  parsedRss.channel = {
    title: channelTitle.textContent,
    description: channelDescription.textContent,
    channelId,
  };
  items.forEach((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const id = _.uniqueId('post_');
    parsedRss.posts.push({
      title: title.textContent,
      link: link.innerHTML,
      id,
      channelId,
    });
  });
  return parsedRss;
};

const form = document.createElement('form');
const formGroup = document.createElement('div');
formGroup.classList.add('form-group');
const errorMessageContainer = document.createElement('div');
errorMessageContainer.classList.add('container');
const errorMessageRow = document.createElement('div');
errorMessageRow.classList.add('row');
const errorMessageCol = document.createElement('div');
errorMessageCol.classList.add('col-12');
errorMessageCol.dataset.id = 'error';
errorMessageRow.appendChild(errorMessageCol);
errorMessageContainer.appendChild(errorMessageRow);
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
  const schema = yup.string().url();
  const url = e.target.elements.input.value;
  if (watchedObject.form.urlList.includes(url)) {
    watchedObject.form.state = 'invalid';
    watchedObject.form.error = 'URL already in the list.';
  }
  schema.isValid(url)
    .catch(() => {
      watchedObject.form.state = 'invalid';
      watchedObject.form.error = 'URL is invalid.';
    })
    .then((validUrl) => {
      watchedObject.form.state = 'sending';
      return axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(validUrl)}`);
    })
    .then((response) => {
      if (response.ok) return response;
      throw new Error('Network response was not ok.');
    })
    .catch(() => {
      watchedObject.form.state = 'error';
      watchedObject.form.error = 'Network error, please try again.';
    })
    .then(parseRss)
    .then((parsedRss) => {
      if (parsedRss.error) {
        watchedObject.form.state = 'error';
        watchedObject.form.error = parsedRss.error;
      }
      watchedObject.form.state = 'success';
      const { channel, posts } = parsedRss;
      watchedObject.channels.push(channel);
      watchedObject.posts.concat(posts);
    });
});

document.body.appendChild(form);
