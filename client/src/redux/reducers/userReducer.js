const initialState = {
	token: null,
	refresh_token: null,
	userId: null,
	email: null,
	nick: null,
	isAuth: false,
	isDemo: false,
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
		case "DEMO_IN":
			return {
				...state,
				email: "demo@demo.com",
				nick: "demo",
				isAuth: true,
				isDemo: true,
			};
		case "UPDATE_TOKENS":
			return {
				...state,
				token: action.token,
				refresh_token: action.refresh_token,
			};
		default:
			return state;
	}
};

export default userReducer;
