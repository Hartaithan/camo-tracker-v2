import { combineReducers } from "redux";
import mainReducer from "./mainReducer";
import appReducer from "./appReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  main: mainReducer,
  app: appReducer,
  user: userReducer,
});

export default rootReducer;
