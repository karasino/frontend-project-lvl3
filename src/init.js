import i18next from 'i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import axios from 'axios';
import watch from './view';
import parseRss from './parseRss';
import updatePosts from './updatePosts';

const state = {
  form: {
    status: 'valid',
    error: null,
  },
  modal: {
    postIndex: null,
  },
  urls: [],
  posts: [],
  channels: [],
};

const formEl = document.getElementById('rssForm');

export default () => {
  const i18n = i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          feedback: {
            notUrl: 'URL is invalid.',
            existed: 'URL already in the list.',
            required: 'This is required field.',
            error: 'Something goes wrong with form validation.',
            networkError: 'Network error, please try again.',
            parsingError: 'Unable to parse RSS',
            success: 'Channel successfully added.',
          },
        },
      },
    },
  });

  yup.setLocale({
    string: {
      url: 'notUrl',
      notOneOf: 'existed',
      required: 'required',
      default: 'error',
    },
  });
  const schema = yup.string()
    .url()
    .notOneOf(state.urls)
    .required();

  const watchedState = watch(state, i18n);

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = e.target.elements.input.value;
    try {
      watchedState.form.status = 'valid';
      const validUrl = schema.validateSync(url);
      watchedState.form.status = 'sending';
      axios.get('https://hexlet-allorigins.herokuapp.com/get', {
        params: {
          url: encodeURIComponent(validUrl),
        },
      })
        .then((response) => parseRss(response.data))
        .then((parsedRss) => {
          const { channel, posts } = parsedRss;
          watchedState.channels.push(channel);
          watchedState.posts = state.posts.concat(posts);
          watchedState.form.status = 'success';
        })
        .catch((error) => {
          if (error.response || error.request) {
            watchedState.form.error = 'network';
          } else {
            watchedState.form.error = 'parsing';
          }
          watchedState.form.status = 'error';
        });
    } catch ({ errors: [validationError] }) {
      watchedState.form.error = validationError;
      watchedState.form.status = 'invalid';
    }
  });
  updatePosts(watchedState);
};
