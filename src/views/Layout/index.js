import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { childRoutes } from '@/route';
import { URL } from '@/api';
import Http from '@/utils/base';
import { getItem, getCookie } from '@/utils';
import './index.less';

class App extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		// 此处获取token
		this.getToken();
	}

	async getToken() {
		const href = window.location.href;
		const { NODE_ENV } = process.env;
		const token = getItem('COOKIE_TOKEN_KEY');
		const params = {
			data: {
				originUrl: window.location.href
			},
			noToken: true,
			method: 'POST'
		}

		if (NODE_ENV != 'development' && href.indexOf('sharepage') == -1 && href.indexOf('tashdetail') == -1) {
			if (token == null) {
				await Http.ajax(URL.wechat_auth_link, params).then(res => {
		            if (res.code == 0) {
		                window.location.href = res.data.wechatAuthUrl;
		            }
		        });
			} 
		}
	}

	render() {
		return (
			<div className="layout-content">
    			{
    				childRoutes.map((route, index) => (
	                	<Route key={index} path={route.path} component={route.component} exactly={route.exactly} />
	            	))
	            }	
    		</div>	
		)
	}
}

App.propTypes = {
  	//auth: PropTypes.object,
};

export default App;

/**
const mapStateToProps = (state) => {
  	const { auth, menu } = state;

  	return {
    	auth: auth ? auth : null
  	};	
};

const mapDispatchToProps = (dispatch) => {
  	return bindActionCreators({ logout }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
**/











