import axios from "axios";
import store from "../redux";

const conf = {
  baseURL: `${process.env.REACT_APP_API_URL}`,
};

const API = axios.create(conf);

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
    console.error("request interceptor error", error);
    return Promise.reject(error);
  }
);

export default API;
