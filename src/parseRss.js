import { uniqueId } from 'lodash';

export default (data) => {
  const parsedRss = {
    channel: {},
    posts: [],
  };
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(data, 'application/xml');
  if (xmlDocument.documentElement.tagName === 'parsererror') {
    throw new Error();
  }
  const channelTitle = xmlDocument.querySelector('channel > title');
  const channelDescription = xmlDocument.querySelector('channel > description');
  const id = uniqueId('channel_');
  const items = xmlDocument.querySelectorAll('item');
  parsedRss.channel = {
    title: channelTitle.textContent,
    description: channelDescription.textContent,
    id,
  };
  items.forEach((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const description = item.querySelector('description');
    const postId = uniqueId('post_')
    parsedRss.posts.push({
      title: title.textContent,
      link: link.innerHTML,
      description: description.textContent,
      channelId: id,
      postId,
      isWatched: false,
    });
  });
  return parsedRss;
};
