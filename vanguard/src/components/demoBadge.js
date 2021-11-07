import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "../styles/demoBadge.scss";

function DemoBadge() {
  const history = useHistory();
  const dispatch = useDispatch();

  function logOut() {
    dispatch({ type: "LOG_OUT" });
    localStorage.removeItem("vanguard");
    history.push("/register");
  }

  return (
    <div className="tracker_demo">
      <p className="tracker_demo_title">Demo verison</p>
      <p className="tracker_demo_descr">
        This is a demo version. Progress will not be saved, register or log in
        to your account to save progress.
      </p>
      <button className="tracker_demo_button" onClick={() => logOut()}>
        REGISTER
      </button>
    </div>
  );
}

export default DemoBadge;
