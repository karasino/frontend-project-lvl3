import { unionBy, flatten } from 'lodash';
import axios from 'axios';
import watchedState from './view';
import parseRss from './parseRss';

const updatePosts = () => {
  const promises = watchedState.urlList.map((url) => {
    const rssFile = axios.get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`);
    return parseRss(rssFile);
  });
  const promise = Promise.all(promises);
  promise
    .then((parsedRssFiles) => {
      const posts = parsedRssFiles.map((file) => file.posts);
      const updatedPosts = unionBy(watchedState.posts, flatten(posts), ({ link }) => link);
      watchedState.posts = updatedPosts;
      setTimeout(updatePosts, 5000);
    });
};

export default updatePosts;
