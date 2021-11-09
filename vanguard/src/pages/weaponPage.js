import React from "react";
import "../styles/weaponPage.scss";
import db_at_camo from "../data/db_at_camo.json";
import db_da_camo from "../data/db_da_camo.json";
import db_at_mission from "../data/db_at_mission.json";
import db_da_mission from "../data/db_da_mission.json";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Header from "../components/headerComponent";
import { toast } from "react-hot-toast";
import { CheckCamoIcon, LockIcon } from "../components/svg";

function WeaponPage() {
  const paths = useLocation().pathname.split("/");
  const [id_mast, id_cat, id_weap] = paths[2].split("_");

  const main = useSelector((state) => state.main);
  const camos = id_mast === "at" ? db_at_camo : db_da_camo;
  const mission = id_mast === "at" ? db_at_mission : db_da_mission;
  const app = useSelector((state) => state.app);
  const dispatch = useDispatch();

  var style = {
    isOpen: {
      width: "calc(100% - 300px)",
      marginLeft: "300px",
    },
    isClosed: {
      marginLeft: "0px",
    },
  };

  function getMission(id_camo_cat, id_camo) {
    const goal =
      mission[id_cat - 1].weapons[id_weap - 1].camos[id_camo_cat - 1].goals[
        id_camo
      ];
    const name = mission[id_cat - 1].weapons[id_weap - 1].name;
    const camo_name = camos[id_camo_cat - 1].camos[id_camo].name;
    const getMission = mission[id_cat - 1].weapons[id_weap - 1].camos[
      id_camo_cat - 1
    ].mission
      .replace(/_goal/i, goal)
      .replace(/_name/i, name);
    return `${camo_name}:\n${getMission}`;
  }

  function getMasteryMission(id_camo_cat, id_camo) {
    const name = mission[id_cat - 1].weapons[id_weap - 1].name;
    const getMasteryMission = mission[id_cat - 1].weapons[id_weap - 1].camos[
      id_camo_cat - 1
    ].mission[id_camo].replace(/_name/i, name);
    const camo_name = camos[id_camo_cat - 1].camos[id_camo].name;
    return `${camo_name}:\n${getMasteryMission}`;
  }

  function calcPerc(id_camocat) {
    let array = [];
    if (id_camocat === 1) {
      array = main[id_cat - 1].weapons[id_weap - 1].camos[id_mast].slice(0, 5);
    } else if (id_camocat === 2) {
      array = main[id_cat - 1].weapons[id_weap - 1].camos[id_mast].slice(5, 10);
    } else if (id_camocat === 3) {
      array = main[id_cat - 1].weapons[id_weap - 1].camos[id_mast].slice(
        10,
        15
      );
    } else if (id_camocat === 4) {
      array = main[id_cat - 1].weapons[id_weap - 1].camos[id_mast].slice(
        15,
        20
      );
    } else if (id_camocat === 5) {
      array = main[id_cat - 1].weapons[id_weap - 1].camos[id_mast].slice(
        20,
        25
      );
    } else if (id_camocat === 6) {
      array = main[id_cat - 1].weapons[id_weap - 1].camos[id_mast].slice(
        25,
        30
      );
    } else if (id_camocat === 7) {
      array = main[id_cat - 1].weapons[id_weap - 1].camos[id_mast].slice(
        30,
        35
      );
    } else if (id_camocat === 8) {
      array = main[id_cat - 1].weapons[id_weap - 1].camos[id_mast];
    }
    const percentage = (array.filter(Boolean).length / array.length) * 100;
    return Math.round(percentage) + "%";
  }

  function checkMastery(id_camo) {
    // CHECK GOLD
    if (id_camo === 36) {
      return main[id_cat - 1].weapons[id_weap - 1].completed[id_mast] ? 0 : 1;
      // CHECK DIAMOND
    } else if (id_camo === 37) {
      if (main[id_cat - 1].weapons[id_weap - 1].dlc) {
        if (main[id_cat - 1].weapons[id_weap - 1].completed[id_mast]) {
          return main[id_cat - 1].completed[id_mast] ? 0 : 1;
        }
      } else {
        return main[id_cat - 1].completed[id_mast] ? 0 : 1;
      }
      // CHECK MASTERY
    } else if (id_camo === 38) {
      let n = 0;
      main.map((weapon) => {
        if (weapon.completed[id_mast] === true) {
          n++;
        }
        return n;
      });
      if (main[id_cat - 1].weapons[id_weap - 1].dlc) {
        if (main[id_cat - 1].weapons[id_weap - 1].completed[id_mast]) {
          return n === main.length ? 0 : 1;
        }
      } else {
        return n === main.length ? 0 : 1;
      }
    }
  }

  const [show, setShow] = React.useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  function setShowCheck(index) {
    if (index !== 7) {
      show[index] = !show[index];
      setShow([...show, show]);
    }
  }

  function setCamo(id_camo, index, i) {
    const type = {
      type: "TOGGLE_CAMO",
      id_cat: id_cat,
      id_weap: id_weap,
      id_camo: id_camo,
      id_mast: id_mast,
    };
    // ПРОВЕРКА НА ТО ПЕРВЫЙ ЛИ ЭТО КАМО В КАТЕГОРИИ ИЛИ НЕТ
    if (index === 0) {
      dispatch(type);
      return;
    } else {
      // РАЗДЕЛЕНИЕ САМО АРРЕЯ НА 7 ЧАСТЕЙ ПО 5 ЭЛЕМЕНТОВ
      const array = [...main[id_cat - 1].weapons[id_weap - 1].camos[id_mast]];
      let categories = [];
      while (array.length > 0) {
        categories.push(array.splice(0, 5));
      }
      const getCategoryArray = categories[i];
      if (getCategoryArray[index - 1] || getCategoryArray[index]) {
        dispatch(type);
      } else {
        toast.error("Previous camo is not unlocked.", {
          duration: 2000,
        });
      }
    }
  }

  return (
    <div
      className="tracker_container"
      style={app.isOpen ? style.isOpen : style.isClosed}
    >
      <Header />
      <div className="tracker_weapon">
        <div className="tracker_weapon_wrapper">
          {camos.map((item, i) => (
            <div
              className="tracker_weapon_wrapper_container"
              onMouseEnter={() => setShowCheck(i)}
              onMouseLeave={() => setShowCheck(i)}
              key={item.id}
            >
              <div className="tracker_weapon_wrapper_container_text">
                <div className="tracker_weapon_wrapper_container_text_name">
                  {item.name.toUpperCase()}
                </div>
                {i !== 7 && (
                  <div
                    className="tracker_weapon_wrapper_container_text_check"
                    onClick={() =>
                      dispatch({
                        type: "TOGGLE_CAMO_CATEG",
                        id_cat: id_cat,
                        id_weap: id_weap,
                        id_camo_cat: i + 1,
                        id_mast: id_mast,
                      })
                    }
                    style={{ opacity: show[i] ? "1" : "0" }}
                  >
                    <CheckCamoIcon />
                  </div>
                )}
                <div className="tracker_weapon_wrapper_container_text_percentage">
                  {calcPerc(item.id)}
                </div>
              </div>
              <div className="tracker_weapon_wrapper_container_bar">
                <div
                  className="tracker_weapon_wrapper_container_bar_yellow"
                  style={{ width: calcPerc(item.id) }}
                ></div>
              </div>
              <div className="tracker_weapon_wrapper_container_camocontainer">
                {item.camos.map((camo, index) => {
                  if (camo.id === 101 || camo.id === 102 || camo.id === 103) {
                    return (
                      <div
                        className={`tracker_weapon_wrapper_container_camocontainer_camo tracker_weapon_wrapper_container_camocontainer_master`}
                        data-title={getMasteryMission(item.id, index)}
                        key={camo.id}
                      >
                        <div
                          className="tracker_weapon_wrapper_container_camocontainer_camo_lock"
                          style={{ opacity: checkMastery(camo.id) }}
                        >
                          <LockIcon />
                        </div>
                        <img
                          className="tracker_weapon_wrapper_container_camocontainer_camo_img"
                          src={camo.img}
                          alt="camo_img"
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className="tracker_weapon_wrapper_container_camocontainer_camo"
                        onClick={() => setCamo(camo.id, index, i)}
                        key={camo.id}
                        data-title={getMission(item.id, index)}
                      >
                        <div
                          className="tracker_weapon_wrapper_container_camocontainer_camo_lock"
                          style={{
                            opacity: main[id_cat - 1].weapons[id_weap - 1]
                              .camos[id_mast][camo.id - 1]
                              ? 0
                              : 1,
                          }}
                        >
                          <LockIcon />
                        </div>
                        <img
                          className="tracker_weapon_wrapper_container_camocontainer_camo_img"
                          src={camo.img}
                          alt="camo_img"
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeaponPage;
