import React from "react";
import "../styles/settingsComponent.scss";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { LogOutIcon, SettingsIcon } from "./svg";

function SettingsComponent() {
  const paths = useLocation().pathname.split("/");
  const main = useSelector((state) => state.main);
  const app = useSelector((state) => state.app);
  const { nick, email, isDemo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  function getName() {
    let name = "";
    if (paths[1] === "") {
      name = "MAIN";
    } else if (paths[1] === "at") {
      name = "ATOMIC";
    } else if (paths[1] === "da") {
      name = "DARK AETHER";
    } else if (paths[1] === "weapon") {
      const [id_mast, id_cat, id_weap] = paths[2].split("_");
      name = `${main[id_cat - 1].weapons[
        id_weap - 1
      ].name.toUpperCase()} (${id_mast.toUpperCase()})`;
    }
    return name;
  }

  function dispatchWeapon() {
    if (paths[1] === "weapon") {
      const [id_mast, id_cat, id_weap] = paths[2].split("_");
      dispatch({
        type: "TOGGLE_WEAPON",
        id_cat: id_cat,
        id_weap: id_weap,
        id_mast: id_mast,
      });
    }
  }

  function closeSidebar() {
    const width = window.innerWidth;
    if (width <= 768) {
      dispatch({ type: "TOGGLE_SETTINGS" });
    }
  }

  return (
    <div
      className="tracker_settings"
      style={{ right: app.settings ? "0px" : "-300px" }}
    >
      <div className="tracker_settings_header">
        <div className="tracker_settings_header_title">SETTINGS</div>
        <div
          className="tracker_settings_header_button"
          onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })}
        >
          <SettingsIcon />
        </div>
      </div>
      <div className="tracker_settings_container">
        <div className="tracker_settings_container_user">
          <div className="tracker_settings_container_user_name">
            <p>@{nick}</p>
            <p>{email}</p>
          </div>
          <div
            className="tracker_settings_container_user_logout"
            onClick={() => dispatch({ type: "CONFIRM_LOGOUT_MODAL_OPEN" })}
          >
            <LogOutIcon />
          </div>
        </div>
        <div className="tracker_settings_container_buttons">
          {paths[1] === "weapon" && (
            <button
              className="tracker_settings_container_buttons_complete"
              onClick={() => {
                dispatchWeapon();
                closeSidebar();
              }}
            >
              COMPLETE {getName()}
            </button>
          )}
          <button
            className={
              isDemo
                ? "tracker_settings_container_buttons_reset disabled"
                : "tracker_settings_container_buttons_reset"
            }
            disabled={isDemo && true}
            onClick={() => {
              dispatch({ type: "CONFIRM_RESET_MODAL_OPEN" });
              closeSidebar();
            }}
          >
            RESET ALL
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsComponent;
