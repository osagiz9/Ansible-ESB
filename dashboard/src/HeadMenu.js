import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { Link } from "react-router-dom";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useAppContext } from "./libs/contextLib";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function HeadMenu() {
  const [isAuthenticated, userHasAuthenticated] = useAppContext();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  async function logout() {
    const config = {
      headers: { Authorization: `Bearer ${isAuthenticated.token}` },
    };
    axios
      .get(
        "http://localhost:5000/api/logout",

        config
      )
      .then((res) => {
        userHasAuthenticated({ auth: false, token: "" });
        localStorage.removeItem("token");
      })
      .catch((err) => console.log(err));
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              Open Menu
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Link to="/">
                <MenuItem onClick={handleClose}>Profile</MenuItem>
              </Link>
              <Link to="/about">
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Link>
              <Link to="/users">
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Link>
            </Menu>
          </div>

          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          {isAuthenticated.auth ? (
            <Button color="inherit" onClick={() => logout()}>
              logout
            </Button>
          ) : (
            <Link to="/login">
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
