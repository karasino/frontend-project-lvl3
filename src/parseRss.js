export default (data) => {
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(data, 'application/xml');
  const parserError = xmlDocument.querySelector('parsererror');
  if (parserError) {
    const error = new Error(parserError.textContent);
    error.isParserError = true;
    throw error;
  }
  const channelTitle = xmlDocument.querySelector('channel > title');
  const channelDescription = xmlDocument.querySelector('channel > description');
  const items = xmlDocument.querySelectorAll('item');
  const title = channelTitle.textContent;
  const description = channelDescription.textContent;
  const parsedItems = [...items].map((item) => {
    const itemTitle = item.querySelector('title');
    const link = item.querySelector('link');
    const itemDescription = item.querySelector('description');
    return {
      title: itemTitle.textContent,
      link: link.textContent,
      description: itemDescription.textContent,
    };
  });
  return {
    channel: { title, description },
    items: parsedItems,
  };
};
