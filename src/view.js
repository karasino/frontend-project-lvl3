/* eslint no-param-reassign: ["error", { "props": false }] */
import onChange from 'on-change';

const renderChannels = ({ channels }, channelsList) => {
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

const renderModal = ({ posts, modal }, modalEl) => {
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

const renderPosts = ({ posts }, watchedState, postsList) => {
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

const renderFormValidation = (form, i18n, formEl, feedback) => {
  const input = formEl.querySelector('input');
  input.classList.remove('is-invalid');
  feedback.textContent = '';
  if (!form.isValid) {
    input.classList.add('is-invalid');
    feedback.textContent = i18n(form.error);
  }
};

const renderFormSending = (addFeedProcess, i18n, formEl, feedback) => {
  const input = formEl.querySelector('input');
  const submit = document.getElementById('submit');
  switch (addFeedProcess.status) {
    case 'sending':
      input.setAttribute('disabled', 'disabled');
      submit.setAttribute('disabled', 'disabled');
      break;
    case 'error':
      input.removeAttribute('disabled');
      submit.removeAttribute('disabled');
      feedback.textContent = i18n(addFeedProcess.error);
      break;
    case 'success':
      input.removeAttribute('disabled');
      submit.removeAttribute('disabled');
      feedback.textContent = i18n('success');
      break;
    default:
      break;
  }
};

export default (state, i18n, domElems) => {
  const {
    formEl,
    modalEl,
    feedback,
    channelsList,
    postsList,
  } = domElems;
  const watchedState = onChange(state, (path) => {
    if (path === 'channels') {
      renderChannels(state, channelsList);
    } else if (path.startsWith('posts')) {
      renderPosts(state, watchedState, postsList);
    } else if (path === 'modal.postIndex') {
      renderModal(state, modalEl);
    } else if (path === 'form.isValid') {
      renderFormValidation(state.form, i18n, formEl, feedback);
    } else if (path === 'addFeedProcess.status') {
      renderFormSending(state.addFeedProcess, i18n, formEl, feedback);
    }
  });
  return watchedState;
};
