/* eslint no-param-reassign: ["error", { "props": false }] */

const modalEl = document.getElementById('detailsModal');
const formEl = document.getElementById('rssForm');
const feedback = document.getElementById('feedback');
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
  const submit = formEl.querySelector('submit');
  input.classList.remove('is-invalid');
  input.setAttribute('disabled', 'false');
  submit.setAttribute('disabled', 'false');
  feedback.textContent = '';
  switch (form.status) {
    case 'valid':
      break;
    case 'invalid':
      input.classList.add('is-invalid');
      feedback.textContent = i18n.t.feedback(form.error);
      break;
    case 'sending':
      input.setAttribute('disabled', 'true');
      submit.setAttribute('disabled', 'true');
      break;
    case 'error':
      feedback.textContent = i18n.t.feedback(form.error);
      break;
    case 'success':
      feedback.textContent = i18n.t.feedback('success');
      break;
    default:
      break;
  }
};

export {
  renderChannels,
  renderPosts,
  renderModal,
  renderForm,
};
