import onChange from 'on-change';
import i18next from 'i18next';
import state from './state';

const i18Next = i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en: {
      translation: {
        feedback: {
          notUrl: 'URL is invalid.',
          sameUrl: 'URL already in the list.',
          networkError: 'Network error, please try again.',
          parsingError: 'Unable to parse RSS',
          success: 'Channel successfully added.',
        },
      },
    },
  },
});

export default onChange(state.form, (path, value) => {
  const input = document.getElementById('inputUrl');
  const submit = document.getElementById('submit');
  input.classList.remove('is-invalid');
  input.setAttribute('disabled', 'false');
  submit.setAttribute('disabled', 'false');
  const channelsList = document.querySelector('[data-id="channels"]');
  channelsList.innerHTML = '';
  const postsList = document.querySelector('[data-id="posts"]');
  postsList.innerHTML = '';
  const feedbackContainer = document.querySelector('[data-id="feedback"]');
  feedbackContainer.textContent = '';
  switch (value) {
    case 'same url':
      input.classList.add('is-invalid');
      i18Next.then(() => {
        feedbackContainer.textContent = i18next.t('sameUrl');
      });
      break;
    case 'not url':
      input.classList.add('is-invalid');
      i18Next.then(() => {
        feedbackContainer.textContent = i18next.t('notUrl');
      });
      break;
    case 'network error':
      i18Next.then(() => {
        feedbackContainer.textContent = i18next.t('networkError');
      });
      break;
    case 'parsing error':
      i18Next.then(() => {
        feedbackContainer.textContent = i18next.t('parsingError');
      });
      break;
    case 'sending':
      input.setAttribute('disabled', 'true');
      submit.setAttribute('disabled', 'true');
      break;
    case 'success':
      state.channels.forEach(({ title, description }) => {
        const channelTitle = document.createElement('dt');
        channelTitle.textContent = title;
        const channelDescription = document.createElement('dd');
        channelDescription.textContent = description;
        channelsList.append(channelTitle, channelDescription);
      });
      state.posts.forEach(({ title, link }) => {
        const post = document.createElement('a');
        post.setAttribute('href', link);
        post.classList.add('list-group-item', 'list-group-item-action');
        post.textContent = title;
        postsList.append(post);
      });
      i18Next.then(() => {
        feedbackContainer.textContent = i18next.t('success');
      });
      break;
    default:
      break;
  }
});
