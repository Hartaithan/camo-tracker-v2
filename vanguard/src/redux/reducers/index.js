import { combineReducers } from "redux";
import mainReducer from "./mainReducer";
import appReducer from "./appReducer";
import userReducer from "./userReducer";

const initialReducer = combineReducers({
  main: mainReducer,
  app: appReducer,
  user: userReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LOG_OUT") {
    localStorage.clear();
    return initialReducer(undefined, action);
  }

  return initialReducer(state, action);
};

export default rootReducer;
