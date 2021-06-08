import watchedState from './view';

export default ({ input, isSubmitDisabled, feedback, channels, posts }) => {
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
  if (input.isInvalid) {
    input.classList.add('is-invalid');
  }
  if (input.isDisabled) {
    input.setAttribute('disabled', 'true');
  }
  if (isSubmitDisabled) {
    submit.setAttribute('disabled', 'true');
  }
  feedbackContainer.textContent = feedback;
  watchedState.channels.forEach(({ title, description }) => {
    const channelTitle = document.createElement('dt');
    channelTitle.textContent = title;
    const channelDescription = document.createElement('dd');
    channelDescription.textContent = description;
    channelsList.append(channelTitle, channelDescription);
  });
  watchedState.posts.forEach(({ title, link, description, isWatched, postId }) => {
    const post = document.createElement('li');
    post.classList.add('list-group-item');
    const title = document.createElement('a');
    title.setAttribute('href', link);
    if (isWatched) {
      title.classList.remove('font-weight-bold');
      title.classList.add('font-weight-normal');
    } else {
      title.classList.remove('font-weight-normal');
      title.classList.add('font-weight-bold');
    }
    title.textContent = title;
    const detailsBtn = document.createElement('button');
    detailsBtn.setAttribute('type', 'button');
    detailsBtn.classList.add('btn', 'btn-primary');
    detailsBtn.dataset.toggle = 'modal';
    detailsBtn.dataset.target = '#detailsModal';
    detailsBtn.dataset.postId = postId;
    detailsBtn.textContent = 'Details';
    detailsBtn.addEventListener('click', () => {
      const postIndex = watchedState.posts.findIndex(({ postId }) => postId === detailsBtn.dataset.postId);
      const post = watchedState.posts[postIndex];
      watchedState.posts[postIndex].isWatched = true;
      const detailsModal = document.getElementById('detailsModal');
      const modalTitle = detailsModal.querySelector('.modal-title');
      const modalBody = detailsModal.querySelector('.modal-body');
      const modalViewButton = detailsModal.querySelector('.modal-footer > a');
      modalTitle.textContent = post.title;
      modalBody.textContent = post.description;
      modalViewButton.setAttribute('href', post.link);
    });
    post.append(title, detailsBtn);
    postsList.append(post);
  });
};
