/* eslint no-param-reassign: ["error", { "props": false }] */

import { unionBy } from 'lodash';
import axios from 'axios';
import parseRss from './parseRss';

const updatePosts = (watchedState) => {
  watchedState.urls.forEach((url) => {
    const proxyUrl = new URL('https://hexlet-allorigins.herokuapp.com/get');
    proxyUrl.search = `?url=${url}&disableCache=true`;
    axios.get(proxyUrl)
      .then((response) => {
        const { posts } = parseRss(response.data.contents);
        const updatedPosts = unionBy(watchedState.posts, posts, ({ link }) => link);
        watchedState.posts = updatedPosts;
      });
  });
  setTimeout(() => updatePosts(watchedState), 5000);
};

export default updatePosts;
