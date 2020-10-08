import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Redirect } from "react-router-dom";
import { useAppContext } from "./libs/contextLib";
import axios from "axios";
export default function AddWorker() {
  const [src, setSrc] = useState("");
  const [dest, setDest] = useState("");
  const [protocol, setProtocol] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated] = useAppContext();

  const submit = () => {
    const config = {
      headers: { Authorization: `Bearer ${isAuthenticated.token}` },
    };
    axios
      .post(
        "http://localhost:5000/addrouting",
        { src: src, dest: dest, protocol: protocol },
        config
      )
      .then((res) => setSubmitted(true))
      .catch((err) => console.log(err));
  };
  if (submitted) {
    return <Redirect to="/" />;
  }
  if (!isAuthenticated.auth) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="src"
        onChange={(e) => setSrc(e.target.value)}
      />
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="dest"
        onChange={(e) => setDest(e.target.value)}
      />
      <TextField
        required
        id="standard-required"
        label="Required"
        defaultValue="protocol"
        onChange={(e) => setProtocol(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={submit}>
        submit
      </Button>
    </div>
  );
}
