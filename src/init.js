import i18next from 'i18next';
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
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          notUrl: 'Ссылка должна быть валидным URL',
          existed: 'RSS уже существует',
          required: 'Не должно быть пустым',
          networkError: 'Ошибка сети',
          parsingError: 'Ресурс не содержит валидный RSS',
          success: 'RSS успешно загружен',
        },
      },
    },
  });

  yup.setLocale({
    string: {
      url: 'notUrl',
      default: 'error',
    },
    mixed: {
      required: 'required',
      notOneOf: 'existed',
    },
  });

  const watchedState = watch(state, i18next);

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const schema = yup.string()
      .url()
      .notOneOf(state.urls)
      .required();
    const url = e.target.elements.input.value;
    try {
      watchedState.form.status = 'valid';
      const validUrl = schema.validateSync(url);
      watchedState.form.status = 'sending';
      axios.get('https://hexlet-allorigins.herokuapp.com/get', {
        params: {
          url: validUrl,
        },
      })
        .then((response) => parseRss(response.data.contents))
        .then((parsedRss) => {
          const { channel, posts } = parsedRss;
          watchedState.channels.push(channel);
          watchedState.posts = state.posts.concat(posts);
          state.urls.push(validUrl);
          watchedState.form.status = 'success';
        })
        .catch((error) => {
          if (error.response || error.request) {
            watchedState.form.error = 'networkError';
          } else {
            watchedState.form.error = 'parsingError';
          }
        });
    } catch ({ errors: [validationError] }) {
      watchedState.form.error = validationError;
      watchedState.form.status = 'invalid';
    }
  });
  updatePosts(watchedState);
};
