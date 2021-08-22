/* eslint no-param-reassign: ["error", { "props": false }] */

import { differenceBy, uniqueId } from 'lodash';
import axios from 'axios';
import parseRss from './parseRss';

const updateItems = (watchedState, createUrl) => {
  Promise.resolve()
    .then(() => {
      watchedState.channels.map((channel) => ({ channelLink: channel.link, id: channel.id }))
        .forEach(({ channelLink, id }) => {
          axios.get(createUrl(channelLink).toString())
            .then((response) => {
              const { items } = parseRss(response.data.contents);
              const uniqueItems = differenceBy(watchedState.items, items, ({ link }) => link);
              const completedUniqueItems = uniqueItems.map((item) => {
                const itemId = uniqueId('item_');
                const completedItem = item;
                completedItem.channelId = id;
                completedItem.isWatched = false;
                completedItem.itemId = itemId;
                return completedItem;
              });
              watchedState.items = watchedState.items.concat(completedUniqueItems);
            });
        });
    })
    .then(() => {
      setTimeout(() => updateItems(watchedState, createUrl), 5000);
    });
};

export default updateItems;
