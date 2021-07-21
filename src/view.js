/* eslint no-param-reassign: ["error", { "props": false }] */
import onChange from 'on-change';

const modalEl = document.getElementById('detailsModal');
const formEl = document.getElementById('rssForm');
const feedback = document.getElementById('feedback');
const channelsList = document.getElementById('channels');
const postsList = document.getElementById('posts');

const renderChannels = ({ channels }) => {
  channelsList.innerHTML = '';
  channels.forEach(({ title, description }) => {
    const titleDiv = document.createElement('div');
    const descriptionDiv = document.createElement('div');
    titleDiv.classList.add('col-6', 'my-2');
    descriptionDiv.classList.add('col-6', 'my-2');
    titleDiv.innerHTML = `<b>${title}</b>`;
    descriptionDiv.textContent = description;
    channelsList.append(titleDiv, descriptionDiv);
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
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('col-4', 'my-2');
    const titleLink = document.createElement('a');
    titleLink.setAttribute('href', link);
    if (isWatched) {
      titleLink.classList.remove('font-weight-bold');
      titleLink.classList.add('font-weight-normal');
    } else {
      titleLink.classList.remove('font-weight-normal');
      titleLink.classList.add('font-weight-bold');
    }
    titleLink.textContent = title;
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('col-8', 'my-2');
    const detailsBtn = document.createElement('button');
    detailsBtn.setAttribute('type', 'button');
    detailsBtn.classList.add('btn', 'btn-primary');
    detailsBtn.dataset.toggle = 'modal';
    detailsBtn.dataset.target = '#detailsModal';
    detailsBtn.dataset.postId = postId;
    detailsBtn.textContent = 'Просмотр';
    detailsBtn.addEventListener('click', () => {
      const postIndex = posts.findIndex((p) => (
        p.postId === detailsBtn.dataset.postId));
      watchedState.posts[postIndex].isWatched = true;
      watchedState.modal.postIndex = postIndex;
    });
    titleDiv.appendChild(titleLink);
    detailsDiv.appendChild(detailsBtn);
    postsList.append(titleDiv, detailsDiv);
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
    if (path === 'channels') {
      renderChannels(state);
    } else if (path.startsWith('posts')) {
      renderPosts(state, watchedState);
    } else if (path === 'modal.postIndex') {
      renderModal(state);
    } else if (path === 'form.status') {
      renderForm(state, i18n);
    }
  });
  return watchedState;
};
