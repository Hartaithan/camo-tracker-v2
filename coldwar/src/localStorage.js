export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("coldwar");
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);
    return { ...parsedState, app: { ...parsedState.app, isFirstUpdate: true } };
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializesState = JSON.stringify(state);
    localStorage.setItem("coldwar", serializesState);
  } catch (err) {
    console.error("saveState error", err);
  }
};
