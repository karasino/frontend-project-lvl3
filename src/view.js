/* eslint no-param-reassign: ["error", { "props": false }] */
import onChange from 'on-change';

const renderChannels = ({ channels }, channelsList) => {
  channelsList.innerHTML = '';
  channels.forEach(({ title, description }) => {
    const titleDiv = document.createElement('div');
    const descriptionDiv = document.createElement('div');
    titleDiv.classList.add('col-6', 'my-2');
    descriptionDiv.classList.add('col-6', 'my-2');
    titleDiv.textContent = title;
    descriptionDiv.textContent = description;
    channelsList.append(titleDiv, descriptionDiv);
  });
};

const renderModal = ({ items, modal }, modalEl) => {
  const item = items.find((i) => i.itemId === modal.itemId);
  const {
    title,
    description,
    link,
  } = item;
  const modalTitle = modalEl.querySelector('.modal-title');
  const modalBody = modalEl.querySelector('.modal-body');
  const modalViewButton = modalEl.querySelector('.modal-footer > a');
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalViewButton.setAttribute('href', link);
};

const renderItems = ({ items }, watchedState, itemsList, i18n) => {
  itemsList.innerHTML = '';
  items.forEach((item) => {
    const {
      title,
      link,
      itemId,
      isWatched,
    } = item;
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('col-4', 'my-2');
    const titleLink = document.createElement('a');
    titleLink.setAttribute('href', link);
    if (isWatched) {
      titleLink.classList.remove('fw-bold');
      titleLink.classList.add('fw-normal');
    } else {
      titleLink.classList.remove('fw-normal');
      titleLink.classList.add('fw-bold');
    }
    titleLink.textContent = title;
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('col-8', 'my-2');
    const detailsBtn = document.createElement('button');
    detailsBtn.setAttribute('type', 'button');
    detailsBtn.classList.add('btn', 'btn-primary');
    detailsBtn.dataset.bsToggle = 'modal';
    detailsBtn.dataset.bsTarget = '#detailsModal';
    detailsBtn.dataset.itemId = itemId;
    detailsBtn.textContent = i18n('view');
    titleDiv.appendChild(titleLink);
    detailsDiv.appendChild(detailsBtn);
    itemsList.append(titleDiv, detailsDiv);
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
      input.setAttribute('readonly', 'readonly');
      submit.setAttribute('disabled', 'disabled');
      break;
    case 'error':
      input.removeAttribute('readonly');
      submit.removeAttribute('disabled');
      feedback.textContent = i18n(addFeedProcess.error);
      break;
    case 'success':
      input.removeAttribute('readonly');
      submit.removeAttribute('disabled');
      feedback.textContent = i18n('success');
      break;
    case 'ready':
      break;
    default:
      throw new Error('unknown error');
  }
};

export default (state, i18n, domElems) => {
  const {
    formEl,
    modalEl,
    feedback,
    channelsList,
    itemsList,
  } = domElems;
  const watchedState = onChange(state, (path) => {
    if (path === 'channels') {
      renderChannels(state, channelsList);
    } else if (path.startsWith('items')) {
      renderItems(state, watchedState, itemsList, i18n);
    } else if (path === 'modal.itemId') {
      renderModal(state, modalEl);
    } else if (path === 'form.isValid') {
      renderFormValidation(state.form, i18n, formEl, feedback);
    } else if (path === 'addFeedProcess.status') {
      renderFormSending(state.addFeedProcess, i18n, formEl, feedback);
    }
  });
  return watchedState;
};
