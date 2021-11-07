export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("vanguard");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializesState = JSON.stringify(state);
    localStorage.setItem("vanguard", serializesState);
  } catch (err) {
    console.error("saveState error", err);
  }
};
