/* eslint no-param-reassign: ["error", { "props": false }] */

import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import { uniqueId, differenceBy } from 'lodash';
import watch from './view';
import parseRss from './parseRss';

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

const updateItems = (watchedState, createUrl) => {
  const promises = watchedState.channels.map((channel) => {
    const {
      link: channelLink,
      id,
    } = channel;
    return axios.get(createUrl(channelLink).toString())
      .then((response) => {
        const { items } = parseRss(response.data.contents);
        const uniqueItems = differenceBy(watchedState.items, items, ({ link }) => link);
        const completedUniqueItems = completeItems(uniqueItems, id);
        watchedState.items = watchedState.items.concat(completedUniqueItems);
        return true;
      });
  });
  Promise.all(promises)
    .finally(() => {
      setTimeout(() => updateItems(watchedState, createUrl), 5000);
    });
};

export default () => {
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
      itemId: null,
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
          view: 'Просмотр',
        },
      },
    },
  }).then((t) => {
    const watchedState = watch(state, t, domElems);

    itemsList.addEventListener('click', (e) => {
      if (!e.target.dataset.itemId) return;
      const item = watchedState.items.find((i) => (
        i.itemId === e.target.dataset.itemId));
      item.isWatched = true;
      watchedState.modal.itemId = item.itemId;
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
          } else if (error.isParserError) {
            watchedState.addFeedProcess.error = 'parsingError';
          } else {
            watchedState.addFeedProcess.error = 'unknownError';
          }
          watchedState.addFeedProcess.status = 'error';
        });
    });
    updateItems(watchedState, addProxy);
  });
};
