import onChange from 'on-change';
import state from './state';

export default onChange(state, (path, value) => {
  if (path === 'form.state') {
    const input = document.getElementById('inputUrl');
    const submit = document.getElementById('submit');
    input.classList.remove('is-invalid');
    input.setAttribute('disabled', 'false');
    submit.setAttribute('disabled', 'false');
    const channelsList = document.querySelector('[data-id="channels"]');
    channelsList.innerHTML = '';
    const postsList = document.querySelector('[data-id="posts"]');
    postsList.innerHTML = '';
    const errorContainer = document.querySelector('[data-id="error"]');
    errorContainer.innerHTML = '';
    switch (value) {
      case 'error':
        errorContainer.textContent = state.form.error;
        break;
      case 'invalid':
        errorContainer.textContent = state.form.error;
        input.classList.add('is-invalid');
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
        break;
      default:
        break;
    }
  }
});
