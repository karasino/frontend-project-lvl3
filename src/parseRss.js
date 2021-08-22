export default (data) => {
  const parsedRss = {
    channel: {},
    items: [],
  };
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(data, 'application/xml');
  if (xmlDocument.documentElement.tagName === 'parsererror') {
    const error = new Error(xmlDocument.documentElement.textContent);
    error.isValidationError = true;
    throw error;
  }
  const channelTitle = xmlDocument.querySelector('channel > title');
  const channelDescription = xmlDocument.querySelector('channel > description');
  const items = xmlDocument.querySelectorAll('item');
  parsedRss.channel = {
    title: channelTitle.textContent,
    description: channelDescription.textContent,
  };
  items.forEach((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const description = item.querySelector('description');
    parsedRss.items.push({
      title: title.textContent,
      link: link.textContent,
      description: description.textContent,
    });
  });
  return parsedRss;
};
