import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
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

export default onChange(state, (path, value) => {
  i18nInstance.then(() => {
    const props = {
      input: {
        isInvalid: false,
        isDisabled: false,
      },
      isSubmitDisabled: false,
      feedback: '',
      channels: state.channels,
      posts: state.posts,
    };
    if (path !== 'form.state') {
      render(props);
    }
    switch (value) {
      case 'same url':
        props.input.isInvalid = true;
        props.feedback = i18next.t('sameUrl');
        render(props);
        break;
      case 'not url':
        props.input.isInvalid = true;
        props.feedback = i18next.t('notUrl');
        render(props);
        break;
      case 'network error':
        props.feedback = i18next.t('networkError');
        render(props);
        break;
      case 'parsing error':
        props.feedback = i18next.t('parsingError');
        render(props);
        break;
      case 'sending':
        props.input.isDisabled = true;
        props.isSubmitDisabled = true;
        render(props);
        break;
      case 'success':
        props.feedback = i18next.t('success');
        render(props);
        break;
      default:
        break;
    }
  });
});
