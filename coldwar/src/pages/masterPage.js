import React from "react";
import "../styles/masterPage.scss";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "../components/headerComponent";
import { Accordion } from "react-bootstrap";

function MasterPage() {
  const paths = useLocation().pathname.split("/");
  const id_mast = paths[1];
  const [size, setSize] = React.useState(window.innerWidth);

  const main = useSelector((state) => state.main);
  const app = useSelector((state) => state.app);
  const dispatch = useDispatch();

  function debounce(fn, ms) {
    let timer;
    return (_) => {
      clearTimeout(timer);
      timer = setTimeout((_) => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }

  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setSize(window.innerWidth);
    }, 300);
    window.addEventListener("resize", debouncedHandleResize);
    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });

  var style = {
    isOpen: {
      width: "calc(100% - 300px)",
      marginLeft: "300px",
    },
    isClosed: {
      marginLeft: "0px",
    },
  };

  function calcPerc(id_cat) {
    let n = 0;
    let length = 0;
    main[id_cat - 1].weapons.forEach((weapon) => {
      n = n + weapon.camos[id_mast].filter(Boolean).length;
      length = length + weapon.camos[id_mast].length;
    });
    const percentage = (n / length) * 100;
    return Math.round(percentage) + "%";
  }

  function calcPercWeap(id_cat, id_weap) {
    const array = main[id_cat - 1].weapons[id_weap - 1].camos[id_mast];
    const percentage = (array.filter(Boolean).length / array.length) * 100;
    return Math.round(percentage) + "%";
  }

  return (
    <div
      className="tracker_container"
      style={app.isOpen ? style.isOpen : style.isClosed}
    >
      <Header />
      <div className="tracker_master">
        {main.map((items, index) => (
          <Accordion
            defaultActiveKey={
              app.masterCollapsibleIsOpen[id_mast][index] && "0"
            }
            key={items.name + id_mast}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header
                onClick={() =>
                  dispatch({
                    type: "TOGGLE_MASTER_COLLAPSIBLE",
                    mast: id_mast,
                    id: index,
                  })
                }
              >
                <div className="tracker_master_container_progress_text">
                  <div className="tracker_master_container_progress_text_name">
                    {items.name.toUpperCase()}
                  </div>
                  <div className="tracker_master_container_progress_text_percentage">
                    {calcPerc(items.id)}
                  </div>
                </div>
              </Accordion.Header>
              <div className="tracker_master_container_progress_bar">
                <div
                  className="tracker_master_container_progress_bar_yellow"
                  style={{ width: calcPerc(items.id) }}
                />
              </div>
              <Accordion.Body className="d-flex flex-column align-items-start">
                <div
                  className="tracker_master_container_weaponlist"
                  style={{
                    gridTemplateColumns:
                      "repeat(" +
                      (app.isOpen
                        ? Math.floor((size - 300) / 210)
                        : Math.floor(size / 210)) +
                      ", 200px)",
                  }}
                >
                  {items.weapons.map((weapon) => (
                    <Link
                      to={
                        "/weapon/" + id_mast + "_" + items.id + "_" + weapon.id
                      }
                      key={weapon.name}
                    >
                      <div
                        className="tracker_master_container_weaponlist_weaponcontainer"
                        key={weapon.id}
                      >
                        {weapon.dlc && (
                          <div className="tracker_master_container_weaponlist_weaponcontainer_dlc">
                            <div className="tracker_master_container_weaponlist_weaponcontainer_dlc_text">
                              DLC
                            </div>
                          </div>
                        )}
                        <p className="tracker_master_container_weaponlist_weaponcontainer_card">
                          {weapon.name.toUpperCase()}
                        </p>
                        <div
                          className="tracker_master_container_weaponlist_weaponcontainer_yellowbar"
                          style={{ width: calcPercWeap(items.id, weapon.id) }}
                        ></div>
                        <div className="tracker_master_container_weaponlist_weaponcontainer_greybar"></div>
                        <div className="tracker_master_container_weaponlist_weaponcontainer_imgcontainer">
                          {weapon.img !== null ? (
                            <img
                              src={"camo-tracker/" + weapon.img}
                              alt="weapon_img"
                            ></img>
                          ) : (
                            "?"
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default MasterPage;
