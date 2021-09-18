const initialState = {
	token: null,
	refresh_token: null,
	userId: null,
	email: null,
	nick: null,
	isAuth: false,
};

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case "LOG_IN":
			return {
				...state,
				token: action.token,
				refresh_token: action.refresh_token,
				userId: action.userId,
				email: action.email,
				nick: action.nick,
				isAuth: true,
			};
		default:
			return state;
	}
};

export default userReducer;
