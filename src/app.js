import css from './styles/app.scss';

import ajax_queries from './scripts/ajax_queries.js';
import edit from './scripts/edit.js';
import upload from './scripts/upload.js';
import view from './scripts/view.js';
import table_devices from './scripts/table_devices.js';
import validation from './scripts/validation.js';
import main from './scripts/main.js';

import mainTwig from './main.html.twig';

const html = mainTwig({title: 'main title'});

let test = "test";
console.log(test);

$('body').addClass('new');