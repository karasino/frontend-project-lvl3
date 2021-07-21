/* eslint no-param-reassign: ["error", { "props": false }] */

import { unionBy } from 'lodash';
import axios from 'axios';
import parseRss from './parseRss';

const updatePosts = (watchedState) => {
  watchedState.urls.forEach((url) => {
    axios.get('https://hexlet-allorigins.herokuapp.com/get', {
      params: {
        url,
      },
    })
      .then((response) => parseRss(response.data.contents))
      .then(({ posts }) => {
        const updatedPosts = unionBy(watchedState.posts, posts, ({ link }) => link);
        watchedState.posts = updatedPosts;
      });
  });
  setTimeout(() => updatePosts(watchedState), 5000);
};

export default updatePosts;
