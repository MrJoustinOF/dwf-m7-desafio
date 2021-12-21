import * as jwt from "jsonwebtoken";
import { initRouter } from "./router";
import { state } from "./state";

(function () {
  const root = document.querySelector(".root");

  // Get data from localstorage and save it in the state
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const user = jwt.verify(token, process.env.SECRET);

      state.setState({
        ...state.getState(),
        loged: true,
        user,
      });
    } catch (err) {
      console.error(err);
    }
  }

  initRouter(root);
})();
