import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import watch from './view';
import parseRss from './parseRss';
import updatePosts from './updatePosts';

export default () => {
  const state = {
    form: {
      isValid: true,
      error: null,
    },
    addFeedProcess: {
      status: 'ready',
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
  const modalEl = document.getElementById('detailsModal');
  const feedback = document.getElementById('feedback');
  const channelsList = document.getElementById('channels');
  const postsList = document.getElementById('posts');

  const domElems = {
    formEl,
    modalEl,
    feedback,
    channelsList,
    postsList,
  };

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
  const schema = yup.string()
    .url()
    .required();

  const validate = (url) => {
    try {
      schema
        .notOneOf(state.urls)
        .validateSync(url);
    } catch (error) {
      return error;
    }
    return null;
  };

  const instance = i18next.createInstance();

  return instance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
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
  }).then((t) => {
    const watchedState = watch(state, t, domElems);

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = e.target.elements.input.value;
      watchedState.form.isValid = true;
      const validationError = validate(url);
      if (validationError) {
        const { errors: [error] } = validationError;
        watchedState.form.error = error;
        watchedState.form.isValid = false;
        return;
      }
      watchedState.addFeedProcess.status = 'sending';
      const proxyUrl = new URL('https://hexlet-allorigins.herokuapp.com/get');
      proxyUrl.searchParams.set('url', url);
      proxyUrl.searchParams.set('disableCache', true);
      axios.get(proxyUrl.toString())
        .then((response) => {
          const { channel, posts } = parseRss(response.data.contents);
          watchedState.channels.push(channel);
          watchedState.posts = state.posts.concat(posts);
          state.urls.push(url);
          watchedState.addFeedProcess.status = 'success';
        })
        .catch((error) => {
          watchedState.addFeedProcess.status = 'error';
          if (error.response || error.request) {
            watchedState.addFeedProcess.error = 'networkError';
          } else {
            watchedState.addFeedProcess.error = 'parsingError';
          }
        });
    });
    updatePosts(watchedState);
  });
};
