import 'babel-polyfill';
import React from 'react'
import { render } from 'react-dom';
import Component from './CompileComponent'

render(
  <Component></Component>,
  document.getElementById('app')
);
