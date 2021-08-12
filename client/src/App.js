import "./styles/App.scss";
import React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";

import MainPage from "./pages/mainPage";
import MasterPage from "./pages/masterPage";
import WeaponPage from "./pages/weaponPage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";

import Sidebar from "./components/sidebarComponent";
import SettingsComponent from "./components/settingsComponent";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const main = useSelector((state) => state.main);
  const { isAuth, token } = useSelector((state) => state.user);
  const [request, setRequest] = React.useState(null);

  const getData = React.useCallback(async () => {
    try {
      await axios
        .get("/api/data/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          dispatch({ type: "SYNC_DATA", state: response.data });
          toast.success("Progress from the database is received.");
          dispatch({ type: "STATE_UPDATE" });
        })
        .catch(function (error) {
          toast.error("Failed to retrieve progress from the database.");
          if (error.response.data.message) {
            console.log(error.response.data.message);
          } else {
            console.log(error.response.data);
          }
          if (error.response.data.isExpired) {
            dispatch({ type: "LOG_OUT" });
            dispatch({ type: "RESET_ALL" });
            history.push("/login");
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [token, dispatch, history]);

  React.useEffect(() => {
    if (isAuth) {
      getData();
    }
  }, [isAuth]); // eslint-disable-line

  const syncData = React.useCallback(async () => {
    const source = axios.CancelToken.source();
    setRequest(source);
    if (request) {
      request.cancel();
    }
    await axios
      .post("/api/data/sync", JSON.stringify(main), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cancelToken: source.token,
      })
      .then((response) => {
        setRequest(null);
        toast.success(response?.data);
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.data.message) {
            toast.error(
              error.response.data.message || "Something went wrong..."
            );
            console.log(error.response.data);
          }
          toast.error("Unable synchronize progress with database... ");
          console.log(error.response);
        }
      });
  }, [request, token, main]);

  React.useEffect(() => {
    if (isAuth) {
      syncData();
    }
  }, [main]); // eslint-disable-line

  if (isAuth) {
    return (
      <div className="tracker">
        <Sidebar />
        <SettingsComponent />
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route path="/dm">
            <MasterPage />
          </Route>
          <Route path="/da">
            <MasterPage />
          </Route>
          <Route path="/weapon">
            <WeaponPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/register">
            <RegisterPage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }

  return (
    <div className="tracker">
      <Switch>
        <Route exact path="/">
          <LoginPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
