/* eslint no-param-reassign: ["error", { "props": false }] */
import onChange from 'on-change';

const modalEl = document.getElementById('detailsModal');
const formEl = document.getElementById('rssForm');
const feedback = document.querySelector('[data-id="feedback"]');
const channelsList = document.getElementById('channels');
const postsList = document.getElementById('posts');

const renderChannels = ({ channels }) => {
  channelsList.innerHTML = '';
  channels.forEach(({ title, description }) => {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = title;
    dd.textContent = description;
    channelsList.append(dt, dd);
  });
};

const renderModal = ({ posts, modal }) => {
  const {
    title,
    description,
    link,
  } = posts[modal.postIndex];
  const modalTitle = modalEl.querySelector('.modal-title');
  const modalBody = modalEl.querySelector('.modal-body');
  const modalViewButton = modalEl.querySelector('.modal-footer > a');
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalViewButton.setAttribute('href', link);
};

const renderPosts = ({ posts }, watchedState) => {
  postsList.innerHTML = '';
  posts.forEach((post) => {
    const {
      title,
      link,
      postId,
      isWatched,
    } = post;
    const postElem = document.createElement('li');
    postElem.classList.add('list-group-item');
    const titleElem = document.createElement('a');
    titleElem.setAttribute('href', link);
    if (isWatched) {
      titleElem.classList.remove('font-weight-bold');
      titleElem.classList.add('font-weight-normal');
    } else {
      titleElem.classList.remove('font-weight-normal');
      titleElem.classList.add('font-weight-bold');
    }
    titleElem.textContent = title;
    const detailsBtn = document.createElement('button');
    detailsBtn.setAttribute('type', 'button');
    detailsBtn.classList.add('btn', 'btn-primary');
    detailsBtn.dataset.toggle = 'modal';
    detailsBtn.dataset.target = '#detailsModal';
    detailsBtn.dataset.postId = postId;
    detailsBtn.textContent = 'Details';
    detailsBtn.addEventListener('click', () => {
      const postIndex = posts.findIndex((p) => (
        p.postId === detailsBtn.dataset.postId));
      watchedState.posts[postIndex].isWatched = true;
      watchedState.modal.postIndex = postIndex;
    });
    postElem.append(titleElem, detailsBtn);
    postsList.append(postElem);
  });
};

const renderForm = ({ form }, i18n) => {
  const input = formEl.querySelector('input');
  const submit = document.getElementById('submit');
  input.classList.remove('is-invalid');
  feedback.textContent = '';
  switch (form.status) {
    case 'valid':
      break;
    case 'invalid':
      input.removeAttribute('disabled');
      submit.removeAttribute('disabled');
      input.classList.add('is-invalid');
      feedback.textContent = i18n.t(form.error);
      break;
    case 'sending':
      input.setAttribute('disabled', 'disabled');
      submit.setAttribute('disabled', 'disabled');
      break;
    case 'error':
      input.removeAttribute('disabled');
      submit.removeAttribute('disabled');
      feedback.textContent = i18n.t(form.error);
      break;
    case 'success':
      input.removeAttribute('disabled');
      submit.removeAttribute('disabled');
      feedback.textContent = i18n.t('success');
      break;
    default:
      break;
  }
};

export default (state, i18n) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'channels':
        renderChannels(state);
        break;
      case 'posts':
        renderPosts(state, watchedState);
        break;
      case 'modal.postIndex':
        renderModal(state);
        break;
      case 'form.status':
        renderForm(state, i18n);
        break;
      default:
        break;
    }
  });
  return watchedState;
};
