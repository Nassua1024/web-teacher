import { USER_SET, LOGOUT } from '../actions/auth';
import { removeItem } from '@/utils'

const initialState = {};

const auth = (state = initialState, action = {}) => {
	switch(action.type) {
		case USER_SET:
			return Object.assign({}, initialState, action.payload);	
		case LOGOUT:
			// 清空 localStorage
			removeItem('USER');

			return {}
		default:
			return state;
	}		
}

export default auth;