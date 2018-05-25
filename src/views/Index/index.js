import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Flex } from 'antd-mobile';

import { URL } from '@/api';
import Http from '@/utils/base';
import { getItem, getCookie } from '@/utils';
import './index.less';

class Index extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		/**
		const { NODE_ENV } = process.env;
		const token = getItem('COOKIE_TOKEN_KEY');
		const params = {
			data: {
				originUrl: window.location.href
			},
			noToken: true,
			method: 'POST'
		}

		if (NODE_ENV == 'development') return;
		
		if (token == null) {
			Http.ajax(URL.wechat_auth_link, params).then(res => {
	            if (res.code == 0) {
	                window.location.href = res.data.wechatAuthUrl;
	            }
	        });
		}
		**/
	}

	render() {
		return (
			<div className="teacher-index">
				<Flex
					justify="around" 
					className="t-menu" >
					<Link to="/searchcourse">课程查询</Link>
					<Link to="/coursesignin/0">签到销课</Link>
					<Link to="/taskcourse">批改作业</Link>
			    </Flex>
			</div>
		)
	}
}

export default Index;