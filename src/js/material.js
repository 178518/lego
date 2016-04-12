'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Demo from './components/material';

injectTapEventPlugin();

ReactDOM.render(<Demo/>, document.getElementById('material'));
