import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import { uniqueId } from 'lodash';
import watch from './view';
import parseRss from './parseRss';
import updateItems from './updatePosts';

export default () => {
  const addProxy = (url) => {
    const proxyUrl = new URL('https://hexlet-allorigins.herokuapp.com/get');
    proxyUrl.searchParams.set('url', url);
    proxyUrl.searchParams.set('disableCache', true);
    return proxyUrl;
  };

  const completeItems = (items, channelId) => items.map((item) => {
    const itemId = uniqueId('item_');
    const completedItem = item;
    completedItem.channelId = channelId;
    completedItem.isWatched = false;
    completedItem.itemId = itemId;
    return completedItem;
  });

  const state = {
    form: {
      isValid: true,
      errors: null,
    },
    addFeedProcess: {
      status: 'ready',
      error: null,
    },
    modal: {
      itemIndex: null,
    },
    items: [],
    channels: [],
  };

  const formEl = document.getElementById('rssForm');
  const modalEl = document.getElementById('detailsModal');
  const feedback = document.getElementById('feedback');
  const channelsList = document.getElementById('channels');
  const itemsList = document.getElementById('posts');

  const domElems = {
    formEl,
    modalEl,
    feedback,
    channelsList,
    itemsList,
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
        .notOneOf(state.channels.map((channel) => channel.link))
        .validateSync(url, { abortEarly: false });
    } catch (errors) {
      return errors;
    }
    return null;
  };

  const i18nInstance = i18next.createInstance();

  return i18nInstance.init({
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
          unknownError: 'Возникла неизвестная ошибка',
          success: 'RSS успешно загружен',
        },
      },
    },
  }).then((t) => {
    const watchedState = watch(state, t, domElems);

    itemsList.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      const itemIndex = watchedState.items.findIndex((i) => (
        i.itemId === e.target.dataset.itemId));
      watchedState.items[itemIndex].isWatched = true;
      watchedState.modal.itemIndex = itemIndex;
    });

    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = e.target.elements.input.value;
      formEl.reset();
      watchedState.form.isValid = true;
      const validationErrors = validate(url);
      if (validationErrors) {
        const { errors: [error] } = validationErrors;
        watchedState.form.error = error;
        watchedState.form.isValid = false;
        return;
      }
      watchedState.addFeedProcess.status = 'sending';
      axios.get(addProxy(url).toString())
        .then((response) => {
          const { channel, items } = parseRss(response.data.contents);
          channel.link = url;
          const channelId = uniqueId('channel_');
          channel.id = channelId;
          const completedItems = completeItems(items, channelId);
          watchedState.channels.push(channel);
          watchedState.items = state.items.concat(completedItems);
          watchedState.addFeedProcess.status = 'success';
        })
        .catch((error) => {
          if (error.isAxiosError) {
            watchedState.addFeedProcess.error = 'networkError';
          } else if (error.isValidationError) {
            watchedState.addFeedProcess.error = 'parsingError';
          } else {
            watchedState.addFeedProcess.error = 'unknownError';
          }
          watchedState.addFeedProcess.status = 'error';
        });
    });
    updateItems(watchedState, addProxy, completeItems);
  });
};
