import axios from "axios";
import store from "../redux";
import { toast } from "react-hot-toast";

const conf = {
  baseURL: `${process.env.REACT_APP_API_URL}`,
};

const API = axios.create(conf);

function handleLogOut() {
  store.dispatch({ type: "LOG_OUT" });
  localStorage.removeItem("vanguard");
}

API.interceptors.request.use(
  function (config) {
    const { token } = store.getState().user;
    config.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      appName: "vanguard",
    };
    return config;
  },
  function (error) {
    console.error("request interceptor error", error.response);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.data.isExpired) {
      const { refresh_token } = store.getState().user;
      axios
        .post(`${process.env.REACT_APP_API_URL}/refresh`, { refresh_token })
        .then((response) => {
          if (response) {
            store.dispatch({
              type: "UPDATE_TOKENS",
              token: response.data.token,
              refresh_token: response.data.refresh_token,
            });
            return API.request(error.config).then((response) => {
              switch (error.config.url) {
                case "/data/get":
                  store.dispatch({ type: "SYNC_DATA", state: response.data });
                  store.dispatch({ type: "SET_FIRST_UPDATE" });
                  toast.success("Progress from the database is received.");
                  break;
                case "/data/sync":
                  toast.success(
                    response?.data ||
                      "Progress is synchronized with the database."
                  );
                  break;
                case "/data/reset":
                  store.dispatch({
                    type: "SYNC_DATA",
                    state: response.data.state,
                  });
                  toast.success(response?.data.message);
                  break;
                default:
                  console.error("API.request(error.config)");
                  break;
              }
            });
          }
        })
        .catch(function (error) {
          console.error("refresh error", error);
          handleLogOut();
          return Promise.reject(error);
        });
    } else {
      console.error("response interceptor error", error.response.data);
      toast.error(error?.response.data.message || "Something went wrong...");
      handleLogOut();
      return Promise.reject(error);
    }
  }
);

export default API;
