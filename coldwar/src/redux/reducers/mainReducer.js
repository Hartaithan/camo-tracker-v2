const mainReducer = (state = [], action) => {
  const baseNumWeapon = [5, 5, 4, 3, 3, 3, 2, 2, 1, 1];
  const selWeapon =
    action.id_cat && state[action.id_cat - 1].weapons[action.id_weap - 1];
  const selCategory = action.id_cat && state[action.id_cat - 1].weapons;
  let selArray = [];
  let n = 0;
  switch (action.type) {
    case "TOGGLE_CAMO":
      // CHANGING EXACT CAMO ON TRUE
      selArray = selWeapon.camos[action.id_mast];
      selArray[action.id_camo - 1] = !selArray[action.id_camo - 1];
      // CHANGING WEAPON ON COMPLETE IF ALL CAMOS TRUE
      if (selArray.filter(Boolean).length === selArray.length) {
        selWeapon.completed[action.id_mast] = true;
      } else {
        selWeapon.completed[action.id_mast] = false;
      }
      // CHANGING CATEGORY ON COMPLETE IF ALL WEAPONS TRUE
      selCategory.map((weapon) => {
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
      selWeapon.camos[action.id_mast] = new Array(35).fill(true);
      // CHANGING WEAPON ON COMPLETE IF ALL CAMOS TRUE
      if (selArray.filter(Boolean).length === selArray.length) {
        selWeapon.completed[action.id_mast] = true;
      } else {
        selWeapon.completed[action.id_mast] = false;
      }
      // CHANGING CATEGORY ON COMPLETE IF ALL WEAPONS TRUE
      selCategory.map((weapon) => {
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
      const currentArray = selWeapon.camos[action.id_mast];
      const completed = [true, true, true, true, true];
      switch (action.id_camo_cat) {
        case 1:
          Array.prototype.splice.apply(currentArray, [0, 5].concat(completed));
          break;
        case 2:
          Array.prototype.splice.apply(currentArray, [5, 5].concat(completed));
          break;
        case 3:
          Array.prototype.splice.apply(currentArray, [10, 5].concat(completed));
          break;
        case 4:
          Array.prototype.splice.apply(currentArray, [15, 5].concat(completed));
          break;
        case 5:
          Array.prototype.splice.apply(currentArray, [20, 5].concat(completed));
          break;
        case 6:
          Array.prototype.splice.apply(currentArray, [25, 5].concat(completed));
          break;
        case 7:
          Array.prototype.splice.apply(currentArray, [30, 5].concat(completed));
          break;
        default:
          console.info("TOGGLE_CAMO_CATEG default case");
      }
      // CHANGING WEAPON ON COMPLETE IF ALL CAMOS TRUE
      if (currentArray.filter(Boolean).length === currentArray.length) {
        selWeapon.completed[action.id_mast] = true;
      } else {
        selWeapon.completed[action.id_mast] = false;
      }
      // CHANGING CATEGORY ON COMPLETE IF ALL WEAPONS TRUE
      selCategory.map((weapon) => {
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
