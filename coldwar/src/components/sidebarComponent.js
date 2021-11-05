import React from "react";
import "../styles/sidebarComponent.scss";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Accordion, Tabs, Tab } from "react-bootstrap";
import { SidebarMenuIcon } from "./svg";

function Sidebar() {
  const items = useSelector((state) => state.main);
  const app = useSelector((state) => state.app);
  const dispatch = useDispatch();

  function closeSidebar() {
    const width = window.innerWidth;
    if (width <= 768) {
      dispatch({ type: "TOGGLE_SIDEBAR" });
    }
  }

  return (
    <div
      className="tracker_sidebar"
      style={{ left: app.isOpen ? "0px" : "-300px" }}
    >
      <div className="tracker_sidebar_header">
        <div
          className="tracker_sidebar_header_menu"
          onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
        >
          <SidebarMenuIcon />
        </div>
        <div className="tracker_sidebar_header_link">
          <Link to="/" onClick={closeSidebar}>
            CAMO TRACKER
          </Link>
        </div>
      </div>
      <div className="tracker_sidebar_main">
        <Tabs
          defaultActiveKey={app.isActive}
          id="uncontrolled-tab-example"
          onSelect={(k) => dispatch({ type: "TOGGLE_TAB", mast: k })}
        >
          {["dm", "da"].map((mast) => {
            const collapsibleId =
              mast === "dm"
                ? app.collapsibleIsOpen.dm
                : app.collapsibleIsOpen.da;
            return (
              <Tab
                key={`tab-${mast}`}
                eventKey={mast}
                title={
                  <Link to={`/${mast}`} onClick={closeSidebar}>
                    {mast.toUpperCase()}
                  </Link>
                }
              >
                {items.map((category, index) => {
                  return (
                    <Accordion
                      defaultActiveKey={collapsibleId[index] && "0"}
                      key={category.name + mast}
                      onClick={() =>
                        dispatch({
                          type: "TOGGLE_COLLAPSIBLE",
                          mast: mast,
                          id: index,
                        })
                      }
                    >
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          {category.name.toUpperCase()}
                        </Accordion.Header>
                        <Accordion.Body className="d-flex flex-column align-items-start">
                          {category.weapons.map((weapon) => {
                            return (
                              <div
                                className="tracker_sidebar_main_item"
                                key={weapon.name + mast}
                              >
                                <Link
                                  to={
                                    "/weapon/" +
                                    mast +
                                    "_" +
                                    category.id +
                                    "_" +
                                    weapon.id
                                  }
                                  onClick={closeSidebar}
                                >
                                  {weapon.name.toUpperCase()}
                                </Link>
                                {weapon.dlc && (
                                  <sup className="tracker_sidebar_container_collapse_dlc">
                                    {" "}
                                    DLC
                                  </sup>
                                )}
                              </div>
                            );
                          })}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  );
                })}
              </Tab>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}

export default Sidebar;
