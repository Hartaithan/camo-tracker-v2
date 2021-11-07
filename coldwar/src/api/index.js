import axios from "axios";
import store from "../redux";

export function API() {
  const { user } = store.getState();

  if (user.token !== null) {
    return axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
        appName: "coldwar",
      },
    });
  } else {
    console.error("Token is null");
  }
}

export function Auth() {
  return axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
      "Content-Type": "application/json",
      appName: "coldwar",
    },
  });
}
