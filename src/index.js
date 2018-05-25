import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

import configStore from './store';
import route from './route';
import { getCookie, addItem } from '@/utils';
import 'whatwg-fetch';

const store = configStore();
let COOKIE_TOKEN_KEY = getCookie('COOKIE_TOKEN_KEY');

if (COOKIE_TOKEN_KEY) {
	COOKIE_TOKEN_KEY = JSON.parse(COOKIE_TOKEN_KEY);
	COOKIE_TOKEN_KEY = eval('('+COOKIE_TOKEN_KEY+')');
	
	addItem('COOKIE_TOKEN_KEY', COOKIE_TOKEN_KEY);
}

render(
	<AppContainer>
  		<Provider store={ store }>
    		<Router children={ route } />
  		</Provider>
  	</AppContainer>,
  	document.getElementById('root')
);

