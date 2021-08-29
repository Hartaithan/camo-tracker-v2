const initialState = {
	isOpen: false,
	isActive: "dm",
	collapsibleIsOpen: {
		dm: [false, false, false, false, false, false, false, false, false, false],
		da: [false, false, false, false, false, false, false, false, false, false],
	},
	masterCollapsibleIsOpen: {
		dm: [false, false, false, false, false, false, false, false, false, false],
		da: [false, false, false, false, false, false, false, false, false, false],
	},
	settings: false,
};

const appReducer = (state = initialState, action) => {
	let newArray = [];
	switch (action.type) {
		case "TOGGLE_TAB":
			return { ...state, isActive: action.mast };
		case "TOGGLE_SIDEBAR":
			return { ...state, isOpen: !state.isOpen };
		case "TOGGLE_COLLAPSIBLE":
			newArray = state.collapsibleIsOpen[action.mast];
			newArray[action.id] = !newArray[action.id];
			return {
				...state,
				collapsibleIsOpen: {
					...state.collapsibleIsOpen,
					[action.mast]: newArray,
				},
			};
		case "TOGGLE_MASTER_COLLAPSIBLE":
			newArray = state.masterCollapsibleIsOpen[action.mast];
			newArray[action.id] = !newArray[action.id];
			return {
				...state,
				masterCollapsibleIsOpen: {
					...state.masterCollapsibleIsOpen,
					[action.mast]: newArray,
				},
			};
		case "TOGGLE_SETTINGS":
			return { ...state, settings: !state.settings };
		case "LOG_OUT":
			return { ...state, isOpen: false, settings: false };
		default:
			return state;
	}
};

export default appReducer;
