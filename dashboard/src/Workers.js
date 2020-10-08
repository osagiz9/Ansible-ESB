import Button from "@material-ui/core/Button";

import { useAppContext } from "./libs/contextLib";

import React, { useState, useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import { Redirect } from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [add, setAdd] = useState(false);

  const [isAuthenticated] = useAppContext();
  useEffect(() => {
    getWorkers();
  }, []);

  if (!isAuthenticated.auth) {
    return <Redirect to="/login" />;
  }
  if (add) {
    return <Redirect exact to="/add" />;
  }

  async function getWorkers() {
    if (isAuthenticated.auth && !add) {
      const config = {
        headers: { Authorization: `Bearer ${isAuthenticated.token}` },
      };
      axios
        .get("http://localhost:5000/routing", config)
        .then((res) => setWorkers(res.data))
        .catch((err) => console.log(err));
    }
  }

  function handleDelete(e, v) {
    let worker = workers.find((w) => w.id === parseInt(e.currentTarget.value));
    const config = {
      headers: { Authorization: `Bearer ${isAuthenticated.token}` },
    };
    axios
      .post("http://localhost:5000/deleterouting", { id: worker.id }, config)
      .then((res) => getWorkers())
      .catch((err) => console.log(err));
  }

  function addClick(add) {
    setAdd(add);
  }

  const WorkerView = (props) => (
    <div className="workers">
      <h1>
        src: {props.worker.src} dest: {props.worker.dest} protocol:{" "}
        {props.worker.protocol}
      </h1>

      <Button
        size="small"
        key={props.worker.id}
        value={props.worker.id}
        onClick={(e, v) => handleDelete(e, v)}
      >
        delete
      </Button>

      <br />
    </div>
  );

  let workersView = workers.map((worker) => (
    <WorkerView key={worker.id} worker={worker}></WorkerView>
  ));
  return (
    <div>
      <div>
        <IconButton aria-label="delete" onClick={() => addClick(true)}>
          <AddCircleOutlineIcon />
        </IconButton>
      </div>

      {workersView}
    </div>
  );
}
