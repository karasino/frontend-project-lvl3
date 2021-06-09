export default (props, state) => {
  const {
    inputState,
    isSubmitDisabled,
    feedback,
    channels,
    posts,
  } = props;
  const watchedState = state;
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
  if (inputState.isInvalid) {
    input.classList.add('is-invalid');
  }
  if (inputState.isDisabled) {
    input.setAttribute('disabled', 'true');
  }
  if (isSubmitDisabled) {
    submit.setAttribute('disabled', 'true');
  }
  feedbackContainer.textContent = feedback;
  channels.forEach(({ title, description }) => {
    const channelTitle = document.createElement('dt');
    channelTitle.textContent = title;
    const channelDescription = document.createElement('dd');
    channelDescription.textContent = description;
    channelsList.append(channelTitle, channelDescription);
  });
  posts.forEach((postData) => {
    const {
      title,
      link,
      description,
      isWatched,
      postId,
    } = postData;
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
      const postIndex = posts.findIndex((post) => (
        post.postId === detailsBtn.dataset.postId));
      const post = posts[postIndex];
      watchedState.posts[postIndex].isWatched = true;
      const detailsModal = document.getElementById('detailsModal');
      const modalTitle = detailsModal.querySelector('.modal-title');
      const modalBody = detailsModal.querySelector('.modal-body');
      const modalViewButton = detailsModal.querySelector('.modal-footer > a');
      modalTitle.textContent = title;
      modalBody.textContent = description;
      modalViewButton.setAttribute('href', post.link);
    });
    postElem.append(titleElem, detailsBtn);
    postsList.append(postElem);
  });
};
