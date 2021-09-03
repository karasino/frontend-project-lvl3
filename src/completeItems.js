import { uniqueId } from 'lodash';

export default (items, channelId) => items.map((item) => {
  const itemId = uniqueId('item_');
  const completedItem = item;
  completedItem.channelId = channelId;
  completedItem.isWatched = false;
  completedItem.itemId = itemId;
  return completedItem;
});
