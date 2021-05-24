import _ from 'lodash';

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
  const channelId = _.uniqueId('channel_');
  const items = xmlDocument.querySelectorAll('item');
  parsedRss.channel = {
    title: channelTitle.textContent,
    description: channelDescription.textContent,
    channelId,
  };
  items.forEach((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const id = _.uniqueId('post_');
    parsedRss.posts.push({
      title: title.textContent,
      link: link.innerHTML,
      id,
      channelId,
    });
  });
  return parsedRss;
};
