import { createStore } from "redux";
import { devToolsEnhancer } from 'redux-devtools-extension';
import { loadState, saveState } from "../localStorage";
import rootReducer from "./reducers";

const persistedState = loadState();
const devTools = process.env.NODE_ENV !== 'production' && devToolsEnhancer({});
const store = createStore(rootReducer, persistedState, devTools);

store.subscribe(() => {
	saveState(store.getState());
});

export default store;
