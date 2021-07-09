import onChange from 'on-change';
import {
  renderChannels,
  renderPosts,
  renderModal,
  renderForm,
} from './render';

export default (state, i18n) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'channels':
        renderChannels(state);
        break;
      case 'posts':
        renderPosts(state, watchedState);
        break;
      case 'modal':
        renderModal(state);
        break;
      case 'form':
        renderForm(state, i18n);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
