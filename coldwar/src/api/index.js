import axios from "axios";
import store from "../redux";

function API() {
  const { user } = store.getState();

  return axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  });
}

export default API();
