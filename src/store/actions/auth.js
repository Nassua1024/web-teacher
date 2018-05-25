export const USER_SET = 'USER_SET';
export const LOGOUT = 'LOGOUT';

export const setUser = (user) => {
	return {
		type: USER_SET,
		payload: {
			user
		}
	}
}

export const logout = () => {
	return {
		type: LOGOUT,
		payload: {}
	}
}