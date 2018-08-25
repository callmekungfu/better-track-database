import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import Root from './track/containers/Root';

import './index.css';

// Render the root of application in the element with the ID 'root'
render(
    <Root />,
    document.getElementById('root')
);
