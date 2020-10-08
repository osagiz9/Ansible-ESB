
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import { useAppContext } from "./libs/contextLib";

export default function Login() {
    const [isAuthenticated,userHasAuthenticated]  = useAppContext();

    const [username, setusername] = useState("")
    const [password, setPassword] = useState("")
    const submit = () => {

        axios.get('http://127.0.0.1:5000/api/token', {
            auth:{
            username: username,
            password: password
            }
        })
            .then(res => {
                userHasAuthenticated({auth:true,token:res.data.token});
                localStorage.setItem('token', res.data.token)
                console.log(res)
            }).catch(err=>console.log(err))
    }
    if(isAuthenticated.auth){
        return <Redirect to="/" />
    }
    return (
        <div>
            <TextField
             required id="standard-required"
              label="Required" 
              defaultValue="Hello World" 
              onChange={(e) => setusername(e.target.value)} />
            <TextField
                id="standard-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={submit}>
                submit
            </Button>
        </div>
    )

}