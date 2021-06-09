import onChange from 'on-change';
import i18next from 'i18next';
import state from './state';
import render from './render';

const i18nInstance = i18next.createInstance({
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

const watchedState = onChange(state, (path, value) => {
  i18nInstance.then(() => {
    const props = {
      inputState: {
        isInvalid: false,
        isDisabled: false,
      },
      isSubmitDisabled: false,
      feedback: '',
      channels: state.channels,
      posts: state.posts,
    };
    if (path !== 'form.state') {
      render(props, watchedState);
    }
    switch (value) {
      case 'same url':
        props.inputState.isInvalid = true;
        props.feedback = i18next.t('sameUrl');
        render(props, watchedState);
        break;
      case 'not url':
        props.inputState.isInvalid = true;
        props.feedback = i18next.t('notUrl');
        render(props, watchedState);
        break;
      case 'network error':
        props.feedback = i18next.t('networkError');
        render(props, watchedState);
        break;
      case 'parsing error':
        props.feedback = i18next.t('parsingError');
        render(props, watchedState);
        break;
      case 'sending':
        props.inputState.isDisabled = true;
        props.isSubmitDisabled = true;
        render(props, watchedState);
        break;
      case 'success':
        props.feedback = i18next.t('success');
        render(props, watchedState);
        break;
      default:
        break;
    }
  });
});

export default watchedState;
