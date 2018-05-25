import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { getItem } from './index';

const validate = (history) => {
	const isLoggedIn = !!getItem('USER');
  
	if (!isLoggedIn && history.location.pathname != '/login') {
    history.replace('/login');
    return;
  }
}

/**
 * 校验是否有老师信息，没有的话拉取老师信息
 * @type {[type]}
 */
const authHOC = (BaseComponent) => {
	class Restricted extends Component {
		componentWillMount() {
			this.checkAuthentication(this.props);	
		}			
	 

	 componentWillReceiveProps(nextProps) {
      if (nextProps.location !== this.props.location) {
        this.checkAuthentication(nextProps);
      }
    }

    checkAuthentication(params) {
      const { history } = params;

      validate(history);
    }
    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  return withRouter(Restricted);
}

export default authHOC;