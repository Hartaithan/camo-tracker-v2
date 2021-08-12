import { createStore } from "redux";
import { loadState, saveState } from "../localStorage";
import rootReducer from "./reducers";

const persistedState = loadState();
const devTools =
  process.env.NODE_ENV === "production" &&
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__();
const store = createStore(rootReducer, persistedState, devTools);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
