import React, { useState, useEffect } from "react";

import axios from "axios";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import Login from "./Login.js";
import Workers from "./Workers.js";
import HeadMenu from "./HeadMenu.js";
import { AppContext } from "./libs/contextLib";
import AddWorker from "./addWorker";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState({
    auth: false,
    token: "",
  });

  async function checkToken() {
    if (!isAuthenticated.auth) {
      let token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .get("http://localhost:5000/checktoken", config)
        .then((res) => userHasAuthenticated({ auth: true, token: token }))
        .catch(userHasAuthenticated({ auth: false, token: "" }));
    }
  }
  useEffect(() => {
    checkToken();
  }, []);
  return (
    <div className="App">
      <AppContext.Provider value={[isAuthenticated, userHasAuthenticated]}>
        <Router>
          <HeadMenu />

          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/add">
              <AddWorker />
            </Route>
            <Route path="/">
              <Workers />
            </Route>
          </Switch>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
