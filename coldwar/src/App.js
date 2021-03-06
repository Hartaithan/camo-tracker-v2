import "./styles/App.scss";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";
import axios from "axios";

import MainPage from "./pages/mainPage";
import MasterPage from "./pages/masterPage";
import WeaponPage from "./pages/weaponPage";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";

import Sidebar from "./components/sidebarComponent";
import SettingsComponent from "./components/settingsComponent";
import ConfirmModal from "./components/confirmModal";
import PublicPage from "./pages/publicPage";
import DemoBadge from "./components/demoBadge";
import API from "./api";

function App() {
  const dispatch = useDispatch();
  const main = useSelector((state) => state.main);
  const { isFirstUpdate } = useSelector((state) => state.app);
  const { isAuth, isDemo } = useSelector((state) => state.user);
  const [request, setRequest] = React.useState(null);
  const isFirstRun = React.useRef(true);

  const getData = React.useCallback(async () => {
    await API.get("/data/get")
      .then((response) => {
        dispatch({ type: "SYNC_DATA", state: response.data });
        dispatch({ type: "SET_FIRST_UPDATE" });
        toast.success("Progress from the database is received.");
      })
      .catch((error) => {
        if (error.response) {
          console.error(
            "getData error with message",
            error.response?.data.message
          );
          toast.error("Failed to retrieve progress from the database.");
        } else {
          console.error("getData error", error);
        }
      });
  }, []); // eslint-disable-line

  const getDemo = React.useCallback(async () => {
    await API.get("/data/demo")
      .then((response) => {
        dispatch({ type: "SYNC_DATA", state: response.data });
        dispatch({ type: "SET_FIRST_UPDATE" });
      })
      .catch((error) => {
        if (error.response?.data.message) {
          console.error(
            "getDemo error with message",
            error.response?.data.message
          );
        } else {
          console.error("getDemo error", error);
        }
        toast.error("Failed to retrieve data from the database.");
      });
  }, []); // eslint-disable-line

  React.useEffect(() => {
    if (isAuth && isDemo) {
      getDemo();
    }
    if (isAuth && !isDemo) {
      getData();
    }
  }, [isAuth]); // eslint-disable-line

  const syncData = React.useCallback(async () => {
    const source = axios.CancelToken.source();
    setRequest(source);
    if (request) {
      request.cancel();
    }
    await API.post("/data/sync", JSON.stringify(main), {
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
            console.error("syncData error.resonse.data", error.response.data);
            return;
          }
          toast.error("Unable synchronize progress with database... ");
          console.error("syncData error.resonse", error.response);
        }
      });
  }, [main]); // eslint-disable-line

  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (isDemo || isFirstUpdate || !isAuth) {
      return;
    }
    syncData();
  }, [main]); // eslint-disable-line

  // window.addEventListener("beforeunload", (ev) => {
  //   ev.preventDefault();
  //   if (isDemo) {
  //     dispatch({ type: "LOG_OUT" });
  //     localStorage.removeItem("coldwar");
  //   }
  // });

  if (isAuth) {
    return (
      <div className="tracker">
        {main.length === 0 ? (
          <div className="tracker_loader">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
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
              <Redirect to="/" />
            </Switch>
            <ConfirmModal />
          </>
        )}
        {isDemo && <DemoBadge />}
      </div>
    );
  }

  return (
    <div className="tracker">
      <Switch>
        <Route exact path="/">
          <PublicPage />
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
