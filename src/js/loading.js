'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Loading from './components/loading';

window['rc-loading'] = ReactDOM.render(<Loading type="small" color="blue"/>, document.getElementById('loading'));
