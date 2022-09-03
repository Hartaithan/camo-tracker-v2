import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./redux";

ReactDOM.render(
  <Provider store={store}>
    <Router basename={`${process.env.PUBLIC_URL}/`}>
      <React.StrictMode>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1f1f1f",
              color: "#e4e4e4",
            },
          }}
        />
        <App />
      </React.StrictMode>
    </Router>
  </Provider>,
  document.getElementById("root")
);
