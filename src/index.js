import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const generateForm = () => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const submit = document.createElement('input');
  submit.setAttribute('type', 'submit');
  form.appendChild(input);
  form.appendChild(submit);
};

document.body.appendChild(generateForm());
