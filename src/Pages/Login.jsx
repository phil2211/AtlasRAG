import React from 'react';
import * as Realm from "realm-web";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; // Import Box component for layout
import { useRealmApp } from "../RealmApp";

const Login = () => {
    const app = useRealmApp();
    const handleLogin = async () => {
        try {
            await app.logIn(Realm.Credentials.anonymous());
        } catch (e) {
            console.error("error logging in");
        }
    };

    return (
        <Box
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh" 
        >
          <Button
            variant="contained"
            onClick={handleLogin}
          >
            Login
          </Button>
        </Box>
    );
}

export default Login;
