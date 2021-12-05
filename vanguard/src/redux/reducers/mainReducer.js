const mainReducer = (state = [], action) => {
  const baseNumWeapon = [7, 6, 4, 4, 3, 3, 5, 4, 2];
  let selectedArray = [];
  let n = 0;
  switch (action.type) {
    case "TOGGLE_CAMO":
      // CHANGING EXACT CAMO ON TRUE
      selectedArray =
        state[action.id_cat - 1].weapons[action.id_weap - 1].camos[
          action.id_mast
        ];
      selectedArray[action.id_camo - 1] = !selectedArray[action.id_camo - 1];
      // CHANGING WEAPON ON COMPLETE IF ALL CAMOS TRUE
      if (selectedArray.filter(Boolean).length === selectedArray.length) {
        state[action.id_cat - 1].weapons[action.id_weap - 1].completed[
          action.id_mast
        ] = true;
      } else {
        state[action.id_cat - 1].weapons[action.id_weap - 1].completed[
          action.id_mast
        ] = false;
      }
      // CHANGING CATEGORY ON COMPLETE IF ALL WEAPONS TRUE
      state[action.id_cat - 1].weapons.map((weapon) => {
        if (weapon.dlc === false) {
          if (weapon.completed[action.id_mast] === true) {
            n++;
          }
        }
        return n;
      });
      if (n === baseNumWeapon[action.id_cat - 1]) {
        state[action.id_cat - 1].completed[action.id_mast] = true;
      } else {
        state[action.id_cat - 1].completed[action.id_mast] = false;
      }
      return [...state];
    case "TOGGLE_WEAPON":
      // CHANGING EXACT WEAPON ON TRUE
      state[action.id_cat - 1].weapons[action.id_weap - 1].camos[
        action.id_mast
      ] =
        action.id_cat === "8" || action.id_cat === "9"
          ? new Array(50).fill(true)
          : new Array(100).fill(true);
      // CHANGING WEAPON ON COMPLETE IF ALL CAMOS TRUE
      if (selectedArray.filter(Boolean).length === selectedArray.length) {
        state[action.id_cat - 1].weapons[action.id_weap - 1].completed[
          action.id_mast
        ] = true;
      } else {
        state[action.id_cat - 1].weapons[action.id_weap - 1].completed[
          action.id_mast
        ] = false;
      }
      // CHANGING CATEGORY ON COMPLETE IF ALL WEAPONS TRUE
      state[action.id_cat - 1].weapons.map((weapon) => {
        if (weapon.dlc === false) {
          if (weapon.completed[action.id_mast] === true) {
            n++;
          }
        }
        return n;
      });
      if (n === baseNumWeapon[action.id_cat - 1]) {
        state[action.id_cat - 1].completed[action.id_mast] = true;
      } else {
        state[action.id_cat - 1].completed[action.id_mast] = false;
      }
      return [...state];
    case "TOGGLE_CAMO_CATEG":
      const currArray =
        state[action.id_cat - 1].weapons[action.id_weap - 1].camos[
          action.id_mast
        ];
      const completed = new Array(10).fill(true);
      switch (action.id_camo_cat) {
        case 1:
          Array.prototype.splice.apply(currArray, [0, 10].concat(completed));
          break;
        case 2:
          Array.prototype.splice.apply(currArray, [10, 10].concat(completed));
          break;
        case 3:
          Array.prototype.splice.apply(currArray, [20, 10].concat(completed));
          break;
        case 4:
          Array.prototype.splice.apply(currArray, [30, 10].concat(completed));
          break;
        case 5:
          Array.prototype.splice.apply(currArray, [40, 10].concat(completed));
          break;
        case 6:
          Array.prototype.splice.apply(currArray, [50, 10].concat(completed));
          break;
        case 7:
          Array.prototype.splice.apply(currArray, [60, 10].concat(completed));
          break;
        case 8:
          Array.prototype.splice.apply(currArray, [70, 10].concat(completed));
          break;
        case 9:
          Array.prototype.splice.apply(currArray, [80, 10].concat(completed));
          break;
        case 10:
          Array.prototype.splice.apply(currArray, [90, 10].concat(completed));
          break;
        default:
          console.info("TOGGLE_CAMO_CATEG default case");
      }
      // CHANGING WEAPON ON COMPLETE IF ALL CAMOS TRUE
      if (currArray.filter(Boolean).length === currArray.length) {
        state[action.id_cat - 1].weapons[action.id_weap - 1].completed[
          action.id_mast
        ] = true;
      } else {
        state[action.id_cat - 1].weapons[action.id_weap - 1].completed[
          action.id_mast
        ] = false;
      }
      // CHANGING CATEGORY ON COMPLETE IF ALL WEAPONS TRUE
      state[action.id_cat - 1].weapons.map((weapon) => {
        if (weapon.dlc === false) {
          if (weapon.completed[action.id_mast] === true) {
            n++;
          }
        }
        return n;
      });
      if (n === baseNumWeapon[action.id_cat - 1]) {
        state[action.id_cat - 1].completed[action.id_mast] = true;
      } else {
        state[action.id_cat - 1].completed[action.id_mast] = false;
      }
      return [...state];
    case "SYNC_DATA":
      state = action.state;
      return state;
    default:
      return state;
  }
};

export default mainReducer;
