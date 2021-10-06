import React from "react";
import "../styles/mainPage.scss";
import { useSelector } from "react-redux";
import Header from "../components/headerComponent";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function MainPage() {
  const main = useSelector((state) => state.main);
  const app = useSelector((state) => state.app);

  function calcBase(id_mast) {
    let n = 0;
    let length = 0;
    main.forEach((categ) => {
      categ.weapons.forEach((weapon) => {
        if (!weapon.dlc) {
          n = n + weapon.camos[id_mast].filter(Boolean).length;
          length = length + weapon.camos[id_mast].length;
        }
      });
    });
    const percentage = (n / length) * 100;
    return parseFloat(percentage.toFixed(2));
  }

  function calcBaseDlc(id_mast) {
    let n = 0;
    let length = 0;
    main.forEach((categ) => {
      categ.weapons.forEach((weapon) => {
        n = n + weapon.camos[id_mast].filter(Boolean).length;
        length = length + weapon.camos[id_mast].length;
      });
    });
    const percentage = (n / length) * 100;
    return parseFloat(percentage.toFixed(2));
  }

  function calcStats(id_mast) {
    let numWeapons = 0;
    main.forEach((categ) => {
      categ.weapons.forEach(() => {
        ++numWeapons;
      });
    });

    let completedWeapons = 0;
    main.forEach((categ) => {
      categ.weapons.forEach((weapon) => {
        if (weapon.completed[id_mast]) {
          ++completedWeapons;
        }
      });
    });

    let leftWeapons = 0;
    leftWeapons = numWeapons - completedWeapons;

    switch (id_mast) {
      case "dm":
        return {
          weapons: numWeapons,
          completed: completedWeapons,
          left: leftWeapons,
        };
      case "da":
        return {
          weapons: numWeapons,
          completed: completedWeapons,
          left: leftWeapons,
        };
      default:
        return "Something wrong...";
    }
  }

  function calcTotal() {
    let numOfCamos = 0;
    let lengthOfCamos = 0;
    main.forEach((categ) => {
      categ.weapons.forEach((weapon) => {
        numOfCamos = numOfCamos + weapon.camos["dm"].filter(Boolean).length;
        lengthOfCamos = lengthOfCamos + weapon.camos["dm"].length;
        numOfCamos = numOfCamos + weapon.camos["da"].filter(Boolean).length;
        lengthOfCamos = lengthOfCamos + weapon.camos["da"].length;
      });
    });
    const percentage = (numOfCamos / lengthOfCamos) * 100;
    return parseFloat(percentage.toFixed(2));
  }

	function calcRightStats() {
		return "PLACEHOLDER"
	}

  function SmallProgressComponent(props) {
    return (
      <div className="tracker_main_right_circlecontainer">
        <div className="tracker_main_right_circlecontainer_wrapper">
          <CircularProgressbar
            className="tracker_main_right_circlecontainer_circle"
            value={props.value}
            styles={buildStyles({
              pathColor: props.color,
              trailColor: "#1f1f1f",
            })}
          />
          <div className="tracker_main_right_circlecontainer_perc">
            {props.value}%
          </div>
        </div>
        <div className="tracker_main_right_circlecontainer_text">
          <div className="tracker_main_right_circlecontainer_text_total">
            {calcRightStats(props.mast)}
          </div>
          <div className="tracker_main_right_circlecontainer_text_name">
            {props.mast}
            <br />
            {props.categ}
          </div>
        </div>
      </div>
    );
  }

  function LargeProgressComponent(props) {
    return (
      <CircularProgressbar
        className={"tracker_main_left_circle_" + props.id}
        strokeWidth={props.width}
        value={props.value}
        styles={buildStyles({
          pathColor: props.color,
          trailColor: "#1f1f1f",
        })}
      />
    );
  }

  return (
    <div
      className="tracker_container"
      style={{ marginLeft: app.isOpen ? "300px" : "0px" }}
    >
      <Header />
      <div className="tracker_main">
        <div className="tracker_main_left">
          <div className="tracker_main_left_circle">
            <LargeProgressComponent
              color="#9B5DE5"
              id={1}
              value={calcBase("dm")}
              width={2.5}
            />
            <LargeProgressComponent
              color="#14A76C"
              id={2}
              value={calcBaseDlc("dm")}
              width={3}
            />
            <LargeProgressComponent
              color="#00BBF9"
              id={3}
              value={calcBase("da")}
              width={3.5}
            />
            <LargeProgressComponent
              color="#FFC400"
              id={4}
              value={calcBaseDlc("da")}
              width={4.5}
            />
            <div className="tracker_main_left_circle_textcontainer">
              <div className="tracker_main_left_circle_textcontainer_perc">
                {calcTotal() + "%"}
              </div>
              <div className="tracker_main_left_circle_textcontainer_text">
                TOTAL
              </div>
            </div>
          </div>
          <div className="tracker_main_left_textcontainer">
            <div className="tracker_main_left_textcontainer_dm">
              DM ULTRA
              <br />
              WEAPONS - {calcStats("dm").weapons}
              <br />
              COMPLETED - {calcStats("dm").completed}
              <br />
              LEFT - {calcStats("dm").left}
            </div>
            <div className="tracker_main_left_textcontainer_da">
              DARK AETHER
              <br />
              WEAPONS - {calcStats("da").weapons}
              <br />
              COMPLETED - {calcStats("da").completed}
              <br />
              LEFT - {calcStats("da").left}
            </div>
          </div>
        </div>
        <div className="tracker_main_right">
          <SmallProgressComponent
            color="#9B5DE5"
            value={calcBase("dm")}
            mast="DM ULTRA"
            categ="BASE"
          />
          <SmallProgressComponent
            color="#14A76C"
            value={calcBaseDlc("dm")}
            mast="DM ULTRA"
            categ="BASE + DLC"
          />
          <SmallProgressComponent
            color="#00BBF9"
            value={calcBase("da")}
            mast="DARK AETHER"
            categ="BASE"
          />
          <SmallProgressComponent
            color="#FFC400"
            value={calcBaseDlc("da")}
            mast="DARK AETHER"
            categ="BASE + DLC"
          />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
