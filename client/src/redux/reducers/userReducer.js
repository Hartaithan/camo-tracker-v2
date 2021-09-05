const initialState = {
	token: null,
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
