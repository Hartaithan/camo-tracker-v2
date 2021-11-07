import "./styles/App.scss";
import React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
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
import { API } from "./api";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const main = useSelector((state) => state.main);
  const { isAuth, isDemo, refresh_token } = useSelector((state) => state.user);
  const [request, setRequest] = React.useState(null);
  const isFirstRun = React.useRef(true);
  const [isFirstUpdate, setFirstUpdate] = React.useState(true);

  const getDataAfterRefresh = React.useCallback(async () => {
    API().get("/data/get").then((response) => {
      dispatch({ type: "SYNC_DATA", state: response.data });
      toast.success("Progress from the database is received.");
      setFirstUpdate(false);
    });
  }, [dispatch]);

  const getData = React.useCallback(async () => {
    try {
      await API().get("/data/get")
        .then((response) => {
          dispatch({ type: "SYNC_DATA", state: response.data });
          toast.success("Progress from the database is received.");
          setFirstUpdate(false);
        })
        .catch((error) => {
          if (error.response.data.message) {
            console.error(
              "getData error with message",
              error.response.data.message
            );
          } else {
            console.error("getData error", error.response.data);
          }
          if (error.response.data.isExpired) {
            API().post("/refresh", { refresh_token })
              .then((response) => {
                dispatch({
                  type: "UPDATE_TOKENS",
                  token: response.data.token,
                  refresh_token: response.data.refresh_token,
                });
                getDataAfterRefresh();
              })
              .catch(function (error) {
                toast.error(
                  error.response.data.message || "Authorization error"
                );
                console.error("refresh error", error.response.data);
                dispatch({ type: "LOG_OUT" });
                localStorage.removeItem("state");
                history.push("/login");
              });
          }
        });
    } catch (error) {
      console.error("getData catch (error)", error);
      toast.error("Failed to retrieve progress from the database.");
    }
  }, [refresh_token, dispatch, getDataAfterRefresh, history]);

  React.useEffect(() => {
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
    await API().post("/data/sync", JSON.stringify(main), {
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
  }, [request, main]);

  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      if (isAuth && !isDemo) {
        if (!isFirstUpdate) {
          syncData();
        }
      }
    }
  }, [main]); // eslint-disable-line

  window.addEventListener("beforeunload", (ev) => {
    ev.preventDefault();
    if (isDemo) {
      dispatch({ type: "LOG_OUT" });
      localStorage.removeItem("state");
    }
  });

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
              <Route path="/at">
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
