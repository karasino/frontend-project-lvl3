import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import axios from 'axios';
import watchedState from './view';
import parseRss from './parseRss';
import updatePosts from './updatePosts';

yup.setLocale({
  string: {
    default: 'notUrl',
  },
});
const schema = yup.string().url();

const form = document.getElementById('rssForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = e.target.elements.input.value;
  if (watchedState.urlList.includes(url)) {
    watchedState.state = 'same url';
  }
  schema.isValid(url)
    .catch(() => {
      watchedState.state = 'not url';
    })
    .then((validUrl) => {
      watchedState.state = 'sending';
      return axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(validUrl)}`);
    })
    .then((response) => {
      if (response.ok) return response;
      throw new Error();
    })
    .catch(() => {
      watchedState.state = 'network error';
    })
    .then(parseRss)
    .catch(() => {
      watchedState.state = 'parsing error';
    })
    .then((parsedRss) => {
      const { channel, posts } = parsedRss;
      watchedState.channels.push(channel);
      const updatedPosts = watchedState.posts.concat(posts);
      watchedState.posts = updatedPosts;
      watchedState.state = 'success';
    });
});

updatePosts();
