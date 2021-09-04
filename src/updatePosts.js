/* eslint no-param-reassign: ["error", { "props": false }] */

import { differenceBy } from 'lodash';
import axios from 'axios';
import parseRss from './parseRss';
import completeItems from './completeItems';

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
    .then(() => {
      setTimeout(() => updateItems(watchedState, createUrl), 5000);
    });
};

export default updateItems;
